document.addEventListener("DOMContentLoaded", function () {
    window.productSwipers = {};
    window.thumbSwipers = {};

    var current_element = document.querySelector('.product__media .swiper-wrapper');
    var current_var = '';
    var current_section = "";

    if (current_element) {
        current_var = current_element.getAttribute('data-gallery');
        current_section = current_element.getAttribute('data-sectionId');
    }


    const sectionEl = document.querySelector("main-product");
    const sectionId = sectionEl?.dataset.sectionId;

    function updateVariantInUrl(variantId) {
        if (!variantId) return;
        const url = new URL(window.location);
        url.searchParams.set('variant', variantId);
        window.history.replaceState({}, '', url);
    }



    const newBlocks = document.querySelectorAll('.product__media');

    newBlocks.forEach(newBlock => {
        let variantImageId = newBlock?.dataset.selectedimageid;

        // Get section ID - adjust based on your HTML structure
        let sectionId = newBlock.dataset.sectionid ||
                       newBlock.closest('[data-section-id]')?.dataset.sectionId;

        let gallerylayout = null;
        if (newBlock && newBlock.dataset) {
            gallerylayout = newBlock.dataset.gallerylayout;
        }


    });


 const newBlock = document.querySelector('.product__media');





function tabControlVideo()
{


//video thumbnail\
function playVideoInSlide(slide) {
    if (!slide) return;

    const video = slide.querySelector('video');
    const youtubeIframe = slide.querySelector('iframe[src*="youtube"], iframe[src*="youtu.be"]');
    const vimeoIframe = slide.querySelector('iframe[src*="vimeo"]');
    const modelViewer = slide.querySelector("model-viewer");
    const hasPlayingVideo = video && !video.paused;
    const hasPlayingYouTube = youtubeIframe && youtubeIframe.dataset.playing === 'true';
    const hasPlayingVimeo = vimeoIframe && vimeoIframe.dataset.playing === 'true';
    if (hasPlayingVideo || hasPlayingYouTube || hasPlayingVimeo) {

        if (video) {
            video.pause();
            video.dataset.playing = 'false';
        }

        if (youtubeIframe) {
            try {
                youtubeIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                youtubeIframe.dataset.playing = 'false';
            } catch(e) {}
        }

        if (vimeoIframe) {
            try {
                vimeoIframe.contentWindow.postMessage('{"method":"pause"}', '*');
                vimeoIframe.dataset.playing = 'false';
            } catch(e) {}
        }

        return;
    }


    pauseAllMediaExcept(video, youtubeIframe, vimeoIframe);

    if (video) {
        video.classList.remove('d-none');
        video.currentTime = 0;
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    video.dataset.playing = 'true';
                })
                .catch(error => {
                    video.dataset.playing = 'false';

                });
        }
        return;
    }

    if (youtubeIframe) {
        try {
            youtubeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            youtubeIframe.dataset.playing = 'true';
        } catch(e) {}
        return;
    }

    if (vimeoIframe) {
        try {
            vimeoIframe.contentWindow.postMessage('{"method":"play"}', '*');
            vimeoIframe.dataset.playing = 'true';
        } catch(e) {}
        return;
    }

    if (modelViewer) {
        const mediaId = slide.dataset.mediaId;
        if (mediaId) {
            const sectionId = slide.closest('[data-sectionid]')?.dataset.sectionid;
            const modelButton = document.querySelector(
                `[data-sectionid="${sectionId}"] [data-media-id="${mediaId}"] .svg-wrapper-icon`
            ) || document.querySelector(`[data-media-id="${mediaId}"] .svg-wrapper-icon`);

            if (modelButton) {
                modelButton.click();
            }
        }
    }
}

//  Pause all media
function pauseAllMediaExcept(currentVideo, currentYoutube, currentVimeo) {

    document.querySelectorAll('video').forEach(video => {
        if (video !== currentVideo && !video.paused) {
            video.pause();
            video.dataset.playing = 'false';
        }
    });

    document.querySelectorAll('iframe[src*="youtube"], iframe[src*="youtu.be"]').forEach(iframe => {
        if (iframe !== currentYoutube) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                iframe.dataset.playing = 'false';
            } catch(e) {}
        }
    });

    document.querySelectorAll('iframe[src*="vimeo"]').forEach(iframe => {
        if (iframe !== currentVimeo) {
            try {
                iframe.contentWindow.postMessage('{"method":"pause"}', '*');
                iframe.dataset.playing = 'false';
            } catch(e) {}
        }
    });
}

document.querySelectorAll(".swiper-slide.thumbnail-img.thumbnail-modal")
  .forEach(thumbnail => {
    thumbnail.addEventListener("click", function(e) {
      const self = this;
      const sectionId = this.dataset.sectionId || this.dataset.sectionid;

      const mediaId = self.dataset.mediaId;
      setTimeout(function() {
        const main3dButton = document.querySelector(`[data-sectionid="${sectionId}"] [data-media-id="${mediaId}"] .svg-wrapper-icon`);
        if (main3dButton) {
          main3dButton.click();
        }
      }, 200);
    });
});

document.addEventListener("keydown", function (event) {
            if ((event.key === "Enter" || event.keyCode === 13) && event.target.matches(".swiper-slide.thumbnail-img.thumbnail-modal")) {
                event.target.click();
            }
        });
 document.addEventListener("keydown", function (event) {
            if ((event.key === "Enter" || event.keyCode === 13) && event.target.matches(".swiper-slide.thumbnail-img.product_media_preview")) {
                event.target.click();
            }
        });

document
  .querySelectorAll(".swiper-slide.thumbnail-img.product_media_preview")
  .forEach(thumbnail => {
    thumbnail.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const mediaId = this.dataset.mediaId;
      const mediaType = this.dataset.mediaType;
      const model3dId = this.dataset.model3dId || mediaId;
      const sectionRed = this.dataset.sectionId || this.dataset.sectionid;

      if (mediaType === "model") {
        if (window.ShopifyXR && typeof window.ShopifyXR.launchXR === "function") {
          const productTitleElement = document.querySelector("[data-product-title]") || document.querySelector("h1") || document.querySelector(".product__title");
          const title = productTitleElement ? productTitleElement.textContent.trim() : document.title;

          window.ShopifyXR.launchXR({
            model3dId: model3dId,
            title: title
          });

          return;
        }
      }

       const mainSwiper = document.querySelector(".swiper.my-carousel-"+sectionRed)  || document.querySelector(".swiper.main_carousel") ||
        document.querySelector(".mySwiper1") ||
        document.querySelector(".product__media .swiper") ||
        document.querySelector(".product-main-swiper");


      if (!mainSwiper) {
        return;
      }

      const mainSlide = mainSwiper.querySelector(`.swiper-slide[data-media-id="${mediaId}"]`);

      if (!mainSlide) {
        return;
      }

      let swiperInstance = null;

      if (mainSwiper.swiper) {
        swiperInstance = mainSwiper.swiper;
      } else if (window.mainSwiperInstance) {
        swiperInstance = window.mainSwiperInstance;
      } else if (window.productSwipers && window.productSwipers[sectionId]) {
        swiperInstance = window.productSwipers[sectionId];
      }


      if (swiperInstance) {
        const slides = Array.from(mainSwiper.querySelectorAll(".swiper-slide"));
        const targetIndex = slides.indexOf(mainSlide);
        if( targetIndex) { swiperInstance.slideTo(targetIndex, 300); }
        setTimeout(() => {
          playVideoInSlide(mainSlide);
        }, 300);
      } else {
        playVideoInSlide(mainSlide);
      }
    });
});
// document.querySelectorAll(".swiper-slide.thumbnail-img.thumbnail-modal")
//   .forEach(thumbnail => {
//     thumbnail.addEventListener("click", function (e) {
//       setTimeout( function() { document.querySelector('.svg-wrapper-icon').click(); } ,100);
//     })
// })



        document.addEventListener("keydown", function (event) {
            if ((event.key === "Enter" || event.keyCode === 13) && event.target.matches(".product_media_preview")) {
                event.target.click();
            }
        });
        document.addEventListener("keydown", function (event) {
            if ((event.key === "Enter" || event.keyCode === 13) && event.target.matches(".product_media_preview .svg-wrapper-icon")) {
                event.target.click();
            }

        });

        document.querySelectorAll(".product_media_preview .svg-wrapper-icon")
        .forEach(icon => {
            icon.addEventListener("click", function () {
            const activeMedia = this.closest(".product-active-media");
            if (activeMedia) {
                activeMedia.classList.add("active");
            }
            });
        });


        document.querySelectorAll(".product_media_preview").forEach(preview => {
        preview.addEventListener("click", function () {
            const previewWrapper = this.closest(".product-3d-model__preview");
            const videoContainer = previewWrapper?.querySelector(".product-video_main");
            const videoContainer1 = previewWrapper?.querySelector(".product_media_previews");

            if (videoContainer) {
            if (videoContainer1) {
                videoContainer1.classList.add("d-none");
            }

            document.querySelectorAll(".product-video_main")
                .forEach(el => el.classList.remove("active"));
            videoContainer.classList.add("active");
            var iframeEle = videoContainer.querySelector('iframe');


            // this.removeAttribute("tabindex");
            // this.setAttribute("tabindex", "0");
            this.classList.add("active");


            const video = videoContainer.querySelector("video");
            videoContainer.classList.add("active");
            if (video) {
                video.classList.remove('d-none');
                video.play();
                video.removeAttribute("tabindex");
                // video.setAttribute("tabindex","-1");
                 videoContainer.classList.remove("active");
            }
        videoContainer.classList.remove('d-none');
        const iframe = videoContainer.querySelector("iframe");

        if (iframe) {
             document.querySelectorAll(".product-video_main video").forEach(otherVideo => {
                if (!otherVideo.paused) {
                    otherVideo.pause();
                }
             });
            document.querySelectorAll(".product-video_main iframe").forEach(otherIframe => {
                if (otherIframe !== iframe) {
                    try {
                        // YouTube command
                        otherIframe.contentWindow.postMessage(
                            '{"event":"command","func":"pauseVideo","args":""}',
                            '*'
                        );
                        //   Vimeo command
                        otherIframe.contentWindow.postMessage(
                            '{"method":"pause"}',
                            '*'
                        );
                    } catch(e) {
                    }
                }
            });
             iframe.removeAttribute("tabindex");
            iframe.onload = function() {
                setTimeout(() => {
                    const src = iframe.src;

                    if (src.includes('youtube.com') || src.includes('youtu.be')) {
                        // YouTube
                        iframe.contentWindow.postMessage(
                            '{"event":"command","func":"playVideo","args":""}',
                            '*'
                        );
                    } else if (src.includes('vimeo.com')) {
                        // Vimeo - use different command format
                        iframe.contentWindow.postMessage(
                            JSON.stringify({ method: 'play' }),
                            '*'
                        );
                    }
                }, 50);
            };
        }
            }
        });
        });
          var iframes = document.querySelectorAll("main-product .video-tab-js");

          iframes.forEach(function (iframe) {
            iframe.setAttribute("tabindex", "-1");
          });
           const videos = document.querySelectorAll("main-product video");
                videos.forEach((video, index) => {
                video.setAttribute("tabindex", "-1");
            });
           document.addEventListener("keydown", function (event) {

            if (event.key === "Enter" || event.keyCode === 13) {
                if (event.target.closest(".product_media_preview")) {
                event.preventDefault();
                event.target.click();
                }
            }
            });
}



function initializeOptionItems() {
    document.querySelectorAll('.option-item').forEach(item => {
        item.removeEventListener('click', handleOptionClick);
          item.removeEventListener('keydown', handleOptionKeyNavigation);
        item.addEventListener('click', handleOptionClick);
          item.addEventListener('keydown', handleOptionKeyNavigation);
        item.setAttribute('role', 'option');
        const isSelected = item.classList.contains('highlighted');
        item.setAttribute('aria-selected', isSelected);
    });

    document.querySelectorAll('.variant-selection, .variant-select').forEach(select => {
        select.removeEventListener('change', handleDropdownChange);
        select.addEventListener('change', handleDropdownChange);
    });

    addCustomizerBackupListeners();

}

function addCustomizerBackupListeners() {
    document.removeEventListener('click', customizerOptionClickHandler);
    document.removeEventListener('change', customizerDropdownChangeHandler);
    document.addEventListener('click', customizerOptionClickHandler);
    document.addEventListener('change', customizerDropdownChangeHandler);
      document.addEventListener('shopify:section:load', handleCustomizerSectionLoad);
       document.addEventListener('shopify:section:load', updateStackToMobileSwiper); //new
    document.addEventListener('shopify:section:select', handleCustomizerSectionSelect);
}
function handleCustomizerSectionLoad(event) {
    setTimeout(() => {
        initializeOptionItems();
        tabControlVideo();
        setupQuantityListeners();
        handlePickupAvailability();
        productMainSubmit(); commonVideoControls();
        complementarySlider();
        // initLightbox();
        window.MyTheme.initLightbox('.product__media-list');
        giftcardHandle();
        initializeAllProductSections();
    }, 500);
}

function handleCustomizerSectionSelect(event) {
    setTimeout(() => {
          initializeAllProductSections();
    }, 300);
}

function customizerOptionClickHandler(event) {
    const optionItem = event.target.closest('.option-item');
    if (!optionItem) return;
    if (event.handledByCustomizer) return;
    event.handledByCustomizer = true;
    handleOptionClick({ currentTarget: optionItem });
}

function customizerDropdownChangeHandler(event) {
    const select = event.target.closest('.variant-selection, .variant-select');
    if (!select) return;

    if (event.handledByCustomizer) return;
    event.handledByCustomizer = true;

    handleDropdownChange({ target: select });
}

async function handleDropdownChange(event) {
    if (isProcessing) {
        return;
    }

    isProcessing = true;

    try {
        const select = event.target;
        const selectedOption = select.options[select.selectedIndex];
        const selectedValue = selectedOption ? selectedOption.text.trim() : null;
        await getVariantJSON(select);

    } catch (error) {
    } finally {
        isProcessing = false;
    }
}
function handleOptionKeyNavigation(e) {
    // Get the current option item and its parent ul
    const currentItem = e.currentTarget;
    const parentList = currentItem.closest('ul');

    // Get all option items within the same ul only
    const items = Array.from(parentList.querySelectorAll('.option-item'));
    const currentIndex = items.indexOf(currentItem);
    //checked
    switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            navigateToOptionItem(items, currentIndex, -1);
            break;

        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            navigateToOptionItem(items, currentIndex, 1);
            break;

        case 'Home':
            e.preventDefault();
            if (items.length > 0) {
                focusAndSelectOption(items[0]);
            }
            break;

        case 'End':
            e.preventDefault();
            if (items.length > 0) {
                focusAndSelectOption(items[items.length - 1]);
            }
            break;

        case 'Enter':
        case ' ':
            e.preventDefault();
            currentItem.click();
            break;
    }
}

function navigateToOptionItem(items, currentIndex, direction) {
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
        newIndex = items.length - 1;
    } else if (newIndex >= items.length) {
        newIndex = 0;
    }

    if (items[newIndex]) {
        focusAndSelectOption(items[newIndex]);
    }
}
function focusAndSelectOption(optionItem) {
    optionItem.focus();
    if (!optionItem.classList.contains('highlighted')) {
        optionItem.click();
    }
}
initializeOptionItems();
tabControlVideo();

// setupModalVariantHandlers(quickviewModal, modalSectionId);



let isProcessing = false;

async function handleOptionClick(event) {


    if (isProcessing) {
        return;
    }

    isProcessing = true;

    const optionItem = event.currentTarget;

    try {
        const parentUl = optionItem.closest(".variant-options");
        if (parentUl) {
            parentUl.querySelectorAll(".option-item").forEach((item) => {
                item.classList.remove("highlighted");
            });
        }

        optionItem.classList.add("highlighted");

        await getVariantJSON(optionItem);

    } catch (error) {
    } finally {
        isProcessing = false;
    }
}


async function getVariantJSON(clickedElement) {
  let options = []; 
  let sectionEl = clickedElement.closest('main-product') ||
                  clickedElement.closest('.main-product') ||
                  clickedElement.closest('.feature-product') ||
                  clickedElement.closest('[data-section-id]');

  if (!sectionEl) {
    return null;
  }

  const sectionId = sectionEl.dataset.sectionId || sectionEl.dataset.sectionid;

  if (clickedElement.tagName === 'SELECT') {
    options = Array.from(sectionEl.querySelectorAll('select'), (select) => {
      const selectedOption = select.options[select.selectedIndex];
      return selectedOption ? selectedOption.value : null;
    });
  } else {
    options = Array.from(
      sectionEl.querySelectorAll('.variants_container .variant-options'),
      (ul) => {
        const selected = ul.querySelector('.highlighted');
        return selected ? selected.getAttribute('data-value') : null;
      },
    );
  }

  if (options.includes(null)) {
    currentVariant = null;
    return null;
  }

  const modal = clickedElement.closest('.modal');
  const clickedEleParent = clickedElement.closest('.feature-product');
  const modalProduct = clickedElement.closest('main-product.quickview-product');
  const isModal = !!modal || !!modalProduct;

  let modalSectionId = null;
  if (isModal) {
    modalSectionId =
      modalProduct?.dataset.modalSectionId ||
      modal?.querySelector('main-product.quickview-product')?.dataset
        .modalSectionId ||
      document.querySelector('main-product')?.dataset.sectionid;
  }

  let clickedEleParentID = '';
  if (clickedEleParent) {
    clickedEleParentID =
      clickedEleParent.id || document.querySelector('.feature-product')?.id;
  }

  const optionValues = options.map(encodeURIComponent).join(',');
  const params = optionValues ? `&option_values=${optionValues}` : '';
  const url = `${sectionEl.dataset.url}?section_id=${sectionId}${params}`;

  const response = await fetch(url);
  const responseText = await response.text();
  const html = new DOMParser().parseFromString(responseText, 'text/html');

  const newElementBlock =
    html.querySelector(`main-product[data-section-id="${sectionId}"]`) ||
    html.querySelector(`.main-product[data-section-id="${sectionId}"]`) ||
    html.querySelector('main-product .main-product');

  if (!newElementBlock) {
    return options;
  }

  if (sectionEl) {
    const newMainBlock = html.querySelector('.product__media');
    let selectedSectionId = null;

    if (newMainBlock) {
      const selectedVariantId = newMainBlock.dataset.variantid;
      selectedSectionId = newMainBlock.dataset.section;
      const selectedGalleryId = newMainBlock.dataset.mainGalleryId;
      const variantImageId = newMainBlock.dataset.selectedimageid;

      const targetSectionId = isModal ? modalSectionId : selectedSectionId;

      if (!isModal && !clickedEleParentID) {
        updateVariantInUrl(selectedVariantId);
      }
    }

    const isDropdown = !!sectionEl.querySelector('.variant-selection');

    let product__details = sectionEl.querySelector(
      '.product__details, .product_details',
    );
    const newProDetailBlock = html.querySelector(
      '.product__details, .product_details',
    ); 
    if (isDropdown) {
      const focusedElement = sectionEl.querySelector('select:focus');

      if (focusedElement) {
        const value = focusedElement.value;
        const selectName = focusedElement.getAttribute('name');
        const selectId = focusedElement.id;

        if (focusedElement.tagName === 'SELECT') {
          Array.from(focusedElement.options).forEach((option) => {
            option.removeAttribute('selected');
          });
          const selectedOption =
            focusedElement.options[focusedElement.selectedIndex];
          if (selectedOption) {
            selectedOption.setAttribute('selected', 'selected');
          }
        } else if (focusedElement.tagName === 'OPTION') {
          const parentSelect = focusedElement.closest('select');
          if (parentSelect) {
            Array.from(parentSelect.options).forEach((option) => {
              option.removeAttribute('selected');
            });
            focusedElement.setAttribute('selected', 'selected');
            parentSelect.value = focusedElement.value;
          }
        }

        let newRoot = null;

        if (newElementBlock.getAttribute('data-variantid') === '') {
          if (product__details && newProDetailBlock) {
            product__details.replaceWith(newProDetailBlock);
            newRoot = newProDetailBlock;
          }
        } else {
          sectionEl.replaceWith(newElementBlock);
          newRoot = newElementBlock; 
          sectionEl = newElementBlock;
        }

        if (newRoot) {
          let newSelect = null;

          if (selectName) {
            newSelect = newRoot.querySelector(
              `select[name="${CSS.escape(selectName)}"]`,
            );
          }

          if (!newSelect && selectId) {
            newSelect = newRoot.querySelector(
              `select#${CSS.escape(selectId)}"]`,
            );
          }

          if (newSelect) {
            if (value != null) {
              newSelect.value = value;
            }

            Array.from(newSelect.options).forEach((option) => {
              option.selected = option.value === value;
            });

            newSelect.focus();
          }
        }
      } else {
        if (newElementBlock.getAttribute('data-variantid') === '') {
          if (product__details && newProDetailBlock) {
            product__details.replaceWith(newProDetailBlock);
          }
        } else {
          sectionEl.replaceWith(newElementBlock);
          sectionEl = newElementBlock;
        }
      }
    } else { 
      const modalRoot = document.querySelector('.quickview-modal');
      const drawerRoot = document.querySelector('.quickview-drawer');

      const focusedElement =
        clickedElement.closest('.option-item') || document.activeElement;

      let value = null;
      let optionValue = null;

      if (
        focusedElement &&
        (
          sectionEl.contains(focusedElement) ||
          modalRoot?.contains(focusedElement) ||
          drawerRoot?.contains(focusedElement)
        )
      ) {
        value = focusedElement.getAttribute('data-value');
        optionValue = focusedElement.getAttribute('data-option-value');
      }

      if (product__details && newProDetailBlock) {
        const mappings = [
          { current: '.price_block',        next: '.price_block' },
          { current: '.variants_container', next: '.variants_container' },
          { current: '.buy_btns_grp',       next: '.buy_btns_grp' },
          { current: '.product-stock',      next: '.product-stock' },
          { current: 'div#product-sku',     next: 'div#product-sku' },
        ];

        mappings.forEach(({ current, next }) => {
          const currentEl = product__details.querySelector(current);
          const nextEl = newProDetailBlock.querySelector(next);

          if (currentEl && nextEl) {
            currentEl.replaceWith(nextEl);
          }
        });
      }

      // SWIPER BLOCK START
      const swiperElOld = sectionEl.querySelector('.product__media');
      const swiperElNew = html.querySelector('.product__media');

      if (swiperElOld && swiperElNew) {
        const variantNewCompare = swiperElNew.dataset?.variantid || 0;
        const productMediaList = swiperElNew.querySelector('.product__media-list');
        const proVariantId =
          productMediaList?.closest('.product__media')?.dataset?.variantid || 0;

        if (variantNewCompare !== 0) {
          const quickviewParent = swiperElOld.closest(
            '.quickview-modal, .modal, .quickview, [data-quickview], .quickview-drawer, .feature-product',
          );
          const isInQuickview = quickviewParent !== null;
          const galleryLayoutAlt = swiperElOld.getAttribute('data-gallerylayout');

          swiperElOld.replaceWith(swiperElNew);

          requestAnimationFrame(() => {
            const mobileStackModal =
              swiperElNew.querySelector('.stack-layout') ||
              swiperElNew.querySelector('.thumbnail-bottom') ||
              swiperElNew.querySelector('.feature-product');

            if (!mobileStackModal) {
              return;
            }

            const quickviewDrawerContent =
              newElementBlock.querySelector('.quickview-drawer-content') ||
              document.querySelector('.quickview-drawer-content') ||
              document.querySelector('.quickview_modal');

            if (!quickviewDrawerContent) {
              return;
            }

            if (!isInQuickview) { 
              initializeProductSwipers(selectedSectionId, 'thumbnail_bottom');
            }
          });
        }
      }
      // SWIPER BLOCK END 
      const runAfterInit = () => { 
        initializeOptionItems();
        tabControlVideo();
        setupQuantityListeners();
        handlePickupAvailability();
        productMainSubmit();
        commonVideoControls();
        disableModelViewerTabbingInStackLayout();
        window.MyTheme.initLightbox('.product__media-list');
        giftcardHandle();
        initializeAllProductSections();

        requestAnimationFrame(() => {
          if (!value && !optionValue) {
            return;
          }

          const updatedDetailsRoot =
            sectionEl.querySelector('.product__details, .product_details') ||
            sectionEl;

          let newFocusElement = null;

          if (value) {
            newFocusElement = updatedDetailsRoot.querySelector(
              `[data-value="${CSS.escape(value)}"]`,
            );
          }

          if (!newFocusElement && optionValue) {
            newFocusElement = updatedDetailsRoot.querySelector(
              `[data-option-value="${CSS.escape(optionValue)}"]`,
            );
          }

          if (!newFocusElement) {
            console.warn('No new focus element found after update', {
              value,
              optionValue,
              isModal,
            });
            return;
          }

          const parentUl = newFocusElement.closest('.variant-options');
          if (parentUl) {
            parentUl.querySelectorAll('.option-item').forEach((item) => {
              item.classList.remove('highlighted');
              item.setAttribute('aria-checked', 'false');
              item.setAttribute('aria-selected', 'false');
              item.setAttribute('tabindex', '-1');
            });
          }

          newFocusElement.classList.add('highlighted');
          newFocusElement.setAttribute('aria-checked', 'true');
          newFocusElement.setAttribute('aria-selected', 'true');
          newFocusElement.setAttribute('tabindex', '0');

          try {
            newFocusElement.focus({ preventScroll: true });
          } catch (e) {
            newFocusElement.focus();
          }
        });
      };

      if (isModal) { 
        setTimeout(runAfterInit, 50);
      } else { 
        setTimeout(runAfterInit, 120);
      }
    }
  }

  return options;
}



 function disableModelViewerTabbingInStackLayout() {
  document.querySelectorAll('[data-gallerylayout]').forEach(function (container) {
    const modelViewers = container.querySelectorAll('model-viewer');
    modelViewers.forEach(function (mv) {
      mv.tabIndex = -1;
    });
  });
}
disableModelViewerTabbingInStackLayout();

function complementarySlider() {
   var currency = window.routes.currency_symbol;

  /* Format Money */
      var getLocale = () => {
        var lang =
          (window.Shopify && Shopify.language) ||
          (window.Shopify && Shopify.locale) ||
          (typeof navigator !== 'undefined' && navigator.language.split('-')[0]) || 'en';
            var country =
                (window.Shopify && Shopify.country) || '';

              return country ? `${lang}-${country}` : lang;
      };
      var formatPrice = (price) => {
        var value = price / 100;

        var currency =
          (window.Shopify && Shopify.currency && Shopify.currency.active) ||
          'USD';

        var locale = getLocale();

        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          currencyDisplay: 'symbol'
        }).format(value);
      };

  $(".complementary-products").each(function() {
      const $this = $(this);
      const productId = $this.data("product-id");
      const productUrl = $this.data("product-url");
      const sectionId = $this.closest('.complementary-container').data('section-id');
      const cardStyleCard     = $this.closest('.complementary-container').data('card-style-card');
      const cardStyleStandard = $this.closest('.complementary-container').data('card-style-standard');
      const cardBodyAlign     = $this.closest('.complementary-container').data('card-body-align');
      const priceAlign        = $this.closest('.complementary-container').data('price-align');
      const settingColor        = $this.closest('.complementary-container').data('setting-color');



       $.ajax({
          url: productUrl,
          method: "GET",
          dataType: "json",
          success: function(data) {
              $this.empty();

              if (data.products && data.products.length > 0) {
                  $('.complementary-container').removeClass('d-none');
                 $('.complementary-heading').removeClass('d-none');
                 $('.complementary-container').removeClass('d-none');  $('.main-comlementary').removeClass('d-none');
                  $.each(data.products, function(index, product) {
                      var imageSrc = product.featured_image;
                      var imageWidth = product.featured_image && product.featured_image.width ? product.featured_image.width : '';
                      var imageHeight = product.featured_image && product.featured_image.height ? product.featured_image.height : '';
                      if (product.media && product.media.length > 0) {
                        var firstMedia = product.media[0];
                        if (
                          firstMedia.media_type === 'external_video' &&
                          firstMedia.preview_image &&
                          firstMedia.preview_image.src
                        ) {
                          imageSrc = firstMedia.preview_image.src;
                          imageWidth = firstMedia.preview_image.width || imageWidth;
                          imageHeight = firstMedia.preview_image.height || imageHeight;
                        }
                      }

                      let priceText = ` ${currency}`;
                      let priceElement = `${formatPrice(product.price)}` + " " + `${window.routes.cart_currency}`;

                      if (product.compare_at_price > product.price) {
                          priceElement = `

                                  <span class="sale_price">${formatPrice(product.price)}` + " " + `${window.routes.cart_currency}</span>
                                  <span class="compare_price text-decoration-line-through">${formatPrice(product.compare_at_price)}`  + " " + `${window.routes.cart_currency}</span>
                          `;
                      }
                       let  imageHtml;
                      if(imageSrc){ imageHtml = `
                          <img
                            src="${imageSrc}"
                            srcset="
                              ${imageSrc} 320w,
                              ${imageSrc} 540w,
                              ${imageSrc} 720w,
                              ${imageSrc} 960w,
                              ${imageSrc} 1280w
                            "
                            sizes="(min-width: 1200px) 600px,
                              (min-width: 992px) calc((100vw - 130px) / 3),
                              (min-width: 768px) calc((100vw - 120px) / 2),
                              calc((100vw - 35px) / 2)"
                            width="${imageWidth}"
                            height="${imageHeight}"
                            alt="${product.title}"
                            class="img-fluid"
                            loading="lazy"
                          >
                        `; }
                      else {  imageHtml = window.complementaryPlaceholderSvg || ''; }


                      const productElement = `
                          <div class="swiper-slide">
                              <div class="card Product_container color-${settingColor}  ${cardStyleCard}">
                                  <div class="card_image card flex-row overflow-hidden${cardStyleStandard}">
                                      <a href="${product.url}" class="complemetary-image card-img" aria-label="${product.title}">
                                           ${imageHtml}
                                      </a>
                                  </div>
                                  <div class="card-body d-flex flex-column justify-content-evenly ${cardBodyAlign}">
                                      <div>
                                          <h3 class="product_title h6">
                                              <a href="${product.url}" class="text-decoration-none" aria-label="${product.title}">${product.title}</a>
                                          </h3>
                                          <span class="sale_pricecomplementory">
                                           <div class="d-flex flex-wrap justify-content-start column-gap-3 m-0 ${priceAlign}">${priceElement} </div></span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      `;
                      $this.append(productElement);
                  });


                  const swiperSelector = `.complementary-${sectionId} .main-comlementary`;
                  if(swiperSelector){
                    if (window.complementarySwiper) {
                    //    window.complementarySwiper.destroy(true, true);
                        window.complementarySwiper = null;
                    }
                  }

                  requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        const swiperEl = document.querySelector(swiperSelector);
                        if (swiperEl && swiperEl.swiper) {
                            swiperEl.swiper.destroy(true, true);
                        }
                        if (window.complementarySwiper) {
                            window.complementarySwiper.destroy(true, true);
                            window.complementarySwiper = null;
                        }

                        window.complementarySwiper = new Swiper(swiperSelector, {
                            loop: false,
                            slidesPerView: 2,
                            spaceBetween: 60,
                            initialSlide: 0,
                            observer: false,
                            autoplay: { 
                                delay: 3000,
                            },
                            observeParents: false,
                            resizeObserver: false,
                            updateOnWindowResize: true,
                            navigation: {
                                nextEl: ".nextcomplementary-icon",
                                prevEl: ".prevcomplementary-icon",
                            },
                            breakpoints: {
                                0: {
                                  slidesPerView: 1,
                                  spaceBetween: 60 * 0.5,
                                },
                                576: {
                                  slidesPerView: 2,
                                  spaceBetween: 60 * 0.5,
                                },
                                992: {
                                  slidesPerView: 2,
                                  spaceBetween: 60 * 0.7,
                                },
                                992: {
                                  slidesPerView: 2,
                                  spaceBetween: 60 * 0.8,
                                },
                            }
                        });
                    });
                });

              } else {
                  $('.complementary-container').hide();
              }

            if ( data.products.length == 1) {
              $('.complementary-nav').addClass('d-none');$('.complementary-heading').addClass('d-none');$('.complementary-container').addClass('d-none');
            } else {
                   $('.complementary-nav').removeClass('d-none');
                     $('.complementary-heading').removeClass('d-none');
                     $('.complementary-container').removeClass('d-none');  $('.main-comlementary').removeClass('d-none');
            }
          },
          error: function(xhr, status, error) {

          }
      });
  });
}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', complementarySlider);
  } else {
    complementarySlider();
  }


    function reinitializeProductSections() {
        setTimeout(() => {
            initializeAllProductSections();
        }, 500);
    }
window.initializeProductSwipers = initializeProductSwipers;
// window.imageSlide = imageSlide;
window.productSwipers = window.productSwipers || {};
window.thumbSwipers = window.thumbSwipers || {};
if (newBlock && newBlock.dataset) {
window.gallerylayout = newBlock.dataset.gallerylayout || {};
} else { window.gallerylayout ='' }


/* Stacked Mobile swiper */

updateStackToMobileSwiper();
function updateStackToMobileSwiper() {
  const mainProducts = document.querySelectorAll('main-product');

  mainProducts.forEach((product) => {
    const baseLayout = product.getAttribute('data-gallerylayout'); // "stack", "thumbnail_bottom"
    if (!baseLayout) return;

    const sectionId = product.dataset.sectionId || product.dataset.sectionid;
    if (!sectionId) return;


    if (baseLayout === 'stack' || baseLayout === 'thumbnail_bottom') {

      initializeProductSwipers(sectionId, baseLayout);
    }
  });

}


// debounce and resize handlers

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

let currentWindowWidth = window.innerWidth;



document.addEventListener('DOMContentLoaded', function () {
  const mainProducts = document.querySelectorAll('main-product');
  let hasRelevantLayout = false;

  mainProducts.forEach((product) => {
    const gallerylayout = product.getAttribute('data-gallerylayout');
    if (gallerylayout === 'stack' || gallerylayout === 'thumbnail_bottom') {
      hasRelevantLayout = true;
    }
  });

  if (hasRelevantLayout) {
    updateStackToMobileSwiper();
  }
});

window.addEventListener('resize', debounce(handleResize, 250));


function handleResize() {
  const newWidth = window.innerWidth;
  const wasMobile = currentWindowWidth < 992;
  const isMobile = newWidth < 992;

  if (wasMobile !== isMobile) {

    updateStackToMobileSwiper();
  }
  currentWindowWidth = newWidth;
}

// Initial setup
document.addEventListener('DOMContentLoaded', function () {
  const mainProducts = document.querySelectorAll('main-product');
  let hasStackLayout = false;

  mainProducts.forEach((product) => {
    const gallerylayout = product.getAttribute('data-gallerylayout');
    if (gallerylayout === 'stack') {
      hasStackLayout = true;
    }
  });

  if (hasStackLayout) {
    updateStackToMobileSwiper();
  }
});

// window.addEventListener('resize', debounce(handleResize, 250));





/* Stacked Mobile swiper */
 
    function initializeAllProductSections() {
        const productGalleries = document.querySelectorAll('.product__media');

        productGalleries.forEach((gallery, index) => {
            const sectionId = gallery.dataset.section;
            const galleryType = gallery.dataset.mainGalleryId ? 'carousel' : 'stacked';
            const current_var = gallery.querySelector('.swiper-wrapper')?.dataset.gallery || gallery.querySelector('.stack-layout')?.dataset.gallery || 'thumbnail_bottom';
             const quickviewParent = gallery.closest('.quickview-modal, .modal, .quickview, [data-quickview], .quickview-drawer, .feature-product.product__media-list.swiper-wrapper');
             initializeProductSwipers(sectionId, current_var);

        });
    }



function stopVideosInPreviousSlide(swiper) {
    const previousSlide = swiper.slides[swiper.previousIndex];

    if (previousSlide) {
        const videos = previousSlide.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.setAttribute("tabindex","-1");
        });


        const iframes = previousSlide.querySelectorAll('iframe');

        iframes.forEach(iframe => {
            const iframeSrc = iframe.src;
            iframe.setAttribute("tabindex", "-1");
            const parent = iframe.closest(".product_media_preview");

            if (parent) {
                // parent.classList.remove("active");
                parent.removeAttribute("tabindex");
            }

            if (iframeSrc.includes('youtube.com/embed') || iframeSrc.includes('youtu.be')) {
                iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }

            if (iframeSrc.includes('player.vimeo.com')) {
                iframe.contentWindow?.postMessage('{"method":"pause"}', '*');
            }

        });

        const mediaElements = previousSlide.querySelectorAll('video, audio');
        mediaElements.forEach(media => {
            media.pause();
        });
    }
    swiper.slides.forEach((slide, index) => {
        if (index !== swiper.activeIndex) {
            const videos = slide.querySelectorAll('video');
            videos.forEach(video => {
                video.pause();
               video.setAttribute("tabindex","-1");
            });
        }
    });

}
// STACK VIDEO CONTROL
function commonVideoControls(){
    const videos = document.querySelectorAll('video:not(.js-skip-common-video)');
    const iframes = document.querySelectorAll('iframe');

    if (!videos.length && !iframes.length) return;

    function pauseNativeVideo(video) {
        if (!video || video.paused) return;
        video.pause();
    }

    function postMessageToIframe(iframe, message) {
        if (!iframe || !iframe.contentWindow) return;
        iframe.contentWindow.postMessage(JSON.stringify(message), '*');
    }

    function pauseYouTube(iframe) {
        postMessageToIframe(iframe, {
            event: 'command',
            func: 'pauseVideo',
            args: []
        });
    }

    function pauseVimeo(iframe) {
        postMessageToIframe(iframe, {
            method: 'pause'
        });
        setTimeout(() => {
            postMessageToIframe(iframe, {
                method: 'pause'
            });
        }, 50);
    }

    function isYouTubeIframe(iframe) {
        if (!iframe || !iframe.src) return false;
        return /youtube.com|youtu.be/.test(iframe.src);
    }

    function isVimeoIframe(iframe) {
        if (!iframe || !iframe.src) return false;
        return /vimeo.com/.test(iframe.src);
    }

    function pauseMediaElement(el) {
        if (!el) return;
        if (el.tagName === 'VIDEO') {
            pauseNativeVideo(el);
            return;
        }
        if (el.tagName === 'IFRAME') {
            if (isYouTubeIframe(el)) {
                pauseYouTube(el);
                return;
            }
            if (isVimeoIframe(el)) {
                pauseVimeo(el);
                return;
            }
        }
    }

    function pauseAllOthers(target) {
        videos.forEach(function (video) {
            if (video !== target && !video.paused) {
                pauseNativeVideo(video);
            }
        });

        iframes.forEach(function (iframe) {
            if (iframe !== target) {
                if (isYouTubeIframe(iframe)) {
                    pauseYouTube(iframe);
                }
                if (isVimeoIframe(iframe)) {
                    pauseVimeo(iframe);
                }
            }
        });
    }

    function handlePlayEvent(event) {
        var target = event.currentTarget;
        pauseAllOthers(target);
    }

    videos.forEach(function (video) {
        video.addEventListener('play', handlePlayEvent);
        video.addEventListener('click', handlePlayEvent);
    });

    iframes.forEach(function (iframe) {
        if (iframe.src) {
            iframe.addEventListener('load', function () {
                iframe.addEventListener('click', handlePlayEvent);
            });
            if (iframe.contentWindow) {
                iframe.addEventListener('click', handlePlayEvent);
            }
        }
    });


    function videoPlusIconControls() {
        const productModels = document.querySelectorAll('.stack-layout product-model');

        if(productModels.length > 0) {
            productModels.forEach((model) => {
            model.addEventListener('click', () => {
               // pauseAll();
            });
            });
        }
    }
    videoPlusIconControls();

    function pauseAllMedia() {
        videos.forEach(function (video) {
            if (!video.paused) {
                pauseNativeVideo(video);
            }
        });

        iframes.forEach(function (iframe) {
            if (isYouTubeIframe(iframe)) {
                pauseYouTube(iframe);
            }
            if (isVimeoIframe(iframe)) {
                pauseVimeo(iframe);
            }
        });
    }

    window.pauseAllMedia = pauseAllMedia;

     document.querySelectorAll(".product_media_preview .svg-wrapper-icon")
        .forEach(icon => {
            icon.addEventListener("click", function () {
                pauseAllMedia();
            });
        });

}
commonVideoControls();


window.productSwipers = window.productSwipers || {};
window.thumbSwipers = window.thumbSwipers || {};

function computeCurrentVar(sectionId, baseCurrentVar) {
  const wrapper = document.querySelector(`#swiper-wrapper-${sectionId}`) ||  document.querySelector(`.swiper-wrapper`);
  if (!wrapper) {

    return baseCurrentVar;
  }


  const galleryLayout = wrapper.dataset.gallery;
  const galleryLayoutMobile = wrapper.dataset.galleryMobile;
  const isMobile = window.innerWidth < 992;

  let current_var = baseCurrentVar || galleryLayout;
if( galleryLayout != 'thumbnail_left'){
  if ( (isMobile && galleryLayoutMobile === 'thumbnail-bottom') ) {
    current_var = 'thumbnail_bottom';
  }
}



  return { current_var, wrapper, isMobile };
}

function applyWrapperClasses(sectionId, current_var) {
  const wrapper = document.querySelector(`#swiper-wrapper-${sectionId}`);
  if (!wrapper) return;


  if (current_var === 'thumbnail_bottom' || current_var === 'thumbnail_left') {
    wrapper.classList.remove('stack-layout');
    const quickviewParent = wrapper.closest('.quickview-modal, .modal, .quickview, [data-quickview], .quickview-drawer, .feature-product')  ;
    const isInQuickview = quickviewParent !== null;
    if(!isInQuickview) { wrapper.classList.add('swiper-wrapper'); }
  } else if (current_var === 'stack') {
    wrapper.classList.add('stack-layout');
    wrapper.classList.remove('swiper-wrapper');
  }
}

function destroyProductSwipers(sectionId) {
  if (window.productSwipers[sectionId]) {
    window.productSwipers[sectionId].destroy(true, true);
    delete window.productSwipers[sectionId];
  }
  if (window.thumbSwipers[sectionId]) {
    window.thumbSwipers[sectionId].destroy(true, true);
    delete window.thumbSwipers[sectionId];
  }
}
function initializeProductSwipers(sectionId, baseCurrentVar) {
  if (!sectionId || !baseCurrentVar) return;

  const { current_var, wrapper, isMobile } = computeCurrentVar(sectionId, baseCurrentVar);


  if (!current_var) return;


  if (isMobile && current_var === 'thumbnail_bottom' && wrapper) {
    if (wrapper.classList.contains('feature-product')) {
      wrapper.classList.add('swiper-wrapper');
    }
    wrapper.classList.add('mobile-load-default');
  }

  destroyProductSwipers(sectionId);
  applyWrapperClasses(sectionId, current_var);

  // Desktop stack to mobile 'thumbnail_bottom'
  if (current_var === 'stack') {

    return;
  }
 const drawerContainer = document.querySelector(`#quickview-drawer-${sectionId}`) ||
                        document.querySelector('.quickview-drawer.show') ||
                        document.querySelector('.quickview-drawer');

const modalContainer = document.querySelector(`#video-modal-${sectionId}`) ||
                       document.querySelector('.quickview_modal.show') ||
                       document.querySelector('.quickview_modal');

const scope = drawerContainer || modalContainer || document;

const mainElement = scope.querySelector(`.my-carousel-${sectionId}`) ||
                    scope.querySelector('[class*="my-carousel-"]') ||
                    scope.querySelector('.main_carousel');
  // Helper function to initialize swipers
  const initializeSwipers = (thumbSwiper) => {
    // const mainElement = document.querySelector(`.main-product .my-carousel-${sectionId}`) ||
    //                    document.querySelector(`.quickview_modal .main-product .main_carousel`) ||
    //                    document.querySelector(`.quickview-drawer .main-product .main_carousel`);



     if (!mainElement || !(mainElement instanceof Element)) return;


    const mainSwiper = new Swiper(mainElement, {
      loop: false,
      slidesPerView: 1,
      spaceBetween: 10,
      autoHeight: true,
      navigation: {
        nextEl: mainElement.querySelector(`.product-next-${sectionId}`) || mainElement.querySelector('.swiper-next'),
        prevEl: mainElement.querySelector(`.product-prev-${sectionId}`) || mainElement.querySelector('.swiper-prev'),
      },
      thumbs: {
        swiper: thumbSwiper,
        slidesPerView: 4,
      },
      allowTouchMove: false,
      simulateTouch: false,
      grabCursor: false,
      keyboard: {
        enabled: false,
        onlyInViewport: false,
      },
      on: {
        init: function () {
          if (wrapper) wrapper.classList.remove('mobile-load-default');
          window.productSwipers[sectionId] = this;
          mainElement.swiper = this;

          this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'button');
            slide.setAttribute('aria-label', `Product image ${index + 1}`);
            slide.setAttribute('data-slide-index', index);

            slide.addEventListener('focus', function () {
              const slideIndex = parseInt(this.getAttribute('data-slide-index'));
              if (thumbSwiper && !isNaN(slideIndex)) {
                thumbSwiper.slideTo(slideIndex);
              }
            });
          });
        },
        imagesReady: function () {
          if (wrapper) wrapper.classList.remove('mobile-load-default');
        },
        slideChange: function () {
          stopVideosInPreviousSlide(this);

          if (thumbSwiper) {
            const activeIndex = this.activeIndex;
            thumbSwiper.slideTo(activeIndex);

            this.slides.forEach((slide, index) => {
              const isActive = index === activeIndex;
              slide.setAttribute('tabindex', isActive ? '0' : '-1');
              slide.querySelector('video')?.setAttribute('tabindex', isActive ? '0' : '-1');
              slide.querySelectorAll('iframe').forEach((iframe) => {
                iframe.setAttribute('tabindex', isActive ? '0' : '-1');
              });
              slide
                .querySelectorAll('.product-3d-model__preview, .product-3d-modal')
                .forEach((modal) => {
                  modal.setAttribute('tabindex', isActive ? '0' : '-1');
                });
            });
          }
        },
        slideChangeTransitionEnd: function () {
          stopVideosInPreviousSlide(this);
        },
      },
    });

    if (thumbSwiper) {
      thumbSwiper.slides.forEach((thumbSlide, index) => {
        thumbSlide.setAttribute('tabindex', '0');
        thumbSlide.setAttribute('role', 'button');
        thumbSlide.setAttribute('aria-label', `Select product image ${index + 1}`);
        thumbSlide.setAttribute('data-thumb-index', index);

        thumbSlide.addEventListener('focus', function () {
          const thumbIndex = parseInt(this.getAttribute('data-thumb-index'));
          if (!isNaN(thumbIndex)) {
            thumbSwiper.slideTo(thumbIndex);
          }
        });

        thumbSlide.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const thumbIndex = parseInt(this.getAttribute('data-thumb-index'));
            if (!isNaN(thumbIndex)) {
              mainSwiper.slideTo(thumbIndex);
            }
          }
        });
      });
    }
  };

  // THUMBNAIL LEFT
  if (current_var === 'thumbnail_left') {
    const thumbSelector = `.mySwiper3-${sectionId}`;


    // Use Promise or callback to ensure thumb swiper is ready
    setTimeout(function() {
      // const thumbElement = document.querySelector(`.mySwiper3-${sectionId}`) ||
      //                     document.querySelector('.mySwiper3');

const thumbElement = scope.querySelector(`.mySwiper3-${sectionId}`) ||
                    scope.querySelector('[class*="mySwiper3-"]') ||
                    scope.querySelector('.mySwiper3');

      if (thumbElement) {

        const thumbSwiper = new Swiper(thumbElement, {
          loop: false,
          spaceBetween: 10,
          slidesPerView: 4,
          autoHeight: true,
          direction: 'vertical',
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
          slideToClickedSlide: true,
          grabCursor: false,
          autoHeight: true,
          breakpoints: {
            320: { slidesPerView: 3 },
            480: { slidesPerView: 4 },
          },
          on: {
            init: function() {

              setupThumbnailKeyboardNavigation(this, sectionId);
              window.thumbSwipers[sectionId] = this;

              initializeSwipers(this);
            }
          }
        });
      }
    }, 100);
  }

  // THUMBNAIL BOTTOM
  else if (current_var === 'thumbnail_bottom' || current_var === 'stack') {

 
    const thumbElement = scope.querySelector(`.mySwiper2-${sectionId}`) ||
    scope.querySelector('[class*="mySwiper2-"]') ||
    scope.querySelector('.mySwiper2');



    if (thumbElement) {
      const thumbSwiper = new Swiper(thumbElement, {
        loop: false,
        spaceBetween: 10,
        slidesPerView: 4,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        grabCursor: false,
        autoHeight: true,
        on: {
          init: function() {
            setupThumbnailKeyboardNavigation(this, sectionId);
            window.thumbSwipers[sectionId] = this;

            // Initialize main swiper after thumb is ready
            initializeSwipers(this);
          }
        }
      });

    }
  }
}



function setupProductGallery(sectionId, baseCurrentVar) {
  // Initial init
  initializeProductSwipers(sectionId, baseCurrentVar);

  // Debounced resize handler
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializeProductSwipers(sectionId, baseCurrentVar);
    }, 150);
  });
}


function setupThumbnailKeyboardNavigation(thumbSwiper, sectionId) {
    thumbSwiper.on('init', function() {
        const thumbSlides = thumbSwiper.slides;

        thumbSlides.forEach((slide, index) => {
            slide.setAttribute('tabindex', '0');
            slide.setAttribute('role', 'button');
            slide.setAttribute('aria-label', `View product image ${index + 1}`);
            slide.setAttribute('aria-describedby', `thumbnail-desc-${sectionId}-${index}`);

            slide.addEventListener('focus', function() {
                setTimeout(() => {
                    this.click();
                }, 10);
            });

            slide.addEventListener('keydown', function(event) {
                handleThumbnailKeydown(event, thumbSwiper, index, sectionId);
            });

            if (slide.classList.contains('swiper-slide-thumb-active')) {
                slide.setAttribute('aria-current', 'true');
            }
        });

        thumbSwiper.on('slideChange', function() {
            thumbSlides.forEach((slide, index) => {
                if (index === thumbSwiper.activeIndex) {
                    slide.setAttribute('aria-current', 'true');
                    slide.click();
                } else {
                    slide.removeAttribute('aria-current');
                }
            });
        });
    });
}

function handleThumbnailKeydown(event, thumbSwiper, currentIndex, sectionId) {
    const key = event.key;
    const totalSlides = thumbSwiper.slides.length;
    //checked
    switch(key) {
        case 'Enter':
        case ' ':
            event.preventDefault();
            thumbSwiper.slideTo(currentIndex);
            const mainSwiper = window.productSwipers[sectionId];
            if (mainSwiper) {
                mainSwiper.slideTo(currentIndex);
            }
            break;

        case 'ArrowRight':
        case 'ArrowDown':
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % totalSlides;
            thumbSwiper.slideTo(nextIndex);
            thumbSwiper.slides[nextIndex].focus();
            break;

        case 'ArrowLeft':
        case 'ArrowUp':
            event.preventDefault();
            const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            thumbSwiper.slideTo(prevIndex);
            thumbSwiper.slides[prevIndex].focus();
            break;

        case 'Home':
            event.preventDefault();
            thumbSwiper.slideTo(0);
            thumbSwiper.slides[0].focus();
            break;

        case 'End':
            event.preventDefault();
            thumbSwiper.slideTo(totalSlides - 1);
            thumbSwiper.slides[totalSlides - 1].focus();
            break;

        case 'Tab':

        default:
            break;
    }
}

    initializeAllProductSections();


/* swiper code end */



window.MyTheme = window.MyTheme || {};

window.MyTheme.initLightbox = function (selector = '.product__media-list') {
  if (typeof PhotoSwipeLightbox === 'undefined' || typeof PhotoSwipe === 'undefined') {
    return;
  }
  const gallery = document.querySelector(selector);
  if (!gallery) return;

  if (window.MyTheme.productLightbox &&
      typeof window.MyTheme.productLightbox.destroy === 'function') {
    window.MyTheme.productLightbox.destroy();
  }

  const lightbox = new PhotoSwipeLightbox({
    gallery: selector,
    children: 'a',
    pswpModule: PhotoSwipe
  });

  lightbox.init();
  window.MyTheme.productLightbox = lightbox;
};

// handlePickupAvailability();
function handlePickupAvailability() {
  const offcanvas = document.getElementById('pickupOffCanvas-pickup-availability');
  const showButton = document.querySelector('.ShowPickupDrawer');


  if (showButton && offcanvas) {
    if (showButton.tagName !== 'BUTTON') {
      showButton.setAttribute('role', 'button');
      showButton.setAttribute('tabindex', '0');
    }

    function openOffcanvas(e) {
      const isClick = e.type === 'click';
      const isEnter = e.type === 'keydown' && e.key === 'Enter';
      const isSpace = e.type === 'keydown' && e.key === ' ';

      if (isClick || isEnter || isSpace) {
        e.preventDefault();

        if (offcanvas.parentNode !== document.body) {
          document.body.appendChild(offcanvas);
        }

        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas) || new bootstrap.Offcanvas(offcanvas);
        bsOffcanvas.show();

        const backdrop = document.querySelector('.offcanvas-backdrop');
        if (backdrop && backdrop.parentNode && backdrop.parentNode !== document.body) {
          document.body.appendChild(backdrop);
        }
      }
    }

    showButton.addEventListener('click', openOffcanvas);
    showButton.addEventListener('keydown', openOffcanvas);

    offcanvas.addEventListener('hidden.bs.offcanvas', function() {
      setTimeout(() => {
        if (document.body.contains(showButton)) {
          showButton.focus();
        }
      }, 100);

      const pickupAvailability = document.querySelector('pickup-availability');
      if (pickupAvailability) {
        if (offcanvas.parentNode === document.body) {
          pickupAvailability.appendChild(offcanvas);
        }

        const backdrop = document.querySelector('.offcanvas-backdrop');
        if (backdrop && backdrop.parentNode === document.body) {
          pickupAvailability.appendChild(backdrop);
        }
      }
    });
  }
}
 
handlePickupAvailability();

/* Quantity increment and decrement */
 function setupQuantityListeners() {

        document.querySelectorAll('.increment-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        document.querySelectorAll('.decrement-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });


        document.querySelectorAll('.increment-btn').forEach(incrementBtn => {
            incrementBtn.addEventListener('click', function(event) {
                event.preventDefault();
                var section = this.dataset.section ;
                  var quantityContainer = this.closest('.quantity-selector');
            var quantityInput = quantityContainer.querySelector('.quantity-input');
            var decrementBtn = quantityContainer.querySelector('.decrement-btn');

            if (decrementBtn) {
                decrementBtn.style.cursor = 'pointer';
            }
                var variantSelect = document.getElementById('variant-select-'+section);
                if (!variantSelect) {
                     const modal = document.querySelector('.modal');
                     const modalProduct = document.querySelector('main-product.quickview-product');
                     const isModal = !!modal || !!modalProduct;

                    let modalSectionId = null;
                    if (isModal) {
                       var variantSelect = document.querySelector('.variant-select');
                    }
                    else
                    {  return;   }


                }

                const selectedOption = variantSelect.options[variantSelect.selectedIndex];
                const selectedCount = selectedOption.dataset.stockcount;
                const inventoryCheck = selectedOption.dataset.inventorycheck;
                const continueSelling = selectedOption.dataset.continueSelling;


                const continueSellingBool = continueSelling === 'true';
                const inventoryCheckBool = inventoryCheck === 'true';
                const selectedCountNum = parseInt(selectedCount);

                const quantityInputs = parseInt(quantityInput.value) || 1;

                if (!continueSellingBool && !inventoryCheckBool) {
                    quantityInput.value = quantityInputs + 1;
                    quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
                } else if (continueSellingBool && !inventoryCheckBool) {
                    quantityInput.value = quantityInputs + 1;
                    quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
                } else if (!continueSellingBool && inventoryCheckBool) {
                    if (quantityInputs < selectedCountNum) {
                        quantityInput.value = quantityInputs + 1;
                        quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        var formSection = document.querySelector('#product-'+section);
                        const formMessage = formSection.querySelector('.form-message');
                         const max = `${quantityInputs}`;
                        if (formMessage) {
                            formMessage.innerHTML =
                                '<svg class="text-danger" width="12px" height="12px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
                                '<path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.0586 6.05547C10.0268 5.48227 10.483 5 11.0571 5H12.9429C13.517 5 13.9732 5.48227 13.9414 6.05547L13.5525 13.0555C13.523 13.5854 13.0847 14 12.554 14H11.446C10.9153 14 10.477 13.5854 10.4475 13.0555L10.0586 6.05547ZM14 17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17Z" fill="currentColor"/>' +
                                '</svg>' +
                                "<span class='m-0 ms-1 fs-6'>" + window.cartTotStrings.quantityError.replace("[quantity]", max) +" </span>";
                        }
                    }
                } else {
                    quantityInput.value = parseInt(quantityInputs) + 1;
                    quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                cursorHandle();
            });
            });


            // Decrement event listener
        document.querySelectorAll('.decrement-btn').forEach(decrementBtn => {

            decrementBtn.addEventListener('click', function(event) {
                event.preventDefault();
                var section = this.dataset.section ;
                  var quantityContainer = this.closest('.quantity-selector');
                var quantityInput = quantityContainer.querySelector('.quantity-input');
                var decrementBtn = quantityContainer.querySelector('.decrement-btn');

                clearCountNotification();

                cursorHandle();


                if (parseInt(quantityInput.value) > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                    quantityInput.dispatchEvent(new Event('input', { bubbles: true }));

                    if (decrementBtn) {
                        decrementBtn.style.cursor = 'pointer';
                    }
                } else {
                    if (decrementBtn) {
                        decrementBtn.style.cursor = 'not-allowed';
                    }
                }

                cursorHandle();
            });
        });

        // Input event listener
        document.querySelectorAll('.quantity-input').forEach(quantityInput => {
            quantityInput.addEventListener('input', cursorHandle);
            cursorHandle();
        });


 }
 function clearCountNotification()
 {
    const formMessage = document.querySelector('.form-message');
            if (formMessage) {
                formMessage.innerHTML = '';
            }
 }




    function cursorHandle() {
        const decrementBtn = document.getElementById('decrement');
         const quantityInput = document.querySelector('#quantity');
        if (!decrementBtn || !quantityInput) return;

        if (parseInt(quantityInput.value) > 1) {
            decrementBtn.removeAttribute('style');
            decrementBtn.style.cursor = 'pointer';
        } else {
            decrementBtn.style.cursor = 'not-allowed';
        }
    }
    const quantityInput = document.querySelector('#quantity');
        if(quantityInput) {

            // Initial setup
            setupQuantityListeners();
        }
        // initLightbox();
        if (document.querySelector('.product__media-list')) {
            window.MyTheme.initLightbox('.product__media-list');
        }



/* Add to cart from quick view */
document.addEventListener('click', function(event) {
  const button = event.target.closest('.add_to_cart');
  if (!button) return;

  event.preventDefault();

  const productId = button.dataset.productdetails;
  const price = button.dataset.price;
  const unit_price = button.dataset.unitprice;
  const cmpprice = button.dataset.cmpprice;
  const currency_symbol = window.routes.currency_symbol;
  const variant_id = button.dataset.variantdetails;
  const cartType = button.dataset.carttype;
  const cartUrl = window.routes.cart_url;
  const card = button.closest('.card');
  const loader = button.querySelector('.cart-loader');
  const svg = button.querySelector('svg');

  if (loader) loader.style.display = 'block';
  if (svg) svg.style.display = 'none';

  const cart_type = cartType;
 
  const parentVariantId = Number(variant_id);
 
  const selectedNestedInputs = card
    ? Array.from(card.querySelectorAll('[data-nested-addon]:checked'))
    : [];

  const items = [
    { id: parentVariantId, quantity: 1 }
  ];

  selectedNestedInputs.forEach(input => {
    const childVariantId = Number(input.value);
    if (!childVariantId) return;
    items.push({
      id: childVariantId,
      quantity: 1,
      parent_id: parentVariantId   
    });
  });

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items })
  })
    .then(response => response.json())
    .then(response => {
      if (loader) loader.style.display = 'none';
      if (svg) svg.style.display = 'block';

      return fetch('/cart.js')
        .then(cartResponse => cartResponse.json())
        .then(cart => {
          const cartItemCount = cart.item_count;
          const cartCountElements = document.querySelectorAll('.open-cart-drawer a > span:last-child');
          cartCountElements.forEach(element => {
            element.textContent = cartItemCount;
          });

          const item = cart.items.find(i => i.variant_id === response.variant_id);

          if (cart_type === 'drawer') {
            const triggerButton = button;
            const cartIcon = document.getElementById('cart-icon');
            const cartOffCanvas = document.getElementById('cartOffCanvas');
            if (cartIcon && cartOffCanvas) {
              cartIcon.click();
              cartOffCanvas.addEventListener('shown.bs.offcanvas', () => {
                cartIcon.removeAttribute('data-bs-toggle');
              }, { once: true });

              cartOffCanvas.addEventListener('hidden.bs.offcanvas', () => {
                cartIcon.setAttribute('data-bs-toggle', 'offcanvas');
                setTimeout(() => {
                  triggerButton.focus();
                }, 50);
              }, { once: true });
            }
          } else if (cart_type === 'pop_up') {
            showSuccessPopup(response, price, cmpprice, unit_price);
          } else {
            window.location.href = cartUrl;
          }
        });
    })
    .catch(error => {
      if (loader) loader.style.display = 'none';
      if (svg) svg.style.display = 'block'; 
    });
});

function setupAddToCartListeners() {
    const existingButtons = document.querySelectorAll('.add_to_cart');
    existingButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });

}


document.addEventListener('DOMContentLoaded', function() {
    setupAddToCartListeners();

});

function reinitializeAddToCartListeners() {
    setupAddToCartListeners();

}



/* quick view */


document.addEventListener('click', async function(event) {
    const button = event.target.closest('.main-card .popup-modal') || event.target.closest('.card_product_detail .popup-modal');
    if (!button) return;
    event.preventDefault();
    const quickviewType = button.dataset.quickviewtype || window.quickview_type || 'modal';
    const productId = button.dataset.productid;
    const sectionId = button.dataset.sectionId;
    const productHandle = button.dataset.producthandle;

    if (quickviewType === 'drawer') {
        openQuickviewDrawer(productId, sectionId, productHandle);
    } else {
        openQuickviewModal(productId, sectionId, productHandle);

    }
});



async function openQuickviewModal(productId, sectionId, productHandle, event) {
  const modalId = `video-modal-${productId}`;
  let existingModalEl = document.getElementById(modalId);
  const triggerButton =
    event?.target?.closest('.quick-view') ||
    document.querySelector(`.quick-view[data-producthandle="${productHandle}"]`);

  if (existingModalEl) {
    bootstrap.Modal.getInstance(existingModalEl)?.show();
    return;
  }
  const canvas_color_scheme = window.routes.canvas_color_scheme;
  const quickviewModalString = `
    <div class="modal fade quickview_modal" data-sectionId="${sectionId}" id="${modalId}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content p-4 color-${canvas_color_scheme}">
          <div class="modal-header close position-absolute top-0 end-0 shadow-none z-1 border-0">
            <button type="button" class="btn-close shadow-none m-0" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body h-100 quickview-modal"></div>
        </div>
      </div>
    </div>`;

  const quickviewModal = new DOMParser().parseFromString(quickviewModalString, 'text/html').querySelector('.modal');

  quickviewModal.dataset.productHandle = productHandle;
  quickviewModal.dataset.productId = productId;
  quickviewModal.dataset.triggerElement = triggerButton?.id || '';

  // Make the modal focusable itself as a fallback focus target
  quickviewModal.setAttribute('tabindex', '-1');

  document.body.appendChild(quickviewModal);

  // ── FOCUS TRAP (scoped to this modal)

  let trapActive = false;
  let focusableElements = [];

  const getFocusableElements = (container) => {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), .btn-close, model-viewer'
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
  };

  const updateFocusableElements = () => {
    focusableElements = getFocusableElements(quickviewModal);
  };

  const trapFocus = (e) => {
    if (!trapActive || e.key !== 'Tab') return;
    if (!quickviewModal.classList.contains('show')) return;

    updateFocusableElements();

    if (focusableElements.length === 0) {
      e.preventDefault();
      quickviewModal.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!quickviewModal.contains(activeElement)) {
      e.preventDefault();
      firstFocusable.focus();
      return;
    }
    if (e.shiftKey && activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
      return;
    }

    if (!e.shiftKey && activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
      return;
    }
  };
  quickviewModal.addEventListener('keydown', trapFocus);

  // FOCUS INITIALIZATION HELPERS

  const updateFocusAfterContentLoad = () => {
    updateFocusableElements();

    if (quickviewModal.classList.contains('show')) {
      setTimeout(() => {
        const firstFocusable =
          focusableElements[0] ||
          quickviewModal.querySelector('.btn-close') ||
          quickviewModal;

        if (firstFocusable && !quickviewModal.contains(document.activeElement)) {
          firstFocusable.focus();
        }
      }, 50);
    }
  };

  // MODAL EVENT LISTENERS

  quickviewModal.addEventListener('shown.bs.modal', () => {
    const quickviewModelViewer = quickviewModal.querySelector('model-viewer');

    trapActive = true;
    updateFocusableElements();

    // Set initial focus inside the modal
    setTimeout(() => {
      if (!quickviewModal.contains(document.activeElement)) {
        const firstFocusable =
          focusableElements[0] ||
          quickviewModal.querySelector('.btn-close') ||
          quickviewModal;
        if (firstFocusable) firstFocusable.focus();
      }
    }, 50);
  });

  quickviewModal.addEventListener('hidden.bs.modal', () => {
    trapActive = false;

    quickviewModal.removeEventListener('keydown', trapFocus);

    const triggerId = quickviewModal.dataset.triggerElement;
    if (triggerId) {
      const triggerEl = document.getElementById(triggerId);
      if (triggerEl) triggerEl.focus();
    } else if (triggerButton) {
      triggerButton.focus();
    }

    bootstrap.Modal.getInstance(quickviewModal)?.dispose();
    quickviewModal.remove();
  });

  // LOADING STATE

  if (triggerButton) {
    const svg = triggerButton.querySelector('svg');
    const loader = triggerButton.querySelector('.popup-loader');
    if (svg) svg.style.display = 'none';
    if (loader) loader.style.display = 'block';
  }

  try {
    const response = await fetch(
      `${window.Shopify.routes.root}products/${productHandle}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const responseText = await response.text();
    const html = new DOMParser().parseFromString(responseText, 'text/html');
    const newElementBlock = html.querySelector('main-product');

    const variantImageId =
      newElementBlock.dataset.selectedimageid ||
      newElementBlock.querySelector('[data-selectedimageid]')?.dataset.selectedimageid;
    const originalSectionId = newElementBlock.dataset.sectionId;
    const modalSectionId = `quickview-${productId}`;
    const productMedia = newElementBlock.querySelector('.product__media');

    const galleryLayout = productMedia?.dataset?.gallerylayout || 'stack';

    const mobileStackModal = newElementBlock.querySelector('.stack-layout');

    newElementBlock.classList.add('quickview-product');
    newElementBlock.classList.remove('main-product');
    newElementBlock.dataset.modalSectionId = modalSectionId;
    newElementBlock.dataset.originalSectionId = originalSectionId;
    newElementBlock.dataset.productHandle = productHandle;

    if (galleryLayout === 'stack') {
      // nothing
    } else if (galleryLayout !== 'thumbnail_left') {
      setTimeout(() => {
        initializeProductSwipers(modalSectionId, 'thumbnail_bottom');
      }, 100);
    } else {
      setTimeout(() => {
        initializeProductSwipers(modalSectionId, 'thumbnail_left');
      }, 100);
    }

    const popupModalContent = quickviewModal.querySelector('.quickview-modal');
    popupModalContent.appendChild(newElementBlock);
    //remove product color-scheme class 
    popupModalContent.querySelectorAll('[class*="color-scheme-"]').forEach(el => {
      [...el.classList].forEach(cls => {
        if (cls.startsWith('color-scheme-')) el.classList.remove(cls);
      });
    });


    const modelViewers = quickviewModal.querySelectorAll('model-viewer');


    modelViewers.forEach(mv => {
      mv.style.pointerEvents = 'auto';
      mv.style.touchAction = 'none';

      // Prevent swiper from stealing touch events on model-viewer
      mv.addEventListener('touchstart', e => e.stopPropagation(), { passive: false });
      mv.addEventListener('mousedown', e => e.stopPropagation());
      mv.addEventListener('wheel', e => e.stopPropagation(), { passive: false });
    });

    setTimeout(() => {
       // initQuickviewModelViewerUI(popupModalContent);

      initializeOptionItems();
      tabControlVideo();
      setupQuantityListeners();
      //handlePickupAvailability();
      productMainSubmit();
      commonVideoControls();
      //complementarySlider();
      disableModelViewerTabbingInStackLayout();
      window.MyTheme.initLightbox('.product__media-list');
      giftcardHandle();
      fixSwiperThumbnailKeyboard(quickviewModal);

      updateFocusAfterContentLoad();
    }, 100);

    new bootstrap.Modal(quickviewModal).show();
  } catch (error) {
    quickviewModal.querySelector('.quickview-modal').innerHTML =
      "<p>Sorry, we couldn't load the product information.</p>";

    updateFocusAfterContentLoad();
    new bootstrap.Modal(quickviewModal).show();
  } finally {
    if (triggerButton) {
      const svg = triggerButton.querySelector('svg');
      const loader = triggerButton.querySelector('.popup-loader');
      if (svg) svg.style.display = 'block';
      if (loader) loader.style.display = 'none';
    }
  }
}

function initQuickviewModelViewerUI(container) {
  if (
    typeof Shopify === 'undefined' ||
    typeof Shopify.loadFeatures !== 'function'
  ) {

    return;
  }

  Shopify.loadFeatures([
    {
      name: 'model-viewer-ui',
      version: '1.0',
      onLoad: () => {
        if (typeof Shopify.ModelViewerUI === 'undefined') {

          return;
        }

        const modelViewers = container.querySelectorAll('model-viewer');



        modelViewers.forEach((mv) => {
          try { 
            if (mv.modelViewerUI) return;
            mv.removeAttribute('data-model-viewer-ui-initialized');

            mv.modelViewerUI = new Shopify.ModelViewerUI(mv);
            mv.dataset.modelViewerUiInitialized = 'true';


          } catch (error) {

          }
        });
      }
    }
  ]);
}
function fixSwiperThumbnailKeyboard(modalEl) {
  setTimeout(() => {
    const mainSwiperEl = modalEl.querySelector('.main_carousel.swiper');
    const mainSwiper = mainSwiperEl?.swiper;
    if (!mainSwiper) return;

    const thumbSwiper = mainSwiper.thumbs?.swiper;
    if (!thumbSwiper) return;

    thumbSwiper.slides.forEach((slide, index) => {
      slide.setAttribute('tabindex', '0');

      slide.addEventListener(
        'keydown',
        function (e) {
          if (e.key !== 'Enter' && e.key !== ' ') return;

          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          mainSwiper.slideTo(index);
          thumbSwiper.slideTo(index);

          slide.click();

          const targetSlide = mainSwiper.slides[index];
          if (!targetSlide) return;

        },
        true
      );
    });
  }, 250);
}
async function openQuickviewDrawer(productId, sectionId, productHandle) {
  const drawerId = `quickview-drawer-${productId}`;
  let existingDrawer = document.getElementById(drawerId);
  const triggerButton = document.querySelector(`.quick-view[data-producthandle="${productHandle}"]`);

  if (existingDrawer) {
    let drawerInstance = bootstrap.Offcanvas.getInstance(existingDrawer);
    if (!drawerInstance) {
      drawerInstance = new bootstrap.Offcanvas(existingDrawer, {
        focus: true,
        keyboard: true,
        backdrop: true,
        scroll: false
      });
    }
    drawerInstance.show();
    return;
  }

  document.querySelectorAll('.quickview-drawer').forEach((drawer) => {
    const instance = bootstrap.Offcanvas.getInstance(drawer);
    if (instance) instance.hide();
    drawer.remove();
  });
  document.querySelectorAll('.offcanvas-backdrop').forEach((b) => b.remove());

  const canvas_color_scheme = window.routes.canvas_color_scheme;

  const quickviewDrawerString = `
    <div class="offcanvas OffCanvas offcanvas-end quickview-drawer color-${canvas_color_scheme}"
      id="${drawerId}"
      tabindex="-1"
      data-bs-scroll="false"
      data-bs-backdrop="static"
      data-bs-keyboard="true"
      role="dialog"
      aria-modal="true"
      aria-label="Quick view">
      <div class="offcanvas-header">
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body quickview-drawer-content p-4">
        <div class="quickview-loading text-center">

        </div>
      </div>
    </div>`;

  const quickviewDrawer = new DOMParser()
    .parseFromString(quickviewDrawerString, 'text/html')
    .querySelector('.offcanvas');

  quickviewDrawer.dataset.productHandle = productHandle;
  quickviewDrawer.dataset.productId = productId;
  quickviewDrawer.dataset.triggerElement = triggerButton?.id || '';

  document.body.appendChild(quickviewDrawer);

  // ── FOCUS TRAP

  let trapActive = false;
  let focusableElements = [];

  // const updateFocusableElements = () => {
  //   focusableElements = getFocusableElements(quickviewDrawer);
  // };

   const getFocusableElements = (container) => {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), .btn-close, model-viewer'
      )
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
  };

  const updateFocusableElements = () => {
    focusableElements = getFocusableElements(quickviewDrawer);
  };

  const trapFocus = (e) => {
    if (!trapActive || e.key !== 'Tab') return;

    if (!quickviewDrawer.classList.contains('show')) return;

    updateFocusableElements();

    if (focusableElements.length === 0) {
      e.preventDefault();
      quickviewDrawer.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!quickviewDrawer.contains(activeElement)) {
      e.preventDefault();
      firstFocusable.focus();
      return;
    }

    if (e.shiftKey) {
      if (activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  // window.removeEventListener('keydown', trapFocus, { capture: true });
  // window.addEventListener('keydown', trapFocus, { capture: true });
  quickviewDrawer.addEventListener('keydown', trapFocus);

  quickviewDrawer.addEventListener('shown.bs.offcanvas', () => {
    trapActive = true;
    updateFocusableElements();

    setTimeout(() => {
      if (!quickviewDrawer.contains(document.activeElement)) {
        const firstFocusable = focusableElements[0] || quickviewDrawer.querySelector('.btn-close');
        if (firstFocusable) firstFocusable.focus();
      }
    }, 50);
  });
  quickviewDrawer.addEventListener('hidden.bs.offcanvas', () => {
    trapActive = false;

    // ── Remove keydown listener
    quickviewDrawer.removeEventListener('keydown', trapFocus);

    // quickviewCloseAllVideos();
    quickviewDrawer.querySelectorAll('video').forEach(video => {
        if (!video.paused) {
            video.pause();
            video.dataset.playing = 'false';
        }
    });

    quickviewDrawer.querySelectorAll('iframe[src*="youtube"], iframe[src*="youtu.be"]').forEach(iframe => {
        try {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            iframe.dataset.playing = 'false';
        } catch(e) {}
    });

    quickviewDrawer.querySelectorAll('iframe[src*="vimeo"]').forEach(iframe => {
        try {
            iframe.contentWindow.postMessage('{"method":"pause"}', '*');
            iframe.dataset.playing = 'false';
        } catch(e) {}
    });

        const triggerId = quickviewDrawer.dataset.triggerElement;
        if (triggerId) {
            const triggerEl = document.getElementById(triggerId);
            if (triggerEl) triggerEl.focus();
        } else if (triggerButton) {
            triggerButton.focus();
        }
  });

  const updateFocusAfterContentLoad = () => {
    updateFocusableElements();

    if (quickviewDrawer.classList.contains('show')) {
      setTimeout(() => {
        const firstFocusable = focusableElements[0] || quickviewDrawer.querySelector('.btn-close');
        if (firstFocusable && !quickviewDrawer.contains(document.activeElement)) {
          firstFocusable.focus();
        }
      }, 50);
    }
  };

  // ── LOADING STATE

  const quickViewButton = document.querySelector(`.quick-view[data-producthandle="${productHandle}"]`);
  if (quickViewButton) {
    const svg = quickViewButton.querySelector('svg');
    const loader = quickViewButton.querySelector('.popup-loader');
    if (svg) svg.style.display = 'none';
    if (loader) loader.style.display = 'block';
  }

  let newElementBlock = null;
  let originalSectionId = '';
  let drawerSectionId = '';

  // ── FETCH PRODUCT

  try {
    const response = await fetch(
      `${window.Shopify.routes.root}products/${productHandle}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const responseText = await response.text();
    const html = new DOMParser().parseFromString(responseText, 'text/html');
    newElementBlock = html.querySelector('main-product');

    if (!newElementBlock) throw new Error('No product found');

    originalSectionId = newElementBlock.dataset.sectionId;
    drawerSectionId = `quickview-drawer-${productId}`;




    newElementBlock.classList.add('quickview-product', 'drawer-product');
    newElementBlock.classList.remove('main-product');
    newElementBlock.dataset.drawerSectionId = drawerSectionId;
    newElementBlock.dataset.originalSectionId = originalSectionId;
    newElementBlock.dataset.productHandle = productHandle;

    const drawerContent = quickviewDrawer.querySelector('.quickview-drawer-content');
    const drawerContent_check = newElementBlock.querySelector('.gradient');
    if (drawerContent_check) {
      drawerContent_check.removeAttribute('class');
      drawerContent_check.setAttribute('gradient', canvas_color_scheme);
    }

    if (drawerContent) {
      drawerContent.appendChild(newElementBlock);
    }
    updateFocusAfterContentLoad();
    const productMedia = newElementBlock.querySelector('.product__media');
    const offcanvasInstance = new bootstrap.Offcanvas(quickviewDrawer, {
      focus: true,
      keyboard: true,
      backdrop: true,
      scroll: false
    });

    offcanvasInstance.show();

  } catch (error) {
    const drawerContent = quickviewDrawer.querySelector('.quickview-drawer-content');
    drawerContent.innerHTML = "<p>Sorry, we couldn't load the product information.</p>";

    updateFocusAfterContentLoad();

    new bootstrap.Offcanvas(quickviewDrawer, {
      focus: true,
      keyboard: true,
      backdrop: true,
      scroll: false
    }).show();

  } finally {
    if (quickViewButton) {
      const svg = quickViewButton.querySelector('svg');
      const loader = quickViewButton.querySelector('.popup-loader');
      if (svg) svg.style.display = 'block';
      if (loader) loader.style.display = 'none';
    }
  }


  setTimeout(() => {
     const mobileStackDrawer = newElementBlock.querySelector('.stack-layout');
     const productMedia = newElementBlock.querySelector('.product__media');

    const galleryLayout = productMedia?.dataset?.gallerylayout || 'stack';

    // if (mobileStackDrawer) mobileStackDrawer.classList.add('swiper-wrapper');
    if(mobileStackDrawer && galleryLayout !== 'stack'){ initializeProductSwipers(drawerSectionId, 'thumbnail_bottom'); }
                      else { initializeProductSwipers(drawerSectionId, 'thumbnail_left'); }
  }, 100);
  // INIT COMPONENTS

 setTimeout(() => {
    initializeOptionItems();
    tabControlVideo();
    setupQuantityListeners();
    //handlePickupAvailability();
    productMainSubmit();
    commonVideoControls();
    //complementarySlider();
    disableModelViewerTabbingInStackLayout();
    window.MyTheme.initLightbox('.product__media-list');
    giftcardHandle();
    fixSwiperThumbnailKeyboard(quickviewDrawer);

    // Single swiper init with correct sectionId
    const productMedia = newElementBlock?.querySelector('.product__media');
    const galleryLayout = productMedia?.dataset?.gallerylayout || 'stack';
    if (galleryLayout !== 'stack') {
        const layout = galleryLayout !== 'thumbnail_left' ? 'thumbnail_bottom' : 'thumbnail_left';
        initializeProductSwipers(drawerSectionId, layout);
    }

    updateFocusAfterContentLoad();
}, 300); // 300ms — after offcanvas animation completes
}
function adjustQuickviewMediaTabIndices(container) {
  if (!container) return;
  container
    .querySelectorAll('.swiper-slide[tabindex="0"],  iframe, video, model-viewer')
    .forEach((el) => {
      el.tabIndex = -1;
      el.setAttribute('aria-hidden', 'true');
    });


  container
    .querySelectorAll('.svg-wrapper-icon[tabindex="0"], .thumbnail__icon span[tabindex="0"]')
    .forEach((el) => {
      el.tabIndex = -1;
    });
}
function quickviewCloseAllVideos(){

}


function updateDrawerSwiperClasses(element, originalId, drawerId) {
    const swipers = element.querySelectorAll('.swiper');
    swipers.forEach(swiper => {
        const originalClass = `swiper-${originalId}`;
        const drawerClass = `swiper-${drawerId}`;
        swiper.className = swiper.className.replace(originalClass, drawerClass);
    });
}








/* Add to cart */
   const currency_symbol = window.routes.currency_symbol




function showFormError(form, message) {
    let messageContainer = form.querySelector('.form-message');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'form-message';
        form.appendChild(messageContainer);
    }

    messageContainer.innerHTML = `
        <div class="error-item mb-3">
            <span class="text-danger">
                <svg width="12px" height="12px" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.0586 6.05547C10.0268 5.48227 10.483 5 11.0571 5H12.9429C13.517 5 13.9732 5.48227 13.9414 6.05547L13.5525 13.0555C13.523 13.5854 13.0847 14 12.554 14H11.446C10.9153 14 10.477 13.5854 10.4475 13.0555L10.0586 6.05547ZM14 17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17Z" fill="currentColor"/>
                </svg>
            </span>
            <span class='m-0 ms-1 fs-6'>${message}</span>
        </div>
    `;
}
productMainSubmit();
function productMainSubmit() {
    /* Accessability after form submit to addtocart button start */
    const cartDrawer = document.getElementById('cartOffCanvas');
    if (cartDrawer) {
        cartDrawer.addEventListener('hidden.bs.offcanvas', function() {
            setTimeout(() => {
                if (lastAddToCartButton && document.body.contains(lastAddToCartButton)) {
                    lastAddToCartButton.focus();
                    lastAddToCartButton = null;
                }
            }, 150);
        });
    }
    /* Accessability after form submit to addtocart button end */

    let lastAddToCartButton = null;

    const addtoCartForms = document.querySelectorAll('.add-to-cart-form');


    addtoCartForms.forEach(addtoCartEle => {
        if (addtoCartEle) {
            addtoCartEle.removeEventListener('submit', handleAddToCartSubmit);
            addtoCartEle.addEventListener('submit', handleAddToCartSubmit);
        }
    });

    function handleAddToCartSubmit(event) {
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            lastAddToCartButton = submitButton;
        }

        event.preventDefault();
        if (!form.classList.contains('add-to-cart-form')) return;

        const formData = new FormData(form);
        const variantId = formData.get('id');

        if (!variantId || variantId === '') {
            const variantSelect = form.querySelector('select[name="id"]');
            const formMessage = form.querySelector('.form-message');
            if (formMessage) {
                formMessage.innerHTML =
                    '<div class="error-item mb-3"><span class="text-danger"><svg width="12px" height="12px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.0586 6.05547C10.0268 5.48227 10.483 5 11.0571 5H12.9429C13.517 5 13.9732 5.48227 13.9414 6.05547L13.5525 13.0555C13.523 13.5854 13.0847 14 12.554 14H11.446C10.9153 14 10.477 13.5854 10.4475 13.0555L10.0586 6.05547ZM14 17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17Z" fill="currentColor"/>' +
                    '</svg></span>' +
                    '<span class="m-0 ms-1 fs-6">Please select a variant before adding to cart</span></div>';
            }
            return;
        }

        const parentElement = form.closest('.product__details');
        let productType = null;

        if (parentElement) {
            productType = parentElement.getAttribute('data-producttype');
        }

        const requiredInputs = form.querySelectorAll('input[required]');
        requiredInputs.forEach(input => {
            if (input.offsetParent === null) {
                input.required = false;
            }
        });

        if (!productType || productType !== 'true') {
            formdataHandler(formData, event);
            return;
        }

        const isGiftCardChecked = document.querySelector('.send_giftcard')?.checked;
        const recipientFormFields = parentElement?.querySelectorAll('.field__inputEmail');

        let allFieldsFilled = true;

        if (isGiftCardChecked && recipientFormFields) {
            recipientFormFields.forEach(field => {
                if (field.value.trim() === '') {
                    allFieldsFilled = false;
                }
            });

            if (!allFieldsFilled) {
                const formMessage = form.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerHTML =
                        '<div class="error-item mb-3"><span class="text-danger"><svg width="12px" height="12px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
                        '<path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.0586 6.05547C10.0268 5.48227 10.483 5 11.0571 5H12.9429C13.517 5 13.9732 5.48227 13.9414 6.05547L13.5525 13.0555C13.523 13.5854 13.0847 14 12.554 14H11.446C10.9153 14 10.477 13.5854 10.4475 13.0555L10.0586 6.05547ZM14 17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17Z" fill="currentColor"/>' +
                        '</svg></span>' +
                        '<span class="m-0 ms-1 fs-6">Please fill recipient email field</span></div>';
                }
                return;
            }
        }

        formdataHandler(formData, event);
    }
}


function formdataHandler(formData, event) {


  var addcartUrl = window.routes.cart_url + '/add.js';

  // Resolve the form context
  const form = event
    ? event.target.closest('form')
    : document.querySelector('.add-to-cart-form');

  if (!form) {

    return;
  }

  if (form.dataset.processing === 'true') {

    return;
  }
  form.dataset.processing = 'true';

  // Button inside *this* form, not global
  const submitButton = form.querySelector('[type="submit"]');

  // Parent context (for variant price, etc.)
  const parentElement = event ? event.target.parentElement : null;
  const parentId = parentElement ? parentElement.id : null;
  var parentElemnt = parentId ? document.querySelector('#' + parentId) : null;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add('loading');
  }

  fetch(addcartUrl, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
    .then(async (response) => {
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        // Ignore JSON parse errors, data will stay null
      }

      if (!response.ok) {
        const error = new Error('Cart error');
        error.response = response;
        error.data = data;
        throw error;
      }

      return data;
    })
    .then((data) => {
      var cartType = window.settingStrings.cartType || 'drawer';

      if (cartType === 'drawer') {
        if (!window.cartDrawerTriggered) {
          window.cartDrawerTriggered = true;

          const cartIcon = document.getElementById('cart-icon');

          if (cartIcon) {
            setTimeout(() => {
              cartIcon.click();
              setTimeout(() => {
                window.cartDrawerTriggered = false;
              }, 1000);
            }, 100);
          } else {
            const selectedOption = parentElemnt
              ? parentElemnt.querySelector('.variant-select')?.selectedOptions[0]
              : null;

            const price = selectedOption ? selectedOption.dataset.price : null;
            const comparePrice = selectedOption ? selectedOption.dataset.cmpprice : null;
            const unitMeasurePrice = selectedOption ? selectedOption.dataset.unitmeasureprice : null;

            window.location.href = window.routes.cart_url;
          }
        }
      } else if (cartType === 'pop_up') {
        const selectedOption = parentElemnt
          ? parentElemnt.querySelector('.variant-select')?.selectedOptions[0]
          : null;

        const price = selectedOption ? selectedOption.dataset.price : null;
        const comparePrice = selectedOption ? selectedOption.dataset.cmpprice : null;
        const unitMeasurePrice = selectedOption ? selectedOption.dataset.unitmeasureprice : null;
        showSuccessPopup(data, price, comparePrice, unitMeasurePrice);
      } else {
        window.location.href = window.routes.cart_url;
      }

      const formMessage = form.querySelector('.form-message') || document.querySelector('.form-message');
      if (formMessage) {
        formMessage.innerHTML = '';
      }

      updateCartCount();
    })
    .catch(async (error) => {
      const response = error.response || error;
      const status = response.status || 0;
      let errorData = error.data || null;

      if (!errorData && response && typeof response.json === 'function') {
        try {
          errorData = await response.json();
        } catch (parseError) {
          // ignore
        }
      }

      let errorMessages = [];

      if (errorData) {
        if (errorData.description) {
          if (typeof errorData.description === 'string') {
            errorMessages.push(errorData.description);
          } else if (typeof errorData.description === 'object') {
            if (errorData.description.send_on) {
              if (Array.isArray(errorData.description.send_on)) {
                errorData.description.send_on.forEach(msg => errorMessages.push(msg));
              } else {
                errorMessages.push(errorData.description.send_on);
              }
            } else {
              Object.entries(errorData.description).forEach(([key, messages]) => {
                if (Array.isArray(messages)) {
                  messages.forEach(msg => errorMessages.push(`${key}: ${msg}`));
                } else {
                  errorMessages.push(`${key}: ${messages}`);
                }
              });
            }
          }
        } else if (errorData.message) {
          errorMessages.push(errorData.message);
        } else if (errorData.errors && errorData.errors.send_on) {
          if (Array.isArray(errorData.errors.send_on)) {
            errorData.errors.send_on.forEach(msg => errorMessages.push(msg));
          } else {
            errorMessages.push(errorData.errors.send_on);
          }
        } else if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([key, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => errorMessages.push(`${key}: ${msg}`));
            } else {
              errorMessages.push(`${key}: ${messages}`);
            }
          });
        }
      }

      if (errorMessages.length === 0) {
        if (status) {
          errorMessages.push(`Error ${status}: ${response.statusText || 'Unknown error'}`);
        } else {
          errorMessages.push('Failed to add product to cart. Please try again.');
        }
      }

      errorMessages = [...new Set(errorMessages)].filter(msg => msg && msg.trim() !== '');

      showFormError(form, errorMessages);
    })
    .finally(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
      }
      delete form.dataset.processing;
    });
}
// Separate function to update cart count without triggering drawer
function updateCartCount() {
    fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
            const cartItemCount = cart.item_count;
            const cartCountElement = document.querySelector('.open-cart-drawer a > span:last-child');
            if (cartCountElement) {
                cartCountElement.textContent = cartItemCount;
            }
        })
        .catch(error => {
        });
}




/* Gift card */
function giftcardHandle(){
    const giftCheckbox = document.querySelector('input[name="properties[__shopify_send_gift_card_to_recipient]"]');
    const giftForm = document.querySelector('#giftcard-recipient-container');

    if (giftCheckbox && giftForm) {
    giftCheckbox.addEventListener('change', function() {
        if (this.checked) {
        giftForm.classList.remove('d-none');
        } else {
        giftForm.classList.add('d-none');
        }
    });
    if (giftCheckbox.checked) {
        giftForm.classList.remove('d-none');
    } else {
        giftForm.classList.add('d-none');
    }
    }
}
giftcardHandle();

});
