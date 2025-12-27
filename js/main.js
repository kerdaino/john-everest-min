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

    // Initial hero reveal
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
     3. MAGIC CURSOR (FAIL SAFE)
  =============================== */
  const cursor = document.querySelector('.cb-cursor');
  const follower = document.querySelector('.cb-cursor-follower');

  if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.1
      });
      gsap.to(follower, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.3
      });
    });

    document.querySelectorAll('a, button, .btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 2.5,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderColor: "transparent"
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "#fff"
        });
      });
    });
  }

  /* ===============================
     4. NAVBAR SCROLL EFFECT
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
          scrollTrigger: {
            trigger: el,
            start: "top 85%"
          }
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
     7. PORTABLE TEXT RENDERER
  =============================== */
  function renderSpan(span) {
    let text = span.text;
    if (span.marks?.includes("strong")) text = `<strong>${text}</strong>`;
    if (span.marks?.includes("em")) text = `<em>${text}</em>`;
    return text;
  }

  function renderPortableText(blocks) {
    if (!blocks) return "";
    let html = "", list = [];

    blocks.forEach((block, i) => {
      if (block._type === "block" && block.listItem === "bullet") {
        list.push(`<li>${block.children.map(renderSpan).join("")}</li>`);
        if (!blocks[i + 1] || blocks[i + 1].listItem !== "bullet") {
          html += `<ul>${list.join("")}</ul>`;
          list = [];
        }
        return;
      }

      if (list.length) {
        html += `<ul>${list.join("")}</ul>`;
        list = [];
      }

      if (block._type === "block") {
        const text = block.children.map(renderSpan).join("");
        if (block.style === "h2") html += `<h2>${text}</h2>`;
        else if (block.style === "h3") html += `<h3>${text}</h3>`;
        else if (block.style === "blockquote") html += `<blockquote>${text}</blockquote>`;
        else html += `<p>${text}</p>`;
      }
    });

    return html;
  }

  /* ===============================
     8. SERMONS LIST PAGE
  =============================== */
  const sermonsContainer = document.getElementById("sermons-container");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const loadMoreBtn = document.getElementById("load-more-btn");

  let allSermons = [];
  let currentIndex = 0;
  const sermonsPerPage = 6;

  if (sermonsContainer) {
    const query = `*[_type=="sermon"]|order(publishedAt desc){
      title,slug,type,category,publishedAt,
      "image":featuredImage.asset->url,
      "audio":audio.asset->url
    }`;

    fetchSermons(query, results => {
      allSermons = results;
      renderSermons();
    });

    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);
    loadMoreBtn?.addEventListener("click", () => renderSermons(true));

    function applyFilters() {
      const term = searchInput?.value.toLowerCase() || "";
      const cat = categoryFilter?.value || "all";
      const filtered = allSermons.filter(s =>
        s.title.toLowerCase().includes(term) &&
        (cat === "all" || s.category === cat)
      );
      currentIndex = 0;
      renderSermons(false, filtered);
    }

    function renderSermons(loadMore = false, sermons = allSermons) {
      if (!loadMore) sermonsContainer.innerHTML = "";

      const slice = sermons.slice(currentIndex, currentIndex + sermonsPerPage);
      slice.forEach(s => {
        sermonsContainer.innerHTML += `
          <div class="col-md-4 mb-4">
    <article class="sermon-card">

      <div class="sermon-thumb">
        <img src="${s.image || '/assets/gallery13.jpeg'}" alt="${s.title}">
        <span class="sermon-type">${s.type?.toUpperCase() || "SERMON"}</span>
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

      currentIndex += sermonsPerPage;
      loadMoreBtn.style.display = currentIndex >= sermons.length ? "none" : "block";
    }
  }

  /* ===============================
     9. SINGLE SERMON PAGE
  =============================== */
  const sermonContainer = document.getElementById("sermon-container");
  const slug = new URLSearchParams(window.location.search).get("slug");

  if (sermonContainer && slug) {
    const query = `*[_type=="sermon" && slug.current=="${slug}"][0]{
      title,type,scripture,publishedAt,body,videoUrl,externalLink,quote,
      "image":featuredImage.asset->url
    }`;

    fetchSermons(query, sermon => {
      if (!sermon) {
        sermonContainer.innerHTML = "<p>Sermon not found.</p>";
        return;
      }

      sermonContainer.innerHTML = `
        <h1>${sermon.title}</h1>
        <div>${renderPortableText(sermon.body)}</div>
      `;
    });
  }

});
