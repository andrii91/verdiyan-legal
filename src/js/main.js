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
    
    // Initialize registration modal
    initRegistrationModal();
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize about us cards slider
    initAboutUsSlider();

    // Initialize animate on scroll
    initAnimateOnScroll();

    // Initialize privacy policy navigation
    initPrivacyPolicyNavigation();
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
      window.addEventListener('languageChanged', function(event) {
        // i18n will automatically update elements with data-i18n
        // Update all language selects
        const newLang = event.detail?.lang || window.i18n.getCurrentLang();
        updateAllLanguageSelects(newLang);
      });
    });
  }

  // Setup language selector change handler
  function setupLanguageSelector() {
    const $langSelects = $('.nav__select');
    
    // Set current language in all selects
    const currentLang = window.i18n.getCurrentLang();
    $langSelects.val(currentLang);
    
    // Handle language change in any select
    $langSelects.on('change', function() {
      const selectedLang = $(this).val();
      window.i18n.changeLang(selectedLang).then(function() {
        // Update all selects to reflect the new language
        updateAllLanguageSelects(selectedLang);
      });
    });
  }
  
  // Update all language selects to the specified language
  function updateAllLanguageSelects(lang) {
    $('.nav__select').val(lang);
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
    $(".nav__link[href^='#'], .btn[href^='#']:not([data-open-registration]), .scroll-link").click(function (e) {
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
        60
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

    // Handle click on "Cookies" link in footer
    $('.footer__cookies-link').on('click', function(e) {
      e.preventDefault();
      showCookieBanner();
    });
  }

  // Show cookie banner with animation
  function showCookieBanner() {
    const $banner = $('#cookie-banner');
    $banner.removeClass('cookie-banner--hidden');
    $banner.fadeIn(300);
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

  // Registration Modal
  function initRegistrationModal() {
    const $modal = $('#registration-modal');
    const $overlay = $('.registration-modal__overlay');
    const $closeBtn = $('.registration-modal__close');
    const $form = $('#registration-form');
    const $phoneInput = $('#phone');
    const $submitBtn = $('.registration-modal__submit');
    const $submitText = $('.submit-text');
    const $submitLoading = $('.submit-loading');

    // Initialize InputMask for phone using jQuery plugin
    if (typeof $.fn.inputmask !== 'undefined') {
      $phoneInput.inputmask({
        mask: '+9 (999) 999-9999',
        showMaskOnHover: true,
        showMaskOnFocus: true,
        clearIncomplete: true
      });
    }

    // Open modal function
    window.openRegistrationModal = function() {
      $modal.fadeIn(300);
      $('body').css('overflow', 'hidden');
      // Reset form when opening
      resetForm();
      // Ensure button is disabled initially
      updateSubmitButtonState();
    };

    // Close modal function
    function closeModal() {
      $modal.fadeOut(300);
      $('body').css('overflow', '');
      resetForm();
    }

    // Reset form function
    function resetForm() {
      $form[0].reset();
      clearErrors();
      hideMessages();
      setSubmitState(false);
      updateSubmitButtonState(); // Disable button when form is reset
    }

    // Clear all error messages
    function clearErrors() {
      $('.input-error').text('').hide();
      $('.input-control').removeClass('input-control--error');
      $('#form-error').hide();
    }

    // Hide all messages
    function hideMessages() {
      $('#form-error').hide();
      $('#form-success').hide();
    }

    // Set submit button state (loading state)
    function setSubmitState(loading) {
      if (loading) {
        $submitBtn.prop('disabled', true);
        $submitText.hide();
        $submitLoading.show();
      } else {
        updateSubmitButtonState();
        $submitText.show();
        $submitLoading.hide();
      }
    }

    // Update submit button state based on privacy policy checkbox
    function updateSubmitButtonState() {
      const $privacyCheckbox = $('#privacy-policy');
      const isChecked = $privacyCheckbox.is(':checked');
      $submitBtn.prop('disabled', !isChecked);
    }

    // Show error message for field
    function showFieldError(fieldId, message) {
      const $field = $('#' + fieldId);
      const $error = $('#' + fieldId + '-error');
      $field.addClass('input-control--error');
      $error.text(message).show();
    }

    // Clear field error
    function clearFieldError(fieldId) {
      const $field = $('#' + fieldId);
      const $error = $('#' + fieldId + '-error');
      $field.removeClass('input-control--error');
      $error.text('').hide();
    }

    // Validate form
    function validateForm() {
      let isValid = true;
      clearErrors();

      // Validate first name
      const firstName = $('#first-name').val().trim();
      if (!firstName || firstName.length < 2) {
        const errorMsg = window.i18n ? window.i18n.t('registration.errors.firstName') : 'First name must be at least 2 characters';
        showFieldError('first-name', errorMsg);
        isValid = false;
      }

      // Validate last name
      const lastName = $('#last-name').val().trim();
      if (!lastName || lastName.length < 2) {
        const errorMsg = window.i18n ? window.i18n.t('registration.errors.lastName') : 'Last name must be at least 2 characters';
        showFieldError('last-name', errorMsg);
        isValid = false;
      }

      // Validate email
      const email = $('#email').val().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        const errorMsg = window.i18n ? window.i18n.t('registration.errors.email') : 'Please enter a valid email address';
        showFieldError('email', errorMsg);
        isValid = false;
      }

      // Validate phone
      const phone = $('#phone').val().trim();
      if (!phone || phone.length < 10) {
        const errorMsg = window.i18n ? window.i18n.t('registration.errors.phone') : 'Please enter a valid phone number';
        showFieldError('phone', errorMsg);
        isValid = false;
      }

      // Validate message
      const message = $('#message').val().trim();
      if (!message || message.length < 10) {
        const errorMsg = window.i18n ? window.i18n.t('registration.errors.message') : 'Message must be at least 10 characters';
        showFieldError('message', errorMsg);
        isValid = false;
      }

      // Validate privacy policy
      if (!$('#privacy-policy').is(':checked')) {
        const errorMsg = window.i18n ? window.i18n.t('registration.errors.privacyPolicy') : 'You must agree to the privacy policy';
        showFieldError('privacy-policy', errorMsg);
        $('#privacy-policy-error').text(errorMsg).show();
        isValid = false;
      }

      return isValid;
    }

    // Real-time validation on blur
    $form.find('input, textarea').on('blur', function() {
      const fieldId = $(this).attr('id');
      if (fieldId) {
        clearFieldError(fieldId);
        // Re-validate this field
        validateForm();
      }
    });

    // Clear errors on input
    $form.find('input, textarea').on('input', function() {
      const fieldId = $(this).attr('id');
      if (fieldId) {
        clearFieldError(fieldId);
      }
    });

    // Handle privacy policy checkbox change
    $('#privacy-policy').on('change', function() {
      updateSubmitButtonState();
      // Clear error if checkbox is checked
      if ($(this).is(':checked')) {
        clearFieldError('privacy-policy');
        $('#privacy-policy-error').text('').hide();
      }
    });

    // Close on button click
    $closeBtn.on('click', function() {
      closeModal();
    });

    // Close on overlay click
    $overlay.on('click', function() {
      closeModal();
    });

    // Close on Escape key
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && $modal.is(':visible')) {
        closeModal();
      }
    });

    // Open modal on elements with data-open-registration attribute
    $(document).on('click', '[data-open-registration]', function(e) {
      e.preventDefault();
      openRegistrationModal();
    });

    // Handle form submission
    $form.on('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      if (!validateForm()) {
        const errorMsg = window.i18n ? window.i18n.t('registration.errors.general') : 'Please fill in all fields correctly';
        $('#form-error').text(errorMsg).show();
        return;
      }

      // Hide previous messages
      hideMessages();

      // Serialize form data
      const formData = $form.serialize();

      // Set loading state
      setSubmitState(true);

      // Send AJAX request
      $.ajax({
        url: 'send-email.php',
        type: 'POST',
        data: formData,
        dataType: 'json',
        success: function(response) {
          setSubmitState(false);
          
          if (response.success) {
            const successMsg = window.i18n ? window.i18n.t('registration.success') : 'Thank you for your message! We will contact you soon.';
            $('#form-success').text(successMsg).show();
            $form[0].reset();
            
            // Close modal after 2 seconds
            setTimeout(function() {
              closeModal();
            }, 2000);
          } else {
            const errorMsg = response.message || (window.i18n ? window.i18n.t('registration.errors.server') : 'An error occurred. Please try again.');
            $('#form-error').text(errorMsg).show();
          }
        },
        error: function(xhr, status, error) {
          setSubmitState(false);
          const errorMsg = window.i18n ? window.i18n.t('registration.errors.server') : 'An error occurred. Please try again later.';
          $('#form-error').text(errorMsg).show();
          console.error('Form submission error:', error);
        }
      });
    });
  }

  // Initialize mobile navigation
  function initMobileNavigation() {
    const $navList = $('[data-nav-list]');
    const $openNavListBtn = $('.nav__mobile-button');
    const $navMobile = $openNavListBtn.parents('.nav__mobile');
    const $nav = $('.nav');

    // Toggle mobile menu
    $openNavListBtn.on('click', function() {
      $navList.toggleClass('nav__list--active');
      $navMobile.toggleClass('nav__mobile--active');
      $nav.toggleClass('open-menu');
    });

    // Close mobile menu when clicking on a navigation link
    $navList.find('.nav__link, .btn').on('click', function() {
      if (isMobile()) {
        $navList.removeClass('nav__list--active');
        $navMobile.removeClass('nav__mobile--active');
        $nav.removeClass('open-menu');
      }
    });
  }

  // Initialize about us cards slider
  function initAboutUsSlider() {
    const $slider = $('.about-us__cards-slider-mobile');
    
    if ($slider.length === 0) {
      return;
    }

    // Check if slick is available
    if (typeof $.fn.slick === 'undefined') {
      console.warn('Slick slider is not loaded');
      return;
    }

    $slider.slick({
      dots: true,
      infinite: true,
      speed: 1500,
      variableWidth: true,
      arrows: false,
      autoplay: false
    });
  }

  // Initialize animate on scroll
function initAnimateOnScroll() {
  const fadeMap = {
    "fade-in": "fadeIn",
    "fade-in-right": "fadeInRight",
    "fade-in-left": "fadeInLeft",
    "fade-in-up": "fadeInUp",
  };

  const fadeClasses = Object.keys(fadeMap);
  let pending = [];

  fadeClasses.forEach(fadeClass => {
    document.querySelectorAll(`.${fadeClass}`).forEach(el => {
      el.classList.add("hidden_animation");
      pending.push(el);
    });
  });

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  function checkElements() {
    pending = pending.filter(el => {
      if (!isInViewport(el)) return true;

      for (const key of fadeClasses) {
        if (el.classList.contains(key)) {
          el.classList.add("visible", "animated", fadeMap[key]);
          el.classList.remove("hidden_animation");
          setTimeout(() => {
            el.classList.remove("animated", fadeMap[key]);
          }, 1000);
          break;
        }
      }
      return false;
    });

    if (pending.length === 0) {
      window.removeEventListener("scroll", checkElements);
      window.removeEventListener("resize", checkElements);
    }
  }

  window.addEventListener("scroll", checkElements, { passive: true });
  window.addEventListener("resize", checkElements, { passive: true });
  checkElements();
}

  // Initialize privacy policy navigation
  function initPrivacyPolicyNavigation() {
    const $privacyPolicyNavTitle = $('.privacy-policy__nav-title');

    $privacyPolicyNavTitle.on('click', function() {
      $(this).parent().find('.privacy-policy__nav-list').slideToggle(200);
      $(this).toggleClass('privacy-policy__nav-title--active');
    });
  }
})(jQuery);
