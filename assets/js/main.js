// Mobile nav toggle, active link highlight, footer year
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle) toggle.addEventListener("click", () => nav.classList.toggle("open"));

  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const target = a.getAttribute("href").split("/").pop();
    if (target === here || (here.startsWith("post-") && target === "blog.html")) a.classList.add("active");
  });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// Light / dark background toggle (light is the default)
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => { btn.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙"; };
  sync();
  btn.addEventListener("click", () => {
    const dark = root.getAttribute("data-theme") !== "dark";
    if (dark) root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
    try { sessionStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    sync();
  });
});

// Slideshows: one photo at a time (fade), arrows, dots (data-dots="off" hides them), keyboard and swipe. No autoplay.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slideshow").forEach(show => {
    const frame = show.querySelector(".slides");
    const slides = [...frame.querySelectorAll(".slide")];
    if (!slides.length) return;
    const hasCaptions = slides.some(s => s.querySelector("figcaption"));
    const caption = document.createElement("p");
    caption.className = "slide-caption";
    caption.setAttribute("aria-live", "polite");
    if (hasCaptions) show.appendChild(caption);
    let cur = 0, dots = [];
    const show_ = i => {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle("active", k === cur); s.setAttribute("aria-hidden", k === cur ? "false" : "true"); });
      const fc = slides[cur].querySelector("figcaption");
      caption.textContent = fc ? fc.textContent : "";
      dots.forEach((d, k) => d.setAttribute("aria-current", k === cur ? "true" : "false"));
    };
    if (slides.length > 1) {
      const mk = (cls, label, txt) => { const b = document.createElement("button"); b.type = "button"; b.className = cls; b.setAttribute("aria-label", label); b.textContent = txt; return b; };
      const prev = mk("slide-btn prev", "Previous photo", "\u2039"), next = mk("slide-btn next", "Next photo", "\u203A");
      prev.addEventListener("click", () => show_(cur - 1));
      next.addEventListener("click", () => show_(cur + 1));
      frame.append(prev, next);
      if (show.dataset.dots !== "off") {
        const row = document.createElement("div"); row.className = "slide-dots";
        dots = slides.map((_, k) => { const d = mk("", "Photo " + (k + 1), ""); d.addEventListener("click", () => show_(k)); row.appendChild(d); return d; });
        show.appendChild(row);
      }
      if (!show.hasAttribute("tabindex")) show.tabIndex = 0;
      show.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") { e.preventDefault(); show_(cur - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); show_(cur + 1); }
      });
      let x0 = null;
      frame.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
      frame.addEventListener("touchend", e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) show_(cur + (dx < 0 ? 1 : -1));
      });
    }
    show_(0);
  });
});
