// Main JavaScript file
// jQuery is available globally
// Custom library code here

(function($) {
  'use strict';

  // Document ready
  $(document).ready(function() {
    console.log('jQuery is loaded and ready');
    
    // Your custom code here
    initApp();
  });

  function initApp() {
    // Initialize your application
    console.log('Application initialized');
    
    // Initialize i18n (internationalization)
    initI18n();
    
    // Navigation scroll handler
    initNavigationScroll();
    
    // Smooth scroll for anchor links
    initSmoothScroll();
    
    // Initialize cookie consent banner
    initCookieBanner();
  }

  // Initialize i18n system
  function initI18n() {
    // Wait for i18n module to be available
    if (typeof window.i18n === 'undefined') {
      console.error('i18n module not loaded');
      return;
    }
    
    // Initialize with stored language or default
    const defaultLang = window.i18n.getStoredLang() || 'cz';
    window.i18n.init(defaultLang).then(function() {
      // Setup language selector
      setupLanguageSelector();
      
      // Update cookie banner translations when language changes
      $(window).on('languageChanged', function() {
        // i18n will automatically update elements with data-i18n
        // No additional action needed
      });
    });
  }

  // Setup language selector change handler
  function setupLanguageSelector() {
    const $langSelect = $('.nav__select');
    
    // Set current language in select
    const currentLang = window.i18n.getCurrentLang();
    $langSelect.val(currentLang);
    
    // Handle language change
    $langSelect.on('change', function() {
      const selectedLang = $(this).val();
      window.i18n.changeLang(selectedLang);
    });
  }

  // Navigation scroll functionality
  function initNavigationScroll() {
    $(window).scroll(function () {
      return $(".nav").toggleClass("nav--fixed", $(window).scrollTop() > 0);
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    // Handle navigation links
    $(".nav__link[href^='#'], .btn[href^='#']").click(function (e) {
      e.preventDefault();
      var id = $(this).attr("href");
      
      // Check if target element exists
      if (!$(id).length) {
        return;
      }
      
      var top = $(id).offset().top;

      // Calculate offset based on navigation height
      let offset = $('.nav').outerHeight() || 0;
      // Add some extra space for better visibility
      offset += 20;

      $("body, html").animate(
        {
          scrollTop: top - offset,
        },
        600 // Animation duration in milliseconds
      );
    });
  }

  // Check if device is mobile
  function isMobile() {
    return $(window).width() < 768;
  }

  // Cookie Consent Banner
  function initCookieBanner() {
    // Check if user already made a choice
    const cookieConsent = getCookie('cookie_consent');
    
    if (!cookieConsent) {
      // Show banner if no choice was made
      $('#cookie-banner').fadeIn(300);
    }

    // Handle accept all
    $('.cookie-banner__accept').on('click', function() {
      setCookie('cookie_consent', 'accepted', 365); // Store for 1 year
      hideCookieBanner();
    });

    // Handle reject all
    $('.cookie-banner__reject').on('click', function() {
      setCookie('cookie_consent', 'rejected', 365); // Store for 1 year
      hideCookieBanner();
    });

    // Handle close button
    $('.cookie-banner__close').on('click', function() {
      // Don't set cookie on close, just hide banner temporarily
      hideCookieBanner();
      // Show again after 24 hours if no choice was made
      setCookie('cookie_banner_closed', 'true', 1);
    });
  }

  // Hide cookie banner with animation
  function hideCookieBanner() {
    $('#cookie-banner').fadeOut(300, function() {
      $(this).addClass('cookie-banner--hidden');
    });
  }

  // Cookie helper functions
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Example: Handle image lazy loading with WebP fallback
  function initWebPImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      images.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
    } else {
      // Fallback for browsers without native lazy loading
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // Initialize WebP image loading
  initWebPImages();

})(jQuery);
