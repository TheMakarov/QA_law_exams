/* Shared by the browser and the dependency-free Node tests. */
(function (root) {
  function normalize(value) {
    return String(value).normalize('NFKC').toLowerCase()
      .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
      .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function matches(item, query) {
    const text = normalize([item.question, item.answer, item.subject, ...item.tags].join(' '));
    return normalize(query).split(/\s+/).filter(Boolean).every(word => text.includes(word));
  }
  const api = { normalize, matches };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.QASearch = api;
})(typeof window !== 'undefined' ? window : globalThis);
