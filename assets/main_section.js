document.addEventListener("DOMContentLoaded", function () {
    /* Video Section code */

var videoBanner = document.querySelector('wdt-interactive-video');

function initVideoSection(videoBanner) {
    var videoSectionid = videoBanner.getAttribute('data-sectionId');
    var videoAutoplay = videoBanner.getAttribute('data-videoAutoplay');
    var videoContainer = document.querySelector('.videotag-'+ videoSectionid);
    if (!videoContainer) return;

    let video = videoContainer.querySelector('video.video-tag');
    if(!video)
    {
        video = videoContainer;
    }
    const bannerElement = document.querySelector('.video-btnbanner-'+ videoSectionid);


    function toggleVimeoVideo(iframe, bannerElement) {
        const currentSrc = iframe.src;
        const isCurrentlyPlaying = currentSrc.includes('autoplay=1');
        const videoCover = videoContainer.querySelector('.video-cover-'+videoSectionid);
           if(videoCover){
                videoCover.style.setProperty('display', 'none', 'important');

            const wrapper = videoCover.closest('.video-size-area-'+videoSectionid);
                const bannerClick = wrapper?.querySelector('.banner-click-'+videoSectionid);


                if (bannerClick) {
                bannerClick.style.setProperty('display', 'none', 'important');
                }
            } else {
             bannerElement.style.setProperty('display', 'none', 'important');
                     const parentVideoelement = bannerElement.parentElement;
                    if (parentVideoelement) {
                        parentVideoelement.style.setProperty('pointer-events', 'none');
                    }
            }

            const newSrc = currentSrc.replace('autoplay=1', 'autoplay=0');
            iframe.src = newSrc;


    }

    if (videoContainer && bannerElement) {
        bannerElement.addEventListener('click', function() {
            const html5Video = videoContainer.querySelector('video.video-tag');
            const iframe = videoContainer.querySelector('iframe.banner-ele');


            if (html5Video) {
                toggleHTML5Video(html5Video, bannerElement);
            } else if (iframe) {
                if (iframe.src.includes('youtube.com') || iframe.src.includes('youtu.be')) {
                    toggleYouTubeVideo(iframe, bannerElement);
                } else if (iframe.src.includes('vimeo.com')) {
                    toggleVimeoVideo(iframe, bannerElement);
                }
            }
        });
    }


    function toggleYouTubeVideo(iframe, bannerElement) {
        if (typeof YT !== 'undefined' && iframe.id && window.youTubePlayers && window.youTubePlayers[iframe.id]) {
            const player = window.youTubePlayers[iframe.id];
            toggleYouTubePlayerState(player, bannerElement);
        } else {
            toggleYouTubeVideoURL(iframe, bannerElement);
        }
    }

    function toggleYouTubeVideoURL(iframe, bannerElement) {

        const currentSrc = iframe.src;
        const isCurrentlyPlaying = currentSrc.includes('autoplay=1');
         const videoCover = videoContainer.querySelector('.video-cover-'+videoSectionid);
          if(videoCover) {
            videoCover.style.setProperty('display', 'none', 'important');
            const wrapper = videoCover.closest('.video-size-area-'+videoSectionid);
            const bannerClick = wrapper?.querySelector('.banner-click-'+videoSectionid);

            if (bannerClick) {
            bannerClick.style.setProperty('display', 'none', 'important');
            }
        }
        else {
             bannerElement.style.setProperty('display', 'none', 'important');
                     const parentVideoelement = bannerElement.parentElement;
                    if (parentVideoelement) {
                        parentVideoelement.style.setProperty('pointer-events', 'none');
                    }
        }


    }
    function toggleHTML5Video(videoElement, bannerElement) {
     const videoCover = videoContainer.querySelector('.video-cover-'+videoSectionid);
         if(videoCover) { videoCover.style.setProperty('display', 'none', 'important');
             const wrapper = videoCover.closest('.video-size-area-'+videoSectionid);
            const bannerClick = wrapper?.querySelector('.banner-click-'+videoSectionid);

            if (bannerClick) {
            bannerClick.style.setProperty('display', 'none', 'important');
            }

           } else { bannerElement.style.setProperty('display', 'none', 'important');
                     const parentVideoelement = bannerElement.parentElement;
                    if (parentVideoelement) {
                        parentVideoelement.style.setProperty('pointer-events', 'none');
                    }
           }

        if (videoElement.paused) {
            videoElement.play().catch(error => {
                // console.error('Error playing video:', error);
            });
            // updateIcon(bannerElement, 'pause');

        } else {
            videoElement.pause();
            updateIcon(bannerElement, 'play');
        }
    }



    function updateIcon(element, state) {


            element.style.display = 'none';

    }
}
var videoBanners = document.querySelectorAll('wdt-interactive-video');
videoBanners.forEach(function(videoBanner) {
    initVideoSection(videoBanner);

});




function modalScrollLockControls() {
  const scrollLockModals = document.querySelectorAll(
    '.modal.sizeChart, .modal.shareModal'
  );

  if (!scrollLockModals.length) return;

  let scrollPosition = 0;

  scrollLockModals.forEach((modal) => {
    modal.addEventListener('show.bs.modal', () => {
      scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.classList.add('position-fixed', 'w-100');
      document.body.style.top = `-${scrollPosition}px`;
    });

    modal.addEventListener('hidden.bs.modal', () => {
      document.body.classList.remove('position-fixed', 'w-100');

      const top = document.body.style.top;
      document.body.style.top = '';

      const htmlEl = document.documentElement;
      htmlEl.classList.add('no-scroll-behavior');

      if (top) {
        const y = parseInt(top || '0', 10) * -1;
        window.scrollTo(0, y);
      } else if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
      }
      requestAnimationFrame(() => {
        htmlEl.classList.remove('no-scroll-behavior');
      });
    });
  });
}
modalScrollLockControls();

function initVideoHandlers() {
    if (!videoBanners.length) return;
    var videoSectionid = videoBanner.getAttribute('data-sectionId');
    var videoAutoplay = videoBanner.getAttribute('data-videoAutoplay');

    var videoContainer = document.querySelector('.videotag-'+ videoSectionid);
    let video = document.querySelector('video.video-tag');
    const videoModal = document.getElementById("videoModal-"+ videoSectionid);
    if (window.videoBannerObserver) {
        window.videoBannerObserver.disconnect();
        delete window.videoBannerObserver;
    }



 const video_btn = document.querySelector('.video-banner-section-'+ videoSectionid);


    /* Close All modal videos   */
    if (videoModal) {
        const modals = document.querySelectorAll('.modal');
        let scrollPosition = 0;

        modals.forEach((modal) => {
            modal.addEventListener('show.bs.modal', () => {
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;

            document.body.classList.add('position-fixed', 'w-100');
            document.body.style.top = `-${scrollPosition}px`;
            });

            modal.addEventListener('hidden.bs.modal', function () {
            this.querySelectorAll('video').forEach((video) => {
                try {
                video.pause();
                video.currentTime = 0;
                } catch (e) {}
            });

            this.querySelectorAll('iframe').forEach((iframe) => {
                const parent = iframe.parentElement;
                if (!parent) return;

                const newIframe = iframe.cloneNode(true);
                newIframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
                parent.replaceChild(newIframe, iframe);
            });

            document.body.classList.remove('position-fixed', 'w-100');

            const top = document.body.style.top;
            document.body.style.top = '';

            // TEMPORARILY disable smooth scroll
            const htmlEl = document.documentElement;
            htmlEl.classList.add('no-scroll-behavior');

            if (top) {
                const y = parseInt(top || '0', 10) * -1;
                window.scrollTo(0, y);
            } else if (scrollPosition) {
                window.scrollTo(0, scrollPosition);
            }

            requestAnimationFrame(() => {
                htmlEl.classList.remove('no-scroll-behavior');
            });
            });
        });
        }



}
initVideoHandlers();
document.addEventListener('shopify:section:load', initVideoHandlers);
document.addEventListener('shopify:section:unload', function() {
  if (window.videoBannerObserver) {
    window.videoBannerObserver.disconnect();
    delete window.videoBannerObserver;
  }
});


/* Featured Showcase */
    initializeAllShowcaseSwipers();

document.addEventListener('shopify:section:load', function(event) {
    const section = event.target;
    const featureShowcase = section.querySelector('.feature-showcase');

    if (featureShowcase) {
        // Small delay to ensure DOM is fully updated
        setTimeout(() => {
            showcaseSwiper(featureShowcase);
        }, 100);
    }
});

document.addEventListener('shopify:section:select', function(event) {
    const section = event.target;
    const featureShowcase = section.querySelector('.feature-showcase');

    if (featureShowcase) {
        setTimeout(() => {
            showcaseSwiper(featureShowcase);
        }, 100);
    }
});

document.addEventListener('shopify:section:deselect', function(event) {
    const section = event.target;
    const featureShowcase = section.querySelector('.feature-showcase');

    if (featureShowcase) {
        setTimeout(() => {
            showcaseSwiper(featureShowcase);
        }, 100);
    }
});

function initializeAllShowcaseSwipers() {
    const mainFeatureSections = document.querySelectorAll('.feature-showcase');
    mainFeatureSections.forEach(section => {
        showcaseSwiper(section);
    });
}

function setMaxHeightToSlides(featureSectionid) {
    const slides = document.querySelectorAll('.feature_showcase-' + featureSectionid + ' .swiper-slide');
    const container = document.querySelector('.feature_showcase-' + featureSectionid);

    if (!slides.length || !container) return;

    let maxHeight = 0;

    slides.forEach(slide => {
        slide.style.height = 'auto';
        slide.style.display = 'flex';
        slide.style.flexDirection = 'column';
        slide.style.justifyContent = 'center';
    });

    slides.forEach(slide => {
        maxHeight = Math.max(maxHeight, slide.offsetHeight);
    });

    slides.forEach(slide => {
        slide.style.height = maxHeight + 'px';
    });

    const viewportHeight = window.innerHeight;
    const desiredContainerHeight = Math.min(viewportHeight * 0.8, maxHeight * 3);

    container.style.height = desiredContainerHeight + 'px';
    container.style.overflow = 'hidden';

    return maxHeight;
}

function showcaseSwiper(mainFeatureEl) {
  if (!mainFeatureEl) return;

  const featureSectionid = mainFeatureEl.getAttribute('data-featuredsectionid');
  const featureDuration = parseInt(mainFeatureEl.getAttribute('data-duration'), 10) || 3000;
  const featureAutoplay = mainFeatureEl.getAttribute('data-autoplay') === 'true';
  const featureAutopause = mainFeatureEl.getAttribute('data-pause-autoplay') === 'true';

  if (!featureSectionid) return;

  const swiperContainer = document.querySelector('.feature_showcase-' + featureSectionid);
  if (!swiperContainer) return;

  if (swiperContainer.swiper) {
    swiperContainer.swiper.destroy(true, true);
  }

  const swiper = new Swiper(swiperContainer, {
    direction: 'vertical',
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 10,
    mousewheel: true,
    loop: true,
    autoplay: false,
    on: {
      init: function () {
        setMaxHeightToSlides(featureSectionid);
      },
      resize: function () {
        setMaxHeightToSlides(featureSectionid);
      },
    },
  });

  if (!featureAutoplay) {
    return;
  }

  let autoplayTimer = null;

  const startAutoplay = () => {
    if (autoplayTimer || document.hidden) return;
    autoplayTimer = setInterval(() => {
      if (!document.hidden) {
        swiper.slideNext();
      }
    }, featureDuration);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  startAutoplay();
  if (featureAutopause) {
    swiperContainer.addEventListener('mouseenter', stopAutoplay);
    swiperContainer.addEventListener('mouseleave', startAutoplay);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  swiper.on('destroy', () => {
    stopAutoplay();
  });
}




/* Overlay */

/* Common Cookie Functions */
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    var domain = window.location.hostname;
    document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + domain;
    //console.log("Cookie set:", name, value);
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/* Common Modal Functions */
function openModal(modal) {
    if (!modal) return;

    modal.classList.remove("visually-hidden");
    modal.classList.add("d-flex");
    document.body.classList.add('position-fixed');

    setTimeout(() => {
        const emailInput = modal.querySelector('input#email');
        if (emailInput) {
            emailInput.focus();
        }
    }, 50);

    trapFocus(modal);
}

function closeModal(modal) {
    if (!modal) return;
     // Remove focus trap event listener
    if (modal._focusTrapHandler) {
        modal.removeEventListener('keydown', modal._focusTrapHandler);
        delete modal._focusTrapHandler; // Clean up
          var main = document.getElementById('MainContent');
      if (main) {
        if (!main.hasAttribute('tabindex')) {
          main.setAttribute('tabindex', '-1');
        }
        main.focus();
      }

    }

    modal.classList.add("visually-hidden");
    modal.classList.remove("d-flex");
    document.body.classList.remove('position-fixed');
    document.body.removeAttribute('style');


}

function trapFocus(modal) {
    var focusableSelectors = [
        'a[href]',
        'area[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable]'
    ];

    var focusableElements = modal.querySelectorAll(focusableSelectors.join(', '));
    if (focusableElements.length === 0) return;

    var firstFocusable = focusableElements[0];
    var lastFocusable = focusableElements[focusableElements.length - 1];

    function handleKeydown(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }

        if (e.key === 'Escape') {
            closeModal(modal);
        }
    }

    modal.addEventListener('keydown', handleKeydown);
    firstFocusable?.focus();

    // Store handler for cleanup
    modal._focusTrapHandler = handleKeydown;
}

function setupModalBodyLock(modal) {
    if (!modal) return;

    modal.addEventListener('show.bs.modal', function() {
        document.body.classList.add('position-fixed');
       // document.body.style.overflow = 'hidden';
        document.body.style.width = '100%';
    });

    modal.addEventListener('hide.bs.modal', function() {
        document.body.classList.remove('position-fixed');
        document.body.style.overflow = '';
        document.body.style.width = '';
    });
}

/* Age Verification Modal */
var confirmModal = document.getElementById("confirmModal");
if (confirmModal) {
    setupModalBodyLock(confirmModal);

    if (getCookie("userConfirmed") !== "true") {
        var myModal = new bootstrap.Modal(confirmModal, {
            backdrop: 'static',
            keyboard: false,
            tabindex: -1,
        });
        myModal.show();

        let isConfirmed = false;

        document.getElementById("confirmButton").addEventListener("click", function () {

            setCookie("userConfirmed", "true", 365);
            sessionStorage.setItem("userConfirmed", "true");
            isConfirmed = true;
            myModal.hide();
        });

        document.getElementById("cancelButton").addEventListener("click", function () {
            window.open('https://www.google.co.in/', '_blank');
        });

        confirmModal.addEventListener("hide.bs.modal", function (event) {
            if (!isConfirmed) {
                event.preventDefault();

            }
        });

        confirmModal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' || e.keyCode === 9) {
                const focusableElements = confirmModal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    } else {
      //  console.log("User has already confirmed age, no modal will show.");
    }
}


function initializeNewsletterModal() {
   const newsletterModal = document.getElementById("newsletter_model");
    if (!newsletterModal) return;

    if (window.location.href.includes('?customer_posted=true#ContactPopup')) {
        openModal(newsletterModal);
    }

    if (!getCookie('newsletter_shown')) {
        var duration = parseInt(newsletterModal.getAttribute('data-delay')) || 0;
        setTimeout(function() {
            openModal(newsletterModal);
        }, duration);
    }

    document.querySelector("#newsletter_model .btn-closes")?.addEventListener("click", function() {
         setCookie('newsletter_shown', 'true', 30);
         closeModal(newsletterModal);
    });

    newsletterModal.addEventListener('click', function(event) {
        if (event.target === newsletterModal) {
            setCookie('newsletter_shown', 'true', 30);
            closeModal(newsletterModal);
        }
    });

    newsletterModal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            setCookie('newsletter_shown', 'true', 30);
            closeModal(newsletterModal);
        }
    });
}



initializeNewsletterModal();



});


$(document).ready(function() {
    quickViewmodel();
    initializeProductShowcase();
    if (typeof Shopify !== 'undefined' && Shopify.designMode) {
        document.addEventListener('shopify:section:load', function(event) {
            if (event.target.querySelector('.product_showcase')) {
                initializeProductShowcase();
            }
        });

        document.addEventListener('shopify:section:unload', function(event) {
        });
    }

    function quickViewmodel()
    {
         var swatch_type =  $('#swatch_typeval').val()
        var product_varsize = "{{ product_varsize }}";
        var product_giftcard = "{{ product_giftcard }}";
        //3d modal script
        class ProductModelElement extends HTMLElement {
        constructor() {
          super();
        }
        connectedCallback() {
          this.addEventListener("click", this.handleModelClick.bind(this));
          this.loadShopifyXR();
        }
        loadShopifyXR() {
          Shopify.loadFeatures([
            {
              name: "shopify-xr",
              version: "1.0",
              onLoad: this.setupShopifyXR.bind(this),
            },
          ]);
        }
        setupShopifyXR(errors) {
          if (errors) return;
          if (!window.ShopifyXR) {
            document.addEventListener("shopify_xr_initialized", () =>
              this.setupShopifyXR()
            );
            return;
          }

          document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
            window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent));
            modelJSON.remove();
          });
          window.ShopifyXR.setupXRElements();
        }
        handleModelClick() {
          if (!this.classList.contains("model-loaded")) {
            this.loadContent();
            this.classList.add("model-loaded");
          }
        }
        loadContent() {
          Shopify.loadFeatures([
            {
              name: "model-viewer-ui",
              version: "1.0",
              onLoad: this.setupModelViewerUI.bind(this),
            },
          ]);
        }
        setupModelViewerUI(errors) {
          if (errors) return;
          const modelViewerElement = this.querySelector("model-viewer");
          if (modelViewerElement) {
            this.modelViewerUI = new Shopify.ModelViewerUI(modelViewerElement);
          }
        }
      }
      if (!customElements.get("product-model")) {
               customElements.define("product-model", ProductModelElement);
          }
    }



    /* Common Swipers */

if (!customElements.get('section-swiper-slide')) {
    customElements.define(
      'section-swiper-slide',
      class textWidthIcons_Slider extends HTMLElement {
        constructor() {
          super();
          this.sliderConfigElement = this.querySelector('[data-slider-options]');
          if (this.sliderConfigElement) this.initializeSlider();
        }

        initializeSlider() {
          const sliderOptionsData = this.sliderConfigElement.getAttribute('data-slider-options');
          if (sliderOptionsData === null || sliderOptionsData === '') return null;
          const sliderOptions = $.extend(
            true,
            {
              effect: 'slide',
              direction: 'horizontal',
              autoplay: true,
              autoplaySpeed: 5,
              spaceBetweenSlides: 0,
              additionalOptions: {},
            },
            JSON.parse(sliderOptionsData)
          );

          const numericPattern = /^\d+$/;
          Object.keys(sliderOptions).forEach((key) => {
            if (typeof sliderOptions[key] === 'string' && numericPattern.test(sliderOptions[key])) {
              sliderOptions[key] = parseInt(sliderOptions[key], 10);
            }
          });

          let autoplaySettings = false;
          if (sliderOptions.auto_play > 0) {
            autoplaySettings = { delay: 1000 * sliderOptions.auto_play };
          }
          let loopEnabled = false;
          if (sliderOptions.loop === 'true' || sliderOptions.loop === true || sliderOptions.loop === 1) {
            loopEnabled = true;
          }

          let centeredSlides = false;
          if (sliderOptions.mode === 'true' || sliderOptions.mode === true) {
            centeredSlides = true;
          }

          const swiperOptions = $.extend(
            true,
            {
              init: false,
              spaceBetween: sliderOptions.space,
              loop: loopEnabled,
              preventClicks: true,
              preventClicksPropagation: true,
              autoplay: autoplaySettings,
              centeredSlides: centeredSlides,
              navigation: {
                nextEl: this.sliderConfigElement.querySelector('.swiper-next'),
                prevEl: this.sliderConfigElement.querySelector('.swiper-prev'),
              },
              pagination: {
                el: this.sliderConfigElement.querySelector('.swiper-pagination'),
                clickable: true,
              },
              lazyLoading: true,
              focusableElements: 'input, select, option, textarea, video, label',
              speed: 2000,
              breakpoints: {
                320: {
                  slidesPerView: sliderOptions.mobile,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.5,
                },
                768: {
                  slidesPerView: sliderOptions.tablet,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.7,
                },
                992: {
                  slidesPerView: sliderOptions.laptop,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1200: {
                  slidesPerView: sliderOptions.desktop,
                  slidesPerColumn: 1,
                },
              },
            },
            sliderOptions.additionalOptions
          );

          const swiperContainer = this.sliderConfigElement.querySelector('[data-swiper-slider]');
          const swiperInstance = new Swiper(swiperContainer, swiperOptions);

          swiperInstance.on('init', () => {
            swiperInstance.update();
          });

          swiperInstance.init();
        }
      }
    );
  }


// shoppable-swiper-slide

if (!customElements.get('shoppable-swiper-slide')) {
    customElements.define(
      'shoppable-swiper-slide',
      class textWidthIcons_Slider extends HTMLElement {
        constructor() {
          super();
          this.sliderConfigElement = this.querySelector('[data-slider-options]');
          if (this.sliderConfigElement) this.initializeSlider();
        }

        initializeSlider() {
          const sliderOptionsData = this.sliderConfigElement.getAttribute('data-slider-options');
          if (sliderOptionsData === null || sliderOptionsData === '') return null;
          const sliderOptions = $.extend(
            true,
            {
              effect: 'slide',
              direction: 'horizontal',
              autoplay: true,
              autoplaySpeed: 5,
              spaceBetweenSlides: 0,
              additionalOptions: {},
            },
            JSON.parse(sliderOptionsData)
          );

          const numericPattern = /^\d+$/;
          Object.keys(sliderOptions).forEach((key) => {
            if (typeof sliderOptions[key] === 'string' && numericPattern.test(sliderOptions[key])) {
              sliderOptions[key] = parseInt(sliderOptions[key], 10);
            }
          });

          let autoplaySettings = false;
          if (sliderOptions.auto_play > 0) {
            autoplaySettings = { delay: 1000 * sliderOptions.auto_play };
          }
          let loopEnabled = false;
          if (sliderOptions.loop === 'true' || sliderOptions.loop === true || sliderOptions.loop === 1) {
            loopEnabled = true;
          }

          let centeredSlides = false;
          if (sliderOptions.mode === 'true' || sliderOptions.mode === true) {
            centeredSlides = true;
          }

          const swiperOptions = $.extend(
            true,
            {
              init: false,
              spaceBetween: sliderOptions.space,
              loop: loopEnabled,
              preventClicks: true,
              preventClicksPropagation: true,
              autoplay: autoplaySettings,
              centeredSlides: centeredSlides,
              navigation: {
                nextEl: this.sliderConfigElement.querySelector('.swiper-next'),
                prevEl: this.sliderConfigElement.querySelector('.swiper-prev'),
              },
              pagination: {
                el: this.sliderConfigElement.querySelector('.swiper-pagination'),
                clickable: true,
              },
              lazyLoading: true,
              focusableElements: 'input, select, option, textarea, video, label',
              speed: 2000,
              breakpoints: {
                320: {
                  slidesPerView: 1,
                  slidesPerColumn: 1,
                },
                480: {
                  slidesPerView: sliderOptions.mobile,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.5,
                },
                576: {
                  slidesPerView: sliderOptions.tablet,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.7,
                },
                992: {
                  slidesPerView: sliderOptions.laptop,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1200: {
                  slidesPerView: sliderOptions.laptop + 1,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1500: {
                  slidesPerView: sliderOptions.desktop,
                  slidesPerColumn: 1,
                },
              },
            },
            sliderOptions.additionalOptions
          );

          const swiperContainer = this.sliderConfigElement.querySelector('[data-swiper-slider]');
          const swiperInstance = new Swiper(swiperContainer, swiperOptions);

          swiperInstance.on('init', () => {
            swiperInstance.update();
          });

          swiperInstance.init();
        }
      }
    );
  }



// collection-showcase-slide

if (!customElements.get('collection-showcase-slide')) {
    customElements.define(
      'collection-showcase-slide',
      class textWidthIcons_Slider extends HTMLElement {
        constructor() {
          super();
          this.sliderConfigElement = this.querySelector('[data-slider-options]');
          if (this.sliderConfigElement) this.initializeSlider();
        }

        initializeSlider() {
          const sliderOptionsData = this.sliderConfigElement.getAttribute('data-slider-options');
          if (sliderOptionsData === null || sliderOptionsData === '') return null;
          const sliderOptions = $.extend(
            true,
            {
              effect: 'slide',
              direction: 'horizontal',
              autoplay: true,
              autoplaySpeed: 5,
              spaceBetweenSlides: 0,
              additionalOptions: {},
            },
            JSON.parse(sliderOptionsData)
          );

          const numericPattern = /^\d+$/;
          Object.keys(sliderOptions).forEach((key) => {
            if (typeof sliderOptions[key] === 'string' && numericPattern.test(sliderOptions[key])) {
              sliderOptions[key] = parseInt(sliderOptions[key], 10);
            }
          });

          let autoplaySettings = false;
          if (sliderOptions.auto_play > 0) {
            autoplaySettings = { delay: 1000 * sliderOptions.auto_play };
          }
          let loopEnabled = false;
          if (sliderOptions.loop === 'true' || sliderOptions.loop === true || sliderOptions.loop === 1) {
            loopEnabled = true;
          }

          let centeredSlides = false;
          if (sliderOptions.mode === 'true' || sliderOptions.mode === true) {
            centeredSlides = true;
          }

          const swiperOptions = $.extend(
            true,
            {
              init: false,
              spaceBetween: sliderOptions.space,
              loop: loopEnabled,
              preventClicks: true,
              preventClicksPropagation: true,
              autoplay: autoplaySettings,
              centeredSlides: centeredSlides,
              navigation: {
                nextEl: this.sliderConfigElement.querySelector('.swiper-next'),
                prevEl: this.sliderConfigElement.querySelector('.swiper-prev'),
              },
              pagination: {
                el: this.sliderConfigElement.querySelector('.swiper-pagination'),
                clickable: true,
              },
              lazyLoading: true,
              focusableElements: 'input, select, option, textarea, video, label',
              speed: 2000,
              breakpoints: {
                320: {
                  slidesPerView: sliderOptions.mobile,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.5,
                },
                576: {
                  slidesPerView: sliderOptions.tablet,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.7,
                },
                768: {
                  slidesPerView: sliderOptions.laptop,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1200: {
                  slidesPerView: sliderOptions.laptop + 1,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1400: {
                  slidesPerView: sliderOptions.desktop,
                  slidesPerColumn: 1,
                },
              },
            },
            sliderOptions.additionalOptions
          );

          const swiperContainer = this.sliderConfigElement.querySelector('[data-swiper-slider]');
          const swiperInstance = new Swiper(swiperContainer, swiperOptions);

          swiperInstance.on('init', () => {
            swiperInstance.update();
          });

          swiperInstance.init();
        }
      }
    );
  }




// collection-list-slide

if (!customElements.get('collection-list-slide')) {
    customElements.define(
      'collection-list-slide',
      class textWidthIcons_Slider extends HTMLElement {
        constructor() {
          super();
          this.sliderConfigElement = this.querySelector('[data-slider-options]');
          if (this.sliderConfigElement) this.initializeSlider();
        }

        initializeSlider() {
          const sliderOptionsData = this.sliderConfigElement.getAttribute('data-slider-options');
          if (sliderOptionsData === null || sliderOptionsData === '') return null;
          const sliderOptions = $.extend(
            true,
            {
              effect: 'slide',
              direction: 'horizontal',
              autoplay: true,
              autoplaySpeed: 5,
              spaceBetweenSlides: 0,
              additionalOptions: {},
            },
            JSON.parse(sliderOptionsData)
          );

          const numericPattern = /^\d+$/;
          Object.keys(sliderOptions).forEach((key) => {
            if (typeof sliderOptions[key] === 'string' && numericPattern.test(sliderOptions[key])) {
              sliderOptions[key] = parseInt(sliderOptions[key], 10);
            }
          });

          let autoplaySettings = false;
          if (sliderOptions.auto_play > 0) {
            autoplaySettings = { delay: 1000 * sliderOptions.auto_play };
          }
          let loopEnabled = false;
          if (sliderOptions.loop === 'true' || sliderOptions.loop === true || sliderOptions.loop === 1) {
            loopEnabled = true;
          }

          let centeredSlides = false;
          if (sliderOptions.mode === 'true' || sliderOptions.mode === true) {
            centeredSlides = true;
          }

          const swiperOptions = $.extend(
            true,
            {
              init: false,
              spaceBetween: sliderOptions.space,
              loop: loopEnabled,
              preventClicks: true,
              preventClicksPropagation: true,
              autoplay: autoplaySettings,
              centeredSlides: centeredSlides,
              navigation: {
                nextEl: this.sliderConfigElement.querySelector('.swiper-next'),
                prevEl: this.sliderConfigElement.querySelector('.swiper-prev'),
              },
              pagination: {
                el: this.sliderConfigElement.querySelector('.swiper-pagination'),
                clickable: true,
              },
              lazyLoading: true,
              focusableElements: 'input, select, option, textarea, video, label',
              speed: 2000,
              breakpoints: {
                320: {
                  slidesPerView: sliderOptions.mobile,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.5,
                },
                576: {
                  slidesPerView: sliderOptions.tablet,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.7,
                },
                768: {
                  slidesPerView: sliderOptions.laptop,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1200: {
                  slidesPerView: sliderOptions.laptop + 1,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1400: {
                  slidesPerView: sliderOptions.desktop,
                  slidesPerColumn: 1,
                },
              },
            },
            sliderOptions.additionalOptions
          );

          const swiperContainer = this.sliderConfigElement.querySelector('[data-swiper-slider]');
          const swiperInstance = new Swiper(swiperContainer, swiperOptions);

          swiperInstance.on('init', () => {
            swiperInstance.update();
          });

          swiperInstance.init();
        }
      }
    );
  }






// grid-bock-slide

if (!customElements.get('grid-bock-slide')) {
    customElements.define(
      'grid-bock-slide',
      class textWidthIcons_Slider extends HTMLElement {
        constructor() {
          super();
          this.sliderConfigElement = this.querySelector('[data-slider-options]');
          if (this.sliderConfigElement) this.initializeSlider();
        }

        initializeSlider() {
          const sliderOptionsData = this.sliderConfigElement.getAttribute('data-slider-options');
          if (sliderOptionsData === null || sliderOptionsData === '') return null;
          const sliderOptions = $.extend(
            true,
            {
              effect: 'slide',
              direction: 'horizontal',
              autoplay: true,
              autoplaySpeed: 5,
              spaceBetweenSlides: 0,
              additionalOptions: {},
            },
            JSON.parse(sliderOptionsData)
          );

          const numericPattern = /^\d+$/;
          Object.keys(sliderOptions).forEach((key) => {
            if (typeof sliderOptions[key] === 'string' && numericPattern.test(sliderOptions[key])) {
              sliderOptions[key] = parseInt(sliderOptions[key], 10);
            }
          });

          let autoplaySettings = false;
          if (sliderOptions.auto_play > 0) {
            autoplaySettings = { delay: 1000 * sliderOptions.auto_play };
          }
          let loopEnabled = false;
          if (sliderOptions.loop === 'true' || sliderOptions.loop === true || sliderOptions.loop === 1) {
            loopEnabled = true;
          }

          let centeredSlides = false;
          if (sliderOptions.mode === 'true' || sliderOptions.mode === true) {
            centeredSlides = true;
          }

          const swiperOptions = $.extend(
            true,
            {
              init: false,
              spaceBetween: sliderOptions.space,
              loop: loopEnabled,
              preventClicks: true,
              preventClicksPropagation: true,
              autoplay: autoplaySettings,
              centeredSlides: centeredSlides,
              navigation: {
                nextEl: this.sliderConfigElement.querySelector('.swiper-next'),
                prevEl: this.sliderConfigElement.querySelector('.swiper-prev'),
              },
              pagination: {
                el: this.sliderConfigElement.querySelector('.swiper-pagination'),
                clickable: true,
              },
              lazyLoading: true,
              focusableElements: 'input, select, option, textarea, video, label',
              speed: 2000,
              breakpoints: {
                320: {
                  slidesPerView: sliderOptions.mobile,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.5,
                },
                576: {
                  slidesPerView: sliderOptions.tablet,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.5,
                },
                768: {
                  slidesPerView: sliderOptions.laptop,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1200: {
                  slidesPerView: sliderOptions.laptop,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1400: {
                  slidesPerView: sliderOptions.desktop,
                  slidesPerColumn: 1,
                },
              },
            },
            sliderOptions.additionalOptions
          );

          const swiperContainer = this.sliderConfigElement.querySelector('[data-swiper-slider]');
          const swiperInstance = new Swiper(swiperContainer, swiperOptions);

          swiperInstance.on('init', () => {
            swiperInstance.update();
          });

          swiperInstance.init();
        }
      }
    );
  }



// review-swiper-slide

if (!customElements.get('review-swiper-slide')) {
  customElements.define(
    'review-swiper-slide',
    class textWidthIcons_Slider extends HTMLElement {
      constructor() {
        super();
        this.sliderConfigElement = this.querySelector('[data-slider-options]');
        if (this.sliderConfigElement) this.initializeSlider();
      }

      initializeSlider() {
        const sliderOptionsData = this.sliderConfigElement.getAttribute('data-slider-options');
        if (!sliderOptionsData) return;

        const sliderOptions = $.extend(
          true,
          {
            effect: 'fade',
            direction: 'horizontal',
            autoplay: true,
            autoplaySpeed: 5,
            spaceBetweenSlides: 0,
            additionalOptions: {},
          },
          JSON.parse(sliderOptionsData)
        );

        const numericPattern = /^\d+$/;
        Object.keys(sliderOptions).forEach((key) => {
          if (typeof sliderOptions[key] === 'string' && numericPattern.test(sliderOptions[key])) {
            sliderOptions[key] = parseInt(sliderOptions[key], 10);
          }
        });

        let autoplaySettings = false;
        if (sliderOptions.auto_play > 0) {
          autoplaySettings = { delay: 1000 * sliderOptions.auto_play };
        }

        let loopEnabled = sliderOptions.loop === true || sliderOptions.loop === 'true' || sliderOptions.loop === 1;

        let centeredSlides = sliderOptions.mode === true || sliderOptions.mode === 'true';

        const swiperOptions = $.extend(
          true,
          {
            init: false,
            spaceBetween: sliderOptions.space,
            loop: loopEnabled,
            preventClicks: true,
            preventClicksPropagation: true,
            autoplay: autoplaySettings,
            centeredSlides: centeredSlides,
            effect: sliderOptions.effect,
            fadeEffect: { crossFade: true },
            navigation: {
              nextEl: this.sliderConfigElement.querySelector('.swiper-next'),
              prevEl: this.sliderConfigElement.querySelector('.swiper-prev'),
            },
            pagination: {
              el: this.sliderConfigElement.querySelector('.swiper-pagination'),
              clickable: true,
            },
            lazyLoading: true,
            focusableElements: 'input, select, option, textarea, video, label',
            speed: 2000,
            breakpoints: {
              320: {
                slidesPerView: sliderOptions.mobile,
              },
              768: {
                slidesPerView: sliderOptions.tablet,
                spaceBetween: sliderOptions.space * 0.7,
              },
              992: {
                slidesPerView: sliderOptions.laptop,
                spaceBetween: sliderOptions.space * 0.8,
              },
              1200: {
                slidesPerView: sliderOptions.desktop,
              },
            },
          },
          sliderOptions.additionalOptions
        );

        const swiperContainer = this.sliderConfigElement.querySelector('[data-swiper-slider]');
        const swiperInstance = new Swiper(swiperContainer, swiperOptions);

        swiperInstance.on('init', () => {
          swiperInstance.update();
        });

        swiperInstance.init();
      }
    }
  );
}

if (!customElements.get('content-swiper-slide')) {
    customElements.define(
      'content-swiper-slide',
      class textWidthIcons_Slider extends HTMLElement {
        constructor() {
          super();
          this.sliderConfigElement = this.querySelector('[data-slider-options]');
          if (this.sliderConfigElement) this.initializeSlider();
        }

        initializeSlider() {
          const sliderOptionsData = this.sliderConfigElement.getAttribute('data-slider-options');
          if (sliderOptionsData === null || sliderOptionsData === '') return null;
          const sliderOptions = $.extend(
            true,
            {
              effect: 'slide',
              direction: 'horizontal',
              autoplay: true,
              autoplaySpeed: 5,
              spaceBetweenSlides: 0,
              additionalOptions: {},
            },
            JSON.parse(sliderOptionsData)
          );

          const numericPattern = /^\d+$/;
          Object.keys(sliderOptions).forEach((key) => {
            if (typeof sliderOptions[key] === 'string' && numericPattern.test(sliderOptions[key])) {
              sliderOptions[key] = parseInt(sliderOptions[key], 10);
            }
          });

          let autoplaySettings = false;
          if (sliderOptions.auto_play > 0) {
            autoplaySettings = { delay: 1000 * sliderOptions.auto_play };
          }
          let loopEnabled = false;
          if (sliderOptions.loop === 'true' || sliderOptions.loop === true || sliderOptions.loop === 1) {
            loopEnabled = true;
          }

          let centeredSlides = false;
          if (sliderOptions.mode === 'true' || sliderOptions.mode === true) {
            centeredSlides = true;
          }

          const swiperOptions = $.extend(
            true,
            {
              init: false,
              spaceBetween: sliderOptions.space,
              loop: loopEnabled,
              preventClicks: true,
              preventClicksPropagation: true,
              autoplay: autoplaySettings,
              centeredSlides: centeredSlides,
              navigation: {
                nextEl: this.sliderConfigElement.querySelector('.swiper-next'),
                prevEl: this.sliderConfigElement.querySelector('.swiper-prev'),
              },
              pagination: {
                el: this.sliderConfigElement.querySelector('.swiper-pagination'),
                clickable: true,
              },
              lazyLoading: true,
              focusableElements: 'input, select, option, textarea, video, label',
              speed: 2000,
              breakpoints: {
                320: {
                  slidesPerView: sliderOptions.mobile,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.5,
                },
                400: {
                  slidesPerView: 2,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.5,
                },
                577: {
                  slidesPerView: sliderOptions.tablet,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.7,
                },
                992: {
                  slidesPerView: sliderOptions.laptop,
                  slidesPerColumn: 1,
                  spaceBetween: sliderOptions.space * 0.8,
                },
                1200: {
                  slidesPerView: sliderOptions.desktop,
                  slidesPerColumn: 1,
                },
              },
            },
            sliderOptions.additionalOptions
          );

          const swiperContainer = this.sliderConfigElement.querySelector('[data-swiper-slider]');
          const swiperInstance = new Swiper(swiperContainer, swiperOptions);

          swiperInstance.on('init', () => {
            swiperInstance.update();
          });

          swiperInstance.init();
        }
      }
    );
  }



/* Product card code */
$(document).off('click', '.swatches_container span.swatch').on('mouseover focus', '.swatches_container span.swatch', function (event) {
  var image = $(this).data('image');
  $('.swatches_container span.swatch').removeClass('swatch_active')
  $(this).addClass('swatch_active');
  var $closestImageWrapper = $(this).closest('.card-body').prev().find('.image_wrapper');
  $closestImageWrapper.find('a.card-img img').attr('srcset', image);
});
/* Product Slider */
if (!customElements.get('product-slider')) {
	customElements.define(
		'product-slider',
		class ProductSlider extends HTMLElement {
			constructor() {
				super();
				this.sliderConfigElement = this.querySelector('[data-slider-options]');
				if (this.sliderConfigElement) this.initializeSlider();
			}


			initializeSlider() {
				const productData = this.sliderConfigElement.getAttribute('data-slider-options');
				if (!productData) return;


				try {
					const config = JSON.parse(productData.trim());
					this.initSwiper(config);
				} catch (error) {
					// console.error('Error parsing slider options:', error);
				}
			}

			initSwiper(config) {
				var slider_type = config.slidertype
				var collectionTab = config.collection_tab
				var sectionId = config.sectionId
				var duration = config.duration
				var autoElePlay = config.auto_play
				var desktopEle = config.desktopEle
                var slider_space = config.space

				if (slider_type == 'angled') {
                    // Add tabindex="-1" to all interactive elements
                    const interactiveElements = this.sliderConfigElement.querySelectorAll('.swiper-slide a, .swiper-slide button, .swatches_container span');
                    interactiveElements.forEach(element => {
                    element.setAttribute('tabindex', '-1');
                    });

                    if (collectionTab == 'dropdown') {
                        setTimeout(function() {
                            var firstItem = $(`.dropdown-${sectionId} .dropdown-item:first`)[0];
                            if (firstItem) {
                                handleCollectionTabClick(firstItem, sectionId);
                            }
                        }, 100);
                    } else {
                        setTimeout(function() {
                            var tabContainer = $(`.collection-tabs-${sectionId}`);

                            var selectedBtn = tabContainer.find('button.angled_select_btn.tab-selected')[0];

                            if (selectedBtn) {
                                handleCollectionTabClick(selectedBtn, sectionId);
                            } else {

                                var firstBtn = tabContainer.find('button.angled_select_btn:first')[0];
                                if (firstBtn) {
                                    $(firstBtn).addClass('tab-selected');
                                    handleCollectionTabClick(firstBtn, sectionId);
                                } else {
                                    // console.error(`No buttons found for section ${sectionId}`);
                                }
                            }
                        }, 100);
                    }

					function selectdropdowntoggle() {
						var collectionTitle = $(`.dropdown-${sectionId} .dropdown-item.active`).data('collection-title');
						$(`.dropdown-${sectionId} button.select-dropdowntoggle`).html(collectionTitle);
					}
					selectdropdowntoggle();

					$(`.dropdown-${sectionId} .dropdown-item`).on('click', function(event) {
						selectCollection($(this));
					});
                   $(`.dropdown-${sectionId} .dropdown-item`).on('keypress', function(event) {
                        if (event.key === 'Enter' || event.keyCode === 13) {
                            event.preventDefault();
                            event.stopPropagation();
                            $(this).click();
                        }
                    });


					function selectCollection($item) {
						if (!$item.length) return;
						$(`.dropdown-${sectionId} .dropdown-item`).removeClass('active');
						$item.addClass('active');

						let collectionHandle = $item.data('collection-handle');
						let collectionTitle = $item.data('collection-title');
						$(`.dropdown-${sectionId} .dropdown-toggle`).text(collectionTitle);

						if (!collectionHandle) return;

						var collectionClass = 'collection_' + collectionHandle.replace(/-/g, '_');
						var $section = $item.closest('.shopify-section');
						var swiperInstance = $section.find(`.swiper-container-${sectionId}`)[0]?.swiper || window.swiper;
						var $swiperWrapper = $section.find('.swiper-wrapper') || $('.swiper-wrapper');

						if (swiperInstance) {

							swiperInstance.removeAllSlides();

							var $filteredSlides = $swiperWrapper.find('.swiper-slide.' + collectionClass).clone();
							initswipercurve(sectionId, autoElePlay, duration, slider_type, collectionTab, desktopEle)

							if ($filteredSlides.length > 0) {
								$filteredSlides.each(function() {
									swiperInstance.appendSlide($(this));
								});


                  swiperInstance.update();
                  swiperInstance.navigation.update();
                  swiperInstance.pagination.update();
                  swiperInstance.slideTo(1, 3);

							}
						}

						if (typeof selectdropdowntoggle === 'function') {
							selectdropdowntoggle();
						}
					}
                function handleCollectionTabClick(buttonElement, sectionId) {
                    var $this = $(buttonElement);
                    var collectionHandle = $this.data('collection-handle');
                    if (!collectionHandle) return;

                    $(`.collection-tabs-${sectionId} button.angled_select_btn`).removeClass('tab-selected');
                    $this.addClass('tab-selected');

                    var collectionClass = 'collection_' + collectionHandle.replace(/-/g, '_');
                    var $section = $this.closest('.shopify-section');
                    var swiperInstance = $section.find(`.swiper-container-${sectionId}`)[0]?.swiper || window.swiper;
                    var $swiperWrapper = swiperInstance?.$el?.find('.swiper-wrapper') || $('.swiper-wrapper');

                    if (swiperInstance) {
                        setTimeout(function() {
                            swiperInstance.removeAllSlides();
                            var $filteredSlides = $swiperWrapper.find('.swiper-slide.' + collectionClass).clone();

                            if ($filteredSlides.length > 0) {
                                $filteredSlides.each(function() {
                                    swiperInstance.appendSlide($(this));
                                });
                                swiperInstance.slideTo(1, 3);
                                swiperInstance.update();
                            }
                        }, 50);
                    }
                }


					$(`.collection-tabs-${sectionId} button.angled_select_btn`).click(function() {
            handleCollectionTabClick(this, sectionId);
					});

					initswipercurve(sectionId, autoElePlay, duration, slider_type, collectionTab, desktopEle)
          function removeTabindexProductSlider(sectionId) {
            const allSlides = document.querySelectorAll(`.product_slider-${sectionId} .swiper-slide`);

            allSlides.forEach(slide => {
              if (slide.classList.contains('swiper-slide-active')) {
                slide.removeAttribute('tabindex');
                slide.querySelectorAll('a').forEach(anchor => {
                  anchor.removeAttribute('tabindex');
                });
                slide.querySelectorAll('button').forEach(button => {
                  button.removeAttribute('tabindex');
                });
                slide.querySelectorAll('.swatches_container span').forEach(button => {
                  button.setAttribute('tabindex', '0');
                });

              } else {
                slide.setAttribute('tabindex', '-1');
                slide.querySelectorAll('a').forEach(anchor => {
                  anchor.setAttribute('tabindex', '-1');
                });
                slide.querySelectorAll('button').forEach(button => {
                  button.setAttribute('tabindex', '-1');
                });
                 slide.querySelectorAll('.swatches_container span').forEach(button => {
                  button.removeAttribute('tabindex');
                });
              }
            });
          }

        function initswipercurve(sectionId, autoElePlay, duration, slider_type, collectionTab, desktopEle) {
                                  let isUpdating = false;
                                  let swiperInstance = null;
                                  let currentIsMobile = null;

                                  const checkIsMobile = () => window.innerWidth <= 991;

                                  const initSwiper = () => {
                                      const isMobile = checkIsMobile();
                                      const newIsMobile = checkIsMobile();


                                      const swiperConfig = {
                                          spaceBetween: 10,
                                          initialSlide: 1,
                                          loop: true,
                                          slidesPerView: 3,
                                          // loopAdditionalSlides: 2,
                                          navigation: {
                                              nextEl: `.swiper-next-${sectionId}`,
                                              prevEl: `.swiper-prev-${sectionId}`,
                                          },
                                          pagination: {
                                              el: `.swiper-pagination-${sectionId}`,
                                              clickable: true,
                                          },
                                          watchSlidesProgress: true,
                                          watchSlidesVisibility: true,
                                          observer: true,
                                          observeParents: true,
                                          effect: isMobile ? "slide" : "creative",
                                          centeredSlides: !isMobile,
                                          creativeEffect: !isMobile ? {
                                              perspective: true,
                                              limitProgress: 3,
                                              prev: {
                                                  translate: ["-160%", "-9%", 0],
                                                  rotate: [0, 0, -30],
                                                  scale: 1,
                                                  origin: "top",
                                              },
                                              next: {
                                                  translate: ["160%", "-9%", 0],
                                                  rotate: [0, 0, 30],
                                                  scale: 1,
                                                  origin: "top",
                                              },
                                          } : undefined,
                                          breakpoints: {
                                              320: {
                                                  slidesPerView: 1,
                                                  // effect: "slide",
                                                  // centeredSlides: true
                                              },
                                              576: {
                                                  slidesPerView: 2,
                                                  // effect: "creative",
                                                  // centeredSlides: true
                                              },
                                              992: {
                                                  slidesPerView: 3,
                                                  // effect: "creative",
                                                  // centeredSlides: true
                                              }
                                          },
                                          watchSlidesProgress: true,
                                          preloadImages: false,
                                          lazy: true,
                                          on: {
                                            beforeInit: function() {
                                                  const styleId = `swiper-visibility-${sectionId}`;
                                                  if (!document.getElementById(styleId)) {
                                                      const style = document.createElement('style');
                                                      style.id = styleId;
                                                      style.textContent = `
                                                          .swiper-container-${sectionId}.my-carousel-${sectionId} .swiper-slide{opacity:0 !important;}
                                                          .swiper-container-${sectionId}.my-carousel-${sectionId} .swiper-slide.swiper-slide-fully-visible,
                                                          .swiper-container-${sectionId}.my-carousel-${sectionId} .swiper-slide.swiper-slide-visible,
                                                          .swiper-container-${sectionId}.my-carousel-${sectionId} .swiper-slide.swiper-slide-prev,
                                                          .swiper-container-${sectionId}.my-carousel-${sectionId} .swiper-slide.swiper-slide-next,
                                                          .swiper-container-${sectionId}.my-carousel-${sectionId} .swiper-slide.swiper-slide-active {opacity:1 !important;}
                                                      `;
                                                      document.head.appendChild(style);
                                                  }
                                              },
                                              slideChange: function() {
                                                  if (!isUpdating) {
                                                      isUpdating = true;
                                                      setTimeout(() => {
                                                          this.update();
                                                          isUpdating = false;
                                                           removeTabindexProductSlider(sectionId);
                                                      }, 100);

                                                  }

                                              },
                                              init: function() {
                                                  if (!isUpdating) {
                                                      isUpdating = true;
                                                      setTimeout(() => {
                                                          this.update();
                                                          isUpdating = false;
                                                      }, 100);
                                                  }
                                                  setTimeout(() => {
                                                      removeTabindexProductSlider(sectionId);
                                                  }, 50);
                                              }
                                          }
                                      };

                                      const shouldAutoplay = autoElePlay === true ||
                                          autoElePlay === 'true' ||
                                          autoElePlay === 1 ||
                                          autoElePlay === '1';

                                      if (shouldAutoplay) {
                                          swiperConfig.autoplay = {
                                              delay: duration || 3000,
                                              disableOnInteraction: false,
                                          };

                                      }

                                      if (swiperInstance) {
                                          swiperInstance.destroy(true, true);
                                      }

                                      swiperInstance = new Swiper(`.swiper-container-${sectionId}.my-carousel-${sectionId}`, swiperConfig);

                                      window.swiper = swiperInstance;

                                      setTimeout(() => {
                                          if (swiperInstance && swiperInstance.navigation) {
                                              swiperInstance.navigation.init();
                                              swiperInstance.navigation.update();
                                              const nextBtn = document.querySelector(`.swiper-next-${sectionId}`);
                                              if (nextBtn) {
                                                  nextBtn.style.pointerEvents = 'auto';
                                                  nextBtn.addEventListener('click', function() {
                                                      swiperInstance.slideNext();
                                                  });
                                              }
                                          }
                                      }, 500);
                                  };

                                  initSwiper();
                                  let resizeTimeout;
                                  const handleResize = () => {
                                      clearTimeout(resizeTimeout);
                                      resizeTimeout = setTimeout(() => {
                                          initSwiper();
                                      }, 250);
                                  };

                                  window.addEventListener('resize', handleResize);
                                  return {
                                      instance: swiperInstance,
                                      destroy: () => {
                                          window.removeEventListener('resize', handleResize);
                                          if (swiperInstance) {
                                              swiperInstance.destroy(true, true);
                                          }
                                      }
                                  };
          }

				} else {
					function selectdropdowntoggle() {
						var collectionTitle = $(`.dropdown-${sectionId} .dropdown-item.active`).data('collection-title');
						$(`.dropdown-${sectionId} button.select-dropdowntoggle`).html(collectionTitle);
					}
					selectdropdowntoggle();


					function initialSelectfun() {
						var collectionHandle = $(`.collection-tabs-${sectionId} .active`).data('collection-handle');
						$('.swiper-slide.collection_' + collectionHandle.replace(/-/g, '_')).show();
						var $swiperWrapper = $(`.product_slider-${sectionId} .swiper-wrapper`);
						var swiper = window.swiper2;
						$swiperWrapper.find('.swiper-slide:has(.swiper-card)').hide();
						// $swiperWrapper.find('.card_swiper .swiper-slide').show();
						$swiperWrapper.find('.swiper-slide.collection_' + collectionHandle.replace(/-/g, '_')).show();
						if (swiper) {
							swiper.update();
							swiper.slideTo(0);
						}
					}

					 function initialFun() {
                        var collectionHandle = $(`.collection-tabs-${sectionId} .tab-selected`).data('collection-handle');
                        if (!collectionHandle) {
                            collectionHandle = $(`.collection-tabs-${sectionId} button`).first().data('collection-handle');
                        }

                        var $swiperWrapper = $(`.product_slider-${sectionId} .swiper-wrapper`);
                        var swiper = window.swiper2;

                        const collectionClass = 'collection_' + (collectionHandle || '').replace(/-/g, '_');
                        const $collectionSlides = $swiperWrapper.find('.swiper-slide.' + collectionClass);
                        if ($collectionSlides.length > 0) {
                            $swiperWrapper.find('.swiper-slide:has(.swiper-card)').hide();
                            $collectionSlides.show();
                        } else {
                            $swiperWrapper.find('.swiper-slide').show();
                        }

                        if (swiper) {
                            swiper.update();
                            swiper.slideTo(0);
                        }
                    }
					if (collectionTab == 'dropdown') {
						initialSelectfun();
					} else {
						initialFun();
					}

					$(`.dropdown-${sectionId} .dropdown-item`).on('click', function(event) {
						event.preventDefault();
						$(`.dropdown-${sectionId} .dropdown-item`).removeClass('active');
						$(this).addClass('active');
						let collectionHandle = $(this).data('collection-handle');
						if (!collectionHandle || typeof collectionHandle.replace !== 'function') {
							// console.error('Invalid collection handle:', collectionHandle);
							return;
						}
						const collectionClass = 'collection_' + (collectionHandle || '').replace(/-/g, '_');
						let collectionTitle = $(this).data('collection-title');
						$(`.dropdown-${sectionId} .dropdown-toggle`).text(collectionTitle || 'Select Collection');
						var $swiperWrapper = $(`.product_slider-${sectionId} .swiper-wrapper`);
						var swiper = window.swiper2;
						if ($swiperWrapper.length) {
							$swiperWrapper.find('.swiper-slide:has(.swiper-card)').hide();
							$swiperWrapper.find('.' + collectionClass).show();
							if (swiper) {
								swiper.update();
								swiper.slideTo(0);
							}
						}
						if (typeof selectdropdowntoggle === 'function') {
							selectdropdowntoggle();
						}
						initswipercurve(sectionId, autoElePlay, duration, slider_type, collectionTab, desktopEle)
					});

					$(`.collection-tabs-${sectionId} button.collection-button`).click(function() {
						var collectionHandle = $(this).data('collection-handle');
						$(`.collection-tabs-${sectionId} button`).removeClass('tab-selected');
						$(this).addClass('tab-selected');
						var $swiperWrapper = $(`.product_slider-${sectionId} .swiper-wrapper`);
						var swiper = window.swiper2;
						$swiperWrapper.find('.swiper-slide:has(.swiper-card)').hide();
						$swiperWrapper.find('.swiper-slide.collection_' + collectionHandle.replace(/-/g, '_')).show();
						if (swiper) {
							swiper.update();
							swiper.slideTo(0);
						}
					});

					function initSwiper() {
						var swiper2 = {
							slidesPerView: 5,
							spaceBetween: slider_space,
							keyboard: {
								enabled: true,
							},
                            loop: false,
							navigation: {
								nextEl: `.swiper-next-${sectionId}`,
								prevEl: `.swiper-prev-${sectionId}`,
							},

							pagination: {
								el: `.swiper-pagination-${sectionId}`,
								clickable: true,
							},

							breakpoints: {
								320: {
									slidesPerView: 1,
								},
								480: {
									slidesPerView: 2,
                                    spaceBetween: slider_space * 0.5,
								},
								768: {
									slidesPerView: 3,
                                    spaceBetween: slider_space * 0.5,
								},
								992: {
									slidesPerView: 3,
                                    spaceBetween: slider_space * 0.8,
								},
								1200: {
									slidesPerView: desktopEle,
                                    spaceBetween: slider_space
								},
							},
						};

						const shouldAutoplay = autoElePlay === true ||
							autoElePlay === 'true' ||
							autoElePlay === 1 ||
							autoElePlay === '1';

						if (shouldAutoplay) {
							swiper2.autoplay = {
								delay: duration || 3000,
								disableOnInteraction: false,
							};
						}

						swiper2 = new Swiper(`.mySwiper-${sectionId}`, swiper2);


					}
					// initswiper();
          initSwiper(config);
				}
				const formatPrice = (price) => {
					return new Intl.NumberFormat(Shopify.locale, {
						style: 'currency',
						currency: Shopify.currency.active
					}).format(price);
				};


			}
		}
	);
}
 /* Product Slider */



});

/* Product Showcse start */
function initializeProductShowcase() {
    var currency_symbol = window.routes.currency_symbol;

    const productShowcases = document.querySelectorAll('.product_showcase');

    productShowcases.forEach(function(productShowcase) {
        if (productShowcase.hasAttribute('data-initialized')) {
            return;
        }
        productShowcase.setAttribute('data-initialized', 'true');

        const sectionId = productShowcase.getAttribute('data-sectionId');
        if (!sectionId) {
            return;
        }

        initializeQuantityControls(sectionId);
        // initializeAddToCart(sectionId);
        initializeSwiper(sectionId, productShowcase);
    });
}

function initializeQuantityControls(sectionId) {
    const quantityInput = $(`.product_showcase-${sectionId} #quantity`);

    $(`.product_showcase-${sectionId} #increment`).off('click').on('click', function() {
        $(`.product_showcase-${sectionId} #decrement`).css('cursor', 'pointer');

        var selectedCount = $(`.product_showcase-${sectionId} select#variant-select option:selected`).data('stockcount');
        var inventoryCheck = $(`.product_showcase-${sectionId} select#variant-select option:selected`).data('inventorycheck');
        var continueSelling = $(`.product_showcase-${sectionId} select#variant-select option:selected`).data('continue-selling');

        var quantityInputs = quantityInput.val();

        if (!continueSelling && !inventoryCheck) {
            quantityInput.val(parseInt(quantityInput.val()) + 1);
        } else if (continueSelling && !inventoryCheck) {
            quantityInput.val(parseInt(quantityInput.val()) + 1);
        } else if (!continueSelling && inventoryCheck) {
            if (quantityInputs < selectedCount) {
                quantityInput.val(parseInt(quantityInput.val()) + 1);
            } else {
                // $(`.product_showcase-${sectionId} .showcase-message`).html(
                //     '<div class="mt-3"><span class="text-danger"><svg width="12px" height="12px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
                //     '<path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.0586 6.05547C10.0268 5.48227 10.483 5 11.0571 5H12.9429C13.517 5 13.9732 5.48227 13.9414 6.05547L13.5525 13.0555C13.523 13.5854 13.0847 14 12.554 14H11.446C10.9153 14 10.477 13.5854 10.4475 13.0555L10.0586 6.05547ZM14 17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17Z" fill="currentColor"/>' +
                //     '</svg></span>' +
                //     "<span class='m-0 ms-1 fs-6'>{{ 'sections.cart.errors.max_quantity' | t }}</span></div>"
                // );
            }
        } else {
            quantityInput.val(parseInt(quantityInput.val()) + 1);
        }
    });

    $(`.product_showcase-${sectionId} #decrement`).off('click').on('click', function() {
        $(`.product_showcase-${sectionId} #product-stock`).html("<p></p>");

        if (parseInt(quantityInput.val()) > 1) {
            quantityInput.val(parseInt(quantityInput.val()) - 1);
            $(`.product_showcase-${sectionId} #decrement`).css('cursor', 'pointer');
        } else {
            $(`.product_showcase-${sectionId} #decrement`).css('cursor', 'not-allowed');
        }
    });
}

let isUpdating = false;
function baseInitShowcase(newsectionId) {
    //   if (isUpdating) {  return; }
      isUpdating = true;
      try {
            var sectionId = newsectionId;

            if (!sectionId) {
                var sectionContainer = $('#MainContent .product_showcase');
                sectionId = sectionContainer.first().data('sectionid');
            }

            var form = $(`.product_showcase-${sectionId} .showcase-add-to-cart-form`);

            if (form.length === 0) {
                form = $(`#shopify-section-${sectionId} .showcase-add-to-cart-form`);
            }

            if (form.length === 0) {
                return;
            }

            var variantSelects = form.find('select[name="variant"]:visible');


            var proHandle = form.data('product-handle') || $(`.product_showcase-${sectionId} .swiper-slide-active`).data('producthandle');


            if (variantSelects.length > 0) {
                var selectedValues = [];

                variantSelects.each(function(index) {
                    var select = $(this);
                    var value = select.val();
                    if (value) {
                        selectedValues.push(value);
                    }

                });

                if (selectedValues.length === 0) {
                    return;
                }

                var params = selectedValues.join(', ');
                if (!proHandle || proHandle === "undefined" || proHandle === undefined) {
                    return;
                }
                const url = `/products/${proHandle}?option_values=${encodeURIComponent(params)}`;


                fetch(url)
                    .then((response) => response.text())
                    .then((responseText) => {
                        const showcaseHtml = new DOMParser().parseFromString(responseText, 'text/html');
                        var selectedVariant = showcaseHtml.querySelector('main-product');

                        if (!selectedVariant) {
                            return;
                        }

                        var variantId = selectedVariant.dataset.variantid;

                        $(`.product_showcase-${sectionId} .variant-select`).val(variantId);

                        const detailsSelect = selectedVariant.querySelector('.variant-select');

                        if (detailsSelect) {
                            const selectedOption = detailsSelect.selectedOptions[0] || detailsSelect.querySelector('option[selected]');

                            if (selectedOption && selectedOption.dataset) {
                                var selectedOptionPrice = selectedOption.dataset.price;
                                var selectedComparePrice = selectedOption.dataset.cmpprice;
                                var selectedSavePrice = selectedOption.dataset.pricediff;
                                var selectedUnitPrice = selectedOption.dataset.unitprice;
                                var availablecheck = selectedOption.dataset.availablecheck;


                                var addToCartBtn = $(`.product_showcase-${sectionId} button.add-to-cart-button`);
                                if (availablecheck === "sold out") {
                                    addToCartBtn.text('Sold Out').addClass('disabled').prop('disabled', true);
                                } else if (availablecheck === "unavailable") {
                                    addToCartBtn.text('Unavailable').addClass('disabled').prop('disabled', true);
                                } else {
                                    addToCartBtn.text('Add to Cart').removeClass('disabled').prop('disabled', false);
                                }

                                $(`.product_showcase-${sectionId} .pro_price`).html(selectedOptionPrice);
                                $(`.product_showcase-${sectionId} .cmp_price`).html(selectedComparePrice);

                             if(selectedSavePrice != 0){
                                $(`.product_showcase-${sectionId} .pro_profit`).html("You Save "  + selectedSavePrice);
                            } else { $(`.product_showcase-${sectionId} .pro_profit`).html(''); }

                                var hiddenInput = $(`.product_showcase-${sectionId} input[name="id"]`);
                                hiddenInput.attr("data-unitmeasureprice", selectedUnitPrice)
                                        .attr("data-cmpprice", selectedComparePrice)
                                        .attr("data-price", selectedOptionPrice)
                                        .val(variantId);
                            }
                        }
                    })
                    .catch((error) => {
                        // console.error("Fetch error:", error);
                    });

            }
        } finally {
            setTimeout(() => isUpdating = false, 100);
    }
}

  setTimeout(function() {
        $(document).on('change', 'select[name="variant"]', function() {
            var select = $(this).data('sectionid');
              baseInitShowcase(select);
        });

}, 500);



// function initializeAddToCart(sectionId) {
    $(`.showcase-add-to-cart-form`).off('submit').on('submit', function (e) {
        e.preventDefault();
        var form = $(this);
        const sectionId = form.data('sectionid');


       var variantId = $(`.product_showcase-${sectionId} .variant-select`).val() ;
        if (!variantId || variantId === "") {
            $(`.product_showcase-${sectionId} .showcase-message`).html('Please select a variant').addClass('text-danger');
            return;
        }
        if (quantity < 1) {
            $(`.product_showcase-${sectionId} .showcase-message`).html('Invalid quantity').addClass('text-danger');
            return;
        }

       var requestData = {
            id: variantId,
            quantity: quantity
        };
        if (form.find(`.product_showcase-${sectionId} input[name="form_type"]`).val()) {
            requestData.form_type = form.find(`.product_showcase-${sectionId} input[name="form_type"]`).val();
        }
           $(`.product_showcase-${sectionId} select[name="id"]`).attr("value",variantId)

         $.ajax({
            url: window.routes.cart_url + '/add.js',
            method: 'POST',
            data: form.serialize(),
            dataType: 'json',
            success: function (data) {

                $.getJSON('/cart.js', function(cart) {
                    let cartItemCount = cart.item_count;
                    $('.open-cart-drawer a > span:last-child').html(cartItemCount);
                });
                 var cartType = window.settingStrings.cartType  || 'drawer';


                if( cartType === "drawer"){ document.getElementById('cart-icon').click(); }
                else if( cartType === "pop_up" ) {
                    var selectedOption = $(`.product_showcase-${sectionId} .variant-select `) || null;

                    const price = selectedOption ? $(selectedOption).data('price') : null;
                    const comparePrice = selectedOption ? $(selectedOption).data('cmpprice') : null;
                    const unitMeasurePrice = selectedOption ? $(selectedOption).data('unitmeasureprice') : null;
                    showSuccessPopup(data, price, comparePrice, unitMeasurePrice);
                }
                else {
                    window.location.href = window.routes.cart_url;
                }

                $(`.product_showcase-${sectionId} #quantity`).val(1);
                $(`.product_showcase-${sectionId} .showcase-message`).html('');
            },
            error: function (error) {
                handleAddToCartError(error, sectionId);
            },
        });




    });
// }

function updateCartCount() {
    $.getJSON('/cart.js', function(cart) {
        $('.open-cart-drawer a > span:last-child, .cart-count-bubble').html(cart.item_count);
    }).fail(function() {
        // console.warn("Failed to update cart count");
    });
}

function triggerCartDrawer() {
    var cartIcon = document.getElementById('cart-icon');
    if (cartIcon && typeof cartIcon.click === 'function') {
        cartIcon.click();
    }
}

function handleAddToCartError(error, sectionId) {
    let errorMessages = [];
    const jqXHR = error;

    if (jqXHR.responseJSON) {
        if (jqXHR.responseJSON.errors) {
            Object.entries(jqXHR.responseJSON.errors).forEach(([key, messages]) => {
                messages.forEach(msg => {
                    errorMessages.push(`${key}: ${msg}`);
                });
            });
        }
        if (jqXHR.responseJSON.description) {
            if (typeof jqXHR.responseJSON.description === 'object') {
                Object.entries(jqXHR.responseJSON.description).forEach(([key, messages]) => {
                    messages.forEach(msg => {
                        errorMessages.push(`${key}: ${msg}`);
                    });
                });
            } else if (typeof jqXHR.responseJSON.description === 'string') {
                errorMessages.push(jqXHR.responseJSON.description);
            }
        }
        if (jqXHR.responseJSON.message) {
            errorMessages.push(jqXHR.responseJSON.message);
        }
    }

    errorMessages = [...new Set(errorMessages)].filter(msg => msg.trim() !== '');

    let messageContainer = $(`.product_showcase-${sectionId} .showcase-message`);
    if (messageContainer.length === 0) {
        messageContainer = $('<div class="showcase-message"></div>');
        $(`.product_showcase-${sectionId} .showcase-add-to-cart-form`).append(messageContainer);
    }

    const errorHtml = errorMessages
        .map(error => `
            <div class="error-item d-flex align-items-baseline mt-3 justify-content-center">
                <span class="text-danger"><svg width="12px" height="12px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.0586 6.05547C10.0268 5.48227 10.483 5 11.0571 5H12.9429C13.517 5 13.9732 5.48227 13.9414 6.05547L13.5525 13.0555C13.523 13.5854 13.0847 14 12.554 14H11.446C10.9153 14 10.477 13.5854 10.4475 13.0555L10.0586 6.05547ZM14 17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17Z" fill="currentColor"/>
                </svg></span>
                <span class='ms-1 fs-6'>${error}</span>
            </div>
        `)
        .join('');

    messageContainer.html(errorHtml);
}
function removeTabindexProductActiveSlide(sectionId, swiperInstance) {

   const allSlides = document.querySelectorAll(`.product_showcase-${sectionId} .swiper-slide`);

    allSlides.forEach(slide => {
      if (slide.classList.contains('swiper-slide-active')) {
        slide.removeAttribute('tabindex');
        slide.querySelectorAll('a').forEach(anchor => {
          anchor.removeAttribute('tabindex');
        });
      } else {
        slide.setAttribute('tabindex', '-1');
        slide.querySelectorAll('a').forEach(anchor => {
          anchor.setAttribute('tabindex', '-1');
        });
      }
    });
}
function initializeSwiper(sectionId, productShowcase) {
    const duration = productShowcase.getAttribute('data-delay') || 3000;
    const existingSwiper = $(`.product_showcase-swiper-${sectionId}`)[0]?.swiper;
    if (existingSwiper) {
        existingSwiper.destroy(true, true);
    }
     const slideCount = productShowcase.getAttribute('data-slideCount') || 5;
    const spaceBetween = productShowcase.getAttribute('data-space') || 1;
    let slideCountMobile = 1;
    const isMultiSlide = slideCount == 5;
   if (isMultiSlide) {  slideCountMobile = 3; } else { slideCountMobile = 1; }
    var swiper = new Swiper(`.product_showcase-swiper-${sectionId}`, {
        spaceBetween: spaceBetween,
        centeredSlides: true,
        loop: true,
        // autoHeight: true,
        keyboard: {
            enabled: true
        },
        navigation: {
            nextEl: `.product_showcase_next-${sectionId}`,
            prevEl: `.product_showcase_prev-${sectionId}`,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                pagination: {
                    clickable: true,
                },
            },
            480: {
                 slidesPerView: slideCountMobile
            },
            992: {
                slidesPerView: slideCountMobile
            },
            1400: {
                slidesPerView: slideCount
            },
        },
        simulateTouch: true,
        freeModeMomentum: true,
        on: {
            slideChange: function() {
                setTimeout(() => {
                    removeTabindexProductActiveSlide(sectionId, this);
                }, 50);

                var currentSlide = this.slides[this.activeIndex];
                var productId = $(currentSlide).data('productid');
                var productHandle = $(currentSlide).data('producthandle');

                $(`.product_showcase-${sectionId} .product-id`).attr("value", productId);


                  $(`.product_showcase-${sectionId} select`).attr('hidden', true);

                 var variantSelect = $(`.product_showcase-${sectionId} #variant-select-${productId}`);

                if (variantSelect.length) {
                    variantSelect.removeAttr('hidden');

                    var selectedValue = variantSelect.val();
                    var selectedText = variantSelect.find('option:selected').text();


                    $(`.product_showcase-${sectionId} input[name="id"]`).val(selectedValue);
                    setTimeout(function(){
                     baseInitShowcase(sectionId); }, 500)
                } else {

                }
                fetchProductDetails(productHandle, sectionId);
                $(`.product_showcase-${sectionId} #quantity`).val(1);
                $(`.product_showcase-${sectionId} .showcase-message`).html('');
            }
        }
    });


}

function fetchProductDetails(productHandle, sectionId) {
    if (productHandle === undefined) { return; }
    $.ajax({
        url: '/products/' + productHandle + '.json',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var product = response.product;

            displayProductDetails(product, sectionId);
        },
        error: function() {
            // console.log("Error fetching product details.");
        }
    });
}

function displayProductDetails(product, sectionId) {
    $(`.product_showcase-${sectionId} .pro_title`).html(`${product.title}`);
    $(`.product_showcase-${sectionId} .pro_description`).html(`${product.body_html}`);

}
/* Product Showcase end */
/* Search main */
const mainSearchButton = document.querySelector('.main-search-button');
if ( window.location.pathname.includes('/search')) {
    mainSearchButton.addEventListener('click', function() {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;
    searchParams.delete('q');
    const newUrl = `${currentUrl.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

    window.history.replaceState({}, '', newUrl);
    var searchNoResult =  document.querySelector('.search-no-result');
     var searchSuggestion =  document.querySelector('.search_suggestion');
     var main_collection =  document.querySelector('.main_collection');
     if (searchNoResult) {  searchNoResult.classList.add('d-none');  }
    if (searchSuggestion) {  searchSuggestion.classList.add('d-none');  }
    if (main_collection) {  main_collection.classList.add('d-none'); }

 });
}


// inptut button width handling

function email__button() {
  document.querySelectorAll(".form_input").forEach((group) => {
    const btn = group.querySelector(".input_button");
    if (!btn) return;

    group.style.setProperty(
      "--email-btn-width",
      btn.offsetWidth + "px"
    );
  });
}

window.addEventListener("load", email__button);
window.addEventListener("resize", email__button);
document.addEventListener("shopify:section:load", email__button);




/* Drawer Handling - Accessability */
function drawerHandling(){
   const filterOffCanvas = document.getElementById('filterOffCanvas');

    if (filterOffCanvas) {
        filterOffCanvas.addEventListener('show.bs.offcanvas', function() {
            document.body.classList.add('position-fixed');
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = scrollbarWidth + 'px';
            }
            document.body.style.overflow = 'hidden';
        });
        filterOffCanvas.addEventListener('hidden.bs.offcanvas', function() {
            document.body.classList.remove('position-fixed');
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        });
    }

}

drawerHandling();



// Account handling script

function header_hgtele() {
const headerGroup = document.querySelector('.shopify-section-group-header-group.section-header');
const announcementBar = document.querySelector('.shopify-section-group-header-group.announcement');

const headerGroupHeight = headerGroup ? headerGroup.offsetHeight : 0;
const announcementBarHeight = announcementBar ? announcementBar.offsetHeight : 0;

const header_Ele_height = headerGroupHeight + announcementBarHeight;
document.documentElement.style.setProperty("--header-ele-height", header_Ele_height + "px");
}

header_hgtele();
window.addEventListener('resize', header_hgtele);
