/**
 * validate.ts — 사상체 문서 정합성 검증 도구
 *
 * 사용법:
 *   node --loader ts-node/esm scripts/validate.ts <순서코드>
 *   node --loader ts-node/esm scripts/validate.ts --file <통합본 경로>
 *
 * 예:
 *   node --loader ts-node/esm scripts/validate.ts 0341
 *   node --loader ts-node/esm scripts/validate.ts --file ../../docs/entities/사상체_노스포비아_v0.6.md
 *
 * 동작:
 *   - 자동 검증 가능 항목: 실패 시 FAIL 출력
 *   - 자동 검증 불가 항목: 경고(WARN) 출력 (LLM 판단 필요)
 *   - 종료 코드: 0 = 모두 통과, 1 = 하나 이상 FAIL
 */

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";

// ── 경로 설정 ──────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../../..");
const WORKING_DIR = path.join(PROJECT_ROOT, "docs/working");

// ── 타입 ──────────────────────────────────────────────────────────────────

type Severity = "PASS" | "FAIL" | "WARN";

interface CheckResult {
  label: string;
  severity: Severity;
  message: string;
}

// ── YAML 엔진 (날짜 변환 방지) ────────────────────────────────────────────

const YAML_ENGINE = {
  parse: (s: string) =>
    yaml.load(s, { schema: yaml.JSON_SCHEMA }) as Record<string, unknown>,
  stringify: (obj: unknown) => yaml.dump(obj, { schema: yaml.JSON_SCHEMA }),
};

// ── 검증 함수들 ───────────────────────────────────────────────────────────

// [자동] frontmatter 12 필드 충족 여부 (§6.1.1)
function checkFrontmatter(data: Record<string, unknown>): CheckResult {
  const REQUIRED_FIELDS = [
    "문서 유형",
    "사상체 명칭",
    "식별코드",
    "위험 등급",
    "주요 변칙성",
    "보안 등급",
    "버전",
    "최종 갱신",
    "상태",
    "참고 문서",
  ];
  const missing = REQUIRED_FIELDS.filter(
    (f) => !data[f] || String(data[f]).trim() === ""
  );

  if (missing.length > 0) {
    return {
      label: "frontmatter 필수 필드",
      severity: "FAIL",
      message: `누락된 필드: ${missing.join(", ")}`,
    };
  }

  // 문서 유형 고정값 확인
  if (data["문서 유형"] !== "사상체 문서") {
    return {
      label: "frontmatter 필수 필드",
      severity: "FAIL",
      message: `'문서 유형' 필드가 '사상체 문서'가 아님: ${data["문서 유형"]}`,
    };
  }

  return {
    label: "frontmatter 필수 필드",
    severity: "PASS",
    message: "10개 필수 필드 모두 존재",
  };
}

// [자동] 본문 4항목 중 최소 1개 존재 여부
function checkBodySections(body: string): CheckResult {
  const SECTION_HEADERS = [
    "## 변칙 현상",
    "## 격리 절차",
    "## 대응 지침",
    "## 사건 기록",
  ];
  const found = SECTION_HEADERS.filter((h) =>
    new RegExp(`^${h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m").test(body)
  );

  if (found.length === 0) {
    return {
      label: "본문 4항목 최소 1개",
      severity: "FAIL",
      message: "변칙 현상 / 격리 절차 / 대응 지침 / 사건 기록 중 어느 항목도 존재하지 않음",
    };
  }

  return {
    label: "본문 4항목 최소 1개",
    severity: "PASS",
    message: `존재하는 항목: ${found.map((h) => h.replace("## ", "")).join(", ")}`,
  };
}

// [자동] ~요 체 미사용 여부 (§6.5)
function checkNoYoForm(body: string): CheckResult {
  // "습니다요." 나 "~아요." "~어요." 처럼 종결어미 ~요 패턴
  // "주요", "이요" 같은 단어 내부 요는 제외 → 앞에 어미가 붙는 패턴만 탐색
  // 종결어미 패턴: 동사/형용사 어간 + (아|어|이|죠|네요|군요|겠어요 등)요[.?!]
  const yoPattern = /[아어이죠네군겠]\s*요\s*[.?!]/g;
  const matches = body.match(yoPattern);

  if (matches && matches.length > 0) {
    return {
      label: "~요 체 미사용",
      severity: "FAIL",
      message: `~요 체 ${matches.length}건 발견 (사건 기록 내 인용 발화라면 무시 가능)`,
    };
  }

  return {
    label: "~요 체 미사용",
    severity: "PASS",
    message: "~요 체 미발견",
  };
}

// [자동] 영단어 배제 원칙 — 시스템 명시 대상 잔존 여부 (§6.5.2)
function checkNoEnglishWords(body: string): CheckResult {
  // 명시적 대체 대상 (§6.5.2 표)
  // "[데이터 말소]", "[데이터 보류]" 같은 검열 토큰 내부는 제외
  const stripped = body.replace(/\[[^\]]*데이터[^\]]*\]/g, "");
  const BANNED_WORDS = [
    "메커니즘",
    "시스템",
    "프로토콜",
    "매트릭스",
    "모니터링",
    "데이터",
    "CCTV",
    " DM ",
  ];
  const found = BANNED_WORDS.filter((w) => stripped.includes(w));

  if (found.length > 0) {
    return {
      label: "영단어 배제 (§6.5.2 대상)",
      severity: "FAIL",
      message: `배제 대상 어휘 발견: ${found.join(", ")}`,
    };
  }

  return {
    label: "영단어 배제 (§6.5.2 대상)",
    severity: "PASS",
    message: "§6.5.2 명시 대상 어휘 미발견",
  };
}

// [자동] 인용 표기 §6.4 규칙 — 기본 형식 확인
function checkCitationFormat(body: string): CheckResult {
  // "기록 [숫자코드]" 또는 "기록 [검열코드]" 형식이 아닌 "(기록 [...])" 형식이 있는지
  // 올바른 형식: (기록 [0341-XXXX]) 또는 (기록 [0341-0001])
  // 잘못된 형식: (사건기록 [...])
  const wrongPattern = /\(사건기록\s*\[/g;
  const wrongMatches = body.match(wrongPattern);

  if (wrongMatches && wrongMatches.length > 0) {
    return {
      label: "인용 표기 형식 (§6.4)",
      severity: "FAIL",
      message: `잘못된 인용 형식 '(사건기록 [...])' ${wrongMatches.length}건 — '(기록 [...])' 로 수정 필요`,
    };
  }

  return {
    label: "인용 표기 형식 (§6.4)",
    severity: "PASS",
    message: "명시적 형식 오류 미발견",
  };
}

// [자동] 사건 기록 흔적 최소 1개 (§6.6)
function checkIncidentRecord(body: string): CheckResult {
  // 사건 기록 섹션 존재 + 내용이 있는지
  // [\s\S]*? 로 non-greedy, 다음 ## 또는 문서 끝까지
  const sectionMatch = /^## 사건 기록\s*\n([\s\S]*?)(?=\n## |\n---\n*$|$)/m.exec(body);

  if (!sectionMatch) {
    return {
      label: "사건 기록 흔적 (§6.6)",
      severity: "FAIL",
      message: "사건 기록 항목 자체가 존재하지 않음",
    };
  }

  const sectionBody = sectionMatch[1].trim();
  // 내용이 "---" 만 있거나 비어있는 경우
  if (!sectionBody || sectionBody === "---" || sectionBody.replace(/-/g, "").trim() === "") {
    return {
      label: "사건 기록 흔적 (§6.6)",
      severity: "FAIL",
      message: "사건 기록 항목은 있으나 내용이 비어있음 — 최소 1개 흔적 필요",
    };
  }

  return {
    label: "사건 기록 흔적 (§6.6)",
    severity: "PASS",
    message: "사건 기록 항목 존재 + 내용 있음",
  };
}

// [자동] 검열 비율 5~15% (§7.2)
function checkCensorshipRatio(body: string): CheckResult {
  const totalChars = body.replace(/\s/g, "").length;
  if (totalChars === 0) {
    return {
      label: "검열 비율 5~15% (§7.2)",
      severity: "WARN",
      message: "본문이 비어있어 계산 불가",
    };
  }

  // 검열 토큰: █ 문자, [기밀 분류], [데이터 말소], [기록 보류]
  const censoredChars =
    (body.match(/█/g)?.length ?? 0) +
    (body.match(/\[기밀\s*분류[^\]]*\]/g)?.join("").replace(/\s/g, "").length ?? 0) +
    (body.match(/\[데이터\s*말소[^\]]*\]/g)?.join("").replace(/\s/g, "").length ?? 0) +
    (body.match(/\[기록\s*보류[^\]]*\]/g)?.join("").replace(/\s/g, "").length ?? 0);

  const ratio = censoredChars / totalChars;
  const pct = (ratio * 100).toFixed(1);

  if (ratio < 0.02) {
    return {
      label: "검열 비율 5~15% (§7.2)",
      severity: "WARN",
      message: `검열 비율 ${pct}% — 권장 범위(5~15%) 미달. 검열 없는 사상체라면 무시 가능.`,
    };
  }
  if (ratio > 0.2) {
    return {
      label: "검열 비율 5~15% (§7.2)",
      severity: "WARN",
      message: `검열 비율 ${pct}% — 권장 범위(5~15%) 초과. 의도된 경우 무시 가능.`,
    };
  }

  return {
    label: "검열 비율 5~15% (§7.2)",
    severity: "PASS",
    message: `검열 비율 ${pct}% — 권장 범위 내`,
  };
}

// [경고] 자동 판단 불가 항목들
function warnManualChecks(): CheckResult[] {
  return [
    {
      label: "표면/본질 이중 구조 (세계관 §2.1)",
      severity: "WARN",
      message: "의미론적 판단 필요 — 사상체의 외부 행동과 실제 본질이 분리되어 있는가?",
    },
    {
      label: "변칙 현상 6요소 권장 골격 (§6.3)",
      severity: "WARN",
      message: "LLM 판단 필요 — 각 변칙 현상 양상이 현상 묘사 / 인용 / 원리 추정 등을 포함하는가?",
    },
    {
      label: "관리국 본질 노출 1~2회 (§7.3)",
      severity: "WARN",
      message: "의미론적 판단 필요 — 관리국이 시청자를 보호하지 않는다는 암시가 1~2회 이내인가?",
    },
  ];
}

// ── 출력 ──────────────────────────────────────────────────────────────────

function printResults(results: CheckResult[]): boolean {
  let hasFail = false;
  const passCount = results.filter((r) => r.severity === "PASS").length;
  const failCount = results.filter((r) => r.severity === "FAIL").length;
  const warnCount = results.filter((r) => r.severity === "WARN").length;

  for (const r of results) {
    const prefix =
      r.severity === "PASS" ? "✓" : r.severity === "FAIL" ? "✗" : "△";
    console.log(`  ${prefix} [${r.severity}] ${r.label}`);
    if (r.severity !== "PASS") {
      console.log(`       → ${r.message}`);
    }
    if (r.severity === "FAIL") hasFail = true;
  }

  console.log("");
  console.log(
    `결과: PASS ${passCount} / FAIL ${failCount} / WARN ${warnCount}`
  );

  if (failCount === 0) {
    console.log("OK: 모든 자동 검증 항목 통과. WARN 항목은 수동 확인 권장.");
  } else {
    console.log("FAIL: 자동 검증 실패 항목이 있습니다. 수정 후 재검증하십시오.");
  }

  return hasFail;
}

// ── 문서 로드 ──────────────────────────────────────────────────────────────

async function loadDocument(
  orderCode: string | null,
  filePath: string | null
): Promise<{ data: Record<string, unknown>; body: string; label: string }> {
  let rawContent: string;
  let label: string;

  if (filePath) {
    const absPath = path.resolve(filePath);
    rawContent = await fs.readFile(absPath, "utf-8");
    label = path.basename(absPath);
  } else if (orderCode) {
    // working 폴더에서 5개 항목 파일을 합쳐서 검증
    const workingSubDir = path.join(WORKING_DIR, orderCode);
    const SECTION_KEYS = ["개요", "변칙현상", "격리절차", "대응지침", "사건기록"];
    const parts: string[] = [];

    for (const key of SECTION_KEYS) {
      const fp = path.join(workingSubDir, `${orderCode}_${key}.md`);
      try {
        parts.push(await fs.readFile(fp, "utf-8"));
      } catch {
        // 없는 파일은 건너뜀
      }
    }

    if (parts.length === 0) {
      console.error(`오류: docs/working/${orderCode}/ 에서 파일을 찾을 수 없습니다.`);
      process.exit(1);
    }

    rawContent = parts.join("\n\n");
    label = `working/${orderCode}/`;
  } else {
    throw new Error("순서코드 또는 파일 경로가 필요합니다.");
  }

  const parsed = matter(rawContent, { engines: { yaml: YAML_ENGINE } });
  return {
    data: parsed.data as Record<string, unknown>,
    body: parsed.content,
    label,
  };
}

// ── 메인 ──────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "사용법:\n" +
        "  node --loader ts-node/esm scripts/validate.ts <순서코드>\n" +
        "  node --loader ts-node/esm scripts/validate.ts --file <통합본 경로>"
    );
    process.exit(1);
  }

  let orderCode: string | null = null;
  let filePath: string | null = null;

  if (args[0] === "--file") {
    filePath = args[1] ?? null;
    if (!filePath) {
      console.error("오류: --file 옵션에 경로가 필요합니다.");
      process.exit(1);
    }
  } else {
    orderCode = args[0];
  }

  const { data, body, label } = await loadDocument(orderCode, filePath);

  console.log(`검증 대상: ${label}`);
  console.log("");

  const results: CheckResult[] = [
    checkFrontmatter(data),
    checkBodySections(body),
    checkNoYoForm(body),
    checkNoEnglishWords(body),
    checkCitationFormat(body),
    checkIncidentRecord(body),
    checkCensorshipRatio(body),
    ...warnManualChecks(),
  ];

  const hasFail = printResults(results);
  process.exit(hasFail ? 1 : 0);
}

main().catch((err) => {
  console.error("오류:", err);
  process.exit(1);
});
