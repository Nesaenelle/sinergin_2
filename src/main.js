// alert(2);
import { isScrolledIntoView, scrollToAnimate, isInViewport } from './Utils.js'

let scrollInstance = new scrollToAnimate();


let directive = Vue.directive('animate', {

    bind: (el, binding, vnode) => {

    },
    // Когда привязанный элемент вставлен в DOM...
    inserted: (el, binding, vnode) => {
        let once = false;
        update();
        window.addEventListener('scroll', () => {
            if (!once) {
                update();
            }
        });

        function update() {
            if (isInViewport(el, 50)) {
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
    mounted() {
        [].forEach.call(document.querySelectorAll('img[data-src]'), (img) => {
            img.setAttribute('src', img.getAttribute('data-src'));
            img.onload = () => {
                img.removeAttribute('data-src');
            };
        });

        window.addEventListener('scroll', () => {
            this.onTop = document.documentElement.scrollTop > 300;
        });

        $('a[href^="#link-"]').on('click', (e) => {
            e.preventDefault();

            function scroll() {
                let elem = e.currentTarget.getAttribute('href');
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(elem).offset().top - 80
                }, 1000);
            }
            if ($('.reference').hasClass('active')) {
                scroll();
            } else {
                let $target = $('.reference__toggle');
                $target.next().stop().slideToggle(0);
                if (!$target.parent().hasClass('active')) {
                    $target.parent().addClass('active');
                }
                scroll();
            }
        })

        $('.hypothesis-list__item_text:first').slideDown(0);

        this.headerCheck();
        $(document).on('scroll', () => {
            this.headerCheck();
        });
        $(window).on('click', (e) => {
            var modal = $('.modal.opened');

            if (modal && e.target.contains(modal[0])) {
                this.closeModal();
            }
        });

        window.addEventListener('mousewheel', () => {
            scrollInstance.clear();
        });

        window.addEventListener('click', (e) => {
            if (!this.$refs.menu.contains(e.target)) {
                this.showMenu = false;
            }
        });

        let tabs = $('[data-navigation]');
        let links = $('header a[href]');

        window.addEventListener('scroll', () => {
            tabs.each((i, elem) => {
                if (isScrolledIntoView(elem, 110)) {
                    var id = elem.getAttribute('data-navigation');
                    links.each((i, link) => {
                        if (link.getAttribute('href').substr(1) === id) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, false);

        window.addEventListener('resize', () => {
            $('.efficiency-tooltip').each((i, element) => {
                this.tooltipPosition(element);
            });
        });

        $('.efficiency-tooltip').each((i, element) => {
            this.tooltipPosition(element);
        });
        $('.efficiency-tooltip').on('mouseenter', (e) => {
            this.tooltipPosition(e.currentTarget);
        });
    },
    methods: {
        goTop() {
            scrollInstance.animate(document.documentElement, 0, 1000);
        },
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        headerCheck() {
            if (document.documentElement.scrollTop > 200) {
                $('header').addClass('fixed');
            } else {
                $('header').removeClass('fixed');
            }
        },
        toggleAccordeonItem(e) {
            let target = e.currentTarget.parentNode;
            $(target).find('.hypothesis-list__item_text').stop().slideToggle(300);
            if (target.classList.contains('active')) {
                target.classList.remove('active');
            } else {
                target.classList.add('active');
            }
        },
        toggleReferenceItem(e) {
            let target = e.currentTarget;
            $(target).next().stop().slideToggle(300);
            if (target.parentNode.classList.contains('active')) {
                target.parentNode.classList.remove('active');
            } else {
                target.parentNode.classList.add('active');
            }
        },
        navigation(e) {
            e.preventDefault();
            var id = e.currentTarget.getAttribute('href').substr(1);
            var elem = document.querySelector(`[data-navigation="${id}"]`);
            let offset = elem.offsetTop - 99;
            if (id === 'home') {
                offset = 0;
            }
            if (elem) {
                scrollInstance.animate(document.documentElement, offset, 1000);
            }
        },
        openModal(name) {
            $('.modal').filter(`[data-id="${name}"]`).addClass('opened');
            $('.main-wrapper').addClass('opened');
        },
        closeModal() {
            $('.modal').removeClass('opened');
            $('.main-wrapper').removeClass('opened');
        },

        tooltipPosition(element) {
            let $tooltip = $(element);
            let $content = $(element).find('.efficiency-tooltip__content');
            let boundingTooltip = $tooltip[0].getBoundingClientRect();
            let boundingContent = $content[0].getBoundingClientRect();

            let hasSpaceRight = (boundingTooltip.right + boundingContent.width < window.innerWidth - 20);

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