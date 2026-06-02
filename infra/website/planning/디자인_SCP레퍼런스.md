---
문서: SCP_웹디자인_레퍼런스_조사
버전: v1.1
최종 갱신: 2026-05-27
작성자: Claude (조사 보조)
상태: 커스텀 스타일 검증 완료 — 기본 스타일 링크 제거됨
용도: 노스포비아 프로젝트 웹사이트 디자인 결정을 위한 SCP 위키 레퍼런스 카탈로그
참고 문서: 웹사이트_기획_확정, 프로젝트_의도, 세계관_설정
---

# SCP 웹디자인 레퍼런스 조사

본 문서는 노스포비아 프로젝트의 웹사이트 디자인 결정을 돕기 위해, SCP 재단 위키 생태계에서 *기본 양식을 벗어나 커스텀 디자인을 적용한* 페이지·테마들을 폭넓게 수집한 카탈로그다.

각 항목은 노스가 *직접 링크를 열어 시각적으로 확인*하는 것을 전제로 정리했다. 따라서 본 문서는 평가·결정이 아니라 *어디를 봐야 하는지에 대한 지도*에 가깝다.

## 본 문서가 다루는 영역

- SCP 위키 생태계의 디자인 시스템 구조 메타 설명
- 공식 테마 카탈로그 — 노스 프로젝트와의 관련도 순
- Format Screw — 페이지 단위 디자인 변형 사례
- SCP-001 제안 시리즈 — 동일 시스템 안의 페이지 디자인 변주 카탈로그
- 한국 SCP-KO 인기·디자인 변형 후보
- GoI Format — 가상 기관별 문서 양식
- 분석 루브릭 — 페이지를 열 때 무엇을 봐야 하는가
- 권장 진입 순서

## 본 문서가 다루지 않는 영역

- 각 페이지의 *서사 내용* 평가 (본 문서는 디자인 관점만)
- 노스 프로젝트의 *최종 디자인 결정* — 결정은 노스가 수행
- 페이지의 시각적 스크린샷 — SCP 위키는 robots.txt 정책으로 직접 캡처 불가, 노스가 직접 열어볼 것
- 한국어 폰트 매핑·CSS 토큰 결정 — 후속 작업

---

## 1. SCP 위키 디자인 시스템 — 메타 컨텍스트

본 절은 SCP 위키 생태계의 *디자인 시스템 구조*를 압축 설명한다. 노스가 개별 페이지를 보기 전에 이 구조를 먼저 이해해두면, 무엇이 시스템 단위 선택이고 무엇이 페이지 단위 선택인지 분리해 볼 수 있다.

### 1.1. 3계층 구조

SCP 위키의 디자인은 다음 3계층으로 작동한다.

```
[ 레벨 1: 베이스 테마 ]      ── 사이트 전체 기본값
       │                       (Sigma-9 → 클래식 / Black Highlighter → 모던)
       ↓
[ 레벨 2: 서브 테마 ]        ── 페이지 단위 적용 (REDTAPE, Penumbra 등)
       │                       (작가가 자신의 문서에 [[include]] 한 줄로 적용)
       ↓
[ 레벨 3: 페이지 컴포넌트 ]  ── 페이지 내부 영역별 디자인
                              (div class="doc"/"addendum"/"foundation" 등)
```

이 3계층은 노스 프로젝트로 직접 매핑된다.

| SCP 위키 계층 | 노스 프로젝트의 대응 결정 |
|---|---|
| 레벨 1 베이스 테마 | 사이트 전체의 베이스 CSS 토큰 (색·타이포·간격 시스템) |
| 레벨 2 서브 테마 | *페이지 종류별*로 다르게 가져갈 디자인 변주 — 본국 안내 vs 사상체 문서 vs 접근 불가 등 |
| 레벨 3 컴포넌트 | 페이지 내부 *문서 안의 문서* 표현 — 머리 메타박스, 검열 박스, 강조 박스, 부록 박스 등 |

### 1.2. 테마 분류 체계

SCP 위키 내 테마는 다음 5종으로 대략 분류된다.

- **베이스 테마** (Sigma-9, Black Highlighter) — 사이트 기본값. 다른 테마들이 이 위에 얹힘.
- **GoI 테마** (Anderson Robotics, MC&D, GOC 등) — *가상 기관* 전용 양식. 그 기관의 문서가 작성될 때 이 테마가 적용됨. **노스의 "관리국" = 가상 기관과 가장 직접 대응되는 카테고리.**
- **부서/캐논 테마** (3law, Ad Abyssum 등) — 특정 캐논(스토리 군)이나 부서 전용 양식.
- **작가 개인 테마** (PLACESTYLE, BLANKSTYLE, Flopstyle, YOSSISTYLE 등) — 한 작가가 자기 모든 문서에 일관되게 적용하는 양식. **개별 작가의 미학 학습용.**
- **단일 페이지 테마** (Format Screw 류) — 한 페이지만을 위한 디자인. 호러 효과의 일부로 디자인 그 자체가 사용되는 사례.

### 1.3. ACS — 분류 표시 UI 시스템

SCP 위키에는 **ACS (Anomaly Classification System)** 라는 별도의 *분류 표시 컴포넌트*가 있다. Woedenaz가 주도해 만든 것으로, 사상체 머리 메타박스를 *4축으로 시각화*하는 컴포넌트 바.

- Item # (식별 번호)
- Clearance Level (보안 등급)
- Containment Class (격리 등급, 기존 Object Class)
- Disruption Class (교란 등급)
- Risk Class (위험 등급)

ACS 가이드: `scp-wiki.wikidot.com/anomaly-classification-system-guide`

→ **노스의 사상체 머리 메타박스 디자인을 결정할 때 가장 직접적인 참고 사례**. 노스 시스템에는 *위험 등급 + 변칙성 분류 + 식별 코드*가 있는데, 이를 머리 박스에서 어떻게 시각화할지에 대한 시각적 베스트 프랙티스가 ACS에 응축되어 있다.

### 1.4. 호스트 사이트 URL

- 영문 위키: `scp-wiki.wikidot.com` (또는 `scpwiki.com`)
- 한국 위키: `scpko.wikidot.com` 또는 `ko.scp-wiki.net`
- 일본 위키: `scp-jp.wikidot.com`
- 중국 위키: `scp-wiki-cn.wikidot.com`
- 러시아 위키: `scp-ru.wikidot.com`

본 문서는 영문·한국 두 곳을 중심으로 정리한다.

---

## 2. 카테고리 A — 공식 테마 (CSS 시스템 단위)

본 절은 SCP 위키에 *공식 등록된 테마*를 노스 프로젝트와의 관련도 순으로 정리한다. 각 테마는 `theme:테마이름` 형식의 단일 페이지로 존재하며, 자체 미리보기를 포함한다.

### 2.1. ★★★ 1순위 — 관료·정부 톤 (직접 참고)

#### REDTAPE THEME
- URL: `scp-wiki.wikidot.com/theme:redtape`
- 작가: Rounderhouse (2022년)
- **이름 자체가 "관료주의(red tape)"**. 노스 프로젝트와 컨셉 일치도 최고
- 헤더 서브타이틀: "Minutes to Midnight" — 운명의 날 시계 메타포로 운영
- 폰트: Secular One (헤더·제목), Telex (본문), PT Mono (모노)
- 미리 정의된 div 클래스:
  - `foundation`, `foundation snow`, `foundation raisa`, `foundation alt` — 재단 내부 문서 표현
  - `doc` — 첨부 문서 (페이지 안의 다른 문서)
  - `addendum` — 부록 / 추기
  - `addendum goc`, `addendum goc notice` — 외부 기관 알림
  - `generic red`, `generic blue`, `generic yellow`, `generic purple` — 범용 색상 강조 박스
- **모듈식 네비게이션 바** — 페이지 상단/하단에 *시리즈 내 이전/다음* 페이지 표시
- 라이트/다크 두 변형 제공
- → **본국 개요·부서 페이지의 출발점으로 직접 가져다 분석할 가치 있음.** 노스 프로젝트의 거의 모든 페이지 종류에 대응되는 div 클래스가 이미 정의되어 있다.

### 2.2. ★★ 2순위 — 어두운 학구·오컬트 톤 (사상체 문서 참고)

#### Penumbra (원조)
- URL: `scp-wiki.wikidot.com/theme:penumbra`
- 작가: EstrellaYoshte
- 어두운 톤. 학구적·고전적·오컬트적 분위기
- 폰트: Josefin Sans 계열

#### Penumbra BHL (Black Highlighter 기반 버전)
- URL: `scp-wiki.wikidot.com/theme:penumbra-bhl`
- 작가: Woedenaz
- Penumbra의 기능을 모던 BHL 베이스 위에서 재구현
- **사이드블록 컴포넌트** — 본문 옆에 작은 메타박스를 띄울 수 있음
- → 노스의 사상체 문서에서 *본문 옆에 경고/주석/관련 사상체 코드*를 띄우는 자리에 직접 대응

#### Greystyle
- URL: `scp-wiki.wikidot.com/theme:greystyle`
- 작가: Greyve (2023년)
- Penumbra BHL의 *라이트 변형* — 차분한 회백 톤
- **라이트/다크 두 모드 영역**을 한 페이지에서 동시 사용 가능 (`mode1-changer`, `mode2-changer` div)
- 폰트: Josefin Sans (헤더), Oxygen (본문), Fira Code (모노)
- → 노스가 "본국 안내는 라이트, 사상체 문서는 다크" 식으로 페이지 종류별 모드 분리 시 참고

#### Fuladh Theme
- URL: `scp-wiki.wikidot.com/theme:fuladh-theme`
- 다크 변형 중 하나
- *장식된 수평선* (`ornate horizontal rule`)이 정의됨 — 의례·고전 문서풍

### 2.3. ★★ 2순위 — SF·우주·정부 톤 (색온도 참고)

#### Third Law Canon (3law)
- URL: `scp-wiki.wikidot.com/theme:3law`
- 짙은 남색·짙은 푸름 (#315B7D, #4682B4)
- SF 정부·우주선 인트라넷 분위기
- → **#322659 (노스 포인트 컬러)와 색온도가 가장 가까운 공식 테마**. 노스의 남보라를 같은 톤 패밀리(짙은 청·보) 안에서 어떻게 활용할지 학습 가능

#### Black Highlightyear (Ad Astra 기반)
- URL: `scp-wiki.wikidot.com/theme:black-highlightyear`
- 작가: Rounderhouse
- "Ad Astra Per Aspera" (별을 향해 시련 너머) — 우주 테마
- 폰트: Russo One (헤더), Lato (본문), Exo (제목), PT Mono (모노)
- 5종 쿼트블록 색상 (black/blue/pink/gold/purple) — *영역 색상 인캡슐레이션* 패턴 학습용

### 2.4. ★★ 2순위 — 부서·기관별 변주 학습

#### Ad Abyssum (Penumbra 변형)
- URL: `scp-wiki.wikidot.com/theme:ad-abyssum-penumbra`
- 종교/마법 부서 전용 테마. **division 변수로 부서별 미묘한 디자인 변주**
- 사용 가능 division 값:
  - `abrahamics` — 아브라함계 종교
  - `east_asian` — 동아시아
  - `indus_vedic` — 인도·베다
  - `shamanism_animism` — 샤머니즘·애니미즘
  - `neopaganism` — 신이교주의
  - `parareligions` — 사이비 종교
  - `demonology` — 악마학
- → **노스의 4대 부서(현장 작전부·보안 통제부·연구 개발부·관리 행정부) 페이지를 *완전히 다른 디자인*이 아니라 *같은 시스템 안에서 미묘하게 다른 변주*로 만드는 방법론의 정답 사례.** 디자인 일관성과 부서별 차별화를 동시에 잡는 패턴.

#### Anderson Robotics Theme
- URL: `scp-wiki.wikidot.com/theme:anderson-robotics`
- 작가: Croquembouche
- 기업 GoI 인트라넷풍 양식 — 기술 기업 사내 시스템 느낌
- → 노스의 "관리국 인트라넷" 컨셉과 가장 *구조적으로* 비슷한 사례 (특정 기관 전용 내부망)

### 2.5. ★ 3순위 — BHL 기반 컬러 변주

#### New Age
- URL: `scp-wiki.wikidot.com/theme:new-age`
- 작가: JakdragonX (2022년)
- BHL 기반에 컬러 변주 (`green`/`blue`/`orange`/`pink`/`violet`)
- `[[div class="violet"]]` 같은 *영역 컬러 인캡슐레이션* 패턴
- → 검열/경고/일반/주의/금지 영역을 색상 카테고리로 분리하는 기법 학습용

#### Black Highlighter (베이스 테마)
- URL: `scp-wiki.wikidot.com/theme:black-highlighter-theme`
- 작가: Croquembouche & Woedenaz
- 모던 alt 베이스 테마. 위 거의 모든 서브 테마의 부모
- 베이스 자체로 사용해도 됨 (가장 깔끔)

#### Sigma-9 (클래식 베이스)
- 가장 유명한 SCP 위키 디자인. 흰 배경 + 빨간 헤더 + 검은 사이드바
- 노스 프로젝트의 안티 모델 (너무 SCP스러워서 도리어 차별화에 방해)
- 알아두기는 하되 *피해야 할 기본값*으로 분류

### 2.6. ★ 작가 개인 테마 (스타일 변주 학습용)

작가 한 명이 *자기 모든 문서에 일관되게 적용*하는 테마들. 한 사이트 안에서 어떻게 개인 미학을 일관되게 유지하는지의 사례.

| 테마 | URL | 작가 | 특징 |
|---|---|---|---|
| PLACESTYLE | `theme:placestyle` | Placeholder McD | 작가 개인 미학. ADMONITION·Basalt와 함께 미니멀 계보 |
| BLANKSTYLE | `theme:blankstyle` | HarryBlank & PlaceMcD | 극단적 미니멀 |
| Flopstyle / Flopstyle: DARK | `theme:flopstyle` | Lt Flops | 다크 변형, 카드형 레이아웃 |
| YOSSISTYLE | `theme:yossistyle` | Yossipossi | 강한 개성 |
| Paperstack | `theme:paperstack` | EstrellaYoshte | 종이 더미·고문서 풍 |
| ADMONITION | `theme:admonition` | Liryn & PlaceMcD | 경고·통지 양식 |
| Basalt | `theme:basalt` | Liryn & PlaceMcD | 화산암·검은 미니멀 |
| SYNTECH | `theme:syntech` | Greyve | 사이버펑크·기술 |
| Twin Files | `theme:twin-files` | JackalRelated | *이중 파일* 양식 — 한 페이지에 두 문서 병치 |
| Inkblot | `theme:inkblot` | Croquembouche | 잉크 얼룩 모티프 |
| Redtape (앞서 언급) | `theme:redtape` | Rounderhouse | 관료 |
| Turbo Vision / TURBODARK | `theme:turbo-vision` | Rounderhouse | 90년대 레트로 컴퓨터 UI |
| Shark Punching Centre BHL | `theme:shark-punching-centre-bhl` | (패러디 사이트용) | 패러디 — 본격 사이트 변주의 극단 예시 |

→ 노스가 흥미를 느끼는 개인 테마 2~3개를 골라 *그 작가의 미학이 모든 페이지에 어떻게 일관되게 작동하는지*를 따로 시간을 들여 볼 가치 있음. 노스도 결국 자신만의 일관된 미학을 세워야 하기 때문.

### 2.7. ★ 테마 일람·검색

전체 테마 목록 (태그 검색): `scp-wiki.wikidot.com/system:page-tags/tag/theme`

이 페이지를 가나다(영문 알파벳) 순으로 훑어보면, 위 카탈로그에 없는 다른 테마도 발견 가능. 다만 본 문서의 우선순위 권장은 §2.1~§2.4까지.

---

## 3. 카테고리 B — Format Screw (페이지 단위 디자인 변형)

Format Screw는 *기본 양식 자체를 깨는* SCP 문서들이다. 사상체의 변칙성이 *문서의 형식*에 침투해 시각적 호러로 발현한다.

> **노스 프로젝트와의 핵심 관련성**: 노스의 *검열 표기*, *접근 불가 페이지*, *유휴 효과*가 바로 이 카테고리의 미학 안에 있다. 호러 침투가 높은 페이지의 디자인 정답 사례.

### 3.1. 진입점 — Format Screw Hub

- URL: `scp-wiki.wikidot.com/format-screw-hub`
- 영문 위키의 모든 Format Screw 문서가 카탈로그화된 페이지
- Tstaffor, Henzoid, TopDownUnder이 주로 관리

### 3.2. 페이지 전체 디자인 전환형

페이지 자체가 *일반 SCP 양식과 완전히 다른 모습*으로 전환된 사례들.

| SCP | URL | 디자인 특징 |
|---|---|---|
| **SCP-3001** — Red Reality | `scp-wiki.wikidot.com/scp-3001` | 페이지 전체가 *붉은 배경*으로 전환. 점점 글리치되는 텍스트. 시각적 호러의 대표 |
| **SCP-5000** — Why? | `scp-wiki.wikidot.com/scp-5000` | 재단 자체가 부패한 상황을 *문서의 양식 자체로* 표현. 일반 양식과 완전히 다른 일지·도주 기록 |
| **SCP-1730** — What Happened to Site-13 | `scp-wiki.wikidot.com/scp-1730` | 폐허가 된 관리국 시설을 *문서 양식의 붕괴*로 표현. **노스의 1-5 본국 시설(접근 불가) 페이지와 가장 직접 비교할 사례** |
| **SCP-001 McDoctorate's Proposal** | `scp-wiki.wikidot.com/mcdoctorates-proposal` | 페이지 배경색에 *숨겨진 텍스트* |

### 3.3. 텍스트 매니퓰레이션형

텍스트 자체가 변칙적으로 작동하는 사례들. 노스의 *검열 표기 미학*과 직결.

| SCP | URL | 디자인 특징 |
|---|---|---|
| **SCP-2747** — As Below, So Above | `scp-wiki.wikidot.com/scp-2747` | 페이지 배경색과 같은 색의 *숨겨진 텍스트*. "보이지 않는 것이 거기 있다"는 미학 |
| **SCP-3211** — There Is No Antimemetics Division | `scp-wiki.wikidot.com/scp-3211` | 반밈(anti-meme) 변칙성. 문서 안에서 단어가 *사라지는* 효과. 노스의 "기록 보류" 검열과 다른 방향의 비교 |
| **SCP-2521** — ●●\|●●●●●\|●●\|● | `scp-wiki.wikidot.com/scp-2521` | 자기 자신의 정보를 모두 훔치는 사상체. 문서 안의 *모든 텍스트가 이미지로만* 표시됨. 검열의 극단 사례 |

### 3.4. 인터페이스 스크류형

사용자 인터페이스 자체에 변칙성이 침투한 사례들.

| SCP | URL | 디자인 특징 |
|---|---|---|
| **SCP-2317** — A Door to Another World | `scp-wiki.wikidot.com/scp-2317` | 문서를 읽어 내려가면 *경고·잠금 화면*이 등장. 인터페이스가 사용자를 막아섬 |

### 3.5. 사이트 페이지 카탈로그 (Format Screw Hub에서 발췌)

본 문서 작성 시점에 Format Screw Hub에 등록되어 있는 항목들 중 위에 미언급된 것들. 모두 `scp-wiki.wikidot.com/scp-XXXX` 형식으로 접근.

- SCP-7785 (커스텀 Foxtrot Sigma-9 테마 — 색상 변수 시스템·커스텀 폰트·레이아웃 조정)

### 3.6. 다른 언어권의 Format Screw

- **SCP-503-KO** — 한국 위키. Format Screw Hub의 공식 한국 추천 항목 (디자인 묘사가 영문 위키에서 미완으로 남아있음). URL: `scpko.wikidot.com/scp-503-ko`
- **SCP-1397-RU** — 러시아 위키. 동일 사유. URL: `scp-ru.wikidot.com/scp-1397`

→ 다른 언어권 위키의 Format Screw도 *해당 언어 환경에서 양식 변형이 어떻게 작동하는지* 학습 가치 있음. 특히 503-KO는 한국어 환경에서 작동하므로 노스가 직접 참고.

---

## 4. 카테고리 C — SCP-001 제안 시리즈 (디자인 카탈로그)

SCP-001은 *13개 이상의 제안*이 각자 디자인을 가진다. 동일 위키 안에서 *작가별로 페이지 디자인이 어떻게 달라지는지* 한 자리에서 비교할 수 있는 가장 농축된 학습 자료다.

> **노스가 "사상체 문서마다 디자인 변주"를 계획한다면 반드시 참고할 카탈로그.**

### 4.1. 영문 위키 — SCP-001 전체 일람

- 진입 URL: `scp-wiki.wikidot.com/scp-001`
- 위 페이지에서 각 제안의 링크로 진입

#### 디자인 변주가 두드러진 영문 제안 (우선 권장)

| 제안 | URL 슬러그 | 디자인 특징 |
|---|---|---|
| **McDoctorate's Proposal** | `mcdoctorates-proposal` | 텍스트 일부가 페이지 배경색에 숨겨짐 |

→ 노스가 *모두 볼 필요는 없음*. 커스텀 디자인이 확인된 McDoctorate's Proposal을 진입점으로, SCP-001 허브 페이지에서 각 제안을 직접 열어 확인할 것.

### 4.2. 한국 위키 — SCP-001-KO 제안

- 진입 URL: `scpko.wikidot.com/scp-001`
- 한국 위키 고유의 001 제안들이 정리되어 있음

| 제안 | 비고 |
|---|---|
| **카모밀레의 제안 — 끝나지 않는 레퀴엠** | 한국 SCP-KO 001 대표작 중 하나. *D계급에게도 공개하는* 역설적 양식 |
| **L. H. 자인의 제안 — 사람에 의한** | SCP-001 자체가 가짜라고 주장하는 메타 문서. 양식 자체로 메타를 표현 |
| **크리스크의 제안 — 서장: 장막의 골짜기** | 서장(序章) 양식. 책의 머리말 형식으로 시작 |

→ **한국어 환경에서 양식 변주가 어떻게 작동하는지** 가장 직접적인 학습 자료. 영문 변주를 한국어로 옮기면 자모 비율·공백·줄간격 때문에 어색해지는 경우가 많은데, 이 한국 제안들은 처음부터 한국어로 작성되어 그 문제가 해결되어 있다.

---

## 5. 카테고리 D — 한국 SCP-KO 인기 사례

본 절은 한국 SCP-KO에서 *디자인 변형이 있을 가능성이 있는 인기 페이지들*을 정리한다. 한국 위키 페이지를 노스가 직접 열어 확인하는 것이 필수.

### 5.1. 진입 URL

- **한국 위키 최고 평점 페이지** (가장 먼저 들어가야 할 곳): `scpko.wikidot.com/top-rated-pages`
- 한국 SCP 시리즈 전체 일람: `scpko.wikidot.com/scp-series-ko`
- 한국 위키 자체: `scpko.wikidot.com` 또는 `ko.scp-wiki.net`

### 5.2. 커스텀 디자인이 확인된 한국 SCP 목록

각 페이지는 `scpko.wikidot.com/scp-XXX-ko` 형식으로 접근. 아래 목록은 HTML CSS를 직접 확인해 기본 스타일 항목을 제거한 결과다.

#### 5.2.1. 관료·제도 풍자형 (노스 프로젝트 톤과 가장 근접)

| 식별 | 명칭 | 디자인 변형 |
|---|---|---|
| SCP-903-KO | 스테로이드 아님! | 커스텀 다크 테마 적용. 광고·시판 양식 |
| SCP-287-KO | 이 SCP-287-KO를 가질 우승자는 누굴까요?! | 커스텀 스타일 적용. 아나운서·스포츠 중계 양식 |

#### 5.2.2. 서정·시적 양식형

| 식별 | 명칭 | 디자인 변형 |
|---|---|---|
| SCP-416-KO | 떡갈나무 아래에는 악기가 묻혀있다 | 커스텀 다크 테마 적용. 동화·전설 양식 |


#### 5.2.3. 커스텀 테마 적용 확인 항목

| 식별 | 명칭 | 디자인 변형 |
|---|---|---|
| SCP-403-KO | 엔틱 오르골 그 이상, 그 이하 | 커스텀 CSS Grid 사이드바 + 슬라이드 인 애니메이션. Black Highlighter 파생 커스텀 |
| SCP-406-KO | 네 덕이야! | 커스텀 폰트(Noto Sans KR·Nanum Pen Script) + `.journal` 클래스 |
| SCP-434-KO | 백지장은 이렇게 찢어졌다 | Penumbra Theme 적용 |

#### 5.2.4. Format Screw 명시 후보

| 식별 | 비고 |
|---|---|
| SCP-503-KO | 영문 위키의 Format Screw Hub에 *공식 등재된* 한국 사례. 디자인 변형이 확실히 있는 페이지 |

### 5.3. 한국어 환경에서 봐야 하는 이유

영문 SCP 디자인이 한국어 페이지에 그대로 적용되면 어색해지는 경우가 많다. 한국어는 자모가 결합된 정사각형 글자로 구성되어 영문보다 *시각적 밀도가 높고 단어 경계가 약하다*. 같은 폰트 크기·줄간격이라도 한국어가 더 빽빽해 보인다.

한국 SCP-KO의 인기 페이지들을 함께 보면:
- 한국어 환경의 *적정 줄간격·공백 비율*을 시각적으로 캘리브레이션 가능
- 검열 표기(`█`)가 한국어 텍스트와 함께 있을 때의 비율 감각
- 한국어 헤더 폰트로 어떤 것이 자주 쓰이는지 (대부분 본명조·고딕 계열)

---

## 6. 카테고리 E — GoI Format (가상 기관 양식)

GoI(요주의 단체) Format은 *SCP 재단이 아닌 가상 기관의 내부 문서를 모사한 양식*이다. 노스의 "초상현상관리국" = 새로운 가상 기관이므로, 이 카테고리는 **노스가 자신의 관리국 양식을 설계할 때 정확한 비교 대상**.

### 6.1. 진입 — GoI 목록

- URL: `scp-wiki.wikidot.com/groups-of-interest`
- 영문 위키에 등록된 모든 가상 기관 목록

### 6.2. 주요 GoI와 그들의 양식

| 기관 | 양식 특징 | 노스 관련성 |
|---|---|---|
| **Global Occult Coalition (GOC)** | UN 산하 가상 기관. 군사·정치 양식. *Threat Entity (TE)* 분류. 자체 부서 (PHYSICS·PSYCHE·PTOLEMY 등) | **노스의 관리국과 가장 직접 비교 대상.** GOC도 정부형 기관이며 자체 부서·분류를 가짐 |
| **Marshall, Carter and Dark Ltd. (MC&D)** | 상류층 비밀 클럽. *경매 카탈로그·고급 명함* 양식 | 관리국과 정반대 톤. 대조 학습용 |
| **Anderson Robotics** | 기업 GoI. *제품 카탈로그·기술 매뉴얼* 양식 | 노스의 "관리국 인트라넷" 컨셉과 인프라 닮음 |
| **Wanderers' Library / Serpent's Hand** | 무한 도서관. *고문서·이야기책* 양식 | 자료실 미학 참고 |
| **Chaos Insurgency** | 재단 분파 반란조직. *군사·작전* 양식 | |
| **Church of the Broken God** | 종교 기관. *교리·예배* 양식 | |
| **Sarkic Cults** | 고대 종교. *의례·살의* 양식 | |
| **Horizon Initiative** | 아브라함계 종교 연합 | |
| **Manna Charitable Foundation** | 종교 자선 단체 | |
| **Prometheus Labs, Inc.** | 망한 기술 기업. *기업 PR·제품 보도자료* 양식 | |
| **"Are We Cool Yet?"** | 예술 운동. *전시·평론* 양식 | |
| **Three Portlands** | 가상 도시. *시·관광지·생활* 양식 | |
| **Herman Fuller's Circus of the Disquieting** | 서커스. *공연 포스터* 양식 | |
| **Just Girly Things** | 인스타·소셜 미디어 양식 | |
| **Medician Academy of Occult Art** | 르네상스 학술기관. *고서·필사본* 양식 | |
| **IJAMEA** (Imperial Japanese Anomalous Matters Examination Agency) | 일본 가상 기관. 일본어/메이지·다이쇼 시대 양식 | 동아시아권 기관 양식 참고 |
| **"Nobody"** | 정체불명 인물. *익명 메시지* 양식 | |
| **ORIA** (Office For The Reclamation of Islamic Artifacts) | 이슬람권 가상 기관 | |
| **Parawatch** | 음모론 인터넷 게시판. *포럼 양식* | |

### 6.3. GOC를 우선 봐야 하는 이유

노스의 관리국과 GOC는 다음에서 같다.
- 정부·국제 기구 산하 가상 기관
- 자체 부서 구조와 분류 체계
- *공식 인트라넷* 양식이 있음
- 외부에 알려지지 않은 비밀 기관

따라서 GOC의 자체 양식 페이지(GOC 양식의 문서들)는 노스가 *직접 비교*하면서 봐야 한다. 영문 위키에서 `goc` 태그로 검색하면 GOC 양식이 적용된 문서들이 나옴: `scp-wiki.wikidot.com/system:page-tags/tag/goc-format`

---

## 7. 분석 루브릭 — 페이지를 열 때 무엇을 봐야 하는가

링크만 모아두면 노스의 결정이 진전되지 않는다. 각 페이지를 열 때 다음 8개 관찰 항목을 *체크리스트로* 평가하면서 봐야 한다.

### 7.1. 페이지를 열 때 체크할 8개 관찰 항목

| 번호 | 관찰 항목 | 노스가 결정해야 할 것 |
|---|---|---|
| 1 | **헤더 영역** — 로고·기관명·서브타이틀 | 노스 헤더에 *서브타이틀*을 둘 것인가. 동적인가(REDTAPE처럼 "Minutes to Midnight") 정적인가 |
| 2 | **메타박스 구조** — Item #, Object Class, ACS 등 | 사상체 머리 박스를 좌우 분할인가 / 단일 박스인가 / 별도 라인인가 |
| 3 | **본문 폰트와 줄간격** | 한국어 환경에서 대응 폰트 결정 (Pretendard / Noto Sans KR / Spoqa Han Sans / Noto Serif KR 등) |
| 4 | **검열 표기의 시각적 처리** | 가로 막대(`█████`)인가 / 검은 배경 박스인가 / 회색 흐림인가 / 줄 단위 [데이터 말소]인가 |
| 5 | **포인트 컬러 등장 빈도** | 헤더만(REDTAPE) / 헤더+제목+링크(Sigma-9) / 거의 안 보임(Greystyle) 중 어디 |
| 6 | **사이드블록·옆 메타박스** | 본문 옆에 작은 박스를 띄울 것인가 (Penumbra) / 본문 단일 컬럼인가 (대부분) |
| 7 | **부서·카테고리별 디자인 변주** | 같은 시스템 안에서 미묘하게 다르게(Ad Abyssum) / 완전히 다른 디자인 / 변주 없음 중 어디 |
| 8 | **접근 불가·경고 페이지의 처리** | 단순 메시지 박스(기본) / 페이지 전체 디자인 전환(Format Screw) / 그 사이 어디 |

### 7.2. 결정 축으로의 변환

위 8개 관찰을 마치면, 각 항목에서 노스의 *결정*을 1~2문장으로 명문화한다. 예시:

```
관찰 1 (헤더): "헤더는 정적. '초상현상관리국 / 내부 인트라넷' 2줄.
                서브타이틀에 동적 요소(시계·카운터)는 두지 않음."

관찰 4 (검열): "검열은 가로 막대(█) + 줄 단위 [데이터 말소] 두 종만 사용.
                회색 흐림·블러는 사용하지 않음. 검열 길이는 원문에 비례."

...
```

이 결정들을 모으면 노스의 *디자인 헌법*이 완성된다. 그 다음 만들어둔 LLM 샘플들을 이 헌법으로 평가하면 80% 이상 자동 판정된다.

---

## 8. 권장 진입 순서

전체 자료가 방대하므로 다음 순서로 보는 것을 권장한다. 시간 추정 포함.

### 1단계 — 기본 시스템 이해 (30분)

목적: SCP 위키의 3계층 구조와 ACS를 시각적으로 이해.

| 시간 | 페이지 |
|---|---|
| 5분 | `scp-wiki.wikidot.com/theme:sigma-9-themes` — 테마 일람 페이지(가능 시) |
| 15분 | `scp-wiki.wikidot.com/anomaly-classification-system-guide` — ACS 가이드 |
| 10분 | `scp-wiki.wikidot.com/groups-of-interest` — GoI 일람 |

### 2단계 — 핵심 테마 1개 정독 (45분)

목적: 본 문서 §7의 8개 관찰 항목을 *처음으로* 노트.

| 시간 | 페이지 |
|---|---|
| 45분 | `scp-wiki.wikidot.com/theme:redtape` — 8개 항목 전부 메모 |

이 한 페이지에서 노스의 디자인 헌법 *초안*이 80% 완성된다.

### 3단계 — 변주 학습 (60분)

목적: 같은 시스템 안에서 어떻게 변주가 가능한지 학습.

| 시간 | 페이지 |
|---|---|
| 20분 | `scp-wiki.wikidot.com/theme:ad-abyssum-penumbra` — division 변수로 부서 변주 |
| 20분 | `scp-wiki.wikidot.com/theme:3law` — #322659와 가까운 색온도 |
| 20분 | `scp-wiki.wikidot.com/theme:penumbra-bhl` — 사이드블록 구조 |

### 4단계 — 한국 환경 캘리브레이션 (60분)

목적: 한국어 환경에서 양식이 어떻게 보이는지 캘리브레이션.

| 시간 | 페이지 |
|---|---|
| 10분 | `scpko.wikidot.com/top-rated-pages` — 한국 최고 평점 목록 |
| 50분 | 한국 SCP-001 제안 3개 — 끝나지 않는 레퀴엠 / 사람에 의한 / 장막의 골짜기 |

### 5단계 — Format Screw 빠른 스캔 (45분)

목적: 호러 침투가 높은 자리(검열·접근 불가)의 디자인 정답 사례 학습.

| 시간 | 페이지 |
|---|---|
| 10분 | `scp-wiki.wikidot.com/format-screw-hub` — 카탈로그 훑기 |
| 35분 | 권장 5개 — SCP-1730 / SCP-2747 / SCP-3211 / SCP-2317 / SCP-503-KO |

### 총 소요

약 3시간 30분. 1~2회 분할 가능. 5단계 완료 시점에 노스의 디자인 헌법이 *명문화 가능한 상태*로 굳어 있을 것.

---

## 부록 A. 전체 URL 일람

본 문서에서 언급한 URL을 한 번에 모아둠. 노스가 한꺼번에 북마크하기 좋도록.

### 시스템 가이드

- 테마 일람 (태그): `scp-wiki.wikidot.com/system:page-tags/tag/theme`
- ACS 가이드: `scp-wiki.wikidot.com/anomaly-classification-system-guide`
- GoI 목록: `scp-wiki.wikidot.com/groups-of-interest`
- Format Screw Hub: `scp-wiki.wikidot.com/format-screw-hub`
- 한국 최고 평점: `scpko.wikidot.com/top-rated-pages`
- 한국 SCP 시리즈: `scpko.wikidot.com/scp-series-ko`

### 공식 테마 (영문)

- REDTAPE: `scp-wiki.wikidot.com/theme:redtape`
- Penumbra: `scp-wiki.wikidot.com/theme:penumbra`
- Penumbra BHL: `scp-wiki.wikidot.com/theme:penumbra-bhl`
- Greystyle: `scp-wiki.wikidot.com/theme:greystyle`
- Fuladh: `scp-wiki.wikidot.com/theme:fuladh-theme`
- Third Law Canon: `scp-wiki.wikidot.com/theme:3law`
- Black Highlightyear: `scp-wiki.wikidot.com/theme:black-highlightyear`
- Ad Abyssum: `scp-wiki.wikidot.com/theme:ad-abyssum-penumbra`
- Anderson Robotics: `scp-wiki.wikidot.com/theme:anderson-robotics`
- New Age: `scp-wiki.wikidot.com/theme:new-age`
- Black Highlighter: `scp-wiki.wikidot.com/theme:black-highlighter-theme`
- PLACESTYLE: `scp-wiki.wikidot.com/theme:placestyle`
- BLANKSTYLE: `scp-wiki.wikidot.com/theme:blankstyle`
- Flopstyle: `scp-wiki.wikidot.com/theme:flopstyle`
- YOSSISTYLE: `scp-wiki.wikidot.com/theme:yossistyle`
- Paperstack: `scp-wiki.wikidot.com/theme:paperstack`
- ADMONITION: `scp-wiki.wikidot.com/theme:admonition`
- Basalt: `scp-wiki.wikidot.com/theme:basalt`
- SYNTECH: `scp-wiki.wikidot.com/theme:syntech`
- Twin Files: `scp-wiki.wikidot.com/theme:twin-files`
- Inkblot: `scp-wiki.wikidot.com/theme:inkblot`
- Turbo Vision / TURBODARK: `scp-wiki.wikidot.com/theme:turbo-vision`

### Format Screw 페이지 (영문)

- SCP-3001: `scp-wiki.wikidot.com/scp-3001`
- SCP-5000: `scp-wiki.wikidot.com/scp-5000`
- SCP-1730: `scp-wiki.wikidot.com/scp-1730`
- SCP-2747: `scp-wiki.wikidot.com/scp-2747`
- SCP-3211: `scp-wiki.wikidot.com/scp-3211`
- SCP-2521: `scp-wiki.wikidot.com/scp-2521`
- SCP-2317: `scp-wiki.wikidot.com/scp-2317`
- SCP-7785: `scp-wiki.wikidot.com/scp-7785`

### Format Screw — 다른 언어권

- SCP-503-KO: `scpko.wikidot.com/scp-503-ko`
- SCP-1397-RU: `scp-ru.wikidot.com/scp-1397`

### SCP-001 영문 제안

- 진입: `scp-wiki.wikidot.com/scp-001`
- McDoctorate's Proposal: `scp-wiki.wikidot.com/mcdoctorates-proposal`

### SCP-001-KO 한국 제안

- 진입: `scpko.wikidot.com/scp-001`

### 한국 SCP-KO (커스텀 스타일 확인 항목)

| 식별 | URL |
|---|---|
| SCP-287-KO | `scpko.wikidot.com/scp-287-ko` |
| SCP-403-KO | `scpko.wikidot.com/scp-403-ko` |
| SCP-406-KO | `scpko.wikidot.com/scp-406-ko` |
| SCP-416-KO | `scpko.wikidot.com/scp-416-ko` |
| SCP-434-KO | `scpko.wikidot.com/scp-434-ko` |
| SCP-503-KO | `scpko.wikidot.com/scp-503-ko` |
| SCP-903-KO | `scpko.wikidot.com/scp-903-ko` |

---

## 부록 B. 본 문서의 한계

본 문서를 사용할 때 알아둬야 할 한계.

1. **시각 자료 없음.** SCP 위키는 robots.txt 정책으로 인해 외부에서 페이지 캡처가 불가하다. 모든 시각 확인은 노스가 직접 링크를 열어 수행.

2. **테마 위치 변동.** SCP 위키의 일부 테마는 위치가 이동되거나 이름이 변경될 수 있다. URL이 깨질 경우 위키 검색에서 테마 이름으로 재검색.

3. **한국 SCP-KO 커스텀 스타일 확인 완료.** §5.2의 한국 SCP 항목들은 실제 HTML CSS를 확인해 커스텀 스타일이 확인된 페이지만 남겨두었다. 다만 일부 항목(SCP-503-KO)은 CSS 커스텀 없이 구조적 Format Screw 방식으로, 시각적 CSS 변형보다 문서 구조 자체의 변형이 특징이다.

4. **본 문서는 카탈로그.** 본 문서 자체는 *어디를 봐야 하는지의 지도*이며, *무엇을 결정해야 하는지에 대한 안내*다. **결정 자체는 노스가 §7의 루브릭을 들고 페이지를 직접 보면서 수행해야 함.**

5. **저작권 주의.** SCP 위키의 콘텐츠는 CC BY-SA 3.0이다. 디자인 *컨셉·구조·미학*은 학습·참조 가능하나, CSS 코드를 그대로 복사하면 라이선스 표기 의무가 발생한다. 노스 프로젝트의 CSS는 SCP 테마를 *참고해 새로 작성*하는 것을 권장.

---

## 부록 C. 후속 작업 후보

본 문서 1차 검토 후 노스가 진행할 수 있는 후속 작업.

1. **디자인 결정 축 문서화** — 직전 대화에서 제시한 6~8개 결정 축에 본 문서의 사례를 인용하면서 노스의 입장을 명문화. 결과물은 `웹사이트_디자인_헌법.md` 같은 새 문서.

2. **앵커 페이지 디자인 옵션 ABC** — 본국 개요 페이지 1장에 대해 *세 가지 디자인 옵션*을 LLM이 작성. 각 옵션이 본 문서의 어느 테마에서 영감을 받았는지 명시.

3. **샘플 평가** — 노스가 이미 만들어둔 LLM 디자인 샘플들을 §7 루브릭으로 평가.

4. **한국어 폰트 매핑** — SCP 테마들의 영문 폰트 선택(Telex, Source Sans 3, IBM Plex 등)에 대응되는 한국어 폰트(Pretendard, Noto Sans KR, Spoqa Han Sans 등) 매핑표 작성.

5. **저작권 안전한 CSS 베이스 작성** — 본 문서의 분석을 바탕으로 노스 프로젝트 전용 CSS 토큰 정의 (라이선스 충돌 없는 새 작성).

진행 방향이 정해지면 본 문서에 *후속 결정 이력*을 추가해가며 사용.

---

*문서 끝.*