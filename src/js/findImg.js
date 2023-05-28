import axios from 'axios';

export class FindImg {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '36730678-336aeda16ae09d290d6765b0a';
    #q = '';
    #page = 0;

    serverRequest() {
        return axios.get(`${this.#BASE_URL}`, {
            params: {
                key: this.#API_KEY,
                q: this.#q,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: 40,
                page: this.#page,
            }
        })
    }

    get q() {
        this.#q;
    }
    
    set q(newQ) {
        this.#q = newQ;
    }
    
    get page() {
        this.#page;
    }
    
    set page(newPage) {
        this.#page = newPage;
    } 
}
