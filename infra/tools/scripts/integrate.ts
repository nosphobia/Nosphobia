/**
 * integrate.ts — 사상체 항목 통합 도구
 *
 * 사용법:
 *   node --loader ts-node/esm scripts/integrate.ts <순서코드> [버전]
 *
 * 예:
 *   node --loader ts-node/esm scripts/integrate.ts 0341
 *   node --loader ts-node/esm scripts/integrate.ts 0341 v0.7
 *
 * 동작:
 *   1. docs/working/<순서코드>/ 의 5개 항목 파일을 고정 순서로 결합
 *   2. frontmatter는 <순서코드>_개요.md 에서 추출, 버전 자동 증가 (또는 지정)
 *   3. docs/entities/사상체_<명칭>_<버전>.md 로 저장
 *   4. docs/working/<순서코드>/ 폴더는 그대로 유지 (삭제는 /doc-ig 명령어가 결정)
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

// ── 항목 순서 (고정) ───────────────────────────────────────────────────────

const SECTION_ORDER = [
  "개요",
  "변칙현상",
  "격리절차",
  "대응지침",
  "사건기록",
] as const;

// ── 헬퍼 ──────────────────────────────────────────────────────────────────

const YAML_ENGINE = {
  parse: (s: string) =>
    yaml.load(s, { schema: yaml.JSON_SCHEMA }) as Record<string, unknown>,
  stringify: (obj: unknown) => yaml.dump(obj, { schema: yaml.JSON_SCHEMA }),
};

function bumpVersion(current: string): string {
  // "v0.6" → "v0.7", "v1.9" → "v1.10"
  const match = current.match(/^v(\d+)\.(\d+)$/);
  if (!match) return current;
  return `v${match[1]}.${parseInt(match[2]) + 1}`;
}

async function findLatestArchiveVersion(name: string): Promise<string | null> {
  let entries: string[];
  try {
    entries = await fs.readdir(ARCHIVE_DIR);
  } catch {
    return null;
  }

  const prefix = `사상체_${name}_v`;
  const versions = entries
    .filter((f) => f.startsWith(prefix) && f.endsWith(".md"))
    .map((f) => {
      const m = f.match(/v(\d+)\.(\d+)\.md$/);
      return m ? { major: parseInt(m[1]), minor: parseInt(m[2]) } : null;
    })
    .filter(Boolean) as { major: number; minor: number }[];

  if (versions.length === 0) return null;

  versions.sort((a, b) =>
    a.major !== b.major ? b.major - a.major : b.minor - a.minor
  );
  return `v${versions[0].major}.${versions[0].minor}`;
}

// ── 메인 ──────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(
      "사용법: node --loader ts-node/esm scripts/integrate.ts <순서코드> [버전]"
    );
    process.exit(1);
  }

  const orderCode = args[0];
  const specifiedVersion = args[1] ?? null;

  if (!/^\d{4}$/.test(orderCode)) {
    console.error(`오류: 순서코드는 4자리 숫자여야 합니다 — ${orderCode}`);
    process.exit(1);
  }

  const workingSubDir = path.join(WORKING_DIR, orderCode);

  // 폴더 존재 확인
  try {
    await fs.access(workingSubDir);
  } catch {
    console.error(`오류: 작업 폴더를 찾을 수 없습니다 — ${workingSubDir}`);
    process.exit(1);
  }

  // 개요 파일에서 frontmatter와 명칭 추출
  const overviewPath = path.join(workingSubDir, `${orderCode}_개요.md`);
  let overviewRaw: string;
  try {
    overviewRaw = await fs.readFile(overviewPath, "utf-8");
  } catch {
    console.error(`오류: 개요 파일을 찾을 수 없습니다 — ${overviewPath}`);
    process.exit(1);
  }

  const parsedOverview = matter(overviewRaw, { engines: { yaml: YAML_ENGINE } });
  const frontmatter = parsedOverview.data;
  const rawFrontmatter: string =
    (parsedOverview as unknown as { matter: string }).matter ?? "";

  const entityName: string = (frontmatter["사상체 명칭"] as string) ?? "";
  if (!entityName) {
    console.error(
      `오류: 개요 파일의 frontmatter에서 '사상체 명칭' 필드를 찾을 수 없습니다.`
    );
    process.exit(1);
  }

  console.log(`통합 시작 — 순서코드: ${orderCode}, 사상체: ${entityName}`);

  // 개요 본문 전체 (frontmatter 제거 후). "# APMB 사상체 문서" 헤더 포함.
  const overviewContent = parsedOverview.content.trimStart();

  // 나머지 4개 항목 파일 읽기
  const sectionContents: Record<string, string> = {};
  sectionContents["개요"] = overviewContent;

  for (const key of SECTION_ORDER.slice(1)) {
    const filePath = path.join(workingSubDir, `${orderCode}_${key}.md`);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      sectionContents[key] = content.trimEnd();
    } catch {
      console.warn(`경고: ${key} 파일을 찾을 수 없습니다 — 빈 내용으로 처리`);
      sectionContents[key] = "";
    }
  }

  // 같은 사상체의 기존 파일이 있으면 모두 archive로 이동 (버전 무관)
  // 버전 결정보다 먼저 실행해야 archive 최고 버전이 정확히 반영됨
  await fs.mkdir(ENTITIES_DIR, { recursive: true });
  const allEntries = await fs.readdir(ENTITIES_DIR);
  const existingFiles = allEntries.filter(
    (f) => f.startsWith(`사상체_${entityName}_`) && f.endsWith(".md")
  );
  if (existingFiles.length > 0) {
    await fs.mkdir(ARCHIVE_DIR, { recursive: true });
    for (const f of existingFiles) {
      const src = path.join(ENTITIES_DIR, f);
      const dest = path.join(ARCHIVE_DIR, f);
      await fs.rename(src, dest);
      console.log(`기존 파일 archive로 이동: ${f}`);
    }
  }

  // 버전 결정 (기존 파일 archive 이동 이후 — 최신 archive 버전 기준)
  let version: string;
  if (specifiedVersion) {
    version = specifiedVersion;
  } else {
    const latestArchive = await findLatestArchiveVersion(entityName);
    const currentVersion = (frontmatter["버전"] as string) ?? "v0.0";
    version = latestArchive ? bumpVersion(latestArchive) : bumpVersion(currentVersion);
  }

  console.log(`버전: ${version}`);

  // 버전 갱신된 frontmatter 블록 생성
  const updatedFrontmatter = rawFrontmatter
    .trim()
    .replace(/^버전:.*$/m, `버전: ${version}`)
    .replace(/^최종 갱신:.*$/m, `최종 갱신: ${new Date().toISOString().slice(0, 10)}`);

  // 통합본 조립
  // 개요 파일에 이미 "# APMB 사상체 문서" 헤더와 "## 개요" 내용이 있고,
  // 각 항목 파일은 "## 항목명" 헤더로 시작하며 끝에 "---" 구분선을 포함한다.
  // 따라서 frontmatter + 개요본문 + 나머지 항목들을 순서대로 이어붙이기만 한다.
  const parts: string[] = [];
  parts.push(`---\n${updatedFrontmatter}\n---`);
  parts.push("");
  // 개요 본문에 이미 "# APMB 사상체 문서", "## 개요", "---" 구분선 포함
  parts.push(sectionContents["개요"].trimEnd());

  for (const key of ["변칙현상", "격리절차", "대응지침", "사건기록"] as const) {
    const content = sectionContents[key];
    if (content) {
      parts.push("");
      parts.push(content.trimEnd());
    }
  }

  parts.push("");

  const integrated = parts.join("\n");

  const outputFileName = `사상체_${entityName}_${version}.md`;
  const outputPath = path.join(ENTITIES_DIR, outputFileName);

  await fs.writeFile(outputPath, integrated, "utf-8");
  console.log(`통합본 저장: docs/entities/${outputFileName}`);
  console.log(`\n완료.`);
}

main().catch((err) => {
  console.error("오류:", err);
  process.exit(1);
});
