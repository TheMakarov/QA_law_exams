'use strict';
(() => {
  const data = window.QA_DATA;
  const search = document.querySelector('#search');
  const subject = document.querySelector('#subject');
  const results = document.querySelector('#results');
  const tabs = [...document.querySelectorAll('[data-category]')];
  let category = 'all';
  const numbers = new Intl.NumberFormat('ar-MA');
  const statusLabels = {verify: 'يحتاج تأكيداً', conflict: 'معلومات متعارضة'};

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  [...new Set(data.map(item => item.subject))].sort((a, b) => a.localeCompare(b, 'ar')).forEach(name => {
    const option = element('option', '', name);
    option.value = name;
    subject.append(option);
  });
  for (const type of ['all', 'research', 'exam']) {
    document.querySelector(`#count-${type}`).textContent = numbers.format(data.filter(item => type === 'all' || item.category === type).length);
  }

  function card(item) {
    const details = element('details');
    details.id = item.id;
    const summary = element('summary');
    const number = element('span', 'q-number', String(data.indexOf(item) + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    const main = element('div', 'q-main');
    const meta = element('div', 'meta');
    meta.append(element('span', 'category', item.category === 'research' ? 'البحوث' : 'الامتحانات'), element('span', 'dot', '·'), element('span', '', item.subject));
    if (statusLabels[item.status]) meta.append(element('span', `badge ${item.status}`, statusLabels[item.status]));
    main.append(meta, element('div', 'q-title', item.question));
    const toggle = element('span', 'toggle');
    toggle.setAttribute('aria-hidden', 'true');
    summary.append(number, main, toggle);
    const answer = element('div', 'answer');
    answer.append(element('p', '', item.answer));
    if (item.link) {
      const link = element('a', 'external', 'عرض منشور نماذج الامتحانات ↗');
      link.href = item.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      answer.append(link);
    }
    const source = element('div', 'source');
    source.append(element('span', '', 'المصدر: ملخص من المحادثة، وليس اقتباساً حرفياً.'));
    item.sources.forEach(id => {
      const record = window.QA_SOURCES[id];
      source.append(element('span', '', `رسالة ${numbers.format(id)} · ${record.date} · ${record.time}`));
    });
    answer.append(source);
    details.append(summary, answer);
    return details;
  }

  function render() {
    const filtered = data.filter(item => (category === 'all' || item.category === category)
      && (subject.value === 'all' || item.subject === subject.value)
      && window.QASearch.matches(item, search.value));
    results.replaceChildren(...filtered.map(card));
    document.querySelector('#empty').hidden = filtered.length !== 0;
    document.querySelector('#clear').hidden = search.value.length === 0;
    document.querySelector('#result-count').textContent = `${numbers.format(filtered.length)} من ${numbers.format(data.length)} سؤالاً`;
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.category === category)));
  }

  search.addEventListener('input', render);
  subject.addEventListener('change', render);
  tabs.forEach(tab => tab.addEventListener('click', () => {category = tab.dataset.category; render();}));
  document.querySelector('#clear').addEventListener('click', () => {search.value = ''; render(); search.focus();});
  document.querySelector('#reset').addEventListener('click', () => {
    category = 'all'; subject.value = 'all'; search.value = ''; render(); search.focus();
  });
  render();
})();
