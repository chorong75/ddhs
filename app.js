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

// 헤더 타이틀 클릭 시 현재 페이지에 따라 다르게 동작
function handleHeaderClick() {
  const scheduleVisible = !document.getElementById("schedulePage").classList.contains("hidden");
  const counselVisible  = !document.getElementById("counselPage").classList.contains("hidden");
  if (scheduleVisible) {
    goHomeFromSchedule();
  } else if (counselVisible) {
    goHomeFromCounsel();
  }
}

// 편제표에서 홈으로 (팝업 없음)
function goHomeFromSchedule() {
  showHome();
}

// 상담 페이지에서 홈으로 (팝업 있음)
function goHomeFromCounsel() {
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
   대학 권장 이수과목 모달
──────────────────────────────────────────── */

// 모달에서 임시로 체크된 항목 (key → {univ, college, dept, cols, c1, c2, c3})
const univTempSelected = new Map();
// 최종 확정된 항목
const univConfirmed = new Map();

function openUnivModal() {
  univTempSelected.clear();
  univConfirmed.forEach((v, k) => univTempSelected.set(k, v));
  document.getElementById("univModal").classList.remove("hidden");
  const searchEl = document.getElementById("univModalSearch");
  searchEl.value = "";
  // 이벤트 중복 방지: 기존 리스너 제거 후 재등록
  const newSearch = searchEl.cloneNode(true);
  searchEl.parentNode.replaceChild(newSearch, searchEl);
  newSearch.addEventListener("input", renderUnivModal);
  newSearch.focus();
  renderUnivModal();
}

function closeUnivModal() {
  document.getElementById("univModal").classList.add("hidden");
}

function closeUnivModalBg(e) {
  if (e.target === document.getElementById("univModal")) closeUnivModal();
}

function applyUnivSelection() {
  univConfirmed.clear();
  univTempSelected.forEach((v, k) => univConfirmed.set(k, v));
  renderUnivSelectedList();
  closeUnivModal();
}

function renderUnivSelectedList() {
  const list = document.getElementById("univSelectedList");
  const cards = document.getElementById("univSelectedCards");
  if (univConfirmed.size === 0) {
    list.classList.add("hidden");
    return;
  }
  list.classList.remove("hidden");
  cards.innerHTML = [...univConfirmed.values()].map(d => {
    const rows = [];
    d.cols.forEach((col, i) => {
      const v = [d.c1, d.c2, d.c3][i];
      if (v && v !== "미제시") rows.push(`<span style="font-size:11px;background:#E6F1FB;color:#185FA5;border-radius:20px;padding:2px 8px;margin:2px 2px 2px 0;display:inline-block;">${col}: ${v}</span>`);
    });
    return `<div style="background:#f5f8ff;border:1px solid #d0deff;border-radius:10px;padding:10px 12px;margin-bottom:8px;">
      <div style="font-size:13px;font-weight:600;color:var(--c-primary);margin-bottom:4px;">${d.univ} · ${d.dept}</div>
      <div style="font-size:11px;color:var(--c-text-mute);margin-bottom:6px;">${d.college}</div>
      <div>${rows.join("")}</div>
    </div>`;
  }).join("");
}

function univModalMakeKey(u, c, d) { return u + "||" + c + "||" + d; }

function univModalToggle(key, checked, deptData) {
  if (checked) univTempSelected.set(key, deptData);
  else univTempSelected.delete(key);
  const btn = document.getElementById("univAddBtn");
  if (univTempSelected.size > 0) {
    btn.classList.remove("hidden");
    btn.textContent = `선택 완료 (${univTempSelected.size}개) →`;
  } else {
    btn.classList.add("hidden");
  }
  const row = document.querySelector(`#univModalContent tr[data-key="${CSS.escape(key)}"]`);
  if (row) row.style.background = checked ? "var(--c-primary-light, #EEF3FF)" : "";
  const cb = document.querySelector(`#univModalContent tr[data-key="${CSS.escape(key)}"] input`);
  if (cb) cb.checked = checked;
}

const UNIV_DATA = [
  {
    id:"sogang", name:"서강대학교", hasRec:false,
    admYear:"2028학년도 대입", srcDate:"2025년 8월 29일 기준", srcDoc:"모집단위별 반영과목 안내",
    info:"서강대학교는 모집단위별 권장 이수과목을 지정하지 않습니다.",
    cols:["수학 진로선택","과학 일반선택","과학 진로선택"], sections:[]
  },
  {
    id:"hufs", name:"한국외국어대학교", hasRec:false,
    admYear:"2028학년도 대입", srcDate:"시행계획안 기준", srcDoc:"대학입학전형시행계획(안)",
    info:"2028학년도 전형시행계획서에 권장 이수과목이 별도로 명시되어 있지 않습니다.",
    cols:["수학 진로선택","과학 일반선택","과학 진로선택"], sections:[]
  },
  {
    id:"yonsei", name:"연세대학교", hasRec:true,
    admYear:"2028학년도 대입", srcDate:"2026년 4월 기준", srcDoc:"전공연계과목 선택 가이드라인",
    info:"2022 개정 교육과정·고교학점제 반영한 전공연계과목 선택 가이드라인을 제시합니다.",
    cols:["수학 진로선택","과학 일반선택","과학 진로선택"],
    sections:[
      {label:"인문계열 — 전공연계과목 미제시", 계열:"인문", depts:[
        {college:"문과대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
        {college:"상경대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
        {college:"경영대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
        {college:"사회과학대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
        {college:"글로벌인재대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
        {college:"간호대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
      ]},
      {label:"자연계열", 계열:"자연", depts:[
        {college:"이과대학",dept:"수학과",c1:"기하, 미적분Ⅱ",c2:"자율선택",c3:"자율선택 3과목 이상"},
        {college:"이과대학",dept:"물리학과",c1:"기하, 미적분Ⅱ",c2:"물리학",c3:"자율선택 3과목 이상"},
        {college:"이과대학",dept:"화학과",c1:"기하, 미적분Ⅱ",c2:"화학",c3:"자율선택 3과목 이상"},
        {college:"이과대학",dept:"지구시스템과학과",c1:"기하, 미적분Ⅱ",c2:"지구과학",c3:"자율선택 3과목 이상"},
        {college:"공과대학",dept:"화공생명공학부",c1:"기하, 미적분Ⅱ",c2:"화학",c3:"자율선택 3과목 이상"},
        {college:"공과대학",dept:"전기전자공학부",c1:"기하, 미적분Ⅱ",c2:"물리학",c3:"자율선택 3과목 이상"},
        {college:"공과대학",dept:"기계공학부",c1:"기하, 미적분Ⅱ",c2:"물리학",c3:"자율선택 3과목 이상"},
        {college:"공과대학",dept:"신소재공학부",c1:"기하, 미적분Ⅱ",c2:"화학",c3:"자율선택 3과목 이상"},
        {college:"공과대학",dept:"시스템반도체공학과",c1:"기하, 미적분Ⅱ",c2:"물리학",c3:"자율선택 3과목 이상"},
        {college:"생명시스템대학",dept:"생명과학부",c1:"기하, 미적분Ⅱ",c2:"생명과학",c3:"자율선택 3과목 이상"},
        {college:"생명시스템대학",dept:"생명공학과",c1:"기하, 미적분Ⅱ",c2:"생명과학",c3:"자율선택 3과목 이상"},
        {college:"인공지능융합대학",dept:"컴퓨터과학과",c1:"기하, 미적분Ⅱ",c2:"자율선택",c3:"자율선택 3과목 이상"},
        {college:"인공지능융합대학",dept:"인공지능학과",c1:"기하, 미적분Ⅱ",c2:"자율선택",c3:"자율선택 3과목 이상"},
      ]},
      {label:"의·치·약학 계열", 계열:"의치약", depts:[
        {college:"의과대학",dept:"의예과",c1:"기하, 미적분Ⅱ",c2:"생명과학",c3:"자율선택 3과목 이상"},
        {college:"약학대학",dept:"약학과",c1:"기하, 미적분Ⅱ",c2:"생명과학 또는 화학",c3:"자율선택 3과목 이상"},
      ]}
    ]
  },
  {
    id:"snu", name:"서울대학교", hasRec:true,
    admYear:"2028학년도 대입", srcDate:"2028학년도 전형 기준", srcDoc:"2028학년도 대입전형 안내",
    info:"최소한의 권장과목을 제시하며, 수시 서류평가 및 정시 교과역량평가에 반영됩니다.",
    cols:["수학 일반/진로선택","과학 일반선택","과학 진로선택"],
    sections:[
      {label:"인문계열 (유형 □1)", 계열:"인문", depts:[
        {college:"인문대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
        {college:"사회과학대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
        {college:"경영대학",dept:"전 모집단위",c1:"미제시",c2:"미제시",c3:"미제시"},
      ]},
      {label:"자연계열 (유형 □2)", 계열:"자연", depts:[
        {college:"자연과학대학",dept:"물리·천문학부 (물리학전공)",c1:"기하, 미적분Ⅱ",c2:"물리학",c3:"3과목 이상"},
        {college:"자연과학대학",dept:"화학부",c1:"기하, 미적분Ⅱ",c2:"화학",c3:"3과목 이상"},
        {college:"자연과학대학",dept:"생명과학부",c1:"기하, 미적분Ⅱ",c2:"생명과학",c3:"3과목 이상"},
        {college:"자연과학대학",dept:"지구환경과학부",c1:"기하, 미적분Ⅱ",c2:"지구과학",c3:"3과목 이상"},
        {college:"공과대학",dept:"기계공학부",c1:"기하, 미적분Ⅱ",c2:"물리학",c3:"3과목 이상"},
        {college:"공과대학",dept:"전기·정보공학부",c1:"기하, 미적분Ⅱ",c2:"물리학",c3:"3과목 이상"},
        {college:"공과대학",dept:"항공우주공학과",c1:"기하, 미적분Ⅱ",c2:"물리학",c3:"3과목 이상"},
        {college:"공과대학",dept:"그 외 공과대학 모집단위",c1:"기하, 미적분Ⅱ",c2:"자율선택",c3:"3과목 이상"},
        {college:"의과대학",dept:"의예과",c1:"기하, 미적분Ⅱ",c2:"생명과학",c3:"세포와 물질대사·생물의 유전 포함 3과목 이상"},
        {college:"약학대학",dept:"약학과",c1:"기하, 미적분Ⅱ",c2:"화학 또는 생명과학",c3:"3과목 이상"},
        {college:"간호대학",dept:"간호학과 (자연)",c1:"기하 또는 미적분Ⅱ",c2:"자율선택",c3:"3과목 이상"},
        {college:"첨단융합학부",dept:"첨단융합학부",c1:"기하, 미적분Ⅱ",c2:"자율선택",c3:"3과목 이상"},
      ]}
    ]
  },
  {
    id:"korea", name:"고려대학교", hasRec:true,
    admYear:"2028학년도 대입", srcDate:"2025년 9월 2일 기준", srcDoc:"자연계열 권장이수과목 안내",
    info:"2022 개정 교육과정(2028학년도 이후) 기준 자연계열 진로선택 과목을 학과별로 상세히 제시합니다.",
    cols:["수학 진로선택","과학 진로선택"],
    sections:[
      {label:"생명과학대학", 계열:"자연", depts:[
        {college:"생명과학대학",dept:"생명과학부",c1:"미적분Ⅱ",c2:"물질과 에너지, 화학반응의 세계, 세포와 물질대사, 생물의 유전 중 2개 이상"},
        {college:"생명과학대학",dept:"생명공학부",c1:"미적분Ⅱ",c2:"미제시"},
      ]},
      {label:"이과대학", 계열:"자연", depts:[
        {college:"이과대학",dept:"물리학과",c1:"미적분Ⅱ",c2:"역학과 에너지, 전자기와 양자"},
        {college:"이과대학",dept:"화학과",c1:"미적분Ⅱ",c2:"물질과 에너지, 화학반응의 세계"},
        {college:"이과대학",dept:"수학과",c1:"미적분Ⅱ, 기하",c2:"미제시"},
      ]},
      {label:"공과대학", 계열:"자연", depts:[
        {college:"공과대학",dept:"기계공학부",c1:"미적분Ⅱ",c2:"역학과 에너지, 전자기와 양자"},
        {college:"공과대학",dept:"전기전자공학부",c1:"미적분Ⅱ, 기하",c2:"역학과 에너지, 전자기와 양자, 물질과 에너지, 화학반응의 세계 중 2개 이상"},
        {college:"공과대학",dept:"반도체공학과",c1:"미적분Ⅱ",c2:"역학과 에너지, 전자기와 양자"},
        {college:"공과대학",dept:"화공생명공학과",c1:"미적분Ⅱ, 기하",c2:"역학과 에너지, 전자기와 양자, 물질과 에너지, 화학반응의 세계 중 2개 이상"},
      ]},
      {label:"의과대학 / 간호대학", 계열:"의치약", depts:[
        {college:"의과대학",dept:"의과대학",c1:"미적분Ⅱ",c2:"물질과 에너지, 화학반응의 세계, 세포와 물질대사, 생물의 유전 중 2개 이상"},
        {college:"간호대학",dept:"간호대학",c1:"미적분Ⅱ",c2:"물질과 에너지, 화학반응의 세계, 세포와 물질대사, 생물의 유전 중 2개 이상"},
      ]},
      {label:"정보대학", 계열:"자연", depts:[
        {college:"정보대학",dept:"컴퓨터학과",c1:"미적분Ⅱ, 기하",c2:"미제시"},
        {college:"정보대학",dept:"인공지능학과",c1:"미적분Ⅱ, 기하",c2:"미제시"},
        {college:"정보대학",dept:"데이터과학과",c1:"미적분Ⅱ, 기하",c2:"미제시"},
      ]}
    ]
  }
];

function renderUnivModal() {
  const q = (document.getElementById("univModalSearch").value || "").toLowerCase().trim();
  let html = "";

  UNIV_DATA.forEach(u => {
    const univMatch = u.name.toLowerCase().includes(q);
    let sectHtml = "", total = 0;

    u.sections.forEach(sec => {
      const secMatch = sec.label.toLowerCase().includes(q) || (sec["계열"] || "").toLowerCase().includes(q);
      const rows = sec.depts.filter(d => {
        if (!q || univMatch || secMatch) return true;
        return [d.college, d.dept, d.c1, d.c2, d.c3 || ""].some(v => (v||"").toLowerCase().includes(q));
      });
      if (!rows.length) return;
      total += rows.length;

      const thCells = "<th style='width:32px'></th><th>단과대학</th><th>모집단위</th>" + u.cols.map(c => "<th>" + c + "</th>").join("");
      let rowsHtml = rows.map(d => {
        const key = univModalMakeKey(u.name, d.college, d.dept);
        const chk = univTempSelected.has(key);
        const vals = [d.c1, d.c2, d.c3].slice(0, u.cols.length);
        const tdVals = vals.map(v => {
          if (!v || v === "미제시") return "<td><span style='font-size:11px;color:#aaa;'>미제시</span></td>";
          return "<td style='font-size:12px;line-height:1.6;max-width:200px;word-break:keep-all;'>" + v + "</td>";
        }).join("");
        return `<tr data-key="${key.replace(/"/g,'&quot;')}" style="${chk ? 'background:#EEF3FF;' : ''}">
          <td style="padding:8px 8px 8px 12px;width:32px;"><input type="checkbox" ${chk ? "checked" : ""} style="width:15px;height:15px;accent-color:#2C5FD4;cursor:pointer;"></td>
          <td style="padding:8px 12px;font-size:12px;color:#5A657A;white-space:nowrap;">${d.college}</td>
          <td style="padding:8px 12px;font-size:13px;">${d.dept}</td>
          ${tdVals}
        </tr>`;
      }).join("");

      sectHtml += `<div style="font-size:12px;font-weight:600;color:#5A657A;margin:12px 0 5px;">${sec.label}</div>
        <div style="border:1px solid #e5e9f0;border-radius:10px;overflow:hidden;overflow-x:auto;margin-bottom:6px;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead><tr style="background:#f5f7fb;">${thCells}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>`;
    });

    if (q && !univMatch && !sectHtml && !u.info.toLowerCase().includes(q)) return;

    const noRecNote = !u.hasRec
      ? `<div style="background:#f5f5f2;border-radius:8px;padding:10px 12px;font-size:12px;color:#888;margin-bottom:8px;">${u.info}</div>`
      : "";

    html += `<div style="margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #eee;">
        <span style="font-size:15px;font-weight:700;color:#1A2030;">${u.name}</span>
        <span style="font-size:11px;padding:2px 8px;border-radius:20px;${u.hasRec ? 'background:#EAF3DE;color:#3B6D11;' : 'background:#F1EFE8;color:#888;'}">${u.hasRec ? "권장과목 있음" : "권장과목 없음"}</span>
        <span style="font-size:11px;color:#aaa;margin-left:auto;">${u.srcDate} · ${u.srcDoc}</span>
      </div>
      ${noRecNote}
      ${sectHtml}
    </div>`;
  });

  const container = document.getElementById("univModalContent");
  container.innerHTML = html || "<div style='text-align:center;padding:2rem;color:#aaa;'>검색 결과가 없습니다.</div>";

  // 체크박스 이벤트 바인딩
  container.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", function() {
      const tr = this.closest("tr");
      const key = tr.dataset.key;
      let deptData = null;
      UNIV_DATA.forEach(u => {
        u.sections.forEach(sec => {
          sec.depts.forEach(d => {
            if (univModalMakeKey(u.name, d.college, d.dept) === key) {
              deptData = { ...d, univ: u.name, college: d.college, dept: d.dept, cols: u.cols };
            }
          });
        });
      });
      univModalToggle(key, this.checked, deptData);
    });
  });
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
  univConfirmed.clear();
  univTempSelected.clear();
  document.getElementById("univSelectedList").classList.add("hidden");
  goStep(1);
}
