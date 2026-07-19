const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const siteHeader = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main > section[id]");
const lanyardIntro = document.querySelector("#lanyardIntro");
const introLanyard = document.querySelector(".intro-lanyard");
const lanyardCard = document.querySelector(".lanyard-card");
const lanyardLine = document.querySelector(".lanyard-line");
const newsroomGrid = document.querySelector("#newsroomGrid");
const hero = document.querySelector("#hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const newsroomItems = [
  { number: "01", title: "国际新闻", status: "正在编辑", depth: "1" },
  { number: "02", title: "人物采访", status: "选题整理", depth: "2" },
  { number: "03", title: "纪录片", status: "素材整理", depth: "1" },
  { number: "04", title: "媒体观察", status: "持续记录", depth: "3", hideMobile: true },
  { number: "05", title: "公共议题", status: "内容编辑", depth: "2" },
  { number: "06", title: "影像叙事", status: "已完成", depth: "2" },
  { number: "07", title: "新闻写作", status: "稿件修订", depth: "1" },
  { number: "08", title: "公益传播", status: "内容发布", depth: "3", hideMobile: true },
  { number: "09", title: "现场报道", status: "现场记录", depth: "2", hideTablet: true },
  { number: "10", title: "专题策划", status: "选题整理", depth: "1" },
  { number: "11", title: "国际传播", status: "内容编辑", depth: "3", hideTablet: true },
  { number: "12", title: "内容编辑", status: "发布完成", depth: "2", hideTablet: true },
];

const newsroomRefreshWords = ["选题整理", "内容编辑", "发布完成", "现场记录", "素材整理", "稿件修订"];

if (newsroomGrid) {
  newsroomItems.forEach((item) => {
    const tile = document.createElement("div");
    tile.className = [
      "newsroom-tile",
      item.hideTablet ? "hide-tablet" : "",
      item.hideMobile ? "hide-mobile" : "",
    ].filter(Boolean).join(" ");
    tile.dataset.depth = item.depth;
    tile.innerHTML = `
      <span class="tile-status">${item.status}</span>
      <span class="tile-number">${item.number}</span>
      <strong class="tile-title">${item.title}</strong>
      <span class="tile-lines"><i></i><i></i><i></i></span>`;
    newsroomGrid.appendChild(tile);
  });

  if (!reduceMotion && window.matchMedia("(min-width: 721px)").matches) {
    window.setInterval(() => {
      const titles = Array.from(newsroomGrid.querySelectorAll(".tile-title"));
      const title = titles[Math.floor(Math.random() * titles.length)];
      if (!title) return;
      title.classList.add("is-refreshing");
      window.setTimeout(() => {
        title.textContent = newsroomRefreshWords[Math.floor(Math.random() * newsroomRefreshWords.length)];
        title.classList.remove("is-refreshing");
      }, 240);
    }, 4800);
  }
}

if (hero && newsroomGrid && !reduceMotion && window.matchMedia("(min-width: 941px)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    newsroomGrid.style.transform = `translate(${x * -8}px, ${y * -6}px)`;
  });

  hero.addEventListener("pointerleave", () => {
    newsroomGrid.style.transform = "";
  });
}

if (hero && siteHeader) {
  const updateHeaderTone = () => {
    siteHeader.classList.toggle("is-on-light", hero.getBoundingClientRect().bottom <= 72);
  };
  updateHeaderTone();
  window.addEventListener("scroll", updateHeaderTone, { passive: true });
}

if (lanyardIntro) {
  const closeIntro = () => {
    if (lanyardIntro.classList.contains("is-leaving")) return;
    lanyardIntro.classList.add("is-leaving");
    document.body.classList.remove("intro-active");
    window.setTimeout(() => lanyardIntro.remove(), 750);
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    lanyardIntro.remove();
  } else {
    document.body.classList.add("intro-active");

    if (introLanyard && lanyardCard && lanyardLine) {
      let position = { x: 0, y: 0 };
      let velocity = { x: 0, y: 0 };
      let pointerStart = { x: 0, y: 0 };
      let positionStart = { x: 0, y: 0 };
      let lastPointer = { x: 0, y: 0, time: 0 };
      let dragDistance = 0;
      let dragging = false;

      const renderLanyard = () => {
        const maxX = Math.min(window.innerWidth * 0.38, 360);
        const maxY = Math.min(window.innerHeight * 0.2, 150);
        position.x = Math.max(-maxX, Math.min(maxX, position.x));
        position.y = Math.max(-110, Math.min(maxY, position.y));

        const rotation = position.x * 0.055;
        lanyardCard.style.setProperty("--card-x", `${position.x}px`);
        lanyardCard.style.setProperty("--card-y", `${position.y}px`);
        lanyardCard.style.setProperty("--card-rotate", `${rotation}deg`);

        const baseLength = window.innerHeight * 0.46 + 170;
        const dx = position.x;
        const dy = position.y;
        const angle = Math.atan2(dx, baseLength + dy) * -180 / Math.PI;
        const length = Math.sqrt(dx * dx + (baseLength + dy) ** 2);
        lanyardLine.style.height = `${length}px`;
        lanyardLine.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      };

      const animatePhysics = () => {
        if (!dragging) {
          velocity.x += -position.x * 0.012;
          velocity.y += -position.y * 0.012;
          velocity.x *= 0.93;
          velocity.y *= 0.93;
          position.x += velocity.x;
          position.y += velocity.y;
          renderLanyard();
        }
        window.requestAnimationFrame(animatePhysics);
      };

      lanyardCard.addEventListener("pointerdown", (event) => {
        dragging = true;
        pointerStart = { x: event.clientX, y: event.clientY };
        positionStart = { ...position };
        lastPointer = { x: event.clientX, y: event.clientY, time: performance.now() };
        dragDistance = 0;
        velocity = { x: 0, y: 0 };
        lanyardCard.classList.add("is-dragging");
        lanyardCard.setPointerCapture(event.pointerId);
      });

      lanyardCard.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const now = performance.now();
        const elapsed = Math.max(16, now - lastPointer.time);
        dragDistance = Math.max(
          dragDistance,
          Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y)
        );
        position.x = positionStart.x + event.clientX - pointerStart.x;
        position.y = positionStart.y + event.clientY - pointerStart.y;
        velocity.x = (event.clientX - lastPointer.x) / elapsed * 16;
        velocity.y = (event.clientY - lastPointer.y) / elapsed * 16;
        lastPointer = { x: event.clientX, y: event.clientY, time: now };
        renderLanyard();
      });

      const releaseCard = (event) => {
        if (!dragging) return;
        dragging = false;
        lanyardCard.classList.remove("is-dragging");
        if (lanyardCard.hasPointerCapture(event.pointerId)) {
          lanyardCard.releasePointerCapture(event.pointerId);
        }
        if (dragDistance >= 18) {
          closeIntro();
        }
      };

      lanyardCard.addEventListener("pointerup", releaseCard);
      lanyardCard.addEventListener("pointercancel", releaseCard);
      renderLanyard();
      window.requestAnimationFrame(animatePhysics);
    }
  }
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item, index) => {
  const projectCards = Array.from(document.querySelectorAll(".project-track .reveal"));
  const projectIndex = projectCards.indexOf(item);
  item.style.transitionDelay = projectIndex >= 0
    ? `${projectIndex * 100}ms`
    : `${Math.min(index % 3, 2) * 80}ms`;
  revealObserver.observe(item);
});

const updateActiveNav = () => {
  if (!sections.length) return;

  const scrollPosition = window.scrollY + 120;
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      activeSection = section;
    }
  });

  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    item.classList.toggle("active", href === `#${activeSection.id}`);
  });
};

updateActiveNav();
window.addEventListener("scroll", updateActiveNav, { passive: true });

const newsTimeline = document.querySelector("#newsTimeline");

if (newsTimeline && Array.isArray(window.NEWS_ITEMS)) {
  const years = ["全部", "2026", "2025", "2024", "2023"];
  const topics = ["全部", "美国政治与总统选举", "国际冲突与地缘政治", "世界政坛观察", "国际经济与科技", "社会热点与公共事件"];
  const state = { year: "全部", topic: "全部" };
  const yearFilters = document.querySelector("#yearFilters");
  const topicFilters = document.querySelector("#topicFilters");
  const resultCount = document.querySelector("#resultCount");
  const emptyState = document.querySelector("#emptyState");

  const makeFilters = (values, container, key) => {
    values.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-button${value === "全部" ? " active" : ""}`;
      button.textContent = value;
      button.setAttribute("aria-pressed", String(value === "全部"));
      button.addEventListener("click", () => {
        state[key] = value;
        container.querySelectorAll("button").forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        renderNews();
      });
      container.appendChild(button);
    });
  };

  const formatDate = (date) => {
    const [, month, day] = date.split("-");
    return `${month}.${day}`;
  };

  const renderNews = () => {
    const filtered = window.NEWS_ITEMS.filter((item) => {
      const matchesYear = state.year === "全部" || item.date.startsWith(state.year);
      const matchesTopic = state.topic === "全部" || item.category === state.topic;
      return matchesYear && matchesTopic;
    }).sort((a, b) => b.date.localeCompare(a.date));
    newsTimeline.replaceChildren();
    resultCount.textContent = `共 ${filtered.length} 篇作品`;
    emptyState.hidden = filtered.length !== 0;

    [...new Set(filtered.map((item) => item.date.slice(0, 4)))].forEach((year) => {
      const group = document.createElement("section");
      group.className = "year-group";
      group.setAttribute("aria-labelledby", `year-${year}`);
      const marker = document.createElement("h3");
      marker.className = "year-marker";
      marker.id = `year-${year}`;
      marker.textContent = year;
      const cards = document.createElement("div");
      cards.className = "year-cards";

      filtered.filter((item) => item.date.startsWith(year)).forEach((item) => {
        const article = document.createElement("article");
        article.className = "news-card";
        article.innerHTML = `
          <div class="news-card-head">
            <time datetime="${item.date}">${formatDate(item.date)}</time>
            <span class="news-card-tag">${item.category}</span>
          </div>
          <h3>${item.title}</h3>
          <a class="text-link" href="${item.url}" target="_blank" rel="noopener noreferrer">阅读原文</a>`;
        cards.appendChild(article);
      });
      group.append(marker, cards);
      newsTimeline.appendChild(group);
    });
  };

  makeFilters(years, yearFilters, "year");
  makeFilters(topics, topicFilters, "topic");
  renderNews();
}
