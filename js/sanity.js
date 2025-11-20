/* sanity.js - example Sanity client fetch helpers (frontend)
   NOTE: Do NOT include private tokens in client. Use read-only dataset or use serverless proxy.
   When we set up backend, we'll provide actual client instantiation and example queries.
*/

/* Example fetch function using Sanity's HTTP API public dataset:
   We'll use fetch() to call Sanity's CDN read endpoints (requires dataset + projectId).
   For now these functions are placeholders and return sample data.
*/

const SANITY_CONFIG = {
  projectId: '', // set when wiring backend (Vercel env)
  dataset: 'production',
  apiVersion: '2025-01-01', // version
  useCdn: true
};

async function sanityFetch(query, params = {}) {
  // This is a safe wrapper that will be wired to actual Sanity CDN when configured.
  if(!SANITY_CONFIG.projectId) {
    console.warn('Sanity not configured — returning sample data');
    // return sample
    return [];
  }
  const qs = encodeURIComponent(query);
  const url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${qs}`;
  const res = await fetch(url);
  return res.json().then(r => r.result || []);
}

/* Sample function to load latest posts and inject to blog page */
async function loadPosts(limit = 6) {
  try {
    const posts = await sanityFetch('*[_type == "post"] | order(publishedAt desc)[0...'+limit+']{title,slug,excerpt,mainImage}');
    // TODO: render into page
    const container = document.getElementById('postsList');
    if(!container) return;
    container.innerHTML = '';
    posts.forEach(p => {
      const art = document.createElement('article');
      art.className = 'post-card';
      art.innerHTML = `
        <img src="${p?.mainImage?.asset?._ref ? '/assets/placeholder.webp' : 'assets/placeholder.webp'}" alt="${p.title}" loading="lazy" />
        <div class="post-body">
          <h2><a href="sermon.html?id=${p.slug?.current || '#'}">${p.title}</a></h2>
          <p class="excerpt">${p.excerpt || ''}</p>
        </div>
      `;
      container.appendChild(art);
    });
  } catch (err) {
    console.error('loadPosts error', err);
  }
}

/* Expose stub */
window.sanityAPI = {
  config: SANITY_CONFIG,
  fetch: sanityFetch,
  loadPosts
};

/* If on blog page, auto-load some posts (sample) */
document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('postsList')) {
    loadPosts(6);
  }
});
