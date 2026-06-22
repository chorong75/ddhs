/**
 * app.js  –  선택과목 상담 도구 메인 로직
 */

const PASSWORD = "daedeok0370";

/* ────────────────────────────────────────────
   상태(State)
──────────────────────────────────────────── */
const state = {
  currentStep: 1,
  activeSemester: null,
  selectedCourses: {},
  selectedMajor: null,
};

/* ────────────────────────────────────────────
   초기화
──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  setupStepNav();
  showHome();
});

/* ────────────────────────────────────────────
   홈 / 페이지 전환
──────────────────────────────────────────── */
function showHome() {
  document.getElementById("homePage").classList.remove("hidden");
  document.getElementById("schedulePage").classList.add("hidden");
  document.getElementById("counselPage").classList.add("hidden");
  document.getElementById("headerMode").textContent = "";
}

function goHome() {
  if (!confirm("홈으로 돌아가면 현재 작업 내용이 사라질 수 있습니다. 계속하시겠습니까?")) return;
  showHome();
}

function enterSchedule() {
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("counselPage").classList.add("hidden");
  document.getElementById("schedulePage").classList.remove("hidden");
  document.getElementById("headerMode").textContent = "📚 편제표 확인";
  setTimeout(() => renderSchedule(), 50);
}

function enterCounsel() {
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("schedulePage").classList.add("hidden");
  document.getElementById("counselPage").classList.remove("hidden");
  document.getElementById("headerMode").textContent = "🗂️ 교사 상담 도구";
  setupStepNav();
}

/* ────────────────────────────────────────────
   비밀번호 모달
──────────────────────────────────────────── */
function showPasswordModal() {
  document.getElementById("passwordModal").classList.remove("hidden");
  document.getElementById("passwordInput").value = "";
  document.getElementById("passwordError").classList.add("hidden");
  setTimeout(() => document.getElementById("passwordInput").focus(), 100);
}

function closePasswordModal() {
  document.getElementById("passwordModal").classList.add("hidden");
}

function checkPassword() {
  const val = document.getElementById("passwordInput").value;
  if (val === PASSWORD) {
    closePasswordModal();
    enterCounsel();
  } else {
    document.getElementById("passwordError").classList.remove("hidden");
    document.getElementById("passwordInput").value = "";
    document.getElementById("passwordInput").focus();
  }
}

/* ────────────────────────────────────────────
   편제표 페이지 렌더링
──────────────────────────────────────────── */
function renderSchedule() {
  const year = document.getElementById("scheduleYear").value;
  const grade = parseInt(document.getElementById("scheduleGrade").value);
  const semester = parseInt(document.getElementById("scheduleSemester").value);

  const data = schoolCourses.find(c =>
    c.admissionYear === year && c.grade === grade && c.semester === semester
  );

  const container = document.getElementById("scheduleGrid");

  if (!data) {
    container.innerHTML = `<div class="card" style="text-align:center;color:var(--c-text-mute);padding:30px;">해당 학기의 편제 데이터가 없습니다.</div>`;
    return;
  }

  container.innerHTML = data.sections.map(section => {
    const isCommon = section.type === "common";
    const courseTags = section.courses.map(c => `
      <div class="schedule-course-item">
        <span class="schedule-course-name">${c.name}</span>
        <span class="schedule-course-credit">${c.credits}단위</span>
      </div>
    `).join("");

    return `
      <div class="course-section ${isCommon ? "common-section" : ""}">
        <div class="course-section-header">
          <span class="section-name">
            ${isCommon ? "📌" : "📂"} ${section.name}
            ${!isCommon ? `<span class="section-badge">택 ${section.pickCount}</span>` : ""}
          </span>
          <span class="section-counter" style="color:var(--c-text-mute)">
            ${isCommon ? "공통 이수" : `${section.courses.length}개 과목`}
          </span>
        </div>
        <div class="schedule-course-list">${courseTags}</div>
      </div>`;
  }).join("");
}

/* ────────────────────────────────────────────
   스텝 이동 (상담 페이지)
──────────────────────────────────────────── */
function goStep(n) {
  if (n > 1 && !getStudentName()) {
    alert("학생 이름을 입력해 주세요.");
    return;
  }
  document.querySelectorAll(".step-panel").forEach(p => p.classList.remove("active"));
  document.getElementById(`step${n}`).classList.add("active");
  state.currentStep = n;
  updateStepNav(n);
  if (n === 3) {
    if (!state.activeSemester) pickDefaultSemester();
    renderCourseGrid();
  }
  if (n === 4) renderResult();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupStepNav() {
  document.querySelectorAll(".step-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const step = parseInt(btn.dataset.step);
      if (step <= state.currentStep || step === state.currentStep + 1) goStep(step);
    });
  });
}

function updateStepNav(current) {
  document.querySelectorAll(".step-tab").forEach(btn => {
    const n = parseInt(btn.dataset.step);
    btn.classList.remove("active", "done");
    if (n === current) btn.classList.add("active");
    else if (n < current) btn.classList.add("done");
  });
}

/* ────────────────────────────────────────────
   학생 정보 헬퍼
──────────────────────────────────────────── */
function getAdmissionYear() { return document.getElementById("admissionYear").value; }
function getGrade()         { return parseInt(document.getElementById("grade").value); }
function getStudentName()   { return document.getElementById("studentName").value.trim(); }
function getStudentInfo() {
  return {
    admissionYear: getAdmissionYear(),
    grade: getGrade(),
    classNum: document.getElementById("classNum").value || "—",
    studentNum: document.getElementById("studentNum").value || "—",
    name: getStudentName(),
  };
}

/* ────────────────────────────────────────────
   STEP 2: 관심학과 검색
──────────────────────────────────────────── */
function searchMajors() {
  const query = document.getElementById("majorSearch").value.trim().toLowerCase();
  const resultEl = document.getElementById("majorSearchResults");
  if (!query) { resultEl.classList.add("hidden"); return; }

  const hits = majorRecommendations.filter(m =>
    m.name.toLowerCase().includes(query) ||
    m.keywords.some(k => k.toLowerCase().includes(query)) ||
    m.category.toLowerCase().includes(query)
  );

  resultEl.classList.remove("hidden");
  if (hits.length === 0) {
    resultEl.innerHTML = `<div class="search-empty">검색 결과가 없습니다. 다른 키워드를 시도해 보세요.</div>`;
    return;
  }
  resultEl.innerHTML = hits.map(m => `
    <div class="search-result-item" onclick="selectMajor('${m.id}')">
      <span class="result-dept">${m.name}</span>
      <span class="result-category">${m.category}</span>
    </div>
  `).join("");
}

function selectMajor(id) {
  const major = majorRecommendations.find(m => m.id === id);
  if (!major) return;
  state.selectedMajor = major;
  document.getElementById("majorSearch").value = major.name;
  document.getElementById("majorSearchResults").classList.add("hidden");
  document.getElementById("selectedMajorName").textContent = major.name;
  document.getElementById("majorRecommendedCourses").innerHTML =
    major.recommended.map(c => `<span class="course-tag">📌 ${c}</span>`).join("");
  document.getElementById("majorCounselingNote").textContent = major.counselingNote;
  document.getElementById("selectedMajorInfo").classList.remove("hidden");
  if (state.currentStep === 3) renderCourseGrid();
}

function clearMajor() {
  state.selectedMajor = null;
  document.getElementById("majorSearch").value = "";
  document.getElementById("selectedMajorInfo").classList.add("hidden");
  if (state.currentStep === 3) renderCourseGrid();
}

/* ────────────────────────────────────────────
   STEP 3: 학기 탭
──────────────────────────────────────────── */
function getAvailableSemesters() {
  const year = getAdmissionYear();
  const grade = getGrade();
  return schoolCourses
    .filter(c => c.admissionYear === year && c.grade === grade)
    .map(c => c.semester)
    .sort();
}

function renderSemesterTabs() {
  const semesters = getAvailableSemesters();
  const container = document.getElementById("semesterTabs");
  if (semesters.length === 0) {
    container.innerHTML = `<span style="color:var(--c-text-mute);font-size:14px;padding:8px 12px;">해당 학년·입학년도의 편제 데이터가 없습니다.</span>`;
    return;
  }
  container.innerHTML = semesters.map(sem => `
    <button class="semester-tab ${isActiveSem(sem) ? "active" : ""}" onclick="switchSemester(${sem})">
      ${getGrade()}학년 ${sem}학기
    </button>
  `).join("");
}

function isActiveSem(sem) {
  return state.activeSemester && state.activeSemester.semester === sem;
}

function pickDefaultSemester() {
  const sems = getAvailableSemesters();
  if (sems.length > 0) state.activeSemester = { grade: getGrade(), semester: sems[0] };
}

function switchSemester(sem) {
  state.activeSemester = { grade: getGrade(), semester: sem };
  renderSemesterTabs();
  renderCourseGrid();
}

/* ────────────────────────────────────────────
   STEP 3: 편제표 렌더링
──────────────────────────────────────────── */
function getCourseData() {
  if (!state.activeSemester) return null;
  const { semester } = state.activeSemester;
  return schoolCourses.find(c =>
    c.admissionYear === getAdmissionYear() &&
    c.grade === getGrade() &&
    c.semester === semester
  );
}

function courseKey(sem, sIdx, courseName) {
  return `${getGrade()}-${sem}-${sIdx}-${courseName}`;
}

function isSelected(key) { return !!state.selectedCourses[key]; }

function toggleCourse(key, sIdx, max) {
  const sem = state.activeSemester.semester;
  const prefix = `${getGrade()}-${sem}-${sIdx}-`;
  const count = Object.keys(state.selectedCourses)
    .filter(k => k.startsWith(prefix) && state.selectedCourses[k]).length;

  if (state.selectedCourses[key]) {
    state.selectedCourses[key] = false;
  } else {
    if (count >= max) {
      alert(`이 영역에서 최대 ${max}개까지 선택할 수 있습니다.`);
      return;
    }
    state.selectedCourses[key] = true;
  }
  renderCourseGrid();
}

function getRecommendedSet() {
  if (!state.selectedMajor) return new Set();
  return new Set(state.selectedMajor.recommended);
}

function renderCourseGrid() {
  const data = getCourseData();
  const container = document.getElementById("courseGrid");
  if (!data) {
    container.innerHTML = `<div class="card" style="text-align:center;color:var(--c-text-mute);padding:30px;">해당 학기의 편제 데이터가 없습니다.</div>`;
    return;
  }
  const recommended = getRecommendedSet();
  const sem = data.semester;

  container.innerHTML = data.sections.map((section, sIdx) => {
    const isCommon = section.type === "common";
    const prefix = `${getGrade()}-${sem}-${sIdx}-`;
    const selectedCount = isCommon ? 0 :
      Object.keys(state.selectedCourses).filter(k => k.startsWith(prefix) && state.selectedCourses[k]).length;
    const full = !isCommon && selectedCount >= section.pickCount;

    const courseBtns = section.courses.map(course => {
      const key = courseKey(sem, sIdx, course.name);
      const sel = isSelected(key);
      const rec = recommended.has(course.name);
      if (isCommon) {
        return `<button class="course-btn" style="cursor:default;opacity:.85;" disabled>
          ${course.name}<span class="credit-badge">${course.credits}단위</span>
        </button>`;
      }
      return `<button
        class="course-btn ${sel ? "selected" : ""} ${rec && !sel ? "recommended" : ""}"
        onclick="toggleCourse('${key}', ${sIdx}, ${section.pickCount})"
        title="${rec ? "⭐ 관심학과 권장과목" : ""}">
        ${rec ? `<span class="star-badge">⭐</span>` : ""}
        ${course.name}
        <span class="credit-badge">${course.credits}단위</span>
      </button>`;
    }).join("");

    return `
      <div class="course-section ${isCommon ? "common-section" : ""}">
        <div class="course-section-header">
          <span class="section-name">
            ${isCommon ? "📌" : "📂"} ${section.name}
            ${!isCommon ? `<span class="section-badge">택 ${section.pickCount}</span>` : ""}
          </span>
          ${!isCommon
            ? `<span class="section-counter ${full ? "full" : ""}">${full ? "✅ 선택 완료" : `${selectedCount} / ${section.pickCount} 선택`}</span>`
            : `<span class="section-counter" style="color:var(--c-text-mute)">공통 이수</span>`}
        </div>
        <div class="course-button-group">${courseBtns}</div>
      </div>`;
  }).join("");

  renderSemesterTabs();
}

/* ────────────────────────────────────────────
   STEP 4: 결과 렌더링
──────────────────────────────────────────── */
function renderResult() {
  const info = getStudentInfo();
  const major = state.selectedMajor;
  const recommended = getRecommendedSet();
  const memo = document.getElementById("counselingMemo").value;

  const semesters = getAvailableSemesters();
  const semesterSummaries = [];

  semesters.forEach(sem => {
    const data = schoolCourses.find(c =>
      c.admissionYear === info.admissionYear && c.grade === info.grade && c.semester === sem
    );
    if (!data) return;
    const chosen = [];
    data.sections.forEach((section, sIdx) => {
      if (section.type === "common") {
        section.courses.forEach(c => chosen.push({ name: c.name, common: true }));
      } else {
        const prefix = `${info.grade}-${sem}-${sIdx}-`;
        section.courses.forEach(c => {
          if (state.selectedCourses[`${prefix}${c.name}`]) chosen.push({ name: c.name, common: false });
        });
      }
    });
    semesterSummaries.push({ semester: sem, courses: chosen });
  });

  const semesterBlocks = semesterSummaries.map(s => {
    const tags = s.courses.map(c => {
      if (c.common) return `<span class="result-course-tag" style="opacity:.7">${c.name}</span>`;
      const linked = recommended.has(c.name);
      return `<span class="result-course-tag ${linked ? "linked" : ""}">${linked ? "⭐ " : ""}${c.name}</span>`;
    }).join("");
    const selectedCount = s.courses.filter(c => !c.common).length;
    return `
      <div class="result-semester-block">
        <div class="result-semester-title">
          📅 ${info.grade}학년 ${s.semester}학기
          <span style="font-size:12px;font-weight:500;color:var(--c-text-mute)">선택과목 ${selectedCount}개</span>
        </div>
        <div class="result-course-list">${tags || '<span class="no-selection">선택된 과목이 없습니다.</span>'}</div>
      </div>`;
  }).join("");

  const allSelected = new Set();
  Object.entries(state.selectedCourses).forEach(([k, v]) => {
    if (v) allSelected.add(k.split("-").slice(3).join("-"));
  });
  const linkedCourses = [...recommended].filter(r => allSelected.has(r));
  const linkedHTML = linkedCourses.length
    ? linkedCourses.map(c => `<span class="result-course-tag linked">⭐ ${c}</span>`).join("")
    : `<span class="no-selection">권장과목과 일치하는 선택과목이 없습니다.</span>`;

  document.getElementById("resultContent").innerHTML = `
    <div class="result-block">
      <div class="result-block-title">학생 정보</div>
      <div class="result-info-grid">
        <div class="result-info-item"><div class="result-info-label">이름</div><div class="result-info-value">${info.name || "—"}</div></div>
        <div class="result-info-item"><div class="result-info-label">학년 / 반 / 번호</div><div class="result-info-value">${info.grade}학년 ${info.classNum}반 ${info.studentNum}번</div></div>
        <div class="result-info-item"><div class="result-info-label">입학년도</div><div class="result-info-value">${info.admissionYear}년 입학</div></div>
      </div>
    </div>
    <div class="result-block">
      <div class="result-block-title">관심학과 및 권장과목</div>
      ${major ? `
        <div style="margin-bottom:12px;">
          <span style="font-size:15px;font-weight:700;color:var(--c-primary)">${major.name}</span>
          <span style="font-size:12px;margin-left:8px;color:var(--c-text-mute)">${major.category}</span>
        </div>
        <div class="tag-list" style="margin-bottom:12px;">${major.recommended.map(c => `<span class="course-tag">📌 ${c}</span>`).join("")}</div>
        <div class="counseling-note">${major.counselingNote}</div>
      ` : `<span class="no-selection">관심학과를 선택하지 않았습니다.</span>`}
    </div>
    <div class="result-block">
      <div class="result-block-title">학기별 선택과목</div>
      ${semesterBlocks || `<span class="no-selection">선택된 과목이 없습니다.</span>`}
      <div style="margin-top:10px;font-size:12px;color:var(--c-text-mute)">⭐ 표시는 관심학과 권장과목과 일치하는 과목입니다. (참고용)</div>
    </div>
    <div class="result-block">
      <div class="result-block-title">권장과목 연계 현황</div>
      <div class="result-course-list">${linkedHTML}</div>
      <div style="margin-top:10px;font-size:12px;color:var(--c-text-mute)">권장과목 연계는 입시 기준이 아닌 상담 참고용입니다.</div>
    </div>
    <div class="result-block">
      <div class="result-block-title">교사 상담 메모</div>
      <div class="result-memo">${memo || "작성된 메모가 없습니다."}</div>
    </div>
  `;
}

/* ────────────────────────────────────────────
   PDF 다운로드
──────────────────────────────────────────── */
function downloadPDF() {
  const info = getStudentInfo();
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")}`;
  const pdfSource = document.getElementById("resultContent").cloneNode(true);
  const wrap = document.createElement("div");
  wrap.style.cssText = "font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; padding: 30px; color: #1A2030;";
  const header = document.createElement("div");
  header.style.cssText = "border-bottom: 2px solid #2C5FD4; padding-bottom: 16px; margin-bottom: 24px;";
  header.innerHTML = `
    <div style="font-size:20px;font-weight:700;color:#2C5FD4;">선택과목 상담 기록 · 대덕고등학교</div>
    <div style="font-size:13px;color:#5A657A;margin-top:4px;">2022 개정 교육과정 기반 · 작성일: ${dateStr}</div>
  `;
  wrap.appendChild(header);
  wrap.appendChild(pdfSource);
  const opt = {
    margin: [10, 10],
    filename: `선택과목_상담기록_${info.name || "학생"}_${dateStr}.pdf`,
    image: { type: "jpeg", quality: 0.97 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(wrap).save();
}

/* ────────────────────────────────────────────
   새 상담 시작
──────────────────────────────────────────── */
function resetAll() {
  if (!confirm("새 상담을 시작하면 현재 입력 내용이 모두 초기화됩니다. 계속하시겠습니까?")) return;
  document.getElementById("studentName").value = "";
  document.getElementById("classNum").value = "";
  document.getElementById("studentNum").value = "";
  document.getElementById("majorSearch").value = "";
  document.getElementById("selectedMajorInfo").classList.add("hidden");
  document.getElementById("majorSearchResults").classList.add("hidden");
  document.getElementById("counselingMemo").value = "";
  state.currentStep = 1;
  state.activeSemester = null;
  state.selectedCourses = {};
  state.selectedMajor = null;
  goStep(1);
}
