/**
 * ============================================================
 *  data.js  –  선택과목 상담 도구 데이터
 * ============================================================
 *
 *  ◆ 이 파일을 수정하여 학교 편제표와 학과 권장과목을 관리하세요.
 *  ◆ 추후 CSV/엑셀 데이터로 교체할 때 이 파일만 수정하면 됩니다.
 *
 * ────────────────────────────────────────────────────────────
 *  schoolCourses 구조
 *  {
 *    admissionYear: "2025",        // 입학년도
 *    grade: 2,                     // 학년 (숫자)
 *    semester: 1,                  // 학기 (1 또는 2)
 *    sections: [                   // 선택 영역 목록
 *      {
 *        name: "선택 영역 1",      // 영역 이름
 *        type: "select" | "common", // select=선택, common=공통(고정)
 *        pickCount: 3,             // 선택 가능 과목 수 (select일 때만)
 *        courses: [
 *          { name: "문학과 영상", credits: 3 },
 *          ...
 *        ]
 *      }
 *    ]
 *  }
 * ────────────────────────────────────────────────────────────
 */

const schoolCourses = [
  /* ══════════════ 2025 입학 · 2학년 1학기 ══════════════ */
  {
    admissionYear: "2025", grade: 2, semester: 1,
    sections: [
      {
        name: "학년 공통",
        type: "common",
        courses: [
          { name: "문학", credits: 4 },
          { name: "대수", credits: 4 },
          { name: "미적분 I", credits: 4 },
          { name: "영어 I", credits: 4 },
          { name: "스포츠 생활1", credits: 2 },
        ]
      },
      {
        name: "선택 영역 1",
        type: "select",
        pickCount: 1,
        courses: [
          { name: "세계사", credits: 3 },
          { name: "사회와 문화", credits: 3 },
          { name: "현대사회와 윤리", credits: 3 },
          { name: "물리학", credits: 3 },
          { name: "화학", credits: 3 },
          { name: "생명과학", credits: 3 },
          { name: "지구과학", credits: 3 },
          { name: "정보과학", credits: 3 },
          { name: "데이터 과학", credits: 3 },
        ]
      },
      {
        name: "선택 영역 2",
        type: "select",
        pickCount: 1,
        courses: [
          { name: "일본어", credits: 3 },
          { name: "중국어", credits: 3 },
        ]
      },
    ]
  },
  /* ══════════════ 2025 입학 · 2학년 2학기 ══════════════ */
  {
    admissionYear: "2025", grade: 2, semester: 2,
    sections: [
      {
        name: "학년 공통",
        type: "common",
        courses: [
          { name: "독서와 작문", credits: 4 },
          { name: "미적분 II", credits: 4 },
          { name: "영어 II", credits: 4 },
          { name: "스포츠 생활2", credits: 2 },
        ]
      },
      {
        name: "선택 영역 1",
        type: "select",
        pickCount: 1,
        courses: [
          { name: "경제", credits: 3 },
          { name: "정치와 법", credits: 3 },
          { name: "생활과 윤리", credits: 3 },
          { name: "물리학 실험", credits: 3 },
          { name: "화학 실험", credits: 3 },
          { name: "생명과학 실험", credits: 3 },
          { name: "AI 수학", credits: 3 },
          { name: "확률과 통계", credits: 3 },
        ]
      },
      {
        name: "선택 영역 2",
        type: "select",
        pickCount: 1,
        courses: [
          { name: "일본어 II", credits: 3 },
          { name: "중국어 II", credits: 3 },
        ]
      },
    ]
  },
  /* ══════════════ 2025 입학 · 3학년 1학기 ══════════════ */
  {
    admissionYear: "2025", grade: 3, semester: 1,
    sections: [
      {
        name: "선택 영역 1",
        type: "select",
        pickCount: 3,
        courses: [
          { name: "문학과 영상", credits: 3 },
          { name: "독서 토론과 글쓰기", credits: 3 },
          { name: "인공지능 수학", credits: 3 },
          { name: "실용 통계", credits: 3 },
          { name: "심화 영어 독해와 작문", credits: 3 },
          { name: "심화 영어", credits: 3 },
        ]
      },
      {
        name: "선택 영역 2",
        type: "select",
        pickCount: 4,
        courses: [
          { name: "여행지리", credits: 3 },
          { name: "역사로 탐구하는 현대 세계", credits: 3 },
          { name: "사회문제 탐구", credits: 3 },
          { name: "윤리문제 탐구", credits: 3 },
          { name: "기후변화와 지속가능한 세계", credits: 3 },
          { name: "과학의 역사와 문화", credits: 3 },
          { name: "융합과학 탐구", credits: 3 },
          { name: "기후변화와 환경생태", credits: 3 },
          { name: "인공지능 일반", credits: 3 },
          { name: "사회컨디션과 생시세이어", credits: 3 },
        ]
      },
      {
        name: "선택 영역 3",
        type: "select",
        pickCount: 1,
        courses: [
          { name: "음악과 미디어", credits: 2 },
          { name: "미술과 매체", credits: 2 },
        ]
      },
      {
        name: "선택 영역 4",
        type: "select",
        pickCount: 1,
        courses: [
          { name: "논리와 사고", credits: 2 },
          { name: "교육의 이해", credits: 2 },
          { name: "논술", credits: 2 },
        ]
      },
    ]
  },
  /* ══════════════ 2025 입학 · 3학년 2학기 ══════════════ */
  {
    admissionYear: "2025", grade: 3, semester: 2,
    sections: [
      {
        name: "선택 영역 1",
        type: "select",
        pickCount: 3,
        courses: [
          { name: "문학과 영상", credits: 3 },
          { name: "독서 토론과 글쓰기", credits: 3 },
          { name: "인공지능 수학", credits: 3 },
          { name: "실용 통계", credits: 3 },
          { name: "심화 영어 독해와 작문", credits: 3 },
          { name: "심화 영어", credits: 3 },
        ]
      },
      {
        name: "선택 영역 2",
        type: "select",
        pickCount: 3,
        courses: [
          { name: "여행지리", credits: 3 },
          { name: "역사로 탐구하는 현대 세계", credits: 3 },
          { name: "사회문제 탐구", credits: 3 },
          { name: "윤리문제 탐구", credits: 3 },
          { name: "기후변화와 지속가능한 세계", credits: 3 },
          { name: "과학의 역사와 문화", credits: 3 },
          { name: "융합과학 탐구", credits: 3 },
        ]
      },
      {
        name: "선택 영역 3",
        type: "select",
        pickCount: 1,
        courses: [
          { name: "음악과 미디어", credits: 2 },
          { name: "미술과 매체", credits: 2 },
        ]
      },
      {
        name: "선택 영역 4",
        type: "select",
        pickCount: 1,
        courses: [
          { name: "논리와 사고", credits: 2 },
          { name: "교육의 이해", credits: 2 },
          { name: "논술", credits: 2 },
        ]
      },
    ]
  },
  /* ══════════════ 2024 입학 · 3학년 1학기 ══════════════ */
  {
    admissionYear: "2024", grade: 3, semester: 1,
    sections: [
      {
        name: "선택 영역 1",
        type: "select",
        pickCount: 3,
        courses: [
          { name: "문학과 영상", credits: 3 },
          { name: "독서 토론과 글쓰기", credits: 3 },
          { name: "인공지능 수학", credits: 3 },
          { name: "실용 통계", credits: 3 },
          { name: "심화 영어", credits: 3 },
        ]
      },
      {
        name: "선택 영역 2",
        type: "select",
        pickCount: 4,
        courses: [
          { name: "여행지리", credits: 3 },
          { name: "사회문제 탐구", credits: 3 },
          { name: "윤리문제 탐구", credits: 3 },
          { name: "기후변화와 지속가능한 세계", credits: 3 },
          { name: "과학의 역사와 문화", credits: 3 },
          { name: "인공지능 일반", credits: 3 },
        ]
      },
    ]
  },
];

/**
 * ============================================================
 *  majorRecommendations  –  관심학과별 권장과목 데이터
 * ============================================================
 *
 *  {
 *    id: "cs",                       // 고유 ID (영문, 소문자)
 *    name: "컴퓨터공학과",            // 학과 표시명
 *    category: "공학계열",            // 계열 분류
 *    keywords: ["컴퓨터", "AI", ...], // 검색 키워드
 *    recommended: ["인공지능 수학", ...],  // 권장 과목 이름 (schoolCourses의 과목명과 일치해야 ⭐ 표시)
 *    counselingNote: "..."            // 교사 참고 상담 문구
 *  }
 *
 * ────────────────────────────────────────────────────────────
 */

const majorRecommendations = [
  {
    id: "cs",
    name: "컴퓨터공학과",
    category: "공학계열",
    keywords: ["컴퓨터", "소프트웨어", "정보", "IT", "개발", "프로그래밍"],
    recommended: ["인공지능 수학", "실용 통계", "인공지능 일반", "정보과학", "데이터 과학", "AI 수학"],
    counselingNote: "수학 역량과 논리적 사고가 중요합니다. 인공지능·데이터 관련 과목을 우선 고려하고, 독서 토론 과목으로 글쓰기 역량도 키우면 좋습니다."
  },
  {
    id: "ai",
    name: "인공지능학과",
    category: "공학계열",
    keywords: ["AI", "인공지능", "머신러닝", "딥러닝"],
    recommended: ["인공지능 수학", "인공지능 일반", "실용 통계", "데이터 과학", "AI 수학", "확률과 통계"],
    counselingNote: "AI 분야는 수학·통계 기반이 중요합니다. 프로그래밍 경험을 쌓고 관련 대회나 프로젝트에 참여하면 유리합니다."
  },
  {
    id: "data",
    name: "데이터사이언스학과",
    category: "공학계열",
    keywords: ["데이터", "빅데이터", "통계", "분석"],
    recommended: ["실용 통계", "데이터 과학", "인공지능 수학", "AI 수학", "확률과 통계"],
    counselingNote: "통계와 수학 역량이 핵심입니다. 사회현상을 데이터로 분석하는 관점도 중요하여 사회 관련 과목과 연계하면 도움이 됩니다."
  },
  {
    id: "medicine",
    name: "의학과",
    category: "의학계열",
    keywords: ["의학", "의대", "의료", "의사"],
    recommended: ["생명과학", "화학", "생명과학 실험", "화학 실험", "융합과학 탐구"],
    counselingNote: "생명과학과 화학이 핵심 기반 과목입니다. 논리적 사고와 탐구 능력을 기르는 과목을 선택하고, 봉사 활동과 의료 현장 경험도 중요합니다."
  },
  {
    id: "pharmacy",
    name: "약학과",
    category: "의학계열",
    keywords: ["약학", "약대", "약사", "제약"],
    recommended: ["화학", "생명과학", "화학 실험", "생명과학 실험"],
    counselingNote: "화학과 생명과학을 중심으로 선택하세요. 약학대학원 체제 변화를 고려하여 학과 정보를 사전에 꼭 확인하길 권장합니다."
  },
  {
    id: "nursing",
    name: "간호학과",
    category: "의학계열",
    keywords: ["간호", "간호사", "보건"],
    recommended: ["생명과학", "생명과학 실험", "현대사회와 윤리", "생활과 윤리"],
    counselingNote: "돌봄의 가치와 윤리적 판단이 중요한 분야입니다. 생명과학 외에도 사회윤리 관련 과목으로 인문학적 소양을 키우면 좋습니다."
  },
  {
    id: "economics",
    name: "경제학과",
    category: "사회계열",
    keywords: ["경제", "경제학", "금융", "무역"],
    recommended: ["경제", "실용 통계", "확률과 통계", "사회문제 탐구", "세계사"],
    counselingNote: "경제학은 수학적 사고와 사회 현상 분석 능력이 모두 필요합니다. 시사 경제 뉴스를 꾸준히 읽는 습관을 기르도록 안내해 주세요."
  },
  {
    id: "business",
    name: "경영학과",
    category: "사회계열",
    keywords: ["경영", "마케팅", "경영학", "창업", "비즈니스"],
    recommended: ["경제", "사회문제 탐구", "독서 토론과 글쓰기", "논술"],
    counselingNote: "다양한 분야에 대한 관심과 소통 능력이 중요합니다. 리더십 경험과 글쓰기·토론 역량을 키우는 과목을 권장합니다."
  },
  {
    id: "law",
    name: "법학과",
    category: "사회계열",
    keywords: ["법학", "법", "법대", "변호사", "검사"],
    recommended: ["정치와 법", "생활과 윤리", "윤리문제 탐구", "논술", "논리와 사고", "독서 토론과 글쓰기"],
    counselingNote: "논리적 글쓰기와 비판적 사고가 핵심입니다. 시사 법률 문제에 관심을 갖고 토론 활동에 적극 참여하도록 독려해 주세요."
  },
  {
    id: "sociology",
    name: "사회학과",
    category: "사회계열",
    keywords: ["사회학", "사회", "복지", "문화"],
    recommended: ["사회와 문화", "사회문제 탐구", "현대사회와 윤리", "생활과 윤리", "여행지리"],
    counselingNote: "사회 현상을 비판적으로 바라보는 시각이 중요합니다. 다양한 사회 문제에 관심을 갖고 실제 사례를 탐구하는 활동을 권장합니다."
  },
  {
    id: "education",
    name: "교육학과",
    category: "교육계열",
    keywords: ["교육", "교육학", "교사", "사범"],
    recommended: ["교육의 이해", "논술", "논리와 사고", "생활과 윤리", "독서 토론과 글쓰기"],
    counselingNote: "교육에 대한 깊은 이해와 소통 능력이 중요합니다. 교육 봉사 활동이나 멘토링 경험을 쌓는 것을 적극 권장합니다."
  },
  {
    id: "korean-edu",
    name: "국어교육과",
    category: "교육계열",
    keywords: ["국어교육", "국어", "국문", "문학"],
    recommended: ["문학과 영상", "독서 토론과 글쓰기", "논술", "논리와 사고"],
    counselingNote: "독서량과 글쓰기 역량이 중요합니다. 다양한 장르의 책을 읽고, 교내 글쓰기 대회나 문예 활동에 참여하면 포트폴리오에 도움이 됩니다."
  },
  {
    id: "math-edu",
    name: "수학교육과",
    category: "교육계열",
    keywords: ["수학교육", "수학", "수학과"],
    recommended: ["인공지능 수학", "실용 통계", "AI 수학", "확률과 통계", "논리와 사고"],
    counselingNote: "수학적 사고력과 설명하는 능력이 모두 중요합니다. 수학 개념을 쉽게 설명하는 연습을 꾸준히 하도록 안내해 주세요."
  },
  {
    id: "environment",
    name: "환경학과",
    category: "자연계열",
    keywords: ["환경", "생태", "기후", "지구", "환경공학"],
    recommended: ["기후변화와 지속가능한 세계", "기후변화와 환경생태", "융합과학 탐구", "지구과학", "생명과학"],
    counselingNote: "기후·환경 문제에 대한 관심이 핵심입니다. 환경 관련 동아리나 캠페인 활동, 탄소중립 프로젝트 참여를 권장합니다."
  },
  {
    id: "architecture",
    name: "건축학과",
    category: "공학계열",
    keywords: ["건축", "건축학", "도시", "설계"],
    recommended: ["물리학", "실용 통계", "미술과 매체", "융합과학 탐구"],
    counselingNote: "공학적 사고와 예술적 감각이 함께 필요한 분야입니다. 수학·물리학 기반을 탄탄히 하면서 미술 활동으로 공간 감각을 키우도록 안내해 주세요."
  },
  {
    id: "art",
    name: "미술학과",
    category: "예체능계열",
    keywords: ["미술", "디자인", "미대", "시각", "조형"],
    recommended: ["미술과 매체", "음악과 미디어", "문학과 영상", "과학의 역사와 문화"],
    counselingNote: "포트폴리오 준비가 입시에 중요합니다. 다양한 매체 실습과 함께 예술사·문화에 대한 폭넓은 지식을 쌓도록 안내해 주세요."
  },
  {
    id: "music",
    name: "음악학과",
    category: "예체능계열",
    keywords: ["음악", "작곡", "음악과", "실용음악"],
    recommended: ["음악과 미디어", "문학과 영상", "과학의 역사와 문화"],
    counselingNote: "실기 준비가 핵심이지만, 음악 이론과 역사에 대한 이해도 중요합니다. 교내 음악 활동과 연주 경험을 꾸준히 쌓도록 권장합니다."
  },
  {
    id: "global",
    name: "국제학부",
    category: "사회계열",
    keywords: ["국제", "글로벌", "외교", "국제관계"],
    recommended: ["세계사", "여행지리", "사회와 문화", "역사로 탐구하는 현대 세계", "심화 영어", "심화 영어 독해와 작문"],
    counselingNote: "영어 실력과 국제 감각이 중요합니다. 영어 심화 과목을 중점 선택하고, 다양한 국가의 역사·문화를 폭넓게 이해하도록 안내해 주세요."
  },
];
