'use strict';

$(function () {
  /** Links default action **/
  $('a[href="#"]').on("click", function (event) {
    event.preventDefault();
  });


  /** Dropdown menu **/
  $(".dropdown_toggle").on("click", function (e) {
    e.stopPropagation();
    var dropdownParent = $(this).parent(".dropdown");
    var dropdownBody = $(this).next(".dropdown_body");
    var isOpen = dropdownBody.hasClass("open");

    $(".dropdown_body, .dropdown").removeClass("open"); // Close other open dropdowns

    if (!isOpen) {
      dropdownParent.addClass("open");
      dropdownBody.addClass("open");
      $('html').addClass('menu-open');
    } else {
      $('html').removeClass('menu-open');
    }
  });

  $(document).on("click", function () {
    $(".dropdown_body, .dropdown").removeClass("open");
    setTimeout(function() {
      $('html').removeClass('menu-open');
    }, 500)
  });

  $(".dropdown_body").on("click", function (e) {
    e.stopPropagation();
  });


  /** Image Slider (About us) **/
  const swiperAboutUs = new Swiper('.about-us-module .swiper-container', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    speed: 500,
    // autoplay: {
    //   delay: 3000,
    // },
    loop: true,
    allowTouchMove: false,
    navigation: {
      nextEl: '.slider-buttons .slider-btn.next',
      prevEl: '.slider-buttons .slider-btn.prev',
    },
    on: {
      slideChangeTransitionStart: function () {
        var swiper = this;
        var currentCaption = $(swiper.slides[swiper.activeIndex]).attr("data-caption");
        var $slideTitle = $(".about-us-module .slide-title");
        var realIndex = swiper.realIndex;
        console.log("slide_realIndex: ", realIndex);
        $slideTitle.find('span').text(currentCaption);
        $(".about-us-module .benefits_toggle .toggle_item").removeClass("active");
        $(".about-us-module .benefits_toggle .toggle_item[data-index='" + realIndex + "']").addClass("active");
        // $(swiper.slides[swiper.activeIndex]).attr("data-index", realIndex);
      },
    }
  });

  // Update [About us] slide on toggle item click
  $('.about-us-module .benefits_toggle .toggle_item').on('click', function () {
    const index = $(this).data('index');
    console.log("toggle_index: ", index);
    swiperAboutUs.slideToLoop(index);
    $(".about-us-module .benefits_toggle .toggle_item").removeClass("active");
    $(this).addClass("active");
  });


  
  

  /** Accordion **/
  function initAccordion() {
    $('.accordion').each(function () {
      var $accordion = $(this);
      var mode = $accordion.data('mode'); // Get mode from data attribute

      $accordion.off('click', '.accordion-toggle').on('click', '.accordion-toggle', function () {
        var $item = $(this).closest('.accordion-item');
        var $collapse = $item.find('.accordion-collapse');
        var isOpen = $collapse.hasClass('show');

        if ($accordion.find('.collapsing').length > 0) {
          // Do not process click if any item is in the process of animation
          return;
        }

        if (mode === 'single') {
          // Close all items except the current one
          if (!isOpen) {
            $accordion.find('.accordion-collapse.show').each(function () {
              var $this = $(this);
              $this.closest('.accordion-item').removeClass('show'); // Remove 'show' class from the parent item
              $this.css('height', $this[0].scrollHeight + 'px');
              $this[0].offsetHeight; // force reflow
              $this.addClass('collapsing').removeClass('collapse show').css('height', '0px');
              $this.one('transitionend', function () {
                $this.removeClass('collapsing').addClass('collapse').css('height', '');
              });
            });
          }
        } else if (mode === 'always-open') {
          // Ensure at least one item is always open
          if (isOpen) {
            return; // Do nothing if already open
          }
          $accordion.find('.accordion-collapse.show').each(function () {
            var $this = $(this);
            if (!$this.hasClass('collapsing')) {
              $this.closest('.accordion-item').removeClass('show'); // Remove 'show' class from the parent item
              $this.css('height', $this[0].scrollHeight + 'px');
              $this[0].offsetHeight; // force reflow
              $this.addClass('collapsing').removeClass('collapse show').css('height', '0px');
              $this.one('transitionend', function () {
                $this.removeClass('collapsing').addClass('collapse').css('height', '');
              });
            }
          });
        }

        // Animation for opening/closing the current item
        if (isOpen) {
          // Collapse animation
          $item.removeClass('show'); // Remove 'show' class from the parent item
          $collapse.css('height', $collapse[0].scrollHeight + 'px');
          $collapse[0].offsetHeight; // force reflow
          $collapse.addClass('collapsing').removeClass('collapse show').css('height', '0px');
          $collapse.one('transitionend', function () {
            $collapse.removeClass('collapsing').addClass('collapse').css('height', '');
          });
        } else {
          // Expand animation
          $item.addClass('show'); // Add 'show' class to the parent item
          $collapse.removeClass('collapse').addClass('collapsing').css('height', '0px');
          $collapse[0].offsetHeight; // force reflow
          $collapse.css('height', $collapse[0].scrollHeight + 'px');
          $collapse.one('transitionend', function () {
            $collapse.removeClass('collapsing').addClass('collapse show').css('height', '');
          });
        }
      });
    });
  }

  /** Adaptive Styles **/
  function checkWindowSize() {
    if ($(window).width() <= 479) {
      $('ul.full_menu_list').addClass('accordion');
      $('ul.full_menu_list li.parent_menu').addClass('accordion-item');
      
      // Adding class .accordion-toggle
      $('ul.full_menu_list li.parent_menu a.menu_link').addClass('accordion-toggle');
      
      // Wrapping ul.submenu in div with .accordion-collapse.collapse classes
      $('ul.full_menu_list li.parent_menu').each(function() {
        var $submenu = $(this).find('ul.submenu');
        if ($submenu.length && !$submenu.parent().is('div.accordion-collapse')) {
          $submenu.wrap('<div class="accordion-collapse collapse"></div>');
        }
      });

      // Add 'show' class to active items
      $('ul.full_menu_list li.parent_menu').each(function() {
        var $item = $(this);
        var $collapse = $item.find('.accordion-collapse');
        if ($item.find('a.submenu_link.active').length) {
          $item.addClass('show');
          $collapse.addClass('show');
        }
      });

      // Module Reviews order block
      var reviewsModule = $('.reviews-module');
      var swiperNav = reviewsModule.find('.navigation-wrp');
      var orderBlock = reviewsModule.find('.d-flex.gap-50');
      var revWidget = reviewsModule.find('.google-reviews-widget');
      var mobShow = reviewsModule.find('.mob-show');

      revWidget.appendTo(mobShow);
      swiperNav.prependTo(mobShow);


    } else {
      $('ul.full_menu_list').removeClass('accordion');
      $('ul.full_menu_list li.parent_menu').removeClass('accordion-item');
      $('ul.full_menu_list li.parent_menu a.menu_link').removeClass('accordion-toggle');

      // Remove the wrapper div .accordion-collapse.collapse
      $('ul.full_menu_list li.parent_menu > div.accordion-collapse.collapse').each(function() {
        $(this).children('ul.submenu').unwrap();
      });

      // Remove 'show' class from all items
      $('ul.full_menu_list li.parent_menu').removeClass('show');
      $('ul.full_menu_list li.parent_menu .accordion-collapse').removeClass('show');
    }
  }

  // Initialize accordion and check window size on document ready
  checkWindowSize();
  initAccordion();

  // Reinitialize accordion and check window size on window resize
  $(window).resize(function() {
    checkWindowSize();
    initAccordion();
  });



  /** Image Slider (Services) **/
  const swiperServices = new Swiper('.services-module .swiper-container', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    speed: 500,
    allowTouchMove: false,
    on: {
      slideChangeTransitionStart: function () {
        var swiper = this;
        var currentPrice = $(swiper.slides[swiper.activeIndex]).attr("data-price");
        var $servicePrice = $(".service-price");
        $servicePrice.find('span').text(currentPrice);
      },
    }
  });

  // Update [Services] slide on toggle accordion item
  $('.services-module .accordion-item').on('click', function () {
    const index = $(this).data('index');
    swiperServices.slideTo(index);
  });

  
  /** Google Reviews Widget **/
  var averageScore = parseFloat($('.google-reviews-widget .average-rating .score').text());
  var starWidth = 'var(--star_width)';
  var starSpacing = 'var(--star_spacing)';
  var scoreWidth = `calc(${starWidth} * ${Math.floor(averageScore)} + (${starWidth} - ${starSpacing}) * ${averageScore % 1})`;
    // var starWidth = 24;
    // var starSpacing = 5;
    // var scoreWidth = `calc(${starWidth}px * ${Math.floor(averageScore)} + (${starWidth}px - ${starSpacing}px) * ${averageScore % 1})`;    
  $('.google-reviews-widget .g_star_rating span').css('width', scoreWidth);


  /** Swiper Carousel Module **/
  $('.swiper-carousel .swiper').each(function (index, element) {
    var swiperOptions = {
      slidesPerView: "auto",
      spaceBetween: 30,
      speed: 400,
      grabCursor: true,
      // lazy: {
      //     loadPrevNext: true,
      // },
      pagination: {
        el: $(element).closest('.container').find('.sw-pagination')[0],
        type: 'bullets',
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      navigation: {
        nextEl: $(element).closest('.container').find('.swiper-arrow.sw-button-next')[0],
        prevEl: $(element).closest('.container').find('.swiper-arrow.sw-button-prev')[0],
      },
    };

    if ($(element).closest('.swiper-carousel').hasClass('reviews-module')) {
      swiperOptions.spaceBetween = 40;
    }
    
    if ($(element).closest('.swiper-carousel').hasClass('certificates-module')) {
      // swiperOptions.lazy = true;
      swiperOptions.freeMode = true;
    }

    if ($(element).closest('.swiper-carousel').hasClass('news-module')) {
      swiperOptions.spaceBetween = 40;
    }

    var swiperInstance = new Swiper(element, swiperOptions);
  });

  // const swiperCarousel = new Swiper('.swiper-carousel', {
  //   slidesPerView: "auto",
  //   // breakpoints: {
  //   //   // when window width is >= 0px
  //   //   0: {
  //   //     slidesPerView: 2,
  //   //     spaceBetween: 30
  //   //   },
  //   //   // when window width is >= 992px
  //   //   1141: {
  //   //     slidesPerView: 3,
  //   //     spaceBetween: 30
  //   //   }
  //   // },
  //   // slidesPerGroup: 1,
  //   spaceBetween: 30,
  //   speed: 400,
  //   grabCursor: true,
  //   pagination: {
  //     el: '.sw-pagination',
  //     type: 'bullets',
  //     clickable: true,
  //     dynamicBullets: true,
  //     dynamicMainBullets: 3,
  //   },
  //   navigation: {
  //     nextEl: '.swiper-arrow.sw-button-next',
  //     prevEl: '.swiper-arrow.sw-button-prev',
  //   }
  // });


  /** Fancybox Module **/
  Fancybox.bind("[data-fancybox]", {
    hideScrollbar: false,
    wheel: "slide",
    placeFocusBack: false,
    Images: {
      // Disable animation from/to thumbnail on start/close
      // zoom: false,
    },
    Thumbs: {
      type: 'classic',
    },
    on: {
      "reveal": (fancybox, slide) => {
        $('html').addClass('fancy-ready');
      },
      "close": (fancybox, slide) => {
        $('html').removeClass('fancy-ready');
      },
    },
  });


  
}); // document.ready END



/** Modal Window **/
let isAnimating = false;
const $reviewModal = $('#reviewModal');

$(document).on('click', '.review_item .read-more', function () {
  if (isAnimating) return;
  isAnimating = true;

  var $reviewItem = $(this).closest('.swiper-slide');
  var $modalBody = $('#reviewModal .modal-body');

  $modalBody.html($reviewItem.html());

  $('body').addClass('modal-open');
  $reviewModal.css('display', 'flex');

  setTimeout(function () {
      $reviewModal.addClass('show');
      isAnimating = false;
  }, 100);
});

$(document).on('click', '.modal .close', function () {
  if (isAnimating) return;
  isAnimating = true;

  $reviewModal.removeClass('show').one('transitionend', function () {
    $(this).hide();
    $('body').removeClass('modal-open');
    isAnimating = false;
  });
});

$(document).on('click', '.modal-content', function (e) {
  e.stopPropagation();
});

$(document).on('click', '#reviewModal', function () {
  if (isAnimating) return;
  isAnimating = true;

  $reviewModal.removeClass('show').one('transitionend', function () {
    $(this).hide();
    $('body').removeClass('modal-open');
    isAnimating = false;
  });
});



/** Review translate btn toggle **/
$(document).on('click', '.translate_review', function () {
  var $review = $(this).closest('.review_item');
  var isTranslated = $review.hasClass('show_translated');
  $review.toggleClass('show_translated show_original');
  $(this).attr('hover-tooltip', isTranslated ? 'Show translated text' : 'Show original text')
});



/** Google Map **/
async function createMap() {
  const mapOptions = {
      center: { lat: 48.134613, lng: 11.591279 },
      zoom: 13,
      styles: [
          { featureType: "all", elementType: "all", stylers: [{ saturation: "-100" }] },
          { featureType: "all", elementType: "geometry", stylers: [{ gamma: "1.50" }, { lightness: "30" }] },
          { featureType: "all", elementType: "labels", stylers: [{ lightness: "20" }] },
          { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] }
      ],
      maxZoom: 20,
      minZoom: 0,
      mapTypeId: 'roadmap',
      clickableIcons: false,
      disableDoubleClickZoom: false,
      draggable: true,
      keyboardShortcuts: false,
      scrollwheel: false,
      fullscreenControl: false,
      mapTypeControl: false,
      rotateControl: false,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
  };

  const map = new google.maps.Map(document.getElementById('map'), mapOptions);

  const markerData = [
      { lat: 48.15285, lng: 11.566437, title: 'Location #1' },
      { lat: 48.112887, lng: 11.547258, title: 'Location #2' },
  ];

  const createMarker = ({ lat, lng, color, title }) => {
      new google.maps.Marker({
          map: map,
          position: { lat, lng },
          title: title,
          icon: {
              path: 'M11 2c-3.9 0-7 3.1-7 7 0 5.3 7 13 7 13 0 0 7-7.7 7-13 0-3.9-3.1-7-7-7Zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5 0-1.4 1.1-2.5 2.5-2.5 1.4 0 2.5 1.1 2.5 2.5 0 1.4-1.1 2.5-2.5 2.5Z',
              scale: 1.65,
              anchor: new google.maps.Point(11, 22),
              fillOpacity: 1,
              fillColor: '#cea95d',
              strokeOpacity: 0,
          }
      });
  };

  markerData.forEach(createMarker);
}

createMap();