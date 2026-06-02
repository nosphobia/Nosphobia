# 노스포비아 도구 안내서

LLM이 작성한 프로그램 도구 목록과 사용법.  
모든 도구는 순수 프로그램으로 작동하며 **LLM 호출 없음 / 토큰 발생 없음**.

---

## strip-html

HTML 파일에서 태그를 제거하고 텍스트만 추출한다.  
`<p>`, `<br>` 위치에 줄바꿈을 삽입하여 가독성을 유지한다.

**경로:** `infra/tools/scripts/strip-html.ts`

**사용법:**

```bash
cd e:/Nosphobia/infra/tools
npx ts-node scripts/strip-html.ts <파일경로>
```

**예시:**

```bash
npx ts-node scripts/strip-html.ts ../../reference/괴이현상_실종자수색연합/본편.txt
```

결과물은 입력 파일과 같은 경로에 `.txt` 확장자로 저장된다.  
입력 파일이 이미 `.txt`이면 덮어씌워지므로, HTML 원본은 `.html`로 저장하는 것을 권장한다.
