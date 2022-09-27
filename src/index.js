import './css/styles.css';
import NewsApiService from './js/news-service';
// import imageTpl from './templates/images.hbs';
import createCard from './js/createCard';
import { lightbox } from './js/lighbox';

import Notiflix from 'notiflix';
// import LoadMoreBtn from './js/load-more-btn';

console.log('START!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

const refs = {
  searchForm: document.querySelector('.search-form'),
  BtnSubmit: document.querySelector('button[type=submit]'),
  BtnLoadMore: document.querySelector('.load-more'),
  galleryList: document.querySelector('.gallery'),
};

// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });
let isShown = 0;
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.BtnLoadMore.addEventListener('click', onLoadmore);
// loadMoreBtn.refs.button.addEventListener('click', onLoadmore);

//  Функція пошуку   картинок при Сабміт !!!
function onFormSubmit(evt) {
  evt.preventDefault();
  clearImageContainer();

  newsApiService.query = evt.currentTarget.elements.query.value.trim();
  newsApiService.resetPage();

  if (newsApiService.query === '') {
    Notiflix.Notify.info('Please, fill the main field');
    return;
  }

  // newsApiService.fetchGallery().then(console.log);
  isShown = 0;
  fetchGallery();
  refs.BtnLoadMore.classList.remove('is-hidden');
  renderGalleryInfo();

  // newsApiService.fetchGallery().then(renderGalleryInfo);
  // refs.BtnLoadMore.classList.remove('is-hidden');
}
// Функція довантаження фото на сторінці
function onLoadmore() {
  // newsApiService.fetchGallery().then(renderGalleryInfo);
  fetchGallery();
  newsApiService.incrementPage();
}

async function fetchGallery() {
  refs.BtnLoadMore.classList.add('is-hidden');

  const r = await newsApiService.fetchGallery();
  const { hits, total } = r;
  isShown += hits.length;

  if (!hits.length) {
    Notiflix.Notify.warning(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.BtnLoadMore.classList.add('is-hidden');
    return;
  }

  renderGalleryInfo(hits);
  isShown += hits.length;

  if (isShown < total) {
    Notiflix.Notify.success(`Hooray! We found ${total} images !!!`);
    refs.BtnLoadMore.classList.remove('is-hidden');
  }

  if (isShown >= total) {
    Notiflix.Notify.info(
      'We re sorry, but you have reached the end of search results.'
    );
  }
}

function renderGalleryInfo(hits) {
  console.log(hits);
  const markup = hits.map(hits => createCard(hits)).join('');
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearImageContainer() {
  refs.galleryList.innerHTML = '';
}
