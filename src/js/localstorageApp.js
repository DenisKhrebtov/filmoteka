import { refs } from './refs';
import { cleanerElement } from './cleanerMarkup';
import { searchGenresById } from './genresList';
import { Notify } from 'notiflix';

const addCard = data => {
  const card = `<li class="film__item" id=${data.id}_wrap>
        <a class="film__link" id="${data.id}">
  <div class="film__wrap">
      <img src=${
        data.poster_path
          ? `https://image.tmdb.org/t/p/original${data.poster_path}`
          : img
      } class="film-item__img" alt="${data.title}" width="300">
  </div>
  <div class="wrap__film>
  <div class="film__title-wrap">
  <h3 class="film__title">${data.title}</h3>
  </div>
  <div class="film__genres-and-date">
  <p class="film__genres">${
    searchGenresById(data.genre_ids)
      ? searchGenresById(data.genre_ids)
      : 'Unknown genre'
  }</p>
  <p class="film__release-date">${
    data.release_date
      ? new Date(data.release_date).getFullYear()
      : 'Nobody know'
  }</p>
  <span class="film__vote">${data.vote_average}</span>
   </div>
   </div>
   </a>
   </li>`;
};

// создаю и инициализирую переменную для работы с localStorage
let localStorageData = JSON.parse(localStorage.getItem('localStorageData')) || {
  queueFilms: [],
  watchedFilms: [],
};

refs.infoFilmWrapEl.addEventListener('click', onInfoFilmWrapClick);

function onInfoFilmWrapClick(e) {
  let fetchDataArr = refs.fetchDataValue;

  // фильтр события только на кнопку
  if (e.target.nodeName !== 'BUTTON') {
    return;
  }
  // Get link on watchedBtn
  if (e.target.dataset.action === 'watched') {
    if (!refs.isLogin) {
      Notify.info('Please Sign in');
      return;
    }
    let watchedBtn = e.target;
    // Get id btn watched
    let idFilmWatched = +e.target.id;

    for (const filmObj of fetchDataArr) {
      if (filmObj.id === idFilmWatched) {
        let filmWatchedObjAdd = filmObj;

        if (!isExistsWatchedObjFilm(idFilmWatched)) {
          localStorageData.watchedFilms.push(filmWatchedObjAdd);
          localStorage.setItem(
            'localStorageData',
            JSON.stringify(localStorageData)
          );

          setStatusRemove(watchedBtn);
          if (
            window.location.pathname === '/filmoteka/my-library.html' ||
            window.location.pathname === '/my-library.html'
          ) {
            if (localStorage.getItem('Library') === 'watched') {
              addCard(filmObj);
            }
          }
        } else {
          removeObjFilm(localStorageData.watchedFilms, idFilmWatched);
          // localStorage.removeItem('localStorageData');
          if (
            window.location.pathname === '/filmoteka/my-library.html' ||
            window.location.pathname === '/my-library.html'
          ) {
            if (localStorage.getItem('Library') === 'watched') {
              cleanerElement(document.getElementById(filmObj.id + '_wrap'));
            }
            // cleanerElement(document.getElementById(filmObj.id + '_wrap'));
          }

          localStorage.setItem(
            'localStorageData',
            JSON.stringify(localStorageData)
          );
          setStatusAddToWatched(watchedBtn);
        }
      }
    }
  }

  if (e.target.dataset.action === 'queue') {
    if (!refs.isLogin) {
      Notify.info('Please Sign in');
      return;
    }
    let queueBtn = e.target;

    let idFilmQueue = +e.target.id;

    for (const filmObj of fetchDataArr) {
      if (filmObj.id === idFilmQueue) {
        let filmQueueObjAdd = filmObj;

        //Set queue value to localStorage
        if (!isExistsQueueObjFilm(idFilmQueue)) {
          localStorageData.queueFilms.push(filmQueueObjAdd);

          localStorage.setItem(
            'localStorageData',
            JSON.stringify(localStorageData)
          );

          setStatusRemove(queueBtn);
          if (
            window.location.pathname === '/filmoteka/my-library.html' ||
            window.location.pathname === '/my-library.html'
          ) {
            if (localStorage.getItem('Library') === 'queue') {
              addCard(filmObj);
            }
          }
        } else {
          removeObjFilm(localStorageData.queueFilms, idFilmQueue);
          localStorage.removeItem('localStorageData');
          if (
            window.location.pathname === '/filmoteka/my-library.html' ||
            window.location.pathname === '/my-library.html'
          ) {
            if (localStorage.getItem('Library') === 'queue') {
              cleanerElement(document.getElementById(filmObj.id + '_wrap'));
            }
          }
          localStorage.setItem(
            'localStorageData',
            JSON.stringify(localStorageData)
          );
          setStatusAddToQueue(queueBtn);
        }
      }
    }
  }
}

export function isExistsWatchedObjFilm(id) {
  let answer = false;

  for (const objFilm of localStorageData.watchedFilms) {
    if (objFilm.id === id) {
      answer = true;
    }
  }

  return answer;
}

export function isExistsQueueObjFilm(id) {
  let answer = false;

  for (const objQueueFilm of localStorageData.queueFilms) {
    if (objQueueFilm.id === id) {
      answer = true;
    }
  }

  return answer;
}

function removeObjFilm(localStorageOld, checkId) {
  for (let i = 0; i < localStorageOld.length; i++) {
    if (localStorageOld[i].id === checkId) {
      localStorageOld.splice(i, 1);
    }
  }
}

function setStatusRemove(btnRef) {
  console.log(btnRef.dataset.action);
  if (btnRef.dataset.action === 'watched') {
    console.log(1);
    btnRef.textContent = 'remove from watched';
    btnRef.classList.add('button-modal__checked');
  } else {
    btnRef.textContent = 'remove from queue';
    btnRef.classList.add('button-modal__checked');
  }
}

function setStatusAddToQueue(btnRef) {
  btnRef.textContent = 'add to queue';
  btnRef.classList.remove('button-modal__checked');
}

function setStatusAddToWatched(watchedBtnRef) {
  watchedBtnRef.textContent = 'add to watched';
  watchedBtnRef.classList.remove('button-modal__checked');
}
