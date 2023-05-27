import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const lightbox = new SimpleLightbox('.gallery a');

import Notiflix from 'notiflix';

let counterPage = 1;

const form = document.querySelector('#search-form');
form.addEventListener('submit', onSubmit);
const newGallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

const refs = {
    url: 'https://pixabay.com/api/',
    key: '36730678-336aeda16ae09d290d6765b0a',
    q: `${find}`,
    page: counterPage,
}

let options = {
    root: null,
    rootMargin: '400px',
    threshold: 0,
}
let observer = new IntersectionObserver(scroll, options);

function onSubmit(e) {
    e.preventDefault();
    newGallery.innerHTML = '';
    refs.page = 1;

    const findFor = form.elements.searchQuery.value;

    findImg (findFor)
    .then (makeMarkup)
    .catch ((err) => {
        if (err.message === '404') {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        console.log(err);
    });
}

function findImg(find) {
    refs.q = `${find}`;

    return fetch(`${refs.url}?key=${refs.key}&q=${refs.q}}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${refs.page}`)
    .then((response) => {
        if(!response.ok) {
            throw new Error(response.status);
        }
    return response.json();
    })
    .then(data => data)
}

function makeMarkup(data) {
    console.log(data);
    if (data.hits.length !== 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        return newGallery.innerHTML = data.hits.map(({ largeImageURL, previewURL, tags, likes, views, comments, downloads }) => 
        `<div class="photo-card list">
            <a clas='gallery__link' href='${largeImageURL}'>
                <img class='gallery__image' src="${previewURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <h3>${likes}</h3>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <h3>${views}</h3>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <h3>${comments}</h3>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <h3>${downloads}</h3>
                </p>
            </div>
        </div>`).join('');
    }
    return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

