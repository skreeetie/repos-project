import '../scss/style.scss';

const input = document.querySelector('#search');
const list = document.querySelector('.search-form__list');

async function getRepos(url) {
  const resp = await fetch(url);
  const data = await resp.json();
  const repos = [];
  if (data.items.length >= 5) {
    for (let i = 0; i < 5; i++) {
      const obj = {};
      obj.name = data.items[i].name;
      obj.owner = data.items[i].owner.login;
      obj.stars = data.items[i].stargazers_count;
      repos.push(obj);
    }
  } else if (data.items.length > 0) {
    for (let i = 0; i < data.items.length; i++) {
      const obj = {};
      obj.name = data.items[i].name;
      obj.owner = data.items[i].owner.login;
      obj.stars = data.items[i].stargazers_count;
      repos.push(obj);
    }
  }
  return repos;
}

const debounce = (cb, time) => {
    let timeout = undefined;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => cb.apply(this, arguments), time);
    }
}

async function setList() {
  if (document.querySelectorAll('.search-form__item').length !== 0) {
    const values = document.querySelectorAll('.search-form__item');
    for (let item of values) {
      item.remove();
    }
  }
  if (/[a-zA-Zа-яА-Я]/.test(input.value.trim())) {
    const req = `https://api.github.com/search/repositories?q=${input.value}`;
    const items = await getRepos(req);
    if (items.length !== 0) {
      for (let info of items) {
        const item = document.createElement('li');
        item.classList.add('search-form__item');
        item.dataset.stars = info.stars;
        item.dataset.owner = info.owner;
        item.textContent = info.name;
        list.append(item);
      }
    }
  }
}

function toList(event) {
  console.log(event.target);
}

const setListDn = debounce(setList, 500);

input.addEventListener('input', setListDn);
list.addEventListener('click', evnt => {
  toList(evnt);
});

const reposl = document.querySelector('.search-section__repos-list');
reposl.addEventListener('click', evn => {
  console.log(evn.target.closest('button'));
});