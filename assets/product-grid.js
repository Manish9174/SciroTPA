document.addEventListener("DOMContentLoaded", function () { 
  if (window.top !== window.self) {
     
    initFilter();  
    return;
  }
 
  initFilter();
});

function initFilter() {
/* maximum value control */
  initRangeInputs(); 
  document.addEventListener('ajaxComplete', initRangeInputs);
 
function initRangeInputs() { 
  const numberInputs = document.querySelectorAll('input[type="number"][max]');
  
  numberInputs.forEach(input => {
    const maxValue = parseFloat(input.max);
    const minValue = parseFloat(input.min) || 0;  
    input.removeEventListener('input', handleInput);
    input.addEventListener('input', handleInput);
    
    function handleInput() {
      let value = parseFloat(this.value); 
      if (isNaN(value)) {
        this.value = minValue;
        return;
      }
       
      if (value < minValue) {
        this.value = minValue;
      } else if (value > maxValue) {
        this.value = maxValue;
      } 
      if (this.dataset.decimals) {
        const decimals = parseInt(this.dataset.decimals);
        this.value = value.toFixed(decimals);
      } 
      if (this.dataset.triggerChange === 'true') {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } 
    handleInput.call(input);
  });
}
/* maximum value control */
  
  
 function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    let obj = {};
    
    for (const [key, value] of params.entries()) {
      if (!obj[key]) {
        obj[key] = [];
      }
      obj[key].push(value);
    } return obj;
 }
 
function updateUrlParams(params) { 
  const url = new URL(window.location);
  url.search = "";   
  params["page"] = 1; 
  Object.keys(params).forEach((key) => {
    const paramValue = params[key]; 
    const stringValue = Array.isArray(paramValue)
      ? paramValue.map(String)  
      : String(paramValue); 
 
    if (Array.isArray(paramValue)) {
      stringValue.forEach((val) => url.searchParams.append(key, val));
    } else {
      url.searchParams.set(key, stringValue);
    }
  });
  url.searchParams.set("page", 1);  

  const urlString = url.toString();  
  window.history.pushState({}, "", urlString);
  fetchProducts(urlString);  



 
const currentUrl = new URL(urlString); 
const searchParams = currentUrl.searchParams; 
const filterResults = document.querySelector(".filter_results");
const hasOnlyDefaultParams =
searchParams.has("sort_by") &&
searchParams.get("sort_by") === "" &&
searchParams.has("page") &&
searchParams.get("page") === "1" &&
searchParams.toString() === "sort_by=&page=1";   

if (hasOnlyDefaultParams) {
filterResults.style.display = "none";
}
   
}


 
if (typeof Shopify !== "undefined" && Shopify.template === "search") {
fetchProducts();
}

function fetchProducts(url) {
fetch(url, { headers: { "X-Requested-With": "XMLHttpRequest" } })
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const newProductCheck = doc.querySelector(".product-check");
   

    if (newProductCheck) {
  // Update all product-check sections in all forms
  document.querySelectorAll(".product-check").forEach(existingProductCheck => {
    existingProductCheck.innerHTML = newProductCheck.innerHTML;
  });

      

  // Update all matching inputs across all forms
  newProductCheck.querySelectorAll("input").forEach((input) => {
    const dataId = input.dataset.id;
    const formInputs = document.querySelectorAll(`form input[data-compare="${dataId}"]`);
     const filtersContainer = document.querySelector('.filters-container');
    
    formInputs.forEach(formInput => {
      const spanElement = formInput.closest('div')?.querySelector('span.filter_counts');
      const spanElement1 = formInput.closest('div'); 

      if (formInput) {
        formInput.setAttribute("data-count", input.value);
        if(input.value == 0) {
           if (filtersContainer) { filtersContainer.classList.remove("opacity-50"); }
          formInput.setAttribute("disabled", "disabled");
          if (spanElement1) {
            spanElement1.classList.add("opacity-50");
          }
        } else { 
            if (filtersContainer) { filtersContainer.classList.remove("opacity-50"); }
          formInput.removeAttribute("disabled");
          if (spanElement1) {
            spanElement1.classList.remove("opacity-50");
          }
        }
        if(spanElement) {
          spanElement.textContent = "(" + input.value + ")";
        }
      }
    });
  });
     

} 

    const newProductGrid = doc.querySelector("#product-grid");
    var cardCount;
     if (newProductGrid && newProductGrid.children.length > 0) {
    const cards11 = newProductGrid.querySelectorAll('.card');
     cardCount = cards11.length; 
    const productCountElement = document.querySelector('.product_count span'); 
   
      document.getElementById("product-grid").innerHTML = newProductGrid.innerHTML; 
       
    } else {
      
         
      document.getElementById("product-grid").innerHTML = '<div class="no-results h5 col my-4 text-center">No products found. Please adjust your filters </div>'; 
    }

 

    const newClearFilters = doc.querySelector(".clear-filters"); 
var paginate_totalcount = document.querySelector('#paginate_totalcount');

if (newClearFilters) { 
  document.querySelectorAll(".clear-filters").forEach(clearFilters => {
    clearFilters.innerHTML = newClearFilters.innerHTML;
  });

  
  var totalcountpro;
  if(paginate_totalcount && typeof paginate_totalcount !== "undefined") {
    const paginate_totalcount1 = document.querySelector('#paginate_totalcount').value;  
    totalcountpro = paginate_totalcount1;
  } else {
    totalcountpro = cardCount;
  }  
 document.querySelectorAll('.filter_totalcount').forEach(totalCountElement => {
  totalCountElement.innerHTML = totalcountpro !== undefined ? totalcountpro : 0;
});
   
} 



    /* Remove All functionality */
document.querySelectorAll('form').forEach(form => {
  const filteredItems = form.querySelector('.filtered_items');
  const removeFilter = form.querySelector('.remove_filter');
  const filterResults = form.querySelector('.filter_results');
  
  if (filteredItems && removeFilter && filterResults) {
    if (filteredItems.children.length > 0) {
      removeFilter.classList.remove('d-none');
      filterResults.classList.add('py-3');
    } else {
      removeFilter.classList.add('d-none');
      filterResults.classList.remove('py-3');
    }
  }
});

 document.querySelectorAll('.filtered_items .filter_repeat').forEach((element) => {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    const pparam = element.getAttribute('data-pparam');
    const pval = element.getAttribute('data-pval');

    if (!pparam || !pval) {
      return;
    }
 
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"][name="' + pparam + '"][value="' + pval + '"]'
    );

    if (!checkboxes.length) {
      return;
    }
 
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }); 
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (params.has(pparam)) {
      let values = params.getAll(pparam); 
      values = values.filter((value) => value !== pval); 
      params.delete(pparam);
      values.forEach((value) => params.append(pparam, value));

      const queryString = params.toString();
      const newUrl = queryString ? `${url.pathname}?${queryString}` : url.pathname;

      window.history.replaceState({}, '', newUrl);
    }
  });
}); 
    var toInput = document.getElementById('toInput');
  var fromInput = document.getElementById('fromInput');
  var fromSlider = document.getElementById('fromSlider');
  var toSlider = document.getElementById('toSlider'); 
  if (!toInput || !fromInput || !fromSlider || !toSlider) {
     return;
  }
   
  var maxValue = parseFloat(toInput.getAttribute('max'));
  var buffer = maxValue * 0.05; 
  
document.querySelectorAll('.filtered_items .filter_repeat_price').forEach(function(element) { 
  element.addEventListener('click', function(event) {
    event.preventDefault();

    var pparam = this.getAttribute('data-pparam');  
    var pval = this.getAttribute('data-pval');    

    document.querySelectorAll(`[name="${pparam}"]`).forEach(function(input) {
      if (input.type === "checkbox" && input.value === pval) {
        input.checked = false;
      } else if (input.type === "number") {
        input.value = "";
      }
    });
 
    document.querySelectorAll('#fromSlider, #toSlider, #fromInput, #toInput').forEach(function(el) {
      var isFrom = el.id === 'fromSlider' || el.id === 'fromInput';
      var max    = parseFloat(el.max || el.getAttribute('max') || 1500);
      el.value   = isFrom ? 0 : max;
    });

    document.querySelectorAll('#fromSlider').forEach(function(el) { el.offsetHeight; });

    document.querySelectorAll('#fromSlider, #toSlider, #fromInput, #toInput').forEach(function(el) {
      el.dispatchEvent(new Event('input'));
    });

    $(this).remove();

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search); 

    if (params.has(pparam) || params.has(pval)) { 
      let values = params.getAll(pparam); 
      params.delete(pparam); 
      params.delete(pval); 
      window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`); 
      fetchProducts(`${url.pathname}?${params.toString()}`);
    }
  });
});

 
   


    

var filters_container1 = document.querySelector('.filters-container');
 filters_container1.classList.remove("opacity-50"); 

    const url = new URL(window.location.href);
const urlParams = new URLSearchParams(url.search);
const filteredParams = [...urlParams].filter(([key]) => key !== 'sort_by' && key !== 'q' && key !== 'page' );

const removeAllElements = document.querySelectorAll(".remove_filter");
const filterResultsElements = document.querySelectorAll('.filter_results');


    
 var filteredParamsnew = false;  

if (Shopify.template === "search") {
  filteredParamsnew = filteredParams.length > 1;
} else {
  filteredParamsnew = filteredParams.length > 0;
} 
removeAllElements.forEach((removeAllElement, index) => {
  const filterResultsElement = filterResultsElements[index];
  
  if (filteredParamsnew && removeAllElement && filterResultsElement) {
    removeAllElement.classList.remove('d-none');
    filterResultsElement.classList.add('py-3');
  } else if (removeAllElement && filterResultsElement) {
    removeAllElement.classList.add('d-none');
    filterResultsElement.classList.remove('py-3');
  }
});

    
    const sortBy = urlParams.get("sort_by");
  
    const dropdownItems = document.querySelectorAll(".sorting_duplicate .dropdown-menu li");
    let selectedText = "Sort By"; 
     dropdownItems.forEach((item) => {
    const value = item.getAttribute("data-value"); 
    item.removeAttribute("selected"); 
    if (value === sortBy) {
        item.setAttribute("selected", "selected");  
        selectedText = item.querySelector("a").innerText;  
  
    }
      
});
    
    document.querySelector('.sorting_duplicate button').innerHTML = selectedText 

    
  })
.catch(() => {});
      
       const productGrid = document.getElementById("product-grid"); 

}


  
const allForms = document.querySelectorAll('form');
const allFilterInputs = document.querySelectorAll('input[type="checkbox"], input[type="number"], select'); 
function updateOtherInputs(sourceInput) {
const id = sourceInput.id;
const type = sourceInput.type;
const tagName = sourceInput.tagName; 
if (!id) return;

allFilterInputs.forEach(input => { 
  if (input === sourceInput) return; 
  if (input.id !== id) return; 
  if (type === "checkbox") {
    input.checked = sourceInput.checked;
  } else if (type === "number" || tagName === "SELECT") {
    input.value = sourceInput.value;
  }
});
} 
allFilterInputs.forEach(input => {
input.addEventListener("change", function() { 
  const filtersContainer = document.querySelector('.filters-container');
  if (filtersContainer) {
    filtersContainer.classList.add("opacity-50"); 
  }
   
  let params = getUrlParams(); 
  if (input.type === "checkbox") {
    const paramName = input.name || input.id;  
    const paramValue = input.value;
    if (input.checked) {
      if (!params[paramName]) {
        params[paramName] = [];
      }
      if (!params[paramName].includes(paramValue)) {
        params[paramName].push(paramValue);
      }
    } else {
      if (params[paramName]) {
        params[paramName] = params[paramName].filter((value) => value !== paramValue);
        if (params[paramName].length === 0) {
          delete params[paramName];
        }
      }
    }
  } else if (input.type === "number") {
    params[input.name || input.id] = input.value; 
  } else if (input.tagName === "SELECT") {
    const paramName = input.name || input.id; 
    const paramValue = input.value;
    if (paramValue) {
      params[paramName] = paramValue;
    } else {
      delete params[paramName];
    }
  }
  
  updateUrlParams(params);
   
  updateOtherInputs(input);
});
}); 
function initializeFormsFromParams() {
const params = getUrlParams();

allFilterInputs.forEach(input => {
  const paramKey = input.name || input.id;  
  
  if (input.type === "checkbox") {
    const paramValues = params[paramKey];
    if (paramValues && Array.isArray(paramValues)) {
      input.checked = paramValues.includes(input.value);
    }
  } else if (input.type === "number" || input.tagName === "SELECT") {
    if (params[paramKey]) {
      input.value = params[paramKey];
    }
  }
});
} 
document.addEventListener('DOMContentLoaded', initializeFormsFromParams);

}
