// eslint-disable-next-line func-names
(function () {
  'use strict';

  function getScrollY() {
    return window.scrollY || window.pageYOffset;
  }

  function noop() {}

  function getOffsetTop(element) {
    return element.getBoundingClientRect().top + getScrollY();
  }

  function normalize(scrollY) {
    const scrollLimit =
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) - document.documentElement.clientHeight;
    let normalizeY;

    normalizeY = Math.ceil(scrollY);
    normalizeY = Math.max(normalizeY, 0);
    normalizeY = Math.min(normalizeY, scrollLimit);
    return normalizeY;
  }

  // scrollToY
  function scrollToY(targetY, duration = 400, easing = 'swing', callback = noop) {
    const scrollY = window.scrollY || window.pageYOffset;
    const diffValue = targetY - scrollY;
    const startTime = Date.now();
    const easingFunctions = {
      linear(p) {
        return p;
      },
      swing(p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
      },
    };
    const easingName = easing in easingFunctions ? easing : 'swing';
    const update = () => {
      const currentTime = Date.now() - startTime;
      const percent = Math.min(currentTime / duration, 1);

      if (percent < 1) {
        const easePercent = easingFunctions[easingName](percent);

        window.scrollTo(0, diffValue * easePercent + scrollY);
        requestAnimationFrame(update);
      } else {
        window.scrollTo(0, targetY);
        callback();
      }
    };

    if (duration === 0) {
      window.scrollTo(0, targetY);
      callback();
    } else {
      requestAnimationFrame(update);
    }
  }

  // scrollTarget
  function scrollTarget(element, duration) {
    let targetY;

    if (element instanceof HTMLElement) {
      const headElement = document.querySelector('.l-header');

      targetY = getOffsetTop(element);
      if (headElement !== null) {
        targetY -= headElement.offsetHeight * 1.2;
      }
      targetY = normalize(targetY);
      scrollToY(targetY, duration);
    }
  }

  // hashScroll
  function hashScroll() {
    const { documentElement } = document;
    const protocolRegexp = /^(https?:|file:\/)\/\//;
    const currentAnchor = window.location.href.split('#');

    documentElement.addEventListener('click', (event) => {
      const eventElement = event.target.closest('a[href]');

      if (eventElement !== null && protocolRegexp.test(eventElement.href)) {
        const thisAnchor = eventElement.href.split('#');
        const targetElement =
          currentAnchor[0] === thisAnchor[0] && thisAnchor.length > 1
            ? document.getElementById(thisAnchor[1])
            : null;

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          eventElement.target === '_blank' ||
          'disableHashScroll' in eventElement.dataset ||
          targetElement === null
        ) {
          return;
        }

        scrollTarget(targetElement, 500);
        event.preventDefault();
      }
    });
    window.addEventListener('load', () => {
      const { hash } = window.location;
      const targetElement = hash ? document.getElementById(hash.substring(1)) : null;

      if (targetElement !== null) {
        scrollTarget(targetElement, 500);
        if ('replaceState' in window.history) {
          window.history.replaceState(
            '',
            document.title,
            window.location.pathname + window.location.search
          );
        }
      }
    });
  }

  // hamburgernMenu
  function hamburgernMenu() {
    const buttonElement = document.querySelector('.js-hamburger');
    let scrollPosition = 0;

    if (buttonElement === null) return;

    const targetElements = document.querySelectorAll(buttonElement.dataset.hamburgerTarget);

    if (targetElements.length === 0) return;

    targetElements.forEach((element) => {
      element.addEventListener('click', (event) => {
        const eventElement = event.target.closest('a[href]');

        if (
          !event.defaultPrevented &&
          eventElement !== null &&
          targetElements[0].classList.contains('_open')
        ) {
          buttonElement.click();
        }
      });
    });
    buttonElement.addEventListener('click', (event) => {
      event.preventDefault();
      targetElements.forEach((element) => {
        element.classList.toggle('_open');
      });
      if (targetElements.length > 0) {
        if (targetElements[0].classList.contains('_open')) {
          scrollPosition = getScrollY();
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.top = `${-scrollPosition}px`;
        } else {
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          window.scrollTo(0, scrollPosition);
        }
      }
    });
  }

  // imagesLoaded
  function imagesLoaded() {
    const promiseImagesLoaded = [];

    document.querySelectorAll('.js-imagesLoaded').forEach((element) => {
      promiseImagesLoaded.push(
        new Promise((resolve) => {
          window.imagesLoaded(element, { background: true }, () => {
            element.classList.add('-imagesLoaded');
            resolve();
          });
        })
      );
    });

    return Promise.all(promiseImagesLoaded);
  }

  // mainVisualSlider
  function mainVisualSlider() {
    document.querySelectorAll('.js-mainVisualSlider').forEach((element) => {
      const swiperContainerElement = element.querySelector('.swiper');
      const swiperSlideElements = element.querySelectorAll('.swiper-slide');

      if (swiperContainerElement === null || swiperSlideElements.length < 2) return;

      // eslint-disable-next-line no-new
      new Swiper(swiperContainerElement, {
        effect: 'fade',
        fadeEffect: {
          crossFade: true,
        },
        loop: true,
        speed: 2500,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    });
  }

  // accordion
  function accordion() {
    const accordionNodeList = document.querySelectorAll('.js-accordion');

    accordionNodeList.forEach((accordionElement) => {
      const buttonElement = accordionElement.querySelector('button');
      const contentElement = accordionElement.querySelector('div');
      let isAnimate = false;
      let storeHeight;

      contentElement.addEventListener('transitionend', (event) => {
        if (event.currentTarget === event.target) {
          // eslint-disable-next-line no-param-reassign
          event.target.style.display = '';
          // eslint-disable-next-line no-param-reassign
          event.target.style.height = '';
          isAnimate = false;
        }
      });

      buttonElement.addEventListener('click', (event) => {
        let elementHeight;

        event.preventDefault();
        if (isAnimate) {
          contentElement.style.height = accordionElement.classList.contains('_open')
            ? 0
            : `${storeHeight}px`;
        } else {
          contentElement.style.display = 'block';
          elementHeight = contentElement.getBoundingClientRect().height;
          if (accordionElement.classList.contains('_open')) {
            contentElement.style.height = `${elementHeight}px`;
            // eslint-disable-next-line no-unused-expressions
            contentElement.offsetHeight; // reflow
            contentElement.style.height = 0;
          } else {
            contentElement.style.height = 0;
            // eslint-disable-next-line no-unused-expressions
            contentElement.offsetHeight; // reflow
            contentElement.style.height = `${elementHeight}px`;
          }
          storeHeight = elementHeight;
          isAnimate = true;
        }
        if (accordionElement.classList.contains('_open')) {
          accordionElement.classList.remove('_open');
        } else {
          accordionElement.classList.add('_open');
        }
      });
    });
  }

  function bannerDisplayControl() {
    const scrollMagic = new ScrollMagic.Controller();
    const targetElement = document.querySelector('.c-buttons__pc');
    const footerElement = document.querySelector('.l-footer');

    if (targetElement === null || footerElement === null) return;

    new ScrollMagic.Scene({
      triggerElement: footerElement,
      triggerHook: 1,
      reverse: true,
    })
    .setClassToggle(targetElement, '_hide')
    .addTo(scrollMagic);
  }

  document.addEventListener('DOMContentLoaded', () => {
    hashScroll();
    hamburgernMenu();
    imagesLoaded();
    mainVisualSlider();
    accordion();
    bannerDisplayControl();
  });
})();

