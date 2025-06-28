import '../scss/style.scss';

const input = document.querySelector('#search');
const list = document.querySelector('.search-form__list');
const reposlist = document.querySelector('.search-section__repos-list');

async function getRepos(url) {
  const resp = await fetch(url);
  const data = await resp.json();
  const repos = [];
  if (data.items.length > 0) {
    for (let repo of data.items) {
      const obj = {};
      obj.name = repo.name;
      obj.owner = repo.owner.login;
      obj.stars = repo.stargazers_count;
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
    const req = `https://api.github.com/search/repositories?q=${input.value}&per_page=5`;
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
  const repo = document.createElement('li');
  repo.classList.add('search-section__item');
  const nameRepo = document.createElement('p');
  nameRepo.textContent = `Name: ${event.target.textContent}`;
  repo.append(nameRepo);
  const ownerRepo = document.createElement('p');
  ownerRepo.textContent = `Owner: ${event.target.dataset.owner}`;
  repo.append(ownerRepo);
  const starsRepo = document.createElement('p');
  starsRepo.textContent = `Stars: ${event.target.dataset.stars}`;
  repo.append(starsRepo);
  const button = document.createElement('button');
  button.classList.add('search-section__button');
  const icon = document.createElement('img');
  icon.src = './img/cross.svg';
  icon.alt = 'Remove';
  icon.width = '46';
  icon.height = '42';
  button.append(icon);
  repo.append(button);
  reposlist.append(repo);
  if (document.querySelectorAll('.search-form__item').length !== 0) {
    const values = document.querySelectorAll('.search-form__item');
    for (let item of values) {
      item.remove();
    }
  }
  input.value = '';
}

function removeRepo(event) {
  if (event.target.closest('button')) {
    event.target.closest('li').remove();
  }
}

const setListDn = debounce(setList, 500);

input.addEventListener('input', setListDn);
list.addEventListener('click', evnt => {
  toList(evnt);
});

reposlist.addEventListener('click', evnt => {
  removeRepo(evnt);
});