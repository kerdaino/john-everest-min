document.addEventListener("DOMContentLoaded", function () {

    // ===== 1. SWIPER HERO SLIDER INIT =====
    if (document.querySelector('.mySwiper')) {
        const swiper = new Swiper(".mySwiper", {
            loop: true,
            effect: "fade",
            speed: 1500,
            autoplay: { delay: 6000, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
            on: {
                slideChangeTransitionStart: function () {
                    gsap.set('.hero-content', { opacity: 0, y: 50 });
                },
                slideChangeTransitionEnd: function () {
                    gsap.to('.hero-content', { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
                }
            }
        });
        gsap.to('.hero-content', { opacity: 1, y: 0, duration: 1.5, delay: 0.5, ease: "power3.out" });
    }

    // ===== 2. QUOTE SLIDER =====
    if (document.querySelector('.quoteSwiper')) {
        new Swiper(".quoteSwiper", {
            loop: true,
            effect: "fade",
            fadeEffect: { crossFade: true },
            speed: 1000,
            autoplay: { delay: 5000, disableOnInteraction: false },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        });
    }

    // ===== 3. MAGIC CURSOR LOGIC =====
    const cursor = document.querySelector('.cb-cursor');
    const follower = document.querySelector('.cb-cursor-follower');

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.1 });
            gsap.to(follower, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.3 });
        });
        const links = document.querySelectorAll('a, button, .btn');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 2.5, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "transparent" });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, backgroundColor: "transparent", borderColor: "#fff" });
            });
        });
    }

    // ===== 4. NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // ===== 5. GSAP SCROLL REVEAL =====
    gsap.registerPlugin(ScrollTrigger);
    const revealElements = document.querySelectorAll('.gs-reveal');
    revealElements.forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 85%" }
            }
        );
    });

    // ===== 6. SANITY CONFIG =====
    const projectId = "30lhaxyx";
    const dataset = "production";
    const apiVersion = "2023-01-01";

    // ===== 7. GLOBAL SANITY FUNCTIONS =====
    function fetchSermons(query, callback) {
        fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => callback(data.result))
            .catch(err => console.error(err));
    }

    function renderPortableText(blocks) {
        if (!blocks) return "";
        let html = "";
        let listBuffer = [];

        blocks.forEach((block, index) => {
            if (block._type === "block" && block.listItem === "bullet") {
                const text = block.children.map(span => renderSpan(span)).join("");
                listBuffer.push(`<li>${text}</li>`);
                const next = blocks[index + 1];
                if (!next || next.listItem !== "bullet") {
                    html += `<ul>${listBuffer.join("")}</ul>`;
                    listBuffer = [];
                }
                return;
            }
            if (listBuffer.length) {
                html += `<ul>${listBuffer.join("")}</ul>`;
                listBuffer = [];
            }
            if (block._type === "block") {
                const text = block.children.map(span => renderSpan(span)).join("");
                switch (block.style) {
                    case "h2": html += `<h2>${text}</h2>`; break;
                    case "h3": html += `<h3>${text}</h3>`; break;
                    case "blockquote": html += `<blockquote>${text}</blockquote>`; break;
                    default: html += `<p>${text}</p>`;
                }
            }
        });

        return html;
    }

    function renderSpan(span) {
        let text = span.text;
        if (span.marks && span.marks.length) {
            span.marks.forEach(mark => {
                if (mark === "strong") text = `<strong>${text}</strong>`;
                if (mark === "em") text = `<em>${text}</em>`;
            });
        }
        return text;
    }

    // ===== 8. SERMONS PAGE LOGIC =====
    const sermonsContainer = document.getElementById("sermons-container");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const loadMoreBtn = document.getElementById("load-more-btn");

let allSermons = [];
let sermonsPerPage = 6;
let currentIndex = 0;

if (sermonsContainer) {
    const query = `*[_type == "sermon"] | order(publishedAt desc) {
      title,
      slug,
      type,
      category,
      publishedAt,
      "image": featuredImage.asset->url,
      "audio": audio.asset->url
    }`;

    fetchSermons(query, (results) => {
        allSermons = results;
        renderSermons(); // render first batch
    });

    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);
    loadMoreBtn?.addEventListener("click", () => renderSermons(true));

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const filtered = allSermons.filter(sermon =>
            sermon.title.toLowerCase().includes(searchTerm) &&
            (category === "all" || sermon.category === category)
        );
        currentIndex = 0;
        renderSermons(false, filtered);
    }

    function renderSermons(loadMore = false, sermons = allSermons) {
        if (!loadMore) {
            sermonsContainer.innerHTML = "";
            currentIndex = 0;
        }

        const nextIndex = currentIndex + sermonsPerPage;
        const sermonsToRender = sermons.slice(currentIndex, nextIndex);

        sermonsToRender.forEach(sermon => {
            sermonsContainer.innerHTML += `
      <div class="col-md-4 mb-4">
        <article class="sermon-card">
          <div class="sermon-thumb">
            <img src="${sermon.image || '/assets/gallery13.jpeg'}">
            <span class="sermon-type">${sermon.type.toUpperCase()}</span>
          </div>
          <div class="p-4">
            <h5 class="text-white serif">${sermon.title}</h5>
            <p class="text-gray small">${sermon.category || ""}</p>
            ${sermon.audio ? `
              <audio controls class="w-full mt-3">
                <source src="${sermon.audio}" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
            ` : ''}
            <a href="sermon.html?slug=${sermon.slug.current}" class="link-gold mt-2 inline-block">
              View Details →
            </a>
          </div>
        </article>
      </div>
    `;
        });

        currentIndex = nextIndex;

        // Hide button if no more sermons
        if (currentIndex >= sermons.length) {
            loadMoreBtn?.style.display = "none";
        } else {
            loadMoreBtn?.style.display = "block";
        }

        // Show message if no sermons
        if (!sermons.length && !loadMore) {
            sermonsContainer.innerHTML = "<p class='text-gray text-center'>No sermons found.</p>";
        }
    }
}

    // ===== 9. INDIVIDUAL SERMON PAGE LOGIC =====
    const sermonContainer = document.getElementById("sermon-container");
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    if (sermonContainer && slug) {
        const query = `*[_type == "sermon" && slug.current == "${slug}"][0]{
            title, type, scripture, publishedAt, body, videoUrl, externalLink, quote,
            "image": featuredImage.asset->url
        }`;

        fetchSermons(query, (sermon) => renderSermon(sermon));
    }

    function renderSermon(sermon) {
    if (!sermon) {
        sermonContainer.innerHTML = "<p class='text-white'>Sermon not found.</p>";
        return;
    }

    // --- Render sermon meta
    const meta = `<p class="text-gray mb-4">${sermon.scripture || ""} • ${new Date(sermon.publishedAt).toDateString()}</p>`;

    // --- Render sermon content based on type
    let contentHtml = "";
    switch (sermon.type) {
        case "writeup":
            contentHtml = `<h1 class="text-white serif mb-3">${sermon.title}</h1>${meta}<div class="sermon-body text-gray">${renderPortableText(sermon.body)}</div>`;
            break;
        case "video":
            contentHtml = `<h1 class="text-white serif mb-3">${sermon.title}</h1>${meta}<div class="ratio ratio-16x9 my-5"><iframe src="${sermon.videoUrl}" allowfullscreen></iframe></div>`;
            break;
        case "link":
            contentHtml = `<h1 class="text-white serif mb-3">${sermon.title}</h1>${meta}<a href="${sermon.externalLink}" target="_blank" class="btn btn-primary">Open Sermon →</a>`;
            break;
        case "quote":
            contentHtml = `<div class="quote-sermon" style="background-image:url('${sermon.image}')"><blockquote class="sermon-quote">${sermon.quote}</blockquote></div>`;
            break;
        default:
            contentHtml = "<p class='text-white'>Sermon not found.</p>";
    }

    sermonContainer.innerHTML = contentHtml;

    // --- Dynamic SEO / OG tags ---
    document.getElementById('sermon-title').textContent = `${sermon.title} — John Everest Ministries`;
    const descriptionText = sermon.body ? sermon.body[0].children.map(c => c.text).join(' ').slice(0, 160) : 'Life-giving teachings, revival messages & apostolic doctrine';
    document.getElementById('sermon-meta-description').setAttribute('content', descriptionText);
    document.getElementById('og-title').setAttribute('content', sermon.title);
    document.getElementById('og-description').setAttribute('content', descriptionText);
    document.getElementById('og-image').setAttribute('content', sermon.image || '/assets/gallery13.jpeg');
    document.getElementById('og-url').setAttribute('content', window.location.href);
    document.getElementById('canonical-url').setAttribute('href', window.location.href);

    // --- JSON-LD structured data ---
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": sermon.title,
        "image": [sermon.image || window.location.origin + '/assets/gallery13.jpeg'],
        "author": { "@type": "Organization", "name": "John Everest Ministries Int'l" },
        "datePublished": sermon.publishedAt,
        "description": descriptionText,
        "url": window.location.href
    };

    // Add video/audio info if exists
    if(sermon.videoUrl){
        schema.video = {
            "@type": "VideoObject",
            "name": sermon.title,
            "thumbnailUrl": sermon.image || window.location.origin + '/assets/gallery13.jpeg',
            "uploadDate": sermon.publishedAt,
            "contentUrl": sermon.videoUrl
        };
    }
    if(sermon.audio){
        schema.audio = {
            "@type": "AudioObject",
            "contentUrl": sermon.audio,
            "description": sermon.title
        };
    }

    document.getElementById('sermon-schema').textContent = JSON.stringify(schema);
}

});
