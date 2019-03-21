window.addEventListener("DOMContentLoaded", () => {
  'use strict';
  let tab = document.querySelectorAll('.info-header-tab'),
    info = document.querySelector('.info-header'),
    tabContent = document.querySelectorAll('.info-tabcontent');

  let hideTabContent = (a) => {
    for (let i = a; i < tabContent.length; i++) {
      tabContent[i].classList.remove('show');
      tabContent[i].classList.add('hide');
    }
  }
  hideTabContent(1);

  let showTabContent = (b) => {
    if (tabContent[b].classList.contains('hide')) {
      tabContent[b].classList.add('show');
      tabContent[b].classList.remove('hide');
    }
  }
  info.addEventListener('click', (event) => {
    let target = event.target;
    if (target && target.classList.contains('info-header-tab')) {
      for (let i = 0; i < tab.length; i++) {
        if (target == tab[i]) {
          hideTabContent(0);
          showTabContent(i);
          break;
        }
      }
    }
  });
  // Timer
  let deadline = '2019-04-01';

  function getTimeRemaning(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date()),
      seconds = Math.floor((t / 1000) % 60),
      minutes = Math.floor((t / 1000 / 60) % 60),
      hours = Math.floor((t / (1000 * 60 * 60)));
    return {
      'total': t,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  };

  function setClock(id, endtime) {
    let timer = document.getElementById(id),
      hours = timer.querySelector('.hours'),
      minutes = timer.querySelector('.minutes'),
      seconds = timer.querySelector('.seconds'),
      timeInterval = setInterval(updateClock, 1000);

    function updateClock() {
      let t = getTimeRemaning(endtime);
      if (t.hours < 10) {
        hours.textContent = '0' + t.hours;
      } else {
        hours.textContent = t.hours;
      }
      if (t.minutes < 10) {
        minutes.textContent = '0' + t.minutes;
      } else {
        minutes.textContent = t.minutes;
      }
      if (t.seconds < 10) {
        seconds.textContent = '0' + t.seconds;
      } else {
        seconds.textContent = t.seconds;
      }
      if (t.total < 0) {
        clearInterval(timeInterval);
        hours.textContent = '00';
        minutes.textContent = '00';
        seconds.textContent = '00';
      }
    }

  };
  setClock('timer', deadline);

  //modal 
  let more = document.querySelector('.more'),
    click = document.querySelector('#about'),
    overlay = document.querySelector('.overlay'),
    close = document.querySelector('.popup-close');

  function showModal(a) {
    overlay.style.display = 'block';
    a.classList.add('more-splash');
    document.body.style.overflow = 'hidden';
  }

  click.addEventListener('click', (event) => {
    if (event.target && event.target.matches('.description-btn') || event.target == more) {
      showModal(event.target);
    }
  });

  close.addEventListener('click', () => {
    overlay.style.display = 'none';
    more.classList.remove('more-splash');
    document.body.style.overflow = '';
  });

  //  Form

  let message = {
    loading: ' Загрузка...',
    success: ' Спасибо! Скоро мы с вами свяжемся!',
    failure: ' Что-то пошло не так'
  };

  let form = document.querySelector('.main-form'),
    input = form.getElementsByTagName('input')[0],
    statusMessage = document.createElement('div');
  statusMessage.classList.add('status');
  input.onkeyup = function () {
    this.value = this.value.replace(/[^(\d)|(,)?+]/g, "");
  };
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    form.appendChild(statusMessage);

    let reqest = new XMLHttpRequest();
    reqest.open('POST', 'server.php');
    reqest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    let formData = new FormData(form);
    reqest.send(formData);

    reqest.addEventListener('readystatechange', function () {
      if (reqest.readyState < 4) {
        statusMessage.innerHTML = message.loading;
      } else if (reqest.readyState === 4 && reqest.status == 200) {
        statusMessage.innerHTML = message.success;
      } else {
        statusMessage.innerHTML = message.failure;
      }
    });

    for (let i = 0; i < input.length; i++) {
      input[i].value = "";
    }

  });

  // FOOTER FORM
  let formContact = document.getElementById('form'),
    inputContact = formContact.getElementsByTagName('input');
  inputContact[1].onkeyup = function () {
    this.value = this.value.replace(/[^(\d)|(,)?+]/g, "");
  };

  formContact.addEventListener('submit', function (event) {
    event.preventDefault();
    formContact.appendChild(statusMessage);
    statusMessage.style.paddingTop = '20px';
    statusMessage.style.color = '#c78030';

    if (phonenumber(inputContact[1]) == true) {
      let request = new XMLHttpRequest();
      request.open('POST', 'server.php');
      request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

      let formData = new FormData(formContact);
      let obj = {};
      formData.forEach(function (value, key) {
        obj[key] = value;
      });
      let json = JSON.stringify(obj);
      request.send(json);
      request.addEventListener('readystatechange', function () {
        if (request.readyState < 4) {
          statusMessage.innerHTML = message.loading;
        } else if (request.readyState === 4 && request.status == 200) {
          statusMessage.innerHTML = message.success;
        } else {
          statusMessage.innerHTML = message.failure;
        }
      });
      for (let i = 0; i < inputContact.length; i++) {
        inputContact[i].value = '';
      }
    } else {
      statusMessage.innerHTML = 'Не коректный номер телефона';
    }
  });

  function phonenumber(inputVal) {
    let phoneNum = /^[\+]?[(]?[0-9]{3}[)]?[0-9]{6,9}$/im;
    if (inputVal.value.match(phoneNum)) {
      return true;
    } else {
      return false;
    }
  }
});