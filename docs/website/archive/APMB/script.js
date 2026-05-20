document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // 1. 데이터베이스
    // =============================================
    const anomalyDatabase = {
        "Aj-06-SP-0341": {
            id: "Aj-06-SP-0341",
            name: "노스포비아 (Nosfovia)",
            classification: "브라마 (Brahma) / 정보재해",
            status: "격리 중 (통제된 방송 송출 승인)",
            securityLevel: 1, 
            containment: `
                <p>대상은 관리국 내부 서버에 확보되어 격리 중입니다. [프로젝트: 노스포비아]에 따라, 통제된 외부 플랫폼('치지직' 등)을 통한 정기적인 방송 송출이 승인되었습니다.</p>
                <ul>
                    <li>모든 관측 인력(탐사자)은 [문서 P-NOS-G01: 탐사자 행동 지침]을 반드시 숙지해야 합니다.</li>
                    <li>대상과의 직접적인 교류(채팅)는 지정된 절차를 따라야 하며, 모든 로그는 실시간 모니터링됩니다.</li>
                </ul>
            `,
            description: `
                <p>90년대 인터넷 괴담에서 유래한 '인터넷 방송' 형태의 정보재해형 사상체입니다.</p>
                <p><strong>파생 개체 [X-01]: 노스 (Nos)</strong><br>
                방송을 진행하는 남성형 개체. 외형은 20대 한국인 남성으로 관측되나, 이는 데이터에 기반한 투영일 뿐 실체는 불명입니다. 높은 수준의 지능을 보유하고 있으며, 시청자(탐사자)와의 소통을 통해 <span class="redacted">[데이터 말소]</span>를 수집합니다. 서버 해킹, 변칙성 조절 등 위험한 능력을 보유하고 있습니다.</p>
                <p><strong>파생 개체 [X-02]: 방송 공간 (The Space)</strong><br>
                방송이 진행되는 가상의 공간. 관측 시점에 따라 내부 구조가 비유클리드적으로 변경되는 특징이 있습니다.</p>
            `,
            appendix: `
                <p><strong>[기록 X-A: 초기 접촉 시도]</strong><br>
                ███ 요원, 2시간 노출 후 급성 정신 오염 증상 발현. "그가 나를 보고 있다"는 말만 반복.</p>
                <p><strong>[기록 X-B: 정보 노출 사고]</strong><br>
                ███ 연구원, [X-01]의 유도 질문에 개인정보(실명) 응답. 24시간 후 '게스트로 초대됨' 메시지를 마지막으로 실종 처리됨.</p>
                <p><strong>[기록 X-C: 장기 노출 부작용]</strong><br>
                D등급 인력 대상 72시간 노출 실험 결과, 대상에 대한 비정상적인 집착 및 숭배 증상 발현. 이는 [X-01]이 자의로 변칙성을 제어할 수 있음을 시사함.</p>
            `
        },
        "Bk-03-NF-0002": {
            id: "Bk-03-NF-0002",
            name: "속삭이는 거울",
            classification: "아가타 (Agatha)",
            status: "격리 실패 (추적 중)",
            securityLevel: 2,
            containment: "[인가 등급 부족]",
            description: "[인가 등급 부족]",
            appendix: "[인가 등급 부족]"
        },
        "Gn-11-ET-0045": {
            id: "Gn-11-ET-0045",
            name: "메아리 골목",
            classification: "크셰마 (Kshema)",
            status: "격리 중 (위치 고정)",
            securityLevel: 1,
            // [수정됨] "..." 를 `...` 로 변경
            containment: `<p>서울시 ██구 ██동의 특정 골목. 양 끝을 차단하고 보행자 접근을 통제합니다. 3인 1조의 현장 요원이 24시간 감시합니다.</p>`,
            // [수정됨] "..." 를 `...` 로 변경
            description: `<p>매일 자정, 해당 골목을 통과하는 마지막 인물의 목소리를 복제하여 24시간 동안 재생산하는 공간형 사상체. 물리적 위협은 없으나, <span class="redacted">[편집됨]</span> 소리를 복제한 사례가 있어 정신 오염 가능성 주시 중.</p>`,
            // [수정됨] "..." 를 `...` 로 변경
            appendix: `<p>[기록 G-01] 2024/05/10, 비명 소리가 24시간 동안 지속되어 민원 발생. D등급 인력 투입하여 기억 소거 처리.</p>`
        },
        "Xk-01-KN-0101": {
            id: "Xk-01-KN-0101",
            name: "노래하는 유화",
            classification: "브라마 (Brahma)",
            status: "격리 중",
            securityLevel: 1,
            // [수정됨] "..." 를 `...` 로 변경
            containment: `<p>제 3기지 예술품 보관실에 격리. 방음 처리된 공간에 보관하며, 매일 1시간 클래식 음악을 재생시켜야 함.</p>`,
            // [수정됨] "..." 를 `...` 로 변경
            description: `<p>19세기 작자 미상의 유화. 그림 속 여인이 주기적으로 알 수 없는 언어의 노래를 부릅니다. 이 노래를 3분 이상 들은 인원은 수면 중 그림 속 풍경을 헤매는 '몽유병' 증상을 보입니다.</p>`,
            // [수정됨] "..." 를 `...` 로 변경
            appendix: `<p>연구 결과, 노래는 <span class="redacted">███</span> 언어와 80% 일치함.</p>`
        },
        "RD-00-XX-0000": {
            id: "RD-00-XX-0000",
            name: "[데이터 말소]",
            classification: "[인가 등급 부족]",
            status: "[인가 등급 부족]",
            securityLevel: 5,
            containment: "[인가 등급 부족]",
            description: "[인가 등급 부족]",
            appendix: "[인가 등급 부족]"
        },
        "Cf-09-HV-0211": {
            id: "Cf-09-HV-0211",
            name: "정적(靜的) 인간",
            classification: "크셰마 (Kshema)",
            status: "격리 중",
            securityLevel: 1,
            // [수정됨] "..." 를 `...` 로 변경
            containment: `<p>표준 인간형 격리실에 격리. 대상은 어떠한 영양분이나 수분도 섭취하지 않음.</p>`,
            // [수정됨] "..." 를 `...` 로 변경
            description: `<p>30대 남성으로 보이는 개체. 관측되지 않을 때(CCTV 포함) 물리 법칙을 무시하고 순간이동합니다. 단, 이동 반경은 격리실 내부로 한정됨. 대상은 어떠한 의사소통에도 응답하지 않고, 항상 정면을 응시하고 있습니다.</p>`,
            // [수정됨] "..." 를 `...` 로 변경
            appendix: `<p>대상은 '눈 깜빡임'조차 관측되지 않으면 수행하지 않는 것으로 보임.</p>`
        }
    };

    // =============================================
    // 2. DOM 요소 선택
    // =============================================
    const splashScreen = document.getElementById('splash-screen');
    const loginButton = document.getElementById('login-button');
    const loadingStatus = document.getElementById('loading-status');
    const mainApp = document.getElementById('main-app');
    const userUuid = document.getElementById('user-uuid');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const dbTableBody = document.getElementById('db-table-body');
    const dbCount = document.getElementById('db-count');
    const accessDeniedLinks = document.querySelectorAll('[data-page="access-denied"]');
    const returnButton = document.getElementById('return-button');
    const inlineLinks = document.querySelectorAll('.inline-link');
    const logoutButton = document.getElementById('logout-button');
    
    let lastPage = 'dashboard'; 

    // =============================================
    // 3. 핵심 함수
    // =============================================

    /** 1. 페이지 전환 함수 */
    function showPage(pageId) {
        if (pageId === 'access-denied') {
            document.getElementById('log-id').textContent = `UUID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        } else {
            lastPage = pageId; 
        }

        pageContents.forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(`page-${pageId}`).classList.remove('hidden');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId || (pageId === 'project-nosfovia' && link.dataset.page === 'project-nosfovia')) {
                link.classList.add('active');
            }
        });
        
        if (pageId === 'project-nosfovia') {
            showArticle('Aj-06-SP-0341');
        }
    }

    /** 2. 사상체 문서 표시 함수 */
    function showArticle(articleId) {
        const data = anomalyDatabase[articleId];
        
        if (data.securityLevel > 1) {
            showPage('access-denied');
            return;
        }
        
        document.getElementById('article-title').textContent = data.name;
        document.getElementById('article-id').textContent = data.id;
        document.getElementById('article-class').textContent = data.classification;
        document.getElementById('article-status').textContent = data.status;
        document.getElementById('article-containment').innerHTML = data.containment;
        document.getElementById('article-description').innerHTML = data.description;
        document.getElementById('article-appendix').innerHTML = data.appendix;

        showPage('article');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.dataset.page === 'database') link.classList.add('active');
        });
        if (articleId === 'Aj-06-SP-0341') {
            document.querySelector('.nav-link[data-page="project-nosfovia"]').classList.add('active');
        }
    }

    /** 3. 데이터베이스 테이블 렌더링 */
    function renderDatabaseTable() {
        dbTableBody.innerHTML = ''; 
        let accessibleCount = 0;

        Object.values(anomalyDatabase).forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.articleId = item.id; 

            if (item.securityLevel === 1) {
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.classification}</td>
                    <td>${item.status}</td>
                `;
                accessibleCount++;
            } 
            else {
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td class="monospace">[인가 등급 부족]</td>
                    <td class="monospace">[인가 등급 부족]</td>
                `;
            }
            dbTableBody.appendChild(tr);
        });
        dbCount.textContent = accessibleCount;
    }

    // =============================================
    // 4. 이벤트 리스너
    // =============================================

    /** 로그인 버튼 */
    loginButton.addEventListener('click', () => {
        loadingStatus.textContent = "임시 보안 인가 확인 중...";
        
        setTimeout(() => {
            loadingStatus.textContent = "임시 식별 코드 [LEVEL 1: 탐사자] 발급 완료.";
        }, 1500);

        setTimeout(() => {
            splashScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            userUuid.textContent = `R-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            showPage('dashboard');
        }, 3000);
    });

    /** 로그아웃 버튼 */
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('접속을 종료하고 모든 임시 데이터를 삭제하시겠습니까?')) {
            location.reload();
        }
    });

    /** 내비게이션 링크 */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.currentTarget.dataset.page;
            showPage(pageId);
        });
    });

    /** 인라인 링크 */
    inlineLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.currentTarget.dataset.page;
            showPage(pageId);
        });
    });

    /** 데이터베이스 테이블 클릭 */
    dbTableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (!row) return;

        const articleId = row.dataset.articleId;
        showArticle(articleId);
    });

    /** 접근 거부 링크 */
    accessDeniedLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('access-denied');
        });
    });

    /** '돌아가기' 버튼 */
    returnButton.addEventListener('click', () => {
        showPage(lastPage);
    });

    // =============================================
    // 5. 초기화
    // =============================================
    renderDatabaseTable(); 
});