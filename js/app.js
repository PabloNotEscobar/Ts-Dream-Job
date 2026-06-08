(function () {
  const PAGE_SIZE = 9;
  const LOAD_STEP = 6;

  const grid = document.querySelector('[data-grid]');
  const tabsList = document.querySelector('[data-tabs]');
  const searchForm = document.querySelector('[data-search]');
  const searchInput = document.querySelector('[data-search-input]');
  const emptyMessage = document.querySelector('[data-empty]');
  const loadMoreButton = document.querySelector('[data-load-more]');

  const labelByKey = CATEGORIES.reduce((acc, item) => {
    acc[item.key] = item.label;
    return acc;
  }, {});

  const state = {
    category: 'all',
    query: '',
    visible: PAGE_SIZE
  };

  function countFor(key) {
    if (key === 'all') return COURSES.length;
    return COURSES.filter((course) => course.category === key).length;
  }

  function getFiltered() {
    const query = state.query.trim().toLowerCase();
    return COURSES.filter((course) => {
      const matchesCategory = state.category === 'all' || course.category === state.category;
      const matchesQuery = course.title.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }

  function renderTabs() {
    tabsList.innerHTML = CATEGORIES.map((item) => {
      const isActive = item.key === state.category ? ' tabs__item--active' : '';
      return `
        <li class="tabs__item${isActive}">
          <button class="tabs__button" type="button" data-category="${item.key}">
            <span class="tabs__label">${item.label}</span>
            <sup class="tabs__count">${countFor(item.key)}</sup>
          </button>
        </li>`;
    }).join('');
  }

  function cardTemplate(course) {
    return `
      <article class="card">
        <div class="card__image">
          <img class="card__photo" src="${course.image}" alt="${course.author}" loading="lazy">
        </div>
        <div class="card__body">
          <span class="card__category card__category--${course.category}">${labelByKey[course.category]}</span>
          <h2 class="card__title">${course.title}</h2>
          <div class="card__meta">
            <span class="card__price">$${course.price}</span>
            <span class="card__author">by ${course.author}</span>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const filtered = getFiltered();
    const visible = filtered.slice(0, state.visible);

    grid.innerHTML = visible.map(cardTemplate).join('');
    emptyMessage.hidden = filtered.length !== 0;
    loadMoreButton.hidden = state.visible >= filtered.length;
  }

  function setCategory(key) {
    if (state.category === key) return;
    state.category = key;
    state.visible = PAGE_SIZE;
    renderTabs();
    render();
  }

  tabsList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    setCategory(button.dataset.category);
  });

  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    state.visible = PAGE_SIZE;
    render();
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  loadMoreButton.addEventListener('click', () => {
    state.visible += LOAD_STEP;
    render();
  });

  renderTabs();
  render();
})();
