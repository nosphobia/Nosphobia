/**
 * decompose.ts — 사상체 문서 분해 도구
 *
 * 사용법:
 *   node --loader ts-node/esm scripts/decompose.ts <문서경로> [순서코드]
 *
 * 예:
 *   node --loader ts-node/esm scripts/decompose.ts ../../docs/entities/사상체_노스포비아_v0.6.md
 *   node --loader ts-node/esm scripts/decompose.ts ../../docs/entities/사상체_노스포비아_v0.6.md 0341
 *
 * 동작:
 *   1. 사상체 문서를 5개 항목 파일로 분해
 *   2. docs/working/<순서코드>/ 폴더 생성
 *   3. 5개 항목 파일 + 5개 빈 피드백 파일 작성
 *   4. 원본 문서를 docs/entities/archive/ 로 이동
 */

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

// ── 경로 설정 ──────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../../..");
const ENTITIES_DIR = path.join(PROJECT_ROOT, "docs/entities");
const WORKING_DIR = path.join(PROJECT_ROOT, "docs/working");
const ARCHIVE_DIR = path.join(ENTITIES_DIR, "archive");

// ── 항목 정의 ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { key: "개요", header: "## 개요" },
  { key: "변칙현상", header: "## 변칙 현상" },
  { key: "격리절차", header: "## 격리 절차" },
  { key: "대응지침", header: "## 대응 지침" },
  { key: "사건기록", header: "## 사건 기록" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

// ── 헬퍼 ──────────────────────────────────────────────────────────────────

function extractOrderCode(filePath: string): string {
  const basename = path.basename(filePath);
  // 파일명에서 4자리 숫자 추출 (예: 사상체_노스포비아_v0.6.md → frontmatter에서)
  const match = basename.match(/(\d{4})/);
  return match ? match[1] : "";
}

function splitIntoSections(
  body: string
): Record<SectionKey, string> {
  const result: Partial<Record<SectionKey, string>> = {};

  // 각 H2 헤더의 위치를 찾아 분리
  // frontmatter 이후 첫 H1(# APMB 사상체 문서)은 제외
  const headerPositions: { key: SectionKey; start: number }[] = [];

  for (const section of SECTIONS) {
    // 줄 시작에서 정확히 매칭되는 헤더만
    const regex = new RegExp(`^${escapeRegex(section.header)}\\s*$`, "m");
    const match = regex.exec(body);
    if (match !== null) {
      headerPositions.push({ key: section.key, start: match.index });
    }
  }

  // 위치 순으로 정렬
  headerPositions.sort((a, b) => a.start - b.start);

  for (let i = 0; i < headerPositions.length; i++) {
    const { key, start } = headerPositions[i];
    const end =
      i + 1 < headerPositions.length
        ? headerPositions[i + 1].start
        : body.length;

    result[key] = body.slice(start, end).trimEnd();
  }

  return result as Record<SectionKey, string>;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFeedbackTemplate(sectionKey: string, orderCode: string): string {
  return `# ${sectionKey} 피드백 (순서코드: ${orderCode})

## 처리 대기

## 처리 완료
`;
}

// ── 메인 ──────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(
      "사용법: node --loader ts-node/esm scripts/decompose.ts <문서경로> [순서코드]"
    );
    process.exit(1);
  }

  const docPath = path.resolve(args[0]);
  let orderCode = args[1] ?? "";

  // 파일 존재 확인
  try {
    await fs.access(docPath);
  } catch {
    console.error(`오류: 파일을 찾을 수 없습니다 — ${docPath}`);
    process.exit(1);
  }

  const raw = await fs.readFile(docPath, "utf-8");
  // JSON_SCHEMA 사용으로 날짜 자동 변환 방지
  const parsed = matter(raw, {
    engines: {
      yaml: {
        parse: (s: string) =>
          yaml.load(s, { schema: yaml.JSON_SCHEMA }) as Record<string, unknown>,
        stringify: (obj: unknown) => yaml.dump(obj, { schema: yaml.JSON_SCHEMA }),
      },
    },
  });
  const frontmatter = parsed.data;
  // 원본 frontmatter 문자열 (--- ... --- 사이의 원문) 보존
  const rawFrontmatter: string = (parsed as unknown as { matter: string }).matter ?? "";
  const body = parsed.content;

  // 순서코드 결정: 인자 > frontmatter 식별코드에서 추출 > 파일명에서 추출
  if (!orderCode) {
    const idCode: string = frontmatter["식별코드"] as string ?? "";
    const match = idCode.match(/(\d{4})$/);
    if (match) {
      orderCode = match[1];
    } else {
      orderCode = extractOrderCode(docPath);
    }
  }

  if (!orderCode || !/^\d{4}$/.test(orderCode)) {
    console.error(
      `오류: 유효한 순서코드(4자리 숫자)를 확인할 수 없습니다. 인자로 직접 지정하십시오.`
    );
    process.exit(1);
  }

  console.log(`분해 시작 — 순서코드: ${orderCode}`);

  // 섹션 분리
  const sections = splitIntoSections(body);

  const missingKeys = SECTIONS.filter((s) => !sections[s.key]).map(
    (s) => s.key
  );
  if (missingKeys.length > 0) {
    console.warn(`경고: 다음 항목을 찾지 못했습니다 — ${missingKeys.join(", ")}`);
  }

  // working 폴더 생성
  const workingSubDir = path.join(WORKING_DIR, orderCode);
  await fs.mkdir(workingSubDir, { recursive: true });
  console.log(`폴더 생성: ${workingSubDir}`);

  // 원본 frontmatter 그대로 보존 (날짜 등 형식 손상 방지)
  const frontmatterBlock = `---\n${rawFrontmatter.trim()}\n---\n`;

  // 5개 항목 파일 작성
  for (const { key } of SECTIONS) {
    const content = sections[key] ?? "";
    const fileContent =
      key === "개요"
        ? frontmatterBlock + "\n# APMB 사상체 문서\n\n" + content + "\n"
        : content
        ? content + "\n"
        : `## ${key === "변칙현상" ? "변칙 현상" : key === "격리절차" ? "격리 절차" : key === "대응지침" ? "대응 지침" : key === "사건기록" ? "사건 기록" : key}\n\n(내용 없음)\n`;

    const filePath = path.join(workingSubDir, `${orderCode}_${key}.md`);
    await fs.writeFile(filePath, fileContent, "utf-8");
    console.log(`  작성: ${path.basename(filePath)}`);
  }

  // 5개 빈 피드백 파일 작성
  for (const { key } of SECTIONS) {
    const filePath = path.join(workingSubDir, `${orderCode}_${key}_fb.md`);
    await fs.writeFile(filePath, buildFeedbackTemplate(key, orderCode), "utf-8");
    console.log(`  작성: ${path.basename(filePath)}`);
  }

  // 원본 문서를 archive로 이동
  await fs.mkdir(ARCHIVE_DIR, { recursive: true });
  const archiveDest = path.join(ARCHIVE_DIR, path.basename(docPath));
  await fs.rename(docPath, archiveDest);
  console.log(`원본 이동: ${path.basename(docPath)} → entities/archive/`);

  console.log(`\n완료. docs/working/${orderCode}/ 에 10개 파일이 생성되었습니다.`);
}

main().catch((err) => {
  console.error("오류:", err);
  process.exit(1);
});
