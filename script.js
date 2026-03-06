/* CURSOR */
const cEl = document.getElementById("cur"),
  dot = document.getElementById("cur-dot"),
  ring = document.getElementById("cur-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});
document.querySelectorAll("a,button").forEach((el) => {
  el.addEventListener("mouseenter", () =>
    document.body.classList.add("hover-on"),
  );
  el.addEventListener("mouseleave", () =>
    document.body.classList.remove("hover-on"),
  );
});
(function animC() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animC);
})();

/* PROGRESS BAR */
const pb = document.getElementById("pbar");
window.addEventListener(
  "scroll",
  () => {
    pb.style.transform = `scaleX(${window.scrollY / (document.body.scrollHeight - window.innerHeight)})`;
  },
  { passive: true },
);

/* NAV */
window.addEventListener(
  "scroll",
  () => {
    document.getElementById("nav").style.background =
      window.scrollY > 60 ? "rgba(8,8,16,.94)" : "rgba(8,8,16,.75)";
  },
  { passive: true },
);

/* INTERSECTION OBSERVER */
function observe(sel, thresh = 0.12) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("iv");
      }),
    { threshold: thresh },
  );
  document.querySelectorAll(sel).forEach((el) => io.observe(el));
}
observe(".sc");
observe(".svc");
observe(".pst");
observe(".tc");
observe(".rv");
observe(".rvl");
observe(".ritem", 0.08);
observe(".rvis", 0.15);
observe("#rv", 0.15);

/* COUNTER */
function counter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / 1800, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        counter("s1", 150);
        counter("s2", 50);
        counter("s3", 7);
        counter("s4", 94);
      }
    }),
  { threshold: 0.3 },
).observe(document.querySelector(".stats"));

/* ── HERO INTRO SEQUENCE ── */
(function heroIntro() {
  const tag = document.querySelector(".hero-tag");
  const lines = document.querySelectorAll(".hero-title .line span");
  const sub = document.querySelector(".hero-sub");
  const acts = document.querySelector(".hero-actions");
  // stagger: tag → lines → sub → actions
  setTimeout(() => {
    if (tag) tag.classList.add("revealed");
  }, 100);
  lines.forEach((s, i) => {
    setTimeout(() => s.classList.add("revealed"), 300 + i * 170);
  });
  setTimeout(() => {
    if (sub) sub.classList.add("revealed");
  }, 900);
  setTimeout(() => {
    if (acts) acts.classList.add("revealed");
  }, 1100);
})();

/* PARALLAX ORBS (mouse) + GRID CURSOR SCALE */
const heroGrid = document.querySelector(".hero-grid");
let gridGx = 0,
  gridGy = 0,
  gridTargetX = 0,
  gridTargetY = 0,
  gridScrollY = 0;

window.addEventListener(
  "mousemove",
  (e) => {
    const nx = e.clientX / window.innerWidth,
      ny = e.clientY / window.innerHeight;
    const x = (nx - 0.5) * 35,
      y = (ny - 0.5) * 35;
    document.querySelector(".orb-1").style.transform =
      `translate(${x}px,${y}px)`;
    document.querySelector(".orb-2").style.transform =
      `translate(${-x * 0.5}px,${-y * 0.5}px)`;
    document.querySelector(".orb-3").style.transform =
      `translate(${x * 0.3}px,${-y * 0.3}px)`;
    gridTargetX = (nx - 0.5) * 10;
    gridTargetY = (ny - 0.5) * 10;
  },
  { passive: true },
);

// unified loop — cursor 3D tilt + scroll Y composed into one transform
(function animGrid() {
  gridGx += (gridTargetX - gridGx) * 0.055;
  gridGy += (gridTargetY - gridGy) * 0.055;
  if (heroGrid) {
    const scale = 1.06 + Math.abs(gridGx / 600) + Math.abs(gridGy / 600);
    heroGrid.style.transform = `perspective(900px) rotateY(${gridGx}deg) rotateX(${-gridGy}deg) scale(${scale}) translateY(${gridScrollY}px)`;
  }
  requestAnimationFrame(animGrid);
})();

/* SCROLL PARALLAX */
function onScroll() {
  const sy = window.scrollY;
  gridScrollY = sy * 0.28; // fed into animGrid above — no direct grid style.transform here
  // hero text gentle lift
  const hc = document.querySelector(".hero-content");
  if (hc) hc.style.transform = `translateY(${sy * 0.12}px)`;
  // hero visual depth
  const hv = document.getElementById("hv");
  if (hv) hv.style.transform = `translateY(calc(-50% + ${sy * 0.07}px))`;
  // badges parallax
  document.querySelectorAll(".fbadge").forEach((b, i) => {
    b.style.transform = `translateY(${-sy * (0.04 + i * 0.015)}px)`;
  });
  // showcase rows depth
  const r1 = document.getElementById("row1"),
    r2 = document.getElementById("row2");
  if (r1 && r2) {
    r1.style.transform = `translateX(-50%) translateY(${sy * 0.018}px)`;
    r2.style.transform = `translateX(50%) translateY(${-sy * 0.012}px)`;
  }
  // results visual tilt
  const rv = document.getElementById("rv");
  if (rv && rv.classList.contains("iv")) {
    const rc = rv.getBoundingClientRect();
    const d =
      (window.innerHeight / 2 - (rc.top + rc.height / 2)) / window.innerHeight;
    rv.style.transform = `translateX(0) perspective(900px) rotateX(${d * 5}deg)`;
  }
  // CTA ring scale
  const cr = document.querySelector(".cr1"),
    cs = document.querySelector(".cta");
  if (cr && cs) {
    const b = cs.getBoundingClientRect();
    const p = Math.max(
      0,
      Math.min(
        1,
        (window.innerHeight - b.top) / (window.innerHeight + b.height),
      ),
    );
    cr.style.transform = `translate(-50%,-50%) scale(${1 + p * 0.35})`;
  }
}
window.addEventListener("scroll", onScroll, { passive: true });

/* TILT on service cards */
document.querySelectorAll(".svc").forEach((c) => {
  c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(600px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.01) translateY(0)`;
  });
  c.addEventListener("mouseleave", () => {
    c.style.transform = "";
  });
});
/* TILT on showcase cards */
document.querySelectorAll(".scard").forEach((c) => {
  c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(400px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.06)`;
  });
  c.addEventListener("mouseleave", () => {
    c.style.transform = "";
  });
});
/* TILT on stat cards */
document.querySelectorAll(".sc").forEach((c) => {
  c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(500px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  });
  c.addEventListener("mouseleave", () => {
    c.style.transform = "";
  });
});
/* TILT on testimonial cards */
document.querySelectorAll(".tc").forEach((c) => {
  c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02) translateY(0)`;
  });
  c.addEventListener("mouseleave", () => {
    c.style.transform = "";
  });
});

// fix: row translateX base
const r1 = document.getElementById("row1"),
  r2 = document.getElementById("row2");
if (r1) r1.style.animationName = "scrl";
