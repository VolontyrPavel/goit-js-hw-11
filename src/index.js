// imports //
import { FindImg } from './js/findImg';
const findImg = new FindImg();

import Notiflix, { Loading } from 'notiflix';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
var lightbox = new SimpleLightbox('.gallery a', { /* options */ });


// refs //
const form = document.querySelector('#search-form');
form.addEventListener('submit', onSubmit);

const newGallery = document.querySelector('.gallery');

let page = 0;
let allPages;

const guard = document.querySelector('.js-guard');
let options = {
    root: null,
    rootMargin: '400px',
    threshold: 0,
}
let observer = new IntersectionObserver(scroll, options);

// functions //

async function onSubmit(e) {
    e.preventDefault();
    newGallery.innerHTML = '';
    page = 10;
    observer.unobserve(guard);

    const inInput = form.elements.searchQuery.value.trim();

    if (!inInput) {
        return Notiflix.Notify.failure('Request field is empty. Please try again.');
    }

    findImg.q = inInput;
    findImg.page = page;

    createGallery();
}

async function createGallery() {
    try {
        const resp = await findImg.serverRequest();

        if (resp.data.hits.length === 0) {
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }

        Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
        newGallery.insertAdjacentHTML('beforeend', makeMarkup(resp.data));
        lightbox.refresh();

        allPages = Math.ceil(resp.data.totalHits/40);
        if (allPages > page) {
            observer.observe(guard);
        }

    }
    catch (err) {
        console.log(err);
    }
}

function makeMarkup(data) {
    return data.hits.map(({ largeImageURL, previewURL, tags, likes, views, comments, downloads }) => 
    `<div class="photo-card list">
        <a class='gallery__link' href='${largeImageURL}'>
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

function scroll(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            findImg.page = page += 1;
            createScroll();
        }
        if (allPages <= page) {
            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results");
            observer.unobserve(guard);
        }
    })
}

async function createScroll() {
    try {
        const resp = await findImg.serverRequest();

        newGallery.insertAdjacentHTML('beforeend', makeMarkup(resp.data));
        lightbox.refresh();

    }
    catch (err) {
        console.log(err);
    }
}