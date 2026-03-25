/* ──────────────────────────────────────
   M. Enis Leblebici — Site interactions
   ────────────────────────────────────── */

// ─── Year in footer ───
document.getElementById("year").textContent = new Date().getFullYear();

// ─── Mobile nav toggle ───
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("main-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ─── Header scroll effect ───
const header = document.querySelector(".site-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

// ─── Active nav link tracking ───
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-30% 0px -60% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

// ─── Reveal-on-scroll animations ───
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ─── Video play-on-click ───
document.querySelectorAll(".video-item").forEach((item) => {
  const video = item.querySelector("video");
  const btn = item.querySelector(".play-btn");
  const play = (e) => {
    e.stopPropagation();
    video.muted = true;
    video.controls = true;
    video.play().then(() => item.classList.add("playing")).catch(() => {});
  };
  btn.addEventListener("click", play);
  item.addEventListener("click", (e) => {
    if (e.target === video || e.target === item) play(e);
  });
  video.addEventListener("play", () => item.classList.add("playing"));
  video.addEventListener("pause", () => item.classList.remove("playing"));
  video.addEventListener("ended", () => { item.classList.remove("playing"); video.controls = false; });
});

// ─── Publications loader ───
const publicationsTarget = document.getElementById("publications-list");

async function loadPublications() {
  if (!publicationsTarget) return;

  try {
    const response = await fetch("data/publications.json?v=" + Date.now());
    const publications = await response.json();

    publicationsTarget.innerHTML = publications
      .map(
        (pub) => `
      <article class="card reveal">
        <div class="pub-meta">${pub.year} · ${pub.venue}</div>
        <h3>${pub.title}</h3>
        <p>${pub.summary}</p>
        <div class="pub-links">
          ${pub.paperUrl ? `<a href="${encodeURI(pub.paperUrl)}" target="_blank" rel="noopener noreferrer">Paper ↗</a>` : ""}
          ${pub.doiUrl ? `<a href="${encodeURI(pub.doiUrl)}" target="_blank" rel="noopener noreferrer">DOI ↗</a>` : ""}
        </div>
      </article>
    `
      )
      .join("");

    // Observe newly added cards for reveal animation
    publicationsTarget.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  } catch (error) {
    publicationsTarget.innerHTML = `
      <article class="card">
        <h3>Publication list unavailable</h3>
        <p>Edit <code>data/publications.json</code> to add your latest papers manually.</p>
      </article>
    `;
    console.error(error);
  }
}

loadPublications();
