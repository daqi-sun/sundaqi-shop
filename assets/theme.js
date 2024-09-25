window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  document.addEventListener(
    'shopify:section:load',
    this._onSectionLoad.bind(this)
  );
  document.addEventListener(
    'shopify:section:unload',
    this._onSectionUnload.bind(this)
  );
  document.addEventListener(
    'shopify:section:select',
    this._onSelect.bind(this)
  );
  document.addEventListener(
    'shopify:section:deselect',
    this._onDeselect.bind(this)
  );
  document.addEventListener(
    'shopify:block:select',
    this._onBlockSelect.bind(this)
  );
  document.addEventListener(
    'shopify:block:deselect',
    this._onBlockDeselect.bind(this)
  );
  document.addEventListener(
    'shopify:section:reorder',
    this._onSectionReorder.bind(this)
  );

};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.theme = window.theme || {};

var handleizeStr = function (str) {
  return str.toLowerCase().replace(/[^\w\u00C0-\u024f]+/g, "-").replace(/^-+|-+$/g, "");
};
function checkFirstIndexSection () {

  var isSlideshowFirstSection = false;
  var main_wrapper = document.querySelector('#MainContent');

  var slideShowFirst = false;
  if(main_wrapper) {
    var first_shopifySection = main_wrapper.querySelectorAll('.shopify-section')[0];
    if(first_shopifySection) {
      if(first_shopifySection.classList.contains('index-section--slideshow')) {
        isSlideshowFirstSection = true;
        slideShowFirst = true;

        if(first_shopifySection.querySelector('.slideshow-section-wrapper').classList.contains('page-width')) {
          isSlideshowFirstSection = false;
        }
      }
    }
  }


  if(isSlideshowFirstSection) {
    var isSlideshowFirstSection = false;
    var main_wrapper = document.querySelector('#MainContent');
    var no_overlapHeader = document.querySelector('#shopify-section-header').classList.contains('no-overlap');
    if(!no_overlapHeader) {
      if(main_wrapper) {
        var first_shopifySection = main_wrapper.querySelectorAll('.shopify-section')[0];
        if(first_shopifySection) {
          if(first_shopifySection.classList.contains('index-section--slideshow')) {
            isSlideshowFirstSection = true;


            if(first_shopifySection.querySelector('.slideshow-section-wrapper').classList.contains('page-width')) {
              isSlideshowFirstSection = false;
            }

          }
        }
      }
    }


    if(document.querySelector('#shopify-section-header')) {
      if(!isSlideshowFirstSection) {
        document.querySelector('#shopify-section-header').classList.add('showAlternateHeader');
      } else {
        document.querySelector('#shopify-section-header').classList.remove('showAlternateHeader');
      }
    }
  } else {


    var noOverlap  = false;
    var showAlternateHeader  = false;
    var custom_page_header_section = document.querySelector('.custom_page_header_section');
    var alternate_logo  = document.querySelector('.alternate_logo');
    var main_logo =  document.querySelector('.main_logo');
    var PageContainer = document.querySelector('#PageContainer');

    if(!custom_page_header_section)  {
      showAlternateHeader = true;
    }

    if(document.querySelector('.no-overlap')) {
      showAlternateHeader = true;
      noOverlap = true;
    }

    if(slideShowFirst) {
      showAlternateHeader = true;
    }



    if(showAlternateHeader) {

      if(PageContainer) {
        if(!noOverlap) {
          PageContainer.classList.add('marginTop');
        }
      }
       if(document.querySelector('#shopify-section-header')) {
      document.querySelector('#shopify-section-header').classList.add('showAlternateHeader');
       }
      if(alternate_logo) {
        alternate_logo.classList.remove('hide');
        main_logo.classList.add('hide');
      }
    } else {

      document.querySelector('#shopify-section-header').classList.remove('showAlternateHeader');
      if(PageContainer) {
        PageContainer.classList.remove('marginTop');
      }

      if(alternate_logo) {
        alternate_logo.classList.add('hide');
        main_logo.classList.remove('hide');
      }
    }
  }
};

theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var id = container.getAttribute('data-section-id');
    var type = container.getAttribute('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = Object.assign(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {

    var container = document.querySelector(
      '[data-section-id="' + evt.detail.sectionId + '"]'
    );

    if (container) {
      this._createInstance(container);
    }
    checkFirstIndexSection();
    if(container.classList.contains('fade-in-animation')) {
      container.classList.add('fadeIn-animation');
    }
    var zoomFadeAnimationElems = container.querySelectorAll('.zoom-fade-animation:not(.zoomFade-animation)');

    if(zoomFadeAnimationElems.length) {
      zoomFadeAnimationElems.forEach(function(block,index) {
        var  containerPosition = block.getBoundingClientRect();
        if(containerPosition.top + 200 < window.innerHeight) {
          block.classList.add('zoomFade-animation');
        }
      });
    }

    if (window.SPR) {
      window.SPR.initDomEls();
      window.SPR.loadProducts();
    }

  },
  _onSectionReorder: function(evt) {
  checkFirstIndexSection();
  },
  _onSectionUnload: function(evt) {

    var sectionEl = evt.target;


    checkFirstIndexSection();


    this.instances = this.instances.filter(function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (typeof instance.onUnload === 'function') {
          instance.onUnload(evt);
        }
      }
      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (
      typeof instance !== 'undefined' &&
      typeof instance.onSelect === 'function'
    ) {
      instance.onSelect(evt);
    }
     checkFirstIndexSection();
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (
      typeof instance !== 'undefined' &&
      typeof instance.onDeselect === 'function'
    ) {
      instance.onDeselect(evt);
    }
     checkFirstIndexSection();
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (
      typeof instance !== 'undefined' &&
      typeof instance.onBlockSelect === 'function'
    ) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = this.instances.find(function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (
      typeof instance !== 'undefined' &&
      typeof instance.onBlockDeselect === 'function'
    ) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {

    this.constructors[type] = constructor;

    document.querySelectorAll('[data-section-type="' + type + '"]').forEach(
      function(container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

checkFirstIndexSection();

window.slate = window.slate || {};

/**
 * Slate utilities
 * -----------------------------------------------------------------------------
 * A collection of useful utilities to help build your theme
 *
 *
 * @namespace utils
 */

slate.utils = {
  /**
   * Get the query params in a Url
   * Ex
   * https://mysite.com/search?q=noodles&b
   * getParameterByName('q') = "noodles"
   * getParameterByName('b') = "" (empty value)
   * getParameterByName('test') = null (absent)
   */
  getParameterByName: function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },

  resizeSelects: function(selects) {
    selects.forEach(function(select) {
      var arrowWidth = 55;

      var test = document.createElement('span');
      test.innerHTML = select.selectedOptions[0].label;

      document.querySelector('.site-footer').appendChild(test);

      var width = test.offsetWidth + arrowWidth;
      test.remove();

      select.style.width = width + 'px';
    });
  },

  keyboardKeys: {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    LEFTARROW: 37,
    RIGHTARROW: 39
  }
};

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {NodeList} options.tables - Elements of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    options.tables.forEach(function(table) {
      var wrapper = document.createElement('div');
      wrapper.classList.add(options.tableWrapperClass);

      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {NodeList} options.iframes - Elements of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    options.iframes.forEach(function(iframe) {
      var wrapper = document.createElement('div');
      wrapper.classList.add(options.iframeWrapperClass);

      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);

      iframe.src = iframe.src;
    });
  }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  state: {
    firstFocusable: null,
    lastFocusable: null
  },
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects
   *
   * @param {HTMLElement} element - The element to be acted upon
   */
  pageLinkFocus: function(element) {
    if (!element) return;
    var focusClass = 'js-focus-hidden';

    element.setAttribute('tabIndex', '-1');
    element.focus();
    element.classList.add(focusClass);
    element.addEventListener('blur', callback, { once: true });

    function callback() {
      element.classList.remove(focusClass);
      element.removeAttribute('tabindex');
    }
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {HTMLElement} options.container - Container to trap focus within
   * @param {HTMLElement} options.elementToFocus - Element to be focused when focus leaves container
   */
  trapFocus: function(options) {
    var focusableElements = Array.from(
      options.container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      )
    ).filter(function(element) {
      var width = element.offsetWidth;
      var height = element.offsetHeight;

      return (
        width !== 0 &&
        height !== 0 &&
        getComputedStyle(element).getPropertyValue('display') !== 'none'
      );
    });

    this.state.firstFocusable = focusableElements[0];
    this.state.lastFocusable = focusableElements[focusableElements.length - 1];

    if (!options.elementToFocus) {
      options.elementToFocus = options.container;
    }

    options.container.setAttribute('tabindex', '-1');
    options.elementToFocus.focus();

    this._setupHandlers();

    document.addEventListener('focusin', this._onFocusInHandler);
    document.addEventListener('focusout', this._onFocusOutHandler);
  },

  _setupHandlers: function() {
    if (!this._onFocusInHandler) {
      this._onFocusInHandler = this._onFocusIn.bind(this);
    }

    if (!this._onFocusOutHandler) {
      this._onFocusOutHandler = this._onFocusIn.bind(this);
    }

    if (!this._manageFocusHandler) {
      this._manageFocusHandler = this._manageFocus.bind(this);
    }
  },

  _onFocusOut: function() {
    document.removeEventListener('keydown', this._manageFocusHandler);
  },

  _onFocusIn: function(evt) {
    if (
      evt.target !== this.state.lastFocusable &&
      evt.target !== this.state.firstFocusable
    )
      return;

    document.addEventListener('keydown', this._manageFocusHandler);
  },

  _manageFocus: function(evt) {
    if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

    /**
     * On the last focusable element and tab forward,
     * focus the first element.
     */
    if (evt.target === this.state.lastFocusable && !evt.shiftKey) {
      evt.preventDefault();
      this.state.firstFocusable.focus();
    }
    /**
     * On the first focusable element and tab backward,
     * focus the last element.
     */
    if (evt.target === this.state.firstFocusable && evt.shiftKey) {
      evt.preventDefault();
      this.state.lastFocusable.focus();
    }
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {HTMLElement} options.container - Container to trap focus within
   */
  removeTrapFocus: function(options) {
    if (options.container) {
      options.container.removeAttribute('tabindex');
    }
    document.removeEventListener('focusin', this._onFocusInHandler);
  },

  /**
   * Add aria-describedby attribute to external and new window links
   *
   * @param {object} options - Options to be used
   * @param {object} options.messages - Custom messages to be used
   * @param {HTMLElement} options.links - Specific links to be targeted
   */
  accessibleLinks: function(options) {
    var body = document.querySelector('body');

    var idSelectors = {
      newWindow: 'a11y-new-window-message',
      external: 'a11y-external-message',
      newWindowExternal: 'a11y-new-window-external-message'
    };

    if (options.links === undefined || !options.links.length) {
      options.links = document.querySelectorAll(
        'a[href]:not([aria-describedby])'
      );
    }

    function generateHTML(customMessages) {
      if (typeof customMessages !== 'object') {
        customMessages = {};
      }

      var messages = Object.assign(
        {
          newWindow: 'Opens in a new window.',
          external: 'Opens external website.',
          newWindowExternal: 'Opens external website in a new window.'
        },
        customMessages
      );

      var container = document.createElement('ul');
      var htmlMessages = '';

      for (var message in messages) {
        htmlMessages +=
          '<li id=' + idSelectors[message] + '>' + messages[message] + '</li>';
      }

      container.setAttribute('hidden', true);
      container.innerHTML = htmlMessages;

      body.appendChild(container);
    }

    function _externalSite(link) {
      var hostname = window.location.hostname;

      return link.hostname !== hostname;
    }

    options.links.forEach(function(link) {
      var target = link.getAttribute('target');
      var rel = link.getAttribute('rel');
      var isExternal = _externalSite(link);
      var isTargetBlank = target === '_blank';

      if (isExternal) {
        link.setAttribute('aria-describedby', idSelectors.external);
      }

      if (isTargetBlank) {
        if (!rel || rel.indexOf('noopener') === -1) {
          var relValue = rel === undefined ? '' : rel + ' ';
          relValue = relValue + 'noopener';
          link.setAttribute('rel', relValue);
        }

        link.setAttribute('aria-describedby', idSelectors.newWindow);
      }

      if (isExternal && isTargetBlank) {
        link.setAttribute('aria-describedby', idSelectors.newWindowExternal);
      }
    });

    generateHTML(options.messages);
  }
};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function() {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
    );

    if (match !== null) {
      if (match[2] !== undefined) {
        return match[1] + match[2];
      } else {
        return match[1];
      }
    } else {
      return null;
    }
  }

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

theme.TapAddToCart = function(element) {
    let start = 0,
        delay = 200, // 时间限制避免长按
        moved = false; // 是否发生滑动
      element.addEventListener("touchstart", function(e){
          moved = false; // 滑动标识置为 false
          start = +new Date(); // 开始计时
      });
      element.addEventListener("touchmove", function(e){
          moved = true; // 滑动标识置为 true
      });
      element.addEventListener("touchend", function(e){
          if(moved) return; // 滑动则不触发 tap
          let cur = +new Date();
          if(cur - start > delay) return; // 长按超时则不触发 tap
          ptengine.track("add_cart"); // 触发 tap
      });
};

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.container = options.container;
    this.product = options.product;
    this.originalSelectorId = options.originalSelectorId;
    this.enabledPickAnOption = options.pickAnOption;
    this.enabledShow_preOrder_btn = options.show_preOrder_btn;

    this.enableLinkedOptions = options.enableLinkedOptions;
    this.enableHistoryState = options.enableHistoryState;
    this.singleOptions = this.container.querySelectorAll(
      options.singleOptionSelector
    );
    this.singleOptionColorSelect = this.container.querySelector(
      options.singleOptionColorSelector
    );
    this.currentVariant = this._getVariantFromOptions();

    this._initGallery();
    this.singleOptions.forEach(
      function(option) {
        option.addEventListener('change', this._onSelectChange.bind(this));
      }.bind(this)
    );

    if(this.singleOptionColorSelect) {
      this.singleOptionColorSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

//     this.delegateElement = new Delegate(this.container.querySelector('[data-product-single-media-group]'));

    this.delegateElement = new Delegate(this.container);



        this.delegateElement.on('model:played','[data-product-single-media-group]', this._disableDrag.bind(this));
        this.delegateElement.on('model:paused','[data-product-single-media-group]', this._enableDrag.bind(this));



  }

  Variants.prototype = Object.assign({}, Variants.prototype, {
    _initGallery: function (startIndex) {

      var main_slider = this.container.querySelector('.product-single__media__carousel');
      var thumbnails_slider = this.container.querySelector('.thumbnails-slider');
      var main_slider_options = JSON.parse(main_slider.getAttribute('data-flickity-config'));
      var product_image__zoom = this.container.querySelector('.product_image__zoom');
      var thumbnails_grid = this.container.querySelector('.thumbnails-grid');
      if(main_slider) {


        if(startIndex) {
        main_slider_options.initialIndex  = startIndex;
        }

        this.flickityInstance = new Flickity(main_slider, main_slider_options);
        this.flickityInstance.element.classList.add("rendered");

        var _this = this;



        var slider = this.container.querySelector('[data-product-main-slider]');

        var flkty = Flickity.data(slider);
        document.querySelector('.product__media__arrows .btn-previous').onclick = function(){
          flkty.previous();
        };
        document.querySelector('.product__media__arrows .btn-next').onclick = function(){
          flkty.next();
        };
        this.flickityInstance.on( 'select', function( index ) {

          var flickity_slider = _this.flickityInstance.element;
          var videoSlides = flickity_slider.querySelectorAll("[data-product-media-type-video]");
          var modelViewerSlides = flickity_slider.querySelectorAll("[data-product-media-type-model]");
          var selectedSlide = _this.flickityInstance.selectedElement;

          document.querySelectorAll('.product-single__thumbnails-block').forEach(function(elem){
            elem.classList.remove('selected');
          });

          document.querySelector('.product-single__thumbnails-block[data-thumb-index="'+selectedSlide.getAttribute("data-media-index")+'"]').classList.add('selected');
          //document.querySelector('.product__media__pagination .current').innerHTML = parseInt(selectedSlide.getAttribute("data-media-index")) + parseInt(1);

          if(videoSlides.length > 0) {
            videoSlides.forEach(function(item,index) {
              var isVideoTag = item.querySelector('video');
              if(isVideoTag) {
                var videoId = isVideoTag.getAttribute('id');
                var videoObj = document.getElementById(videoId);
                if(videoObj) {
                  videoObj.pause();
                }
              } else {
                var videoId = item.querySelector('iframe').getAttribute('id');
                var player = YT.get(videoId);
                if(player) {
                  player.pauseVideo();
                }
              }
            });
          }

          var selectedSlideVideo = selectedSlide.querySelector("[data-product-media-type-video]");
          if(selectedSlideVideo) {
            var isVideoTag = selectedSlideVideo.querySelector('video');
            if(isVideoTag) {
              var videoId = isVideoTag.getAttribute('id');
              var videoObj = document.getElementById(videoId);
              if(videoObj) {
                videoObj.play();
              }
            } else {
              var videoId = selectedSlideVideo.querySelector('iframe').getAttribute('id');
              var player = YT.get(videoId);
              if(player) {
                player.playVideo();
              }
            }
          }

          var selectedSlideModel = selectedSlide.querySelector("[data-product-media-type-model]");
          if(selectedSlideModel) {
            var modelViewerEl = selectedSlide.querySelector('model-viewer');
            if(modelViewerEl) {
              modelViewerEl.dispatchEvent(new CustomEvent('mediaVisible', {bubbles: true,cancelable: true}));
            }
          } else {
            if(modelViewerSlides.length > 0) {
              modelViewerSlides.forEach(function(item,index) {
                var modelViewerEl = item.querySelector('model-viewer');
                if(modelViewerEl) {
                  modelViewerEl.dispatchEvent(new CustomEvent('mediaHidden', {bubbles: true,cancelable: true}));
                }
              });
            }



          }
        });

      }
      if(thumbnails_slider) {
        var thumbnails_slider_options = JSON.parse(thumbnails_slider.getAttribute('data-thumb_flickity_options'));
        thumbnails_slider_options.asNavFor = main_slider;
        var thumb_flickityInstance = new Flickity(thumbnails_slider, thumbnails_slider_options);
      }
      if(product_image__zoom) {
        var imagesArr = main_slider.querySelectorAll('.image_type');
        if(imagesArr.length) {
          imagesArr.forEach(function (item,index) {
            item.addEventListener('click', function (e) {
              e.preventDefault();

              var pswpElement = document.querySelectorAll('.pswp')[0];

              var items = [];
              var thumbnails = '';
              imagesArr.forEach(function (imageEl,index) {
                var imageObj = {
                  src: imageEl.getAttribute('data-image-url'),
                  w: +(imageEl.getAttribute('data-image-width')),
                  h: +(imageEl.getAttribute('data-image-height'))
                }
                items.push(imageObj);
                thumbnails += '<div class="product_thumbnail"><img src="'+ imageEl.getAttribute('data-image-url') +'" /></div>';
              });

              var options = {
                index: item.getAttribute('data-media-index'),
                zoomEl: false,
                shareEl: false,
                fullscreenEl: false,
                counterEl: false,
                closeOnScroll :false,
                closeOnVerticalDrag :false
              };

              var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
              gallery.init();

              gallery.listen('afterChange', function(index){
                document.querySelector('.photoSwipe_innerthumbs .product_thumbnail.selected').classList.remove('selected');
                document.querySelectorAll('.photoSwipe_innerthumbs .product_thumbnail')[gallery.getCurrentIndex()].classList.add('selected');
              });

              if(thumbnails != ''){
                document.querySelector('div.photoSwipe_innerthumbs').innerHTML = thumbnails;
                document.querySelectorAll("div.photoSwipe_innerthumbs .product_thumbnail")[gallery.getCurrentIndex()].classList.add('selected');

                document.querySelectorAll("div.photoSwipe_innerthumbs .product_thumbnail").forEach(function(thumb, index){
                  thumb.onclick = function(){
                    document.querySelector("div.photoSwipe_innerthumbs .product_thumbnail.selected").classList.remove('selected');
                    thumb.classList.add('selected');
                    gallery.goTo(index);
                  }
                });
                document.querySelector('.pswp__button--close').addEventListener('click', function(e) {
                  gallery.destroy();
                });
              }

            });
          });
        }

      }
      if(thumbnails_grid) {
        var thumbnail_images = thumbnails_grid.querySelectorAll('.product-single__thumbnails-block');
        if(thumbnail_images.length) {
          thumbnail_images.forEach(function (thumb,index){
            thumb.addEventListener('click', function(e) {
              e.preventDefault();
              thumbnails_grid.querySelector('.product-single__thumbnails-block.selected').classList.remove('selected');
              thumb.classList.add('selected');
              _this.flickityInstance.select(index);
              document.dispatchEvent(
                new CustomEvent('imageChange', {
                  detail: {},
                  bubbles: true,
                  cancelable: true
                })
              );
            });
          });
        }
      }

    },

    _disableDrag: function (event) {
      this.flickityInstance.options.draggable = false;
      this.flickityInstance.updateDraggable();
    },
    _enableDrag: function (event) {

      this.flickityInstance.options.draggable = true;
      this.flickityInstance.updateDraggable();
    },
    _getCurrentOptions: function() {
      var result = [];

      this.singleOptions.forEach(function(option) {
        var type = option.getAttribute('type');
        var isRadioOrCheckbox = type === 'radio' || type === 'checkbox';

        if (!isRadioOrCheckbox || option.checked) {
          result.push({
            value: option.value,
            index: option.getAttribute('data-index')
          });
        }
      });

      return result;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;

      var found = variants.find(function(variant) {
        return selectedValues.every(function(values) {
          return variant[values.index] === values.value;
        });
      });

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function(e) {
      var variant = this._getVariantFromOptions();

      if(this.enabledPickAnOption) {
        if (!variant) {
          return;
        } else {
          var form = this.container.querySelector('.disabled_btns');
          if(form) {

            var submit_btn = form.querySelector('[type="submit"]');
            form.classList.remove('disabled_btns');
            if(submit_btn) {
              submit_btn.disabled = false;
            }
          }
        }
      }

      if(variant){
        var form = this.container.querySelector('.disabled_btns');
        if(form) {
          var submit_btn = form.querySelector('[type="submit"]');
          form.classList.remove('disabled_btns');
          if(submit_btn) {
            submit_btn.disabled = false;
          }
        }
      }

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }

      this._updateMasterSelect(variant);

      this.container.dispatchEvent(
        new CustomEvent('variantChange', {
          detail: {
            variant: variant
          },
          bubbles: true,
          cancelable: true
        })
      );


      if (!variant) {
        return;
      }



      this._updateImages(variant,e);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;


    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant,event) {


      var all_media__block = this.container.querySelector('.all_media__block');
      var all_thumb_media__block = this.container.querySelector('.all_thumb_media__block');
      var slider = this.container.querySelector('[data-product-main-slider]');

      if(all_media__block) {

        var thumb_slider = this.container.querySelector('.product-single__thumbnails');
        var el_target = event.target;
        var optionName = el_target.getAttribute('data-option-name').toLowerCase();
        var optionValue = el_target.value.toLowerCase();

        var rebuild_flag = false;

        slider.querySelectorAll('.product-single__media__slide').forEach(function(item,index) {
          var item_wrapper = item.querySelector('[data-product-single-media-wrapper]');
          if(item_wrapper) {
          var itemOptionName = item_wrapper.getAttribute('data-media-option-name');
          if(itemOptionName == optionName) {
          	rebuild_flag = true;
          }
          }
        });

        if(rebuild_flag) {
          if(slider.classList.contains('flickity-enabled')) {
            var flkty = Flickity.data( slider );
            flkty.destroy();
          }
          var slider_old_images = slider.querySelectorAll('[product-image-media]');
          if(slider_old_images.length) {
            slider_old_images.forEach(function (imageEl,index) {
              var parentEl = imageEl.closest('.product-single__media__slide');
              if(parentEl) {
                parentEl.remove();
              }
            });
          }

//           slider.innerHTML = '';

          var show_default_image = true;
          all_media__block.querySelectorAll('.product-single__media__slide').forEach(function(item,index) {
            var item_wrapper = item.querySelector('[data-product-single-media-wrapper]');

            var itemOptionName = item_wrapper.getAttribute('data-media-option-name');
            var itemOptionValue = item_wrapper.getAttribute('data-media-option-value');

            if(itemOptionName == optionName && optionValue == itemOptionValue) {
              var clone = item.cloneNode(true);
              show_default_image = false;
              slider.prepend(clone);
            }
          });
          if(thumb_slider) {
            if(thumb_slider.classList.contains('flickity-enabled')) {
              var thumb_flkty = Flickity.data( thumb_slider );
              thumb_flkty.destroy();
            }

            var old_thumbs_images = thumb_slider.querySelectorAll('[product-image-media]');
            if(old_thumbs_images.length) {
              old_thumbs_images.forEach(function (imageEl,index) {
                imageEl.remove();
              });
            }

//             thumb_slider.innerHTML = '';

            all_thumb_media__block.querySelectorAll('.product-single__thumbnails-block').forEach(function(item,index) {

              var itemOptionName = item.getAttribute('data-media-option-name');
              var itemOptionValue = item.getAttribute('data-media-option-value');

              if(itemOptionName == optionName && optionValue == itemOptionValue) {
                var clone = item.cloneNode(true);
                thumb_slider.prepend(clone);
              }
            });

          }
          if(show_default_image) {
            all_media__block.querySelectorAll('.product-single__media__slide').forEach(function(item,index) {
              var clone = item.cloneNode(true);
              slider.prepend(clone);
            });
            if(thumb_slider) {
              all_thumb_media__block.querySelectorAll('.product-single__thumbnails-block').forEach(function(item,index) {
                var clone = item.cloneNode(true);
                thumb_slider.prepend(clone);
              });
            }
          }

          var featuredMediaIndex = 0;
          var variantMedia = variant.featured_media;
          if(variantMedia) {
            var variantMediaId = variant.featured_media.id;
            var featuredMedia =       slider.querySelector('.image_type[data-image-id="'+variantMediaId+'"]');
            if(featuredMedia) {
              var featuredMediaParent = featuredMedia.closest('.product-single__media__slide');
              if(featuredMediaParent) {
                featuredMediaIndex = [].slice.call(featuredMediaParent.parentNode.children).indexOf(featuredMediaParent);
              }

            }
          }

          this._initGallery(featuredMediaIndex);

        }
      } else {


        var variantImage = variant.featured_image || {};
        var currentVariantImage = this.currentVariant.featured_image || {};

        if (
          !variant.featured_image ||
          variantImage.src === currentVariantImage.src
        ) {
          return;
        }

        var featuredMediaIndex = 0;
        var variantMedia = variant.featured_media;
        if(variantMedia) {
          var variantMediaId = variant.featured_media.id;
          var featuredMedia =       slider.querySelector('.image_type[data-image-id="'+variantMediaId+'"]');
          if(featuredMedia) {
            var featuredMediaParent = featuredMedia.closest('.product-single__media__slide');
            if(featuredMediaParent) {
              featuredMediaIndex = [].slice.call(featuredMediaParent.parentNode.children).indexOf(featuredMediaParent);

              if(this.flickityInstance) {
                this.flickityInstance.selectCell(featuredMediaIndex);
              }
            }

          }
        }
      }








//       this.container.dispatchEvent(
//         new CustomEvent('variantImageChange', {
//           detail: {
//             variant: variant
//           },
//           bubbles: true,
//           cancelable: true
//         })
//       );
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {


      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price &&
        variant.unit_price === this.currentVariant.unit_price
      ) {
        return;
      }


      this.container.dispatchEvent(
        new CustomEvent('variantPriceChange', {
          detail: {
            variant: variant
          },
          bubbles: true,
          cancelable: true
        })
      );
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function(variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.container.dispatchEvent(
        new CustomEvent('variantSKUChange', {
          detail: {
            variant: variant
          },
          bubbles: true,
          cancelable: true
        })
      );
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {


      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?variant=' +
        variant.id;
      window.history.replaceState({ path: newurl }, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      var masterSelect = this.container.querySelector(this.originalSelectorId);

      document.querySelectorAll('.product-accessories-wrapper').forEach(function(parentElem){
        if(parentElem.querySelectorAll('.product-accessories-section[data-variant="'+variant.id+'"]').length > 0){
          parentElem.querySelectorAll('.product-accessories-section').forEach(function(elem){
            elem.classList.remove('selected');
          });
          parentElem.querySelector('.product-accessories-section[data-variant="'+variant.id+'"]').classList.add('selected');
          parentElem.style.display = 'block';
        }
        else{
          parentElem.style.display = 'none';
        }
      });

      if (!masterSelect) return;
      masterSelect.value = variant.id;
    }
  });

  return Variants;
})();

this.Shopify = this.Shopify || {};
this.Shopify.theme = this.Shopify.theme || {};


this.Shopify = this.Shopify || {};
this.Shopify.theme = this.Shopify.theme || {};

window.theme = window.theme || {};

theme.TouchEvents = function TouchEvents(element, options) {
  this.axis;
  this.checkEvents = [];
  this.eventHandlers = {};
  this.eventModel = {};
  this.events = [
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
    ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'],
    ['mousedown', 'mousemove', 'mouseup']
  ];
  this.eventType;
  this.difference = {};
  this.direction;
  this.start = {};

  this.element = element;
  this.options = Object.assign(
    {},
    {
      dragThreshold: 10,
      start: function() {}, // eslint-disable-line
      move: function() {}, // eslint-disable-line
      end: function() {} // eslint-disable-line
    },
    options
  );

  this.checkEvents = this._getCheckEvents();
  this.eventModel = this._getEventModel();

  this._setupEventHandlers();
};

theme.TouchEvents.prototype = Object.assign({}, theme.TouchEvents.prototype, {
  destroy: function() {
    this.element.removeEventListener(
      'dragstart',
      this.eventHandlers.preventDefault
    );

    this.element.removeEventListener(
      this.events[this.eventModel][0],
      this.eventHandlers.touchStart
    );

    if (!this.eventModel) {
      this.element.removeEventListener(
        this.events[2][0],
        this.eventHandlers.touchStart
      );
    }

    this.element.removeEventListener('click', this.eventHandlers.preventClick);
  },

  _setupEventHandlers: function() {
    this.eventHandlers.preventDefault = this._preventDefault.bind(this);
    this.eventHandlers.preventClick = this._preventClick.bind(this);
    this.eventHandlers.touchStart = this._touchStart.bind(this);
    this.eventHandlers.touchMove = this._touchMove.bind(this);
    this.eventHandlers.touchEnd = this._touchEnd.bind(this);

    // Prevent element from dragging when using mouse
    this.element.addEventListener(
      'dragstart',
      this.eventHandlers.preventDefault
    );

    // Bind the touchstart/pointerdown event
    this.element.addEventListener(
      this.events[this.eventModel][0],
      this.eventHandlers.touchStart
    );

    // Bind mousedown if necessary
    if (!this.eventModel) {
      this.element.addEventListener(
        this.events[2][0],
        this.eventHandlers.touchStart
      );
    }

    // No clicking during touch
    this.element.addEventListener('click', this.eventHandlers.preventClick);
  },

  _touchStart: function(event) {
    this.eventType = this.eventModel;

    if (event.type === 'mousedown' && !this.eventModel) {
      this.eventType = 2;
    }

    if (this.checkEvents[this.eventType](event)) return;
    if (this.eventType) this._preventDefault(event);

    document.addEventListener(
      this.events[this.eventType][1],
      this.eventHandlers.touchMove
    );

    document.addEventListener(
      this.events[this.eventType][2],
      this.eventHandlers.touchEnd
    );

    if (this.eventType < 2) {
      document.addEventListener(
        this.events[this.eventType][3],
        this.eventHandlers.touchEnd
      );
    }

    this.start = {
      xPosition: this.eventType ? event.clientX : event.touches[0].clientX,
      yPosition: this.eventType ? event.clientY : event.touches[0].clientY,
      time: new Date().getTime()
    };

    // Ensure we empty out the this.difference object
    Object.keys(this.difference).forEach(
      function(key) {
        delete this.difference[key];
      }.bind(this)
    );

    this.options.start(event);
  },

  _touchMove: function(event) {
    this.difference = this._getDifference(event);

    // Prevent document from scrolling during swipe gesture
    document['on' + this.events[this.eventType][1]] = function(event) {
      this._preventDefault(event);
    }.bind(this);

    // Get the direction user is dragging
    if (!this.axis) {
      if (this.options.dragThreshold < Math.abs(this.difference.xPosition)) {
        this.axis = 'xPosition';
      } else if (
        this.options.dragThreshold < Math.abs(this.difference.yPosition)
      ) {
        this.axis = 'yPosition';
      } else {
        this.axis = false;
      }
    } else if (this.axis === 'xPosition') {
      this.direction = this.difference.xPosition < 0 ? 'left' : 'right';
    } else if (this.axis === 'yPosition') {
      this.direction = this.difference.yPosition < 0 ? 'up' : 'down';
    }

    this.options.move(event, this.direction, this.difference);
  },

  _touchEnd: function(event) {
    document.removeEventListener(
      this.events[this.eventType][1],
      this.eventHandlers.touchMove
    );

    document.removeEventListener(
      this.events[this.eventType][2],
      this.eventHandlers.touchEnd
    );

    if (this.eventType < 2) {
      document.removeEventListener(
        this.events[this.eventType][3],
        this.eventHandlers.touchEnd
      );
    }

    // Re-enable document scrolling
    document['on' + this.events[this.eventType][1]] = function() {
      return true;
    };

    this.options.end(event, this.direction, this.difference);
    this.axis = false;
  },

  _getDifference: function(event) {
    return {
      xPosition:
        (this.eventType ? event.clientX : event.touches[0].clientX) -
        this.start.xPosition,
      yPosition:
        (this.eventType ? event.clientY : event.touches[0].clientY) -
        this.start.yPosition,
      time: new Date().getTime() - this.start.time
    };
  },

  _getCheckEvents: function() {
    return [
      // Touch events
      function(event) {
        // Skip the event if it's a multi-touch or pinch move
        return (
          (event.touches && event.touches.length > 1) ||
          (event.scale && event.scale !== 1)
        );
      },
      // Pointer events
      function(event) {
        // Skip it, if:
        // 1. The event is not primary (other pointers during multi-touch),
        // 2. Left mouse button is not pressed,
        // 3. Event is not a touch event
        return (
          !event.isPrimary ||
          (event.buttons && event.buttons !== 1) ||
          (event.pointerType !== 'touch' && event.pointerType !== 'pen')
        );
      },
      // Mouse events
      function(event) {
        // Skip the event if left mouse button is not pressed
        return event.buttons && event.buttons !== 1;
      }
    ];
  },

  _getEventModel: function() {
    return window.navigator.pointerEnabled ? 1 : 0;
  },

  _preventDefault: function(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  },

  _preventClick: function(event) {
    if (Math.abs(this.difference.xPosition) > this.options.dragThreshold) {
      this._preventDefault(event);
    }
  }
});

theme.Helpers = (function() {
  var touchDevice = false;

  var classes = {
    preventScrolling: 'prevent-scrolling'
  };

  var scrollPosition = window.pageYOffset;

  function setTouch() {
    touchDevice = true;
  }

  function isTouch() {
    return touchDevice;
  }

  function enableScrollLock() {
    scrollPosition = window.pageYOffset;
    document.body.style.top = '-' + scrollPosition + 'px';
    document.body.classList.add(classes.preventScrolling);
  }

  function disableScrollLock() {
    document.body.classList.remove(classes.preventScrolling);
    document.body.style.removeProperty('top');
    window.scrollTo(0, scrollPosition);
  }

  function debounce(func, wait, immediate) {
    var timeout;

    return function() {
      var context = this,
        args = arguments;

      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function getScript(source, beforeEl) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      var prior = beforeEl || document.getElementsByTagName('script')[0];

      script.async = true;
      script.defer = true;

      // eslint-disable-next-line shopify/prefer-early-return
      function onloadHander(_, isAbort) {
        if (
          isAbort ||
          !script.readyState ||
          /loaded|complete/.test(script.readyState)
        ) {
          script.onload = null;
          script.onreadystatechange = null;
          script = undefined;

          if (isAbort) {
            reject();
          } else {
            resolve();
          }
        }
      }

      script.onload = onloadHander;
      script.onreadystatechange = onloadHander;

      script.src = source;
      prior.parentNode.insertBefore(script, prior);
    });
  }

  /* Based on the prepareTransition by Jonathan Snook */
  /* Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition */
  function prepareTransition(element) {
    element.addEventListener(
      'transitionend',
      function(event) {
        event.currentTarget.classList.remove('is-transitioning');
      },
      { once: true }
    );

    var properties = [
      'transition-duration',
      '-moz-transition-duration',
      '-webkit-transition-duration',
      '-o-transition-duration'
    ];

    var duration = 0;

    properties.forEach(function(property) {
      var computedValue = getComputedStyle(element)[property];

      if (computedValue) {
        computedValue.replace(/\D/g, '');
        duration || (duration = parseFloat(computedValue));
      }
    });

    if (duration !== 0) {
      element.classList.add('is-transitioning');
      element.offsetWidth;
    }
  }

  /*!
   * Serialize all form data into a SearchParams string
   * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {Node}   form The form to serialize
   * @return {String}      The serialized form data
   */
  function serialize(form) {
    var arr = [];
    Array.prototype.slice.call(form.elements).forEach(function(field) {
      if (
        !field.name ||
        field.disabled ||
        ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1
      )
        return;
      if (field.type === 'select-multiple') {
        Array.prototype.slice.call(field.options).forEach(function(option) {
          if (!option.selected) return;
          arr.push(
            encodeURIComponent(field.name) +
              '=' +
              encodeURIComponent(option.value)
          );
        });
        return;
      }
      if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked)
        return;
      arr.push(
        encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value)
      );
    });
    return arr.join('&');
  }
  function cookiesEnabled() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
    }

    return cookieEnabled;
  }

  function promiseStylesheet(stylesheet) {
    var stylesheetUrl = stylesheet || theme.stylesheet;

    if (typeof this.stylesheetPromise === 'undefined') {
      this.stylesheetPromise = new Promise(function(resolve) {
        var link = document.querySelector('link[href="' + stylesheetUrl + '"]');

        if (link.loaded) resolve();

        link.addEventListener('load', function() {
          setTimeout(resolve, 0);
        });
      });
    }

    return this.stylesheetPromise;
  }

  return {
    setTouch: setTouch,
    isTouch: isTouch,
    enableScrollLock: enableScrollLock,
    disableScrollLock: disableScrollLock,
    debounce: debounce,
    getScript: getScript,
    prepareTransition: prepareTransition,
    serialize: serialize,
    cookiesEnabled: cookiesEnabled,
    promiseStylesheet: promiseStylesheet
  };
})();

theme.LibraryLoader = (function() {
  var types = {
    link: 'link',
    script: 'script'
  };

  var status = {
    requested: 'requested',
    loaded: 'loaded'
  };

  var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';

  var libraries = {
    plyrShopifyStyles: {
      tagId: 'plyr-shopify-styles',
      src: cloudCdn + 'plyr/v2.0/shopify-plyr.css',
      type: types.link
    },
    modelViewerUiStyles: {
      tagId: 'shopify-model-viewer-ui-styles',
      src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
      type: types.link
    }
  };

  function load(libraryName, callback) {
    var library = libraries[libraryName];

    if (!library) return;
    if (library.status === status.requested) return;

    callback = callback || function() {};
    if (library.status === status.loaded) {
      callback();
      return;
    }

    library.status = status.requested;

    var tag;

    switch (library.type) {
      case types.script:
        tag = createScriptTag(library, callback);
        break;
      case types.link:
        tag = createLinkTag(library, callback);
        break;
    }

    tag.id = library.tagId;
    library.element = tag;

    var firstScriptTag = document.getElementsByTagName(library.type)[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function createScriptTag(library, callback) {
    var tag = document.createElement('script');
    tag.src = library.src;
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  function createLinkTag(library, callback) {
    var tag = document.createElement('link');
    tag.href = library.src;
    tag.rel = 'stylesheet';
    tag.type = 'text/css';
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  return {
    load: load
  };
})();


/* ================ MODULES ================ */
window.theme = window.theme || {};

theme.Header = (function() {
  var selectors = {
    body: 'body',
    navigation: '#AccessibleNav',
    siteNavHasDropdown: '[data-has-dropdowns]',
    siteNavChildLinks: '.site-nav__child-link',
    siteNavActiveDropdown: '.site-nav--active-dropdown',
    siteNavHasCenteredDropdown: '.site-nav--has-centered-dropdown',
    siteNavCenteredDropdown: '.site-nav__dropdown--centered',
    siteNavLinkMain: '.site-nav__link--main',
    siteNavChildLink: '.site-nav__link--last',
    siteNavDropdown: '.site-nav__dropdown',
    siteHeader: '.site-header',
    headerCartLink: '#HeaderCart',
    disclosureLocale: '[data-disclosure-locale]',
    disclosureCurrency: '[data-disclosure-currency]'
  };

  var config = {
    activeClass: 'site-nav--active-dropdown',
    childLinkClass: 'site-nav__child-link',
    rightDropdownClass: 'site-nav__dropdown--right',
    leftDropdownClass: 'site-nav__dropdown--left'
  };

  var cache = {};

  if(document.querySelector('.header_top_temp_element') && document.querySelector(selectors.siteHeader).getAttribute('data-enable_overlap_header')){
    document.querySelector('.top-bar-shift').innerHTML = document.querySelector('.header_top_temp_element').innerHTML;
    document.querySelector('.header_top_temp_element').remove();
    setTimeout(function(){
      var box = document.querySelector('.top-bar-shift').getBoundingClientRect();
      document.documentElement.style.setProperty('--header-offset', box.top + 'px');
    }, 1000);
  }

  const documentHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
  }
  window.addEventListener('resize', documentHeight)
  documentHeight();

  function closeSearchMobileDropdown () {
    var header_toggle_search_btn = document.querySelector('.header-search-button.active');
    if(header_toggle_search_btn) {
      header_toggle_search_btn.classList.remove('active');
    }
    var searchDropdown = document.querySelector('.search-form__container.show_form');
    if(searchDropdown) {
      setTimeout(function(){ searchDropdown.classList.remove('show_form') }, 500);
      searchDropdown.querySelector('.predictive-search-wrapper').classList.remove('visible');
      document.querySelector('body').classList.remove('show_overlay');
      document.querySelector('body').classList.remove('show_search_overlay');
      document.querySelector('.mega_menu_overlay').style.display = 'none';
    }

  }
  function closeCartDrawer () {
    var Drawer = document.querySelector('.Drawer.show');
    if(Drawer) {
      Drawer.classList.remove('show');
      document.querySelector('body').classList.remove('show_overlay');
    }
  }


  function init() {
    cacheSelectors();
    styleDropdowns(document.querySelectorAll(selectors.siteNavHasDropdown));
    positionFullWidthDropdowns();
    if(cache.search_categories_menu_parent) {
    cache.search_categories_menu_parent.addEventListener('click', submenuParentClickHandler);
    }
    if(cache.customer_nav_dropdown_parent) {
    cache.customer_nav_dropdown_parent.addEventListener('click', submenuParentClickHandler);
    }

    cache.parents.forEach(function(element) {
      element.addEventListener('click', submenuParentClickHandler);
    });

    // check when we're leaving a dropdown and close the active dropdown
    cache.siteNavChildLink.forEach(function(element) {
      element.addEventListener('focusout', submenuFocusoutHandler);
    });

    cache.topLevel.forEach(function(element) {
      element.addEventListener('focus', hideDropdown);
    });

    cache.subMenuLinks.forEach(function(element) {
      element.addEventListener('click', stopImmediatePropagation);
    });

    window.addEventListener('resize', resizeHandler);


    var nav_bar = document.querySelector('.site-header__mobile-nav');
    if(nav_bar) {
      var nav_bar_links = nav_bar.querySelectorAll('.item-has-mega-menu');
      var menuItems = document.querySelectorAll('.has-mega-menu');


      function closeSearchDropdown() {

        var search_bar__interior = document.querySelector('.search-bar__interior');
        var searchPopoverEl  = document.querySelector('.predictive-search-wrapper--drawer');
        var searchBarElement = document.querySelector('form.search-bar__form');

        if(search_bar__interior && searchPopoverEl && searchBarElement) {
          if(search_bar__interior.classList.contains('is-fixed') &&  document.body.classList.contains('no-mobile-scroll')) {
            search_bar__interior.classList.remove('is-fixed');
            document.body.classList.remove('no-mobile-scroll');
            searchPopoverEl.setAttribute('aria-hidden', 'true');
            searchBarElement.classList.remove('is-expanded');
            if(document.querySelector('[data-predictive-search-drawer-input]')) {
              document.querySelector('[data-predictive-search-drawer-input]').blur();
            }
          }
        }
      }


      if(nav_bar_links.length) {
        var hi = new SV.HoverIntent(nav_bar_links, {
          onEnter: function(targetItem) {
            targetItem.classList.add('visible');
            targetItem.querySelector('.nav-bar__link').classList.add('active');
            if(targetItem.classList.contains('mega_menu_main_parent')){
              document.querySelector('.mega_menu_overlay').style.display = 'block';
            }
            closeSearchDropdown();
            hideDropdown();
          },
          onExit: function(targetItem) {
            targetItem.classList.remove('visible');
            targetItem.querySelector('.nav-bar__link').classList.remove('active');
            var targetItemLinks = targetItem.querySelectorAll('.link');
            document.querySelector('.mega_menu_overlay').style.display = 'none';
            if(targetItemLinks.length) {
              targetItemLinks.forEach(function (link,index) {
                link.blur();
              });
            }
          },
          exitDelay: 0,
          interval: 0,
          sensitivity: 7,
        });

        document.addEventListener('click', function(e){
          var el = e.target;
          if(el.classList.contains('mega_menu_overlay')) {
            if(document.querySelectorAll('.item-has-mega-menu.visible').length > 0){
              document.querySelectorAll('.item-has-mega-menu.visible').forEach(function(elem, index){
                elem.querySelector('.nav-bar__link.active').classList.remove('active');
                elem.classList.remove('visible');
              });
            }
            document.querySelector('.mega_menu_overlay').style.display = 'none';
            document.querySelector('body').classList.remove('overflow-hidden');
          }
        });
      }

      if(menuItems.length) {
        var hi = new SV.HoverIntent(menuItems, {
          onEnter: function(targetItem) {
            targetItem.classList.add('visible');
            closeSearchDropdown();
            hideDropdown();
          },
          onExit: function(targetItem) {
            targetItem.classList.remove('visible');
          },
          exitDelay: 300,
          interval: 100,
          sensitivity: 7,
        });
      }
    }




    var headerCartLink = document.querySelector(selectors.headerCartLink);
    if(headerCartLink) {
      headerCartLink.addEventListener('click', function(e) {
        e.preventDefault();

        var link_type = this.getAttribute('data-link-type');
        if( link_type == 'drawer') {


          closeSearchMobileDropdown();
          if(document.querySelector('.js-menu--is-open')) {
            theme.MobileNav.closeMobileNav();
          }

        	var card_drawer = document.querySelector('#sidebar-cart');
          if(card_drawer) {
          	card_drawer.classList.add('show');
            document.querySelector('body').classList.add('show_overlay');
                card_drawer.addEventListener('transitionend', () => {
                card_drawer.focus();

                slate.a11y.trapFocus({
                container: card_drawer,
                elementToFocus: card_drawer
              });
          }, { once: true });
          }
        } else {
        	window.location.href = window.routes.cartUrl;
        }
      });
    }


    var search_product_type_Dropdown = document.querySelector('#search-product-type');
    if(search_product_type_Dropdown) {
      search_product_type_Dropdown.addEventListener('click', function(e) {
      	e.preventDefault();

        var el = e.target;

        var search_product_type_Dropdown = el.closest('#search-product-type');
        var search_categories_menuParent = el.closest('[data-search-form-container]');
        var search_labelEl = search_categories_menuParent.querySelector('.search_categories_button__label');
        var value = el.getAttribute('data-value');
        search_product_type_Dropdown.setAttribute('data-search-type', value);
        if(search_labelEl) {
        search_labelEl.innerHTML = value;
        }
        var inputElement = search_categories_menuParent.querySelector('[data-predictive-search-drawer-input]');
        if(inputElement) {
          if (inputElement.value !== '') {
            inputElement.dispatchEvent(new Event('keyup', { bubbles: true }));
          }
        }

      });
    }

    var header_toggle_search_btn = document.querySelector('.header-search-button');
    if(header_toggle_search_btn) {
      header_toggle_search_btn.addEventListener('click', function(e) {
        e.preventDefault();

        if(document.querySelector('.js-menu--is-open')) {
          theme.MobileNav.closeMobileNav();
        }
        closeCartDrawer ();

        var btn_parent = this.closest('.search-bar__interior');
        var searchDropdown = btn_parent.querySelector('.search-form__container');
        if(searchDropdown) {
          if(this.classList.contains('active')) {
            searchDropdown.classList.remove('show_form');
            searchDropdown.querySelector('.predictive-search-wrapper').classList.remove('visible');
            this.classList.remove('active');
            document.querySelector('body').classList.remove('show_overlay');
            document.querySelector('body').classList.remove('show_search_overlay');
            document.querySelector('.mega_menu_overlay').style.display = 'none';
          } else {
            searchDropdown.classList.add('show_form');
            setTimeout(function(){ searchDropdown.querySelector('.predictive-search-wrapper').classList.add('visible'); }, 100);
            this.classList.add('active');
            document.querySelector('body').classList.add('show_overlay');
            document.querySelector('body').classList.add('show_search_overlay');
            document.querySelector('.mega_menu_overlay').style.display = 'block';
          }
        }
      });

      var search_close_btn = document.querySelector('.search-close');
      if(search_close_btn) {
        search_close_btn.addEventListener('click', function(e) {
          e.preventDefault();

          if(document.querySelector('.js-menu--is-open')) {
            theme.MobileNav.closeMobileNav();
          }
          closeCartDrawer ();

          var btn_parent = this.closest('.search-bar__interior');
          var searchDropdown = btn_parent.querySelector('.search-form__container');
          if(searchDropdown) {
            setTimeout(function(){ searchDropdown.classList.remove('show_form') }, 400);
            searchDropdown.querySelector('.predictive-search-wrapper').classList.remove('visible');
            document.querySelector('.header-search-button').classList.remove('active');
            document.querySelector('body').classList.remove('show_overlay');
            setTimeout(function(){ document.querySelector('body').classList.remove('show_search_overlay') }, 400);
          }
        });
      }

      document.addEventListener('click', function(e){
        var el = e.target;
        if(document.querySelector('.show_search_overlay')) {

        }
        if(el.classList.contains('search-bar__interior') || el.closest('.search-bar__interior')) {
          return false;
        } else {
          theme.Header.closeSearchMobileDropdown();
        }
      });
    }

    var country_selector = document.querySelectorAll('[data-country-toggle]');
    if(country_selector.length > 0){
      document.querySelector('.country-selector-popup-wrapper').innerHTML = document.querySelector('#shopify-section-country-selector-popup').innerHTML;
      document.querySelector('#shopify-section-country-selector-popup').innerHTML = '';
      country_selector.forEach(function(element){
        element.addEventListener('click', function(e) {
          if(window.innerWidth < 750){
            document.querySelector('#shopify-section-announcement-bar').style.display = 'none';
            if(document.querySelector('.js-mobile-nav-toggle').getAttribute('aria-expanded') == 'true'){
              document.querySelector('.js-mobile-nav-toggle').click();
            }
          }
          document.getElementById('country-selector-popup').classList.add('visible');
          document.querySelector('body').classList.add('overflow-hidden');
        });
      });

      var popup_close = document.querySelectorAll('[data-country-popup-close]');
      popup_close.forEach(function(element){
        element.addEventListener('click', function(e) {
          document.getElementById('country-selector-popup').classList.remove('visible');
          document.querySelector('body').classList.remove('overflow-hidden');
          document.querySelector('#shopify-section-announcement-bar').style.display = 'block';
        });
      });
    }

    var search_submit_btn = document.querySelector(selectors.siteHeader).querySelector('.search-button__submit');
    if(search_submit_btn) {
      search_submit_btn.addEventListener('click', function(e) {
        e.preventDefault();
          var form = this.closest('.search-form__container');
          var formValue = form.querySelector('.search-form__input').value;
          var searchFilterEl = form.querySelector('#search-product-type');
          var formProductType = '*';
          if(searchFilterEl) {
            formProductType = searchFilterEl.getAttribute('data-search-type');
          }

          var productQuery = '' +  formValue + '*' + (formProductType !== '' ? ' AND ' + 'product_type:' + formProductType : '');
          if (window.theme.searchMode !== 'product') {
              productQuery = '' +  formValue + '*';
          }

          var formAction = window.routes.searchUrl + '?q=' + productQuery + '&type='+window.theme.searchMode;
          window.location.href = formAction;

      });
    }

    var enable_live_search = document.querySelector(selectors.siteHeader).getAttribute('data-enable_live_search');
    if(enable_live_search == 'true') {
      new theme.SearchBar(document.querySelector('.search-bar__interior'));
    }


    var enable_overlap_header = document.querySelector(selectors.siteHeader).getAttribute('data-enable_overlap_header');
    if(enable_overlap_header == 'false') {
      if(document.querySelector('#shopify-section-header')) {
        document.querySelector('#shopify-section-header').classList.add('showAlternateHeader');
        document.querySelector('#shopify-section-header').classList.add('no-overlap');
        document.querySelector('body').classList.add('no-overlap-header');
      }
    }


    if (cache.localeDisclosure.length) {
      cache.localeDisclosure.forEach(function (item,index) {
         new theme.Disclosure(item);
      });
    }
    if (cache.currencyDisclosure.length) {
      cache.currencyDisclosure.forEach(function (item,index) {
        new theme.Disclosure(item);
      });
    }


//     var showAlternateHeader = false;
//     var custom_page_header_section = document.querySelector('.custom_page_header_section');
//     var first_slideshow_section =
//     if(!custom_page_header_section)  {
//       showAlternateHeader = true;
//     }

//     var no_overlapHeader = document.querySelector('#shopify-section-header').classList.contains('no-overlap');
//     if(no_overlapHeader) {
//       showAlternateHeader = true;
//     }
//     if(showAlternateHeader) {
//       var alternate_logo  = document.querySelector('.alternate_logo');
//       var main_logo =  document.querySelector('.main_logo');
//       if(document.querySelector('#shopify-section-header')) {
//         document.querySelector('#shopify-section-header').classList.add('showAlternateHeader');
//       }
//       if(alternate_logo) {
//       	alternate_logo.classList.remove('hide');
//         main_logo.classList.add('hide');
//       }
//     }


  }

  function stopImmediatePropagation(event) {
    event.stopImmediatePropagation();
  }

  function cacheSelectors() {
    var navigation = document.querySelector(selectors.navigation);
    var search_categories_menu  = document.querySelector('.search_categories_menu');
    var customer_nav_dropdown  = document.querySelector('.customer_nav_dropdown__wrapper');




    cache = {
      nav: navigation,
      topLevel: document.querySelectorAll(selectors.siteNavLinkMain),
      parents: navigation.querySelectorAll(selectors.siteNavHasDropdown),
      search_categories_menu_parent:search_categories_menu,
      customer_nav_dropdown_parent: customer_nav_dropdown,
      subMenuLinks: document.querySelectorAll(selectors.siteNavChildLinks),
      activeDropdown: document.querySelector(selectors.siteNavActiveDropdown),
      siteHeader: document.querySelector(selectors.siteHeader),
      siteNavChildLink: document.querySelectorAll(selectors.siteNavChildLink)
    };



    cache.localeDisclosure = cache.siteHeader.querySelectorAll(selectors.disclosureLocale);
    cache.currencyDisclosure = cache.siteHeader.querySelectorAll(selectors.disclosureCurrency);



  };


  function showDropdown(element) {
    element.classList.add(config.activeClass);

    if (cache.activeDropdown) hideDropdown();

    cache.activeDropdown = element;

    element
      .querySelector(selectors.siteNavLinkMain)
      .setAttribute('aria-expanded', 'true');

    setTimeout(function() {
      window.addEventListener('keyup', keyUpHandler);
      document.body.addEventListener('click', hideDropdown);
    }, 250);
  }

  function hideDropdown() {
    if (!cache.activeDropdown) return;

    cache.activeDropdown
      .querySelector(selectors.siteNavLinkMain)
      .setAttribute('aria-expanded', 'false');
    cache.activeDropdown.classList.remove(config.activeClass);

    cache.activeDropdown = document.querySelector(
      selectors.siteNavActiveDropdown
    );

    window.removeEventListener('keyup', keyUpHandler);
    document.body.removeEventListener('click', hideDropdown);
  }

  function styleDropdowns(dropdownListItems) {
         var mainMenuDropdowns = document.querySelectorAll('.nav-dropdown');
      if(mainMenuDropdowns.length) {
        mainMenuDropdowns.forEach(function (item,index) {
          item.classList.remove('right_side');

         if (overlapDropdown(item)) {
     item.classList.add('right_side');

      } else {
       item.classList.remove('right_side');
      }
        });
      }


    dropdownListItems.forEach(function(item) {
      var dropdownLi = item.querySelector(selectors.siteNavDropdown);
      if (dropdownLi) {

      if (isRightOfLogo(item)) {
        dropdownLi.classList.remove(config.leftDropdownClass);
        dropdownLi.classList.add(config.rightDropdownClass);
      } else {
        dropdownLi.classList.remove(config.rightDropdownClass);
        dropdownLi.classList.add(config.leftDropdownClass);
      }
    }
    });
  }
    function overlapDropdown(item) {
      var rect = item.getBoundingClientRect();
    var rightOffset = rect.right;
    var headerWidth = Math.floor(cache.siteHeader.offsetWidth);
    return rightOffset > headerWidth;
    }
  function isRightOfLogo(item) {
    var rect = item.getBoundingClientRect();
    var win = item.ownerDocument.defaultView;
    var leftOffset = rect.left + win.pageXOffset;

    var headerWidth = Math.floor(cache.siteHeader.offsetWidth) / 2;
    return leftOffset > headerWidth;
  }

  function positionFullWidthDropdowns() {
    document
      .querySelectorAll(selectors.siteNavHasCenteredDropdown)
      .forEach(function(el) {
        var fullWidthDropdown = el.querySelector(
          selectors.siteNavCenteredDropdown
        );

        var fullWidthDropdownOffset = el.offsetTop + 41;
        fullWidthDropdown.style.top = fullWidthDropdownOffset + 'px';
      });

  }

  function keyUpHandler(event) {
    if (event.keyCode === 27) hideDropdown();
  }

  function resizeHandler() {
    adjustStyleAndPosition();
  }

  function submenuParentClickHandler(event) {
    var element = event.currentTarget;
    element.classList.contains(config.activeClass)
      ? hideDropdown()
      : showDropdown(element);
  }

  function submenuFocusoutHandler() {
    setTimeout(function() {
      if (
        document.activeElement.classList.contains(config.childLinkClass) ||
        !cache.activeDropdown
      ) {
        return;
      }

      hideDropdown();
    });
  }

  var adjustStyleAndPosition = theme.Helpers.debounce(function() {
    styleDropdowns(document.querySelectorAll(selectors.siteNavHasDropdown));
    positionFullWidthDropdowns();
  }, 50);

  function unload() {
    cache.topLevel.forEach(function(element) {
      element.removeEventListener('focus', hideDropdown);
    });

    cache.subMenuLinks.forEach(function(element) {
      element.removeEventListener('click', stopImmediatePropagation);
    });
    if(cache.search_categories_menu_parent) {
      cache.search_categories_menu_parent.removeEventListener('click', submenuParentClickHandler);
    }
    if(cache.customer_nav_dropdown_parent) {
      cache.customer_nav_dropdown_parent.removeEventListener('click', submenuParentClickHandler);
    }

    cache.parents.forEach(function(element) {
      element.removeEventListener('click', submenuParentClickHandler);
    });

    cache.siteNavChildLink.forEach(function(element) {
      element.removeEventListener('focusout', submenuFocusoutHandler);
    });

    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('keyup', keyUpHandler);
    document.body.removeEventListener('click', hideDropdown);
  }

  return {
    init: init,
    unload: unload,
    closeCartDrawer: closeCartDrawer,
    closeSearchMobileDropdown: closeSearchMobileDropdown

  };
})();

window.theme = window.theme || {};

theme.MobileNav = (function() {
  var classes = {
    mobileNavOpenIcon: 'mobile-nav--open',
    mobileNavCloseIcon: 'mobile-nav--close',
    navLinkWrapper: 'mobile-nav__item',
    navLink: 'mobile-nav__link',
    subNavLink: 'mobile-nav__sublist-link',
    return: 'mobile-nav__return-btn',
    subNavActive: 'is-active',
    subNavClosing: 'is-closing',
    navOpen: 'js-menu--is-open',
    subNavShowing: 'sub-nav--is-open',
    thirdNavShowing: 'third-nav--is-open',
    fourthNavShowing: 'fourth-nav--is-open',
    subNavToggleBtn: 'js-toggle-submenu'
  };

  var cache = {};
  var isTransitioning;
  var activeSubNav;
  var activeTrigger;
  var menuLevel = 1;
  var mediumUpQuery = '(min-width: ' + theme.breakpoints.medium + 'px)';
  var mql = window.matchMedia(mediumUpQuery);

  function init() {
    cacheSelectors();

    if (cache.mobileNavToggle) {
      cache.mobileNavToggle.addEventListener('click', toggleMobileNav);
    }

    cache.subNavToggleBtns.forEach(function(element) {
      element.addEventListener('click', toggleSubNav);
    });
    cache.mobileMenuOverlay.addEventListener('click', closeMobileNav);

    mql.addListener(initBreakpoints);
  }

  function initBreakpoints() {
    if (
      mql.matches &&
      cache.mobileNavContainer.classList.contains(classes.navOpen)
    ) {
      closeMobileNav();
    }
  }

  function toggleMobileNav() {
    var mobileNavIsOpen = cache.mobileNavToggle.classList.contains(
      classes.mobileNavCloseIcon
    );

    if (mobileNavIsOpen) {
      closeMobileNav();
      //if(document.querySelector('#country-selector-popup')) document.querySelector('#country-selector-popup').style.display = 'none';
    } else {
      openMobileNav();
    }
  }

  function cacheSelectors() {
    cache = {
      pageContainer: document.querySelector('#PageContainer'),
      siteHeader: document.querySelector('.site-header'),
      mobileNavToggle: document.querySelector('.js-mobile-nav-toggle'),
      mobileNavContainer: document.querySelector('.mobile-nav-wrapper'),
      mobileNav: document.querySelector('#MobileNav'),
      sectionHeader: document.querySelector('#shopify-section-header'),
      subNavToggleBtns: document.querySelectorAll('.' + classes.subNavToggleBtn),
      bodyElem: document.querySelector('body'),
      mobileMenuOverlay: document.querySelector('.mobile_menu_overlay')
    }
  }

  function openMobileNav() {

    theme.Header.closeSearchMobileDropdown();
    theme.Header.closeCartDrawer();

    var translateHeaderHeight = cache.siteHeader.offsetHeight;

    theme.Helpers.prepareTransition(cache.mobileNavContainer);
    cache.mobileNavContainer.classList.add(classes.navOpen);
    cache.bodyElem.classList.add(classes.navOpen);

    var mobileNavHeight = cache.mobileNav.offsetHeight;
    var mobileNavDropdownsArr = cache.mobileNav.querySelectorAll('.mobile-nav__dropdown');

    if(mobileNavDropdownsArr.length) {
      mobileNavDropdownsArr.forEach(function (item,index) {
        var itemHeight = item.offsetHeight;
        if(itemHeight > mobileNavHeight) {
          mobileNavHeight = itemHeight;
        }
      });
    }

    cache.mobileNav.style.minHeight = mobileNavHeight + 'px';

    cache.mobileNavContainer.style.top =
      translateHeaderHeight - 2  + 'px';


    slate.a11y.trapFocus({
      container: cache.sectionHeader,
      elementToFocus: cache.mobileNavToggle
    });

    cache.mobileNavToggle.classList.add(classes.mobileNavCloseIcon);
    cache.mobileNavToggle.classList.remove(classes.mobileNavOpenIcon);
    cache.mobileNavToggle.setAttribute('aria-expanded', true);

    window.addEventListener('keyup', keyUpHandler);
  }

  function keyUpHandler(event) {
    if (event.which === 27) {
      closeMobileNav();
    }
  }

  function closeMobileNav() {
    document.querySelectorAll('.js-toggle-submenu').forEach(function(element){
      if(element.classList.contains('is-active')){
        element.classList.remove('is-active');
      }
    });

    cache.mobileNavContainer.classList.remove(classes.navOpen);
    cache.bodyElem.classList.remove(classes.navOpen);

    slate.a11y.trapFocus({
      container: document.querySelector('html'),
      elementToFocus: document.body
    });

    cache.mobileNavContainer.addEventListener(
      'transitionend',
      mobileNavRemoveTrapFocus,
      { once: true }
    );

    cache.mobileNavToggle.classList.add(classes.mobileNavOpenIcon);
    cache.mobileNavToggle.classList.remove(classes.mobileNavCloseIcon);


    cache.mobileNavToggle.setAttribute('aria-expanded', false);
    cache.mobileNavToggle.focus();

    window.removeEventListener('keyup', keyUpHandler);
    window.scrollTo(0, 0);
  }

  function mobileNavRemoveTrapFocus() {
    slate.a11y.removeTrapFocus({
      container: cache.mobileNav
    });
  }

  function toggleSubNav(event) {
    var toggleBtn = event.currentTarget;
    var subNavToggleBtn = document.querySelectorAll(
      '.' + classes.subNavToggleBtn + "[data-level='" + (menuLevel - 1) + "']"
    );

    toggleBtn.classList.toggle(classes.subNavActive);
    if(!toggleBtn.classList.contains('megamenu-btn')) toggleBtn.parentElement.classList.toggle(classes.subNavActive);

    activeTrigger = toggleBtn;

    goToSubnav(toggleBtn.getAttribute('data-target'));
  }

  function goToSubnav(target) {

    var targetMenu = target
      ? document.querySelector(
          '.mobile-nav__dropdown[data-parent="' + target + '"]'
        )
      : cache.mobileNav;

    menuLevel = targetMenu.dataset.level ? Number(targetMenu.dataset.level) : 1;

    if (activeSubNav) {
      activeSubNav.classList.add(classes.subNavClosing);
    }

    activeSubNav = targetMenu;

    var translateMenuHeight = targetMenu.offsetHeight;

    /* if going back to first subnav, focus is on whole header */
    var container = menuLevel === 1 ? cache.sectionHeader : targetMenu;

    activeSubNav.classList.remove(classes.subNavClosing);
  }

  function unload() {
    mql.removeListener(initBreakpoints);
  }

  return {
    init: init,
    unload: unload,
    closeMobileNav: closeMobileNav
  };
})();

window.Modals = (function() {
  function Modal(id, name, options) {
    var defaults = {
      close: '.js-modal-close',
      open: '.js-modal-open-' + name,
      openClass: 'modal--is-active',
      closeModalOnClick: false
    };

    this.modal = document.getElementById(id);

    if (!this.modal) return false;

    this.nodes = {
      parents: [document.querySelector('html'), document.body]
    };

    this.config = Object.assign(defaults, options);

    this.modalIsOpen = false;

    this.focusOnOpen = this.config.focusOnOpen
      ? document.getElementById(this.config.focusOnOpen)
      : this.modal;

    this.openElement = document.querySelector(this.config.open);
    this.init();
  }

  Modal.prototype.init = function() {
    this.openElement.addEventListener('click', this.open.bind(this));

    this.modal
      .querySelector(this.config.close)
      .addEventListener('click', this.closeModal.bind(this));
  };

  Modal.prototype.open = function(evt) {

    var self = this;
    // Keep track if modal was opened from a click, or called by another function
    var externalCall = false;

    if (this.modalIsOpen) return;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the modal opens, the click event bubbles up
    // which closes the modal.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
    }

    if (this.modalIsOpen && !externalCall) {
      this.closeModal();
    }

    this.modal.classList.add(this.config.openClass);

    this.nodes.parents.forEach(function(node) {
      node.classList.add(self.config.openClass);
      node.classList.add('show_overlay');
    });

    this.modalIsOpen = true;

    slate.a11y.trapFocus({
      container: this.modal,
      elementToFocus: this.focusOnOpen
    });

    this.bindEvents();
  };

  Modal.prototype.closeModal = function() {
    if (!this.modalIsOpen) return;

    document.activeElement.blur();

    this.modal.classList.remove(this.config.openClass);

    var self = this;

    this.nodes.parents.forEach(function(node) {
      node.classList.remove(self.config.openClass);
      node.classList.remove('show_overlay');
    });

    this.modalIsOpen = false;

    slate.a11y.removeTrapFocus({
      container: this.modal
    });

    this.openElement.focus();

    this.unbindEvents();
  };

  Modal.prototype.bindEvents = function() {
    this.keyupHandler = this.keyupHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    document.body.addEventListener('keyup', this.keyupHandler);
    document.body.addEventListener('click', this.clickHandler);
  };

  Modal.prototype.unbindEvents = function() {
    document.body.removeEventListener('keyup', this.keyupHandler);
    document.body.removeEventListener('click', this.clickHandler);
  };

  Modal.prototype.keyupHandler = function(event) {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  Modal.prototype.clickHandler = function(event) {
    if (this.config.closeModalOnClick && !this.modal.contains(event.target)) {
      this.closeModal();
    }
  };

  return Modal;
})();




theme.Slideshow = (function() {
  var selectors = {
    button: '[data-slider-button]',
    indicator: '[data-slider-indicator]',
    indicators: '[data-slider-indicators]',
    pause: '[data-slider-pause]',
    slider: '[data-slider]',
    sliderItem: '[data-slider-item]',
    sliderItemLink: '[data-slider-item-link]',
    sliderTrack: '[data-slider-track]',
    sliderContainer: '[data-slider-container]'
  };

  var classes = {
    isPaused: 'slideshow__pause--is-paused',
    indicator: 'slider-indicators__item',
    indicatorActive: 'slick-active',
    sliderInitialized: 'slick-initialized',
    slideActive: 'slideshow__slide--active',
    slideClone: 'slick-cloned'
  };

  var attributes = {
    buttonNext: 'data-slider-button-next'
  };

  function Slideshow(container, options) {
    this.container = container;
    this.slider = this.container.querySelector(selectors.slider);


    var self = this;

    if (!this.slider) return;

    this.eventHandlers = {};
    this.lastSlide = 0;
    this.slideIndex = 0;
    this.sliderContainer = null;
    this.slides = [];
    this.options = Object.assign(
      {},
      {
        autoplay: false,
        canUseKeyboardArrows: true,
        canUseTouchEvents: false,
        slideActiveClass: classes.slideActive,
        slideInterval: 0,
        slidesToShow: 0,
        slidesToScroll: 1,
        type: 'slide',
        swipeEnabled: true
      },
      options
    );

    this.sliderContainer = this.slider.querySelector(selectors.sliderContainer);
    this.adaptHeight =
      this.sliderContainer.getAttribute('data-adapt-height') === 'true';
    this.slides = Array.from(
      this.sliderContainer.querySelectorAll(selectors.sliderItem)
    );
    // adding -1 to accomodate Array order
    this.lastSlide = this.slides.length - 1;
    this.buttons = this.container.querySelectorAll(selectors.button);
    this.indicators = this.container.querySelectorAll(selectors.indicators);

    if (this.slides.length <= 1) return;

    this.timeout = 250;

    if (this.options.autoplay) {
      this.startAutoplay();
    }

    if (this.adaptHeight) {
      this.setSlideshowHeight();
    }
    this.checkSlideshowHeight();

    if (this.options.type === 'slide') {
      this.isFirstSlide = false;
      this.isLastSlide = false;
      this.sliderItemWidthTotal = 0;
      this.sliderTrack = this.slider.querySelector(selectors.sliderTrack);

      // added setTimeout due to matchMedia calling too early
      // which result wrong value when getting dimension from an element
      this.sliderItemWidthTotal = 0;
      theme.Helpers.promiseStylesheet().then(
        function() {
          this._setupSlideType();
        }.bind(this)
      );
    } else {
      this.setupSlider(0);
    }

    this._setupEventHandlers();
  }

  Slideshow.prototype = Object.assign({}, Slideshow.prototype, {
    /**
     * Moves to the previous slide
     */
    previousSlide: function() {
      this._move();
    },

    /**
     * Moves to the next slide
     */
    nextSlide: function() {
      this._move('next');
    },

    /**
     * Moves to the specified slide
     * @param {Number} index - The index of the slide to move to
     */
    setSlide: function(index) {
      this._setPosition(Number(index));
    },

    /**
     * Starts autoplaying the slider if autoplay is enabled
     */
    startAutoplay: function() {
      this.isAutoPlaying = true;
      window.clearTimeout(this.autoTimeOut);

      this.autoTimeOut = window.setTimeout(
        function() {
          var nextSlideIndex = this._getNextSlideIndex('next');
          this._setPosition(nextSlideIndex);
        }.bind(this),
        this.options.slideInterval
      );
    },

    /**
     * Stops autoplaying the slider if autoplay is enabled
     */
    stopAutoplay: function() {
      this.isAutoPlaying = false;

      window.clearTimeout(this.autoTimeOut);
    },

    /**
     * Set active states for sliders and indicators
     * @param {index} integer - Slide index to set up slider from
     */
    setupSlider: function(index) {
      this.slideIndex = index;

      if (this.indicators.length) {
        this._setActiveIndicator(index);
      }

      this._setupActiveSlide(index);
    },

    /**
     * Removes event listeners, among other things when wanting to destroy the
     * slider instance. This method needs to be called manually and will most
     * likely be included in a section's onUnload() method.
     */
    destroy: function() {
      if (this.adaptHeight) {
        window.removeEventListener('resize', this.eventHandlers.debounceResize);
      }

      this.container.removeEventListener(
        'focus',
        this.eventHandlers.focus,
        true
      );
      this.slider.removeEventListener(
        'focusin',
        this.eventHandlers.focusIn,
        true
      );
      this.slider.removeEventListener(
        'focusout',
        this.eventHandlers.focusOut,
        true
      );
      this.container.removeEventListener('blur', this.eventHandlers.blur, true);

      if (this.buttons) {
        this.buttons.forEach(
          function(button) {
            button.removeEventListener('click', this.eventHandlers.clickButton);
          }.bind(this)
        );
      }

      this.indicators.forEach(function(indicatorWrapper) {
        indicatorWrapper.childNodes.forEach(function(indicator) {
          indicator.firstElementChild.removeEventListener(
            'click',
            this.eventHandlers.onClickIndicator
          );

          indicator.firstElementChild.removeEventListener(
            'keydown',
            this.eventHandlers.onKeydownIndicator
          );
        }, this);
      }, this);

      if (this.options.type === 'slide') {
        window.removeEventListener(
          'resize',
          this.eventHandlers.debounceResizeSlideIn
        );

        if (this.touchEvents && this.options.canUseTouchEvents) {
          this.touchEvents.destroy();
          this.touchEvents = null;
        }
      }
    },

    _setupEventHandlers: function() {


      this.eventHandlers.focus = this._onFocus.bind(this);
      this.eventHandlers.focusIn = this._onFocusIn.bind(this);
      this.eventHandlers.focusOut = this._onFocusOut.bind(this);
      this.eventHandlers.blur = this._onBlur.bind(this);
      this.eventHandlers.keyUp = this._onKeyUp.bind(this);
      this.eventHandlers.clickButton = this._onClickButton.bind(this);
      this.eventHandlers.onClickIndicator = this._onClickIndicator.bind(this);
      this.eventHandlers.onKeydownIndicator = this._onKeydownIndicator.bind(
        this
      );
      this.eventHandlers.onClickPause = this._onClickPause.bind(this);

      if (this.adaptHeight) {
        this.eventHandlers.debounceResize = theme.Helpers.debounce(
          function() {
            this.setSlideshowHeight();
          }.bind(this),
          50
        );

        window.addEventListener('resize', this.eventHandlers.debounceResize);
      }
      this.checkSlideshowHeight();

      this.container.addEventListener('focus', this.eventHandlers.focus, true);
      this.slider.addEventListener('focusin', this.eventHandlers.focusIn, true);
      this.slider.addEventListener(
        'focusout',
        this.eventHandlers.focusOut,
        true
      );
      this.container.addEventListener('blur', this.eventHandlers.blur, true);

      if (this.buttons) {
        this.buttons.forEach(
          function(button) {
            button.addEventListener('click', this.eventHandlers.clickButton);
          }.bind(this)
        );
      }

      this.indicators.forEach(function(indicatorWrapper) {
        indicatorWrapper.childNodes.forEach(function(indicator) {
          indicator.firstElementChild.addEventListener(
            'click',
            this.eventHandlers.onClickIndicator
          );

          indicator.firstElementChild.addEventListener(
            'keydown',
            this.eventHandlers.onKeydownIndicator
          );
        }, this);
      }, this);

      if (this.options.type === 'slide') {
        this.eventHandlers.debounceResizeSlideIn = theme.Helpers.debounce(
          function() {
            this.sliderItemWidthTotal = 0;
            this._setupSlideType(true);
          }.bind(this),
          50
        );

        window.addEventListener(
          'resize',
          this.eventHandlers.debounceResizeSlideIn
        );

        if (this.options.swipeEnabled) {
          this._setupSwipe();
        }

        if (
          this.options.canUseTouchEvents &&
          this.options.slidesToScroll < this.slides.length
        ) {
          this._setupTouchEvents();
        }
      }

          var _this  = this;
        var containerHover = new SV.HoverIntent(_this.slides, {
        onEnter: function(targetItem) {
          _this.stopAutoplay();
        },
        onExit: function(targetItem) {
          //_this.startAutoplay();
        },
        exitDelay: 300,
        interval: 100,
        sensitivity: 7,
      });

    },

    _setupSwipe: function() {
      this.touchEvents = new theme.TouchEvents(this.slider, {
        start: function() {
          //this._onTouchStart();
        }.bind(this),
        move: function(event, direction, difference) {
          this._onSwipeEnd(event, direction, difference);
        }.bind(this),
        end: function(event, direction, difference) {

        }.bind(this)
      });
    },

    _setupTouchEvents: function() {
      this.touchEvents = new theme.TouchEvents(this.sliderTrack, {
        start: function() {
          this._onTouchStart();
        }.bind(this),
        move: function(event, direction, difference) {
          this._onTouchMove(event, direction, difference);
        }.bind(this),
        end: function(event, direction, difference) {
          this._onTouchEnd(event, direction, difference);
        }.bind(this)
      });
    },

    /**
     * Set slideshop for "slide-in" effect
     * @param {Boolean} onResize if function call came from resize event
     */
    _setupSlideType: function(onResize) {
      this.sliderItemWidth = Math.floor(
        this.sliderContainer.offsetWidth / this.options.slidesToShow
      );
      this.sliderTranslateXMove =
        this.sliderItemWidth * this.options.slidesToScroll;

      if (!onResize) {
        this.sliderContainer.classList.add(classes.sliderInitialized);
      }

      // Loop through all slider items
      // Set width according to the number of items to show in 1 slide
      // Set container width to accomodate all items
      this.slides.forEach(function(sliderItem, index) {
        var sliderItemLink = sliderItem.querySelector(selectors.sliderItemLink);
        sliderItem.style.width = this.sliderItemWidth + 'px';
//         sliderItem.setAttribute('aria-hidden', true);
//         sliderItem.setAttribute('tabindex', -1);
        this.sliderItemWidthTotal =
          this.sliderItemWidthTotal + sliderItem.offsetWidth;

//         if (sliderItemLink) {
//           sliderItemLink.setAttribute('tabindex', -1);
//         }

        if (index < this.options.slidesToShow) {
//           sliderItem.setAttribute('aria-hidden', false);
          sliderItem.classList.add(this.options.slideActiveClass);

          if (sliderItemLink) {
//             sliderItemLink.setAttribute('tabindex', 0);
          }
        }
      }, this);

      this.sliderTrack.style.width =
        Math.floor(this.sliderItemWidthTotal) + 'px';
      this.sliderTrack.style.transform = 'translateX(-0px)';

      // set disabled attribute on Previous button
      if (this.buttons.length) {
        this.buttons[0].setAttribute('aria-disabled', true);
        this.buttons[1].removeAttribute('aria-disabled');
      }

      if (this.indicators.length) {
        this._setActiveIndicator(0);
      }
    },

    _onTouchStart: function() {
      this.touchStartPosition = this._getTranslateXPosition();
    },

    _onTouchMove: function(event, direction, difference) {
      // Fix touch events cause unexpected behaviour
      // when the dragging motion goes beyond the theme editor preview.
      var threshold = 80;
      if (
        Shopify.designMode &&
        (event.clientX <= threshold ||
          event.clientX >= window.innerWidth - threshold)
      ) {
        event.target.dispatchEvent(
          new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true
          })
        );
        return;
      }

      if (direction !== 'left' && direction !== 'right') return;

      this.touchMovePosition = this.touchStartPosition + difference.xPosition;

      this.sliderTrack.style.transform =
        'translateX(' + this.touchMovePosition + 'px';
    },

    _onSwipeEnd: function(event, direction, difference) {
      var slideDirection = direction === 'left' ? 'next' : '';
      var counter = slideDirection === 'next' ? 1 : -1;

      var nextSlideIndex = this.slideIndex + counter;
      if (slideDirection === 'next') {
        if (this.slideIndex === this.lastSlide) {
          var nextSlideIndex = 0;
        }
      } else if (!this.slideIndex) {
        var nextSlideIndex = this.lastSlide;
      }

      this._setPosition(nextSlideIndex);
    },

    _onTouchEnd: function(event, direction, difference) {
      var nextTranslateXPosition = 0;

      if (Object.keys(difference).length === 0) return;

      var slideDirection = direction === 'left' ? 'next' : '';

      if (direction === 'left') {
        if (this._isNextTranslateXLast(this.touchStartPosition)) {
          nextTranslateXPosition = this.touchStartPosition;
        } else {
          nextTranslateXPosition =
            this.touchStartPosition - this.sliderTranslateXMove;
        }
      } else {
        nextTranslateXPosition =
          this.touchStartPosition + this.sliderTranslateXMove;
        if (this._isNextTranslateXFirst(this.touchStartPosition)) {
          nextTranslateXPosition = 0;
        }
      }

      this.slideIndex = this._getNextSlideIndex(slideDirection);

      this.sliderTrack.style.transition = 'transform 500ms ease 0s';
      this.sliderTrack.style.transform =
        'translateX(' + nextTranslateXPosition + 'px';

      window.setTimeout(
        function() {
          this.sliderTrack.style.transition = '';
        }.bind(this),
        500
      );

      this._verifyFirstLastSlideTranslateX(nextTranslateXPosition);

      this._postTransitionEnd();
    },

    /**
     * Events handlers for next and previous button
     * @param {Object} event event handler
     */
    _onClickButton: function(event) {
      // prevent multiple clicks
      if (event.detail > 1) return;

      var button = event.currentTarget;
      var nextButton = button.hasAttribute(attributes.buttonNext);

      if (
        this.options.type === 'slide' &&
        button.getAttribute('aria-disabled') === 'true'
      ) {
        return;
      }

      if (this.options.autoplay && this.isAutoPlaying) {
        this.stopAutoplay();
      }

      if (nextButton) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    },

    _onClickIndicator: function(event) {
      event.preventDefault();

      if (event.target.classList.contains(classes.indicatorActive)) return;

      if (this.options.autoplay && this.isAutoPlaying) {
        this.stopAutoplay();
      }

      this.slideIndex = Number(event.target.dataset.slideNumber);
      this.goToSlideByIndex(this.slideIndex);
    },

    goToSlideByIndex: function(index) {
      this._setPosition(index);

      if (this.options.type === 'slide' && this.sliderTrack) {
        this.sliderTrack.style.transition = 'transform 500ms ease 0s';
        var newPosition = index * this.slides[0].offsetWidth;

        this.sliderTrack.style.transform = 'translateX(-' + newPosition + 'px)';

        if (this.options.slidesToShow > 1) {
          this._verifyFirstLastSlideTranslateX(newPosition);

          if (this.buttons.length) {
            this._disableArrows();
          }

          this._setupMultipleActiveSlide(
            index,
            index + (this.options.slidesToShow - 1)
          );
        }
      }
    },

    _onKeydownIndicator: function(event) {
      if (event.keyCode !== slate.utils.keyboardKeys.ENTER) return;

      this._onClickIndicator(event);

      this.slider.focus();
    },

    _onClickPause: function(event) {

      if (!event.currentTarget.classList.contains(classes.isPaused)) {
        event.currentTarget.classList.add(classes.isPaused);
        this.stopAutoplay();
      } else {
        event.currentTarget.classList.remove(classes.isPaused);
        this.startAutoplay();
      }
    },

    _onFocus: function() {
      this.container.addEventListener('keyup', this.eventHandlers.keyUp);
    },

    _onFocusIn: function() {
      if (this.slider.hasAttribute('aria-live')) return;

      if (this.options.autoplay && this.isAutoPlaying) {
        this.stopAutoplay();
      }

      this.slider.setAttribute('aria-live', 'polite');
    },

    _onBlur: function() {
      this.container.removeEventListener('keyup', this.eventHandlers.keyUp);
    },

    _onFocusOut: function() {
      this.slider.removeAttribute('aria-live');

      // Adding a setTimeout because everytime we focus out
      // It automatically goes to <body>
      // We want to resume autoplay when focus is outside of the slideshow container
      setTimeout(
        function() {
          if (
            !document.activeElement.closest(
              '#' + this.slider.getAttribute('id')
            )
          ) {

            if (
              this.options.autoplay &&
              !this.isAutoPlaying
            ) {
              //this.startAutoplay();
            }
          }
        }.bind(this),
        this.timeout
      );
    },

    _onKeyUp: function(event) {
      switch (event.keyCode) {
        case slate.utils.keyboardKeys.LEFTARROW:
          if (!this.options.canUseKeyboardArrows) return;

          if (this.options.type === 'slide' && this.isFirstSlide) {
            return;
          }

          this.previousSlide();

          break;
        case slate.utils.keyboardKeys.RIGHTARROW:
          if (!this.options.canUseKeyboardArrows) return;

          if (this.options.type === 'slide' && this.isLastSlide) {
            return;
          }

          this.nextSlide();

          break;
        case slate.utils.keyboardKeys.ESCAPE:
          this.slider.blur();
          break;
      }
    },

    _move: function(direction) {
      if (this.options.type === 'slide') {
        this.slideIndex = this._getNextSlideIndex(direction);
        this._moveSlideshow(direction);
      } else {
        var nextSlideIndex = this._getNextSlideIndex(direction);
        this._setPosition(nextSlideIndex);
      }
    },

    _moveSlideshow: function(direction) {
      this.direction = direction;
      var valueXToMove = 0;

      // Get current position of translateX
      var currentTranslateXPosition = this._getTranslateXPosition();
      var currentActiveSlidesIndex = this._getActiveSlidesIndex();

      // In the future, we'll use ES6 deconstructure
      // Math.min(...currentActiveSlidesIndex);
      var currentActiveSlidesMinIndex = Math.min.apply(
        Math,
        currentActiveSlidesIndex
      );
      var currentActiveSlidesMaxIndex = Math.max.apply(
        Math,
        currentActiveSlidesIndex
      );

      // Set the next active state depending on the direction
      // We bump up the index depending on the "slidesToShow" option
      this.nextMinIndex =
        direction === 'next'
          ? currentActiveSlidesMinIndex + this.options.slidesToShow
          : currentActiveSlidesMinIndex - this.options.slidesToShow;
      this.nextMaxIndex =
        direction === 'next'
          ? currentActiveSlidesMaxIndex + this.options.slidesToShow
          : currentActiveSlidesMinIndex - 1;

      this.sliderTrack.style.transition = 'transform 500ms ease 0s';

      if (direction === 'next') {
        valueXToMove = currentTranslateXPosition - this.sliderTranslateXMove;
        this.sliderTrack.style.transform = 'translateX(' + valueXToMove + 'px)';
      } else {
        valueXToMove = currentTranslateXPosition + this.sliderTranslateXMove;
        this.sliderTrack.style.transform = 'translateX(' + valueXToMove + 'px)';
      }

      this._verifyFirstLastSlideTranslateX(valueXToMove);

      this._postTransitionEnd();

      this._setupMultipleActiveSlide(this.nextMinIndex, this.nextMaxIndex);
    },

    _setPosition: function(nextSlideIndex) {
      this.slideIndex = nextSlideIndex;

      if (this.indicators.length) {
        this._setActiveIndicator(nextSlideIndex);
      }

      this._setupActiveSlide(nextSlideIndex);

      if (this.options.autoplay && this.isAutoPlaying) {
        this.startAutoplay();
      }

      this.container.dispatchEvent(
        new CustomEvent('slider_slide_changed', {
          detail: nextSlideIndex
        })
      );
    },

    _setupActiveSlide: function(index) {
      this.slides.forEach(function(slide) {
//         slide.setAttribute('aria-hidden', true);
        slide.classList.remove(this.options.slideActiveClass);
      }, this);

//       this.slides[index].setAttribute('aria-hidden', false);
      this.slides[index].classList.add(this.options.slideActiveClass);
    },

    /**
     * Loops through all slide items
     * Set the active state depending the direction and slide indexes
     * Because slide-in effect can have multiple items in 1 slide, we need to target multiple active elements
     * @param {String} direction "next" for next slides or empty string for previous
     * @param {*} minIndex the current active minimum index
     * @param {*} maxIndex the current active maximum index
     */
    _setupMultipleActiveSlide: function(minIndex, maxIndex) {
      this.slides.forEach(function(slide) {
        var sliderIndex = Number(slide.getAttribute('data-slider-slide-index'));
        var sliderItemLink = slide.querySelector(selectors.sliderItemLink);

//         slide.setAttribute('aria-hidden', true);
        slide.classList.remove(this.options.slideActiveClass);
        if (sliderItemLink) {
          sliderItemLink.setAttribute('tabindex', -1);
        }

        if (sliderIndex >= minIndex && sliderIndex <= maxIndex) {
//           slide.setAttribute('aria-hidden', false);
          slide.classList.add(this.options.slideActiveClass);

          if (sliderItemLink) {
//             sliderItemLink.setAttribute('tabindex', 0);
          }
        }
      }, this);
    },

    _setActiveIndicator: function(index) {
      this.indicators.forEach(function(indicatorWrapper) {
        var activeIndicator = indicatorWrapper.querySelector(
          '.' + classes.indicatorActive
        );

        var nextIndicator = indicatorWrapper.childNodes[index];

        if (activeIndicator) {
          activeIndicator.classList.remove(classes.indicatorActive);
          activeIndicator.firstElementChild.removeAttribute('aria-current');
        }

        nextIndicator.classList.add(classes.indicatorActive);
        nextIndicator.firstElementChild.setAttribute('aria-current', true);
      }, this);
    },

    setSlideshowHeight: function() {
      var minAspectRatio = this.sliderContainer.getAttribute(
        'data-min-aspect-ratio'
      );
      this.sliderContainer.style.height =
        document.documentElement.offsetWidth / minAspectRatio + 'px';
    },
    checkSlideshowHeight: function() {
      var sliderContainer = this.sliderContainer;
      var sliderContainerHeight = sliderContainer.offsetHeight;
      var windowWidth = document.documentElement.offsetWidth;

      if(!sliderContainer.classList.contains('slideshow--adapt') && windowWidth > 1239) {
        var slideSContentArr = sliderContainer.querySelectorAll('.slideshow__text-content');
        if(slideSContentArr.length) {

          var maxHeight = 0;
          slideSContentArr.forEach(function (item,index) {
            var contentHeight = item.offsetHeight;
            if(contentHeight > maxHeight) {
              maxHeight = contentHeight;
            }
          });
          if(windowWidth > 1239) {
            maxHeight += 350;
          } else {
            maxHeight += 200;
          }

          if(maxHeight > sliderContainerHeight) {
            sliderContainer.style.minHeight = maxHeight+"px";
          }
        }
      } else if(!sliderContainer.classList.contains('mobile-slideshow--adapt') && windowWidth <= 1239) {
      	var slideSContentArr = sliderContainer.querySelectorAll('.slideshow__text-content');
        if(slideSContentArr.length) {

          var maxHeight = 0;
          slideSContentArr.forEach(function (item,index) {
            var contentHeight = item.offsetHeight;
            if(contentHeight > maxHeight) {
              maxHeight = contentHeight;
            }
          });

          if(windowWidth > 1239) {
            maxHeight += 300;
          } else {
            maxHeight += 200;
          }
          if(maxHeight > sliderContainerHeight) {
            sliderContainer.style.height = maxHeight+"px";
          }
        }
      }
    },

    /**
     * Increase or decrease index position of the slideshow
     * Automatically auto-rotate
     * - Last slide goes to first slide when clicking "next"
     * - First slide goes to last slide when clicking "previous"
     * @param {String} direction "next" as a String, other empty string is previous slide
     */
    _getNextSlideIndex: function(direction) {
      var counter = direction === 'next' ? 1 : -1;

      if (direction === 'next') {
        if (this.slideIndex === this.lastSlide) {
          return this.options.type === 'slide' ? this.lastSlide : 0;
        }
      } else if (!this.slideIndex) {
        return this.options.type === 'slide' ? 0 : this.lastSlide;
      }

      return this.slideIndex + counter;
    },

    /**
     * In "slide-in" type, multiple items are active in 1 slide
     * This will return an array containing their indexes
     */
    _getActiveSlidesIndex: function() {
      var currentActiveSlides = this.slides.filter(function(sliderItem) {
        if (sliderItem.classList.contains(this.options.slideActiveClass)) {
          return sliderItem;
        }
      }, this);
      var currentActiveSlidesIndex = currentActiveSlides.map(function(
        sliderItem
      ) {
        return Number(sliderItem.getAttribute('data-slider-slide-index'));
      });

      return currentActiveSlidesIndex;
    },

    /**
     * This checks the next "translateX" value and verifies
     * If it's at the last slide or beginning of the slide
     * So we can disable the arrow buttons
     */
    _disableArrows: function() {
      if (this.buttons.length === 0) return;

      var previousButton = this.buttons[0];
      var nextButton = this.buttons[1];

      // first slide
      if (this.isFirstSlide) {
        previousButton.setAttribute('aria-disabled', true);
      } else {
        previousButton.removeAttribute('aria-disabled');
      }

      // last slide
      if (this.isLastSlide) {
        nextButton.setAttribute('aria-disabled', true);
      } else {
        nextButton.removeAttribute('aria-disabled');
      }
    },

    /**
     * Verify if translateX reaches at first or last slide
     * @param {Number} translateXValue
     */
    _verifyFirstLastSlideTranslateX: function(translateXValue) {
      // first slide
      if (this._isNextTranslateXFirst(translateXValue)) {
        this.isFirstSlide = true;
      } else {
        this.isFirstSlide = false;
      }

      // last slide
      if (this._isNextTranslateXLast(translateXValue)) {
        this.isLastSlide = true;
      } else {
        this.isLastSlide = false;
      }
    },

    _getTranslateXPosition: function() {
      return Number(this.sliderTrack.style.transform.match(/(-?[0-9]+)/g)[0]);
    },

    _isNextTranslateXFirst: function(translateXValue) {
      return translateXValue === 0;
    },

    _isNextTranslateXLast: function(translateXValue) {
      // because translateX values are using negative, I'm converting into positive value
      var translateXValueAbsolute = Math.abs(translateXValue);
      var nextTranslateXValue =
        translateXValueAbsolute + this.sliderTranslateXMove;

      return nextTranslateXValue >= this.sliderItemWidthTotal;
    },

    _postTransitionEnd: function() {
      if (this.buttons.length) {
        this._disableArrows();
      }

      if (this.indicators.length) {
        this._setActiveIndicator(this.slideIndex);
      }
    }
  });

  return Slideshow;
})();

var youtubeLoaded = false;
if (!youtubeLoaded) {
  // This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

theme.Video = (function() {
  var autoplayCheckComplete = false;
  var playOnClickChecked = false;
  var playOnClick = false;
  var videos = {};
  var videoPlayers = [];
  var videoOptions = {
    ratio: 16 / 9,
    scrollAnimationDuration: 400,
    playerVars: {
      // eslint-disable-next-line camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 1,
      playsinline: 1,
      controls: 0,
      wmode: 'opaque',
      branding: 0,
      autohide: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  };
  var classes = {
    playing: 'video-is-playing',
    paused: 'video-is-paused',
    loading: 'video-is-loading',
    loaded: 'video-is-loaded',
    backgroundVideoWrapper: 'video-background-wrapper',
    backgroundVideo: 'video--background',
    supportsAutoplay: 'autoplay',
  };

  var selectors = {
    section: '.video-section',
    videoWrapper: '.video-section-wrapper',

    fallbackText: '.icon__fallback-text'
  };

  /**
   * Public functions
   */
  function init(video) {
    if (!video) return;


    videos[video.id] = {
      id: video.id,
      videoId: video.dataset.id,
      type: video.dataset.type,
      status: 'background',
      video: video,
      videoWrapper: video.closest(selectors.videoWrapper),
      section: video.closest(selectors.section),
      controls: 0
    };

    playOnClickCheck();

  }

  function customPlayVideo(playerId) {
    // Make sure we have carried out the playOnClick check first
    if (!playOnClickChecked && !playOnClick) {
      return;
    }

    if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
      privatePlayVideo(playerId);
    }
  }

  function pauseVideo(playerId) {
    alert('pauseVideo');
    if (
      videoPlayers[playerId] &&
      typeof videoPlayers[playerId].pauseVideo === 'function'
    ) {
      videoPlayers[playerId].pauseVideo();
    }
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        createPlayer(key);
      }
    }

    initEvents();
    youtubeLoaded = true;
  }

  function editorLoadVideo(key) {
    if (!youtubeLoaded) {
      return;
    }
    createPlayer(key);

    initEvents();
  }

  /**
   * Private functions
   */

  function privatePlayVideo(id, clicked) {
    var videoData = videos[id];
    var player = videoPlayers[id];
    var videoWrapper = videoData.videoWrapper;

    if (playOnClick) {
      // playOnClick means we are probably on mobile (no autoplay).
      // setAsPlaying will show the iframe, requiring another click
      // to play the video.
      setAsPlaying(videoData);
    } else if (clicked || autoplayCheckComplete) {
      // Play if autoplay is available or clicked to play
      videoWrapper.classList.remove(classes.loading);
      setAsPlaying(videoData);
      player.playVideo();
      return;
    } else {
      player.playVideo();
    }
  }

  function setAutoplaySupport(supported) {
    var supportClass =      classes.supportsAutoplay ;
    document.documentElement.classList.remove(
      classes.supportsAutoplay    );
    document.documentElement.classList.add(supportClass);

    if (!supported) {
      playOnClick = true;
    }

    autoplayCheckComplete = true;
  }

  function playOnClickCheck() {
    if (playOnClickChecked) {
      return;
    }

    if (playOnClick) {
      // No need to also do the autoplay check
      setAutoplaySupport(false);
    }

    playOnClickChecked = true;
  }

  // The API will call this function when each video player is ready
  function onPlayerReady(evt) {
    evt.target.setPlaybackQuality('hd1080');
    var videoData = getVideoOptions(evt);
    var videoTitle = evt.target.getVideoData().title;
    playOnClickCheck();

    // Prevent tabbing through YouTube player controls until visible
    document.getElementById(videoData.id).setAttribute('tabindex', '-1');

    sizeBackgroundVideos();
//     setButtonLabels(videoData.videoWrapper, videoTitle);

    // Customize based on options from the video ID
    if (videoData.type === 'background') {
      evt.target.mute();
      privatePlayVideo(videoData.id);
    }

    videoData.videoWrapper.classList.add(classes.loaded);
  }

  function onPlayerChange(evt) {
    var videoData = getVideoOptions(evt);
    if (
      videoData.status === 'background' &&
         !autoplayCheckComplete &&
      (evt.data === YT.PlayerState.PLAYING ||
        evt.data === YT.PlayerState.BUFFERING)
    ) {
      setAutoplaySupport(true);
      autoplayCheckComplete = true;
      videoData.videoWrapper.classList.remove(classes.loading);
    }

    switch (evt.data) {
      case YT.PlayerState.ENDED:
        setAsFinished(videoData);
        break;
      case YT.PlayerState.PAUSED:
        // Seeking on a YouTube video also fires a PAUSED state change,
        // checking the state after a delay prevents us pausing the video when
        // the user is seeking instead of pausing
        setTimeout(function() {
          if (evt.target.getPlayerState() === YT.PlayerState.PAUSED) {
            setAsPaused(videoData);
          }
        }, 200);
        break;
    }
  }

  function setAsFinished(videoData) {

        videoPlayers[videoData.id].seekTo(0);

  }

  function setAsPlaying(videoData) {
    var videoWrapper = videoData.videoWrapper;

    videoWrapper.classList.remove(classes.loading);



    // Do not change element visibility if it is a background video
    if (videoData.status === 'background') {
      return;
    }

    document.getElementById(videoData.id).setAttribute('tabindex', '0');


    // Update focus to the close button so we stay within the video wrapper,
    // allowing time for the scroll animation
    setTimeout(function() {
    }, videoOptions.scrollAnimationDuration);
  }

  function setAsPaused(videoData) {
    var videoWrapper = videoData.videoWrapper;

    videoWrapper.classList.remove(classes.playing);
  }

  function getVideoOptions(evt) {
    var id = evt.target.getIframe().id;
    return videos[id];
  }

  function toggleExpandVideo(playerId, expand) {

    var video = videos[playerId];
    var elementTop =
      video.videoWrapper.getBoundingClientRect().top + window.pageYOffset;
    var offset = 0;
    var newHeight = 0;



    if (expand) {

        newHeight = video.videoWrapper.offsetWidth / videoOptions.ratio;

      offset = (window.innerHeight - newHeight) / 2;

      video.videoWrapper.style.height =
        video.videoWrapper.getBoundingClientRect().height + 'px';
      video.videoWrapper.style.height = newHeight + 'px';

      // Animate doesn't work in mobile editor, so we don't use it
      if ( Shopify.designMode) {
        var scrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'smooth';
        window.scrollTo({ top: elementTop - offset });
        document.documentElement.style.scrollBehavior = scrollBehavior;
      }
    } else {
        newHeight = video.videoWrapper.dataset.desktopHeight;

      video.videoWrapper.style.height = newHeight + 'px';

      // Set focus on play button, but don't scroll page
      var x = window.scrollX;
      var y = window.scrollY;
      window.scrollTo(x, y);
    }
  }

  function startVideoOnClick(playerId) {
    var video = videos[playerId];

    // add loading class to wrapper
    video.videoWrapper.classList.add(classes.loading);

    // Explicity set the video wrapper height (needed for height transition)
    video.videoWrapper.style.height = video.videoWrapper.offsetHeight + 'px';

    video.status = 'open';


        unsetBackgroundVideo(playerId, video);
        videoPlayers[playerId].unMute();
        privatePlayVideo(playerId, true);


    toggleExpandVideo(playerId, true);

    // esc to close video player
    document.addEventListener('keydown', handleVideoPlayerKeydown);
  }

  var handleVideoPlayerKeydown = function(evt) {
    var playerId = document.activeElement.dataset.controls;
    if (evt.keyCode !== slate.utils.keyboardKeys.ESCAPE || !playerId) {
      return;
    }

    toggleExpandVideo(playerId, false);
  };

  function sizeBackgroundVideos() {
    var backgroundVideos = document.querySelectorAll(
      '.' + classes.backgroundVideo
    );
    backgroundVideos.forEach(function(el) {
      sizeBackgroundVideo(el);
    });
  }

  function sizeBackgroundVideo(videoPlayer) {
    if (!youtubeLoaded) {
      return;
    }




      var videoWrapper = videoPlayer.closest(selectors.videoWrapper);


      var videoWidth = videoWrapper.clientWidth;
      var playerWidth = videoPlayer.clientWidth;
      var desktopHeight = videoWrapper.clientHeight;

      // when screen aspect ratio differs from video, video must center and underlay one dimension
      if (videoWidth / videoOptions.ratio < desktopHeight) {
        playerWidth = Math.ceil(desktopHeight * videoOptions.ratio); // get new player width
        var styles =
          'width: ' +
          playerWidth +
          'px; height: ' +
          desktopHeight +
          'px; left: ' +
          (videoWidth - playerWidth) / 2 +
          'px; top: 0;';
        videoPlayer.style.cssText = styles;
      } else {
        // new video width < window width (gap to right)
        desktopHeight = Math.ceil(videoWidth / videoOptions.ratio); // get new player height
        var styles2 =
          'width: ' +
          videoWidth +
          'px; height: ' +
          desktopHeight +
          'px; top: ' +
          (desktopHeight - desktopHeight) / 2 +
          'px; left: 0;'; // player height is greater, offset top; reset left
        videoPlayer.style.cssText = styles2;
      }

      theme.Helpers.prepareTransition(videoPlayer);
      videoWrapper.classList.add(classes.loaded);

  }

  function unsetBackgroundVideo(playerId) {
    // Switch the background video to a chrome-only player once played
    var player = document.getElementById(playerId);
    player.classList.remove(classes.backgroundVideo);

    setTimeout(function() {
      document.getElementById(playerId).style.cssText = null;
    }, 600);

    videos[playerId].videoWrapper.classList.remove(
      classes.backgroundVideoWrapper
    );
    videos[playerId].videoWrapper.classList.add(classes.playing);

    videos[playerId].status = 'open';
  }

  function setBackgroundVideo(playerId) {
    var player = document.getElementById(playerId);
    player.classList.add(classes.backgroundVideo);

    videos[playerId].videoWrapper.classList.add(classes.backgroundVideoWrapper);

    videos[playerId].status = 'background';
    sizeBackgroundVideo(player);
  }


  var handleWindowResize = theme.Helpers.debounce(function() {
    if (!youtubeLoaded) return;
    var key;
    var fullscreen = window.innerHeight === screen.height;
    sizeBackgroundVideos();

      setAutoplaySupport(true);
      for (key in videos) {

        videoPlayers[key].playVideo();
        setAsPlaying(videos[key]);
      }
  }, 200);

  var handleWindowScroll = theme.Helpers.debounce(function() {
    if (!youtubeLoaded) return;

    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var videoWrapper = videos[key].videoWrapper;
        var condition =
          videoWrapper.getBoundingClientRect().top +
            window.pageYOffset +
            videoWrapper.offsetHeight * 0.75 <
            window.pageYOffset ||
          videoWrapper.getBoundingClientRect().top +
            window.pageYOffset +
            videoWrapper.offsetHeight * 0.25 >
            window.pageYOffset + window.innerHeight;

        // Close the video if more than 75% of it is scrolled out of view
        if (videoWrapper.classList.contains(classes.playing)) {
          if (!condition) return;

          toggleExpandVideo(key, false);
        }
      }
    }
  }, 50);

  function initEvents() {

    // Listen to resize to keep a background-size:cover-like layout
    window.addEventListener('resize', handleWindowResize);

    window.addEventListener('scroll', handleWindowScroll);
  }

  function createPlayer(key) {
    var args = Object.assign(videoOptions, videos[key]);

    args.playerVars.controls = args.controls;
    videoPlayers[key] = new YT.Player(key, args);
  }

  function removeEvents() {
    document.removeEventListener('keydown', handleVideoPlayerKeydown);
    window.removeEventListener('resize', handleWindowResize);
    window.removeEventListener('scroll', handleWindowScroll);
  }


  return {
    init: init,
    editorLoadVideo: editorLoadVideo,
    loadVideos: loadVideos,
    playVideo: customPlayVideo,
    pauseVideo: pauseVideo,
    removeEvents: removeEvents
  };
})();

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  theme.Video.loadVideos();
  if(document.querySelector('.product-main-video')){
    document.dispatchEvent(
      new CustomEvent('youtubeAPIReady', {
        detail: {},
        bubbles: true,
        cancelable: true
      })
    );
  }
}



theme.ProductVideo = (function() {
  var videos = {};

  var hosts = {
    shopify: 'shopify',
    external: 'external'
  };

  var selectors = {
    productMediaWrapper: '[data-product-single-media-wrapper]'
  };

  var attributes = {
    enableVideoLooping: 'enable-video-looping',
    videoId: 'video-id'
  };

  function init(videoContainer, sectionId) {
    if (!videoContainer) {
      return;
    }

    var videoElement = videoContainer.querySelector('iframe, video');

    if (!videoElement) {
      return;
    }

    var mediaId = videoContainer.getAttribute('data-media-id');

    videos[mediaId] = {
      mediaId: mediaId,
      sectionId: sectionId,
      host: hostFromVideoElement(videoElement),
      container: videoContainer,
      element: videoElement,
      ready: function() {
        createPlayer(this);
      }
    };

    window.Shopify.loadFeatures([
      {
        name: 'video-ui',
        version: '2.0',
        onLoad: setupVideos
      }
    ]);
    theme.LibraryLoader.load('plyrShopifyStyles');
  }

  function setupVideos(errors) {
    if (errors) {
      fallbackToNativeVideo();
      return;
    }

    loadVideos();
  }

  function createPlayer(video) {
    if (video.player) {
      return;
    }

    var productMediaWrapper = video.container.closest(
      selectors.productMediaWrapper
    );

    var enableLooping = productMediaWrapper.getAttribute(
      'data-' + attributes.enableVideoLooping
    );

    // eslint-disable-next-line no-undef
    video.player = new Shopify.Video(video.element, {
      loop: { active: enableLooping }
    });

    var pauseVideo = function() {
      if (!video.player) return;
      video.player.pause();
    };

    productMediaWrapper.addEventListener('mediaHidden', pauseVideo);
    productMediaWrapper.addEventListener('xrLaunch', pauseVideo);

    productMediaWrapper.addEventListener('mediaVisible', function() {
      if (theme.Helpers.isTouch()) return;
      if (!video.player) return;
      video.player.play();
    });
  }

  function hostFromVideoElement(video) {
    if (video.tagName === 'VIDEO') {
      return hosts.shopify;
    }

    return hosts.external;
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        video.ready();
      }
    }
  }

  function fallbackToNativeVideo() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.nativeVideo) continue;

        if (video.host === hosts.shopify) {
          video.element.setAttribute('controls', 'controls');
          video.nativeVideo = true;
        }
      }
    }
  }

  function removeSectionVideos(sectionId) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];

        if (video.sectionId === sectionId) {
          if (video.player) video.player.destroy();
          delete videos[key];
        }
      }
    }
  }

  return {
    init: init,
    hosts: hosts,
    loadVideos: loadVideos,
    removeSectionVideos: removeSectionVideos
  };
})();

theme.ProductModel = (function() {
  var modelJsonSections = {};
  var models = {};
  var xrButtons = {};

  var selectors = {
    mediaGroup: '[data-product-single-media-group]',
    xrButton: '[data-shopify-xr]'
  };
  var _this = this;

  function init(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false
    };

    modelViewerContainers.forEach(function(modelViewerContainer, index) {
      var mediaId = modelViewerContainer.getAttribute('data-media-id');
      var modelViewerElement = modelViewerContainer.querySelector(
        'model-viewer'
      );
      var modelId = modelViewerElement.getAttribute('data-model-id');


      if (index === 0) {

        var mediaGroup = modelViewerContainer.closest(selectors.mediaGroup);
        if(mediaGroup) {


          modelViewerElement.addEventListener('shopify_model_viewer_ui_toggle_play', function () {
            mediaGroup.dispatchEvent(new CustomEvent('model:played', { bubbles: true }));
          });
          modelViewerElement.addEventListener('shopify_model_viewer_ui_toggle_pause', function () {
            mediaGroup.dispatchEvent(new CustomEvent('model:paused', { bubbles: true }));
          });


        var xrButton = mediaGroup.querySelector(selectors.xrButton);
        xrButtons[sectionId] = {
          element: xrButton,
          defaultId: modelId
        };
        }
      }

      models[mediaId] = {
        modelId: modelId,
        sectionId: sectionId,
        container: modelViewerContainer,
        element: modelViewerElement
      };
    });

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi
      }
    ]);
    theme.LibraryLoader.load('modelViewerUiStyles');
  }

  function setupShopifyXr(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }

    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];

        if (modelSection.loaded) continue;
        var modelJson = document.querySelector('#ModelJson-' + sectionId);

        window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
        modelSection.loaded = true;
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) return;

    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.element);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
    var xrButton = xrButtons[model.sectionId];

    model.container.addEventListener('mediaVisible', function() {

      xrButton.element.setAttribute('data-shopify-model3d-id', model.modelId);
      if (theme.Helpers.isTouch()) return;
      model.modelViewerUi.play();
    });

    model.container.addEventListener('mediaHidden', function() {
      xrButton.element.setAttribute(
        'data-shopify-model3d-id',
        xrButton.defaultId
      );
      model.modelViewerUi.pause();
    });

    model.container.addEventListener('xrLaunch', function() {
      model.modelViewerUi.pause();
    });
  }

  function removeSectionModels(sectionId) {
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (model.sectionId === sectionId) {
          models[key].modelViewerUi.destroy();
          delete models[key];
        }
      }
    }
    delete modelJsonSections[sectionId];
  }

  return {
    init: init,
    removeSectionModels: removeSectionModels
  };
})();

theme.FormStatus = (function() {
  var selectors = {
    statusMessage: '[data-form-status]'
  };

  function init() {
    var statusMessages = document.querySelectorAll(selectors.statusMessage);

    statusMessages.forEach(function(statusMessage) {
      statusMessage.setAttribute('tabindex', -1);
      statusMessage.focus();

      statusMessage.addEventListener(
        'blur',
        function(evt) {
          evt.target.removeAttribute('tabindex');
        },
        { once: true }
      );
    });
  }

  return {
    init: init
  };
})();

theme.Disclosure = (function() {
  var selectors = {
    disclosureForm: '[data-disclosure-form]',
    disclosureList: '[data-disclosure-list]',
    disclosureToggle: '[data-disclosure-toggle]',
    disclosureInput: '[data-disclosure-input]',
    disclosureOptions: '[data-disclosure-option]',
    disclosureClose: '[data-disclosure-close]'
  };

  var classes = {
    listVisible: 'disclosure-list--visible'
  };

  function Disclosure(disclosure) {


    this.container = disclosure;
    this._cacheSelectors();
    this._setupListeners();
  }

  Disclosure.prototype = Object.assign({}, Disclosure.prototype, {
    _cacheSelectors: function() {
      this.cache = {
        disclosureForm: this.container.closest(selectors.disclosureForm),
        disclosureList: this.container.querySelector(selectors.disclosureList),
        disclosureToggle: this.container.querySelector(
          selectors.disclosureToggle
        ),
        disclosureInput: this.container.querySelector(
          selectors.disclosureInput
        ),
        disclosureOptions: this.container.querySelectorAll(
          selectors.disclosureOptions
        ),
        disclosureClose: document.querySelector(
          selectors.disclosureClose
        )
      };
    },

    _setupListeners: function() {
      this.eventHandlers = this._setupEventHandlers();

      this.cache.disclosureToggle.addEventListener(
        'click',
        this.eventHandlers.toggleList
      );

      if(this.cache.disclosureClose){
        this.cache.disclosureClose.addEventListener(
          'click',
          this.eventHandlers.toggleList
        );
      }

      this.cache.disclosureOptions.forEach(function(disclosureOption) {
        disclosureOption.addEventListener(
          'click',
          this.eventHandlers.connectOptions
        );
      }, this);

      //document.body.addEventListener('click', this.eventHandlers.onBodyClick);
    },

    _setupEventHandlers: function() {
      return {
        connectOptions: this._connectOptions.bind(this),
        toggleList: this._toggleList.bind(this),
        onBodyClick: this._onBodyClick.bind(this),
        onDisclosureKeyUp: this._onDisclosureKeyUp.bind(this),
        onDisclosureListFocusOut: this._onDisclosureListFocusOut.bind(this),
        onDisclosureToggleFocusOut: this._onDisclosureToggleFocusOut.bind(this)
      };
    },

    _connectOptions: function(event) {
      event.preventDefault();

      this._submitForm(event.currentTarget.dataset.value);
    },

    _onDisclosureToggleFocusOut: function(event) {
      var disclosureLostFocus =
        this.container.contains(event.relatedTarget) === false;

      if (disclosureLostFocus) {
        this._hideList();
      }
    },

    _onDisclosureListFocusOut: function(event) {
      var childInFocus = event.currentTarget.contains(event.relatedTarget);

      var isVisible = this.cache.disclosureList.classList.contains(
        classes.listVisible
      );

      if (isVisible && !childInFocus) {
        this._hideList();
      }
    },

    _onDisclosureKeyUp: function(event) {
      if (event.which !== slate.utils.keyboardKeys.ESCAPE) return;
      this._hideList();
      this.cache.disclosureToggle.focus();
    },

    _onBodyClick: function(event) {
      var isOption = this.container.contains(event.target);
      var isVisible = this.cache.disclosureList.classList.contains(
        classes.listVisible
      );

      if (isVisible && !isOption) {
        this._hideList();
      }
    },

    _submitForm: function(value) {
      this.cache.disclosureInput.value = value;
      this.cache.disclosureForm.submit();
    },

    _hideList: function() {
      this.cache.disclosureList.classList.remove(classes.listVisible);
      this.cache.disclosureToggle.setAttribute('aria-expanded', false);
    },

    _toggleList: function() {
      var ariaExpanded =
        this.cache.disclosureToggle.getAttribute('aria-expanded') === 'true';
      this.cache.disclosureList.classList.toggle(classes.listVisible);
      this.cache.disclosureToggle.setAttribute('aria-expanded', !ariaExpanded);
      document.querySelector('.mobile-nav-wrapper').classList.toggle('currency-dropdown-open');
    },

    destroy: function() {
      this.cache.disclosureToggle.removeEventListener(
        'click',
        this.eventHandlers.toggleList
      );

      this.cache.disclosureOptions.forEach(function(disclosureOption) {
        disclosureOption.removeEventListener(
          'click',
          this.eventHandlers.connectOptions
        );
      }, this);

      this.container.removeEventListener(
        'keyup',
        this.eventHandlers.onDisclosureKeyUp
      );

      this.cache.disclosureList.removeEventListener(
        'focusout',
        this.eventHandlers.onDisclosureListFocusOut
      );

      this.cache.disclosureToggle.removeEventListener(
        'focusout',
        this.eventHandlers.onDisclosureToggleFocusOut
      );

      document.body.removeEventListener(
        'click',
        this.eventHandlers.onBodyClick
      );
    }
  });

  return Disclosure;
})();


/* ================ TEMPLATES ================ */
window.theme = theme || {};

theme.customerTemplates = (function() {
  var selectors = {
    RecoverHeading: '#RecoverHeading',
    RecoverEmail: '#RecoverEmail',
    LoginHeading: '#LoginHeading'
  };

  function initEventListeners() {
    this.recoverHeading = document.querySelector(selectors.RecoverHeading);
    this.recoverEmail = document.querySelector(selectors.RecoverEmail);
    this.loginHeading = document.querySelector(selectors.LoginHeading);
    var recoverPassword = document.getElementById('RecoverPassword');
    var hideRecoverPasswordLink = document.getElementById(
      'HideRecoverPasswordLink'
    );

    // Show reset password form
    if (recoverPassword) {
      recoverPassword.addEventListener(
        'click',
        function(evt) {
          evt.preventDefault();
          showRecoverPasswordForm();
          this.recoverHeading.setAttribute('tabindex', '-1');
          this.recoverHeading.focus();
        }.bind(this)
      );
    }

    // Hide reset password form
    if (hideRecoverPasswordLink) {
      hideRecoverPasswordLink.addEventListener(
        'click',
        function(evt) {
          evt.preventDefault();
          hideRecoverPasswordForm();
          this.loginHeading.setAttribute('tabindex', '-1');
          this.loginHeading.focus();
        }.bind(this)
      );
    }

    if (this.recoverHeading) {
      this.recoverHeading.addEventListener('blur', function(evt) {
        evt.target.removeAttribute('tabindex');
      });
    }

    if (this.loginHeading) {
      this.loginHeading.addEventListener('blur', function(evt) {
        evt.target.removeAttribute('tabindex');
      });
    }
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */

  function showRecoverPasswordForm() {
    document.getElementById('RecoverPasswordForm').classList.remove('hide');
    document.getElementById('CustomerLoginForm').classList.add('hide');

    if (this.recoverEmail.getAttribute('aria-invalid') === 'true') {
      this.recoverEmail.focus();
    }
  }

  function hideRecoverPasswordForm() {
    document.getElementById('RecoverPasswordForm').classList.add('hide');
    document.getElementById('CustomerLoginForm').classList.remove('hide');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var formState = document.querySelector('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!formState) {
      return;
    }

    // show success message
    var resetSuccess = document.getElementById('ResetSuccess');
    resetSuccess.classList.remove('hide');
    resetSuccess.focus();
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var newAddressForm = document.getElementById('AddressNewForm');
    var newAddressFormButton = document.getElementById('AddressNewButton');

    if (!newAddressForm) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew'
        }
      );
    }

    // Initialize each edit form's country/province selector
    document
      .querySelectorAll('.address-country-option')
      .forEach(function(option) {
        var formId = option.dataset.formId;
        var countrySelector = 'AddressCountry_' + formId;
        var provinceSelector = 'AddressProvince_' + formId;
        var containerSelector = 'AddressProvinceContainer_' + formId;

        // eslint-disable-next-line no-new
        new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
          hideElement: containerSelector
        });
      });

    // Toggle new/edit address forms
    document.querySelectorAll('.address-new-toggle').forEach(function(button) {
      button.addEventListener('click', function() {
        var isExpanded =
          newAddressFormButton.getAttribute('aria-expanded') === 'true';

        newAddressForm.classList.toggle('hide');
        newAddressFormButton.setAttribute('aria-expanded', !isExpanded);
        newAddressFormButton.focus();
      });
    });

    document.querySelectorAll('.address-edit-toggle').forEach(function(button) {
      button.addEventListener('click', function(evt) {
        var formId = evt.target.dataset.formId;
        var editButton = document.getElementById('EditFormButton_' + formId);
        var editAddress = document.getElementById('EditAddress_' + formId);
        var isExpanded = editButton.getAttribute('aria-expanded') === 'true';

        editAddress.classList.toggle('hide');
        editButton.setAttribute('aria-expanded', !isExpanded);
        editButton.focus();
      });
    });

    document.querySelectorAll('.address-delete').forEach(function(button) {
      button.addEventListener('click', function(evt) {
        var target = evt.target.dataset.target;
        var confirmMessage = evt.target.dataset.confirmMessage;

        // eslint-disable-next-line no-alert
        if (
          confirm(
            confirmMessage || 'Are you sure you wish to delete this address?'
          )
        ) {
          Shopify.postLink(target, {
            parameters: { _method: 'delete' }
          });
        }
      });
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      showRecoverPasswordForm.bind(this)();
    }
  }

  return {
    init: function() {
      initEventListeners();
      checkUrlHash();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();


/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.Cart = (function() {
  var selectors = {
    cartErrorMessage: '[data-cart-error-message]',
    cartErrorMessageWrapper: '[data-cart-error-message-wrapper]'
  };

  var classes = {
    cartNoCookies: 'cart--no-cookies',
    hide: 'hide',
    inputError: 'input--error'
  };

  var _this;

  function Cart(container) {

     _this = this;

    this.container = container;
    this.options = JSON.parse(this.container.getAttribute('data-section-settings'));
    this.itemCount = this.options['itemCount'];
    this.totalPrice = this.options['totalPrice'];
    this.delegateElement = new Delegate(this.container);
    this._onNoteChange = this._onNoteChange.bind(this);

    if (!theme.Helpers.cookiesEnabled()) {
      this.container.classList.add(classes.cartNoCookies);
    }

    this.container.addEventListener('change', this._onNoteChange);
    this.delegateElement.on('click', '[data-action="update-item-quantity"]:not(.Button_disabled), [data-action="remove-item"]', this._updateItemQuantity.bind(this));
    this.delegateElement.on('change', '.QuantitySelector__CurrentQuantity', this._updateItemQuantity.bind(this));
    this.delegateElement.on('click', '[data-action="close-drawer"][data-drawer-id="' + this.container.id + '"]', this._closeModal);
    document.addEventListener('click', function(e){
      var el = e.target;
      if(!el.classList.contains('Cart-Drawer') && !el.closest('.Cart-Drawer') && !el.closest('#HeaderCart') && !el.closest('.upsell-accessories-modal')) {
        var Drawer = document.querySelector('#sidebar-cart');

        if(Drawer) {
          if(Drawer.classList.contains('show')) {
            Drawer.classList.remove('show');
            document.querySelector('body').classList.remove('show_overlay');
          }
        }
      }
    });

    this.container.style.setProperty('--promotion-msg-height', '0px');
    if(this.container.querySelector('.Cart_ContentSide--box-promotion-message')){
      this.container.style.setProperty('--promotion-msg-height', parseInt(this.container.querySelector('.Cart_ContentSide--box-promotion-message').clientHeight)+24+'px');
    }

    if(this.container.querySelectorAll('.remove_bundle_btn_wrap').length > 0){
      this.container.querySelectorAll('.remove_bundle_btn_wrap').forEach(function(elem){
        elem.onclick = function(e){
          console.log(this.container);
          e.preventDefault();
          var removeItems = '';
          container.querySelectorAll('.CartBundleItem').forEach(function(elem){
            if(removeItems == ''){
              removeItems = 'updates['+elem.getAttribute('data-variant-id')+']=0';
            }
            else{
              removeItems = removeItems + '&updates['+elem.getAttribute('data-variant-id')+']=0';
            }
          });
          fetch('/cart/update.js', {
            body: removeItems,
            credentials: 'same-origin',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function (cart) {
            window.location.reload();
          });
        }
      });
    }

    var checkboxStatus = '';
    var cartSubmitElement = this.container.querySelector('.cart__submit_temp_btn');
    var formElement = document.querySelector('form.Cart');

    // KY: upsell accessories feature - 2023-11-13
    // A discount modal will show up when specific discounted product is not in cart
    // User can then add discounted item to cart and checkout with other items
    var upsellAccessoriesCartSubmitElement = this.container.querySelector('.cart__submit_upsell_accessories_temp_btn');
    var upsellAccessoriesModal = document.querySelector('.upsell-accessories-modal');
    // Check if specific variant id is in cart
    function checkUpsellAccessoriesVariantIdExisted(ids) {
      // upsell accessories discount variants id, from client documentation
      var upsellAccessoriesVariants = [46772169867611, 42969747882206, 43118134067422,43614641586398];
      var isMatch = upsellAccessoriesVariants.some(id => ids.includes(id));
      return isMatch;
    }

    // Get cart items and return an array of variant ids
    const retriveCartItems = async () => {
      var response = await fetch(`${window.routes.cartUrl}.js`, {
        credentials: 'same-origin',
        method: 'GET'
      });
      try {
        var data = await response.json();
        return {
          cartItemIds: data.items.map(item => item.variant_id),
          cartItems: data.items,
          subtotalPrice: data.items_subtotal_price
        };
      } catch (error) {
        console.log(error.message)
      }
    }

    formElement.querySelectorAll('.cartItem__checkbox').forEach(function(elem){
       checkboxStatus = checkboxStatus + elem.getAttribute('data-line-id') + '=1&';
    });
    localStorage.setItem('checkboxStatus', checkboxStatus);

    this.delegateElement.on('change', '.cartItem__checkbox input', function(inputElem){
      var formElement = document.querySelector('form.Cart');
      var subtotalElem = document.querySelector('.subtotal-row-wrapper .cart-subtotal-row');
      var currentPrice = parseInt(subtotalElem.getAttribute('data-price'));
      var discountPrice = parseInt(subtotalElem.getAttribute('data-saving'));
      var comparePrice = parseInt(inputElem.target.parentElement.getAttribute('data-compare-price') * inputElem.target.parentElement.getAttribute('data-quantity'));
      var itemPrice = parseInt(inputElem.target.parentElement.getAttribute('data-price') * inputElem.target.parentElement.getAttribute('data-quantity'));
      var totalPrice = 0;
      var totalDiscount = 0;
      var priceFormat = theme.priceCurrencyCodeEnable ? theme.moneyFormatWithCurrency : theme.moneyFormat;

      if(inputElem.target.checked){
        totalPrice = parseInt(currentPrice + itemPrice);
        totalDiscount = parseInt(discountPrice + comparePrice);
      }
      else{
        totalPrice = parseInt(currentPrice - itemPrice);
        totalDiscount = parseInt(discountPrice - comparePrice);
      }
      subtotalElem.setAttribute('data-price', totalPrice);
      subtotalElem.setAttribute('data-saving', totalDiscount);
      if(totalPrice > 999900){
        subtotalElem.querySelector('[data-cart-subtotal]').innerHTML = theme.Currency.formatMoney(totalPrice, priceFormat).replace(',00', '').replace('.', ' ');
      }
      else{
        subtotalElem.querySelector('[data-cart-subtotal]').innerHTML = theme.Currency.formatMoney(totalPrice, priceFormat).replace(',00', '').replace('.', '');
      }
      if(totalDiscount > 999900){
        subtotalElem.querySelector('.line-items-discount').innerHTML = '-' + theme.Currency.formatMoney(totalDiscount, theme.moneyFormat).replace(',00', '').replace('.', ' ');
      }
      else{
        subtotalElem.querySelector('.line-items-discount').innerHTML = '-' + theme.Currency.formatMoney(totalDiscount, theme.moneyFormat).replace(',00', '').replace('.', '');
      }

      if(totalDiscount == 0) subtotalElem.querySelector('.line-items-discount').style.display = 'none';
      else subtotalElem.querySelector('.line-items-discount').style.display = 'block';

      var checkboxStatus = '';
      formElement.querySelectorAll('.cartItem__checkbox').forEach(function(elem){
        if(!elem.querySelector('input').checked){
          checkboxStatus = checkboxStatus + elem.getAttribute('data-line-id') + '=0&';
        }
      });
      localStorage.setItem('checkboxStatus', checkboxStatus);
    });

    function submitCheckout() {
      var formElement = document.querySelector('form.Cart');
      var checkoutProduct = false;
      var allChecked = true;
      var cartItems = '', removeItems = '';
      var checkoutProductCount = 0;
      formElement.querySelectorAll('.cartItem__checkbox').forEach(function(elem){
        if(elem.querySelector('input').checked){
          checkoutProduct = true;
        }
        else{
          allChecked = false;
          checkoutProductCount = parseInt(checkoutProductCount) + 1;
          if(cartItems == ''){
            cartItems = 'updates['+elem.getAttribute('data-variant-id')+']='+elem.getAttribute('data-quantity');
            removeItems = 'updates['+elem.getAttribute('data-variant-id')+']=0';
          }
          else{
            cartItems = cartItems + '&updates['+elem.getAttribute('data-variant-id')+']='+elem.getAttribute('data-quantity');
            removeItems = removeItems + '&updates['+elem.getAttribute('data-variant-id')+']=0';
          }
        }
      });

      if(formElement.querySelectorAll('.cartItem__checkbox_alter').length > 0){ checkoutProduct = true; }
      if(Object.keys(cartItems).length === 0){}
      else{ localStorage.setItem('cartItems', cartItems); }
      if(checkoutProduct){
        if(allChecked) document.querySelector('.cart__checkout__btn').click();
        var tempCount = 0;
        fetch('/cart/update.js', {
          body: removeItems,
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (cart) {
          cart.json().then(function (content) {
            document.querySelector('.cart__checkout__btn').click();
          });
        });
      }
      else{ alert('Please select atleast one item to checkout'); }
    };

    // When upsell accessories discount feature is enabled, upsellAccessoriesCartSubmitElement will be available
    // Replace original checkout button feature, add upsell accessories discount modal logic
    if (upsellAccessoriesCartSubmitElement) {
      this.delegateElement.on('click', '.cart__submit_upsell_accessories_temp_btn', async function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
         // Stop showing modal if user has closed it and proceed checkout
         var hasModalClosed = upsellAccessoriesModal.getAttribute('data-upsell-modal-close');
         // Get shopping cart items subtotal price defined in checkUpsellAccessoriesVariantIdExisted function
        var { cartItemIds, cartItems, subtotalPrice } = await retriveCartItems();
        var isVariantIDsMatched = checkUpsellAccessoriesVariantIdExisted(cartItemIds);
        // KY: 2024-01-19 -- Special Requirement: If cart only has this product id, hide the button; If cart has more than this id, can show the button accordingly
        var isCartOnlyHasExcludedProduct = cartItems.every(item => item.product_id === 7856793419998);

        // If no specific variant ID for discounted product existed in cart, show discount modal
        if (JSON.parse(hasModalClosed) || subtotalPrice < 20000 || isVariantIDsMatched || isCartOnlyHasExcludedProduct) {
          submitCheckout();
          return;
        }
        upsellAccessoriesModal.style.display = 'block';
      })
    };

    if(cartSubmitElement){
      this.delegateElement.on('click', '.cart__submit_temp_btn', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          submitCheckout();
      });
    }

    var getCartItems = localStorage.getItem('cartItems');
    if(getCartItems){
      fetch('/cart/update.js', {
        body: getCartItems,
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type':'application/x-www-form-urlencoded'
        }
      }).then(function (cart) {
        localStorage.removeItem('cartItems');
        window.location.reload();
      });
    }

    if (this.options['hasShippingEstimator']) {

      _this.countrySelect = this.container.querySelector('[name="country"]');
      _this.provinceSelect = this.container.querySelector('[name="province"]');
      var defaultCountry = _this.countrySelect.getAttribute('data-default');
      if (defaultCountry) {
        for (var i = 0; i !== _this.countrySelect.options.length; ++i) {
          if (_this.countrySelect.options[i].text === defaultCountry) {
            _this.countrySelect.selectedIndex = i;
            break;
          }
        }
      } else {
        _this.countrySelect.selectedIndex = 0;
      }


      this._onCountryChangedListener = this._onCountryChanged.bind(this);
      this.countrySelect.addEventListener('change', this._onCountryChangedListener);

      var event = new Event('change', { bubbles: true });
      _this.countrySelect.dispatchEvent(event);

      // Then the province
      var defaultProvince = _this.provinceSelect.getAttribute('data-default');

      if (defaultProvince) {
        _this.provinceSelect.value = defaultProvince;
      }


      this.delegateElement.on('click', '.ShippingEstimator__Submit', this._fetchRates.bind(this));

    }

    var CartSpecialInstructionsSubmit  = this.container.querySelector('.CartSpecialInstructionsSubmit');
    if(CartSpecialInstructionsSubmit) {
      CartSpecialInstructionsSubmit.addEventListener('click', function(e) {
        e.preventDefault();

        var noteField = this.closest('form').querySelector('#CartSpecialInstructions');

        if(noteField) {
          var note = noteField.value;
          var headers = new Headers({ 'Content-Type': 'application/json' });

          var request = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ note: note })
          };
          fetch('/cart/update.js', request).then(function (response) {
            if(response.status == 200 ) {
              CartSpecialInstructionsSubmit.innerHTML = theme.strings.added_note;
              setTimeout(function () {
                CartSpecialInstructionsSubmit.innerHTML = theme.strings.add_note;
              },2000);

            }
          }).catch(function() {
              _this._showCartError(noteField);
            }.bind(this)
          );

        }
      });
    }
  }

  Cart.prototype = Object.assign({}, Cart.prototype, {

    _onCountryChanged: function() {
      var selectedOption = _this.countrySelect.options[_this.countrySelect.selectedIndex],
          provinces = JSON.parse(selectedOption.getAttribute('data-provinces') || '[]');

      // First remove all options
      _this.provinceSelect.innerHTML = '';
      if (provinces.length === 0) {
        _this.provinceSelect.parentNode.style.display = 'none';
        return;
      }

      // We need to build the provinces array
      provinces.forEach(function (data) {
        _this.provinceSelect.options.add(new Option(data[1], data[0]));
      });

      _this.provinceSelect.parentNode.style.display = 'block';
    },
    _fetchRates: function() {
      var country = _this.container.querySelector('[name="country"]').value,
          province = _this.container.querySelector('[name="province"]').value,
          city =  _this.container.querySelector('[name="city"]').value,
          zip = _this.container.querySelector('[name="zip"]').value;



      fetch(window.routes.cartUrl + '/shipping_rates.json?shipping_address[zip]=' + zip + '&shipping_address[country]=' + country + '&shipping_address[province]=' + province, {
        credentials: 'same-origin',
        method: 'GET'
      }).then(function (response) {
        response.json().then(function (result) {

          var resultsContainer = _this.container.querySelector('.ShippingEstimator__Results'),
              ShippingEstimatorParentRow = _this.container.querySelector('.ShippingEstimator'),
              errorContainer = _this.container.querySelector('.ShippingEstimator__Error');

          if (response.ok) {
            var shippingRates = result['shipping_rates'];

            if (shippingRates.length === 0) {
              resultsContainer.innerHTML = '<p>' + theme.strings.shippingEstimatorNoResults + '</p>';
            } else {
              var html = '<ul>';


              shippingRates.forEach(function (item) {
                html += '<li class="h6"><span class="title ">' + item['name'] + ':</span><span class="shipping_price">' + theme.Currency.formatMoney(item['price'], theme.moneyFormat) + '</span></li>';
              });

              html += '</ul>';

              var address_city = city;
              if(address_city.length == 0) {
              	address_city = province;
              }
              html += '<p class="Shipping_to_address h6">' + theme.strings.shippingTo + ' ' + address_city + '</p>';

              resultsContainer.firstElementChild.innerHTML = html;
            }


            errorContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            ShippingEstimatorParentRow.classList.remove('hide');

          } else {
            var errorHtml = '';

            Object.keys(result).forEach(function (key) {
              errorHtml += '<li class="Alert__ErrorItem">' + key + ' ' + result[key] + '</li>';
            });

            errorContainer.innerHTML = '<ul class="Alert__ErrorList">' + errorHtml + '</ul>';

            resultsContainer.style.display = 'none';
            errorContainer.style.display = 'block';
            ShippingEstimatorParentRow.classList.remove('hide');
          }
        });
      });


    },
    _sidebarDrawerOpen: function () {
      var Drawer = document.querySelector('#sidebar-cart');

      if(Drawer) {
        if(!Drawer.classList.contains('show')) {
          Drawer.classList.add('show');
          document.querySelector('body').classList.add('show_overlay');
          Drawer.addEventListener('transitionend', () => {
            Drawer.focus();

                slate.a11y.trapFocus({
                container: Drawer,
                elementToFocus: Drawer
              });
          }, { once: true });

        }
      }
    },
    _onProductAdded: function () {

      var quick_view_modal = document.querySelector('#modal-quick-view[aria-hidden="false"]');
      if(quick_view_modal) {
      	quick_view_modal.querySelector('.close-quick-view').dispatchEvent(new Event('click', { bubbles: true }));
      }

      if(_this.options['type'] == 'drawer') {
        _this._rerenderCart().then(function () {
          _this._sidebarDrawerOpen();
        });
      } else {
        window.location.href = window.routes.cartUrl;
      }
    },
    _closeModal: function() {

      var Drawer = this.closest('.Drawer');
      if(Drawer) {
        Drawer.classList.remove('show');
        document.querySelector('body').classList.remove('show_overlay');
      }
    },
    _updateItemQuantity: function(event,target) {

      var quantity = null;
      var currentQty = null;
      var inventory_qty =  null;
      var inventory_management = '';

      if (target.tagName === 'INPUT') {
        quantity = parseInt(target.value);
        currentQty = parseInt(target.value);
      } else {
        quantity = parseInt(target.getAttribute('data-quantity'));
        currentQty = parseInt(target.getAttribute('data-current-qty'));
      }

      inventory_management = target.getAttribute('data-inventory_management');
      inventory_qty = parseInt(target.getAttribute('data-inventory_qty'));

      var parentEl = target.closest('.CartItem');
      var limitQty = parentEl.getAttribute('data-limit-qty');

      if(limitQty == 'true' && currentQty == 1){
        parentEl.querySelector('.QuantitySelector__limit-message').classList.remove('hide');
        event.preventDefault();
        return false;
      }
      else parentEl.querySelector('.QuantitySelector__limit-message').classList.add('hide');

      if(quantity > inventory_qty && inventory_management != '' ) {
        if(parentEl) {
          var qtyErrorEls = parentEl.querySelectorAll('.QuantitySelector__error-message');
          if(qtyErrorEls.length) {
            qtyErrorEls.forEach(function(qtyErrorEl,index) {
              qtyErrorEl.classList.remove('hide');
            });

          }
        }
      } else {
        fetch(window.routes.cartChangeUrl + '.js', {
          body: JSON.stringify({ id: target.getAttribute('data-line-id'), quantity: quantity }),
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
          }
        }).then(function (cart) {
          cart.json().then(function (content) {
            _this.itemCount = content['item_count'];
            _this.totalPrice = content['totalPrice'];
            _this._rerenderCart();
          });
        });
      }

        event.preventDefault();
    },
    _rerenderCart: function () {

      _this.options = JSON.parse(_this.container.getAttribute('data-section-settings'));

      return fetch(window.routes.cartUrl + '?view=' + (this.options['drawer'] && window.theme.pageType !== 'cart' ? 'drawer' : 'ajax') + '&timestamp=' + Date.now(), {
        credentials: 'same-origin',
        method: 'GET'
      }).then(function (content) {

          content.text().then(async function (html) {

            _this._replaceContent(html);

            // KY: upsell accessories discount feature - 2023-11-14
            // For cart drawer upsell accessories message button display
            // Check if specific discounted product variant id existence, then show hide the message button
            var isUpsellEnabled = document.querySelector(".upsell-accessories-modal").getAttribute("data-upsell-modal-enabled");
            var upsellAccessoriesCartDrawerButton = document.querySelector('.cart-upsell-accessories-button');
            if (JSON.parse(isUpsellEnabled) && !window.location.href.includes(window.routes.cartUrl)) {
              var upsellAccessoriesVariants = [46772169867611, 42969747882206, 43118134067422,43614641586398];
              const response = await fetch(`${window.routes.cartUrl}.js`, {
                credentials: 'same-origin',
                method: 'GET'
              });
              try {
                var data = await response.json();
                // KY: 2024-01-19 -- Check if price is less than 200 Euro and upsell product is already in the cart, if yes, hide the button
                var variant_ids = data.items.map(item => item.variant_id);
                // KY: 2024-01-19 -- Special Requirement: If cart only has this product id, hide the button; If cart has more than this id, can show the button accordingly
                var isCartOnlyHasExcludedProduct = data.items.every(item => item.product_id === 7856793419998);
                var isMatch = upsellAccessoriesVariants.some(id => variant_ids.includes(id));
                if (isMatch || data.items_subtotal_price < 20000 || isCartOnlyHasExcludedProduct) {
                  upsellAccessoriesCartDrawerButton.style.display = 'none';
                } else {
                  upsellAccessoriesCartDrawerButton.style.display = 'block';
                }
              } catch (error) {
                console.log(error.message);
              }
            };

            // KY: EcoCredits get maximum points redeemable feature - 2024-03-25
            // Get maximum points redeemable value from cart page
            var isEcoCreditMsgEnabledInCartDrawer = document.querySelector("#sidebar-cart").getAttribute("data-enabled-ecocredit-msg");
            if (window.location.pathname !== window.routes.cartUrl && JSON.parse(isEcoCreditMsgEnabledInCartDrawer)) {
              const cartDrawerEcoCreditMsg = document.querySelector('.cart-drawer-ecocredits-msg__container');
              const cartDrawerEcoCreditPoints = document.querySelector('.cart-drawer-ecocredits-msg__points');
              try {
                const response = await fetch(`${window.routes.cartUrl}.js`, {
                  credentials: 'same-origin',
                  method: 'GET'
                });
                const data = await response.json();
                const productList = data.items.map((item) => ({
                  productId: `${item.product_id}`,
                  variantId: `${item.variant_id}`,
                  quantity: item.quantity,
                  price: `${item.price / 100}`
                }))

                const { apiDomain, acceptedLanguage, xAppid } = theme.emailSubscription;

                const getRedeemablePoints = await fetch(`${apiDomain}/integral/web/pointsCashRule/getRule`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-appid': xAppid,
                    traceId: generateTraceId(),
                    'Accept-Language': acceptedLanguage,
                  },
                  body: JSON.stringify({
                    productList,
                    source: 'CART'
                  }),
                });

                const pointsData = await getRedeemablePoints.json();

                if (pointsData && pointsData.code === '0' && pointsData.data && pointsData.data.maxPoints) {
                  cartDrawerEcoCreditMsg.style.display = 'block';
                  const cash = Number(pointsData.data.maxPoints * pointsData.data.ratio).toFixed(2);
                  const maxReduction =
                    Number(cash) >= 10000
                      ? Number(cash)
                          .toLocaleString("de")
                          .replace(".", " ")
                      : Number(cash)
                          .toLocaleString("de")
                          .replace(".", "");
                  cartDrawerEcoCreditPoints.innerText = maxReduction + '€';
                }
              } catch (error) {
                cartDrawerEcoCreditMsg.style.display = 'none';
                console.error(error.message)
              }
            }

            if (_this.options['hasShippingEstimator']) {

              _this.countrySelect = _this.container.querySelector('[name="country"]');
              _this.provinceSelect = _this.container.querySelector('[name="province"]');
              var defaultCountry = _this.countrySelect.getAttribute('data-default');
              if (defaultCountry) {
                for (var i = 0; i !== _this.countrySelect.options.length; ++i) {
                  if (_this.countrySelect.options[i].text === defaultCountry) {
                    _this.countrySelect.selectedIndex = i;
                    break;
                  }
                }
              } else {
                _this.countrySelect.selectedIndex = 0;
              }


              _this._onCountryChangedListener = _this._onCountryChanged.bind(this);
              _this.countrySelect.addEventListener('change', _this._onCountryChangedListener);

              var event = new Event('change', { bubbles: true });
              _this.countrySelect.dispatchEvent(event);

              // Then the province
              var defaultProvince = _this.provinceSelect.getAttribute('data-default');

              if (defaultProvince) {
                _this.provinceSelect.value = defaultProvince;
              }



            }

            var CartSpecialInstructionsSubmit  = _this.container.querySelector('.CartSpecialInstructionsSubmit');
            if(CartSpecialInstructionsSubmit) {
              CartSpecialInstructionsSubmit.addEventListener('click', function(e) {
                e.preventDefault();

                var noteField = this.closest('form').querySelector('#CartSpecialInstructions');

                if(noteField) {
                  var note = noteField.value;
                  var headers = new Headers({ 'Content-Type': 'application/json' });

                  var request = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ note: note })
                  };
                  fetch('/cart/update.js', request).then(function (response) {
                    if(response.status == 200 ) {
                      CartSpecialInstructionsSubmit.innerHTML = theme.strings.added_note;
                      setTimeout(function () {
                        CartSpecialInstructionsSubmit.innerHTML = theme.strings.add_note;
                      },2000);

                    }
                  }).catch(function() {
                    _this._showCartError(noteField);
                  }.bind(this)
                          );

                }
              });
            }

          });

      });
    },
    _replaceContent: function(html) {
      var tempElement = document.createElement('div');
      tempElement.innerHTML = html;
      var cartNodeParent = this.container.querySelector('.Cart').parentNode;

      var cartElem = this.container.querySelector('.Cart');
      if (this.options['drawer'] && window.theme.pageType !== 'cart') {
        var currentScrollPosition = this.container.querySelector('.Drawer__Main').scrollTop;
        cartNodeParent.replaceChild(tempElement.querySelector('.Cart'), this.container.querySelector('.Cart'));
        this.container.querySelector('.Drawer__Main').scrollTop = currentScrollPosition;
      } else {
        if (this.itemCount === 0) {
          this.container.innerHTML = tempElement.querySelector('.cart-page-width').innerHTML;
        } else {

            cartElem.replaceChild(tempElement.querySelector('.Cart_ContentSide'), this.container.querySelector('.Cart_ContentSide'));
            cartElem.querySelector('.cart_sidebar_first_block').innerHTML = tempElement.querySelector('.cart_sidebar_first_block').innerHTML;
            var checkboxStatus = localStorage.getItem('checkboxStatus');
            cartNodeParent.querySelectorAll('.cartItem__checkbox').forEach(function(elem){
              var line_id = elem.getAttribute('data-line-id');
              var strIndex = parseInt(checkboxStatus.indexOf(line_id));
              if(strIndex >= 0){
                var newIndex = strIndex + parseInt(line_id.length) + parseInt(1);
                var status = checkboxStatus.substring(newIndex);
                if(status.split('&')[0] == 0){
                  elem.querySelector('input').click();
                }
              }
            });
        }
      }

      // We can also update the dot and the quantity
      var cartResult = JSON.parse(tempElement.querySelector('[data-section-type="cart-template"]').getAttribute('data-section-settings'));
      var header__CartCount = document.querySelector('.header_cart_count');
      var header_total_priceEl = document.querySelector('.cart_total_price');
      this.itemCount = cartResult['itemCount'];
      this.totalPrice = cartResult['totalPrice'];
      if(header__CartCount) {
        header__CartCount.textContent = this.itemCount;
        if(this.itemCount > 0) header__CartCount.classList.remove('hide');
        else header__CartCount.classList.add('hide');
      }
      if(header_total_priceEl) {
        header_total_priceEl.textContent = theme.Currency.formatMoney(this.totalPrice, theme.moneyFormat);
      }

      setTimeout(function(){
        _this.container.getElementsByTagName("klarna-placement")[0].setAttribute("data-purchase-amount", cartResult['totalPrice']);
        window.Klarna.OnsiteMessaging.refresh();
        _this.container.getElementsByTagName("klarna-placement")[0].style.display = 'block';
      }, 1000);

      updatePromotionMessage(this.totalPrice);
      updatePromotionMessageAlter(cartResult['originalTotalPrice']);
    },
    _onNoteChange: function(evt) {
      if (!evt.target.hasAttribute('data-cart-notes')) return;


      var note = evt.target.value;
      this._hideCartError();

      var headers = new Headers({ 'Content-Type': 'application/json' });

      var request = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ note: note })
      };

      fetch('/cart/update.js', request).catch(
        function() {
          this._showCartError(evt.target);
        }.bind(this)
      );
    },
    _showCartError: function(elementToFocus) {
      document.querySelector(selectors.cartErrorMessage).textContent =
        theme.strings.cartError;

      document
        .querySelector(selectors.cartErrorMessageWrapper)
        .classList.remove(classes.hide);

      if (!elementToFocus) return;
      elementToFocus.focus();
    },
    _hideCartError: function() {
      document
        .querySelector(selectors.cartErrorMessageWrapper)
        .classList.add(classes.hide);
      document.querySelector(selectors.cartErrorMessage).textContent = '';
    }
  });

  return Cart;
})();


window.theme = window.theme || {};

theme.HeaderSection = (function() {
  function Header() {
    theme.Header.init();
    theme.MobileNav.init();
  }

  Header.prototype = Object.assign({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
      theme.MobileNav.unload();
    }
  });

  return Header;
})();

theme.AnnouncementBar = (function() {
  function AnnouncementBar(container) {
    var _this = this;
    this.container = container;
    this.AnnouncementBar__Slider = this.container.querySelector('.AnnouncementBar__Slider');
   	this.AnnouncementBar__close_button = this.container.querySelector('.AnnouncementBar__close_button');

    if(this.AnnouncementBar__Slider) {
      this.options = JSON.parse(this.AnnouncementBar__Slider.getAttribute('data-flickity-config'));
      function slideHeightCalculate () {
        var maxSlideHeight = 0;
        var slidesLength = _this.AnnouncementBar__Slider.querySelectorAll('.AnnouncementBar__Content').length;
        if(slidesLength > 1 ) {
          _this.AnnouncementBar__Slider.querySelectorAll('.AnnouncementBar__Content').forEach(function (item,index) {
            item.style.height = 'auto';
            var slideHeight = item.offsetHeight;
            if(slideHeight > maxSlideHeight) {
              maxSlideHeight = slideHeight;
            }
          });

          _this.AnnouncementBar__Slider.querySelectorAll('.AnnouncementBar__Content').forEach(function (item,index) {
            item.style.height = maxSlideHeight + 'px';
          });


          setTimeout(function () {
            document.documentElement.style.setProperty('--announcement-bar-height', document.getElementById('shopify-section-announcement-bar').offsetHeight + 'px');
          },500);
        }
      }
      window.addEventListener('resize', slideHeightCalculate);

      slideHeightCalculate();
      this.flickityInstance = new Flickity(this.AnnouncementBar__Slider, this.options);
      setTimeout(function () {
        document.documentElement.style.setProperty('--announcement-bar-height', document.getElementById('shopify-section-announcement-bar').offsetHeight + 'px');
      },500);
    }

    if(this.AnnouncementBar__close_button) {
      this.AnnouncementBar__close_button.addEventListener('click', function(e) {
        e.preventDefault();

        var parentSection = this.closest('[data-section-type="announcement-bar"]');
        parentSection.style.display = 'none';
        document.documentElement.style.setProperty('--announcement-bar-height', 0);

      });
    }
  }

  return AnnouncementBar;
})();

theme.LogoBar = (function() {
  function LogoBar(container) {
    this.container = container;

    var self = this;
    this.LogoBar__Slider = this.container.querySelector('.logo-bar--slider');

    if(this.LogoBar__Slider) {
      this.options = JSON.parse(this.LogoBar__Slider.getAttribute('data-flickity-config'));
      this.flickityInstance = new Flickity(this.LogoBar__Slider, this.options);

      var slider_custom_arrows = container.querySelector('.slider_custom_arrows');
      if(slider_custom_arrows) {
        var slider_custom_btns = slider_custom_arrows.querySelectorAll('.btn');
        slider_custom_btns.forEach(function(item,index) {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            var isNext =  item.classList.contains('button-next');
            if(isNext) {
              self.flickityInstance.next();
            } else {
              self.flickityInstance.previous();
            }

          });
        });
      }


    }
  }

  return LogoBar;
})();

theme.HomepageAccordion = (function() {
  function HomepageAccordion(container) {

//     function debounce(func){
//       var timer;
//       return function(event){
//         if(timer) clearTimeout(timer);
//         timer = setTimeout(func,350,event);
//       };
//     }

    var _this = this;
    _this.container = container;
    _this.accordion = _this.container.querySelector('.homepage_accordion');
    if(_this.accordion) {
      var questions_arr = _this.accordion.querySelectorAll('.question');

      var maxHeightAnswerBlock = 0;
      var sectionDefaultHeight = this.container.offsetHeight;
      var sectionHeight = this.container.closest('.shopify-section').offsetHeight;

      var answer_arr = _this.accordion.querySelectorAll('.answer');
      if(answer_arr.length) {
        answer_arr.forEach(function(item,index) {
          item.classList.add('active');
          var blockHeight = item.offsetHeight;
          if(blockHeight > maxHeightAnswerBlock) {
            maxHeightAnswerBlock  = blockHeight;
          }
          item.classList.remove('active');
        });
      }

      sectionHeight += maxHeightAnswerBlock;

      _this.container.style.minHeight = sectionHeight+"px";


      if(questions_arr.length) {
        questions_arr.forEach(function(item,index) {
          item.addEventListener('click', function(e) {
            e.preventDefault();

            var self = this;
            var answer_block = this.closest('.homepage_accordion__block').querySelector('.answer');
            var block_id = self.getAttribute('data-id');

            var current_active_block = _this.accordion.querySelector('.question.active');
            var current_answer_active_block = _this.accordion.querySelector('.answer.active');

            var delay = 0;
            if(current_active_block)  {
              var current_block_id = current_active_block.getAttribute('data-id');

              if(current_block_id != block_id) {

                current_answer_active_block.style.height = current_answer_active_block.scrollHeight + 'px';
                current_answer_active_block.offsetHeight;
                current_answer_active_block.style.height = 0;

                current_answer_active_block.classList.remove('active');
                current_active_block.classList.remove('active');


//                 current_answer_active_block.style.height = '0px';

//                 answer_block.addEventListener('transitionend', function () {
//                   current_answer_active_block.classList.remove('active');
//                   current_active_block.classList.remove('active');
//                 }, {
//                   once: true
//                 });
              }
            }


            if (!answer_block.classList.contains('active')) {

              self.classList.add('active');
              answer_block.classList.add('active');
              answer_block.style.height = 'auto';

              var height = answer_block.clientHeight + 'px';

              answer_block.style.height = '0px';

              setTimeout(function () {
                answer_block.style.height = height;
              }, delay);

            } else {

              answer_block.style.height = '0px';

              answer_block.addEventListener('transitionend', function () {
                answer_block.classList.remove('active');
                self.classList.remove('active');
              }, {
                once: true
              });

            }

          });
        });
      }


      window.addEventListener("resize",theme.Helpers.debounce(function(e){
        var findActiveBlock = _this.container.querySelector('.answer.active');
        if(findActiveBlock) {
          findActiveBlock.classList.remove('active');
          findActiveBlock.style.height = '0px';
        }
        _this.container.removeAttribute('style');
         var newSectionHeight = _this.container.closest('.shopify-section').offsetHeight;
         var maxHeightAnswerBlock = 0;


        if(answer_arr.length) {
          answer_arr.forEach(function(item,index) {
            item.classList.add('active');
            item.removeAttribute('style');
            var blockHeight = item.offsetHeight;
            item.classList.remove('active');

            if(blockHeight > maxHeightAnswerBlock) {
              maxHeightAnswerBlock  = blockHeight;
            }
          });
        }
        if(findActiveBlock) {
          findActiveBlock.classList.add('active');
          findActiveBlock.style.height = 'auto';
          var height = findActiveBlock.clientHeight + 'px';
          findActiveBlock.style.height = '0px';
          setTimeout(function () {
            findActiveBlock.style.height = height;
          }, 0);
        }

        newSectionHeight += maxHeightAnswerBlock;
        _this.container.style.minHeight = newSectionHeight+"px";
      }));
    }
  }

  return HomepageAccordion;
})();

theme.PageAccordion = (function() {
  function PageAccordion(container) {

    var _this = this;
    _this.container = container;
    _this.accordion = _this.container.querySelector('.faq_accordion');
    if(_this.accordion) {
      var questions_arr = _this.accordion.querySelectorAll('.question');

      if(questions_arr.length) {
       questions_arr.forEach(function(item,index) {
          item.addEventListener('click', function(e) {
            e.preventDefault();

            var self = this;
            var answer_block = this.closest('.accordion__block').querySelector('.answer');
            var block_id = self.getAttribute('data-id');

            if (!answer_block.classList.contains('active')) {

              self.classList.add('active');
              answer_block.classList.add('active');
              answer_block.style.height = 'auto';

              var height = answer_block.clientHeight + 'px';

              answer_block.style.height = '0px';

              setTimeout(function () {
                answer_block.style.height = height;
              }, 0);

            } else {

              answer_block.style.height = '0px';

              answer_block.addEventListener('transitionend', function () {
                answer_block.classList.remove('active');
                self.classList.remove('active');
              }, {
                once: true
              });

            }

          });
        });
      }
    }

  }

  return PageAccordion;
})();

theme.MainSearchPage = (function() {
  function MainSearchPage(container) {
    var _this = this;
    var pagination_mode = container.getAttribute('data-pagination_mode');
    if(pagination_mode != 'standart') {
      var endlessScroll = new Ajaxinate({
        container: '#AjaxinateContainer',
        pagination: '#AjaxinatePagination',
        method: pagination_mode,
        offset: 500
      });
    }



    theme.ProductItemSwatches();


    var filter_titles = container.querySelectorAll('.category-filters-section-title');
    if(filter_titles.length) {
      filter_titles.forEach(function(item,index) {



        var self = item;
        var parentArea = self.closest('.category-filters-area-section');
        var filtersBlock = parentArea.querySelector('.category-filters-area-list');

        if (filtersBlock.classList.contains('active')) {
          filtersBlock.style.height = 'auto';
          var height = filtersBlock.clientHeight + 'px';
          filtersBlock.style.height = height;

        } else {
          filtersBlock.style.height = '0px';
        }


        item.addEventListener('click', function(e) {
          e.preventDefault();

          var self = this;
          var parentArea = self.closest('.category-filters-area-section');
          var filtersBlock = parentArea.querySelector('.category-filters-area-list');

          if (!filtersBlock.classList.contains('active')) {

            self.classList.add('active');
            filtersBlock.classList.add('active');
            filtersBlock.style.height = 'auto';

            var height = filtersBlock.clientHeight + 'px';

            filtersBlock.style.height = '0px';

            setTimeout(function () {
              filtersBlock.style.height = height;
            }, 0);

          } else {
            filtersBlock.style.height = '0px';
            self.classList.remove('active');
            filtersBlock.classList.remove('active');

          }
        });
      });
    }

    var show_more_options = container.querySelectorAll('.show_more_options');
    if(show_more_options.length) {

      container.querySelectorAll('.advanced-filters').forEach(function(filter,index) {
      	var children_length = filter.querySelectorAll('li').length;
        if(children_length > 5) {

          var heigth_limit = 0;
          for(var i=0; i < filter.querySelectorAll('li').length; i++) {
            var item = filter.querySelectorAll('li')[i];
            heigth_limit = heigth_limit + item.offsetHeight;
            if(i == 4) {
              break;
            }
          }

          var show_more_option = filter.nextElementSibling;
          if(show_more_option) {
            filter.setAttribute('data-heigth_limit', heigth_limit);
            filter.style.maxHeight = heigth_limit+'px';
            show_more_option.style.display = 'inline-block';
          }
        }
      });

      show_more_options.forEach(function (btn,index) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();

          var filters_list = this.previousElementSibling;
          var heigth_limit = filters_list.getAttribute('data-heigth_limit');
          var default_text = this.getAttribute('data-default-text');

          if(this.classList.contains("openedFilter")) {
          	filters_list.style.maxHeight  = heigth_limit+'px';
            this.classList.remove('openedFilter');
            this.innerHTML = default_text;
          } else {

            var filterBlockLength = 0;
            for(var i=0; i < filters_list.querySelectorAll('li').length; i++) {
              var item = filters_list.querySelectorAll('li')[i];
              filterBlockLength = filterBlockLength + item.offsetHeight;
            }
            filters_list.style.maxHeight = filterBlockLength+'px';
            this.classList.add('openedFilter');
            this.innerHTML = theme.strings.show_less;

          }
        });
      });
    };


    var open_sidebar_btn  = container.querySelector('.open_mobile_sidebar');
    var close_sidebar_btn = container.querySelector('.close-collection-sidebar');
    if(open_sidebar_btn) {
      open_sidebar_btn.addEventListener('click', function(e) {
        e.preventDefault();
        var sidebarEl =  container.querySelector('.collection-sidebar');
        if(sidebarEl) {
          sidebarEl.classList.add('show');
          document.querySelector('body').classList.add('show_overlay');
        }
      });
    }
    if(close_sidebar_btn) {
      close_sidebar_btn.addEventListener('click', function(e) {
        e.preventDefault();
        var sidebarEl =  container.querySelector('.collection-sidebar');
        if(sidebarEl) {
          sidebarEl.classList.remove('show');
          document.querySelector('body').classList.remove('show_overlay');
        }
      });
    }


    var check_filter_value_btns = container.querySelectorAll('.advanced-filter a');
    if(check_filter_value_btns.length) {
      check_filter_value_btns.forEach(function (item,index) {
        item.addEventListener('click',function (e) {
          e.preventDefault();
          var parentFilterNode = this.closest('.advanced-filter');
          var filterInput = parentFilterNode.querySelector('[type="checkbox"]');
          if(filterInput) {
            if(filterInput.checked) {
              filterInput.checked = false;
            } else {
              filterInput.checked = true;
            }
          }


          var FitersFormEl = item.closest('form');
          if(FitersFormEl) {
            const formData = new FormData(FitersFormEl);

            const searchParams = new URLSearchParams(formData).toString();
            var pathname  = window.location.pathname;
            window.location.href = pathname + "?" + searchParams;
          } else {

            var href = this.getAttribute('href');
            var pathname  = window.location.pathname;
            var search_url_size = window.location.search.length;
            if(search_url_size) {
              window.location.href = href + window.location.search;
            } else {
              window.location.href = href ;
            }
          }


        });
      });
    }


    var group__price_rangeBlocks = container.querySelectorAll('.filter-group-display__price-range-input');
    if(group__price_rangeBlocks.length) {
      document.addEventListener('change', function(e){
        var el = e.target;

        if(el.classList.contains('filter-group-display__price-range-input')) {
          var FitersFormEl = el.closest('form');
          if(FitersFormEl) {
            const formData = new FormData(FitersFormEl);

            const searchParams = new URLSearchParams(formData).toString();
            var pathname  = window.location.pathname;
            window.location.href = pathname + "?" + searchParams;
          }

        }
      });
    }
    var price_range_inputs =  container.querySelectorAll('.price_range');
    if(price_range_inputs.length) {
      document.addEventListener('change', function(e){
        var el = e.target;

        if(el.classList.contains('price_range')) {
          var FitersFormEl = el.closest('form');
          if(FitersFormEl) {

            var prices_arr = [];
            var price_range_inputs = FitersFormEl.querySelectorAll('.filter-group-display__price-range-input');
            var price_range_container = el.closest('.price_range_container');
            if(price_range_container) {
              price_range_container.querySelectorAll('.price_range').forEach(function(item,index) {
                var input_val = item.value * 1;
                prices_arr.push(input_val);
              });
              if(price_range_inputs.length) {
                var min = Math.min.apply(null, prices_arr),
                    max = Math.max.apply(null, prices_arr);
                price_range_inputs[0].value = min;
                price_range_inputs[1].value = max;
              }
            }

            const formData = new FormData(FitersFormEl);
            const searchParams = new URLSearchParams(formData).toString();
            var pathname  = window.location.pathname;
            window.location.href = pathname + "?" + searchParams;
          }

        }
      });
    }



  }

  return MainSearchPage;
})();

theme.AdvancedSearch = (function() {
  function AdvancedSearch(container) {
    var _this = this;
    _this.container = container;
  	var submit_btn = this.container.querySelector('.search-form__connected-submit');
    if(submit_btn) {
      submit_btn.addEventListener('click', function(e) {
      	e.preventDefault();

        var form = this.closest('form');
        var formValue = form.querySelector('.search-form__input').value;
        var formProductType = form.querySelector('#advanced-search-product-type').value;

       var productQuery = '' +  formValue + '*' + (formProductType !== '' ? ' AND ' + 'product_type:' + formProductType : '');
         if (window.theme.searchMode !== 'product') {
              productQuery = '' +  formValue + '*';
         }

         var    formAction = window.routes.searchUrl + '?q=' + productQuery + '&type='+window.theme.searchMode;
        window.location.href = formAction;
      });
    }
  }

  return AdvancedSearch;
})();

theme.CountdownTimer = (function() {
  function CountdownTimer(container) {
    this.container = container;
    var countdown_timer = this.container.querySelector('.countdown_timer');
    if(countdown_timer) {
      var dateStr = countdown_timer.getAttribute('data-time');
      var timer_behaviour = countdown_timer.getAttribute('data-timer_behaviour');
      var countDownDate = new Date(dateStr).getTime();

      var timerDaysElem = countdown_timer.querySelector('.timer-days .timer-value');
      var timerHoursElem = countdown_timer.querySelector('.timer-hours .timer-value');
      var timerMinutesElem = countdown_timer.querySelector('.timer-minutes .timer-value');
      var timerSecondsElem = countdown_timer.querySelector('.timer-seconds .timer-value');

      var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        if(distance <= 0) {

          if(timer_behaviour == 'use_current_day') {
            countDownDate = new Date().setHours(23,59,59,999);
            distance = countDownDate - now;

          } else if(timer_behaviour == 'show_zeros') {
            timerDaysElem.innerHTML = '00';
            timerHoursElem.innerHTML = '00';
            timerMinutesElem.innerHTML = '00';
            timerSecondsElem.innerHTML = '00';
            clearInterval(x);
          } else {
            timerDaysElem.innerHTML = '00';
            timerHoursElem.innerHTML = '00';
            timerMinutesElem.innerHTML = '00';
            timerSecondsElem.innerHTML = '00';
            clearInterval(x);
            var sectionEl = container.closest('.shopify-section');
            if(sectionEl) {
              sectionEl.style.display = 'none';
            }
          }
        }


        if(distance >= 0) {
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);

          if(days < 10) {
            days = "0"+days;
          }
          if(hours < 10) {
            hours = "0"+hours;
          }
          if(minutes < 10) {
            minutes = "0"+minutes;
          }
          if(seconds < 10) {
            seconds = "0"+seconds;
          }

          timerDaysElem.innerHTML = days;
          timerHoursElem.innerHTML = hours;
          timerMinutesElem.innerHTML = minutes;
          timerSecondsElem.innerHTML = seconds;
        }
      },1000);

    }

  }

  return CountdownTimer;
})();

theme.FeaturedProducts = (function() {
  function FeaturedProducts(container) {
    var tabs_nav = container.querySelector('.index-tabs_nav');
    var sliderEl = container.querySelector('.index-tabs-content_block__slider');
    var flickityInstance;
    var slider_options;
    var slider_config;
    var windowWidth = window.innerWidth;

    if(sliderEl) {
      var platter_elem = sliderEl.querySelector('.scroller-platter');
      slider_platter_config = platter_elem.getAttribute('data-flickity-config');

      slider_config = sliderEl.getAttribute('data-flickity-config');
      if(slider_platter_config != ''){
        slider_options = JSON.parse(slider_platter_config);
        flickityInstance = new Flickity(platter_elem, slider_options);
        flickityInstance.element.classList.add("rendered");

        var slider_custom_arrows = container.querySelector('.slider_custom_arrows');
        var total_slides = container.querySelectorAll('.product-item-block').length;
        if(slider_custom_arrows) {
          var slider_custom_btns = slider_custom_arrows.querySelectorAll('.btn');
          slider_custom_btns.forEach(function(item,index) {
            item.addEventListener('click', function(e) {
              e.preventDefault();
              var isNext =  item.classList.contains('button-next');
              if(isNext) {
                flickityInstance.next();
              } else {
                flickityInstance.previous();
              }

            });
          });
          flickityInstance.on('change', function(index) {
            if(windowWidth >= 1239) {
              var document_width = document.documentElement.offsetWidth;
              var current_slides = Math.floor(document_width / 472);
              if(index > 0) slider_custom_arrows.querySelector('.button-prev').classList.remove('disabled');
              else slider_custom_arrows.querySelector('.button-prev').classList.add('disabled');

              if(total_slides - index == current_slides) slider_custom_arrows.querySelector('.button-next').classList.add('disabled');
              else slider_custom_arrows.querySelector('.button-next').classList.remove('disabled');
            }
          });
        }
      }

      function alignProductInfo(){
        document.querySelectorAll('.index-tabs-content_block__slider').forEach(function(element){
          var infoHeight = 0;
          var titleHeight = 0;
          element.style.setProperty('--product-info-height', 'auto');
          element.style.setProperty('--product-title-height', 'auto');
          element.querySelectorAll('.product-item--info').forEach(function(infoElement){
            if(infoElement.querySelector('.new-label')){
              element.classList.add('new-label-present');
              return;
            }
          });
          element.querySelectorAll('.product-card__link-title').forEach(function(infoElement){
            if(infoElement.clientHeight > titleHeight) titleHeight = infoElement.clientHeight;
          });
          element.querySelectorAll('.product-item--info').forEach(function(infoElement){
            if(infoElement.clientHeight > infoHeight) infoHeight = infoElement.clientHeight;
          });
          element.style.setProperty('--product-info-height', infoHeight + 'px');
          element.style.setProperty('--product-title-height', titleHeight + 'px');
        });
      }
      alignProductInfo();
      window.addEventListener('resize', function(){ setTimeout(function(){ alignProductInfo(); }, 500); });

    }
    if(tabs_nav) {
      tabs_nav.querySelectorAll('.index-tabs_nav--item').forEach(function (item,index) {
        item.addEventListener('click', function(e) {
          e.preventDefault();

          var activeItem =  tabs_nav.querySelector('.index-tabs_nav--item.active');
          var href_tab = this.getAttribute('data-href');
          var content_block  = document.querySelector('#'+href_tab);

          if(activeItem) {
            activeItem.classList.remove('active');
            var active_content_block = document.querySelector('#'+activeItem.getAttribute('data-href'));
            if(active_content_block) {
              active_content_block.classList.remove('active');

              var tab_content_slider = active_content_block.querySelector('.index-tabs-content_block__slider');
              if(tab_content_slider) {
                if(tab_content_slider.classList.contains('flickity-enabled')) {
                  flickityInstance.destroy();
                  flickityInstance.element.classList.remove("rendered");
                }
              }
            }
          }


          this.classList.add('active');
          if(content_block) {
            content_block.classList.add('active');


            var tab_content_slider = content_block.querySelector('.index-tabs-content_block__slider');
            if(tab_content_slider) {
              if(tab_content_slider.getAttribute('data-flickity-config') != ''){
                slider_options = JSON.parse(tab_content_slider.getAttribute('data-flickity-config'));
                flickityInstance = new Flickity(tab_content_slider, slider_options);
                  flickityInstance.element.classList.add("rendered");

                flickityInstance.on( 'select', function( index ) {
                  var elementsCount = container.querySelector('.flickity-slider').childElementCount;
                });

                var elementsCount = tab_content_slider.querySelector('.flickity-slider').childElementCount;


                if( slider_custom_arrows ) {
                  if(elementsCount > 1 ) {
                    if(slider_custom_arrows) {
                      slider_custom_arrows.classList.remove('hide');
                    }
                  } else {
                    if(slider_custom_arrows) {
                      slider_custom_arrows.classList.add('hide');
                    }
                  }
                }
              }
            }
          }
        });
      });
    }

    var formsArr = container.querySelectorAll('[action="/cart/add"]');
    if(formsArr.length) {
      formsArr.forEach(function(form,index) {
        theme.AddItemToCart(form);
      });
    }
    theme.ProductItemSwatches();
  }

  return FeaturedProducts;
})();

theme.CollectionListSection = (function() {
  function CollectionListSection(container) {

    var sectionCarousel = container.querySelector('.collection-list__slider');
    if(sectionCarousel) {



      var slider_options = JSON.parse(sectionCarousel.getAttribute('data-flickity-config'));
      var flickityInstance = new Flickity(sectionCarousel, slider_options);

      if(slider_options.watchCSS) {
        var resizeMobileFlag = false;
        function resizeMobileSliderHeight () {
          var windowWidth = window.innerWidth;
          if(windowWidth <= 1199) {
            if(!resizeMobileFlag) {
              if(flickityInstance.element.classList.contains("rendered")) {
                flickityInstance.element.classList.remove("rendered");
              }

              flickityInstance.resize();
              setTimeout(function () {
                flickityInstance.element.classList.add("rendered");
                resizeMobileFlag = true;
              },1000);

            }

          }
        };

        resizeMobileSliderHeight();
        window.addEventListener('resize', resizeMobileSliderHeight);

      } else {
        flickityInstance.element.classList.add("rendered");
      }


      var slider_custom_arrows = container.querySelector('.slider_custom_arrows');
      if(slider_custom_arrows) {

        if(slider_options.watchCSS) {
          slider_custom_arrows.classList.add('desktopHide');
        }

        var slider_custom_btns = slider_custom_arrows.querySelectorAll('.btn');
        slider_custom_btns.forEach(function(item,index) {
          item.addEventListener('click', function(e) {
            e.preventDefault();

            if(flickityInstance) {
              var isNext =  item.classList.contains('button-next');
              if(isNext) {
                flickityInstance.next();
              } else {
                flickityInstance.previous();
              }
            }
          });
        });
      }

    }

    var formsArr = container.querySelectorAll('[action="/cart/add"]');
    if(formsArr.length) {
      formsArr.forEach(function(form,index) {
        theme.AddItemToCart(form);

      });
    }
    theme.ProductItemSwatches()

  }

  return CollectionListSection;
})();


theme.AddItemToCart = function(form) {

  var self = this;
  var addToCartBtn = form.querySelector('[type="submit"]');

  if(form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      var limitQty = addToCartBtn.getAttribute('data-limit-qty');
      var product_id = addToCartBtn.getAttribute('data-product-id');

      var { cartItems } = await theme.retriveCartItems();
      var itemPresent = cartItems.some(item => item.product_id === product_id);
      if(limitQty == 'true' && itemPresent){
        form.querySelector('.qty__error-message').classList.remove('hide');
        return false;
      }
      else{
        form.querySelector('.qty__error-message').classList.add('hide');
      }

      fetch('/cart/add.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: theme.Helpers.serialize(form)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {

        if(addToCartBtn) {
          var addToCartBtnText = addToCartBtn.querySelector("[data-add-to-cart-text]");

          addToCartBtn.classList.add('added');
          addToCartBtnText.innerHTML = theme.strings.added_to_cart;
          theme.Cart.prototype._onProductAdded();

          var pre_order_textEl = form.querySelector('.pre_order_text');
          setTimeout(function() {
            addToCartBtn.classList.remove('added');

            if(self.show_preOrder_btn) {

           		var isPreOrderBtn = addToCartBtn.hasAttribute('data-preOrderButton');
              if( isPreOrderBtn) {
                addToCartBtnText.innerHTML = theme.strings.preOrder;
                if(pre_order_textEl) {
                  pre_order_textEl.classList.remove('hide');
                }
              } else {
                addToCartBtnText.innerHTML = theme.strings.addToCart;
                if(pre_order_textEl) {
                  pre_order_textEl.classList.add('hide');
                }
              }

            } else {
              addToCartBtnText.innerHTML = theme.strings.addToCart;
              if(pre_order_textEl) {
                pre_order_textEl.classList.add('hide');
              }
            }
          },2000);

        }
      })
      .catch(function(error) {
        console.log(error);
      });
    });
  }
};


theme.ProductItemSwatches = function() {
  document.addEventListener('change', function(e){
    var target = e.target;

    if(target.classList.contains('color-swatch__radio')) {
      // We need to change the URL of the various links
      var productItem = target.closest('.product-card'),
          variantUrl = target.getAttribute('data-variant-url');
      productItem.querySelector('.product-card__link-image').setAttribute('href', variantUrl);
      productItem.querySelector('.product-card__link-title').setAttribute('href', variantUrl);

      // If we have a custom image for the variant, we change it
      var originalImageElement = productItem.querySelector('.product-card__image');

      if (target.hasAttribute('data-image-url') && target.getAttribute('data-media-id') !== originalImageElement.getAttribute('data-media-id')) {

        originalImageElement.setAttribute('data-media-id', target.getAttribute('data-media-id'));
        originalImageElement.setAttribute('srcset', target.getAttribute('data-image-url'));
        originalImageElement.setAttribute('src', target.getAttribute('data-image-src'));
        originalImageElement.setAttribute('width', target.getAttribute('ddata-image-width'));
        originalImageElement.setAttribute('height', target.getAttribute('data-image-height'));

        if( target.hasAttribute('data-max_img_width')) {
          originalImageElement.setAttribute('style', target.getAttribute('data-max_img_width'));
        }
      }

      var productItemBlock =  target.closest('.product-item-block');
      if(productItemBlock) {
        if(productItemBlock.classList.contains('product-item-block--withAlternateImage')) {
          productItemBlock.classList.remove('product-item-block--withAlternateImage')
        }
      }
    }
  });
};

theme.retriveCartItems = async function() {
  var response = await fetch(`${window.routes.cartUrl}.js`, {
    credentials: 'same-origin',
    method: 'GET'
  });
  try{
    var data = await response.json();
    return {
        cartItems: data.items
    };
  } catch (error) {
    console.log(error.message)
  }
};

theme.Product = (function() {
  function Product(container) {
    this.container = container;
    var sectionId = container.getAttribute('data-section-id');
    this.ajaxEnabled = container.getAttribute('data-ajax-enabled') === 'true';
    this.pickAnOption = container.getAttribute('data-show_pick_an_option') === 'true';
    this.show_preOrder_btn = container.getAttribute('data-show_preOrder_btn') === 'true';
    this.enableLinkedOptions = container.getAttribute('data-enable_linked_options') === 'true';


    var productJsonElement = document.querySelector('[data-product-json]');
    // If we are using placeholder, there is no JSON so we wrap here!
    if (productJsonElement) {
      var jsonData = JSON.parse(productJsonElement.innerHTML);
      this.productData = jsonData['product'];
      this.productOptionsWithValues = jsonData['options_with_values'];
      this.variantsInventories = jsonData['inventories'] || {};
      this.lowInventoryThreshold = jsonData['lowInventoryThreshold'];
    }

    if(document.querySelectorAll('.product-accessories-wrapper').length > 0){
      document.querySelectorAll('.product-accessories-wrapper').forEach(function(parentElem){
        if(parentElem.querySelectorAll('.product-accessories-section.selected').length == 0){
          parentElem.style.display = 'none';
        }
      });
    }

    document.querySelector('.product-desc-expand').onclick = function(){
      document.querySelector('.product-single__description .rte').classList.toggle('expanded');
      document.querySelector('.product-desc-expand').classList.toggle('expanded');
    };

    function adjustDesc(){
      document.querySelector('.product-single__description .rte').classList.add('expanded');
      if(window.innerWidth > 749){
        if(document.querySelector('.product-desc').clientHeight > 150){
          document.querySelector('.product-desc-expand').style.display = 'flex';
          document.querySelector('.product-desc-expand').classList.remove('expanded');
          document.querySelector('.product-single__description .rte').classList.remove('expanded');
        }
        else{
          document.querySelector('.product-desc-expand').style.display = 'none';
          document.querySelector('.product-desc-expand').classList.add('expanded');
          document.querySelector('.product-single__description .rte').classList.add('expanded');
        }
      }
      else{
        if(document.querySelector('.product-desc').clientHeight > 175){
          document.querySelector('.product-desc-expand').style.display = 'flex';
          document.querySelector('.product-desc-expand').classList.remove('expanded');
          document.querySelector('.product-single__description .rte').classList.remove('expanded');
        }
        else{
          document.querySelector('.product-desc-expand').style.display = 'none';
          document.querySelector('.product-desc-expand').classList.add('expanded');
          document.querySelector('.product-single__description .rte').classList.add('expanded');
        }
      }
    }

    adjustDesc();
    window.onresize = function(){ adjustDesc(); }

    if(document.querySelector('.product-coupon_block')){
      document.querySelector('.product-coupon_block').onclick = function(evt){
        var el = evt.target.closest('.product-coupon_block');
        var textToCopy = el.getAttribute('data-clipboard-text');
        navigator.clipboard.writeText(textToCopy);
        if(el.querySelector('.copy_code_btn')){
          el.querySelector('.copy_code_btn').textContent = el.querySelector('.copy_code_btn').getAttribute('data-copied-text');
        }
      };
    }

    if(document.querySelector('.sticky-shop-now-btn')){
      document.querySelector('.sticky-shop-now-btn').onclick = function(){
        document.querySelectorAll('.product-form [data-add-to-cart]').forEach(function(elem){
          var style = window.getComputedStyle(elem);
          if((style.display === 'none') || (style.visibility === 'hidden')){}
          else{
            elem.click();
          }
        });
      }
    }

    this.settings = {
      mediaQueryMediumUp: 'screen and (min-width: 750px)',
      mediaQuerySmall: 'screen and (max-width: 749px)',
      bpSmall: false,
      enableHistoryState:
        !!container.getAttribute('data-enable-history-state') || false,
      namespace: '.slideshow-' + sectionId,
      sectionId: sectionId,
      sliderActive: false,
      zoomEnabled: false
    };

    this.selectors = {
      addToCart: '[data-add-to-cart]',
      addToCartText: '[data-add-to-cart-text]',
      cartCount: '[data-cart-count]',
      cartCountBubble: '[data-cart-count-bubble]',

      loader: '[data-loader]',
      loaderStatus: '[data-loader-status]',
      quantity: '[data-quantity-input]',
      SKU: '.variant-sku',
      productStatus: '[data-product-status]',
      originalSelectorId: '#ProductSelect-' + sectionId,
      productForm: '[data-product-form]',
      errorMessage: '[data-error-message]',
      errorMessageWrapper: '[data-error-message-wrapper]',
      productMediaWrapper: '[data-product-single-media-wrapper]',
      productThumbs: '.product-single__thumbnails-' + sectionId,
      productThumbsWrapper: '.thumbnails-wrapper',
      singleOptionSelector: '.single-option-selector-' + sectionId,
      singleOptionColorSelector: '.single_option_color_selector-' + sectionId,
      shopifyPaymentButton: '.shopify-payment-button',
      productMediaTypeVideo: '[data-product-media-type-video]',
      productMediaTypeModel: '[data-product-media-type-model]',
      priceContainer: '[data-price]',
      regularPrice: '[data-regular-price]',
      salePrice: '[data-sale-price]',
      savings: '[data-savings]',
      unitPrice: '[data-unit-price]',
      unitPriceBaseUnit: '[data-unit-price-base-unit]',
      productPolicies: '[data-product-policies]',
      storeAvailabilityContainer: '[data-store-availability-container]',
      swatchesWrapper: '.product_swatches'
    };

    this.classes = {
      hidden: 'hide',
      visibilityHidden: 'visibility-hidden',
      inputError: 'input--error',

      productOnSale: 'price--on-sale',
      productUnitAvailable: 'price--unit-available',
      productUnavailable: 'price--unavailable',
      productSoldOut: 'price--sold-out',
      productFormErrorMessageWrapperHidden:
        'product-form__error-message-wrapper--hidden',
      activeClass: 'active-thumb',
      variantSoldOut: 'product-form--variant-sold-out'
    };

    this.eventHandlers = {};

    this.quantityInput = container.querySelector(this.selectors.quantity);
    this.errorMessageWrapper = container.querySelector(
      this.selectors.errorMessageWrapper
    );
    this.productForm = container.querySelector(this.selectors.productForm);
    this.addToCart = container.querySelector(this.selectors.addToCart);
    if(this.addToCart) {
      this.addToCartText = this.addToCart.querySelector(
        this.selectors.addToCartText
      );

      this.addToCart.addEventListener("click", function(e){
        ptengine.track("add_cart");
      }, false);
      theme.TapAddToCart(this.addToCart);
    }
    this.shopifyPaymentButton = container.querySelector(
      this.selectors.shopifyPaymentButton
    );
    this.priceContainer = container.querySelector(
      this.selectors.priceContainer
    );
    this.productPolicies = container.querySelector(
      this.selectors.productPolicies
    );
    this.storeAvailabilityContainer = container.querySelector(
      this.selectors.storeAvailabilityContainer
    );
    if (this.storeAvailabilityContainer) {
      this._initStoreAvailability();
    }
      this.swatchesWrapper = container.querySelector(
      this.selectors.swatchesWrapper
    );

    this.loaderStatus = container.querySelector(this.selectors.loaderStatus);




    //////////////////////////////////////
    // Qty
    /////////////////////////////////////

    function handleQtyChange(qty){
      if (qty <= 1) {
        qty = 1;
        container.querySelector('.minus_btn').classList.add('disabled');
        container.querySelector('.minus_btn').setAttribute('disabled', 'disabled');
      }
      if (qty > 1) {
        container.querySelector('.minus_btn').classList.remove('disabled');
        container.querySelector('.minus_btn').removeAttribute('disabled');
      }

      var priceFormat = theme.priceCurrencyCodeEnable ? theme.moneyFormatWithCurrency : theme.moneyFormat;
      var comparePriceFormat = theme.comparePriceCurrencyCodeEnable ? theme.moneyFormatWithCurrency : theme.moneyFormat;
      var regularPrice = parseInt(document.querySelector('.product-form__controls-group--submit .price-wrapper').getAttribute('data-price'));
      var comparePrice = parseInt(document.querySelector('.product-form__controls-group--submit .price-wrapper').getAttribute('data-compare-price'));
      var saving = parseInt(document.querySelector('.product-form__controls-group--submit .price-wrapper').getAttribute('data-saving'));

      var discount = 1;
      if(qty >= 10 && qty <= 19){ discount = 2; }
      if(qty >= 20){ discount = 5; }

      if(document.querySelector('.product-container').getAttribute('data-discount-product') == 'true'){
        if(discount > 1){
          comparePrice = regularPrice;
          regularPrice = regularPrice - (regularPrice*discount/100);
          saving = comparePrice - regularPrice;
        }
      }

      var current_variant_id = document.querySelector('.product-form__variants').value;
      if(document.querySelector('.product-accessories-section[data-variant="'+current_variant_id+'"]')){
        var accessories_wrap = document.querySelector('.product-accessories-section[data-variant="'+current_variant_id+'"]');
        if(accessories_wrap.querySelectorAll('.variant-accessory.selected').length > 0){
          accessories_wrap.querySelectorAll('.variant-accessory.selected').forEach(function(elem){
            var accessory_price = parseInt(elem.getAttribute('data-price'));
            var accessory_compare_price = parseInt(elem.getAttribute('data-compare-price'));
            if(accessory_compare_price > 0 && comparePrice == 0) comparePrice = regularPrice;
            if(comparePrice > 0 && accessory_compare_price == 0) accessory_compare_price = parseInt(elem.getAttribute('data-price'));
            var accessory_saving = parseInt(elem.getAttribute('data-saving'));

            if(elem.getAttribute('data-discount-accessory') == 'true'){
              if(discount > 1){
                accessory_compare_price = accessory_price;
                accessory_price = accessory_price - (accessory_price*discount/100);
                accessory_saving = accessory_compare_price - accessory_price;
              }
            }
            regularPrice = regularPrice + accessory_price;
            comparePrice = comparePrice + accessory_compare_price;
            saving = saving + accessory_saving;
          });
        }
      }

      var regular_price = regularPrice * qty;
      if(regular_price > 999900){
        document.querySelector('.product-form__controls-group--submit .regular-price').innerHTML = theme.Currency.formatMoney(
          regular_price,
          priceFormat
        ).replace(',00', '').replace('.', ' ');
      }
      else{
        document.querySelector('.product-form__controls-group--submit .regular-price').innerHTML = theme.Currency.formatMoney(
          regularPrice * qty,
          priceFormat
        ).replace(',00', '').replace('.', '');
      }

      var compare_price = comparePrice * qty;
      if(comparePrice > 0){
        if(comparePrice > 999900){
          document.querySelector('.product-form__controls-group--submit .compare-price').innerHTML = theme.Currency.formatMoney(
            compare_price,
            comparePriceFormat
          ).replace(',00', '').replace('.', ' ');
        }
        else{
          document.querySelector('.product-form__controls-group--submit .compare-price').innerHTML = theme.Currency.formatMoney(
            compare_price,
            comparePriceFormat
          ).replace(',00', '').replace('.', '');
        }
      }

      var total_saving = saving * qty;
      if(saving > 0){
        if(total_saving > 999900){
          document.querySelector('.product-form__controls-group--submit .total-savings').innerHTML = '-' + theme.Currency.formatMoney(
            total_saving,
            theme.moneyFormat
          ).replace(',00', '').replace('.', ' ');
        }
        else{
          document.querySelector('.product-form__controls-group--submit .total-savings').innerHTML = '-' + theme.Currency.formatMoney(
            total_saving,
            theme.moneyFormat
          ).replace(',00', '').replace('.', '');
        }
      }
    }

    var qty_btns = container.querySelectorAll('.qty_btn');
    var limitQty = container.getAttribute('data-limit-qty');
    if(qty_btns.length) {
      qty_btns.forEach(function(item,index) {
        item.addEventListener('click', function(e) {
          e.preventDefault();

          var inputEl = this.closest('.qty').querySelector('[name="quantity"]');
          var qty = +(inputEl.value);

          if(this.classList.contains('minus_btn')) {
            qty--;
          } else {
            qty++;
          }

          if(limitQty == 'true' && qty > 1){
            container.querySelector('.qty__error-message').classList.remove('hide');
          }
          else{
            inputEl.value = qty;
            handleQtyChange(qty);
            container.querySelector('.qty_error_message').classList.add('hide');
          }
        });
      });
    }

    var qtyElem = container.querySelectorAll('.product-form__input--quantity');
    if(qtyElem.length) {
      qtyElem.forEach(function(item,index) {
        item.addEventListener('change', function(e) {
          e.preventDefault();
          var qty = this.value;
          handleQtyChange(qty);
        });
      });
    }

    var variant_accessory = document.querySelectorAll('.variant-accessory');
    if(variant_accessory.length > 0){
      variant_accessory.forEach(function(elem){
        elem.onclick = function(event){
          elem.classList.toggle('selected');
          var qtyVal = document.querySelector('.product-form__input--quantity').value;
          var discount = 1;
          if(qtyVal >= 10 && qtyVal <= 19){ discount = 2; }
          if(qtyVal >= 20){ discount = 5; }

          var priceElement = document.querySelector('.product-form__controls-group--submit .price-wrapper');
          var orig_regular_price = priceElement.getAttribute('data-price');
          var orig_compare_price = priceElement.getAttribute('data-compare-price');
          var orig_saving = priceElement.getAttribute('data-saving');
          var priceFormat = theme.priceCurrencyCodeEnable ? theme.moneyFormatWithCurrency : theme.moneyFormat;
          var comparePriceFormat = theme.comparePriceCurrencyCodeEnable ? theme.moneyFormatWithCurrency : theme.moneyFormat;

          var current_variant_id = document.querySelector('.product-form__variants').value;
          if(document.querySelector('.product-accessories-section[data-variant="'+current_variant_id+'"]')){
            var accessories_wrap = document.querySelector('.product-accessories-section[data-variant="'+current_variant_id+'"]');
            if(accessories_wrap.querySelectorAll('.variant-accessory.selected').length > 0){
              accessories_wrap.querySelectorAll('.variant-accessory.selected').forEach(function(elem){
                var accessory_price = elem.getAttribute('data-price');
                if(elem.getAttribute('data-discount-accessory') == 'true'){
                  if(discount > 1){
                    var accessory_compare_price = parseInt(elem.getAttribute('data-price'));
                    accessory_price = accessory_price - (accessory_price*discount/100);
                  }
                }
                else{
                  var accessory_compare_price = parseInt(elem.getAttribute('data-compare-price'));
                  if(accessory_compare_price > 0 && orig_compare_price == 0) orig_compare_price = orig_regular_price;
                  if(orig_compare_price > 0 && accessory_compare_price == 0) accessory_compare_price = parseInt(elem.getAttribute('data-price'));
                }

                var accessory_saving = accessory_compare_price - accessory_price;
                orig_regular_price = parseInt(orig_regular_price) + parseInt(accessory_price);
                orig_compare_price = parseInt(orig_compare_price) + parseInt(accessory_compare_price);
                orig_saving = parseInt(orig_saving) + parseInt(accessory_saving);
              });
            }
          }

          var totalRegularPrice = orig_regular_price*qtyVal;
          if(totalRegularPrice > 999900){
            priceElement.querySelector('.regular-price').innerHTML = theme.Currency.formatMoney(totalRegularPrice, priceFormat).replace(',00', '').replace('.', ' ');
          }
          else{
            priceElement.querySelector('.regular-price').innerHTML = theme.Currency.formatMoney(totalRegularPrice, priceFormat).replace(',00', '').replace('.', '');
          }
          if(orig_compare_price > 0){
            var totalComparePrice = orig_compare_price*qtyVal;
            if(totalComparePrice > 999900){
              priceElement.querySelector('.compare-price').innerHTML = theme.Currency.formatMoney(totalComparePrice, theme.moneyFormat).replace(',00', '').replace('.', ' ');
            }
            else{
              priceElement.querySelector('.compare-price').innerHTML = theme.Currency.formatMoney(totalComparePrice, theme.moneyFormat).replace(',00', '').replace('.', '');
            }
            priceElement.querySelector('.compare-price').style.display = 'block';
          }
          else{
            priceElement.querySelector('.compare-price').style.display = 'none';
          }
          if(orig_saving > 0){
            var totalSaving = orig_saving*qtyVal;
            if(totalSaving > 999900){
              priceElement.querySelector('.total-savings').innerHTML = '-' + theme.Currency.formatMoney(totalSaving, comparePriceFormat).replace(',00', '').replace('.', ' ');
            }
            else{
              priceElement.querySelector('.total-savings').innerHTML = '-' + theme.Currency.formatMoney(totalSaving, comparePriceFormat).replace(',00', '').replace('.', '');
            }
            priceElement.querySelector('.total-savings').style.display = 'block';
          }
          else{
            priceElement.querySelector('.total-savings').style.display = 'none';
          }
          if(document.querySelectorAll('.variant-accessory.selected').length > 0) document.querySelector('.product-accessories-wrapper').classList.remove('disabled');
          else document.querySelector('.product-accessories-wrapper').classList.add('disabled');
        }
      });
    }

    var product_description_accrordion = container.querySelectorAll('.product_description_accrordion');
    if(product_description_accrordion.length) {

      var isReviewAccordion = false;
      product_description_accrordion.forEach(function (accordionEl,index) {

        var product_accordion__blocks =  accordionEl.querySelectorAll('.product_accordion__block');
        if(product_accordion__blocks.length) {
          product_accordion__blocks.forEach(function (accordionBlock,index) {
            var title = accordionBlock.querySelector('.product_accordion__heading');
            var content = accordionBlock.querySelector('.product_accordion__content');
            title.addEventListener('click', function(e) {
              e.preventDefault();

              var self = this;
              if (!content.classList.contains('active')) {

                self.classList.add('active');
                content.classList.add('active');
                content.style.height = 'auto';

                var height = content.clientHeight + 'px';
                content.style.height = '0px';

                setTimeout(function () {
                  content.style.height = height;
                }, 0);

              } else {

                if(content.getAttribute('style') != null) {
                  content.style.height = '0px';
                  content.addEventListener('transitionend', function () {
                    content.classList.remove('active');
                    self.classList.remove('active');
                  }, {
                    once: true
                  });
                } else {
                  content.classList.remove('active');
                  self.classList.remove('active');
                }

              }
            });
          });
        }
        var  contaisReviews = accordionEl.querySelector('#shopify-product-reviews');
        if(contaisReviews) {
          isReviewAccordion = true;
        }

      });
      if(isReviewAccordion) {
        document.addEventListener('click', function(e){
          var el = e.target;

          if(el.classList.contains('spr-summary-actions-newreview') || el.closest('.spr-summary-actions-newreview')) {
            if(!el.classList.contains('spr-summary-actions-newreview')) {
              el = el.closest('.spr-summary-actions-newreview');
            }
            var accrodionParent = el.closest('.product_accordion__content');
            if(accrodionParent) {
              var reviewsForm = el.closest('#shopify-product-reviews');
              accrodionParent.style.height = reviewsForm.clientHeight + 'px';
            }
          }
        });
      }
    }


    var tabing = container.querySelector('.tabing');
    if(tabing) {
      tabing.querySelectorAll('.nav-tabs a').forEach(function(item,index) {
        item.addEventListener('click', function(e) {
          e.preventDefault();

          var navParent  = this.closest('.nav-tabs');

          var href = this.getAttribute('href');
          var tab_contentWrapper = container.querySelector('.tab-content');

          var tabContent = tab_contentWrapper.querySelector(href);
          if(tabContent) {

            navParent.querySelector('.active').classList.remove('active');
            tab_contentWrapper.querySelector('.active').classList.remove('active');

            tabContent.classList.add('active');
            this.parentNode.classList.add('active');
          }
        });
      });
    }

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    var productJson = document.getElementById('ProductJson-' + sectionId);
    if (!productJson || !productJson.innerHTML.length) {
      return;
    }

    this.productSingleObject = JSON.parse(productJson.innerHTML);

    // Initial state for global productState object
    this.productState = {
      available: true,
      soldOut: false,
      onSale: false,
      showUnitPrice: false
    };

    this._stringOverrides();
    this._initVariants();
    this._initAddToCart();
    this._initProductVideo();
    this._initModelViewerLibraries();
    this._initShopifyXrLaunch();
    this._initSwatches();



    if(this.enableLinkedOptions) {
		var _this = this;

      var parentForm =  _this.container.querySelector("[data-product-form]");
      var initialValue,availableOptions,selector;

      function inArray(needle, haystack) {
        if(haystack) {
          if (haystack.indexOf(needle) !== -1) {
            return true;
          } else {
            return false;
          }
        }
      }

      var checkOptions = function() {
        var updateOptions  = true;
        if(_this.pickAnOption) {
          var selectOption = parentForm.querySelector('.single-option-selector');
          if(selectOption) {
              var select_value = selectOption.value;
              if(select_value.length == 0) {
                updateOptions  = false;
              }
          }
        }

        return updateOptions;
      }



      var Shopify = Shopify || {};
      // Required functionality from depricated options_selection.js
      Shopify.arrayIncludes = function(e, t) {
        for (var n = 0; n < e.length; n++)
          if (e[n] == t) return !0;
        return !1
      }, Shopify.uniq = function(e) {
        for (var t = [], n = 0; n < e.length; n++) Shopify.arrayIncludes(t, e[n]) || t.push(e[n]);
        return t
      }
      Shopify.optionsMap = {};

      Shopify.updateOptionsInSelector = function(selectorIndex) {

        switch (selectorIndex) {
          case 0:
            var key = 'root';
            selector = parentForm.querySelector('.single-option-selector');
            break;
          case 1:
            var key = parentForm.querySelector('.single-option-selector').value;
            selector = parentForm.querySelectorAll('.single-option-selector')[1];
            break;
          case 2:
            var key = parentForm.querySelector('.single-option-selector').value;
            key += ' / ' + parentForm.querySelectorAll('.single-option-selector')[1].value;
            selector = parentForm.querySelectorAll('.single-option-selector')[2];
        }

        var check_swatch = true;
        if(_this.pickAnOption) {
          if(selectorIndex != 0) {
            var optionSelect = _this.variants.singleOptions[selectorIndex];
            if(optionSelect) {
              var optionSelectVal = optionSelect.value;
              if(optionSelectVal.length == 0) {
                check_swatch  = false;
              }
            }
          }
        }

        initialValue = selector.value;
        selector.innerHTML = '';
        availableOptions = Shopify.optionsMap[key];
        for (var i=0; i<availableOptions.length; i++) {
          var option = availableOptions[i];

          var newOption = document.createElement('option');
          newOption.value = option;
          newOption.innerHTML = option;
          selector.appendChild (newOption);
        }
        var swatchElements =  parentForm.querySelectorAll('.swatch[data-option-index="' + selectorIndex + '"] .swatch-element');
        if(swatchElements.length) {

          swatchElements.forEach(function(item,index) {

            var itemValue = item.getAttribute('data-value');
            var itemRadioBtn = item.querySelector('[type="radio"]');

            if (inArray(itemValue, availableOptions)) {
              item.classList.remove('soldout');
              item.style.display = 'flex';
              if(itemRadioBtn) {
                itemRadioBtn.removeAttribute('disabled');
                itemRadioBtn.checked = false;
              }
            } else {
              item.classList.add('soldout');
              item.style.display = 'none';
              if(itemRadioBtn) {
                itemRadioBtn.getAttribute('disabled','disabled');
                itemRadioBtn.checked = false;
              }
            }
          });
        }


        if (inArray(initialValue, availableOptions)) {
          if(selector) {

            if(check_swatch) {
              selector.value = initialValue;
            } else {
              selector.selectedIndex = -1;
              var opt = document.createElement('option');
              opt.value = '';
              opt.setAttribute('disabled', 'disabled');
              opt.setAttribute('selected', 'selected');
              opt.innerHTML = theme.strings.pick_an_option;
              selector.prepend(opt);
            }
            var activeSwatch = parentForm.querySelector('.swatch[data-option-index="' + selectorIndex + '"] .swatch-element[data-value="'+ initialValue + '"] [type="radio"]');
            if(activeSwatch && check_swatch ) {
            	activeSwatch.checked = true;
            }
          }
        } else {
          if(selector) {

            if(check_swatch) {
              selector.value = availableOptions[0];
              selector.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
              selector.selectedIndex = -1;
              var opt = document.createElement('option');
              opt.value = '';
              opt.setAttribute('disabled', 'disabled');
              opt.setAttribute('selected', 'selected');
              opt.innerHTML = theme.strings.pick_an_option;
              selector.prepend(opt);
            }
          }
        }

      }

      Shopify.linkOptionSelectors = function(product) {

        if(product) {
        // Building our mapping object.
        for (var i=0; i<product.variants.length; i++) {
          var variant = product.variants[i];
          if (variant.available) {
            // Gathering values for the 1st drop-down.
            Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
            Shopify.optionsMap['root'].push(variant.option1);
            Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
            // Gathering values for the 2nd drop-down.
            if (product.options.length > 1) {
              var key = variant.option1;
              Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
              Shopify.optionsMap[key].push(variant.option2);
              Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
            }
            // Gathering values for the 3rd drop-down.
            if (product.options.length === 3) {
              var key = variant.option1 + ' / ' + variant.option2;
              Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
              Shopify.optionsMap[key].push(variant.option3);
              Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
            }
          }
        }



        // Update options right away.

          if(checkOptions()) {
            Shopify.updateOptionsInSelector(0);
            if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
            if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
          }

        // When there is an update in the first dropdown.
        var firstSelectEl = parentForm.querySelectorAll('.single-option-selector')[0];
        if(firstSelectEl) {
          firstSelectEl.addEventListener('change', function() {

            if(checkOptions()) {
            Shopify.updateOptionsInSelector(1);
            }
            if (product.options.length === 3)  {
              if(checkOptions()) {
                Shopify.updateOptionsInSelector(2);
              }
            }
            return true;
          });
        }

          // When there is an update in the second dropdown.
          var secondSelectEl = parentForm.querySelectorAll('.single-option-selector')[1];
          if(secondSelectEl) {
            secondSelectEl.addEventListener('change', function () {
              if(checkOptions()) {

                if(_this.pickAnOption) {
                  Shopify.updateOptionsInSelector(1);
                }
                if (product.options.length === 3) {
                  Shopify.updateOptionsInSelector(2);
                }
              }
              return true;
            });
        }

        }
      };


      if( _this.productData.available && _this.productData.options.length > 1 &&  _this.productData.variants.length > 1) {
        if (window.MutationObserver && parentForm.length) {
          if (typeof observer === 'object' && typeof observer.disconnect === 'function') {
            observer.disconnect();
          }
          var config = { childList: true, subtree: true };
          var observer = new MutationObserver(function() {

            Shopify.linkOptionSelectors(_this.productData);
            observer.disconnect();
          });
          observer.observe(parentForm, config);
        }
      }


      var selector = parentForm.querySelector('.single-option-selector');
      if(selector) {
        selector.dispatchEvent(new Event('change', { bubbles: true }));
      }


      if(_this.productData.options.length == 1) {
        for(var v=0;v < _this.productData.variants.length;v++) {
          var variant = _this.productData.variants[v];

          if(!variant.available) {

            var allSelectOptionsEl = parentForm.querySelectorAll('.single-option-selector option');
            if(allSelectOptionsEl.length) {
              allSelectOptionsEl.forEach(function(item,index) {
                var itemText = item.innerHTML.trim();
                if(itemText == variant.title) {
                  item.parentNode.removeChild(item);
                  var swatchEl =  parentForm.querySelector(".product_swatches [data-value='"+variant.title+"']");

                  if(swatchEl) {
                    swatchEl.parentNode.removeChild(swatchEl);
                  }
                }
              });
            }


          }
        }

        var selectors = parentForm.querySelectorAll('.single-option-selector');
        if(selectors.length) {
          selectors.forEach(function (select,index) {
            select.dispatchEvent(new Event('change', { bubbles: true }));
          });
          selector.dispatchEvent(new Event('change', { bubbles: true }));
        }

    }
    }


    var back_in_stock_row = container.querySelector('.back_in_stock_row');
    if(back_in_stock_row) {
      var back_in_stock_button = back_in_stock_row.querySelector('.back_in_stock_btn');
      var contact_formID = back_in_stock_row.getAttribute('data-id');
      var contactFormEl = document.querySelector('#'+contact_formID);
      if(contactFormEl) {
        var formStatusBlock = contactFormEl.querySelector('.form-status');
        var formStatusBlockValue = formStatusBlock.innerHTML.trim();
        if(formStatusBlockValue.length > 0) {
          var back_in_stock_response = back_in_stock_row.querySelector('.back_in_stock_response');
          if(back_in_stock_response) {
            back_in_stock_response.innerHTML = formStatusBlockValue;
            back_in_stock_response.classList.add('active');
            if(formStatusBlockValue.indexOf('form-message--success') >= 0) {
              back_in_stock_response.classList.add('success_response');
            }
            back_in_stock_row.classList.remove('hide');
          }
        }
      }

      if(back_in_stock_button) {
        back_in_stock_button.addEventListener('click', function(e) {
          e.preventDefault();

          var back_in_stock_input = back_in_stock_row.querySelector('.Form__Input');
          if(back_in_stock_input) {
            var back_in_stock_input_val = back_in_stock_input.value;
            var contactFormEl = document.querySelector('#'+contact_formID);
            if(contactFormEl) {
              contactFormEl.querySelector('.contact-form_email').value = back_in_stock_input_val;
              //              contactFormEl.dispatchEvent(new Event('submit', { bubbles: true }));

              contactFormEl.submit();

            }
          }

        });
      }

    }


    var stickyBtnsParentEl = container.querySelector('.product-form-sticky-parent');
    if(stickyBtnsParentEl) {

      function checkStickyCTA () {
        var windowHeight = window.innerHeight;
        var stickyBtnsParentHeight = container.querySelector('.product-form__controls-group--submit').offsetHeight;
        var bottomOffsetButton  = stickyBtnsParentEl.offsetTop + 200;
        var productMetaEl = container.querySelector('.product-single__meta');
        //stickyBtnsParentEl.style.minHeight = stickyBtnsParentHeight + 'px';
        var window_scrollY = window.scrollY + windowHeight ;

        if(window_scrollY > bottomOffsetButton) {
          document.querySelector('body').classList.add('enabled-mobile-sticky');
          productMetaEl.classList.add('enabled_mobile_sticky_btns');
          if(window.innerWidth < 750){
            document.querySelector('.template-product').style.paddingBottom = stickyBtnsParentHeight + 'px';
            document.documentElement.style.paddingBottom = '0px';
          }
        } else {
          document.querySelector('body').classList.remove('enabled-mobile-sticky');
          productMetaEl.classList.remove('enabled_mobile_sticky_btns');
          document.querySelector('.template-product').style.paddingBottom = '0px';
        }

      };
      document.addEventListener('resize',checkStickyCTA);
      document.addEventListener('scroll', checkStickyCTA);
    }

    var form_popup_linkEl = container.querySelector('.form_popup_link');
    if(form_popup_linkEl) {
        document.addEventListener('click', function(e){
        var target = e.target;

        if(target.classList.contains('form_popup_link') || target.closest('.form_popup_link')) {
        if(!target.classList.contains('form_popup_link')) {
        target = target.closest('.form_popup_link');
        }

        e.preventDefault();
        var modal = document.querySelector(target.getAttribute('href'));

          if(modal) {
        document.querySelector('body').classList.add('show_overlay');
        document.querySelector('body').classList.add('active_product_form_popup');
        modal.setAttribute('aria-hidden','false');
          }
        }
        });
        document.addEventListener('click', function(e){
        var el = e.target;

        if(el.classList.contains('close_form_popup') || el.closest('.close_form_popup')) {
        e.preventDefault();
        var modal = el.closest('.modal');
        modal.setAttribute('aria-hidden','true');
        document.querySelector('body').classList.remove('show_overlay');
        document.querySelector('body').classList.remove('active_product_form_popup');

        }
        });
      if(document.querySelector('.active_product_form_popup')) {
         var modal = document.querySelector('.form_popup');

          if(modal) {
        document.querySelector('body').classList.add('show_overlay');
        modal.setAttribute('aria-hidden','false');
          }
      }
    }

    if(document.querySelector('.product-main-video')){
      document.addEventListener('youtubeAPIReady', onYouTubeAPIReady);
      function onYouTubeAPIReady() {
        var youtube_player_id = document.querySelector('#youtube-product-video').getAttribute('data-media-id');
        var player = new YT.Player('youtube-product-video', {
          height: '586',
          width: '100%',
          videoId: youtube_player_id,
          playerVars: {
            cc_load_policy: 0,
            iv_load_policy: 0,
            modestbranding: 0,
            playsinline: 1,
            autohide: 0,
            loop: 1,
            playlist: youtube_player_id,
            branding: 0,
            showinfo: 0,
            rel: 0,
            fs: 0,
            wmode: 'opaque'
          },
          events: {
              onReady: onPlayerReady_temp
          }
        });
      }

      function onPlayerReady_temp(event) {
        document.querySelector('.youtube-video-trigger').onclick = function(evt){
          document.querySelector('[data-product-single-media-group]').classList.add('video-playing');
          event.target.playVideo();
        };

        document.addEventListener('imageChange', function(){
          document.querySelector('[data-product-single-media-group]').classList.remove('video-playing');
          event.target.pauseVideo();
        });

        document.querySelector('.product-video-close').onclick = function(){
          document.querySelector('[data-product-single-media-group]').classList.remove('video-playing');
          event.target.pauseVideo();
        };
      }
    }

  }

  Product.prototype = Object.assign({}, Product.prototype, {
    _stringOverrides: function() {
      theme.productStrings = theme.productStrings || {};
      theme.strings = Object.assign({}, theme.strings, theme.productStrings);
    },

    _initStoreAvailability: function() {
      this.storeAvailability = new theme.StoreAvailability(
        this.storeAvailabilityContainer
      );

      var storeAvailabilityModalOpenedCallback = function(event) {
        if (
          this.cartPopupWrapper &&
          !this.cartPopupWrapper.classList.contains(
            this.classes.cartPopupWrapperHidden
          )
        ) {
          this._hideCartPopup(event);
        }
      };

      // hide cart popup modal if the store availability modal is also opened
      this.storeAvailabilityContainer.addEventListener(
        'storeAvailabilityModalOpened',
        storeAvailabilityModalOpenedCallback.bind(this)
      );
    },


    _initVariants: function() {

      var enableHistoryStateFlag = false;
      if(this.container.getAttribute('data-enable-history-state') == 'true') {
         enableHistoryStateFlag = true;
      }


      var options = {
        container: this.container,
        enableHistoryState:enableHistoryStateFlag,
        singleOptionSelector: this.selectors.singleOptionSelector,
        singleOptionColorSelector: this.selectors.singleOptionColorSelector,
        originalSelectorId: this.selectors.originalSelectorId,
        product: this.productSingleObject,
        pickAnOption: this.pickAnOption,
        show_preOrder_btn: this.show_preOrder_btn,

        enableLinkedOptions: this.enableLinkedOptions
      };

      this.variants = new slate.Variants(options);
      if (this.storeAvailability && this.variants.currentVariant.available) {
        this.storeAvailability.updateContent(this.variants.currentVariant.id);
      }

      this.eventHandlers.updateAvailability = this._updateAvailability.bind(
        this
      );
      this.eventHandlers.updatePrice = this._updatePrice.bind(this);
      this.eventHandlers.updateSKU = this._updateSKU.bind(this);

      this.container.addEventListener(
        'variantChange',
        this.eventHandlers.updateAvailability
      );
      this.container.addEventListener(
        'variantPriceChange',
        this.eventHandlers.updatePrice
      );
      this.container.addEventListener(
        'variantSKUChange',
        this.eventHandlers.updateSKU
      );
      if(this.pickAnOption) {

        var variantsSize = this.productData.variants.length;
        if(variantsSize > 1 ) {
          var singleOptionSelectors = this.productForm.querySelectorAll(this.selectors.singleOptionSelector);
          var submitFormButton = this.productForm.querySelector(this.selectors.addToCart);
          if(singleOptionSelectors.length) {
            singleOptionSelectors.forEach(function (item,index) {

              item.selectedIndex = -1;
              var opt = document.createElement('option');
              opt.value = '';
              opt.setAttribute('disabled', 'disabled');
              opt.setAttribute('selected', 'selected');
              opt.innerHTML = theme.strings.pick_an_option;
              item.prepend(opt);
            });
          }
          if(submitFormButton) {
            var submitFormButtonText = submitFormButton.querySelector(this.selectors.addToCartText);
            if(submitFormButtonText) {
              submitFormButton.setAttribute('disabled','disabled');
              submitFormButtonText.innerHTML = theme.strings.pick_an_option;
            }
          }
          this.productForm.classList.add('disabled_btns');
          if(this.swatchesWrapper) {
            this.swatchesWrapper.querySelectorAll('[type="radio"]').forEach(function (item,index) {
              item.checked = false;
            });
          }
        }
      }
    },

    _initAddToCart: function() {
      var self = this;

      var addToCartBtn = this.productForm.querySelector('[type="submit"]');
      this.productForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var limitQty = self.container.getAttribute('data-limit-qty');
        var product_id = +(self.container.getAttribute('data-product-id'));

        var { cartItems } = await theme.retriveCartItems();
        var itemPresent = cartItems.some(item => item.product_id === product_id);

        if(limitQty == 'true' && itemPresent){
          self.container.querySelector('.qty__error-message').classList.remove('hide');
          return false;
        }
        else{
          self.container.querySelector('.qty__error-message').classList.add('hide');
        }

        var current_variant_id = document.querySelector('.product-form__variants').value;
        var json = [];
        var qty = document.querySelector('.product-form__input--quantity').value;
        var accessories_found = 0;
        if(document.querySelectorAll('.product-accessories-section[data-variant="'+current_variant_id+'"]').length > 0){
          document.querySelectorAll('.product-accessories-section[data-variant="'+current_variant_id+'"]').forEach(function(accessoryElem){
            var accessories_wrap = accessoryElem;
            if(accessories_wrap.querySelectorAll('.variant-accessory.selected').length > 0){
              accessories_wrap.querySelectorAll('.variant-accessory.selected').forEach(function(elem){
                accessories_found = parseInt(accessories_found + 1);
                json.push({ 'id': elem.getAttribute('data-variant-id'), 'quantity': qty });
              });
            }
          });
          json.push({ 'id': document.querySelector('.product-form__variants').value, 'quantity': qty });
          var formData = JSON.stringify({'items': json});
          var headers = {
            'Content-Type': 'application/json'
          };
        }

        if(accessories_found == 0){
          var formData = theme.Helpers.serialize(self.productForm);
          var headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
          };
        }

        e.preventDefault();



        fetch('/cart/add.js', {
          method: 'POST',
          credentials: 'same-origin',
          headers: headers,
          body: formData
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          if(addToCartBtn) {
            var addToCartBtnText = addToCartBtn.querySelector("[data-add-to-cart-text]");
            var addToCartBtnLoader = addToCartBtn.querySelector("[data-loader]");
            var stickyAddToCartBtnText = document.querySelector("[data-sticky-add-to-cart-text]");
            var stickyAddToCartBtnLoader = document.querySelector("[data-sticky-loader]");

            if(json.status == 422) {
              self._showErrorMessage(json.description);
              addToCartBtnText.innerHTML = theme.strings.addToCart;
            } else {
              // addToCartBtn.classList.add('added');
              addToCartBtnLoader.classList.remove('hide')
              addToCartBtnText.classList.add('hide');

              if(stickyAddToCartBtnText) {
                stickyAddToCartBtnLoader.classList.remove('hide')
                stickyAddToCartBtnText.classList.add('hide')
              }

              addToCartBtnText.innerHTML = theme.strings.added_to_cart;
              theme.Cart.prototype._onProductAdded();

              setTimeout(function() {
                // addToCartBtn.classList.remove('added');
                addToCartBtnText.classList.remove('hide');
                addToCartBtnLoader.classList.add('hide')

                if(stickyAddToCartBtnText) {
                  stickyAddToCartBtnText.classList.remove('hide');
                  stickyAddToCartBtnLoader.classList.add('hide')
                }

                var pre_order_textEl = self.container.querySelector('.pre_order_text');
                if(self.show_preOrder_btn) {

                  var originalSelectorId  = self.variants.originalSelectorId;
                  var originalSelector = self.container.querySelector(originalSelectorId);
                  if(originalSelector) {

                    var selectedElement = originalSelector.item(originalSelector.selectedIndex);
                    var inventory_policy = selectedElement.getAttribute('data-inventory_policy');
                    var inventory_quantity = selectedElement.getAttribute('data-inventory_quantity') * 1;


                    if( inventory_policy == 'continue' &&  inventory_quantity <= 0) {
                      addToCartBtnText.innerHTML = theme.strings.preOrder;

                      if(pre_order_textEl) {
                        pre_order_textEl.classList.add('hide');
                      }

                    } else {
                      addToCartBtnText.innerHTML = theme.strings.addToCart;

                      if(pre_order_textEl) {
                        pre_order_textEl.classList.add('hide');
                      }
                    }

                  }


                } else {
                  addToCartBtnText.innerHTML = theme.strings.addToCart;

                  if(pre_order_textEl) {
                    pre_order_textEl.classList.add('hide');
                  }
                }
              },2000);

            }
          }

          })
        .catch(function(error) {
          console.log(error);
          self._showErrorMessage(
            error.isFromServer && error.message.length
            ? error.message
            : theme.strings.cartError
          );

            });
      });

    },

    _initProductVideo: function() {
      var sectionId = this.settings.sectionId;

      var productMediaTypeVideo = this.container.querySelectorAll(
        this.selectors.productMediaTypeVideo
      );
      productMediaTypeVideo.forEach(function(el) {
        theme.ProductVideo.init(el, sectionId);
      });
    },

    _initModelViewerLibraries: function() {
      var modelViewerElements = this.container.querySelectorAll(
        this.selectors.productMediaTypeModel
      );
      if (modelViewerElements.length < 1) return;
      theme.ProductModel.init(modelViewerElements, this.settings.sectionId);
    },

    _initShopifyXrLaunch: function() {
      this.eventHandlers.initShopifyXrLaunchHandler = this._initShopifyXrLaunchHandler.bind(
        this
      );
      document.addEventListener(
        'shopify_xr_launch',
        this.eventHandlers.initShopifyXrLaunchHandler
      );
    },

    _initShopifyXrLaunchHandler: function() {
      var currentMedia = this.container.querySelector(
        this.selectors.productMediaWrapper +
          ':not(.' +
          self.classes.hidden +
          ')'
      );
      currentMedia.dispatchEvent(
        new CustomEvent('xrLaunch', {
          bubbles: true,
          cancelable: true
        })
      );
    },

    _showErrorMessage: function(errorMessage) {
      var errorMessageContainer = this.container.querySelector(
        this.selectors.errorMessage
      );
      errorMessageContainer.innerHTML = errorMessage;

      if (this.quantityInput) {
        this.quantityInput.classList.add(this.classes.inputError);
      }

      this.errorMessageWrapper.classList.remove(
        this.classes.productFormErrorMessageWrapperHidden
      );
      this.errorMessageWrapper.setAttribute('aria-hidden', true);
      this.errorMessageWrapper.removeAttribute('aria-hidden');
    },

    _hideErrorMessage: function() {
      this.errorMessageWrapper.classList.add(
        this.classes.productFormErrorMessageWrapperHidden
      );

      if (this.quantityInput) {
        this.quantityInput.classList.remove(this.classes.inputError);
      }
    },

    _enableAddToCart: function(message) {
      if(this.addToCart) {
      this.addToCart.removeAttribute('aria-disabled');
      this.addToCart.setAttribute('aria-label', message);
      }
      if(this.addToCartText) {
      this.addToCartText.innerHTML = message;
      }
      if(this.productForm) {
      this.productForm.classList.remove(this.classes.variantSoldOut);
      }
      if(document.querySelector('.sticky-shop-now-btn')){
        document.querySelector('.sticky-shop-now-btn').removeAttribute('disabled');
        document.querySelector('.sticky-shop-now-btn').classList.remove('disabled');
      }
    },

    _disableAddToCart: function(message) {
      message = message || theme.strings.unavailable;
       if(this.addToCart) {
      this.addToCart.setAttribute('aria-disabled', true);
      this.addToCart.setAttribute('aria-label', message);
       }
      if(this.addToCartText) {
      this.addToCartText.innerHTML = message;
      }
      if(this.productForm) {
      this.productForm.classList.add(this.classes.variantSoldOut);
      }
      if(document.querySelector('.sticky-shop-now-btn')){
        document.querySelector('.sticky-shop-now-btn').setAttribute('disabled', 'disabled');
        document.querySelector('.sticky-shop-now-btn').classList.add('disabled');
      }
    },

    _updateAddToCart: function() {

      var pre_order_textEl = this.container.querySelector('.pre_order_text');

      var originalSelectorId  = this.variants.originalSelectorId;
      var originalSelector = this.container.querySelector(originalSelectorId);
      var selectedElement = originalSelector.item(originalSelector.selectedIndex);
      var member_only_variant = selectedElement.getAttribute('data-member-only');
      if(member_only_variant == 'true' && document.querySelectorAll('.member_only_login_btn').length > 0){
        this.addToCart.parentElement.style.display = 'none';
        if(document.querySelector('.sticky-shop-now-btn')){
          document.querySelector('.sticky-shop-now-btn').classList.add('hide');
        }
        if(document.querySelectorAll('.member_only_login_btn').length > 0){
          document.querySelectorAll('.member_only_login_btn').forEach(function(elem){
            elem.setAttribute('href', 'https://account.ecoflow.com/login?return_to='+window.location.href);
            elem.style.display = 'block';
          });
        }
      }
      else{
        this.addToCart.parentElement.style.display = 'block';
        if(document.querySelector('.sticky-shop-now-btn')){
          document.querySelector('.sticky-shop-now-btn').classList.remove('hide');
        }
        if(document.querySelectorAll('.member_only_login_btn').length > 0){
          document.querySelectorAll('.member_only_login_btn').forEach(function(elem){
            elem.style.display = 'none';
          });
        }
      }

      if(member_only_variant == 'true') this.container.querySelector('.product-custom-labels .member-only').style.display = 'block';
      else this.container.querySelector('.product-custom-labels .member-only').style.display = 'none';

      if (this.productState.available) {
        document.getElementsByTagName("klarna-placement")[0].style.display = 'block';
      }

      if (!this.productState.available) {
        this._disableAddToCart(theme.strings.unavailable);
        document.getElementsByTagName("klarna-placement")[0].style.display = 'none';
        return;
      }


      if (this.productState.soldOut) {
        document.getElementsByTagName("klarna-placement")[0].style.display = 'none';
        this._disableAddToCart(theme.strings.soldOut);
        if(pre_order_textEl) {
          pre_order_textEl.classList.add('hide');
        }

        return;
      }

      if(this.show_preOrder_btn) {

        if(originalSelector) {

          var inventory_policy = selectedElement.getAttribute('data-inventory_policy');
          var inventory_quantity = selectedElement.getAttribute('data-inventory_quantity') * 1;

          if( inventory_policy == 'continue' &&  inventory_quantity <= 0) {
            this._enableAddToCart(theme.strings.preOrder);
            if(pre_order_textEl) {
              pre_order_textEl.classList.remove('hide');
            }
          } else {
            this._enableAddToCart(theme.strings.addToCart);
            if(pre_order_textEl) {
              pre_order_textEl.classList.add('hide');
            }

          }

        }

      } else {
        this._enableAddToCart(theme.strings.addToCart);
        if(pre_order_textEl) {
          pre_order_textEl.classList.add('hide');
        }
      }
    },

    _setProductState: function(evt) {
      var variant = evt.detail.variant;

      if (!variant) {
        this.productState.available = false;
        return;
      }

      this.productState.available = true;
      this.productState.soldOut = !variant.available;
      this.productState.onSale = variant.compare_at_price > variant.price;
      this.productState.showUnitPrice = !!variant.unit_price;
    },

    _updateInventoryQuantity: function(evt) {
      var variant = evt.detail.variant;

      if (!variant) {
        return;
      }
      var inventory_qty_info = this.container.querySelector('.inventory_qty_info');
      if(inventory_qty_info) {

        var variantInventoryIcon = this.variantsInventories[variant['id']]['inventory_icon'],
            variantInventoryType = this.variantsInventories[variant['id']]['inventory_type'],
            variantInventoryMessage = this.variantsInventories[variant['id']]['inventory_message'];


        var inventory_icon_statusEl = this.container.querySelector('.product-form__inventory-icon-status'),
            inventory_iconEl = inventory_icon_statusEl.querySelector('load-icon'),
            inventory_textEl = this.container.querySelector('.product-form__inventory-text');


        inventory_icon_statusEl.classList.remove('text-success');
        inventory_icon_statusEl.classList.remove('text-warning');
        inventory_icon_statusEl.classList.remove('text-danger');

        inventory_icon_statusEl.classList.add('text-'+variantInventoryType);
        inventory_iconEl.setAttribute('name',variantInventoryIcon);
        inventory_iconEl.render();
        inventory_textEl.innerHTML = variantInventoryMessage;
      }

      var back_in_stock_row = this.container.querySelector('.back_in_stock_row');
      if(back_in_stock_row) {
        if (variant['available']) {
          back_in_stock_row.classList.add('hide');
        } else {
          back_in_stock_row.classList.remove('hide');
        }
      }

      var contant_form_current_variant_title = document.querySelector('#contant_form_current_variant_title');
      if(contant_form_current_variant_title) {
      	contant_form_current_variant_title.value = variant.title;
      }
    },

    _updateAvailability: function(evt) {

      // remove error message if one is showing
      this._hideErrorMessage();

      // set product state
      this._setProductState(evt);

       // update instock message
      this._updateInventoryQuantity(evt);

      // update store availabilities info
      this._updateStoreAvailabilityContent(evt);

      // update live region

      this._updatePriceComponentStyles(evt);

      // update form submit
      this._updateAddToCart();

    },

    _updateStoreAvailabilityContent: function(evt) {
      if (!this.storeAvailability) {
        return;
      }

      if (this.productState.available && !this.productState.soldOut) {
        this.storeAvailability.updateContent(evt.detail.variant.id);
      } else {
        this.storeAvailability.clearContent();
      }
    },

    _hidePriceComponent: function() {
      this.priceContainer.classList.add(this.classes.productUnavailable);
      this.priceContainer.setAttribute('aria-hidden', true);
      if (this.productPolicies) {
        this.productPolicies.classList.add(this.classes.visibilityHidden);
      }
    },

    _updatePriceComponentStyles: function(evt) {
      var variant = evt.detail.variant;

      var unitPriceBaseUnit = this.priceContainer.querySelector(
        this.selectors.unitPriceBaseUnit
      );

      if (!this.productState.available) {
        this._hidePriceComponent();
        return;
      }

      if (this.productState.soldOut) {
        this.priceContainer.classList.add(this.classes.productSoldOut);
      } else {
        this.priceContainer.classList.remove(this.classes.productSoldOut);
      }

      if (this.productState.showUnitPrice) {
        unitPriceBaseUnit.innerHTML = this._getBaseUnit(variant);
        this.priceContainer.classList.add(this.classes.productUnitAvailable);
      } else {
        this.priceContainer.classList.remove(this.classes.productUnitAvailable);
      }

      if (this.productState.onSale) {
        this.priceContainer.classList.add(this.classes.productOnSale);
      } else {
        this.priceContainer.classList.remove(this.classes.productOnSale);
      }

      this.priceContainer.classList.remove(this.classes.productUnavailable);
      this.priceContainer.removeAttribute('aria-hidden');
      if (this.productPolicies) {
        this.productPolicies.classList.remove(this.classes.visibilityHidden);
      }
    },

    _updatePrice: function(evt) {
      var variant = evt.detail.variant;

      document.getElementsByTagName("klarna-placement")[0].setAttribute("data-purchase-amount", variant.price);
      window.Klarna.OnsiteMessaging.refresh();

      var regularPrices = this.priceContainer.querySelectorAll(
        this.selectors.regularPrice
      );
      var salePrice = this.priceContainer.querySelector(
        this.selectors.salePrice
      );
      var savings = this.priceContainer.querySelector(
        this.selectors.savings
      );
      var unitPrice = this.priceContainer.querySelector(
        this.selectors.unitPrice
      );

      var priceFormat = theme.priceCurrencyCodeEnable ? theme.moneyFormatWithCurrency : theme.moneyFormat;
      var comparePriceFormat = theme.comparePriceCurrencyCodeEnable ? theme.moneyFormatWithCurrency : theme.moneyFormat;
      var formatRegularPrice = function(regularPriceElement, price) {
        if(price > 999900){
          var formattedPrice = theme.Currency.formatMoney(
            price,
            comparePriceFormat
          ).replace(',00', '').replace('.', ' ');
        }
        else{
          var formattedPrice = theme.Currency.formatMoney(
            price,
            comparePriceFormat
          ).replace(',00', '').replace('.', '');
        }
        regularPriceElement.innerHTML = formattedPrice;
      };

      // KY: EcoCredits Loyalty feature get Redeemable points - 2024-03-27
      var getRedeemablePointsApi = async ({price, variantId}) => {
        // Do not process if the eco credit message is disabled
        const isEcoCreditMsgEnabled = document.querySelector("#sidebar-cart").getAttribute("data-enabled-ecocredit-msg");
        if (!JSON.parse(isEcoCreditMsgEnabled)) return;

        const { apiDomain, acceptedLanguage, xAppid } = theme.emailSubscription;
        const ecocreditMsgBox = document.querySelector('.product-ecocredits-message__wrapper');
        const productId = ecocreditMsgBox.getAttribute('data-product-id');
        if (!productId) return;

        try {
          const response = await fetch(`${apiDomain}/integral/web/pointsCashRule/getRule`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-appid': xAppid,
              traceId: generateTraceId(),
              'Accept-Language': acceptedLanguage,
            },
            body: JSON.stringify({
              productList: [
                {
                  productId,
                  variantId: `${variantId}`,
                  quantity: 1,
                  price: `${price / 100}`,
                },
              ],
              source: 'CART'
            }),
          });
          const data = await response.json();
          if (data.code === '0' && data.data && data.data.maxPoints) {
            ecocreditMsgBox.style.display = "flex"
            const priceText = document.querySelector(".product-ecocredits-message__price");
            const cash = Number(data.data.maxPoints * data.data.ratio).toFixed(2);
            const maxReduction =
                  Number(cash) >= 10000
                    ? Number(cash)
                        .toLocaleString("de")
                        .replace(".", " ")
                    : Number(cash)
                        .toLocaleString("de")
                        .replace(".", "");
            priceText.innerText = maxReduction + '€';
          } else {
            ecocreditMsgBox.style.display = "none"
          }
        } catch (error) {
          ecocreditMsgBox.style.display = "none"
          console.error(error.message);
        }
      };

      // On sale
      if (this.productState.onSale) {
        regularPrices.forEach(function(regularPrice) {
          formatRegularPrice(regularPrice, variant.compare_at_price);
        });
        getRedeemablePointsApi({price: variant.price, variantId: variant.id});
        if(variant.price > 999900){
          salePrice.innerHTML = theme.Currency.formatMoney(
            variant.price,
            priceFormat
          ).replace(',00', '').replace('.', ' ');
        }
        else{
          salePrice.innerHTML = theme.Currency.formatMoney(
            variant.price,
            priceFormat
          ).replace(',00', '').replace('.', '');
        }
        if(variant.compare_at_price - variant.price > 999900){
          savings.innerHTML = '-' + theme.Currency.formatMoney(
            variant.compare_at_price - variant.price,
            theme.moneyFormat
          ).replace(',00', '').replace('.', ' ');
        }
        else{
          savings.innerHTML = '-' + theme.Currency.formatMoney(
            variant.compare_at_price - variant.price,
            theme.moneyFormat
          ).replace(',00', '').replace('.', '');
        }
      } else {
        // Regular price
        regularPrices.forEach(function(regularPrice) {
          formatRegularPrice(regularPrice, variant.price);
        });
        getRedeemablePointsApi({price: variant.price, variantId: variant.id});
        /*if(!document.querySelector('.product-accessories-section')){
          document.querySelector('.product-form__controls-group--submit .compare-price').style.display = 'none';
          document.querySelector('.product-form__controls-group--submit .total-savings').style.display = 'none';
        }*/
      }

      if(document.querySelector('.sticky-price-wrapper .product-price')){
        if(variant.price > 999900){
          document.querySelector('.sticky-price-wrapper .product-price').innerHTML = theme.Currency.formatMoney(
            variant.price,
            priceFormat
          ).replace(',00', '').replace('.', ' ');
        }
        else{
          document.querySelector('.sticky-price-wrapper .product-price').innerHTML = theme.Currency.formatMoney(
            variant.price,
            priceFormat
          ).replace(',00', '').replace('.', '');
        }
      }

      var inputEl = document.querySelector('[name="quantity"]');
      var qty = inputEl.value;
      var total_regular_price = variant.price;
      if (this.productState.onSale)
        var total_compare_price = variant.compare_at_price, total_saving = variant.compare_at_price - variant.price;
      else
        var total_compare_price = variant.price, total_saving = 0;

      var discount = 1;
      if(qty >= 10 && qty <= 19){ discount = 2; }
      if(qty >= 20){ discount = 5; }
      if(document.querySelector('.product-container').getAttribute('data-discount-product') == 'true'){
        if(discount > 1){
          total_compare_price = total_regular_price;
          total_regular_price = total_regular_price - (total_regular_price*discount/100);
          total_saving = total_compare_price - total_regular_price;
        }
      }

      if(document.querySelector('.product-accessories-section[data-variant="'+variant.id+'"]')){
        var accessories_wrap = document.querySelector('.product-accessories-section[data-variant="'+variant.id+'"]');
        if(accessories_wrap.querySelectorAll('.variant-accessory.selected').length > 0){
          accessories_wrap.querySelectorAll('.variant-accessory.selected').forEach(function(elem){
            var accessory_price = parseInt(elem.getAttribute('data-price'));
            var accessory_compare_price = parseInt(elem.getAttribute('data-compare-price'));
            if(accessory_compare_price == 0) accessory_compare_price = elem.getAttribute('data-price');
            var accessory_saving = parseInt(elem.getAttribute('data-saving'));

            if(elem.getAttribute('data-discount-accessory') == 'true'){
              if(discount > 1){
                accessory_compare_price = accessory_price;
                accessory_price = accessory_price - (accessory_price*discount/100);
                accessory_saving = accessory_compare_price - accessory_price;
              }
            }
            total_regular_price = total_regular_price + accessory_price;
            total_compare_price = total_compare_price + accessory_compare_price;
            total_saving = total_saving + accessory_saving;
          });
        }
      }

      if(document.querySelector('.product-form__controls-group--submit').getAttribute('data-hide-price') != 'false'){
        var formatted_total_regular_price = total_regular_price * qty;
        if(formatted_total_regular_price > 999900){
          document.querySelector('.product-form__controls-group--submit .regular-price').innerHTML = theme.Currency.formatMoney(
            formatted_total_regular_price,
            priceFormat
          ).replace(',00', '').replace('.', ' ');
        }
        else{
          document.querySelector('.product-form__controls-group--submit .regular-price').innerHTML = theme.Currency.formatMoney(
            formatted_total_regular_price,
            priceFormat
          ).replace(',00', '').replace('.', '');
        }

        if(total_compare_price > 0 && total_compare_price > total_regular_price){
          var formatted_total_compare_price = total_compare_price * qty;
          if(formatted_total_compare_price > 999900){
            document.querySelector('.product-form__controls-group--submit .compare-price').innerHTML = theme.Currency.formatMoney(
              formatted_total_compare_price,
              comparePriceFormat
            ).replace(',00', '').replace('.', ' ');
          }
          else{
            document.querySelector('.product-form__controls-group--submit .compare-price').innerHTML = theme.Currency.formatMoney(
              formatted_total_compare_price,
              comparePriceFormat
            ).replace(',00', '').replace('.', '');
          }
        }
        else{
          document.querySelector('.product-form__controls-group--submit .compare-price').innerHTML = '';
        }

        if(total_saving > 0){
          var formatted_total_saving = total_saving * qty;
          if(formatted_total_saving > 999900){
            document.querySelector('.product-form__controls-group--submit .total-savings').innerHTML = '-' + theme.Currency.formatMoney(
              formatted_total_saving,
              theme.moneyFormat
            ).replace(',00', '').replace('.', ' ');
          }
          else{
            document.querySelector('.product-form__controls-group--submit .total-savings').innerHTML = '-' + theme.Currency.formatMoney(
              formatted_total_saving,
              theme.moneyFormat
            ).replace(',00', '').replace('.', '');
          }
        }
        else{
          document.querySelector('.product-form__controls-group--submit .total-savings').innerHTML = '';
        }

        document.querySelector('.product-form__controls-group--submit .price-wrapper').setAttribute('data-price', variant.price);
        document.querySelector('.product-form__controls-group--submit .price-wrapper').setAttribute('data-compare-price', variant.compare_at_price);
        document.querySelector('.product-form__controls-group--submit .price-wrapper').setAttribute('data-saving', variant.compare_at_price - variant.price);
      }

      // Unit price
      if (this.productState.showUnitPrice) {
        unitPrice.innerHTML = theme.Currency.formatMoney(
          variant.unit_price,
          theme.moneyFormat
        ).replace(',00', '').replace('.', '');
      }

      // For Affirm message i.e. update based on selected variant
      var affirmMessageVariantItems = this.productForm.querySelectorAll('.affirm-message-container .affirm-message-item')
      var affirmMessageSelectedVariantItem = this.productForm.querySelector(`.affirm-message-container [data-variant-id="${variant.id}"]`)
      if(affirmMessageVariantItems) affirmMessageVariantItems.forEach(item => item.classList.remove('selected'))
      if(affirmMessageSelectedVariantItem) affirmMessageSelectedVariantItem.classList.add('selected')
    },

    _getBaseUnit: function(variant) {
      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value +
            variant.unit_price_measurement.reference_unit;
    },

    _updateSKU: function(evt) {
      var variant = evt.detail.variant;
      // Update the sku
      var sku = document.querySelector(this.selectors.SKU);
      if (!sku) return;
      sku.innerHTML = variant.sku;

      var contant_form_current_variant_sku = document.querySelector('#contant_form_current_variant_sku');
      if(contant_form_current_variant_sku) {
      	contant_form_current_variant_sku.value = variant.sku;
      }
    },

    _initSwatches: function() {
      if(this.swatchesWrapper) {
      this.swatchesWrapper.querySelectorAll('[type="radio"]').forEach(function (item,index) {
        item.addEventListener('change', function(e) {
          var optionIndex = this.closest('.swatch').getAttribute('data-option-index');
          var optionValue = this.value.replace(/\s{2,}/g, ' ');
          var triggerSelectEl = this.closest('form').querySelectorAll('.single-option-selector')[optionIndex];
          if(triggerSelectEl) {
          	triggerSelectEl.value = optionValue;
            triggerSelectEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        });
      }

      var productJSON = this.productSingleObject;
      for (var i=0,length=productJSON.variants.length; i<length; i++) {
        var productVariants = productJSON.variants[i];
        if(productVariants.available){
          for (var j=0,optlength=productVariants.options.length; j<optlength; j++) {
            var variantOption = productVariants.options[j];
            variantOption = handleizeStr(variantOption);
            var active_swatchEl = this.container.querySelector('.swatch[data-option-index="'+j+'"] .swatch_'+variantOption+'');
            if(active_swatchEl) {
              active_swatchEl.classList.remove('soldout');
              active_swatchEl.classList.add('available');
              active_swatchEl.querySelector('[type="radio"]').removeAttribute('disabled');
            }
          }

        }
      };

    },

    onUnload: function() {
      this.container.removeEventListener(
        'variantChange',
        this.eventHandlers.updateAvailability
      );

      this.container.removeEventListener(
        'variantPriceChange',
        this.eventHandlers.updatePrice
      );
      this.container.removeEventListener(
        'variantSKUChange',
        this.eventHandlers.updateSKU
      );
      theme.ProductVideo.removeSectionVideos(this.settings.sectionId);
      theme.ProductModel.removeSectionModels(this.settings.sectionId);

    }
  });

  return Product;
})();

theme.ProductRecommendations = (function() {
  function ProductRecommendations(container) {
    var baseUrl = container.dataset.baseUrl;
    var productId = container.dataset.productId;
    var sectionId = container.dataset.sectionId;
    var recommendationsSectionUrl =
      baseUrl +
      '?section_id='+sectionId+'&product_id=' +
      productId +
      '&limit=4';

    window.performance.mark(
      'pursuit:product:fetch_product_recommendations.start'
    );

    fetch(recommendationsSectionUrl)
      .then(function(response) {
        return response.text();
      })
      .then(function(productHtml) {
        if (productHtml.trim() === '') return;

        container.innerHTML = productHtml;
        container.innerHTML = container.firstElementChild.innerHTML;

      var formsArr = container.querySelectorAll('[action="/cart/add"]');
      if(formsArr.length) {
        formsArr.forEach(function(form,index) {
          theme.AddItemToCart(form);

        });
      }
      theme.ProductItemSwatches();

            var zoomFadeAnimationElems = container.querySelectorAll('.zoom-fade-animation:not(.zoomFade-animation)');

    if(zoomFadeAnimationElems.length) {
      zoomFadeAnimationElems.forEach(function(block,index) {
        var  containerPosition = block.getBoundingClientRect();
        if(containerPosition.top + 200 < window.innerHeight) {
          block.classList.add('zoomFade-animation');
        }
      });
    }


        window.performance.mark(
          'pursuit:product:fetch_product_recommendations.end'
        );

        performance.measure(
          'pursuit:product:fetch_product_recommendations',
          'pursuit:product:fetch_product_recommendations.start',
          'pursuit:product:fetch_product_recommendations.end'
        );
      });
  }

  return ProductRecommendations;
})();

theme.Quotes = (function() {

  function Quotes(container) {
    this.container = container;
    var sectionId = container.getAttribute('data-section-id');
    this.slider = container.querySelector('.testimonials_slider[data-flickity-config]');
    if(this.slider) {
      this.options = JSON.parse(this.slider.getAttribute('data-flickity-config'));
      var flickityInstance = new Flickity(this.slider, this.options);
      flickityInstance.element.classList.add("rendered");


      var slider_custom_arrows = container.querySelector('.slider_custom_arrows');
      if(slider_custom_arrows) {
        var slider_custom_btns = slider_custom_arrows.querySelectorAll('.btn');
        slider_custom_btns.forEach(function(item,index) {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            var isNext =  item.classList.contains('button-next');
            if(isNext) {
              flickityInstance.next();
            } else {
              flickityInstance.previous();
            }

          });
        });
      }


//       var progress = container.querySelector(".progress");
//       if(progress) {
//         progress.oninput = function() {
//           var index = container.querySelector('.flickity-slider').childElementCount;
//           var value = Math.floor(this.value * (index / 100));
//           flickityInstance.select( value );

//            var background_value = (this.value-this.min)/(this.max-this.min)*100;
//            this.style.background = 'linear-gradient(to right, #fd5b2b 0%, #fd5b2b ' + background_value + '%, #e0e0e0 ' + background_value + '%, #e0e0e0 100%)'

//         }

//         flickityInstance.on( 'select', function( index ) {

//           var elementsCount = container.querySelector('.flickity-slider').childElementCount;
//           var progressValue = 100 / elementsCount * (index + 1);
//           progress.value = progressValue;

//           var background_value = (progress.value-progress.min)/(progress.max-progress.min)*100;
//           progress.style.background = 'linear-gradient(to right, #fd5b2b 0%, #fd5b2b ' + background_value + '%, #e0e0e0 ' + background_value + '%, #e0e0e0 100%)'

//         });

//       };
      }

    }

  return Quotes;
})();

theme.FlickitySlideshowSection = (function() {
  function FlickitySlideshowSection(container) {

    this.container = container;
    var sectionId = container.dataset.sectionId;
    var sliderEl = container.querySelector('#Slideshow-' + sectionId);
    var slider_options = JSON.parse(sliderEl.getAttribute('data-flickity-options'));
    this.flickityInstance = new Flickity(sliderEl, slider_options);
    this.flickityInstance.element.classList.add("rendered");
    var flickityInstance = this.flickityInstance;

    var slider_custom_arrows = container.querySelector('.slideshow__arrows');
    if(slider_custom_arrows) {
      var slider_custom_btns = slider_custom_arrows.querySelectorAll('.btn');
      slider_custom_btns.forEach(function(item,index) {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          if(window.innerWidth > 750) flickityInstance.stopPlayer();
          var isNext =  item.classList.contains('slideshow__arrow-next');
          if(isNext) {
            flickityInstance.next();
          } else {
            flickityInstance.previous();
          }

        });
      });
    }

    if(document.querySelectorAll('.disclaimer_container').length > 0){
      function alignDisclaimerBlock(){
        document.querySelectorAll('.disclaimer_container').forEach(function(elem){
          var blockElem = elem.parentElement.parentElement;
          var blockTextElem = blockElem.querySelector('.slideshow__text-content');
          var blockHeight = parseInt(blockTextElem.clientHeight);
          var blockOffset = parseInt(blockTextElem.offsetTop);
          var blockLeftOffset = parseInt(blockTextElem.querySelector('.slideshow_text_wrapper').offsetLeft);
          if(elem.classList.contains('block-right')){
            var blockRightOffset = window.innerWidth - blockLeftOffset - parseInt(blockTextElem.querySelector('.slideshow_text_wrapper').offsetWidth);
          }

          var style = window.getComputedStyle(blockTextElem);
          var matrix = new WebKitCSSMatrix(style.transform);
          var blockTranslate = matrix.m42;
          var blockXTranslate = matrix.m41;
          elem.querySelector('.block_disclaimer_box').style.top = blockHeight + blockOffset + blockTranslate + 'px';
          if(elem.classList.contains('block-right')){
            elem.querySelector('.block_disclaimer_box').style.right = blockRightOffset + 'px';
          }
          else{
            elem.querySelector('.block_disclaimer_box').style.left = blockLeftOffset + blockXTranslate + 'px';
          }

          elem.querySelector('.disclaimer_popup_close').onclick = function(){
            elem.querySelector('.disclaimer_popup_box_wrap').classList.add('hidden');
          }

          elem.querySelector('.disclaimer_popup_box_wrap').onmouseover = function(){
            elem.querySelector('.disclaimer_popup_box_wrap').classList.remove('hidden');
          }
        });
      }

      if(window.innerWidth > 1240){
        alignDisclaimerBlock();
      }
      else{
        document.querySelectorAll('.disclaimer_popup_box_wrap').forEach(function(elem){
          elem.onclick = function(){
            document.querySelector('.disclaimer_popup_box_m').innerHTML = elem.querySelector('.disclaimer_popup_box_inner').innerHTML;
            document.querySelector('.disclaimer_popup_box_m').style.display = "block";
            document.querySelector('html').classList.add('add-overlay');

            var popupElem = document.querySelector('.disclaimer_popup_box_m');
            popupElem.querySelector('.disclaimer_popup_close').onclick = function(){
              document.querySelector('.disclaimer_popup_box_m').innerHTML = '';
              document.querySelector('.disclaimer_popup_box_m').style.display = "none";
              document.querySelector('html').classList.remove('add-overlay');
            }
          }
        });

        document.querySelectorAll('.block_disclaimer_box_close').forEach(function(elem){
          elem.onclick = function(){
            elem.parentElement.parentElement.style.display = 'none';
          }
        });
      }
      window.onresize = function(){
        if(window.innerWidth > 1240){
          alignDisclaimerBlock();
        }
      }
    }

    this.flickityInstance.on('change', function(index) {
      container.querySelector('.slideshow__slide.slideshow__slide--active').classList.remove('slideshow__slide--active');
      container.querySelectorAll('.slideshow__slide')[index].classList.add('slideshow__slide--active');
    });
  }

  FlickitySlideshowSection.prototype = Object.assign({}, FlickitySlideshowSection.prototype, {
    onUnload: function() {
      this.flickityInstance.destroy();
    },

    onBlockSelect: function(evt) {

      // Get slide's index using theme editor's id
      var slide = this.container.querySelector(
        '.slideshow__slide--' + evt.detail.blockId
      );
      var slideIndex = slide.getAttribute('data-slider-slide-index');

      // Go to selected slide, pause auto-rotate
      this.flickityInstance.select(slideIndex);
      this.flickityInstance.pausePlayer();
    },

    onBlockDeselect: function() {
      // Resume auto-rotate
      this.flickityInstance.playPlayer();
    }
  });

  return FlickitySlideshowSection;
})();

theme.SlideshowSection = (function() {
  var selectors = {
    sliderMobileContentIndex: '[data-slider-mobile-content-index]'
  };

  function SlideshowSection(container) {
    var sectionId = container.dataset.sectionId;

    var self = this;
    this.container = container;
    this.eventHandlers = {};
    this.slideshowDom = container.querySelector('#Slideshow-' + sectionId);
    this.sliderMobileContentIndex = container.querySelectorAll(
      selectors.sliderMobileContentIndex
    );

    if( this.slideshowDom) {
    this.slideshow = new theme.Slideshow(container, {
      autoplay: this.slideshowDom.getAttribute('data-autorotate') === 'true',
      slideInterval: this.slideshowDom.getAttribute('data-speed')
    });
    this._setupEventListeners();
    }
  }

  return SlideshowSection;
})();

theme.SlideshowSection.prototype = Object.assign(
  {},
  theme.SlideshowSection.prototype,
  {
    _setupEventListeners: function() {
      this.eventHandlers.onSliderSlideChanged = function(event) {
        this._onSliderSlideChanged(event.detail);
      }.bind(this);

      this.container.addEventListener(
        'slider_slide_changed',
        this.eventHandlers.onSliderSlideChanged
      );

      this.container.dispatchEvent(new Event('slider_slide_changed', { bubbles: true }));

    },

    _onSliderSlideChanged: function(slideIndex) {


      var activeClass = 'slideshow__text-content--mobile-active';

      this.sliderMobileContentIndex.forEach(function(element) {
        if (
          Number(element.getAttribute('data-slider-mobile-content-index')) ===
          slideIndex
        ) {
          element.classList.add(activeClass);
        } else {
          element.classList.remove(activeClass);
        }
      });


      var videoSlides = this.container.querySelectorAll('.block_type__video');
      var _this = this;
      if(videoSlides.length) {

        var activeSlide = _this.container.querySelector('.slideshow__slide--active');
        if(activeSlide) {
          if(activeSlide.classList.contains('block_type__video')) {


            var isVideoTag = activeSlide.querySelector('video');
            if(isVideoTag) {
              var videoId = isVideoTag.getAttribute('id');
              var videoObj = document.getElementById(videoId);
              if(videoObj) {
                videoObj.play();
              }
            }

            var videoIframe = activeSlide.querySelector('iframe');
            if(videoIframe) {
              var videoId = videoIframe.getAttribute('id');
              var player = YT.get(videoId);
              if(player) {
                player.playVideo();
              }
            } else {
              var videoDivEl = activeSlide.querySelector('div.slideshow_video');
              if(videoDivEl) {
                theme.Video.init(videoDivEl);
                theme.Video.editorLoadVideo(videoDivEl.id);
              }
            }
          }
        }



        for(var i=0;i < _this.slideshow.slides.length;i++) {
          var slide = _this.slideshow.slides[i];
          if(i == _this.slideshow.slideIndex) {
            continue;
          }

          var hasVideoEl = slide.querySelector('.slideshow_video');
          if(hasVideoEl) {
            var isVideoTag = slide.querySelector('video');
            if(isVideoTag) {
              var videoId = isVideoTag.getAttribute('id');
              var videoObj = document.getElementById(videoId);
              if(videoObj) {
                videoObj.pause();
              }
            } else {
              var videoIframe = slide.querySelector('iframe');

              if(videoIframe) {
                var videoId = videoIframe.getAttribute('id');
                var player = YT.get(videoId);

                if(player) {
                  player.pauseVideo();
                }
              }
            }
          }
        }
      }

//       var progress = this.container.querySelector(".progress");
//       if(progress) {
//         var elementsCount = this.container.querySelector('[data-slider-container]').childElementCount;
//         var progressValue = 100 / elementsCount * (slideIndex + 1);
//         progress.value = progressValue;

//         var background_value = (progress.value-progress.min)/(progress.max-progress.min)*100;
//         progress.style.background = 'linear-gradient(to right, #fd5b2b 0%, #fd5b2b ' + background_value + '%, #e0e0e0 ' + background_value + '%, #e0e0e0 100%)';
//       }



    },

    onUnload: function() {

      this.slideshow.destroy();

    },

    onBlockSelect: function(evt) {
      if (this.slideshow.adaptHeight) {
        this.slideshow.setSlideshowHeight();
      }
      this.slideshow.checkSlideshowHeight();

      // Get slide's index using theme editor's id
      var slide = this.container.querySelector(
        '.slideshow__slide--' + evt.detail.blockId
      );
      var slideIndex = slide.getAttribute('data-slider-slide-index');

      // Go to selected slide, pause auto-rotate
      this.slideshow.setSlide(slideIndex);
      this.slideshow.stopAutoplay();
    },

    onBlockDeselect: function() {
      // Resume auto-rotate
      this.slideshow.startAutoplay();
    }
  }
);

window.theme = window.theme || {};

theme.StoreAvailability = (function() {
  var selectors = {
    storeAvailabilityModalOpen: '[data-store-availability-modal-open]',
    storeAvailabilityModalProductTitle:
      '[data-store-availability-modal-product-title]',
    storeAvailabilityModalVariantTitle:
      '[data-store-availability-modal-variant-title]'
  };

  var classes = {
    hidden: 'hide'
  };

  function StoreAvailability(container) {
    this.container = container;
    this.productTitle = this.container.dataset.productTitle;
    this.hasOnlyDefaultVariant =
      this.container.dataset.hasOnlyDefaultVariant === 'true';


    document.addEventListener('click', function(e){
      var el = e.target;
      if(!el.classList.contains('store-availabilities-modal') && !el.closest('.store-availabilities-modal') && !el.closest('.store-availability-information-container')) {
        var StoreAvailabilityModal = document.querySelector('.store-availabilities-modal');

        if(StoreAvailabilityModal) {
          if(StoreAvailabilityModal.classList.contains('store-availabilities-modal--active')) {

            document.querySelector('body').classList.remove('show_overlay');

            var close_btn = StoreAvailabilityModal.querySelector('.js-modal-close-store-availability-modal');
            if(close_btn) {
              close_btn.dispatchEvent(new Event('click', { bubbles: true }));
            }

          }
        }
      }
    });

  }

  StoreAvailability.prototype = Object.assign({}, StoreAvailability.prototype, {
    updateContent: function(variantId) {
      var variantSectionUrl =
        this.container.dataset.baseUrl +
        '/variants/' +
        variantId +
        '/?section_id=store-availability';
      var self = this;

      var storeAvailabilityModalOpen = self.container.querySelector(
        selectors.storeAvailabilityModalOpen
      );

      this.container.style.opacity = 0.5;
      if (storeAvailabilityModalOpen) {
        storeAvailabilityModalOpen.disabled = true;
        storeAvailabilityModalOpen.setAttribute('aria-busy', true);
      }

      fetch(variantSectionUrl)
        .then(function(response) {
          return response.text();
        })
        .then(function(storeAvailabilityHTML) {
          if (storeAvailabilityHTML.trim() === '') {
            return;
          }
          self.container.innerHTML = storeAvailabilityHTML;
          self.container.innerHTML = self.container.firstElementChild.innerHTML;
          self.container.style.opacity = 1;

          // Need to query this again because we updated the DOM
          storeAvailabilityModalOpen = self.container.querySelector(
            selectors.storeAvailabilityModalOpen
          );

          if (!storeAvailabilityModalOpen) {
            return;
          }

          storeAvailabilityModalOpen.addEventListener(
            'click',
            self._onClickModalOpen.bind(self)
          );

          self.modal = self._initModal();
          self._updateProductTitle();
          if (self.hasOnlyDefaultVariant) {
            self._hideVariantTitle();
          }
        });
    },

    clearContent: function() {
      this.container.innerHTML = '';
    },

    _onClickModalOpen: function() {
      this.container.dispatchEvent(
        new CustomEvent('storeAvailabilityModalOpened', {
          bubbles: true,
          cancelable: true
        })
      );
    },

    _initModal: function() {
      return new window.Modals(
        'StoreAvailabilityModal',
        'store-availability-modal',
        {
          close: '.js-modal-close-store-availability-modal',
          closeModalOnClick: true,
          openClass: 'store-availabilities-modal--active'
        }
      );
    },

    _updateProductTitle: function() {
      var storeAvailabilityModalProductTitle = this.container.querySelector(
        selectors.storeAvailabilityModalProductTitle
      );
      storeAvailabilityModalProductTitle.textContent = this.productTitle;
    },

    _hideVariantTitle: function() {
      var storeAvailabilityModalVariantTitle = this.container.querySelector(
        selectors.storeAvailabilityModalVariantTitle
      );
      storeAvailabilityModalVariantTitle.classList.add(classes.hidden);
    }
  });

  return StoreAvailability;
})();

var selectors = {
  disclosureLocale: '[data-disclosure-locale]',
  disclosureCurrency: '[data-disclosure-currency]'
};

theme.FooterSection = (function() {
  function Footer(container) {

    this.container = container;
    this.cache = {};
    this.cacheSelectors();

    if (this.cache.localeDisclosure) {
      this.localeDisclosure = new theme.Disclosure(this.cache.localeDisclosure);
    }

    if (this.cache.currencyDisclosure) {
      this.currencyDisclosure = new theme.Disclosure(
        this.cache.currencyDisclosure
      );
    }
  }

  Footer.prototype = Object.assign({}, Footer.prototype, {
    cacheSelectors: function() {
      this.cache = {
        localeDisclosure: this.container.querySelector(
          selectors.disclosureLocale
        ),
        currencyDisclosure: this.container.querySelector(
          selectors.disclosureCurrency
        )
      };
    },

    onUnload: function() {
      if (this.cache.localeDisclosure) {
        this.localeDisclosure.destroy();
      }

      if (this.cache.currencyDisclosure) {
        this.currencyDisclosure.destroy();
      }
    }
  });

  return Footer;
})();

theme.FeaturedBlog = (function() {
  function FeaturedBlog(container) {
    var sliderEl = container.querySelector('.featured-blog__slider');
    var flickityInstance;
    var slider_options;

    if(sliderEl) {
      slider_options = JSON.parse(sliderEl.getAttribute('data-flickity-config'));
      flickityInstance = new Flickity(sliderEl, slider_options);
        flickityInstance.element.classList.add("rendered");

      var slider_custom_arrows = container.querySelector('.slider_custom_arrows');
      if(slider_custom_arrows) {
        var slider_custom_btns = slider_custom_arrows.querySelectorAll('.btn');
        slider_custom_btns.forEach(function(item,index) {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            var isNext =  item.classList.contains('button-next');
            if(isNext) {
              flickityInstance.next();
            } else {
              flickityInstance.previous();
            }

          });
        });
      }



    }
  };

  return FeaturedBlog;
})();

theme.BlogPage = (function() {
  function BlogPage(container) {

    var sidebar_menu_items = container.querySelectorAll('.panel-heading.collapse');
    if(sidebar_menu_items.length) {
      sidebar_menu_items.forEach(function (item,index) {
        item.addEventListener('click',function (e) {
          e.preventDefault();

          var self = this;
          var panelId = item.getAttribute('data-collapse-panel');
          var itemPanel = document.querySelector('#'+panelId);


          var current_active_block = container.querySelector('.panel-heading.collapse.active');
          if(current_active_block)  {
            var current_block_id = current_active_block.getAttribute('data-collapse-panel');

            if(current_block_id != panelId) {
              current_active_block.dispatchEvent(new Event('click', { bubbles: true }));
            }
          }


          if (!itemPanel.classList.contains('active')) {

            self.classList.add('active');
            itemPanel.classList.add('active');
            itemPanel.style.height = 'auto';

            var height = itemPanel.clientHeight + 'px';

            itemPanel.style.height = '0px';

            setTimeout(function () {
              itemPanel.style.height = height;
            }, 0);

          } else {

            itemPanel.style.height = '0px';

            itemPanel.addEventListener('transitionend', function () {
              itemPanel.classList.remove('active');
              self.classList.remove('active');
            }, {
              once: true
            });

          }

        });
      });
    }


    var blog_page_top_bar_dropdowns = container.querySelectorAll('.blog_page_top_bar-dropdown');
    if(blog_page_top_bar_dropdowns.length) {
      blog_page_top_bar_dropdowns.forEach(function (dropdown,index) {
        dropdown.addEventListener('change',function (e) {
          e.preventDefault();

          var val = this.value;
          var id = this.id;
          var new_url;
          if(id == 'top_bar_tags') {
            if(val.length) {
              var hidden_top_bar_tags_linksEl = container.querySelectorAll('.hidden_top_bar_tags_link');
              if(hidden_top_bar_tags_linksEl.length) {
                hidden_top_bar_tags_linksEl.forEach(function (item,index) {

                  var tag_handle = item.getAttribute('data-tag-handle');
                  if(tag_handle == val) {
                    new_url = item.querySelector('a').href;
                  }

                });
              }
            } else {
              new_url = window.location.href.split('/tagged')[0];
            }
          } else {
            new_url = val;
          }
          window.location.href = new_url;
        });
      });
    }

    var pagination_mode = container.getAttribute('data-pagination_mode');
    if(pagination_mode != 'standart') {
      var endlessScroll = new Ajaxinate({
        container: '#AjaxinateContainer',
        pagination: '#AjaxinatePagination',
        method: pagination_mode,
        offset: 500
      });
    }

    var open_sidebar_btn  = container.querySelector('.open_mobile_sidebar');
    var close_sidebar_btn = container.querySelector('.close-blog-sidebar');
    if(open_sidebar_btn) {
      open_sidebar_btn.addEventListener('click', function(e) {
        e.preventDefault();
        var sidebarEl =  container.querySelector('.blog-sidebar');
        if(sidebarEl) {
          sidebarEl.classList.add('show');
          document.querySelector('body').classList.add('show_overlay');
        }
      });
    }
    if(close_sidebar_btn) {
      close_sidebar_btn.addEventListener('click', function(e) {
        e.preventDefault();
        var sidebarEl =  container.querySelector('.blog-sidebar');
        if(sidebarEl) {
          sidebarEl.classList.remove('show');
          document.querySelector('body').classList.remove('show_overlay');
        }
      });
    }

  };

  return BlogPage;
})();

theme.ArticlePage = (function() {
  function ArticlePage(container) {

  var form_reset_btn = container.querySelector('.comment-reset-btn');
    if(form_reset_btn) {
      form_reset_btn.addEventListener('click', function(e) {
      	e.preventDefault();
        var form = this.closest('form');
        var inputs = form.querySelectorAll('.input-full');
        if(inputs.length) {
          inputs.forEach(function(item,index) {
          	item.value = '';
            item.innerHTML = '';
          });
        }
      });
    }
  };

  return ArticlePage;
})();

theme.Timeline = (function() {
  function Timeline(container) {
    var timeline_nav_items = container.querySelectorAll('.timeline_nav_item');
    if(timeline_nav_items.length) {
      var sectionId = container.getAttribute('data-section-id');

      function sectionHeightCalculate() {
        var sectionHeight = container.getAttribute('data-blocks_height');
        var timeline_blocks = container.querySelectorAll('.timeline_block');
        if(timeline_blocks.length) {
          timeline_blocks.forEach(function (item,index) {
            var isActive = item.classList.contains('active');
            item.classList.add('active');
            var itemHeight =  item.clientHeight;
            if(itemHeight > sectionHeight) {
              sectionHeight = itemHeight;
            }
            if(isActive != true) {
              item.classList.remove('active');
            }

          });
        }
        var timeline_blocksEl = container.querySelector('.timeline_blocks');
        if(timeline_blocksEl) {
          timeline_blocksEl.style.height = sectionHeight + 'px';
        }
      };

//       window.addEventListener('resize', sectionHeightCalculate);
//       sectionHeightCalculate();

      timeline_nav_items.forEach(function (item,index) {
        item.addEventListener('click', function(e) {
          e.preventDefault();

          var active_nav_item = container.querySelector('.timeline_nav_item.active');
          var active_timeline_block = container.querySelector('.timeline_block.active');

          var year = this.getAttribute('data-year');
          var year_timeline_blockId =  '#block_'+sectionId+'_'+year;
          var newTimeline_block = container.querySelector(year_timeline_blockId);

          active_nav_item.classList.remove('active');
          active_timeline_block.classList.remove('active');
          if(newTimeline_block) {
          	newTimeline_block.classList.add('active');
          }
          this.classList.add('active');
        });
      });
    }
  }

  return Timeline;
})();
theme.Mosaic = (function() {
  function Mosaic(container) {
  var use_lightbox = container.querySelector('.use_lightbox');
    if(use_lightbox) {
    	var mosaic_blocks = container.querySelectorAll('.mosaic_block');
      if(mosaic_blocks.length) {

          var items = [];
        var pswpElement = document.querySelectorAll('.pswp')[0];

        mosaic_blocks.forEach(function (item,index) {

          var imageObj = {
            src: item.getAttribute('data-image-url'),
            w: +(item.getAttribute('data-image-width')),
            h: +(item.getAttribute('data-image-height'))
          }
           items.push(imageObj);

          item.addEventListener('click', function(e) {

            var target = e.target;


            if(target.classList.contains('mosaic_block-link') || target.closest('.mosaic_block-link')) {
            } else {
              e.preventDefault();

              var options = {
                index: index // start at first slide
              };
              var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
              gallery.init();
            }

          });
        });
      }
    }

    if(container.querySelectorAll('.mosaic_video').length > 0){
      window.onload = function(){
        if(container.querySelectorAll('.mosaic_video_mobile').length > 0){
          if(window.innerWidth > 1239){
            container.querySelectorAll('.mosaic_video').forEach(function(elem){
              document.getElementById(elem.getAttribute('id')).play();
            });
          }
          else{
            container.querySelectorAll('.mosaic_video_mobile').forEach(function(elem){
              document.getElementById(elem.getAttribute('id')).play();
            });
          }
        }
        else{
          container.querySelectorAll('.mosaic_video').forEach(function(elem){
            document.getElementById(elem.getAttribute('id')).play();
          });
        }
      }
    }
  }

  return Mosaic;
})();

theme.SearchBar = (function() {
  function SearchBar(element) {

    this.element = element;
    this.delegateElement = new Delegate(this.element) ;

    this.headerElement = this.element.closest('.site-header');
    this.searchBarElement = this.element.querySelector('.search-form');
    this.inputElement = this.element.querySelector('[name="q"]');
    this.searchResultsElement = this.element.querySelector('.search-bar__results');
    this.searchPopoverEl = this.element.querySelector('.predictive-search-wrapper--drawer');

    this.productTypeFilter = '';
    this.isSearchOpen = false;

    this._attachListeners();

  }
  SearchBar.prototype = Object.assign({}, SearchBar.prototype, {
    _destroy: function()  {
      this.delegateElement.off();
    },
    _attachListeners: function() {


      this.delegateElement.on('focusin', '[name="q"]', this._onInputFocus.bind(this));
      this.delegateElement.on('focusout', '[name="q"]', this._onFocusOut.bind(this));
      this.delegateElement.on('keydown', '[name="q"]', this._handleTab.bind(this));
      this.delegateElement.on('input', '[name="q"]', this._debounce(this._doSearch.bind(this), 250));
      this.delegateElement.on('click', '#search-product-type', this._productTypeChanged.bind(this));
      this.delegateElement.on('submit', '[type="submit"]', this._onFormSubmit.bind(this));

      var _this = this;
      document.addEventListener('click', function(e){
        var el = e.target;

        if(!el.classList.contains('search-bar__form') && !el.closest('.search-bar__form')) {
          _this.element.classList.remove('is-fixed');
          document.body.classList.remove('no-mobile-scroll');

          if (!_this.element.contains(e.relatedTarget)) {
            _this.searchPopoverEl.setAttribute('aria-hidden', 'true');
            _this.searchBarElement.classList.remove('is-expanded');
          }
        }
      });
    },
    _toggleMobileSearch: function() {
      if (this.isSearchOpen) {
        this.headerElement.classList.remove('header--search-expanded');
        this.element.classList.remove('is-visible');
      } else {
        this.headerElement.classList.add('header--search-expanded');
        this.element.classList.add('is-visible');
      }

      this.isSearchOpen = !this.isSearchOpen;
    },
    _onInputFocus: function() {
      this.element.classList.add('is-fixed');

      document.body.classList.add('no-mobile-scroll');

//       if (this.inputElement.value === '') {

//         this.searchPopoverEl.setAttribute('aria-hidden', 'true');
//       } else {


        this.searchPopoverEl.setAttribute('aria-hidden', 'false');
        this.inputElement.classList.add('is-filled');
        this.searchBarElement.classList.add('is-expanded');
//       }

    },
    _onFocusOut: function(event) {
      // On phone, nothing happens on focus out


      this.element.classList.remove('is-fixed');
      document.body.classList.remove('no-mobile-scroll');

      // event.relatedTarget allows to get the new element that get focus. If it's outside the div that contains the search, we close it
      if (!this.element.contains(event.relatedTarget)) {


        this.searchPopoverEl.setAttribute('aria-hidden', 'true');

        this.searchBarElement.classList.remove('is-expanded');
      }
    },
    _handleTab: function(event) {
      if (event.keyCode !== 9) {
        return;
      }

      // Try to get the first link into the results to give focus to this element
      var firstFocusableElement = this.searchResultsElement.querySelector('a');

      if (firstFocusableElement) {
        firstFocusableElement.focus();
        event.preventDefault();
      }
    },
    _doSearch: function() {

      var _this33 = this;

      // Unfortunately, fetch does not support as of today cancelling a request. As a consequence what we do is that we manually
      // keep track of sent requests, and only use the results of the last one
      var currentInput = this.inputElement.value;
      this.lastInputValue = currentInput;

      if (currentInput === '') {
        _this33.searchPopoverEl.classList.remove('added_results');
        _this33.searchBarElement.querySelector('.search-bar__results-inner').innerHTML = '';
      } else {

        this.searchPopoverEl.setAttribute('aria-hidden', 'false');
//         this.searchBarElement.classList.add('is-expanded', 'is-loading');
        var queryOptions = { method: 'GET', credentials: 'same-origin' },
            productQuery = '' + (this.productTypeFilter !== '' ? 'product_type:' + this.productTypeFilter + ' AND ' : '') + this.lastInputValue + '*',
            queries = [fetch(window.routes.searchUrl + '?view=ajax&q=' + productQuery + '&type=product', queryOptions)];

        if (window.theme.searchMode !== 'product') {
          queries.push(fetch(window.routes.searchUrl + '?view=ajax&q=' + encodeURIComponent(this.lastInputValue) + '*&type=' + window.theme.searchMode.replace('product,', ''), queryOptions));
        }

        Promise.all(queries).then(function (responses) {

          // If we receive the result for a query that is not the last one, we simply do not process the result
          if (_this33.lastInputValue !== currentInput) {
            return;
          }

          Promise.all(responses.map(function (response) {
            return response.text();
          })).then(function (contents) {

//             _this33.searchBarElement.classList.remove('is-loading');
		var contents_length = contents.join('').trim().length;
            var searchContent = document.createElement('div');
            searchContent.innerHTML = contents.join('').trim();

            // If there is a "view all" button, we move it at the end of the results
            var viewAll = searchContent.querySelector('.search-bar__view-all-button-wrapper');
            if (viewAll) {
              searchContent.insertAdjacentElement('beforeend', viewAll);
            }
            _this33.searchBarElement.querySelector('.search-bar__results-inner').innerHTML = searchContent.innerHTML;

            if(contents_length) {
              _this33.searchPopoverEl.classList.add('added_results');
            } else {
              _this33.searchPopoverEl.classList.remove('added_results');
            }

          });
        });
      }
    },
    _productTypeChanged: function(event, target) {

      this.productTypeFilter = target.getAttribute('data-search-type');
      if(this.productTypeFilter == 'All Categories') {
		this.productTypeFilter = '';
      }

      if (this.inputElement.value !== '') {
        this._doSearch();
      }
    },
    _onFormSubmit: function(event) {
      if (this.inputElement.value === '') {
        event.preventDefault(); // Do not submit if no value
      } else {
        // To prevent for the value to temporarily shows the "*", we clone the input as a hidden field
        var cloneNode = this.inputElement.cloneNode();
        cloneNode.setAttribute('type', 'hidden');
        cloneNode.value = '' + (this.productTypeFilter !== '' ? 'product_type:' + this.productTypeFilter + ' AND ' : '') + this.inputElement.value + '*';

        // We remove the "q" attribute on existing node so it's not submitted
        this.inputElement.removeAttribute('name');

        // And we insert it into the DOM
        this.inputElement.insertAdjacentElement('afterend', cloneNode);
      }
    },
    _debounce(fn, delay) {

      var _this34 = this;

      var timer = null;

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        clearTimeout(timer);

        timer = setTimeout(function () {
          fn.apply(_this34, args);
        }, delay);
      };
    }
  });

  return SearchBar;
})();


theme.Shop_the_Look = (function() {
  function Shop_the_Look(container) {


    var shop_the_look_product_carousel =  container.querySelector('.shop_the_look_product_carousel');
    if(shop_the_look_product_carousel) {
    var options = JSON.parse(shop_the_look_product_carousel.getAttribute('data-flickity_options'));
    var shop_the_look_productSize = shop_the_look_product_carousel.querySelectorAll('.shop_the_look_product').length;
    if(shop_the_look_productSize > 1 ) {
      var flickityInstance = new Flickity(shop_the_look_product_carousel, options);
      flickityInstance.on('select', function(index) {

        if(shop_the_look_product_carousel.classList.contains('is-active')) {
          var product_dot =  container.querySelector('.shop_the_look_dot[data-index="'+index+'"]');
          var prevProduct_dot = container.querySelector('.shop_the_look_dot.is-active');
          if(prevProduct_dot) {
            prevProduct_dot.classList.remove('is-active');
          }
          if(product_dot) {
            product_dot.classList.add('is-active');
          }
        }

      });
    }
    }

	var shop_the_look_dots =  container.querySelectorAll('.shop_the_look_dot');
    if(shop_the_look_dots.length) {
      shop_the_look_dots.forEach(function (shop_the_look_dot,index) {
        shop_the_look_dot.addEventListener('click',function(e) {
          e.preventDefault();
          var container = this.closest('.shop-the-look-section');

          var isActive = this.classList.contains('is-active');
          var _thisProductBlockId = this.getAttribute('data-block-id');
          var shop_the_look_product_carousel = container.querySelector('.shop_the_look_product_carousel');
          if(_thisProductBlockId) {
            var _thisProductBlock = container.querySelector('#'+_thisProductBlockId);
          }

          if(isActive) {
            this.classList.remove('is-active');
            shop_the_look_product_carousel.classList.remove('is-active');
            container.classList.remove('active_dot');
          } else {
            var prevActiveDot = container.querySelector('.shop_the_look_dot.is-active');

            if(prevActiveDot) {
              prevActiveDot.classList.remove('is-active');
            }

            this.classList.add('is-active');
            shop_the_look_product_carousel.classList.add('is-active');
            container.classList.add('active_dot');
            if(flickityInstance) {
              var activeDotIndex = this.getAttribute('data-index') * 1;
            flickityInstance.selectCell(activeDotIndex);
            }





          }



        });
      });
    }


    var formsArr = container.querySelectorAll('[action="/cart/add"]');
    if(formsArr.length) {
      formsArr.forEach(function(form,index) {
        theme.AddItemToCart(form);

      });
    }




  };
  return Shop_the_Look;
})();

theme.HomepageVideo = (function() {
  function HomepageVideo(container) {

    var play_video_btns = container.querySelectorAll('.play_video_btn');
    if(play_video_btns.length) {
      play_video_btns.forEach(function(btn,index) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          /*var pswpElement = document.querySelectorAll('.pswp')[0];
          var videoWrapperEl = this.closest('.VideoWrapper');
          var videoContentEl = videoWrapperEl.querySelector('.VideoModalContent');
          var items = [
            {
              html: videoContentEl.innerHTML
            }
          ];
          var options = {
            index: 0
          };
          var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
          gallery.init();

          var galleryContentEl = gallery.template.querySelector('.pswp__zoom-wrap iframe');
          if(galleryContentEl) {
           	var videoSrc =  galleryContentEl.getAttribute('src');
			      var newvideoSrc = videoSrc = videoSrc.replace('autoplay=0','autoplay=1');
            galleryContentEl.setAttribute('src',newvideoSrc);
          } else {
            galleryContentEl = gallery.template.querySelector('.pswp__zoom-wrap video');
            galleryContentEl.setAttribute('autoplay','');
            galleryContentEl.setAttribute('playsinline','');
          }

          gallery.listen('close', function() {
            var galleryContentEl = gallery.template.querySelector('.pswp__zoom-wrap iframe');
            if(galleryContentEl) {
              galleryContentEl.remove();
            } else {
              galleryContentEl = gallery.template.querySelector('.pswp__zoom-wrap video');
              galleryContentEl.remove();
            }
          });
          */
          var videoWrapperEl = this.closest('.VideoWrapper');
          var videoContentEl = videoWrapperEl.querySelector('.VideoModalContent');

          var galleryContentEl = videoContentEl.querySelector('iframe');
          var videoSrc =  galleryContentEl.getAttribute('src') || galleryContentEl.getAttribute('data-src');
			    var newvideoSrc = videoSrc = videoSrc.replace('autoplay=0','autoplay=1');
          galleryContentEl.setAttribute('src',newvideoSrc);
          videoContentEl.classList.remove('hide');

        });
      });
    }

      var tabs_nav = container.querySelector('.index-tabs_nav');

     if(tabs_nav) {
       tabs_nav.querySelectorAll('.index-tabs_nav--item').forEach(function (item,index) {
         item.addEventListener('click', function(e) {
           e.preventDefault();

           var activeItem =  tabs_nav.querySelector('.index-tabs_nav--item.active');
           var href_tab = this.getAttribute('data-href');
           var content_block  = document.querySelector('#'+href_tab);

           if(activeItem) {
             activeItem.classList.remove('active');
             var active_content_block = document.querySelector('#'+activeItem.getAttribute('data-href'));
             if(active_content_block) {
               active_content_block.classList.remove('active');

               var isVideoTag = active_content_block.querySelector('video');
               var isIframeVideo = active_content_block.querySelector('iframe');

               if(isIframeVideo) {
                 var videoSrc =  isIframeVideo.getAttribute('src');
                 var newvideoSrc = videoSrc = videoSrc.replace('autoplay=1','autoplay=0');
                 isIframeVideo.setAttribute('src',newvideoSrc);
               }
               if(isVideoTag) {
                 isVideoTag.removeAttribute('autoplay');
                 isVideoTag.removeAttribute('playsinline');
               }

             }
           }


           this.classList.add('active');
           if(content_block) {
             content_block.classList.add('active');
           }
         });
       });
    }
  };
  return HomepageVideo;
})();



document.addEventListener('DOMContentLoaded', function() {
  var sections = new theme.Sections();

  sections.register('video', theme.HomepageVideo);
  sections.register('shop-the-look', theme.Shop_the_Look);
  sections.register('search-template', theme.MainSearchPage);
  sections.register('mosaic', theme.Mosaic);
  sections.register('timeline', theme.Timeline);
  sections.register('featured-blog', theme.FeaturedBlog);
  sections.register('blog-page', theme.BlogPage);
  sections.register('article-page', theme.ArticlePage);
  sections.register('collection-list', theme.CollectionListSection);
  sections.register('featured-products', theme.FeaturedProducts);
  sections.register('index-countdown-timer', theme.CountdownTimer);
  sections.register('page-accordion', theme.PageAccordion);
  sections.register('index-accordion', theme.HomepageAccordion);
  sections.register('logo-bar', theme.LogoBar);
  sections.register('announcement-bar', theme.AnnouncementBar);
  sections.register('cart-template', theme.Cart);
  sections.register('product', theme.Product);

  sections.register('product-template', theme.Product);
  sections.register('header-section', theme.HeaderSection);
  sections.register('slideshow-section', theme.FlickitySlideshowSection);
  sections.register('store-availability', theme.StoreAvailability);
  sections.register('quotes', theme.Quotes);
  sections.register('product-recommendations', theme.ProductRecommendations);
  sections.register('advanced-search', theme.AdvancedSearch);
  sections.register('footer-section', theme.FooterSection);


  var sort_dropdown_open = document.querySelectorAll('.filters-toolbar__label');
  if(sort_dropdown_open){
    sort_dropdown_open.forEach(function(elem){
      elem.onclick = function(event){
        elem.parentElement.querySelector('.filters-toolbar__input-wrapper').classList.toggle('active');
        elem.classList.toggle('active');
      }
    });

    document.querySelectorAll('.sort-item').forEach(function(elem){
      elem.onclick = function(event){
        if(!elem.classList.contains('selected')){
          elem.closest('.filters-toolbar__input-wrapper').classList.remove('active');
          var sort_value = event.target.getAttribute('data-value');
          document.getElementById("SortBy").value = sort_value;
          let changeEvent = new Event('change');
          document.getElementById("SortBy").dispatchEvent(changeEvent);
        }
      }
    });

    document.addEventListener('click', event => {
      let ele = event.target

      // close filter
      if(!ele.closest('.toolbar_sort_by-block')) {
        const isActiveFilterWrapper = document.querySelector('.filters-toolbar__input-wrapper.active')
        const isActiveFilterToolbar = document.querySelector('.filters-toolbar__label.active')
        if(isActiveFilterWrapper) isActiveFilterWrapper.classList.remove('active')
        if(isActiveFilterToolbar) isActiveFilterToolbar.classList.remove('active')
      }
    })
  }

  if(document.querySelector('.CollectionGrid')){
    label_present = false;
    document.querySelectorAll('.product-item-block').forEach(function(elem){
      if(elem.querySelectorAll('.new-label').length > 0) label_present = true;
    });
    if(label_present) document.querySelector('.CollectionGrid').classList.add('label-present');
  }

  var quick_viewModal = document.querySelector('#modal-quick-view');
  if(quick_viewModal) {
    document.addEventListener('click', function(e){
      var target = e.target;

      if(target.classList.contains('open-quick-view--btn') || target.closest('.open-quick-view--btn')) {
        if(!target.classList.contains('open-quick-view--btn')) {
          target = target.closest('.open-quick-view--btn');
        }

        e.preventDefault();
        var productUrl = new URL("".concat(window.location.origin).concat(target.getAttribute('data-product-url'))); // If we are on mobile or tablet, we redirect to product page directly
        var modal = document.getElementById(target.getAttribute('aria-controls'));
        modal.classList.add('is-loading');
        productUrl.searchParams.set('view', 'quick-view');
        fetch(productUrl.href, {
          credentials: 'same-origin',
          method: 'GET'
        }).then(function (response) {
          response.text().then(function (content) {
            modal.querySelector('.modal__inner').innerHTML = content;
            modal.classList.remove('is-loading');

            var modalProductSection = new theme.Product(modal.querySelector('[data-section-type="product"]')); // We set a listener so we can cleanup on close
            if(window.Shopify.PaymentButton) {
              if(window.Shopify.PaymentButton.init) {
              window.Shopify.PaymentButton.init();
            }
          }
            document.querySelector('body').classList.add('show_overlay');
            modal.setAttribute('aria-hidden','false');

          });
        });
      }
    });
    document.addEventListener('click', function(e){
      var el = e.target;

      if(el.classList.contains('close-quick-view') || el.closest('.close-quick-view')) {
        e.preventDefault();
        var modal = el.closest('.modal');
        modal.setAttribute('aria-hidden','true');
        modal.querySelector('.modal__inner').innerHTML = '';
        document.querySelector('body').classList.remove('show_overlay');
      }
    });
  }



  theme.customerTemplates.init();

  // Theme-specific selectors to make tables scrollable
  var tableSelectors = '.rte table,' + '.custom__item-inner--html table';

  slate.rte.wrapTable({
    tables: document.querySelectorAll(tableSelectors),
    tableWrapperClass: 'scrollable-wrapper'
  });

  // Theme-specific selectors to make iframes responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"],' +
    '.custom__item-inner--html iframe[src*="youtube.com/embed"],' +
    '.custom__item-inner--html iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    iframes: document.querySelectorAll(iframeSelectors),
    iframeWrapperClass: 'video-wrapper'
  });

  // Common a11y fixes
  slate.a11y.pageLinkFocus(
    document.getElementById(window.location.hash.substr(1))
  );

  var inPageLink = document.querySelector('.in-page-link');
  if (inPageLink) {
    inPageLink.addEventListener('click', function(evt) {
      slate.a11y.pageLinkFocus(
        document.getElementById(evt.currentTarget.hash.substr(1))
      );
    });
  }

  document.querySelectorAll('a[href="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(evt) {
      evt.preventDefault();
    });
  });

  slate.a11y.accessibleLinks({
    messages: {
      newWindow: theme.strings.newWindow,
      external: theme.strings.external,
      newWindowExternal: theme.strings.newWindowExternal
    },
    links: document.querySelectorAll(
      'a[href]:not([aria-describedby]), .product-single__thumbnail'
    )
  });

  theme.FormStatus.init();

  document.addEventListener(
    'touchstart',
    function() {
      theme.Helpers.setTouch();
    },
    { once: true }
  );

  if (document.fonts) {
    document.fonts.ready.then(function() {
      window.performance.mark('pursuit:fonts_loaded');
    });
  }
  function setCookie(name,value,days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  function getCookie (name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  var cookie_popup = document.querySelector('.cookie_popup');
  if(cookie_popup) {
    var cookie_popup_wrapper = document.querySelector('.cookie_popup_wrapper');

    document.addEventListener('click', function(e){
      var el = e.target;

      if(el.classList.contains('modal_close_btn') || el.closest('.modal_close_btn')) {
        if(!el.classList.contains('modal_close_btn')) {
          el = el.closest('.modal_close_btn');
        }
        if(el.closest('.cookie_popup_wrapper')) {
          cookie_popup_wrapper.classList.remove('show');
          window.history.replaceState(null, null, window.location.pathname);
        }

      }
    });
    document.addEventListener('click', function(e){
      var el = e.target;
      if(el.classList.contains('accept_cookie_popup') || el.closest('.accept_cookie_popup')) {
        if(!el.classList.contains('accept_cookie_popup')) {
          el = el.closest('.accept_cookie_popup ');
        }
        document.cookie = 'accept_use_policy=true';
         cookie_popup_wrapper.classList.remove('show');
      }
    });

    var isShowCookiePopup = getCookie('accept_use_policy');
    if(!isShowCookiePopup) {
      if(window.location.href.indexOf("challenge") < 0){
        cookie_popup_wrapper.classList.add('show');
      }
    }
  }

  function otherFormMessage(formId) {


    var contact_forms = document.querySelectorAll('.contact-form');
    if(contact_forms.length) {
      contact_forms.forEach(function(item,index) {
        var itemId = item.id;

        if(formId != itemId) {
          var form_messageEl = item.querySelector('.form-message');
          if(form_messageEl) {
            form_messageEl.remove();
          } else {
            form_messageEl = item.querySelector('.input-error-message');
            if(form_messageEl) {
              form_messageEl.remove();
            }
          }

          var form_inputs = item.querySelectorAll('.input--error');
          if(form_inputs.length) {
            form_inputs.forEach(function(input,indexInput) {
              input.classList.remove('input--error');
            })
          }
        }
      });
    }

  }


  var entry_popup_wrapper = document.querySelector('.entry_popup_wrapper');
  if(entry_popup_wrapper) {
    var $container = entry_popup_wrapper.querySelector('.entry-modal');
    var delay = $container.getAttribute('data-delay')*1000,
        cookie = $container.getAttribute('data-cookie'),
        sumbitted_form = false;
    var pswpElement = document.querySelectorAll('.pswp')[0];

    var items = [
      {
        html: $container
      }
    ];
    var options = {
      index: 0,
      modal: false,
      mainClass: 'entry-modal_wrapper',
      zoomEl: false,
      shareEl: false,
      counterEl: false,
      arrowEl: false,
      fullscreenEl: false,
      closeOnScroll :false,
      closeOnVerticalDrag :false,
      clickToCloseNonZoomable :false,
      closeElClasses :' ',
      closeEl:false,
      isClickableElement: function(el) {
        return true;
      }
    };
    var entry_popup_gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);


    var form = $container.querySelector('form');
    var formId;
    if(form)  {

      formId = form.getAttribute('id');
      var submitCookieCustomerForm = function (event) {
        event.preventDefault();
        var cookieTime = cookie*1;
        setCookie('pop_confirm','pop_newsletter',cookieTime);
      }
      form.addEventListener('submit', submitCookieCustomerForm, false );
      form.removeEventListener('submit', submitCookieCustomerForm, false );
    }
    document.addEventListener('click', function(e){
      var el = e.target;

      if(el.classList.contains('modal_close_btn') || el.closest('.modal_close_btn')) {
        if(!el.classList.contains('modal_close_btn')) {
          el = el.closest('.modal_close_btn');
        }
        if(el.closest('.entry-modal_wrapper')) {
          document.querySelector('body').classList.remove('active_modal');
          entry_popup_gallery.close();
          window.setTimeout(function() {
            window.history.replaceState(null, null, window.location.pathname);
          },500)
        }

      }
    });

    if(getCookie('pop_confirm') != null && window.location.hash.indexOf(formId) >= 0 && (window.location.search == "?customer_posted=true" || window.location.hash == "#contact_form" || $container.querySelector("form .errors"))){
      var sumbitted_form = true;
    }


    if(window.location.href.indexOf("challenge") < 0){
      function show_modal(){
        entry_popup_gallery.init();
        document.querySelector('body').classList.add('active_modal');
        entry_popup_gallery.listen('close', function() {
          var cookieTime = cookie*1;
          setCookie('pop','modal',cookieTime);
          setCookie('pop_confirm',null);
          document.querySelector('body').classList.remove('active_modal');
        });
      }

      if (getCookie('pop') == null || cookie  == "use_test_popup" || sumbitted_form) {
        window.setTimeout(show_modal, delay); // delay before it calls the modal function
        if (cookie  != "use_test_popup" || !sumbitted_form) {
          var cookieTime = cookie*1;
          setCookie('pop','modal',cookieTime);
        }
        if(sumbitted_form){
          setCookie('pop_confirm',null);

          if(!$container.querySelector("form .errors")){
            $container.querySelector('form').classList.add('successForm');
          }
          window.setTimeout(show_modal, delay);
          otherFormMessage(formId);

        }

      } else if(window.location.hash.indexOf(formId) >= 0 && window.location.search == "?contact%5Btags%5D=newsletter&form_type=customer" && getCookie('pop') == 'modal' && sumbitted_form == false) {
        window.setTimeout(show_modal, delay); // delay before it calls the modal function
        otherFormMessage(formId);
      }

    }
  }


  if(window.location.href.indexOf('/?contact%5Btags%5D=newsletter') >= 0) {

    var formId = window.location.href.split("form_type=customer")[1];
    if(formId.length) {
      var formEl = document.querySelector(formId);
      if(formEl) {
        otherFormMessage(formEl.id);
      }
    }
  }


  function resizeProductsCarousel() {
    if(document.querySelectorAll('.index-tabs-content_block__slider.flickity-enabled').length) {
      document.querySelectorAll('.index-tabs-content_block__slider.flickity-enabled').forEach(function(item,index,) {
        var flkty = Flickity.data(item);
        var hadRenderedClass = false;
        if(item.classList.contains('rendered')) {
          hadRenderedClass = true;
        }
        if(hadRenderedClass) {
          item.classList.remove('rendered');
        }
        flkty.resize();
        if(hadRenderedClass) {
          item.classList.add('rendered');
        }
      });
    }
  }
  var reLoadProductsCarousel = theme.Helpers.debounce(function(event) {
    resizeProductsCarousel();
  }, 100);

  window.addEventListener("resize", reLoadProductsCarousel);

function checkSectionVisibility() {

  var fadeInAnimationElems = document.querySelectorAll('.fade-in-animation:not(.fadeIn-animation)');
  var zoomFadeAnimationElems = document.querySelectorAll('.zoom-fade-animation:not(.zoomFade-animation)');

  var removeEvent = false;

  if(fadeInAnimationElems.length) {
    fadeInAnimationElems.forEach(function(block,index) {
      var  containerPosition = block.getBoundingClientRect();
      if(containerPosition.top + 200 < window.innerHeight) {
        block.classList.add('fadeIn-animation');
      }
    });
  }
  if(zoomFadeAnimationElems.length) {
    zoomFadeAnimationElems.forEach(function(block,index) {
      var  containerPosition = block.getBoundingClientRect();
      if(containerPosition.top + 200 < window.innerHeight) {
        block.classList.add('zoomFade-animation');
      }
    });
  }


  if(fadeInAnimationElems.length == 0 && zoomFadeAnimationElems.length == 0) {
    removeEvent = true;
  }
  if(removeEvent) {
    window.removeEventListener('scroll', checkSectionVisibility);
  }

}
checkSectionVisibility();
window.addEventListener('scroll', checkSectionVisibility);

document.querySelectorAll('.site-footer__item-inner').forEach(function(element){
  if(element.querySelector('.h5')){
    element.querySelector('.h5').onclick = function(){
      if(window.innerWidth <= 1239){
        element.classList.toggle('active');
      }
    };
  }
});

var custom_tabs = document.querySelectorAll('.custom_menu_tab_title');
new SV.HoverIntent(custom_tabs, {
  onEnter: function(element) {
    var main_elem = element.parentElement.parentElement;
    main_elem.querySelectorAll('.custom_menu_tab_content').forEach(function(content){
      content.classList.remove('active');
    });
    main_elem.querySelectorAll('.custom_menu_tab_title').forEach(function(tab){
      tab.classList.remove('active');
    });
    var tab_title = element.getAttribute('data-title');
    main_elem.querySelector('.custom_menu_tab_content[data-title="'+tab_title+'"]').classList.add('active');
    element.classList.add('active');
  },
  onExit: function(targetItem) {

  },
  exitDelay: 300,
  interval: 100,
  sensitivity: 7,
});

/*document.querySelectorAll('.custom_menu_tab_title').forEach(function(element){
  element.onclick = function(){
    var main_elem = element.parentElement.parentElement;
    main_elem.querySelectorAll('.custom_menu_tab_content').forEach(function(content){
      content.classList.remove('active');
    });
    main_elem.querySelectorAll('.custom_menu_tab_title').forEach(function(tab){
      tab.classList.remove('active');
    });
    var tab_title = element.getAttribute('data-title');
    main_elem.querySelector('.custom_menu_tab_content[data-title="'+tab_title+'"]').classList.add('active');
    element.classList.add('active');
  };
});*/

var custom_menu_links = document.querySelectorAll('.custom_menu_left_side_hover_item.custom_menu_item_dropdown_title');
  custom_menu_links.forEach(function(targetItem){
    targetItem.onclick = function(){
      targetItem.closest('.mega_menu_columns__wrapper').querySelectorAll('.custom_menu_left_side_hover_item').forEach(function(block){
        if(block.classList.contains('active')) block.classList.remove('active');
      });
      targetItem.classList.add('active');
      var block_title = targetItem.getAttribute('data-title');
      targetItem.closest('.mega_menu_columns__wrapper').querySelectorAll('.custom_menu_block_content').forEach(function(block){
        if(block.classList.contains('active')) block.classList.remove('active');
      });
      targetItem.closest('.mega_menu_columns__wrapper').querySelector('.custom_menu_block_content[data-title="'+block_title+'"]').classList.add('active');
      if(targetItem.closest('.custom_menu_left_side_item_wrap').querySelector('.custom_menu_item_dropdown.open')) targetItem.closest('.custom_menu_left_side_item_wrap').querySelector('.custom_menu_item_dropdown.open').classList.remove('open');
    }
  });

  var mega_menu_titles = document.querySelectorAll('.custom_menu_item_dropdown_title:not(.custom_menu_left_side_hover_item)');
  mega_menu_titles.forEach(function(element){
    element.onclick = function(){
      if(element.closest('.custom_menu_left_side_item_wrap').querySelector('.custom_menu_item_dropdown.open')) element.closest('.custom_menu_left_side_item_wrap').querySelector('.custom_menu_item_dropdown.open').classList.remove('open');
      element.parentElement.classList.add('open');
      element.parentElement.querySelectorAll('.custom_menu_left_side_hover_item')[0].click();
    };
  });


    function compareTableViewBtn(){
        if(document.querySelectorAll('.view_features_link').length > 0){
        document.querySelectorAll('.view_features_link').forEach(function(elem){
          elem.onclick = function(){
          var parentElem = elem.parentElement;
          parentElem.querySelector('.comparison_table').classList.toggle('show-all');
          if(elem.classList.contains('showing-all')){
            elem.querySelector('span').innerText = elem.getAttribute('data-view-more-text');
          }
          else{
            elem.querySelector('span').innerText = elem.getAttribute('data-view-less-text');
          }
          elem.classList.toggle('showing-all');
          };
        });
        }
    }

    function initPdpCompareTable() {
      if(document.querySelectorAll('.compare_table_product_content').length > 0){
        function alignCompareRow(){
          document.querySelectorAll('.pdp-comparison-table').forEach(function(elem){
            elem.style.setProperty('--product-info-height', 'auto');
            var contentHeight = 0;
            elem.querySelectorAll('.compare_table_product_title').forEach(function(content){
              if(content.offsetHeight > contentHeight){
                contentHeight = content.offsetHeight;
              }
            });
            elem.style.setProperty('--product-info-height', contentHeight + 'px');
          });
        }

        alignCompareRow();
        window.onresize = function(){ alignCompareRow(); };
      }

      if(document.querySelector('.modal-trigger')){
        function adjustTitleRowFlickity(popup_elem){
          var title_row_elem = popup_elem.querySelector('.comparison_feature_row.comparison_title_row');
          if(title_row_elem.querySelector('.compare_column_slider')){
            var column_parent = title_row_elem.querySelector('.compare_column_slider');
            title_row_elem.style.setProperty('--row-height', 'auto');
            var row_height = 0;
            column_parent.querySelectorAll('.compare_column').forEach(function(elem){
              if(row_height < elem.clientHeight){
                row_height = elem.clientHeight;
              }
            });
            title_row_elem.style.setProperty('--row-height', row_height+'px');

            var flickityInstance = Flickity.data(column_parent);
            flickityInstance.resize();
          }
        }

        var modalTriggers = document.querySelectorAll('.modal-trigger');
        modalTriggers.forEach(function(trigger) {
          trigger.addEventListener('click', function(e) {

            document.querySelector('.pdp-popup-wrapper .popup-content').innerHTML = document.querySelector(e.currentTarget.getAttribute('href')).innerHTML;
            document.querySelector('.pdp-popup-wrapper').classList.add('shown');
            document.querySelector('body').classList.add('overflow-hidden');

            compareTableViewBtn();

            if(document.querySelectorAll('.compare_table_product_content').length > 0){
              alignCompareRow();
              window.onresize = function(){ alignCompareRow(); };
            }
            if(document.querySelector('.pdp-popup-wrapper .popup-close')){
              document.querySelector('.pdp-popup-wrapper .popup-close').onclick = function(e){
                document.querySelector('.pdp-popup-wrapper').classList.remove('shown');
                document.querySelector('.pdp-popup-wrapper .popup-content').innerHTML = '';
                document.querySelector('body').classList.remove('overflow-hidden');
              }
            }

            var popup_elem = document.querySelector('.pdp-popup-wrapper .pdp-compare-table-container');
            var tabelTop = 0;
            document.querySelector('.pdp-popup-wrapper .pdp-compare-table-container').onscroll = function(){
              var title_row_height = popup_elem.querySelector('.comparison_feature_row.comparison_title_row').clientHeight;
              if(document.querySelector('.pdp-popup-wrapper .pdp-compare-table-container').scrollTop > title_row_height){
                if(popup_elem.querySelector('.comparison_feature_row.comparison_title_row').classList.contains('sticky') == false){
                  popup_elem.querySelector('.comparison_feature_row.comparison_title_row').classList.add('sticky');
                  if(window.innerWidth > 749) adjustTitleRowFlickity(popup_elem);
                }
              }
              else{
                var wasSticky = false;
                if(popup_elem.querySelector('.comparison_feature_row.comparison_title_row').classList.contains('sticky')){ wasSticky = true; }
                popup_elem.querySelector('.comparison_feature_row.comparison_title_row').classList.remove('sticky');
                if(wasSticky && window.innerWidth > 749) adjustTitleRowFlickity(popup_elem);
              }
            }

            if(document.querySelectorAll('.pdp-popup-wrapper .compare_column_slider').length > 0){
              var asNav = false;
                document.querySelectorAll('.pdp-popup-wrapper .compare_column_slider').forEach(function(elem){
                  var row_height = elem.closest('.comparison_feature_row').querySelector('.compare_feature_title').clientHeight;
                  if(row_height < elem.clientHeight){
                      row_height = elem.clientHeight;
                  }
                  elem.closest('.comparison_feature_row').style.setProperty('--row-height', row_height+'px');

                  if(elem.closest('.comparison_content_row')){
                    new Flickity(elem, {
                      cellAlign: "left",
                      wrapAround: false,
                      pageDots: false,
                      contain: true,
                      groupCells: true,
                      prevNextButtons: true,
                      selectedAttraction: 1,
                      friction: 1,
                      watchCSS: true,
                      asNavFor: popup_elem.querySelector('.compare_column_slider_title')
                    });
                  }
                  else{
                    new Flickity(elem, {
                      cellAlign: "left",
                      wrapAround: false,
                      pageDots: false,
                      contain: true,
                      groupCells: true,
                      prevNextButtons: true,
                      selectedAttraction: 1,
                      friction: 1,
                      watchCSS: true
                    });
                  }
                });
            }
          });
        });
      }
    }
    initPdpCompareTable()



});

function menuItemEvent(targetItem) {
  if(targetItem.closest('.custom_menu_left_side').querySelectorAll('.custom_menu_left_side_item.active').length > 0){
    targetItem.closest('.custom_menu_left_side').querySelectorAll('.custom_menu_left_side_item.active').forEach(function(element){
      element.classList.remove('active');
    });
  }
  targetItem.classList.add('active');
  var block_title = targetItem.getAttribute('data-title');
  if(targetItem.closest('.mega_menu_columns__wrapper').querySelector('.custom_menu_block_content.active')){
    targetItem.closest('.mega_menu_columns__wrapper').querySelector('.custom_menu_block_content.active').classList.remove('active');
  }
  targetItem.closest('.mega_menu_columns__wrapper').querySelector('.custom_menu_block_content[data-title="'+block_title+'"]').classList.add('active');
}

var custom_menu_links = document.querySelectorAll('.custom_menu_left_side_hover_item:not(.custom_menu_item_dropdown_title)');
custom_menu_links.forEach(function(targetItem){
  targetItem.onclick = function(){
    menuItemEvent(targetItem);
  }
  targetItem.onmouseover = function(){
    menuItemEvent(targetItem);
  }
});

// Use in PDP "What's In The Box Section"
if(document.querySelector('[data-mobile-slider]')){
  var doit;
  function inTheBoxMobileSlider(){
    var inTheBoxMobileSlider = new Flickity( '[data-mobile-slider]', {
      cellAlign: 'left',
      prevNextButtons: false,
      contain: true,
      imagesLoaded: true
    })
  }
  if(window.innerWidth < 750) inTheBoxMobileSlider()
  window.onresize = function() {
      clearTimeout(doit);
      doit = setTimeout(function() {
        if(window.innerWidth < 750) inTheBoxMobileSlider();
      }, 100);
  };
}

function scrollIntoView(el, parentElement){
  var elParent = parentElement;
  const elLeft = el.offsetLeft;
  const elParentLeft = elParent.offsetLeft;

  // check if element not in view
  if (elLeft >= elParentLeft + elParent.scrollLeft) {
    elParent.scrollLeft = elLeft - elParentLeft - (elParent.offsetWidth / 2) + (el.offsetWidth / 2);
  }
}

if(document.querySelector('.collection-top-menu .active')){
  var el = document.querySelector('.collection-top-menu .active');
  var elParent = el.parentNode.parentNode;
  scrollIntoView(el, elParent);
}

if(document.querySelector('.product-series-slider')){
var flickityInstance = new Flickity('.product-series-slider', {
  cellAlign: "left",
  pageDots: false,
  contain: true,
  groupCells: true,
  watchCSS: true
});
if(document.querySelector('.product-series-item.selected') && window.innerWidth < 750){
  var el = document.querySelector('.product-series-item.selected');
  var elParent = el.parentNode;
  scrollIntoView(el, elParent);
}
else{
  var nodes = Array.prototype.slice.call(document.querySelector('.product-series-slider .flickity-slider').children),
      liRef = document.querySelector('.product-series-slider .selected');

  flickityInstance.selectCell(nodes.indexOf( liRef ));
}
}

var links = document.links;
for (var i = 0, linksLength = links.length; i < linksLength; i++) {
  if (links[i].hostname != window.location.hostname) {
    links[i].target = '_blank';
  }
}

// widget-zendesk
const customIconZendesk = document.querySelector('[data-icon-zendesk]')
if(customIconZendesk){
  setTimeout(() => { customIconZendesk.classList.remove('hide') }, 2000);
  customIconZendesk.addEventListener('click', function() {
      const zendeskIcon = this
      if(zendeskIcon.classList.contains('active')) {
          zendeskIcon.classList.remove('active');
          zE('messenger', 'close');
      } else {
          zendeskIcon.classList.add('active');
          zE('messenger', 'open');
      }
  });
  zE('messenger:on', 'open', function() {
    setTimeout(() => { document.querySelector('iframe[title="Messaging window"]').parentElement.classList.add('zendesk-message-box-overlap') }, 250);
  });
  zE('messenger:on', 'close', function() {
      customIconZendesk.classList.remove('active');
  });
}

var bought_together_widget = setInterval(function(){
    if(document.querySelectorAll('.cbb-frequently-bought-selector-input').length > 0){
      document.querySelectorAll('.cbb-frequently-bought-selector-input').forEach(function(elem){
        elem.onchange = function(){
          var none_selected = true;
          var counter = 0;
          var only_first_selected = false;
          document.querySelectorAll('.cbb-frequently-bought-selector-input').forEach(function(elem_t){
            if(counter == 0 && elem_t.checked) only_first_selected = true;
            if(counter > 0 && elem_t.checked) only_first_selected = false;

            counter = counter + parseInt(1);
            if(elem_t.checked){ none_selected = false; }
          });
          if(none_selected) document.querySelector('.cbb-frequently-bought-recommendations-container').classList.add('none-selected');
          else document.querySelector('.cbb-frequently-bought-recommendations-container').classList.remove('none-selected');

          if(only_first_selected) document.querySelector('.cbb-frequently-bought-recommendations-container').classList.add('first-selected');
          else document.querySelector('.cbb-frequently-bought-recommendations-container').classList.remove('first-selected');
        }
      });
      clearInterval(bought_together_widget);
    }
}, 3000);

if(document.querySelector('.where-to-buy-container .show-more-btn')){
  document.querySelector('.where-to-buy-container .show-more-btn').onclick = function(){
    var clickElem = document.querySelector('.where-to-buy-container .show-more-btn');
    document.querySelectorAll('.country-block').forEach(function(elem){
      elem.classList.toggle('active');
    })
    clickElem.classList.toggle('active');
    if(clickElem.classList.contains('active')) clickElem.querySelector('span').innerText = 'SHOW LESS';
    else clickElem.querySelector('span').innerText = 'SHOW MORE';
  };
}

var widgetATC = setInterval(function(){
  if(document.querySelector('.cbb-frequently-bought-add-button')){
    document.querySelector('.cbb-frequently-bought-add-button').addEventListener("click", function(e){
      setTimeout(function(){
        ptengine.track("add_cart");
        theme.Cart.prototype._onProductAdded(); }
      , 1000);
    }, false);
    clearInterval(widgetATC);
    theme.TapAddToCart(document.querySelector('.cbb-frequently-bought-add-button'));
  }
}, 1000);

document.addEventListener('Rk:Added_To_Cart', function(event) {
  theme.Cart.prototype._onProductAdded();
  window._rkUnloadPage('ajax_cart');
  window._rkLoadPage('ajax_cart');
});

if(document.querySelectorAll('.pdp-slideshow-item').length > 0){
  function pdp_slideshow(element){
    var flickityInstance = new Flickity(element, {
      cellAlign: "center",
      contain: true,
      wrapAround: true
    });

    var target_elem = element.parentElement;
    target_elem.querySelector('.slider-button-prev').onclick = function(){
      target_elem.querySelector('.flickity-button.previous').click();
    }

    target_elem.querySelector('.slider-button-next').onclick = function(){
      target_elem.querySelector('.flickity-button.next').click();
    }
  }

  document.querySelectorAll('.pdp-slideshow-item.active').forEach(function(elem){
    var flickity_elem = elem.querySelector('.pdp-slideshow-block-images');
    if(flickity_elem.querySelectorAll('.pdp-slideshow-block-image-wrapper').length > 1){
      pdp_slideshow(flickity_elem);
    }
  });

  document.querySelectorAll('.pdp-slideshow-tab-title').forEach(function(elem){
    elem.onclick = function(){
      var parent_elem = elem.closest('.pdp-slideshow-container-inner');
      parent_elem.querySelector('.pdp-slideshow-tab-title.active').classList.remove('active');
      elem.classList.add('active');
      var target_block = elem.getAttribute('data-target-block');
      parent_elem.querySelector('.pdp-slideshow-item.active').classList.remove('active');
      parent_elem.querySelector(".pdp-slideshow-item[data-block='"+target_block+"']").classList.add('active');
      parent_elem.querySelector('.pdp-slideshow-bottom-item.active').classList.remove('active');
      parent_elem.querySelector(".pdp-slideshow-bottom-item[data-block='"+target_block+"']").classList.add('active');
      var elLeft = elem.offsetLeft;
      var elParent = elem.parentElement;
      var elParentLeft = elParent.offsetLeft;
      var window_width = window.innerWidth / 2;
      // check if element not in view
      if (elLeft > window_width) {
        elParent.parentElement.scrollLeft = elLeft - elParentLeft - window_width + (elem.offsetWidth / 2);
      }
      var flickity_elem = parent_elem.querySelector("[data-block='"+target_block+"']").querySelector('.pdp-slideshow-block-images');
      if(flickity_elem.querySelectorAll('.pdp-slideshow-block-image-wrapper').length > 1){
        pdp_slideshow(flickity_elem);
      }
    }
  });
}

if(document.querySelectorAll('.play-video').length > 0){
  document.querySelectorAll('.play-video').forEach(function(elem){
    elem.onclick = function(){
      var parentElem = elem.parentElement;
      if(elem.classList.contains('video-playing')){
        parentElem.querySelector('video').pause();
      }
      else{
        parentElem.querySelector('video').play();
      }
      elem.classList.toggle('video-playing');
    };
  });
}

if(document.querySelectorAll('.video-autoplay-true').length > 0){
  document.querySelectorAll('.video-autoplay-true').forEach(function(elem){
    elem.querySelector('video').play();
  });
}

if(document.querySelectorAll('.view_more_wrapper .view_more_btn').length > 0){
  document.querySelectorAll('.view_more_wrapper .view_more_btn').forEach(function(elem){
    elem.onclick = function(){
      var productsContainer = elem.parentElement.parentElement;
      productsContainer.classList.toggle('view-all');
      elem.parentElement.classList.toggle('active');
      if(elem.parentElement.classList.contains('active')){
        elem.parentElement.querySelector('span').innerText = elem.parentElement.querySelector('span').getAttribute('data-view-less');
      }
      else{
        elem.parentElement.querySelector('span').innerText = elem.parentElement.querySelector('span').getAttribute('data-view-more');
      }
    }
  });
}

if(document.querySelector('.star-page-tab-wrapper.flickity-enabled .sticky-row')){
  var flickityInstance = new Flickity('.star-page-tab-wrapper.flickity-enabled .sticky-row', {
    cellAlign: "center",
    pageDots: false,
    contain: true,
    groupCells: true,
    watchCSS: true
  });

  function adjustArrows(){
    if(document.querySelector('.star-page-tab-wrapper .flickity-button.previous').hasAttribute('disabled')){
      document.querySelector('.star-page-tab-wrapper .slider-button.previous').setAttribute('disabled','');
    }
    else{
      document.querySelector('.star-page-tab-wrapper .slider-button.previous').removeAttribute('disabled');
    }

    if(document.querySelector('.star-page-tab-wrapper .flickity-button.next').hasAttribute('disabled')){
      document.querySelector('.star-page-tab-wrapper .slider-button.next').setAttribute('disabled','');
    }
    else{
      document.querySelector('.star-page-tab-wrapper .slider-button.next').removeAttribute('disabled');
    }
  }

  if(window.innerWidth > 750) adjustArrows();

  document.querySelector('.star-page-tab-wrapper .slider-button.previous').onclick = function(){
    document.querySelector('.star-page-tab-wrapper .flickity-button.previous').click();
    adjustArrows();
  }

  document.querySelector('.star-page-tab-wrapper .slider-button.next').onclick = function(){
    document.querySelector('.star-page-tab-wrapper .flickity-button.next').click();
    adjustArrows();
  }
}

if(document.querySelector('.star-page-banner .slideshow_video')){
  var videoDivEl = document.querySelector('.star-page-banner .slideshow_video');
  if(videoDivEl) {
    theme.Video.init(videoDivEl);
    theme.Video.editorLoadVideo(videoDivEl.id);
  }
}

window.onload = function(){
  function alignProductTitleRow(){
    if(document.querySelectorAll('.star-page-product-double-v2-section').length > 0){
      document.querySelectorAll('.star-page-product-double-v2-section').forEach(function(element){
        var infoHeight = 0;
        var descHeight = 0;
        element.style.setProperty('--product-info-height', 'auto');
        element.style.setProperty('--product-desc-height', 'auto');
        element.querySelectorAll('.star_product_title').forEach(function(infoElement){
            if(infoElement.clientHeight > infoHeight) infoHeight = infoElement.clientHeight;
        });
        element.querySelectorAll('.star_product_desc').forEach(function(infoElement){
          if(infoElement.clientHeight > descHeight) descHeight = infoElement.clientHeight;
        });
        element.style.setProperty('--product-info-height', infoHeight + 'px');
        element.style.setProperty('--product-desc-height', descHeight + 'px');
      });
    }

    if(document.querySelectorAll('.star-page-product-double-v1-section').length > 0){
      document.querySelectorAll('.star-page-product-double-v1-section').forEach(function(element){
        var infoHeight = 0;
        var affirmHeight = 0;
        var priceHeight = 0;
        var optionsHeight = 0;
        element.style.setProperty('--product-info-height', 'auto');
        element.style.setProperty('--affirm-msg-height', 'auto');
        element.style.setProperty('--product-price-height', 'auto');
        element.querySelectorAll('.star-product-info').forEach(function(infoElement){
            if(infoElement.clientHeight > infoHeight) infoHeight = infoElement.clientHeight;
        });
        element.querySelectorAll('.star_product_price_wrap').forEach(function(infoElement){
            if(infoElement.clientHeight > priceHeight) priceHeight = infoElement.clientHeight;
        });

        if(element.querySelectorAll('.product_option_wrapper').length > 0){
          element.querySelectorAll('.product_option_wrapper').forEach(function(optionElement){
            if(optionElement.clientHeight > optionsHeight) optionsHeight = optionElement.clientHeight;
          });
        }

        setTimeout(function(){
          if(element.querySelectorAll('.affirm_message').length > 0){
            element.querySelectorAll('.affirm_message').forEach(function(infoElement){
              if(infoElement.clientHeight > affirmHeight) affirmHeight = infoElement.clientHeight;
            });

            if(affirmHeight > 0) element.style.setProperty('--affirm-msg-height', affirmHeight + 'px');
          }
        }, 1000);

        element.style.setProperty('--product-info-height', infoHeight + 'px');
        element.style.setProperty('--product-price-height', priceHeight + 'px');
        element.style.setProperty('--product-options-height', optionsHeight + 'px');
      });
    }
  }

  function alignProductTitlePriceLabelRow(){
    if(document.querySelectorAll('.star-page-single-product-section').length > 0){
      document.querySelectorAll('.star-page-single-product-section').forEach(function(element){
        var imageHeight = 0;
        var infoHeight = 0;
        var descHeight = 0;
        var labelHeight = 0;
        var priceHeight = 0;
        var affirmHeight = 0;
        element.style.setProperty('--product-label-height', 'auto');
        element.style.setProperty('--product-image-height', 'auto');
        element.style.setProperty('--product-info-height', 'auto');
        element.style.setProperty('--product-desc-height', 'auto');
        element.style.setProperty('--product-price-height', 'auto');
        element.style.setProperty('--product-affirm-height', 'auto');
        element.querySelectorAll('.star-product-image-wrapper ').forEach(function(infoElement){
          if(infoElement.clientHeight > imageHeight) imageHeight = infoElement.clientHeight;
      });
        element.querySelectorAll('.star_product_title').forEach(function(infoElement){
            if(infoElement.clientHeight > infoHeight) infoHeight = infoElement.clientHeight;
        });
        element.querySelectorAll('.star_product_desc').forEach(function(infoElement){
          if(infoElement.clientHeight > descHeight) descHeight = infoElement.clientHeight;
        });
        element.querySelectorAll('.label_star_ranking').forEach(function(infoElement){
          if(infoElement.clientHeight > labelHeight) labelHeight = infoElement.clientHeight;
        });
        element.querySelectorAll('.subtitle_price_row').forEach(function(infoElement){
          if(infoElement.clientHeight > priceHeight) priceHeight = infoElement.clientHeight;
        });
        if(element.querySelectorAll('.affirm_message').length > 0){
          element.querySelectorAll('.affirm_message').forEach(function(infoElement){
            if(infoElement.clientHeight > affirmHeight) affirmHeight = infoElement.clientHeight;
          });
        }
        element.style.setProperty('--product-image-height', imageHeight + 'px');
        element.style.setProperty('--product-info-height', infoHeight + 'px');
        element.style.setProperty('--product-desc-height', descHeight + 'px');
        element.style.setProperty('--product-label-height', labelHeight + 'px');
        element.style.setProperty('--product-price-height', priceHeight + 'px');
        element.style.setProperty('--product-affirm-height', affirmHeight + 'px');
      });
    }
  }

  if(window.innerWidth < 750) alignProductTitlePriceLabelRow();
  alignProductTitleRow();
  window.addEventListener('resize', function(){
    setTimeout(function(){
      alignProductTitleRow();
      if(window.innerWidth < 750) alignProductTitlePriceLabelRow();
    }, 500);
  });

  if(document.querySelectorAll('.star-products-container').length > 0){
    document.querySelectorAll('.star-products-container').forEach(function(element){
      if(element.classList.contains('slider-in-mobile')){
        var main_slider_options = JSON.parse(element.getAttribute('data-flickity-config'));
        var flickityInstance = new Flickity(element, main_slider_options);
      }
    });
  }
}

function addStarProduct(elem, type){
  document.querySelectorAll(elem).forEach(function(elem){
    elem.onclick = function(e){
      e.preventDefault();
      var quantity = 1;

      let formData = {
        'items': [{
         'id': elem.getAttribute('data-variant-id'),
         'quantity': quantity
         }]
       };
      fetch('/cart/add.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if(window.enablePromotionsUsingCode || window.autoPromotionsEnable) {
          window.cart_clear = false;
          window.promotionValidate();
        }
        setTimeout(function(){
          if(type == 'checkout'){
            window.location.href = '/checkout';
          }
          else{
            theme.Cart.prototype._onProductAdded();
            // KY: upsell accessories discount feature - 2023-11-13
            // Close upsell accessories discount modal in all pages after added product to cart
            var upsellAccessoriesModal = document.querySelector('.upsell-accessories-modal');
            if (upsellAccessoriesModal) {
              upsellAccessoriesModal.style.display = 'none';
            }
          }
        }, 1000);
      });
    };
  });
}
if(document.querySelectorAll('.atcButton').length > 0){
  addStarProduct('.atcButton', '');
}
if(document.querySelectorAll('.checkoutButton').length > 0){
  addStarProduct('.checkoutButton', 'checkout');
}

if(document.querySelectorAll('.countdown_wrapper').length > 0){
  document.querySelectorAll('.countdown_wrapper').forEach(function(elem){
      var countDownDate = new Date(elem.getAttribute('data-countdown-end-date')).getTime();

      // Update the count down every 1 second
      var x = setInterval(function() {

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      var distance = countDownDate - now;

          var days = Math.floor(distance / (1000 * 60 * 60 * 24)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
          var seconds = Math.floor((distance % (1000 * 60)) / 1000).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

          var flash_hours = parseInt(hours);
          if(days > 0) flash_hours = (24*days) + parseInt(hours);
          if (flash_hours < 10) flash_hours = `0${flash_hours}`;

          if(!elem.classList.contains('flash-sale-countdown')){
            if(days > 0) elem.querySelector('.days_num').innerText = days;
            else elem.querySelector('.days').style.display = 'none';

            elem.querySelector('.hours_num').innerText = hours;
          }
          else{
            elem.querySelector('.hours_num').innerText = flash_hours;
          }
          elem.querySelector('.mins_num').innerText = minutes;
          elem.querySelector('.sec_num').innerText = seconds;

          var days_wrap = elem.querySelector('.days');
          var hours_wrap = elem.querySelector('.hours');
          var mins_wrap = elem.querySelector('.mins');
          var sec_wrap = elem.querySelector('.sec');
          if(days_wrap && days_wrap.querySelector('.block_text')){
            if(days > 1) days_wrap.querySelector('.block_text').innerText = days_wrap.querySelector('.block_text').getAttribute('data-other');
            else days_wrap.querySelector('.block_text').innerText = days_wrap.querySelector('.block_text').getAttribute('data-one');
          }

          if(hours_wrap && hours_wrap.querySelector('.block_text')){
            if(hours > 1) hours_wrap.querySelector('.block_text').innerText = hours_wrap.querySelector('.block_text').getAttribute('data-other');
            else hours_wrap.querySelector('.block_text').innerText = hours_wrap.querySelector('.block_text').getAttribute('data-one');
          }

          if(mins_wrap && mins_wrap.querySelector('.block_text')){
            if(minutes > 1) mins_wrap.querySelector('.block_text').innerText = mins_wrap.querySelector('.block_text').getAttribute('data-other');
            else mins_wrap.querySelector('.block_text').innerText = mins_wrap.querySelector('.block_text').getAttribute('data-one');
          }

          if(sec_wrap && sec_wrap.querySelector('.block_text')){
            if(seconds > 1) sec_wrap.querySelector('.block_text').innerText = sec_wrap.querySelector('.block_text').getAttribute('data-other');
            else sec_wrap.querySelector('.block_text').innerText = sec_wrap.querySelector('.block_text').getAttribute('data-one');
          }

          // If the count down is finished, write some text
          if (distance < 0) {
              clearInterval(x);
              elem.style.display = 'none';
          }
      }, 1000);
  });
}

if(document.querySelector('.outdoor-image-gallery .block-content.image-slider')){
  var flickityInstance = new Flickity('.outdoor-image-gallery .block-content.image-slider', {
    cellAlign: "left",
    pageDots: false,
    prevNextButtons: false,
    watchCSS: true,
    wrapAround: true
  });

  document.querySelector('.outdoor-image-gallery .next-btn').onclick = function(){
    flickityInstance.next();
  };
}

if(document.querySelector('.star-page-tab-wrapper .sticky-row')){
  var scrollPosEnd = 0;
  document.querySelectorAll('.star-page-tab-wrapper a').forEach(function(element){
    element.onclick = function(e){
      e.preventDefault();
      var section_id = element.getAttribute('href');
      if(section_id == ''){
        section_id = element.getAttribute('data-first-section');
      }
      var sectionElem = document.querySelector(section_id);
      if(sectionElem.querySelectorAll('.star-page-container').length > 0){
        var scrollDiv = sectionElem.querySelectorAll('.star-page-container')[0].offsetTop;
      }
      else{
        var scrollDiv = document.querySelector(section_id).offsetTop + 200;
        if(window.innerWidth < 750){
          scrollDiv = document.querySelector(section_id).offsetTop;
        }
      }
      if(section_id == '#flash_sale' && document.querySelector('.timeline-slider-wrapper')){
        var scrollDiv = document.querySelector(section_id).offsetTop + document.querySelector('.timeline-slider-wrapper').offsetTop;
      }
      document.querySelector('.star-page-tab-wrapper .sticky-row').classList.add('anchor-clicked');
      scrollPosEnd = scrollDiv - 100;
      window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
      if(document.querySelector('.star-page-tab-wrapper div.active')) document.querySelector('.star-page-tab-wrapper div.active').classList.remove('active');
      element.parentElement.classList.add('active');

      var elParent = element.parentNode.parentNode;
      var elLeft = element.offsetLeft - 20;
      elParent.scrollLeft = elLeft;
    };
  });

  var first_section_height = 0;
  for(var i=0; i<document.querySelectorAll('.main-content .shopify-section').length; i++){
    if(document.querySelectorAll('.main-content .shopify-section')[i].clientHeight > first_section_height){
        first_section_height = document.querySelectorAll('.main-content .shopify-section')[i].clientHeight;
        break;
    }
  }

  if(document.querySelector('.star-page-tab-wrapper').classList.contains('is-sticky')){
    var element = document.querySelector('.star-page-tab-wrapper.is-sticky'),
        elemRect = element.getBoundingClientRect();
    var offset = document.querySelector('.star-page-tab-wrapper.is-sticky').offsetTop + 170;

    window.onscroll = function(){

      if(window.pageYOffset > offset){
        document.querySelector('.star-page-tab-wrapper.is-sticky').classList.add('fixed');
      }
      else{
        document.querySelector('.star-page-tab-wrapper.is-sticky').classList.remove('fixed');
      }

      if(document.querySelector('.star-page-tab-wrapper .sticky-row').classList.contains('anchor-clicked') == false){
        document.querySelectorAll('.sticky-row a').forEach(function(e){
          var section_id = e.getAttribute('href');
          var first_section_id = e.getAttribute('data-first-section');
          var last_section_id = e.getAttribute('data-last-section');
          var scrollPos_start = window.pageYOffset + 200;
          var scrollPos_end = window.pageYOffset;
          if(section_id != '' && last_section_id == ''){

            if(document.querySelector(section_id)){
              var refElement = document.querySelector(section_id);
              var section_top = refElement.getBoundingClientRect().top + window.pageYOffset;
              if(scrollPos_start >= section_top && scrollPos_end < section_top + refElement.clientHeight){
                if(document.querySelector('.sticky-row div.active')) document.querySelector('.sticky-row div.active').classList.remove('active');
                e.parentElement.classList.add('active');
                var elParent = e.parentNode.parentNode;
                var elLeft = e.offsetLeft - 20;
                elParent.scrollLeft = elLeft;
              }
              else{
                e.parentElement.classList.remove('active');
              }
            }
          }
          else if(first_section_id != '' && last_section_id != ''){
            var refElement1 = document.querySelector(first_section_id);
            var refElement2 = document.querySelector(last_section_id);

            if(refElement1 && refElement2){
              var section_top = refElement1.getBoundingClientRect().top + window.pageYOffset;
              var section_bottom = refElement2.getBoundingClientRect().top + window.pageYOffset;
              if(scrollPos_start >= section_top && scrollPos_end < section_bottom + refElement2.clientHeight){
                if(document.querySelector('.sticky-row div.active')) document.querySelector('.sticky-row div.active').classList.remove('active');
                e.parentElement.classList.add('active');
                var elParent = e.parentNode.parentNode;
                var elLeft = e.offsetLeft - 20;
                elParent.scrollLeft = elLeft;
              }
              else{
                e.parentElement.classList.remove('active');
              }
            }
          }
        });
      }

      if(window.pageYOffset > scrollPosEnd){
        document.querySelector('.star-page-tab-wrapper .sticky-row').classList.remove('anchor-clicked');
      }

      if(document.querySelector('.signup-float-icon')){
        if(window.pageYOffset > first_section_height){
          document.querySelector('.signup-float-icon').style.opacity = 1;
        }
        else{
          document.querySelector('.signup-float-icon').style.opacity = 0;
        }
      }
    }
  }
}

function getVariantId(options_wrapper, parentElem){
  var variant_value = '';
  if(options_wrapper.querySelector('.product_option_wrapper[data-position="1"]'))
    variant_value = options_wrapper.querySelector('.product_option_wrapper[data-position="1"] .product_option.selected').innerText;

  if(options_wrapper.querySelector('.product_option_wrapper[data-position="2"]'))
    variant_value = variant_value + ' / ' + options_wrapper.querySelector('.product_option_wrapper[data-position="2"] .product_option.selected').innerText;

  if(options_wrapper.querySelector('.product_option_wrapper[data-position="3"]'))
    variant_value = variant_value + ' / ' + options_wrapper.querySelector('.product_option_wrapper[data-position="3"] .product_option.selected').innerText;

  var selected_option = options_wrapper.querySelector('.product-form__variants option[data-text="'+variant_value+'"]');
  var variant_id = selected_option.value;
  parentElem.querySelector('.star_product_price').innerText = selected_option.getAttribute('data-price');
  parentElem.querySelector('.star_product_compare_price').innerText = selected_option.getAttribute('data-compare-price');
  parentElem.closest('.star_product_block').querySelector('.discount_tag_text').innerHTML = selected_option.getAttribute('data-discount-text');
  parentElem.closest('.star_product_block').querySelector('.star-product-image').setAttribute('srcset', selected_option.getAttribute('data-image'))

  if(parentElem.querySelector('.atcButton'))
    parentElem.querySelector('.atcButton').setAttribute('data-variant-id', variant_id);

  if(parentElem.querySelector('.checkoutButton'))
    parentElem.querySelector('.checkoutButton').setAttribute('data-variant-id', variant_id);
}

var qty_btns = document.querySelectorAll('.quantity_box .qty_btn');
if(qty_btns.length) {
  qty_btns.forEach(function(item,index) {
    item.addEventListener('click', function(e) {
      e.preventDefault();

      var inputEl = this.closest('.qty').querySelector('.quantity');
      var max = inputEl.getAttribute('max');
      var qty = +(inputEl.value);

      if(this.classList.contains('minus_btn')) {
        qty--;
      } else {
        qty++;
      }
      if (qty <= 1) {
        qty = 1;
        this.closest('.qty').querySelector('.minus_btn').classList.add('disabled');
        this.closest('.qty').querySelector('.minus_btn').setAttribute('disabled', 'disabled');
      }
      if (qty > 1) {
        this.closest('.qty').querySelector('.minus_btn').classList.remove('disabled');
        this.closest('.qty').querySelector('.minus_btn').removeAttribute('disabled');
      }

      if (qty >= max) {
        qty = max ;
        this.closest('.qty').querySelector('.plus_btn').classList.add('disabled');
        this.closest('.qty').querySelector('.plus_btn').setAttribute('disabled', 'disabled');
      }
      else{
        this.closest('.qty').querySelector('.plus_btn').classList.remove('disabled');
        this.closest('.qty').querySelector('.plus_btn').removeAttribute('disabled');
      }
      var parentElem = this.closest('.star-product-info-wrapper');
      this.closest('.product_options').querySelector('.product_option.selected').innerText = qty;
      inputEl.value = qty;
      var options_wrapper = this.closest('.product_option_wrapper_outer');
      getVariantId(options_wrapper, parentElem);
    });
  });
}

if(document.querySelectorAll('.product_option').length > 0){
  document.querySelectorAll('.product_option').forEach(function(option){
    option.addEventListener('click', function(e) {
      e.preventDefault();
      var parentElem = this.closest('.star-product-info-wrapper');
      parentElem.querySelector('.product_option.selected').classList.remove('selected');
      this.classList.add('selected');
      var nonMemberVariantID = this.getAttribute('data-non-member-variant-id');
      if(this.getAttribute('data-non-member-showing') == 'false' && this.getAttribute('data-member-only-variant') == 'false'){
        parentElem.querySelector('.star_product_price').innerText = this.getAttribute('data-price').replace(/\./g, ' ');
        if(parentElem.querySelector('.star_product_compare_price')){
          parentElem.querySelector('.star_product_compare_price').innerText = this.getAttribute('data-compare-price').replace(/\./g, ' ');
        }
        parentElem.querySelector('.price_row').style.display = 'flex';
        parentElem.querySelector('.member-only-price-wrap').style.display = 'none';
        parentElem.querySelector('.subtitle_price_row_alter').style.display = 'none';
      }
      else if(this.getAttribute('data-non-member-showing') == 'true' && this.getAttribute('data-member-only-variant') == 'false'){
        parentElem.querySelector('.star_product_price').innerText = this.getAttribute('data-non-member-price').replace(/\./g, ' ');
        if(parentElem.querySelector('.star_product_compare_price')){
          parentElem.querySelector('.star_product_compare_price').innerText = this.getAttribute('data-non-member-compare-price').replace(/\./g, ' ');
        }
        parentElem.querySelector('.price_row').style.display = 'flex';
        parentElem.querySelector('.member-only-price-wrap').style.display = 'none';
        parentElem.querySelector('.subtitle_price_row_alter').style.display = 'none';
      }
      else{
        parentElem.querySelector('.member-only-price').innerText = this.getAttribute('data-price').replace(/\./g, ' ');
        parentElem.querySelector('.non-member-price .price_elem').innerText = this.getAttribute('data-non-member-price').replace(/\./g, ' ');
        if(this.getAttribute('data-non-member-compare-price') != ''){
          parentElem.querySelector('.non-member-c-price').innerText = this.getAttribute('data-non-member-compare-price').replace(/\./g, ' ');
          parentElem.querySelector('.non-member-c-price').style.display = 'inline-block';
        }
        else{
          parentElem.querySelector('.non-member-c-price').style.display = 'none';
        }
        parentElem.querySelector('.price_row').style.display = 'none';
        parentElem.querySelector('.member-only-price-wrap').style.display = 'flex';
        parentElem.querySelector('.subtitle_price_row_alter').style.display = 'block';
      }

      if(parentElem.querySelector('.variantButton')){
        var variant_url = this.getAttribute('data-url');
        parentElem.querySelector('.variantButton').setAttribute('href', variant_url);
        handleCheckbox(parentElem, e, 'option');
      }

      if(parentElem.querySelector('.custom_price')){
        parentElem.querySelector('.custom_price').innerHTML = this.getAttribute('data-custom-price');
        parentElem.querySelector('.custom_price').style.display = 'block';
      }

      parentElem.closest('.star_product_block').querySelector('.star-product-image').setAttribute('srcset', this.getAttribute('data-variant-image'));
      if(parentElem.querySelector('.normal_btn') && this.getAttribute('data-redirection-url') != '')
        parentElem.querySelector('.normal_btn').setAttribute('href', this.getAttribute('data-redirection-url'));

      if(parentElem.querySelector('.amazon_btn') && this.getAttribute('data-amazon-url') != '')
        parentElem.querySelector('.amazon_btn').setAttribute('href', this.getAttribute('data-amazon-url'));

      if(parentElem.querySelector('.atc_btn'))
        parentElem.querySelector('.atc_btn').setAttribute('data-variant-id', this.getAttribute('data-variant-id'));

      if(parentElem.querySelector('.checkoutButton'))
        parentElem.querySelector('.checkoutButton').setAttribute('data-variant-id', this.getAttribute('data-variant-id'));

      if(this.closest('.star_product_block').querySelector('.discount_tag_wrapper')){
        if(this.getAttribute('data-discounted') == 'yes'){
          this.closest('.star_product_block').querySelector('.discount_tag_text span').innerHTML = this.getAttribute('data-discount-price');
          this.closest('.star_product_block').querySelector('.discount_tag_wrapper').style.display = 'block';
        }
        else
          this.closest('.star_product_block').querySelector('.discount_tag_wrapper').style.display = 'none';
      }

      if(this.getAttribute('data-product-title') != ''){
        parentElem.querySelector('.star_product_title p').innerText = this.getAttribute('data-product-title');
        parentElem.querySelector('.star_product_title p').innerText = this.getAttribute('data-product-title');
        if(parentElem.querySelectorAll('.recommended-product-title').length > 0){
          parentElem.querySelectorAll('.recommended-product-title.title-for-mobile').innerText = this.getAttribute('data-product-title');
          parentElem.querySelectorAll('.recommended-product-title.hide-for-mobile').innerText = this.getAttribute('data-product-title');
        }
      }

      if(this.getAttribute('data-product-handle') != '' && parentElem.querySelector('.view-details-btn')){
        parentElem.querySelector('.view-details-btn').setAttribute('data-handle', this.getAttribute('data-product-handle'));
      }
    });
  });
}

if(document.querySelectorAll('.popup').length > 0){
  document.querySelector('.popup').onclick = function(elem){
    document.querySelector('.summer_popup_content').style.display = 'block';
  }

  document.querySelector('.popup_close').onclick = function(elem){
    document.querySelector('.summer_popup_content').style.display = 'none';
  }
}

if(document.querySelectorAll('.product-info-svg').length > 0){
  document.querySelectorAll('.product-info-svg').forEach(function(elem){
    if(window.innerWidth < 750){
      elem.querySelector('svg').addEventListener('click', function(e){
        this.closest('.product-info-svg').querySelector('.product_info').classList.add('active');
      })
    }
    else{
      elem.addEventListener('mouseover', function(e){
        this.querySelector('.product_info').classList.add('active');
      });
      elem.addEventListener('mouseout', function(e){
        this.querySelector('.product_info').classList.remove('active');
      });
    }

    elem.querySelector('.info-close').addEventListener('click', function(e){
      this.closest('.product_info').classList.remove('active');
    });
  });
  document.addEventListener('click', function(e){
    var el = e.target;
    if(!el.classList.contains('product-info-svg') && !el.closest('.product-info-svg')){
      if(document.querySelector('.product_info.active')) document.querySelector('.product_info.active').classList.remove('active');
    }
  });
}

var quick_viewModal = document.querySelector('#corporate-atc-modal');
if(quick_viewModal) {
    document.addEventListener('click', function(e){
      var target = e.target;

      if(target.classList.contains('corporate-atc-btn') || target.closest('.corporate-atc-btn')) {
        if(!target.classList.contains('corporate-atc-btn')) {
          target = target.closest('.corporate-atc-btn');
        }

        e.preventDefault();
        var productUrl = new URL("".concat(window.location.origin).concat(target.getAttribute('data-product-url'))); // If we are on mobile or tablet, we redirect to product page directly
        var modal = document.getElementById(target.getAttribute('aria-controls'));
        modal.classList.add('is-loading');
        productUrl.searchParams.set('view', 'quick-view');
        fetch(productUrl.href, {
          credentials: 'same-origin',
          method: 'GET'
        }).then(function (response) {
          response.text().then(function (content) {
            modal.querySelector('.modal__inner').innerHTML = content;
            var discountElem = target.parentElement.parentElement;
            modal.querySelector('.discounts-wrapper').innerHTML = discountElem.querySelector('.corporate-product-discounts').innerHTML;
            modal.classList.remove('is-loading');

            var modalProductSection = new theme.Product(modal.querySelector('[data-section-type="product"]')); // We set a listener so we can cleanup on close
            var min_qty = target.getAttribute('data-min-qty');
            if(min_qty != ''){
              var el = modal.querySelector('[data-quantity-input]');
              el.value = target.getAttribute('data-min-qty');
              el.dispatchEvent(new Event('change'));
            }
            if(window.innerWidth < 750){
              var slider = modal.querySelector('[data-product-main-slider]');
              var flkty = Flickity.data(slider);
              flkty.destroy();

              setTimeout(function(){
                var main_slider = modal.querySelector('.product-single__media__carousel');
                var main_slider_options = JSON.parse(main_slider.getAttribute('data-flickity-config'));
                if(main_slider) {
                  this.flickityInstance = new Flickity(main_slider, main_slider_options);
                  this.flickityInstance.element.classList.add("rendered");
                }
              }, 1000);
            }

            //modal.querySelector('.plus_btn.qty_btn').click();
            theme.Video.loadVideos();
            if(modal.querySelector('.product-main-video')){
              document.dispatchEvent(
                new CustomEvent('youtubeAPIReady', {
                  detail: {},
                  bubbles: true,
                  cancelable: true
                })
              );
            }

            if(modal.querySelector('#email_signup_product')){
              KlaviyoSubscribe.attachToForms('#email_signup_product', {
                hide_form_on_success: true
              });
            }

            document.querySelector('body').classList.add('overflow-hidden');
            modal.setAttribute('aria-hidden','false');

          });
        });
      }
    });

    document.addEventListener('click', function(e){
      var el = e.target;

      if(el.classList.contains('close-corporate-modal') || el.closest('.close-corporate-modal')) {
        e.preventDefault();
        var modal = el.closest('.modal');
        modal.setAttribute('aria-hidden','true');
        modal.querySelector('.modal__inner').innerHTML = '';
        document.querySelector('body').classList.remove('overflow-hidden');
      }
    });
}

if(document.querySelectorAll('.corporate-compare-btn .btn').length > 0){
  document.querySelectorAll('.corporate-compare-btn .btn').forEach(function(elem){
    elem.onclick = function(){
      var parentElem = elem.parentElement;
      var modal = document.querySelector('.compare-modal');
      modal.innerHTML = parentElem.querySelector('.corporate-compare-popup-content').innerHTML;
      document.querySelector('body').classList.add('overflow-hidden');
      modal.setAttribute('aria-hidden','false');
    }
  });
}
document.addEventListener('click', function(e){
  var el = e.target;

  if(el.classList.contains('compare-popup-btn') || el.closest('.compare-popup-btn')) {
    e.preventDefault();
    if(!el.classList.contains('compare-popup-btn')) {
      el = el.closest('.compare-popup-btn');
    }
    var popupElem = el.closest('.modal');
    var image_index = el.getAttribute('data-btn-index');
    popupElem.querySelector('.compare-popup-btn.active').classList.remove('active');
    el.classList.add('active');
    popupElem.querySelector('.compare-popup-table-inner.active').classList.remove('active');
    popupElem.querySelector('.compare-popup-table-inner[data-table-index="'+image_index+'"]').classList.add('active');
  }
});
document.addEventListener('click', function(e){
  var el = e.target;

  if(el.classList.contains('close-popup-modal') || el.closest('.close-popup-modal')) {
    e.preventDefault();
    var modal = el.closest('.modal');
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML = '';
    document.querySelector('body').classList.remove('overflow-hidden');
  }
});

if(document.querySelectorAll('.corporate-product-grid').length > 0){
  function alignCorporateProductCard(){
    document.querySelectorAll('.corporate-product-grid').forEach(function(elem){
      var titlePriceHeight = 0;
      var titleHeight = 0;
      elem.style.setProperty('--product-title-height', 'auto');
      elem.style.setProperty('--title-height', 'auto');
      elem.querySelectorAll('.corporate-product').forEach(function(product){
        var titlePriceElem = product.querySelector('.corporate-product-title-price');
        var titleElem = product.querySelector('.corporate-product-title');
        if(titlePriceElem.clientHeight > titlePriceHeight) titlePriceHeight = titlePriceElem.clientHeight;
        if(titleElem.clientHeight > titleHeight) titleHeight = titleElem.clientHeight;
      });
      elem.style.setProperty('--product-title-height', titlePriceHeight + 'px');
      elem.style.setProperty('--title-height', titleHeight + 'px');
    });
  }

  alignCorporateProductCard();
  window.addEventListener('resize', function(){ setTimeout(function(){ alignCorporateProductCard(); }, 500); });
}

function is_3_valid(input, ProfileForm) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (input === '') {
      error += ProfileForm.querySelector('.blank-email-error').innerHTML;
      return false;
  }
  if (!emailRegex.test(input)) {
      error += ProfileForm.querySelector('.invalid-email-error').innerHTML;
      return false;
  }
  return true;
}

function CheckInputs(ProfileForm) {
  var check_ok = true;
  error = '';
  check_ok = is_3_valid(ProfileForm.querySelector('.Form__Input').value, ProfileForm) && check_ok;
  if (check_ok == false) alert(error);
  return check_ok;
}

if(document.querySelectorAll('.emarsys__form').length > 0){
  document.querySelectorAll('.emarsys__form').forEach(function(formWrap){

    if(formWrap.querySelector('.emarsys-form-btn')){
      var ProfileForm = formWrap.querySelector('form');
      if(ProfileForm){
        ProfileForm.querySelector('.emarsys-form-btn').onclick = function(e){
          if (CheckInputs(ProfileForm) == true) {
              if (window.onbeforesubmit) onbeforesubmit();
              var successMessage = ProfileForm.querySelector('#successMessage');

              // Set the target of the form to the hidden iframe
              ProfileForm.setAttribute("target", 'hidden_iframe');

              // Submit the form
              ProfileForm.submit();

              // Reset the target and clear the form after a short delay
              setTimeout(function () {
                ProfileForm.setAttribute("target", '');
                ProfileForm.reset();
                formWrap.classList.add('form-success');
                if(successMessage.textContent == '') successMessage.textContent = 'Success!';
                if(document.querySelector('.sticky-subscribe-bar')) document.querySelector('.sticky-subscribe-bar').style.position = 'relative';
              }, 1000); // Adjust the delay as needed
          }
        }
      }
    }
  });
}

if(document.querySelector('.prime-day-flash-section .products-grid')){
  var watchCss = false;
  var titleHeight = 0;
  document.querySelectorAll('.prime-day-flash-section .products-grid .product-block').forEach(function(elem){
    if(elem.querySelector('.product-title').clientHeight > titleHeight) titleHeight = elem.querySelector('.product-title').clientHeight;
  });
  document.querySelector('.prime-day-flash-section .products-grid').style.setProperty('--product-title-height', titleHeight + 'px');

  if(document.querySelector('.prime-day-flash-section').classList.contains('text-in-top') && document.querySelector('.prime-day-flash-section .products-grid').classList.contains('desktop-slider-disabled')){
    watchCss = true;
  }
  var flickityInstance = new Flickity('.prime-day-flash-section .products-grid', {
    cellAlign: 'left',
    pageDots: true,
    prevNextButtons: false,
    contain: true,
    wrapAround: true,
    groupCells: true,
    watchCSS: watchCss
  });

  if(document.querySelector('.prime-day-flash-section .next-btn')){
    document.querySelector('.prime-day-flash-section .next-btn').onclick = function(){
      flickityInstance.next();
    };
  }
  if(document.querySelector('.prime-day-flash-section .prev-btn')){
    document.querySelector('.prime-day-flash-section .prev-btn').onclick = function(){
      flickityInstance.previous();
    };
  }
}

if(document.querySelector('.promotion_popup_close')){
  document.querySelector('.promotion_popup_close').onclick = function(){
    document.querySelector('.promotion_popup_trigger').remove();
  }
}

if(document.querySelector('.promotion_popup_trigger')){
  dragElement(document.querySelector('.promotion_section'));
  let drag = false;
  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
    elmnt.ontouchstart = dragMouseDown;

    function dragMouseDown(e) {
      drag = false;
      e = e || window.event;
      if(e.touches){
        document.querySelector('body').classList.add('overflow-hidden');
      }
      e = e.touches ? e.touches[0] : e;

      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
      document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
      drag = true;
      e = e || window.event;
      e = e.touches ? e.touches[0] : e;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      if(pos3 > 0 && pos3 < window.innerWidth) elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      if(pos4 > document.querySelector('[data-header-section]').clientHeight && pos4 < window.innerHeight) elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      //console.log(elmnt.offsetTop - pos2);
      elmnt.style.bottom = "unset";

    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchstart = null;
      document.ontouchmove = null;
      document.querySelector('body').classList.remove('overflow-hidden');
    }
  }

  document.querySelector('.promotion_popup_trigger').onclick = function(e){
    if(drag == false){
      drag = true;
      var parentElem = this.parentElement;
      if(parentElem.querySelector('.promotion_popup_wrapper')){
        var popupElem = document.createElement('div');
        popupElem.classList.add('promotion_popup_wrapper_inner');
        popupElem.innerHTML = parentElem.querySelector('.promotion_popup_wrapper').innerHTML;
        document.querySelector('body').appendChild(popupElem);
        document.querySelector('body').classList.add('overflow-hidden');
        popupElem.querySelector('.popup_t_c input').setAttribute("id", "inp_77151");
        popupElem.querySelector('.popup_t_c label').setAttribute("for", "inp_77151");

        popupElem.addEventListener('click', function(e){
          var el = e.target;
          if(el.classList.contains('.promotion_popup_inner') || el.closest('.promotion_popup_inner')) {
            return false;
          } else {
            popupElem.remove();
            document.querySelector('body').classList.remove('overflow-hidden');
          }
        });

        popupElem.querySelector('.promotion_poup_close').onclick = function(){
          popupElem.remove();
          document.querySelector('body').classList.remove('overflow-hidden');
        };

        var error;
        var form_language = 'en';
        var ProfileForm = popupElem.querySelector('.ls-solution-banner__form');

        if(popupElem.querySelector('.emarsys-form-btn')){
          popupElem.querySelector('.emarsys-form-btn').onclick = function(e){
            if (CheckInputs(ProfileForm) == true) {
                if (window.onbeforesubmit) onbeforesubmit();

                // Set the target of the form to the hidden iframe
                ProfileForm.setAttribute("target", 'hidden_iframe');

                // Submit the form
                ProfileForm.submit();

                // Reset the target and clear the form after a short delay
                setTimeout(function () {
                  ProfileForm.setAttribute("target", '');
                  ProfileForm.reset();
                  popupElem.querySelector('.promotion_popup_inner').classList.add('success');
                }, 1000); // Adjust the delay as needed
            }
          }
        }
      }
    }
  }
}

function memberTagHeight(){
  if(document.querySelectorAll('.member-tag').length > 0){
    document.querySelectorAll('.member-tag').forEach(function(elem){
      elem.style.setProperty('--border-width', elem.clientHeight / 2 + 'px');
    });
  }
}
memberTagHeight();
window.addEventListener('resize', function(){ memberTagHeight(); });

if(document.querySelectorAll('.discount-products-container').length > 0){
  new Flickity('.discount-products-container', {
    prevNextButtons: false,
    contain: true,
    groupCells: true,
    watchCSS: true,
    lazyLoad: true
  });

  document.querySelectorAll('.add_discount_products').forEach(function(elem){
    elem.onclick = function(){
      var variant_1_id = elem.getAttribute('data-variant-1-id');
      var variant_2_id = elem.getAttribute('data-variant-2-id');

      var addItems = '';
      if(variant_1_id != ''){
        addItems = 'updates['+variant_1_id+']=1';
      }
      if(variant_2_id != ''){
        addItems = addItems + '&updates['+variant_2_id+']=1';
      }

      fetch('/cart/update.js', {
        body: addItems,
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function (cart) {
        theme.Cart.prototype._onProductAdded();
      });
    }
  });
}

/* SMART DEVICES WISHLIST BUTTON EDIT */

$('body').on('click', '#notepad-anchor-title', function() {
let wishlistTimer = setInterval(function() {
    let buttons = $('.swym-wishlist-item[aria-label="Acondicionador de aire portátil EcoFlow WAVE 2 - WAVE 2"] button.swym-add-to-cart-btn');

    if (buttons.length > 0) {
      buttons.html('Próximamente');
      setTimeout(function() {
         clearTimeout(wishlistTimer);
      }, 3000);
    }
  }, 100);

});

class ScrollDraggableImage extends HTMLElement {
  constructor() {
      super();

      this.container = this.querySelector('.draggable-image-container');
      this.image = this.querySelector('.draggable-image');

      this.init();
  }

  init() {
      let isDragging = false;
      let startX, scrollLeft;
      const $container = this.container;


      $container.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.pageX - $container.offsetLeft;
        scrollLeft = $container.scrollLeft;
      });

      $container.addEventListener('mouseleave', function() {
        isDragging = false;
      });

      $container.addEventListener('mouseup', function() {
        isDragging = false;
      });

      $container.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();

        var x = e.pageX - $container.offsetLeft;
        var walk = (x - startX) * 2;
        $container.scrollLeft = scrollLeft - walk;
      });
  }
}
customElements.define('scroll-draggable-image', ScrollDraggableImage);

// KY: upsell accessories discount feature - 2023-11-14
function openUpsellAccessoriesModal() {
  var upsellAccessoriesModal = document.querySelector('.upsell-accessories-modal');
  if (upsellAccessoriesModal) {
    upsellAccessoriesModal.style.display = 'block';
  }
}

function initMegaMenuSwiper() {
  document.querySelectorAll('.mega-menu-swiper-products').forEach(function(elem){
    var swiper = new Swiper(elem, {
      slidesPerView: "auto",
      freeMode: true
    });
    elem.dataset.swiper = swiper;
  });
}

function destroyMegaMenuSwiper() {
  document.querySelectorAll('.mega-menu-swiper-products').forEach(function(elem){
    var swiper = elem.dataset.swiper;
    if (swiper) {
      swiper.destroy();
      delete elem.dataset.swiper;
    }
  });
}

function handleResize() {
  if (window.innerWidth >= 1024 && window.innerWidth < 1440) {
    initMegaMenuSwiper();
  } else {
    destroyMegaMenuSwiper();
  }
}

if (window.innerWidth >= 1024 && window.innerWidth < 1440) {
  initMegaMenuSwiper();
}

let reInitMegaMenuSwiper;
window.onresize = function() {
  clearTimeout(reInitMegaMenuSwiper);
  reInitinitMegaMenuSwiper = setTimeout(function() {
    handleResize()
  }, 100);
};

function generateTraceId() {
  const date = new Date();
  const year = `00${date?.getFullYear()}`.slice(-2);
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDay()}`.slice(-2);
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  const second = `00${date.getSeconds()}`.slice(-2);
  const millSecond = `000${date.getMilliseconds()}`.slice(-3);
  const randomStr1 = `${Math.random()}`;
  const randomStr2 = `${Math.random()}`;
  return year + month + day + hour + minute + second + millSecond + randomStr1.slice(-8) + randomStr2.slice(-9);
}

if(document.querySelector('.sticky-tabs-inner')){
  var sticky_bar_height = 0;
  if(document.querySelector('.product-sticky-bar')) sticky_bar_height = document.querySelector('.product-sticky-bar').clientHeight;
  document.querySelectorAll('.sticky-tabs-inner a').forEach(function(e){
    var section_id = e.getAttribute('href') == '#' ? '#no-valid-selector' : e.getAttribute('href');
    var refElement = document.querySelector(section_id);
    if(refElement){
      e.onclick = function(evt){
        evt.preventDefault();
        var section_top = refElement.getBoundingClientRect().top + window.scrollY - sticky_bar_height - 50;
        window.scroll({
          top: section_top,
          behavior: 'smooth'
        });
      }
    }
  });

  window.onscroll = function(){
    document.querySelectorAll('.sticky-tabs-inner a').forEach(function(e){
      var section_id = e.getAttribute('href') == '#' ? '#no-valid-selector' : e.getAttribute('href');
      var refElement = document.querySelector(section_id);
      var scrollPos_start = window.scrollY + sticky_bar_height + 200;
      var scrollPos_end = window.scrollY + sticky_bar_height;
      if(refElement){
        var section_top = refElement.getBoundingClientRect().top + window.scrollY;
        // if(scrollPos_start >= section_top && scrollPos_end < section_top + refElement.clientHeight){
        if(scrollPos_start >= section_top){
          if(document.querySelector('.sticky-tabs-inner a.active')) document.querySelector('.sticky-tabs-inner a.active').classList.remove('active');
          e.classList.add('active');
        }
        else{
          e.classList.remove('active');
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  function setSliderHeightToMax(slider) {
    if(slider){
      slider.cells.forEach(cell => cell.element.style.height = '');
      let heights = slider.cells.map(cell => cell.element.offsetHeight),
      max = Math.max.apply(Math, heights);
      slider.cells.forEach(cell => cell.element.style.height = max + 'px');
    }
  }

  if(document.querySelectorAll('.spring-round-section-blocks').length > 0){
    document.querySelectorAll('.spring-round-section-blocks').forEach(function(elem){
      var springSectionBlocks = elem;
      var blocksLength = springSectionBlocks.querySelectorAll('.spring-round-section-block').length;

      if (blocksLength > 2) springSectionBlocks.classList.add('slider-enabled');
      if (blocksLength > 4) springSectionBlocks.classList.add('desktop-slider-enabled');

      var flkty = new Flickity(springSectionBlocks, {
        cellAlign: "left",
        wrapAround: false,
        pageDots: true,
        contain: true,
        groupCells: true,
        watchCSS: true,
        prevNextButtons: false,
        autoPlay: elem.getAttribute('data-autoplay'),
        on: {
          ready: function() {
            setSliderHeightToMax(this);
          }
        }
      });

      window.addEventListener('resize', function(){
        setSliderHeightToMax(flkty);
      });
    });
  }
});

// Adjust the position of the email subscription and floating logos when the sticky add to card is visible on PDP

document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth < 750) {
    var productMeta = document.querySelector('.product-single__meta');
    var controlsGroup = document.querySelector('.product-form__controls-group--submit');

    var config = { attributes: true, childList: true, subtree: true };

    function updateBottomStyle(selector, controlsGroupHeight, offset) {
      var element = document.getElementById(selector) || document.querySelector(selector);
      if (element) {
        element.style.bottom = controlsGroupHeight + offset + 'px';
      }
    }

    function resetBottomStyle(selector) {
      var element = document.getElementById(selector) || document.querySelector(selector);
      if (element) {
        element.style.bottom = '';
      }
    }

    var callback = function(mutationsList) {
      for(let mutation of mutationsList) {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          var controlsGroupHeight = controlsGroup.getBoundingClientRect().height;
          if (productMeta.classList.contains('enabled_mobile_sticky_btns')) {
            updateBottomStyle('email-subscription-popup', controlsGroupHeight, 20);
            updateBottomStyle('.redirection-floating-icon__section', controlsGroupHeight, 20);
            updateBottomStyle('.icon-microsoft-chat-widget', controlsGroupHeight, 80);
            updateBottomStyle('.ecocredits-popup-trigger', controlsGroupHeight, 140);
            updateBottomStyle('BackToTop', controlsGroupHeight, 200);
          } else {
            resetBottomStyle('email-subscription-popup');
            resetBottomStyle('.redirection-floating-icon__section');
            resetBottomStyle('.icon-microsoft-chat-widget');
            resetBottomStyle('.ecocredits-popup-trigger');
            resetBottomStyle('BackToTop');
          }
        }
      }
    };

    var classObserver = new MutationObserver(callback);
    var controlsGroupObserver = new MutationObserver(callback);

    classObserver.observe(productMeta, config);
    controlsGroupObserver.observe(controlsGroup, config);
  }
});