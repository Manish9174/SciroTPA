class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('#header-search'); 
    this.input.addEventListener('input', this.debounce(this.onInputChange.bind(this), 300)); 
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');

    if (searchTerm) {
      this.input.value = searchTerm; 
      this.onInputChange();
    }
  }
 
  onInputChange = async () => { 
   $('.search_collection, .frequent_search[data-pagetype]').hide();
    $('.search_clear_btn').removeClass('d-none');
    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      this.close();  
      const frequentSearchEl = document.querySelector('p.m-0.frequent_search');
      if (frequentSearchEl) {
          frequentSearchEl.style.display = "block";
      }
     const searchCollectionEl = document.querySelector('.search_collection');
      if (searchCollectionEl) {
        searchCollectionEl.style.display = "flex";
      }
      const search11FrequentEl = document.querySelector('#search11 p.m-0.frequent_search');
      if (search11FrequentEl) {
          search11FrequentEl.style.display = "block";
      } 
      const search11CollectionEl = document.querySelector('#search11 .search_collection');
      if (search11CollectionEl) {
          search11CollectionEl.style.display = "flex";
      }
      return;
    }
 
    await this.getSearchResults(searchTerm);
  }; 
  
  async getSearchResults(searchTerm) {
    try {
      const encodedTerm = encodeURIComponent(searchTerm); 
       const predictiveSearchEl = document.querySelector('.predictive-search');
      if(predictiveSearchEl) { 
        const searchSuggestPath = (() => { 
          const segments = window.location.pathname.split('/').filter(Boolean);
          const first = segments[0];
          const localesAttr = predictiveSearchEl.dataset.locale || '';  
            const KNOWN_LOCALES = localesAttr;  

            if (KNOWN_LOCALES.includes(first)) { 
                return `/${first}/search/suggest`;
              } 
              return '/search/suggest';
        })();

          const url = `${searchSuggestPath}?q=${encodedTerm}&resources[type]=product,page,collection,article&section_id=predictive-search`;

          const response = await fetch(url);

          if (!response.ok) {
            this.close();
            throw new Error(response.status);
          }

          const text = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          const resultsSection = doc.querySelector('#shopify-section-predictive-search');

          if (!resultsSection) {
            this.close();
            return;
          }

          const resultsMarkup = resultsSection.innerHTML;
          this.predictiveSearchResults.innerHTML = resultsMarkup;
          this.open();
      }
    } catch (error) {
      this.close();
    }
  }
  open() {
    this.predictiveSearchResults.style.display = 'block';
  }
 
  close() {
    this.predictiveSearchResults.style.display = 'none';
  } 
  debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }
} 
customElements.define('predictive-search', PredictiveSearch);
