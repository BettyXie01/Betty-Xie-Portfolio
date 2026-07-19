const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroGrid = document.querySelector("#heroGrid");

if (heroGrid) {
  const gridFragment = document.createDocumentFragment();
  for (let cell = 0; cell < 96; cell += 1) {
    const gridCell = document.createElement("span");
    gridCell.className = "hero-grid-cell";
    gridFragment.appendChild(gridCell);
  }
  heroGrid.appendChild(gridFragment);
}

const header = document.querySelector(".site-header");
const setHeader = () => header.classList.toggle("scrolled", scrollY > innerHeight * .7);
setHeader();
addEventListener("scroll", setHeader, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .13 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const steps = [...document.querySelectorAll(".journey-step")];
const progress = document.querySelector(".journey-progress span");
const stepObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const index = steps.indexOf(entry.target);
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
      step.classList.toggle("completed", stepIndex < index);
    });
    if (progress) progress.style.width = `${(index + 1) / steps.length * 100}%`;

    const logPage = entry.target.dataset.logPage;
    if (logPage !== undefined) updateMissionLog(Number(logPage));
  });
}, { threshold: .55 });
steps.forEach(step => stepObserver.observe(step));

document.querySelectorAll("[data-carousel]").forEach(carousel => {
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const previous = carousel.querySelector(".carousel-prev");
  const next = carousel.querySelector(".carousel-next");
  let index = 0;

  const showSlide = nextIndex => {
    index = (nextIndex + slides.length) % slides.length;
    carousel.style.setProperty("--carousel-index", index);
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === index);
    });
  };

  previous.addEventListener("click", () => showSlide(index - 1));
  next.addEventListener("click", () => showSlide(index + 1));
});

const missionLog = document.querySelector("#missionLog");
const logPages = [...missionLog.querySelectorAll(".log-page")];
let currentLogPage = 0;

const updateMissionLogVisibility = () => {
  const journeyStart = document.querySelector("#journey").offsetTop;
  missionLog.classList.toggle("started", window.scrollY >= journeyStart - window.innerHeight * .55);
};
updateMissionLogVisibility();
window.addEventListener("scroll", updateMissionLogVisibility, { passive: true });
window.addEventListener("resize", updateMissionLogVisibility);

function updateMissionLog(pageIndex) {
  if (pageIndex === currentLogPage || !logPages[pageIndex]) return;
  const previousPage = logPages[currentLogPage];
  const nextPage = logPages[pageIndex];
  previousPage.classList.remove("active");
  previousPage.classList.add("turning");
  nextPage.classList.add("active");
  window.setTimeout(() => previousPage.classList.remove("turning"), 700);
  currentLogPage = pageIndex;
}

const ending = document.querySelector("#reflection");
const endingObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {
    missionLog.classList.add("complete");
  } else {
    missionLog.classList.remove("complete");
  }
}, { threshold: .65 });
if (ending) endingObserver.observe(ending);
