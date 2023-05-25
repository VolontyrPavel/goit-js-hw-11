const form = document.querySelector('#search-form');

form.addEventListener('submit', onSubmit);


function onSubmit(e) {
    e.preventDefault();
    findFor = form.elements.searchQuery.value;
    findImg (findFor);
}

function findImg(find) {
    const refs = {
        url: 'https://pixabay.com/api/',
        key: '36730678-336aeda16ae09d290d6765b0a',
        q: `${find}`,
    }

    return fetch(`${refs.url}?key=${refs.key}&q=${refs.q}}&image_type=photo&orientation=horizontal&safesearch=true`)
    .then (resp => resp.json())
}
