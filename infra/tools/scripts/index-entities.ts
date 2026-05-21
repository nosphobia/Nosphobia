/**
 * index-entities.ts — 사상체 목록 자동 인덱싱 도구
 *
 * 사용법:
 *   node --loader ts-node/esm scripts/index-entities.ts
 *
 * 동작:
 *   - docs/entities/ 의 모든 사상체_*.md 파일을 스캔
 *   - 각 파일의 frontmatter를 읽어 메타데이터 추출
 *   - docs/entities/사상체_목록.md 를 완전 재생성
 *   - archive/ 하위 폴더는 스캔하지 않음
 */

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

// ── 경로 설정 ──────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../../..");
const ENTITIES_DIR = path.join(PROJECT_ROOT, "docs/entities");
const INDEX_FILE = path.join(ENTITIES_DIR, "사상체_목록.md");

// ── YAML 엔진 (날짜 변환 방지) ────────────────────────────────────────────

const YAML_ENGINE = {
  parse: (s: string) =>
    yaml.load(s, { schema: yaml.JSON_SCHEMA }) as Record<string, unknown>,
  stringify: (obj: unknown) => yaml.dump(obj, { schema: yaml.JSON_SCHEMA }),
};

// ── 타입 ──────────────────────────────────────────────────────────────────

interface EntityEntry {
  fileName: string;
  name: string;
  id: string;
  dangerLevel: string;
  primaryAnomaly: string;
  secondaryAnomaly: string;
  securityLevel: string;
  status: string;
  lastUpdated: string;
}

// ── 헬퍼 ──────────────────────────────────────────────────────────────────

function str(v: unknown): string {
  if (v === null || v === undefined) return "—";
  const s = String(v).trim();
  return s === "" ? "—" : s;
}

function sortKey(entry: EntityEntry): string {
  // 식별코드에서 순서코드(4자리 숫자) 추출해서 정렬
  const match = entry.id.match(/(\d{4})$/);
  return match ? match[1] : entry.id;
}

// ── 메인 ──────────────────────────────────────────────────────────────────

async function main() {
  // docs/entities/ 파일 목록 (archive 제외)
  let entries: string[];
  try {
    entries = await fs.readdir(ENTITIES_DIR);
  } catch {
    console.error(`오류: ${ENTITIES_DIR} 폴더를 읽을 수 없습니다.`);
    process.exit(1);
  }

  const entityFiles = entries.filter(
    (f) => f.startsWith("사상체_") && f.endsWith(".md") && f !== "사상체_목록.md"
  );

  if (entityFiles.length === 0) {
    console.warn("경고: docs/entities/ 에 사상체 문서가 없습니다.");
  }

  console.log(`스캔 대상: ${entityFiles.length}개 파일`);

  const entityList: EntityEntry[] = [];

  for (const fileName of entityFiles) {
    const filePath = path.join(ENTITIES_DIR, fileName);
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = matter(raw, { engines: { yaml: YAML_ENGINE } });
    const d = parsed.data as Record<string, unknown>;

    entityList.push({
      fileName,
      name: str(d["사상체 명칭"]),
      id: str(d["식별코드"]),
      dangerLevel: str(d["위험 등급"]),
      primaryAnomaly: str(d["주요 변칙성"]),
      secondaryAnomaly: str(d["부차 변칙성"]),
      securityLevel: str(d["보안 등급"]),
      status: str(d["상태"]),
      lastUpdated: str(d["최종 갱신"]),
    });

    console.log(`  읽음: ${fileName} (${str(d["사상체 명칭"])})`);
  }

  // 순서코드 기준 정렬
  entityList.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  // 목록 마크다운 생성
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push("---");
  lines.push("문서: 사상체_목록");
  lines.push(`최종 갱신: ${today}`);
  lines.push("생성 방식: index-entities.ts 자동 생성 (수동 편집 불가 — 덮어쓰기됨)");
  lines.push("---");
  lines.push("");
  lines.push("# 사상체 목록");
  lines.push("");
  lines.push(`*자동 생성 — ${today} 기준. 수동 편집 시 다음 실행에서 덮어쓰임.*`);
  lines.push("");
  lines.push(
    "| 식별코드 | 명칭 | 위험 등급 | 주요 변칙성 | 부차 변칙성 | 보안 등급 | 상태 | 최종 갱신 |"
  );
  lines.push("|---|---|:---:|:---:|:---:|:---:|---|---|");

  for (const e of entityList) {
    const link = `[${e.name}](${e.fileName})`;
    lines.push(
      `| ${e.id} | ${link} | ${e.dangerLevel} | ${e.primaryAnomaly} | ${e.secondaryAnomaly} | ${e.securityLevel} | ${e.status} | ${e.lastUpdated} |`
    );
  }

  lines.push("");
  lines.push(`*총 ${entityList.length}건*`);
  lines.push("");

  const output = lines.join("\n");
  await fs.writeFile(INDEX_FILE, output, "utf-8");

  console.log(`\n목록 저장: docs/entities/사상체_목록.md (${entityList.length}건)`);
}

main().catch((err) => {
  console.error("오류:", err);
  process.exit(1);
});
