#!/usr/bin/env node
// Notion(DEV-WIKI) -> content/*.md 동기화.
// "배포" 체크박스가 true인 페이지만 가져와 Markdown으로 변환하고,
// 더 이상 대상이 아닌 기존 동기화 산출물은 정리(reconciliation)한다.

import { Client } from "@notionhq/client";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;

if (!NOTION_TOKEN || !NOTION_DB_ID) {
  console.error(
    "[notion-sync] NOTION_TOKEN, NOTION_DB_ID 환경변수가 필요합니다."
  );
  process.exit(1);
}

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const ASSET_DIR = path.join(ROOT_DIR, "static", "notion-assets");

const PROP = {
  title: "이름",
  tags: "태그",
  category: "카테고리",
  publish: "배포",
  publishDate: "PublishDate",
  modifyDate: "ModifyDate",
  createDate: "CreateDate",
  version: "버전 정보",
  externalUrl: "관련 URL",
};

const notion = new Client({ auth: NOTION_TOKEN });

// ── Fixed category taxonomy ───────────────────────────────
// 카테고리는 Notion의 "카테고리" 속성이 아니라, 태그를 이 고정된
// 6개 카테고리로 분류해서 결정한다(사이트 구조를 고정하기 위함).
// weight는 홈/사이드바에 노출되는 순서.

const FIXED_CATEGORIES = [
  { name: "OS", slug: "os", description: "운영체제 관련 문서", weight: 1 },
  { name: "SERVER", slug: "server", description: "서버 인프라 관련 문서", weight: 2 },
  { name: "BACK-END", slug: "back-end", description: "백엔드 개발 관련 문서", weight: 3 },
  { name: "FRONT-END", slug: "front-end", description: "프론트엔드 개발 관련 문서", weight: 4 },
  { name: "DEV-OPS", slug: "dev-ops", description: "데브옵스/배포 관련 문서", weight: 5 },
  { name: "TECH", slug: "tech", description: "기술 전반에 대한 문서", weight: 6 },
];
// POSTS는 사이드바 "./categories" 목록에는 노출되지 않는 별도 대분류.
// Notion "카테고리" 속성 값이 "Post"인 페이지만 태그와 무관하게 여기로 분류된다.
const POST_CATEGORY = { name: "posts", slug: "posts", description: "", weight: 100 };
const ALL_CATEGORIES = [...FIXED_CATEGORIES, POST_CATEGORY];
const CATEGORY_BY_NAME = new Map(ALL_CATEGORIES.map((c) => [c.name, c]));
const CATEGORY_ORDER = FIXED_CATEGORIES.map((c) => c.name);

const TAG_TO_CATEGORY = {
  LINUX: "OS", MACOS: "OS", WINDOWS: "OS", SYNOLOGY: "OS",
  WEB: "SERVER", WAS: "SERVER", DB: "SERVER", NETWORK: "SERVER",
  SQL: "SERVER", MySQL: "SERVER", Oracle: "SERVER", Tibero: "SERVER", MongoDB: "SERVER",
  JAVA: "BACK-END", PHP: "BACK-END", PYTHON: "BACK-END", GO: "BACK-END",
  "Node.js": "BACK-END", SWIFT: "BACK-END",
  HTML: "FRONT-END", CSS: "FRONT-END", JS: "FRONT-END", REACTJS: "FRONT-END",
  MSA: "DEV-OPS", "GIT/SVN": "DEV-OPS", BASH: "DEV-OPS",
  TIP: "TECH", BLOCKCHAIN: "TECH", ISSUE: "TECH", ETC: "TECH", TIL: "TECH", DID: "TECH",
};

function deriveCategories(tags) {
  const matched = new Set();
  for (const tag of tags) {
    const category = TAG_TO_CATEGORY[tag];
    if (category) matched.add(category);
  }
  if (matched.size === 0) matched.add("TECH");
  return CATEGORY_ORDER.filter((name) => matched.has(name));
}

// ── Utilities ──────────────────────────────────────────────

function slugify(input, fallback) {
  const slug = String(input ?? "")
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/[/\\:*?"<>|#%]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || fallback;
}

function tomlString(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function tomlStringArray(values) {
  return `[${values.map(tomlString).join(", ")}]`;
}

async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

// ── Notion property extraction ────────────────────────────

function getTitle(props) {
  const rich = props[PROP.title]?.title ?? [];
  return rich.map((t) => t.plain_text).join("").trim();
}

function getMultiSelect(props, key) {
  return (props[key]?.multi_select ?? []).map((o) => o.name);
}

function getDateStart(props, key) {
  return props[key]?.date?.start ?? null;
}

function getPlainText(props, key) {
  const rich = props[key]?.rich_text ?? [];
  const text = rich.map((t) => t.plain_text).join("");
  return text.trim() || null;
}

function getUrl(props, key) {
  return props[key]?.url ?? null;
}

// ── Rich text -> inline Markdown ──────────────────────────

function escapeInline(text) {
  return text.replace(/[\\`*_[\]]/g, (c) => `\\${c}`);
}

function richTextToMarkdown(richText = []) {
  return richText
    .map((t) => {
      if (t.type === "equation") return `$${t.equation.expression}$`;
      let out = escapeInline(t.plain_text);
      const a = t.annotations ?? {};
      if (a.code) out = `\`${t.plain_text}\``;
      if (a.bold) out = `**${out}**`;
      if (a.italic) out = `*${out}*`;
      if (a.strikethrough) out = `~~${out}~~`;
      const href = t.href ?? t.text?.link?.url;
      if (href) out = `[${out}](${href})`;
      return out;
    })
    .join("");
}

// ── Callout color -> Hwaro admonition type ────────────────

function calloutAdmonition(color) {
  if (!color) return "NOTE";
  if (color.startsWith("red")) return "CAUTION";
  if (color.startsWith("yellow") || color.startsWith("orange")) return "WARNING";
  if (color.startsWith("green")) return "TIP";
  return "NOTE";
}

// ── Image download (Notion-hosted files expire; mirror locally) ──

const downloadedAssets = new Set();

async function mirrorImage(pageId, url) {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`[notion-sync] 이미지 다운로드 실패 (${res.status}): ${url}`);
    return url;
  }
  const contentType = res.headers.get("content-type") ?? "";
  const extFromType = contentType.split("/")[1]?.split(";")[0];
  const extFromUrl = path.extname(new URL(url).pathname).replace(".", "");
  const ext = (extFromType || extFromUrl || "png").toLowerCase();
  const dir = path.join(ASSET_DIR, pageId);
  await mkdir(dir, { recursive: true });
  const filename = `${downloadedAssets.size}.${ext}`;
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(dir, filename), buf);
  downloadedAssets.add(pageId);
  return `/notion-assets/${pageId}/${filename}`;
}

// ── Block tree -> Markdown ─────────────────────────────────

async function listChildren(blockId) {
  const blocks = [];
  let cursor;
  try {
    do {
      const res = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      });
      blocks.push(...res.results);
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
  } catch (err) {
    // 삭제된 child_page / 통합에 공유되지 않은 하위 블록은 건너뛴다.
    // 한 블록 때문에 전체 sync가 중단되면 운영 주기 갱신이 멈춘다.
    const code = err?.code ?? err?.body?.code;
    if (code === "object_not_found") {
      console.warn(
        `[notion-sync] 하위 블록 조회 실패(건너뜀): ${blockId} — ${err.message}`
      );
      return [];
    }
    throw err;
  }
  return blocks;
}

async function renderChildren(blocks, pageId, indent = "") {
  const out = [];
  let listBuffer = [];
  let listType = null;

  const flushList = () => {
    if (listBuffer.length) out.push(listBuffer.join("\n"));
    listBuffer = [];
    listType = null;
  };

  for (const block of blocks) {
    const type = block.type;
    const data = block[type] ?? {};
    const childBlocks = block.has_children ? await listChildren(block.id) : [];

    if (type !== "bulleted_list_item" && type !== "numbered_list_item") {
      flushList();
    }

    switch (type) {
      case "paragraph": {
        const text = richTextToMarkdown(data.rich_text);
        if (text) out.push(indent + text);
        break;
      }
      case "heading_1":
        out.push(`${indent}# ${richTextToMarkdown(data.rich_text)}`);
        break;
      case "heading_2":
        out.push(`${indent}## ${richTextToMarkdown(data.rich_text)}`);
        break;
      case "heading_3":
        out.push(`${indent}### ${richTextToMarkdown(data.rich_text)}`);
        break;
      case "bulleted_list_item": {
        listType = "bulleted";
        listBuffer.push(`${indent}- ${richTextToMarkdown(data.rich_text)}`);
        if (childBlocks.length) {
          listBuffer.push(await renderChildren(childBlocks, pageId, indent + "  "));
        }
        break;
      }
      case "numbered_list_item": {
        listType = "numbered";
        listBuffer.push(`${indent}1. ${richTextToMarkdown(data.rich_text)}`);
        if (childBlocks.length) {
          listBuffer.push(await renderChildren(childBlocks, pageId, indent + "   "));
        }
        break;
      }
      case "to_do": {
        const mark = data.checked ? "x" : " ";
        out.push(`${indent}- [${mark}] ${richTextToMarkdown(data.rich_text)}`);
        break;
      }
      case "code": {
        const lang = data.language && data.language !== "plain text" ? data.language : "";
        const code = data.rich_text.map((t) => t.plain_text).join("");
        out.push(`${indent}\`\`\`${lang}\n${code}\n${indent}\`\`\``);
        break;
      }
      case "quote": {
        const text = richTextToMarkdown(data.rich_text);
        out.push(
          text
            .split("\n")
            .map((line) => `${indent}> ${line}`)
            .join("\n")
        );
        break;
      }
      case "callout": {
        const admonition = calloutAdmonition(data.color);
        const text = richTextToMarkdown(data.rich_text);
        out.push(`${indent}> [!${admonition}]\n${indent}> ${text}`);
        break;
      }
      case "divider":
        out.push(`${indent}---`);
        break;
      case "image": {
        const img = data.type === "external" ? data.external.url : data.file.url;
        const src = data.type === "file" ? await mirrorImage(pageId, img) : img;
        const alt = richTextToMarkdown(data.caption) || "image";
        out.push(`${indent}![${alt}](${src})`);
        break;
      }
      case "bookmark":
      case "embed": {
        const url = data.url;
        const caption = richTextToMarkdown(data.caption) || url;
        out.push(`${indent}[${caption}](${url})`);
        break;
      }
      case "table": {
        const rows = childBlocks;
        const hasHeader = data.has_column_header;
        const lines = rows.map((row) =>
          row.table_row.cells.map((cell) => richTextToMarkdown(cell)).join(" | ")
        );
        if (lines.length) {
          const colCount = rows[0]?.table_row.cells.length ?? 0;
          const header = hasHeader ? lines[0] : Array(colCount).fill("").join(" | ");
          const sep = Array(colCount).fill("---").join(" | ");
          const body = hasHeader ? lines.slice(1) : lines;
          out.push([`${indent}| ${header} |`, `${indent}| ${sep} |`, ...body.map((l) => `${indent}| ${l} |`)].join("\n"));
        }
        break;
      }
      default: {
        if (childBlocks.length) {
          out.push(await renderChildren(childBlocks, pageId, indent));
        } else {
          console.warn(`[notion-sync] 지원하지 않는 블록 타입 건너뜀: ${type}`);
        }
      }
    }
  }
  flushList();
  return out.filter(Boolean).join("\n\n");
}

// ── Front matter ───────────────────────────────────────────

function buildFrontMatter(page) {
  const lines = ["+++"];
  lines.push(`title = ${tomlString(page.title)}`);
  if (page.date) lines.push(`date = ${tomlString(page.date)}`);
  if (page.updated) lines.push(`updated = ${tomlString(page.updated)}`);
  lines.push(`categories = ${tomlStringArray(page.categories)}`);
  lines.push(`tags = ${tomlStringArray(page.tags)}`);
  lines.push(`toc = true`);
  lines.push("");
  lines.push("[extra]");
  lines.push(`source = "notion"`);
  lines.push(`notion_id = ${tomlString(page.id)}`);
  lines.push(`notion_url = ${tomlString(page.url)}`);
  if (page.version) lines.push(`version = ${tomlString(page.version)}`);
  if (page.externalUrl) lines.push(`external_url = ${tomlString(page.externalUrl)}`);
  lines.push("+++");
  return lines.join("\n");
}

// ── Existing synced-file scan (for reconciliation) ────────

async function findMarkdownFiles(dir) {
  const found = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await findMarkdownFiles(full)));
    } else if (entry.name.endsWith(".md")) {
      found.push(full);
    }
  }
  return found;
}

function parseNotionMarker(content) {
  const sourceMatch = content.match(/^\s*source\s*=\s*"([^"]*)"/m);
  const idMatch = content.match(/^\s*notion_id\s*=\s*"([^"]*)"/m);
  if (sourceMatch?.[1] === "notion" && idMatch?.[1]) {
    return idMatch[1];
  }
  return null;
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log("[notion-sync] Notion 데이터소스를 확인합니다...");
  const db = await notion.databases.retrieve({ database_id: NOTION_DB_ID });
  const dataSourceId = db.data_sources?.[0]?.id;
  if (!dataSourceId) {
    console.error("[notion-sync] 데이터베이스에서 data source를 찾을 수 없습니다.");
    process.exit(1);
  }

  console.log("[notion-sync] 고정 카테고리 섹션을 갱신합니다...");
  for (const cat of ALL_CATEGORIES) {
    const indexPath = path.join(CONTENT_DIR, cat.slug, "_index.md");
    await mkdir(path.dirname(indexPath), { recursive: true });
    const indexMd = `+++\ntitle = ${tomlString(cat.name)}\ndescription = ${tomlString(cat.description)}\nsort_by = "date"\nweight = ${cat.weight}\n\n[extra]\nsource = "fixed-category"\n+++\n`;
    await writeFile(indexPath, indexMd, "utf8");
  }

  console.log("[notion-sync] '배포' == true 페이지를 조회합니다...");
  const pages = [];
  let cursor;
  do {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      filter: { property: PROP.publish, checkbox: { equals: true } },
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  console.log(`[notion-sync] 대상 페이지 ${pages.length}건.`);

  // 1) 속성 추출 + 경로 계산
  const usedPaths = new Set();
  const desired = [];
  for (const page of pages) {
    const props = page.properties;
    const title = getTitle(props) || "(제목 없음)";
    const tags = getMultiSelect(props, PROP.tags);
    const noteCategory = getMultiSelect(props, PROP.category);
    const categories = noteCategory.includes("Post") ? ["posts"] : deriveCategories(tags);
    const date =
      getDateStart(props, PROP.publishDate) ??
      props[PROP.createDate]?.created_time ??
      null;
    const updated = props[PROP.modifyDate]?.last_edited_time ?? null;
    const version = getPlainText(props, PROP.version);
    const externalUrl = getUrl(props, PROP.externalUrl);

    const categoryDir = CATEGORY_BY_NAME.get(categories[0]).slug;
    let slug = slugify(title, page.id.slice(0, 8));
    let relPath = path.join(categoryDir, `${slug}.md`);
    if (usedPaths.has(relPath)) {
      slug = `${slug}-${page.id.slice(0, 8)}`;
      relPath = path.join(categoryDir, `${slug}.md`);
    }
    usedPaths.add(relPath);

    desired.push({
      id: page.id,
      url: page.url,
      title,
      categories,
      tags,
      date,
      updated,
      version,
      externalUrl,
      categoryDir,
      relPath,
    });
  }

  // 2) 기존 동기화 산출물 스캔 (reconciliation 대상 파악)
  const existingFiles = await findMarkdownFiles(CONTENT_DIR);
  const existingByNotionId = new Map();
  for (const file of existingFiles) {
    const content = await readFile(file, "utf8");
    const notionId = parseNotionMarker(content);
    if (notionId) existingByNotionId.set(notionId, file);
  }

  const desiredIds = new Set(desired.map((p) => p.id));

  // 3) 더 이상 대상이 아니거나 경로가 바뀐 기존 동기화 파일 삭제
  let removed = 0;
  for (const [notionId, file] of existingByNotionId) {
    const stillDesired = desired.find((p) => p.id === notionId);
    const targetAbsPath = stillDesired ? path.join(CONTENT_DIR, stillDesired.relPath) : null;
    if (!stillDesired || path.resolve(file) !== path.resolve(targetAbsPath)) {
      await rm(file);
      removed++;
    }
  }
  // 더 이상 참조되지 않는 notion-assets 정리
  if (await pathExists(ASSET_DIR)) {
    const assetDirs = await readdir(ASSET_DIR, { withFileTypes: true });
    for (const entry of assetDirs) {
      if (entry.isDirectory() && !desiredIds.has(entry.name)) {
        await rm(path.join(ASSET_DIR, entry.name), { recursive: true, force: true });
      }
    }
  }

  // 4) 콘텐츠 렌더링 및 기록
  let written = 0;
  let failed = 0;
  for (const page of desired) {
    try {
      const blocks = await listChildren(page.id);
      const body = await renderChildren(blocks, page.id);
      const md = `${buildFrontMatter(page)}\n\n${body}\n`;
      const absPath = path.join(CONTENT_DIR, page.relPath);
      await mkdir(path.dirname(absPath), { recursive: true });
      await writeFile(absPath, md, "utf8");
      written++;
    } catch (err) {
      failed++;
      console.warn(
        `[notion-sync] 페이지 동기화 실패(건너뜀): ${page.title} (${page.id}) — ${err.message}`
      );
    }
  }

  console.log(
    `[notion-sync] 완료: ${written}건 동기화, ${removed}건 정리(reconciliation)${failed ? `, ${failed}건 실패(건너뜀)` : ""}.`
  );
}

main().catch((err) => {
  console.error("[notion-sync] 실패:", err.message);
  process.exit(1);
});
