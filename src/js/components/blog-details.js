// ============================================================
// FarmVest Blog Details Dynamic Renderer
// Parses URL query string (?id=X) and populates blog details
// ============================================================

import { articles, getArticleById, getArticleBySlug } from '../data/articles.js';

export function initBlogDetails() {
  const page = document.querySelector('.blog-details-page');
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  const slugParam = params.get('slug');

  let article = articles[0];
  if (idParam) {
    article = getArticleById(idParam);
  } else if (slugParam) {
    article = getArticleBySlug(slugParam);
  }

  // Update Page Title and Meta Description
  document.title = `${article.title} — FarmVest Insights`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', article.lead);
  }

  // Update Category Badge
  const catEl = document.getElementById('blogDetailCategory');
  if (catEl) {
    catEl.innerHTML = `<i class="fas fa-leaf me-1"></i> ${article.categoryName}`;
  }

  // Update Hero Title
  const titleEl = document.getElementById('blogDetailTitle');
  if (titleEl) {
    titleEl.textContent = article.title;
  }

  // Update Author Meta Header
  const authorEl = document.getElementById('blogDetailAuthor');
  if (authorEl) {
    authorEl.innerHTML = `<i class="fas fa-user-pen me-2" style="color:#10B981;"></i>${article.author.name}`;
  }

  const dateEl = document.getElementById('blogDetailDate');
  if (dateEl) {
    dateEl.innerHTML = `<i class="fas fa-calendar me-2" style="color:#10B981;"></i>${article.date}`;
  }

  const readTimeEl = document.getElementById('blogDetailReadTime');
  if (readTimeEl) {
    readTimeEl.innerHTML = `<i class="fas fa-clock me-2" style="color:#10B981;"></i>${article.readTime}`;
  }

  // Update Featured Image
  const imgEl = document.getElementById('blogDetailImage');
  if (imgEl) {
    imgEl.src = article.image;
    imgEl.alt = article.imageAlt || article.title;
    imgEl.style.maxHeight = '380px';
    imgEl.style.objectFit = 'cover';
    imgEl.style.width = '100%';
  }

  // Update Lead Paragraph
  const leadEl = document.getElementById('blogDetailLead');
  if (leadEl) {
    leadEl.textContent = article.lead;
  }

  // Update Article Body HTML
  const bodyEl = document.getElementById('blogDetailBody');
  if (bodyEl) {
    bodyEl.innerHTML = article.content;
  }

  // Update Author Bio Card
  const authorAvatar = document.getElementById('blogAuthorAvatar');
  if (authorAvatar) {
    authorAvatar.src = article.author.avatar;
    authorAvatar.alt = article.author.name;
  }

  const authorName = document.getElementById('blogAuthorName');
  if (authorName) {
    authorName.textContent = article.author.name;
  }

  const authorRole = document.getElementById('blogAuthorRole');
  if (authorRole) {
    authorRole.textContent = article.author.role;
  }

  const authorBio = document.getElementById('blogAuthorBio');
  if (authorBio) {
    authorBio.textContent = article.author.bio;
  }

  // Update Related Articles
  const relatedContainer = document.getElementById('blogRelatedContainer');
  if (relatedContainer) {
    const related = articles.filter((a) => a.id !== article.id).slice(0, 2);
    relatedContainer.innerHTML = related
      .map(
        (rel, idx) => `
      <div class="col-md-6" data-aos="fade-up" data-aos-delay="${idx * 100}">
        <article class="blog-card shadow-sm rounded-4 overflow-hidden border bg-white h-100 d-flex flex-column">
          <a href="/blog-details.html?id=${rel.id}" class="blog-card__thumb position-relative overflow-hidden" style="height: 180px;">
            <img loading="lazy" src="${rel.image}" alt="${rel.imageAlt || rel.title}" class="w-100 h-100 object-fit-cover" />
          </a>
          <div class="blog-card__body p-4 flex-grow-1 d-flex flex-column">
            <div class="blog-card__meta text-xs text-success font-weight-bold text-uppercase mb-2 d-flex gap-3">
              <span><i class="fas fa-tag me-1"></i> ${rel.categoryName}</span>
              <span><i class="fas fa-calendar-alt me-1"></i> ${rel.date}</span>
            </div>
            <h4 class="h6 font-serif fw-bold mb-3">
              <a href="/blog-details.html?id=${rel.id}" class="blog-card-title-link">${rel.title}</a>
            </h4>
            <a href="/blog-details.html?id=${rel.id}" class="btn btn-link text-success p-0 font-weight-bold mt-auto text-decoration-none">
              Read Article <i class="fas fa-arrow-right ms-1"></i>
            </a>
          </div>
        </article>
      </div>
    `
      )
      .join('');
  }
}
