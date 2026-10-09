 


const currentUrl = new URL(window.location.href);
const existingParams = new URLSearchParams(currentUrl.search);

let hasOtherParams = false; 
for (const [key] of existingParams) {
  if (key !== 'q' && key !== 'sort_by') {
    hasOtherParams = true;
    break;  
  }
}
if(!hasOtherParams){ $('a.active-filters__clear').addClass('d-none') 
                    $('.active-filters').removeClass('py-3') }
 




function updateURLState(searchParams) {
  const currentUrl = new URL(window.location.href);
  const existingParams = new URLSearchParams(currentUrl.search); 

  let hasOtherParams = false;
  existingParams.forEach((value, key) => {
    if (key !== 'q') {
      hasOtherParams = true;
    }
  }); 
  $('a.active-filters__clear').removeClass('d-none')
   $('.active-filters').addClass('py-3')

  
  const qValue = existingParams.get('q');
  const updatedParams = new URLSearchParams(searchParams);

  if (qValue) {
      updatedParams.set('q', qValue);  
  } 
  history.pushState(
      { searchParams: updatedParams.toString() },
      '',
      `${window.location.pathname}?${updatedParams.toString()}`
  ); 
  reinitializeSwiper();
}

function reinitializeSwiper() { 
  if (window.swiper1 && window.swiper1.destroy) {
      window.swiper1.destroy(true, true);  
  } 
  window.swiper1 = new Swiper(".card_swiper", {
      navigation: {
          nextEl: ".quickview.swiper-next",
          prevEl: ".quickview.swiper-prev",  
      },
  });
}





function updatePagination(searchParams) {  
  const paginationLinks = document.querySelectorAll('.products-pagination a');
  const existingSearchParams = new URLSearchParams(searchParams);

  paginationLinks.forEach(link => {
      const url = new URL(link.href);
      const linkSearchParams = new URLSearchParams(url.search); 
      const qValue = linkSearchParams.get('q');
      if (qValue) {
          existingSearchParams.set('q', qValue);
      }

      for (const [key, value] of existingSearchParams.entries()) {
          linkSearchParams.set(key, value);
      }

      link.href = `${url.pathname}?${linkSearchParams.toString()}`;
  });



 
                                         
}




// Filters & Sorting
class ProductFilters1 extends HTMLElement{
  constructor(){
      super(); 
      this.form = this.querySelector('form');
      this.details = this.getElementsByTagName('details');
      this.submitButtons = this.querySelectorAll('button[type="submit"]')

      this.filterDrawerToggle = this.querySelector('.facet-filters-toggle');
      this.filterDrawerContent = this.querySelector('.facet-filters-content');
      this.filterDrawerOverlay = this.querySelector('.facet-filters-form-overlay');
      this.filterDrawerClose = this.querySelector('.facet-filters-list-close'); 
      this.mobileFilterClick();  
      this.ajaxFilter(); 
      this.priceRangeSlider();
  }

  mobileFilterClick = () => {
      this.filterDrawerToggle.addEventListener('click', (e) => {
          e.preventDefault();
          
          if( this.filterDrawerContent.classList.contains('active') ){
              this.filterDrawerContent.classList.remove('active');
          }
          else{
              this.filterDrawerContent.classList.add('active');
          }
      })

      document.addEventListener('click', (event) => { 
          var filterDrawerClose = document.querySelector('.facet-filters-list-close');
          if (event.target == filterDrawerClose || filterDrawerClose.contains(event.target)) {
              this.filterDrawerContent.classList.remove('active');
          } 
      })

      this.filterDrawerOverlay.addEventListener('click', (e) => {
          
          this.filterDrawerContent.classList.remove('active');
          
      })
  }

  


  filterClose = () => {
      document.addEventListener('click', (event) => {
          this.details = this.getElementsByTagName('details');
          for(let detail of this.details){
              if (event.target !== detail && !detail.contains(event.target)) {
                  detail.removeAttribute('open');
              }
          }
      })
  }

  ajaxFilter = () => {

      document.addEventListener('change', (event) => {
          var filterInputElements = this.querySelectorAll('input[type="checkbox"], input[type="number"]');
          filterInputElements.forEach(filterInputElement => {

              if (event.target == filterInputElement || filterInputElement.contains(event.target)) { 
                  this.ajaxFiltering(event);
              }
          })
      })

      document.addEventListener('keyup', (event) => {
          if(event.key == 'Enter'){   
              
              var filterInputElements = this.querySelectorAll('.filter-group-display__list-item');
              filterInputElements.forEach(filterInputElement => {
                  if (event.target == filterInputElement || filterInputElement.contains(event.target)) { 
                      filterInputElement.querySelector('input[type="checkbox"], input[type="number"]').click();
                  }
              })
          }
      })

      var filterPriceRangeMin = this.querySelector('.price-range-handle-min');
      var filterPriceRangeMax = this.querySelector('.price-range-handle-max');


      document.addEventListener('keyup', (event) => {
          var focusedMin = this.querySelector('.price-range-handle-min:focus-visible');
          var focusedMax = this.querySelector('.price-range-handle-max:focus-visible');
          if(event.key == 'Tab'){
              if(focusedMin){
                  this.isDraggingMin = true 
                  this.isDraggingMax = false 
              }
              if(focusedMax){
                  this.isDraggingMax = true 
                  this.isDraggingMin = false 
              }

              if(focusedMin == null && focusedMax == null){
                  this.isDraggingMax = false 
                  this.isDraggingMin = false 
              }
          }

          if(event.key == 'Enter'){
              if(focusedMin || focusedMax){
                  this.ajaxFiltering(event);
              }
          }
      });

      
     

      var priceSliderWidth = document.querySelector('.price-range-handle-base').offsetWidth
      var currentOffset = 0
      var currentOffsetLeft = 0
      var currentOffsetRight = 240
      document.addEventListener('keydown', (event) => { 
          if(event.key == 'ArrowLeft'){   
              if(this.isDraggingMin){
                  currentOffset = currentOffset - 10;
              }
              if(this.isDraggingMax){
                  currentOffset = currentOffset + 10;
              }
             
          }

          if(event.key == 'ArrowRight'){    
              if(this.isDraggingMin){
                  currentOffset = currentOffset + 10;
              }
              if(this.isDraggingMax){
                  currentOffset = currentOffset - 10;
              }
               

          }
           
          if(this.isDraggingMin){
              this.onMove(event, currentOffset);
          }
          if(this.isDraggingMax){
              this.onMove(event, (priceSliderWidth - currentOffset));
          }
      })


  }


  getParams(){

      const formData = new FormData(this.form);
      return new URLSearchParams(formData).toString();
      
  }


  getUrlParams = () => {
      Shopify.queryParams = [];
      var queryParams = [];
      if(window.location.search.length) {
          
        for(var aKeyValue, i = 0, aCouples = window.location.search.substring(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
              if( aKeyValue[1].length > 0 ){

                  if( aKeyValue[0] != 'page' ){
                      queryParams.push({ key: decodeURIComponent(aKeyValue[0]), value: decodeURIComponent(aKeyValue[1])});
                  }
              }
          }
        }
      }

      var formParams = this.getParams();

      if(formParams.length) {
          for(var aKeyValue, i = 0, aCouples = formParams.split('&'); i < aCouples.length; i++) {
              aKeyValue = aCouples[i].split('=');
              if (aKeyValue.length > 1) {
                  Shopify.queryParams.push({ key: decodeURIComponent(aKeyValue[0]), value: decodeURIComponent(aKeyValue[1])});
              }
          }
      }
       
      var combinedQueryParams = [...Shopify.queryParams];
      var params = '';

      combinedQueryParams.forEach((param, index) => {
          params += `${param['key']}=${param['value']}`; 

          if( (index + 1) != combinedQueryParams.length ){
              params += `&`;
          }
      }) 

      return params;
  }

ajaxFiltering = (event) => {
  let searchParams = this.getUrlParams(); 
  const currentUrl = new URL(window.location.href);
  const existingParams = new URLSearchParams(currentUrl.search);
  const qValue = existingParams.get('q'); 
  if (qValue) {
      searchParams = `q=${encodeURIComponent(qValue)}&${searchParams}`;
  } 
  const productsSelector = '.products';
  const filtersSelector = '.facet-filters';
  const productsSection = document.querySelector(productsSelector);
  const filtersSection = document.querySelector(filtersSelector); 
  const productsSectionId = productsSection.dataset.id;
  const filtersSectionId = filtersSection.dataset.id; 
  fetch(`${window.location.pathname}?section_id=${filtersSectionId}&${searchParams}`)
      .then(response => response.text())
      .then((text) => {
          this.insertFilteredFacets(text);
      });

  fetch(`${window.location.pathname}?section_id=${productsSectionId}&${searchParams}`)
      .then(response => response.text())
      .then((text) => {
          this.insertFilteredProducts(text);
          updateURLState(searchParams);
          this.closeDropdown(event);
          this.filterDrawerContent.classList.remove('active');
      });
};



  closeDropdown = (event) => {
      var detail = event.target.closest('details')
      if( detail ){
          detail.removeAttribute('open');
      }
  }

  insertFilteredFacets = (text) => { 

      var filtersSelector = '.facet-filters';
      var filtersSection = document.querySelector(filtersSelector + ' .filter-form');
      var filtersCountSection = document.querySelector('.facet-filters-count');

      const html = document.createElement('div');
      html.innerHTML = text;
      const newFiltersSection = html.querySelector(filtersSelector + ' .filter-form');
      const newFiltersCountSection = html.querySelector('.facet-filters-count'); 
      
      filtersSection.innerHTML = newFiltersSection.innerHTML;
      filtersCountSection.innerHTML = newFiltersCountSection.innerHTML;

      const resultsLazyloadImages = filtersSection.querySelectorAll('.lazy-loading-image');

      resultsLazyloadImages.forEach(imageContainer => {
          lazyloading(imageContainer);
      })
  }

  insertFilteredProducts = (text) => {


      var productsSelector = '.products';
      var productsSection = document.querySelector(productsSelector);

      const html = document.createElement('div');
      html.innerHTML = text;
      const newProductsSection = html.querySelector(productsSelector); 

      productsSection.innerHTML = newProductsSection.innerHTML;

      const resultsLazyloadImages = productsSection.querySelectorAll('.lazy-loading-image');

      resultsLazyloadImages.forEach(imageContainer => {
          lazyloading(imageContainer);
      })
      
  }

  setPriceFilterHandleWidth = (currentHandleMinWidth, currentHandleMaxWidth) => {

      var filtersSelector = '.facet-filters';
      var filtersSection = document.querySelector(filtersSelector + ' .filter-form');

      var handleMin = filtersSection.querySelector('.filter-group-display__price-range-slider-handle--min');
      var handleMax = filtersSection.querySelector('.filter-group-display__price-range-slider-handle--max'); 

      handleMin.style.width = currentHandleMinWidth;
      handleMax.style.width = currentHandleMaxWidth;
  }


  priceRangeSlider = () => {

      this.isDraggingMin = false,
      this.isDraggingMax = false,
      this.isOutofRange = false;


      document.addEventListener('mouseup', (event) => { 

          this.handle = this.querySelector('.filter-group-display__price-range-slider');
          this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
          this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

          this.minPriceElement = this.querySelector('.filter-group-display__price-range-from input[type="number"]');
          this.maxPriceElement = this.querySelector('.filter-group-display__price-range-to input[type="number"]');

          this.minPrice = this.minPriceElement.getAttribute('min');
          this.maxPrice = this.maxPriceElement.getAttribute('max');


          this.minWidth = this.handleMin.offsetWidth;
          this.maxWidth = this.handleMax.offsetWidth;
          this.handleWidth = this.handle.offsetWidth;

          this.priceRange = this.maxPrice - this.minPrice;
          
          this.sliderPosition = {
              top: this.handle.getBoundingClientRect().top + window.scrollY, 
              left: this.handle.getBoundingClientRect().left + window.scrollX, 
          };


          if (event.target == this.handleMin || this.handleMin.contains(event.target)) {
              this.isDraggingMin = false 

              this.ajaxFiltering(event);
          }
          if (event.target == this.handleMax || this.handleMax.contains(event.target)) {
              this.isDraggingMax = false 

              this.ajaxFiltering(event);
          }

      });
      document.addEventListener('mousedown', (event) => { 

          this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
          this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

          if (event.target == this.handleMin || this.handleMin.contains(event.target)) {
              this.isDraggingMin = true 
          }
          if (event.target == this.handleMax || this.handleMax.contains(event.target)) {
              this.isDraggingMax = true 
          }
      });

      document.addEventListener('touchend', (event) => { 

          this.handle = this.querySelector('.filter-group-display__price-range-slider');
          this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
          this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

          this.minPriceElement = this.querySelector('.filter-group-display__price-range-from input[type="number"]');
          this.maxPriceElement = this.querySelector('.filter-group-display__price-range-to input[type="number"]');

          this.minPrice = this.minPriceElement.getAttribute('min');
          this.maxPrice = this.maxPriceElement.getAttribute('max');


          this.minWidth = this.handleMin.offsetWidth;
          this.maxWidth = this.handleMax.offsetWidth;
          this.handleWidth = this.handle.offsetWidth;

          this.priceRange = this.maxPrice - this.minPrice;
          
          this.sliderPosition = {
              top: this.handle.getBoundingClientRect().top + window.scrollY, 
              left: this.handle.getBoundingClientRect().left + window.scrollX, 
          };

          if (event.target == this.handleMin || this.handleMin.contains(event.target)) {
              this.isDraggingMin = false 

              this.ajaxFiltering(event);
          }
          if (event.target == this.handleMax || this.handleMax.contains(event.target)) {
              this.isDraggingMax = false 

              this.ajaxFiltering(event);
          }
      });
      document.addEventListener('touchstart', (event) => { 

          this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
          this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

          if (event.target == this.handleMin || this.handleMin.contains(event.target)) {
              this.isDraggingMin = true 
          }

          if (event.target == this.handleMax || this.handleMax.contains(event.target)) {
              this.isDraggingMax = true 
          }
      });


      document.addEventListener('mousemove', (e) => this.onMove(e));
      document.addEventListener('touchmove', (e) => this.onMove(e));

      document.addEventListener('mouseup', (e) => { this.onMouseUp(); })
      document.addEventListener('touchend', (e) => { this.onMouseUp(); })
      document.addEventListener('mousedown', (e) => { e.key == "Escape" && this.onMouseUp(); });

  }

  onMove = (e, offsetX = null) => {

      if( !(this.isDraggingMax == true || this.isDraggingMin == true) ){
          return false;
      }
       

      var type = e.type;
      var pageX = e.pageX;
      if(offsetX == null){
          offsetX = e.offsetX;
      }

      if (type === "touchmove") {
          var touch = e.touches[0] || e.changedTouches[0];
          var touchOffset = 34;
          offsetX = touch.pageX - touchOffset;

      } 

      this.handle = this.querySelector('.filter-group-display__price-range-slider');
      this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
      this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

      this.minPriceElement = this.querySelector('.filter-group-display__price-range-from input[type="number"]');
      this.maxPriceElement = this.querySelector('.filter-group-display__price-range-to input[type="number"]');

      this.minPrice = this.minPriceElement.getAttribute('min');
      this.maxPrice = this.maxPriceElement.getAttribute('max');



      this.minWidth = this.handleMin.offsetWidth;
      this.maxWidth = this.handleMax.offsetWidth;
      this.handleWidth = this.handle.offsetWidth;

      this.priceRange = this.maxPrice - this.minPrice;
      
      this.sliderPosition = {
          top: this.handle.getBoundingClientRect().top + window.scrollY, 
          left: this.handle.getBoundingClientRect().left + window.scrollX, 
      };


      this.isOutofRange = (this.sliderPosition.left > pageX || (this.handleWidth + this.sliderPosition.left) <= pageX) ? true : false;

      var width = Math.floor((this.priceRange * offsetX) / this.handleWidth) + parseFloat(this.minPrice);

      if (this.isDraggingMax == true && this.minWidth < offsetX && this.isOutofRange == false) {
          this.handleMax.style.width = offsetX * 100 / this.handleWidth + '%';
          this.maxPriceElement.setAttribute('val', width);
          this.maxPriceElement.value = width;
      }

      if (this.isDraggingMin == true && this.maxWidth > offsetX && this.isOutofRange == false) {
          this.handleMin.style.width = offsetX * 100 / this.handleWidth + '%';
          this.minPriceElement.setAttribute('val', width);
          this.minPriceElement.value = width;
      }

      this.minWidth = this.handleMin.offsetWidth;
      this.maxWidth = this.handleMax.offsetWidth;

  }

  onMouseUp = () => {
      this.isDraggingMin = false;
      this.isDraggingMax = false;

  }
} 
customElements.define('facet-filters', ProductFilters1)
 



class SortingDropdown extends HTMLElement{
  constructor(){
      super();

      this.dropdownToggle = this.querySelector('.facet-filters-sorting-default');
      this.sortOptions = this.querySelectorAll('li');

      this.dropdownToggle.addEventListener('click', (e)=> {
          this.onClick();
      })

      document.addEventListener('click', (event) => {
          if (event.target !== this && !this.contains(event.target)) {
              this.close()
          }
      })
      
      for( let option of this.sortOptions ){
          option.addEventListener('click', (e) => {
              this.onOptionClick(option);
          });
      }

      document.addEventListener('keyup', (event) => {
          if(event.key == 'Enter'){
              for( let option of this.sortOptions ){
                  if (event.target == option && option.contains(event.target)) {
                      this.onOptionClick(option);
                  }
              }
          }
      })
  }

  onClick = () => {
      if( this.classList.contains('active') ){
          this.close();
      }
      else{
          this.open();
      }
  }

  open = () => {
      this.classList.add('active');
  }

  close = () => {
      this.classList.remove('active');
  }

  onOptionClick = (option) => {
      var value = option.dataset.value; 

      var queryParams = {};
      if(window.location.search.length) {
          
        for(var aKeyValue, i = 0, aCouples = window.location.search.substring(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
              queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }

      queryParams.sort_by = value;

      this.ajaxSorting(queryParams);
  }

  ajaxSorting = (queryParams) => {

      var productsSelector = '.products'
      var productsSection = document.querySelector(productsSelector);
      var productsSectionId = productsSection.dataset.id

      var searchParams = new URLSearchParams(queryParams).toString();
      
      fetch(`${window.location.pathname}?section_id=${productsSectionId}&${searchParams}`)
      .then(response => {
          return response.text()
      })
      .then((text) => {

          for( let option of this.sortOptions ){
            if( option.dataset.value == queryParams.sort_by ){
              this.dropdownToggle.querySelector('span').innerHTML = option.innerHTML
            }
          }

          const html = document.createElement('div');
          html.innerHTML = text;
          const newProductsSection = html.querySelector(productsSelector);
          
          productsSection.innerHTML = newProductsSection.innerHTML;

          const resultsLazyloadImages = productsSection.querySelectorAll('.lazy-loading-image');

          resultsLazyloadImages.forEach(imageContainer => {
              lazyloading(imageContainer);
          })

          updateURLState(searchParams)

          updatePagination(searchParams);


          this.close();

      });
  }

}

customElements.define('sorting-dropdown', SortingDropdown)


function ajaxPagination(params, productsPagination) {

  var productsSelector = '.products'
  var section = document.querySelector(productsSelector);

  fetch(`${window.location.pathname}?${params}`)
      .then(response => {
          return response.text()
      })
      .then((text) => {

          const html = document.createElement('div');
          html.innerHTML = text;
          const productsSection = html.querySelector(productsSelector);

          if( productsPagination.dataset.paginationChoice == '2' || productsPagination.dataset.paginationChoice == '3' ){
              
              productsSection.querySelectorAll('li').forEach(li => {
                  section.querySelector('ul').append(li);
              })
              
              var infiniteButton = document.querySelector('.products-pagination-infinite');
              infiniteButton.dataset.currentPage = html.querySelector('.products-pagination-infinite').dataset.currentPage;

              infiniteButton.disabled = false;

              if(infiniteButton.dataset.currentPage >= infiniteButton.dataset.totalPages){
                  infiniteButton.classList.add('hide');
              }

              if(productsPagination.dataset.paginationChoice == '3'){
                  infiniteButton.classList.add('inactive');
              }

          }
          else{
              section.innerHTML = productsSection.innerHTML;

              updateURLState(params)

              document.querySelector('.section-products').scrollIntoView({
                  behavior: "instant"
              })
          } 
          const resultsLazyloadImages = section.querySelectorAll('.lazy-loading-image');

          resultsLazyloadImages.forEach(imageContainer => {
              lazyloading(imageContainer);
          })

      });

}

class ProductsPagination extends HTMLElement {
  constructor() {
      super();

      if (this.dataset.paginationChoice == '2' || this.dataset.paginationChoice == '3') { 
          this.paginationInfiniteScroll();
      } else { 
          this.paginationNumbers();
      }
  }

  paginationNumbers = () => {
      const paginationLinks = this.querySelectorAll('.products-pagination a');

      for (let link of paginationLinks) {
          link.addEventListener('click', (e) => {
              e.preventDefault();

              const href = link.getAttribute('href');
              const url = new URL(href, window.location.origin);

              const searchParams = url.searchParams.toString(); 
              this.ajaxPagination(searchParams);
          });
      }
  };

  paginationInfiniteScroll = () => {
      const infiniteButton = this.querySelector('.products-pagination-infinite:not(:disabled)');

      infiniteButton.addEventListener('click', (e) => {
          e.preventDefault();

          const newPage = parseInt(infiniteButton.dataset.currentPage) + 1;
          const currentParams = new URLSearchParams(window.location.search);

          currentParams.set('page', newPage);
          const searchParams = currentParams.toString();

          infiniteButton.disabled = true; 
          this.ajaxPagination(searchParams);
      });

      window.addEventListener('scroll', () => {
          const productsPagination = document.querySelector('products-pagination');
          const infiniteButton = productsPagination.querySelector('.products-pagination-infinite:not(:disabled)');

          if (infiniteButton) {
              if (
                  productsPagination.dataset.paginationChoice == '3' &&
                  infiniteButton.dataset.currentPage != '1' &&
                  infiniteButton.dataset.currentPage < infiniteButton.dataset.totalPages
              ) {
                  const windowHeight = window.innerHeight;
                  const elementOffset = 100;

                  const elementPosition = infiniteButton.getBoundingClientRect();
                  if (elementPosition.bottom + elementOffset <= windowHeight) {
                      const newPage = parseInt(infiniteButton.dataset.currentPage) + 1;

                      const currentParams = new URLSearchParams(window.location.search);
                      currentParams.set('page', newPage);

                      const searchParams = currentParams.toString();

                      infiniteButton.disabled = true; 
                      this.ajaxPagination(searchParams);
                  }
              }
          }
      });
  };

  ajaxPagination = (searchParams) => {
      const productsSelector = '.products';
      const section = document.querySelector(productsSelector);

      fetch(`${window.location.pathname}?${searchParams}`)
          .then((response) => response.text())
          .then((text) => {
              const html = document.createElement('div');
              html.innerHTML = text;
              const productsSection = html.querySelector(productsSelector);

              section.innerHTML = productsSection.innerHTML;

              const resultsLazyloadImages = section.querySelectorAll('.lazy-loading-image');

              resultsLazyloadImages.forEach((imageContainer) => {
                  lazyloading(imageContainer);
              }); 
              this.updateURLState(searchParams);

              document.querySelector('.section-products').scrollIntoView({
                  behavior: 'instant',
              });
          });
  };

  updateURLState = (searchParams) => {
      const url = `${window.location.pathname}?${searchParams}`;
      window.history.replaceState(null, '', url);
  };
}

customElements.define('products-pagination', ProductsPagination);
