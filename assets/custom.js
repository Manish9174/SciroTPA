//custom accordian on product page

(function () {

  if (window.productGalleryAccordionInitialized) {
    return;
  }

  window.productGalleryAccordionInitialized = true;

  document.addEventListener('click', function (event) {

    var header = event.target.closest(
      '.product-gallery-accordion__header'
    );

    if (!header) {
      return;
    }

    var accordion = header.closest(
      '.product-gallery-accordion'
    );

    if (!accordion) {
      return;
    }

    var item = header.closest(
      '.product-gallery-accordion__item'
    );

    if (!item) {
      return;
    }

    var isOpen = item.classList.contains('is-open');

    var allItems = accordion.querySelectorAll(
      '.product-gallery-accordion__item'
    );

    allItems.forEach(function (otherItem) {

      otherItem.classList.remove('is-open');

      var otherHeader = otherItem.querySelector(
        '.product-gallery-accordion__header'
      );

      if (otherHeader) {
        otherHeader.setAttribute(
          'aria-expanded',
          'false'
        );
      }

    });

    if (!isOpen) {

      item.classList.add('is-open');

      header.setAttribute(
        'aria-expanded',
        'true'
      );

    }

  });

})();


//custom accordian on product page





