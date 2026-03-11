// Simple i18n (Internationalization) module
// Easy to maintain and implement

(function(window) {
  'use strict';

  const i18n = {
    currentLang: 'cz',
    translations: {},
    
    // Initialize i18n
    init: function(lang) {
      this.currentLang = lang || this.getStoredLang() || 'cz';
      return this.loadTranslations(this.currentLang);
    },
    
    // Load translations from JSON file
    loadTranslations: function(lang) {
      const self = this;
      return fetch(`locales/${lang}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
          }
          return response.json();
        })
        .then(data => {
          self.translations = data;
          self.currentLang = lang;
          self.storeLang(lang);
          self.applyTranslations();
          return data;
        })
        .catch(error => {
          console.error('Error loading translations:', error);
          // Fallback to Czech if translation fails
          if (lang !== 'cz') {
            return self.loadTranslations('cz');
          }
        });
    },
    
    // Get translation by key (supports nested keys like "nav.specializations")
    t: function(key, defaultValue) {
      const keys = key.split('.');
      let value = this.translations;
      
      for (let i = 0; i < keys.length; i++) {
        if (value && typeof value === 'object') {
          value = value[keys[i]];
        } else {
          return defaultValue || key;
        }
      }
      
      return value || defaultValue || key;
    },
    
    // Apply translations to all elements with data-i18n attribute
    applyTranslations: function() {
      const elements = document.querySelectorAll('[data-i18n]');
      const self = this;
      
      elements.forEach(function(element) {
        const key = element.getAttribute('data-i18n');
        const translation = self.t(key);
        
        // Check if element is input/textarea (use placeholder or value)
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          const attr = element.getAttribute('data-i18n-attr') || 'placeholder';
          element.setAttribute(attr, translation);
        } else if (element.tagName === 'OPTION') {
          // For select options, update text content
          element.textContent = translation;
        } else {
          // For other elements, update text content or innerHTML
          if (element.hasAttribute('data-i18n-html')) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      });
      
      // Update page title if exists
      const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
      if (titleKey) {
        document.title = this.t(titleKey);
      }
      
      // Update meta description if exists
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const descKey = metaDesc.getAttribute('data-i18n');
        if (descKey) {
          metaDesc.setAttribute('content', this.t(descKey));
        }
      }
    },
    
    // Change language
    changeLang: function(lang) {
      const self = this;
      return this.loadTranslations(lang).then(function() {
        // Trigger custom event for other scripts
        window.dispatchEvent(new CustomEvent('languageChanged', {
          detail: { lang: lang }
        }));
      });
    },
    
    // Store language preference in localStorage
    storeLang: function(lang) {
      try {
        localStorage.setItem('preferredLanguage', lang);
      } catch (e) {
        console.warn('Could not store language preference:', e);
      }
    },
    
    // Get stored language preference
    getStoredLang: function() {
      try {
        return localStorage.getItem('preferredLanguage');
      } catch (e) {
        return null;
      }
    },
    
    // Get current language
    getCurrentLang: function() {
      return this.currentLang;
    }
  };
  
  // Export to global scope
  window.i18n = i18n;
  
})(window);
