// Detect locale base path (works from any depth)
function getLocalePath() {
  var scripts = document.querySelectorAll('script[src*="i18n.js"]');
  if (scripts.length > 0) {
    var src = scripts[0].getAttribute('src');
    return src.replace(/js\/i18n\.js$/, 'locales/');
  }
  return '/static/locales/';
}

var SUPPORTED_LANGS = ['en', 'pt'];
var DEFAULT_LANG = 'en';

function getSavedLang() {
  return localStorage.getItem('ojlev_lang');
}

function getInitialLang() {
  var saved = getSavedLang();
  if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
  var browser = (navigator.language || navigator.userLanguage || DEFAULT_LANG).slice(0, 2);
  return SUPPORTED_LANGS.indexOf(browser) !== -1 ? browser : DEFAULT_LANG;
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    var val = key.split('.').reduce(function (o, k) { return o && o[k]; }, t);
    if (val !== undefined && val !== null) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-placeholder');
    var val = key.split('.').reduce(function (o, k) { return o && o[k]; }, t);
    if (val !== undefined && val !== null) el.setAttribute('placeholder', val);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-title');
    var val = key.split('.').reduce(function (o, k) { return o && o[k]; }, t);
    if (val !== undefined && val !== null) el.setAttribute('title', val);
  });
  // Update lang switcher active state
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === window._currentLang);
  });
  // Update html lang attribute
  document.documentElement.setAttribute('lang', window._currentLang);
}

function loadLang(lang, callback) {
  var path = getLocalePath() + lang + '/translation.json';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          callback(JSON.parse(xhr.responseText));
        } catch (e) {
          console.error('i18n: failed to parse', path, e);
        }
      } else {
        console.error('i18n: could not load', path, xhr.status);
      }
    }
  };
  xhr.send();
}

function setLang(lang) {
  if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
  window._currentLang = lang;
  localStorage.setItem('ojlev_lang', lang);
  loadLang(lang, function (translations) {
    window._translations = translations;
    applyTranslations(translations);
  });
}

// Wire up language buttons (works even if buttons are added after DOMContentLoaded)
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.lang-btn');
  if (btn) {
    var lang = btn.getAttribute('data-lang');
    if (lang) setLang(lang);
  }
});

function t(key) {
  var translations = window._translations;
  if (!translations) return key;
  return key.split('.').reduce(function (o, k) { return o && o[k]; }, translations) || key;
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  setLang(getInitialLang());
});
