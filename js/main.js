document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     1. HERO SWIPER
  =============================== */
  if (document.querySelector('.mySwiper')) {
    const swiper = new Swiper(".mySwiper", {
      loop: true,
      effect: "fade",
      speed: 1500,
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
      on: {
        slideChangeTransitionStart() {
          gsap.set('.hero-content', { opacity: 0, y: 50 });
        },
        slideChangeTransitionEnd() {
          gsap.to('.hero-content', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
          });
        }
      }
    });

    gsap.to('.hero-content', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.3,
      ease: "power3.out"
    });
  }

  /* ===============================
     2. QUOTE SWIPER
  =============================== */
  if (document.querySelector('.quoteSwiper')) {
    new Swiper(".quoteSwiper", {
      loop: true,
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: 1000,
      autoplay: { delay: 5000, disableOnInteraction: false },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });
  }

  /* ===============================
     3. MAGIC CURSOR
  =============================== */
  const cursor = document.querySelector('.cb-cursor');
  const follower = document.querySelector('.cb-cursor-follower');

  if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.1 });
      gsap.to(follower, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.3 });
    });

    document.querySelectorAll('a, button, .btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 2.5, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "transparent" });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, backgroundColor: "transparent", borderColor: "#fff" });
      });
    });
  }

  /* ===============================
     4. NAVBAR SCROLL
  =============================== */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ===============================
     5. GSAP SCROLL REVEALS
  =============================== */
  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.gs-reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });
  }

  /* ===============================
     6. SANITY CONFIG
  =============================== */
  const projectId = "30lhaxyx";
  const dataset = "production";
  const apiVersion = "2023-01-01";

  function fetchSermons(query, callback) {
    fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => callback(data.result))
      .catch(console.error);
  }

  /* ===============================
     7. PORTABLE TEXT RENDERER (LINKS FIXED)
  =============================== */
  function renderPortableText(blocks) {
    if (!blocks) return "";

    return blocks.map(block => {
      if (block._type !== "block") return "";

      const children = block.children.map(span => {
        let text = span.text;

        if (span.marks?.length) {
          span.marks.forEach(mark => {
            const def = block.markDefs?.find(d => d._key === mark);
            if (def?.href) {
              text = `<a href="${def.href}" target="_blank" rel="noopener">${text}</a>`;
            }
          });
        }

        return text;
      }).join("");

      if (block.style === "h2") return `<h2>${children}</h2>`;
      if (block.style === "h3") return `<h3>${children}</h3>`;
      if (block.style === "blockquote") return `<blockquote>${children}</blockquote>`;
      return `<p>${children}</p>`;
    }).join("");
  }

  /* ===============================
     8. SERMON LIST PAGE
  =============================== */
  const sermonsContainer = document.getElementById("sermons-container");

  if (sermonsContainer) {
    const query = `
      *[_type=="sermon"] | order(publishedAt desc){
        title,
        slug,
        type,
        category,
        publishedAt,
        "image": featuredImage.asset->url
      }
    `;

    fetchSermons(query, sermons => {
      sermons.forEach(s => {
        sermonsContainer.innerHTML += `
          <div class="col-md-4 mb-4">
            <article class="sermon-card">
              <div class="sermon-thumb">
                <img src="${s.image || '/assets/gallery13.jpeg'}" alt="${s.title}">
                <span class="sermon-type">${s.type || "SERMON"}</span>
              </div>
              <div class="p-4">
                <h5 class="text-white serif">${s.title}</h5>
                <p class="text-gray small">${s.category || ""}</p>
                <a href="sermon.html?slug=${s.slug.current}" class="link-gold">
                  View Sermon →
                </a>
              </div>
            </article>
          </div>`;
      });
    });
  }

  /* ===============================
   9. SINGLE SERMON PAGE (FIXED)
=============================== */
const sermonContainer = document.getElementById("sermon-container");
const slug = new URLSearchParams(window.location.search).get("slug");

if (sermonContainer && slug) {
  const query = `
    *[_type=="sermon" && slug.current=="${slug}"][0]{
      title,
      type,
      category,
      publishedAt,
      scripture,
      body,
      externalLink,
      videoUrl,
      "image": featuredImage.asset->url,
      "audioUrl": audio.asset->url
    }
  `;

  fetchSermons(query, sermon => {
    if (!sermon) {
      sermonContainer.innerHTML = "<p>Sermon not found.</p>";
      return;
    }

    sermonContainer.innerHTML = `
      <h1 class="mb-3">${sermon.title}</h1>

      ${sermon.scripture ? `
        <blockquote class="scripture-ref">
          ${sermon.scripture}
        </blockquote>
      ` : ""}

      ${sermon.image ? `
        <img src="${sermon.image}" class="img-fluid my-4" alt="${sermon.title}">
      ` : ""}

      ${sermon.audioUrl ? `
        <audio controls class="my-4">
          <source src="${sermon.audioUrl}" type="audio/mpeg">
        </audio>
      ` : ""}

      <div class="sermon-body">
        ${renderPortableText(sermon.body)}
      </div>

      ${sermon.externalLink ? `
        <div class="mt-4">
          <a href="${sermon.externalLink}" target="_blank" class="link-gold">
            External Resource →
          </a>
        </div>
      ` : ""}

      ${sermon.videoUrl ? `
        <div class="ratio ratio-16x9 mt-5">
          <iframe src="${sermon.videoUrl}" allowfullscreen></iframe>
        </div>
      ` : ""}
    `;
  });
}
});

/* ===============================
   10. UPCOMING PROGRAMS
=============================== */

const programsContainer = document.getElementById("programs-container");

if (programsContainer) {
  const query = `
    *[_type=="program" && date >= now()]
    | order(date asc){
      title,
      venue,
      date,
      description,
      registrationLink,
      "imageUrl": image.asset->url
    }
  `;

  fetchSermons(query, programs => {
    if (!programs.length) {
      programsContainer.innerHTML = `
        <p class="text-center text-gray">
          No upcoming programs at the moment.
        </p>
      `;
      return;
    }

    programsContainer.innerHTML = programs.map(program => `
      <div class="col-md-4">
        <div class="program-card">
          <img src="${program.imageUrl}" alt="${program.title}">
          <div class="program-content">
            <p class="program-date">
              ${new Date(program.date).toDateString()}
            </p>
            <h5 class="text-white">${program.title}</h5>
            <p class="text-gray">${program.description || ""}</p>
            <p class="text-gray small">
              <i class="fas fa-map-marker-alt"></i> ${program.venue || ""}
            </p>
            ${
              program.registrationLink
                ? `<a href="${program.registrationLink}" class="btn-outline-gold mt-2" target="_blank">
                     More Details
                   </a>`
                : ""
            }
          </div>
        </div>
      </div>
    `).join("");
  });
}
