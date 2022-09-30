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

  isShown = 0;
  fetchGallery();
  // refs.BtnLoadMore.classList.remove('is-hidden');
  // const img = await renderGalleryInfo();
}
// Функція довантаження фото на сторінці
function onLoadmore() {
  fetchGallery();
  newsApiService.incrementPage();
}

async function fetchGallery() {
  refs.BtnLoadMore.classList.add('is-hidden');

  const r = await newsApiService.fetchGallery();
  // console.log(r.totalHits);
  const { hits, total, totalHits } = r;
  isShown += hits.length;
  console.log(hits.length);
  console.log(total);

  if (!hits.length) {
    Notiflix.Notify.warning(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.BtnLoadMore.classList.add('is-hidden');
    return;
  }

  renderGalleryInfo(hits);

  if (isShown < total) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images !!!`);
    refs.BtnLoadMore.classList.remove('is-hidden');
  }

  if (isShown >= total) {
    Notiflix.Notify.info(
      'We re sorry, but you have reached the end of search results.'
    );
  }
}

async function renderGalleryInfo(hits) {
  // console.log(hits);
  const markup = await hits.map(hits => createCard(hits)).join('');
  // console.log(hits);
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearImageContainer() {
  refs.galleryList.innerHTML = '';
}
