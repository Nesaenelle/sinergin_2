(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.isScrolledIntoView = isScrolledIntoView;
exports.offset = offset;
exports.isInViewport = isInViewport;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
function isScrolledIntoView(elem) {
  var offsetVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var docViewTop = window.pageYOffset;
  var docViewBottom = docViewTop + window.innerHeight;
  var elemTop = offset(elem).top;
  var elemBottom = elemTop + elem.clientHeight;
  return docViewTop >= elemTop - offsetVal /*- window.innerHeight*/; // /((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function offset(el) {
  var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
}

function isInViewport(el, offset) {
  var top = el.offsetTop + offset;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return top < window.pageYOffset + window.innerHeight && left < window.pageXOffset + window.innerWidth && top + height > window.pageYOffset && left + width > window.pageXOffset;
};

var scrollToAnimate = exports.scrollToAnimate = function () {
  function scrollToAnimate(element, to, duration) {
    _classCallCheck(this, scrollToAnimate);

    this.increment = 20;
    this.setTimeoutInst = null;
  }

  _createClass(scrollToAnimate, [{
    key: "animate",
    value: function animate(element, to, duration) {
      clearTimeout(this.setTimeoutInst);
      this.currentTime = 0;
      this.element = element;
      this.duration = duration;
      this.start = element.scrollTop;
      this.change = to - this.start;
      this.animateScroll();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.currentTime = 0;
      clearTimeout(this.setTimeoutInst);
    }
  }, {
    key: "animateScroll",
    value: function animateScroll() {
      this.currentTime += this.increment;
      var val = Math.easeInOutQuad(this.currentTime, this.start, this.change, this.duration);
      this.element.scrollTop = val;
      if (this.currentTime < this.duration) {
        this.setTimeoutInst = setTimeout(this.animateScroll.bind(this), this.increment);
      } else {
        this.currentTime = 0;
      }
    }
  }]);

  return scrollToAnimate;
}();

},{}],2:[function(require,module,exports){
'use strict';

var _Utils = require('./Utils.js');

var scrollInstance = new _Utils.scrollToAnimate(); // alert(2);


var directive = Vue.directive('animate', {

    bind: function bind(el, binding, vnode) {},
    // Когда привязанный элемент вставлен в DOM...
    inserted: function inserted(el, binding, vnode) {
        var once = false;
        update();
        window.addEventListener('scroll', function () {
            if (!once) {
                update();
            }
        });

        function update() {
            if ((0, _Utils.isInViewport)(el, 50)) {
                el.classList.add(binding.value);
                if (binding.arg === 'once') {
                    once = true;
                }
            } else {
                el.classList.remove(binding.value);
            }
        }
    }
    // update: function() {

    // }
});
Vue.use(directive);

var app = new Vue({
    el: '#app',
    data: {
        showMenu: false,
        onTop: false
    },
    mounted: function mounted() {
        var _this = this;

        [].forEach.call(document.querySelectorAll('img[data-src]'), function (img) {
            img.setAttribute('src', img.getAttribute('data-src'));
            img.onload = function () {
                img.removeAttribute('data-src');
            };
        });

        window.addEventListener('scroll', function () {
            _this.onTop = document.documentElement.scrollTop > 300;
        });

        $('a[href^="#link-"]').on('click', function (e) {
            e.preventDefault();

            function scroll() {
                var elem = e.currentTarget.getAttribute('href');
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(elem).offset().top - 80
                }, 1000);
            }
            if ($('.reference').hasClass('active')) {
                scroll();
            } else {
                var $target = $('.reference__toggle');
                $target.next().stop().slideToggle(0);
                if (!$target.parent().hasClass('active')) {
                    $target.parent().addClass('active');
                }
                scroll();
            }
        });

        $('.hypothesis-list__item_text:first').slideDown(0);

        this.headerCheck();
        $(document).on('scroll', function () {
            _this.headerCheck();
        });
        $(window).on('click', function (e) {
            var modal = $('.modal.opened');

            if (modal && e.target.contains(modal[0])) {
                _this.closeModal();
            }
        });

        window.addEventListener('mousewheel', function () {
            scrollInstance.clear();
        });

        window.addEventListener('click', function (e) {
            if (!_this.$refs.menu.contains(e.target)) {
                _this.showMenu = false;
            }
        });

        var tabs = $('[data-navigation]');
        var links = $('header a[href]');

        window.addEventListener('scroll', function () {
            tabs.each(function (i, elem) {
                if ((0, _Utils.isScrolledIntoView)(elem, 110)) {
                    var id = elem.getAttribute('data-navigation');
                    links.each(function (i, link) {
                        if (link.getAttribute('href').substr(1) === id) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, false);

        window.addEventListener('resize', function () {
            $('.efficiency-tooltip').each(function (i, element) {
                _this.tooltipPosition(element);
            });
        });

        $('.efficiency-tooltip').each(function (i, element) {
            _this.tooltipPosition(element);
        });
        $('.efficiency-tooltip').on('mouseenter', function (e) {
            _this.tooltipPosition(e.currentTarget);
        });
    },

    methods: {
        goTop: function goTop() {
            scrollInstance.animate(document.documentElement, 0, 1000);
        },
        toggleMenu: function toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        headerCheck: function headerCheck() {
            if (document.documentElement.scrollTop > 200) {
                $('header').addClass('fixed');
            } else {
                $('header').removeClass('fixed');
            }
        },
        toggleAccordeonItem: function toggleAccordeonItem(e) {
            var target = e.currentTarget.parentNode;
            $(target).find('.hypothesis-list__item_text').stop().slideToggle(300);
            if (target.classList.contains('active')) {
                target.classList.remove('active');
            } else {
                target.classList.add('active');
            }
        },
        toggleReferenceItem: function toggleReferenceItem(e) {
            var target = e.currentTarget;
            $(target).next().stop().slideToggle(300);
            if (target.parentNode.classList.contains('active')) {
                target.parentNode.classList.remove('active');
            } else {
                target.parentNode.classList.add('active');
            }
        },
        navigation: function navigation(e) {
            e.preventDefault();
            var id = e.currentTarget.getAttribute('href').substr(1);
            var elem = document.querySelector('[data-navigation="' + id + '"]');
            var offset = elem.offsetTop - 99;
            if (id === 'home') {
                offset = 0;
            }
            if (elem) {
                scrollInstance.animate(document.documentElement, offset, 1000);
            }
        },
        openModal: function openModal(name) {
            $('.modal').filter('[data-id="' + name + '"]').addClass('opened');
            $('.main-wrapper').addClass('opened');
        },
        closeModal: function closeModal() {
            $('.modal').removeClass('opened');
            $('.main-wrapper').removeClass('opened');
        },
        tooltipPosition: function tooltipPosition(element) {
            var $tooltip = $(element);
            var $content = $(element).find('.efficiency-tooltip__content');
            var boundingTooltip = $tooltip[0].getBoundingClientRect();
            var boundingContent = $content[0].getBoundingClientRect();

            var hasSpaceRight = boundingTooltip.right + boundingContent.width < window.innerWidth - 20;

            if (hasSpaceRight) {
                $content.addClass('left');
                $content.removeClass('right');
            } else {
                $content.addClass('right');
                $content.removeClass('left');
            }
        }
    }
});

},{"./Utils.js":1}]},{},[2]);
