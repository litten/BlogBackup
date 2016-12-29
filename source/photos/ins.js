/******/
(function(modules) { // webpackBootstrap
  /******/ // The module cache
  /******/
  var installedModules = {};
  /******/
  /******/ // The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/
    if (installedModules[moduleId])
    /******/
      return installedModules[moduleId].exports;
    /******/
    /******/ // Create a new module (and put it into the cache)
    /******/
    var module = installedModules[moduleId] = {
      /******/
      exports: {},
      /******/
      id: moduleId,
      /******/
      loaded: false
        /******/
    };
    /******/
    /******/ // Execute the module function
    /******/
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/
    module.loaded = true;
    /******/
    /******/ // Return the exports of the module
    /******/
    return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/
  __webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/
  __webpack_require__.c = installedModules;
  /******/
  /******/ // __webpack_public_path__
  /******/
  __webpack_require__.p = "/dist/";
  /******/
  /******/ // Load entry module and return exports
  /******/
  return __webpack_require__(0);
  /******/
})
/************************************************************************/
/******/
([
  /* 0 */
  /***/
  function(module, exports, __webpack_require__) {

    'use strict';

    __webpack_require__(1);

    var _view = __webpack_require__(2);

    var _view2 = _interopRequireDefault(_view);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    /**
     * @name impush-client 
     * @description 这个项目让我发家致富…
     * @date 2016-12-1
     */

    var _collection = [];
    var _count = 0;
    var searchData;

    function addMask(elem) {
      var rect = elem.getBoundingClientRect();
      var style = getComputedStyle(elem, null);

      var mask = document.createElement('i');
      mask.className = 'icon-film';
      mask.style.color = '#fff';
      mask.style.fontSize = '26px';
      mask.style.position = 'absolute';
      mask.style.right = '10px';
      mask.style.bottom = '10px';
      mask.style.zIndex = 1;
      elem.parentNode.appendChild(mask);
    }

    var createVideoIncon = function createVideoIncon() {
      var $videoImg = document.querySelectorAll('.thumb a[data-type="video"]');
      for (var i = 0, len = $videoImg.length; i < len; i++) {
        addMask($videoImg[i]);
      }
    };
    var render = function render(res) {
      var ulTmpl = "";
      for (var j = 0, len2 = res.list.length; j < len2; j++) {
        var data = res.list[j].arr;
        var liTmpl = "";
        for (var i = 0, len = data.link.length; i < len; i++) {
          var minSrc = 'http://litten.me/ins-min/' + data.link[i] + '.min.jpg';
          var src = 'http://litten.me/ins/' + data.link[i];
          var type = data.type[i];
          var target = src + (type === 'video' ? '.mp4' : '.jpg');
          src += '.jpg';

          liTmpl += '<figure class="thumb" itemprop="associatedMedia" itemscope="" itemtype="http://schema.org/ImageObject">\
                <a href="' + src + '" itemprop="contentUrl" data-size="640x640" data-type="' + type + '" data-target="' + target + '">\
                  <img class="reward-img" data-type="' + type + '" data-src="' + minSrc + '" src="/assets/img/empty.png" itemprop="thumbnail" onload="lzld(this)">\
                </a>\
                <figcaption style="display:none" itemprop="caption description">' + data.text[i] + '</figcaption>\
            </figure>';
        }
        ulTmpl = ulTmpl + '<section class="archives album"><h1 class="year">' + data.year + '<em>' + data.month + '月</em></h1>\
        <ul class="img-box-ul">' + liTmpl + '</ul>\
        </section>';
      }
      document.querySelector('.instagram').innerHTML = '<div class="photos" itemscope="" itemtype="http://schema.org/ImageGallery">' + ulTmpl + '</div>';
      createVideoIncon();
      _view2.default.init();
    };

    var replacer = function replacer(str) {
      var arr = str.split("/");
      return "/assets/ins/" + arr[arr.length - 1];
    };

    var ctrler = function ctrler(data) {
      var imgObj = {};
      for (var i = 0, len = data.length; i < len; i++) {
        var y = data[i].y;
        var m = data[i].m;
        var src = replacer(data[i].src);
        var text = data[i].text;
        var key = y + "" + ((m + "").length == 1 ? "0" + m : m);
        if (imgObj[key]) {
          imgObj[key].srclist.push(src);
          imgObj[key].text.push(text);
        } else {
          imgObj[key] = {
            year: y,
            month: m,
            srclist: [src],
            text: [text]
          };
        }
      }
      render(imgObj);
    };

    function loadData(success) {
      if (!searchData) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', './ins.json?t=' + +new Date(), true);

        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            var res = JSON.parse(this.response);
            searchData = res;
            success(searchData);
          } else {
            console.error(this.statusText);
          }
        };

        xhr.onerror = function() {
          console.error(this.statusText);
        };

        xhr.send();
      } else {
        success(searchData);
      }
    }

    var Ins = {
      init: function init() {
        loadData(function(data) {
          render(data);
        });
      }
    };

    Ins.init();

    // export default impush;

    /***/
  },
  /* 1 */
  /***/
  function(module, exports, __webpack_require__) {

    /* WEBPACK VAR INJECTION */
    (function(global) {
      'use strict';

      var inViewport = __webpack_require__(3);
      var lazyAttrs = ['data-src'];

      global.lzld = lazyload();

      // Provide libs using getAttribute early to get the good src
      // and not the fake data-src
      replaceGetAttribute('Image');
      replaceGetAttribute('IFrame');

      function registerLazyAttr(attr) {
        if (indexOf.call(lazyAttrs, attr) === -1) {
          lazyAttrs.push(attr);
        }
      }

      function lazyload(opts) {
        opts = merge({
          'offset': 333,
          'src': 'data-src',
          'container': false
        }, opts || {});

        if (typeof opts.src === 'string') {
          registerLazyAttr(opts.src);
        }

        var elts = [];

        function show(elt) {
          var src = findRealSrc(elt);

          if (src) {
            elt.src = src;
          }

          elt.setAttribute('data-lzled', true);
          elts[indexOf.call(elts, elt)] = null;
        }

        function findRealSrc(elt) {
          if (typeof opts.src === 'function') {
            return opts.src(elt);
          }

          return elt.getAttribute(opts.src);
        }

        function register(elt) {
          elt.onload = null;
          elt.removeAttribute('onload');
          elt.onerror = null;
          elt.removeAttribute('onerror');

          if (indexOf.call(elts, elt) === -1) {
            inViewport(elt, opts, show);
          }
        }

        return register;
      }

      function replaceGetAttribute(elementName) {
        var fullname = 'HTML' + elementName + 'Element';
        if (fullname in global === false) {
          return;
        }

        var original = global[fullname].prototype.getAttribute;
        global[fullname].prototype.getAttribute = function(name) {
          if (name === 'src') {
            var realSrc;
            for (var i = 0, max = lazyAttrs.length; i < max; i++) {
              realSrc = original.call(this, lazyAttrs[i]);
              if (realSrc) {
                break;
              }
            }

            return realSrc || original.call(this, name);
          }

          // our own lazyloader will go through theses lines
          // because we use getAttribute(opts.src)
          return original.call(this, name);
        };
      }

      function merge(defaults, opts) {
        for (var name in defaults) {
          if (opts[name] === undefined) {
            opts[name] = defaults[name];
          }
        }

        return opts;
      }

      // http://webreflection.blogspot.fr/2011/06/partial-polyfills.html
      function indexOf(value) {
        for (var i = this.length; i-- && this[i] !== value;) {}
        return i;
      }

      module.exports = lazyload;

      // export default impush;
      /* WEBPACK VAR INJECTION */
    }.call(exports, (function() {
      return this;
    }())))

    /***/
  },
  /* 2 */
  /***/
  function(module, exports) {

    'use strict';

    var initPhotoSwipeFromDOM = function initPhotoSwipeFromDOM(gallerySelector) {

      // parse slide data (url, title, size ...) from DOM elements 
      // (children of gallerySelector)
      var parseThumbnailElements = function parseThumbnailElements(el) {
        el = el.parentNode.parentNode;
        var thumbElements = el.getElementsByClassName('thumb'),
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          type,
          // video or not
          target,
          item;

        for (var i = 0; i < numNodes; i++) {

          figureEl = thumbElements[i]; // 

          // include only element nodes 
          if (figureEl.nodeType !== 1) {
            continue;
          }

          linkEl = figureEl.children[0]; // 

          size = linkEl.getAttribute('data-size').split('x');
          type = linkEl.getAttribute('data-type');
          target = linkEl.getAttribute('data-target');
          // create slide object
          item = {
            src: linkEl.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10)
          };

          if (figureEl.children.length > 1) {
            item.title = figureEl.children[1].innerHTML;
          }

          if (linkEl.children.length > 0) {
            item.msrc = linkEl.children[0].getAttribute('src');
            item.type = type;
            item.target = target;
            item.html = '<video src="' + target + '" controls="controls" autoplay="autoplay"></video>';
            if (type === 'video') {
              //item.src = null;
            }
          }

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
        }

        return items;
      };

      // find nearest parent element
      var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
      };

      // triggers when user clicks on thumbnail
      var onThumbnailsClick = function onThumbnailsClick(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
          return el.tagName && el.tagName.toUpperCase() === 'FIGURE';
        });

        if (!clickedListItem) {
          return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,

          // childNodes = clickedListItem.parentNode.childNodes,
          // numChildNodes = childNodes.length,
          childNodes = document.getElementsByClassName('thumb'),
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;

        for (var i = 0; i < numChildNodes; i++) {
          if (childNodes[i].nodeType !== 1) {
            continue;
          }

          if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }

        if (index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe(index, clickedGallery);
        }
        return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      var photoswipeParseHash = function photoswipeParseHash() {
        var hash = window.location.hash.substring(1),
          params = {};

        if (hash.length < 5) {
          return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
          if (!vars[i]) {
            continue;
          }
          var pair = vars[i].split('=');
          if (pair.length < 2) {
            continue;
          }
          params[pair[0]] = pair[1];
        }

        if (params.gid) {
          params.gid = parseInt(params.gid, 10);
        }

        return params;
      };

      var openPhotoSwipe = function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;

        items = parseThumbnailElements(galleryElement);
        // define options (if needed)
        options = {

          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),

          getThumbBoundsFn: function getThumbBoundsFn(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            var thumbnail = items[index].el.getElementsByTagName('img')[0],
              // find thumbnail
              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect();

            return {
              x: rect.left,
              y: rect.top + pageYScroll,
              w: rect.width
            };
          }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used 
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (var j = 0; j < items.length; j++) {
              if (items[j].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
          return;
        }

        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();

        var $tempVideo;
        var stopVideoHandle = function stopVideoHandle() {
          if ($tempVideo) {
            $tempVideo.remove();
            $tempVideo = null;
          }
        };
        var changeHandle = function changeHandle() {
          var item = gallery.currItem;
          stopVideoHandle();
          if (item.type === 'video') {
            var $ctn = item.container;
            var style = $ctn.getElementsByClassName('pswp__img')[0].style;
            var $video = document.createElement('video');
            $video.setAttribute('autoplay', 'autoplay');
            $video.setAttribute('controls', 'controls');
            $video.setAttribute('src', item.target);
            $video.style.width = style.width;
            $video.style.height = style.height;
            $video.style.position = 'absolute';
            $video.style.zIndex = 2;
            $tempVideo = $video;
            $ctn.appendChild($video);
          }
        };
        gallery.listen('initialZoomIn', changeHandle);
        gallery.listen('afterChange', changeHandle);
        gallery.listen('initialZoomOut', stopVideoHandle);
      };

      // loop through all gallery elements and bind events
      var galleryElements = document.querySelectorAll(gallerySelector);
      for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
      }
    };

    var Viewer = function() {
      function init() {
        initPhotoSwipeFromDOM('.photos');
      }
      return {
        init: init
      };
    }();

    module.exports = Viewer;

    /***/
  },
  /* 3 */
  /***/
  function(module, exports) {

    /* WEBPACK VAR INJECTION */
    (function(global) {
      module.exports = inViewport;

      var instances = [];
      var supportsMutationObserver = typeof global.MutationObserver === 'function';

      function inViewport(elt, params, cb) {
        var opts = {
          container: global.document.body,
          offset: 0
        };

        if (params === undefined || typeof params === 'function') {
          cb = params;
          params = {};
        }

        var container = opts.container = params.container || opts.container;
        var offset = opts.offset = params.offset || opts.offset;

        for (var i = 0; i < instances.length; i++) {
          if (instances[i].container === container) {
            return instances[i].isInViewport(elt, offset, cb);
          }
        }

        return instances[
          instances.push(createInViewport(container)) - 1
        ].isInViewport(elt, offset, cb);
      }

      function addEvent(el, type, fn) {
        if (el.attachEvent) {
          el.attachEvent('on' + type, fn);
        } else {
          el.addEventListener(type, fn, false);
        }
      }

      function debounce(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this,
            args = arguments;
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);

          function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          }
        };
      }

      // https://github.com/jquery/sizzle/blob/3136f48b90e3edc84cbaaa6f6f7734ef03775a07/sizzle.js#L708
      var contains = function() {
        if (!global.document) {
          return true;
        }
        return global.document.documentElement.compareDocumentPosition ?
          function(a, b) {
            return !!(a.compareDocumentPosition(b) & 16);
          } :
          global.document.documentElement.contains ?
          function(a, b) {
            return a !== b && (a.contains ? a.contains(b) : false);
          } :
          function(a, b) {
            while (b = b.parentNode) {
              if (b === a) {
                return true;
              }
            }
            return false;
          };
      }

      function createInViewport(container) {
        var watches = createWatches();

        var scrollContainer = container === global.document.body ? global : container;
        var debouncedCheck = debounce(watches.checkAll(watchInViewport), 15);

        addEvent(scrollContainer, 'scroll', debouncedCheck);

        if (scrollContainer === global) {
          addEvent(global, 'resize', debouncedCheck);
        }

        if (supportsMutationObserver) {
          observeDOM(watches, container, debouncedCheck);
        }

        // failsafe check, every 200ms we check for visible images
        // usecase: a hidden parent containing eleements
        // when the parent becomes visible, we have no event that the children
        // became visible
        setInterval(debouncedCheck, 150);

        function isInViewport(elt, offset, cb) {
          if (!cb) {
            return isVisible(elt, offset);
          }

          var remote = createRemote(elt, offset, cb);
          remote.watch();
          return remote;
        }

        function createRemote(elt, offset, cb) {
          function watch() {
            watches.add(elt, offset, cb);
          }

          function dispose() {
            watches.remove(elt);
          }

          return {
            watch: watch,
            dispose: dispose
          };
        }

        function watchInViewport(elt, offset, cb) {
          if (isVisible(elt, offset)) {
            watches.remove(elt);
            cb(elt);
          }
        }

        function isVisible(elt, offset) {
          if (!contains(global.document.documentElement, elt) || !contains(global.document.documentElement, container)) {
            return false;
          }

          // Check if the element is visible
          // https://github.com/jquery/jquery/blob/740e190223d19a114d5373758127285d14d6b71e/src/css/hiddenVisibleSelectors.js
          if (!elt.offsetWidth || !elt.offsetHeight) {
            return false;
          }

          var eltRect = elt.getBoundingClientRect();
          var viewport = {};

          if (container === global.document.body) {
            viewport = {
              top: -offset,
              left: -offset,
              right: global.document.documentElement.clientWidth + offset,
              bottom: global.document.documentElement.clientHeight + offset
            };
          } else {
            var containerRect = container.getBoundingClientRect();
            viewport = {
              top: containerRect.top - offset,
              left: containerRect.left - offset,
              right: containerRect.right + offset,
              bottom: containerRect.bottom + offset
            };
          }

          // The element must overlap with the visible part of the viewport
          var visible =
            (
              (eltRect.right > viewport.left) &&
              (eltRect.left < viewport.right) &&
              (eltRect.bottom > viewport.top) &&
              (eltRect.top < viewport.bottom)
            );

          return visible;
        }

        return {
          container: container,
          isInViewport: isInViewport
        };
      }

      function createWatches() {
        var watches = [];

        function add(elt, offset, cb) {
          if (!isWatched(elt)) {
            watches.push([elt, offset, cb]);
          }
        }

        function remove(elt) {
          var pos = indexOf(elt);
          if (pos !== -1) {
            watches.splice(pos, 1);
          }
        }

        function indexOf(elt) {
          for (var i = watches.length - 1; i >= 0; i--) {
            if (watches[i][0] === elt) {
              return i;
            }
          }
          return -1;
        }

        function isWatched(elt) {
          return indexOf(elt) !== -1;
        }

        function checkAll(cb) {
          return function() {
            for (var i = watches.length - 1; i >= 0; i--) {
              cb.apply(this, watches[i]);
            }
          };
        }

        return {
          add: add,
          remove: remove,
          isWatched: isWatched,
          checkAll: checkAll
        };
      }

      function observeDOM(watches, container, cb) {
        var observer = new MutationObserver(watch);
        var filter = Array.prototype.filter;
        var concat = Array.prototype.concat;

        observer.observe(container, {
          childList: true,
          subtree: true,
          // changes like style/width/height/display will be catched
          attributes: true
        });

        function watch(mutations) {
          // some new DOM nodes where previously watched
          // we should check their positions
          if (mutations.some(knownNodes) === true) {
            setTimeout(cb, 0);
          }
        }

        function knownNodes(mutation) {
          var nodes = concat.call([],
            Array.prototype.slice.call(mutation.addedNodes),
            mutation.target
          );
          return filter.call(nodes, watches.isWatched).length > 0;
        }
      }

      /* WEBPACK VAR INJECTION */
    }.call(exports, (function() {
      return this;
    }())))

    /***/
  }
  /******/
]);