const gallery = document.querySelector("#circularGallery");
const galleryRing = document.querySelector("#galleryRing");
const galleryFocus = document.querySelector("#galleryFocus");
const phoneFeed = document.querySelector("#phoneFeed");

if (gallery && galleryRing && galleryFocus) {
  const covers = Array.from({ length: 18 }, (_, index) => `photo/video/${index + 1}.jpg`);
  const state = { angle: 0, hovering: false, focused: false, lastTime: performance.now() };

  covers.forEach((src, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-cover";
    const itemAngle = index * (360 / covers.length);
    button.dataset.angle = String(itemAngle);
    button.style.setProperty("--item-angle", `${itemAngle}deg`);
    button.setAttribute("aria-label", `放大短视频封面 ${String(index + 1).padStart(2, "0")}`);
    button.innerHTML = `<img src="${src}" alt="微信视频号短视频封面 ${String(index + 1).padStart(2, "0")}">`;
    button.addEventListener("click", () => openCover(src, index));
    galleryRing.appendChild(button);
  });

  const isMobile = () => window.matchMedia("(max-width: 680px)").matches;

  const updateDepth = () => {
    galleryRing.querySelectorAll(".gallery-cover").forEach((cover) => {
      const itemAngle = Number(cover.dataset.angle);
      const relative = (itemAngle + state.angle + 3600) % 360;
      const distance = Math.abs(relative > 180 ? 360 - relative : relative);
      const depth = Math.max(0.28, 1 - distance / 230);
      cover.style.opacity = String(depth);
      cover.style.filter = `saturate(${0.65 + depth * 0.35})`;
      cover.style.zIndex = String(Math.round(depth * 100));
    });
  };

  const animate = (time) => {
    const elapsed = Math.min(time - state.lastTime, 40);
    state.lastTime = time;
    if (!state.focused) {
      if (isMobile()) {
        gallery.scrollLeft += elapsed * (state.hovering ? 0.008 : 0.025);
        if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 2) gallery.scrollLeft = 0;
      } else {
        state.angle += elapsed * (state.hovering ? 0.0014 : 0.0045);
        galleryRing.style.setProperty("--ring-angle", `${state.angle}deg`);
        updateDepth();
      }
    }
    window.requestAnimationFrame(animate);
  };

  const openCover = (src, index) => {
    state.focused = true;
    gallery.classList.add("is-focused");
    const image = document.querySelector("#galleryFocusImage");
    image.src = src;
    image.alt = `放大的微信视频号短视频封面 ${String(index + 1).padStart(2, "0")}`;
    galleryFocus.hidden = false;
    document.body.classList.add("lightbox-open");
    galleryFocus.querySelector(".gallery-focus-close").focus();
  };

  const closeCover = () => {
    galleryFocus.hidden = true;
    gallery.classList.remove("is-focused");
    document.body.classList.remove("lightbox-open");
    state.focused = false;
  };

  gallery.addEventListener("mouseenter", () => { state.hovering = true; });
  gallery.addEventListener("mouseleave", () => { state.hovering = false; });
  galleryFocus.querySelectorAll("[data-gallery-close]").forEach((button) => button.addEventListener("click", closeCover));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !galleryFocus.hidden) closeCover();
  });
  window.requestAnimationFrame(animate);
}

if (phoneFeed) {
  const phoneScreens = [
    "01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg", "09.jpg",
    "010.jpg", "011.jpg", "012.jpg", "013.jpg", "014.jpg", "015.jpg", "016.jpg", "017.jpg",
  ];

  phoneScreens.forEach((filename, index) => {
    const post = document.createElement("article");
    post.className = "phone-post phone-screen-shot";
    post.innerHTML = `<img src="photo/video/视频号/${filename}" alt="微信视频号发布页面截图 ${String(index + 1).padStart(2, "0")}">`;
    phoneFeed.appendChild(post);
  });
}
