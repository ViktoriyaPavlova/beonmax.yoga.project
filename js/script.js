window.addEventListener("DOMContentLoaded", function () {
  "use strict"; // событие срабатывает тогда, когда полностью подгузилось ДОМ-дерево
  let tab = document.querySelectorAll(".info-header-tab"), // доступ к заголовкам табов
    info = document.querySelector(".info-header"), //доступ к родителю табов
    tabContent = document.querySelectorAll(".info-tabcontent"); //доступ ко всем отдельным табам

  // функция скрывания табов
  function hideTabContent(a) {
    //один технический аргумент а
    for (let i = a; i < tabContent.length; i++) {
      tabContent[i].classList.remove("show"); //удаляем класс show
      tabContent[i].classList.add("hide"); //добавляем класс hide
    }
  }

  hideTabContent(1); // вызываем функцию, оставляем 1 таб видимым

  // функция показывания табов
  function showTabContent(b) {
    //один технический аргумент в
    if (tabContent[b].classList.contains("hide")) {
      //если таб содержит класс hide
      tabContent[b].classList.remove("hide"); // удаляем класс hide
      tabContent[b].classList.add("show"); //добавляем класс show
    }
  }

  //вешаем обработчик события на родителя
  info.addEventListener("click", function (event) {
    let target = event.target; //текущий элемент
    if (target && target.classList.contains("info-header-tab")) {
      //проверяем, что кликнули на нужный элемент
      for (let i = 0; i < tab.length; i++) {
        if (target == tab[i]) {
          //если текущий элемент совпадает с табом
          hideTabContent(0); // прячем все табы
          showTabContent(i); // показываем совпадающий таб
          break; //останавливаем цикл
        }
      }
    }
  });

  // Timer

  let deadline = "2024-06-21"; //время, до которого отсчитывает таймер, любое нужное

  // функция для подсчета промежутка времени между текущей датой и deadLine
  function getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date()), //переменная для подсчета разницы между deadline и текущей датой в милисекундах
      seconds = Math.floor((t / 1000) % 60), //количество секунд из милисекунд, округленное до целого числа; далее получаем остаток от целой минуты
      minutes = Math.floor((t / 1000 / 60) % 60), // количество минут
      hours = Math.floor(t / (1000 * 60 * 60)); // количество часов
    // days = Math.floor(t / (1000 * 60 * 60 * 24)) //количество дней

    // возвращаем объект
    return {
      total: t,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  // функция, которая делает статичную верстку динамичной
  function setClock(id, endtime) {
    let timer = document.getElementById(id), // получаем элемент таймер
      hours = timer.querySelector(".hours"),
      minutes = timer.querySelector(".minutes"),
      seconds = timer.querySelector(".seconds"),
      timeInterval = setInterval(updateClock, 1000); // добавляем интервал в 1 секунду

    // функция, обновляющая таймер каждую секунду
    function updateClock() {
      let t = getTimeRemaining(endtime);

      function addZero(num) {
        if (num <= 9) {
          return "0" + num;
        } else return num;
      }

      hours.textContent = addZero(t.hours); //количество оставшихся часов
      minutes.textContent = addZero(t.minutes); // количество оставшихся минут
      seconds.textContent = addZero(t.seconds); // количество оставшихся минут

      if (t.total <= 0) {
        //условие, при котором таймер остановится
        clearInterval(timeInterval);
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";
      }
    }
  }

  setClock("timer", deadline); //вызываем функцию динамической отрисовки таймера

  // Modal (модальное окно)

  let more = document.querySelector(".more"), // доступ к кнопке "узнать больше"
    overlay = document.querySelector(".overlay"), // доступ к модальному окну
    close = document.querySelector(".popup-close"); // доступ к кнопке закрытия модального окна

  more.addEventListener("click", function () {
    // обработчки события при клике на кнопку
    overlay.style.display = "block"; // модальное окно становится блочным
    this.classList.add("more-splash"); // через this обращаемся к кнопке, добавляем класс появления модалки
    document.body.style.overflow = "hidden"; // при показе модалки запрещаем прокрутку страницы
  });

  close.addEventListener("click", function () {
    // клик по кнопке, закрывающей модалку
    overlay.style.display = "none"; // убираем стили
    more.classList.remove("more-splash"); // показ модального окна, обращаемся к кнопке more
    document.body.style.overflow = ""; // отменяем запрет на прокрутку страницы при закрытии модального окна
  });

  // Form

  //объект с различными состояниями нашего запроса
  let message = {
    loading: "Загрузка...",
    success: "Спасибо! Скоро мы с вами свяжемся!",
    failure: "Что-то пошло не так...",
  };

  let form = document.querySelector(".main-form"), //получаем доступ к форме обратной связи в модальном окне
    input = form.getElementsByTagName("input"), //получаем доступ к инпутам
    statusMessage = document.createElement("div"); //создаем элемент для оповещения пользователя

  statusMessage.classList.add("status"); //добавляем оповещению новый класс

  form.addEventListener("submit", function (event) {
    event.preventDefault(); //отмена перезагрузки страницы и отправки запроса на сервер
    form.appendChild(statusMessage); //добавляем див со статусом

    let request = new XMLHttpRequest(); //новый конструктор
    request.open("POST", "server.php"); //настройка для отправки запроса
    request.setRequestHeader("Content-type", "application/json; charset=utf-8"); //настройка заголовка запроса

    let formData = new FormData(form); //получение всех данных, которые ввел пользователь

    //превращаем formData в JSON
    let obj = {}; //создаем новый объект
    formData.forEach(function (value, key) {
      obj[key] = value; //вставляем все данные из formData в этот объект
    });
    let json = JSON.stringify(obj); //переводим данные в формат JSON с помощью метода stringify

    request.send(json); //отправка данных на сервер

    //наблюдение за изменениями состояния нашего запроса
    request.addEventListener("readystatechange", function () {
      if (request.readyState < 4) {
        statusMessage.innerHTML = message.loading;
      } else if (request.readyState === 4 && request.status == 200) {
        statusMessage.innerHTML = message.success;
      } else {
        statusMessage.innerHTML = message.failure;
      }
    });

    //очистка всех импутов после отправки запросов на сервер
    for (let i = 0; i < input.length; i++) {
      input[i].value = "";
    }
  });

  // Slider

  let slideIndex = 1, // Переменная, отвечающая за слайд, который показывается на странице в текущий момент
    slides = document.querySelectorAll(".slider-item"), //все слайды
    prev = document.querySelector(".prev"), //стрелка назад
    next = document.querySelector(".next"), //стрелка вперед
    dotsWrap = document.querySelector(".slider-dots"), //обертка для точек
    dots = document.querySelectorAll(".dot"); //точки

  showSlides(slideIndex); //вызов функции до ее объявления, т.к. function declaration

  //функция показа слайда, который мы передаем
  function showSlides(n) {
    if (n > slides.length) {
      slideIndex = 1; //если слайды в карусели закончились, возвращаемся к первому слайду
    }
    if (n < 1) {
      slideIndex = slides.length;
    } //если мы листаем слайдер назад, то возвращаемся к последнему слайду

    //прячем все слайды
    slides.forEach((item) => (item.style.display = "none"));
    //либо так
    // for (let i = 0; i < slides.length; i++) {
    //     slides[i].style.display = 'none';
    // }
    dots.forEach((item) => item.classList.remove("dot-active")); //делаем точки неактивными

    slides[slideIndex - 1].style.display = "block"; //показываем тот слайд, который нам нужен (нумерация с нуля)
    dots[slideIndex - 1].classList.add("dot-active"); //показываем соответствующую точку
  }

  //функция, которая переходит к следующему слайду
  function plusSlides(n) {
    showSlides((slideIndex += n)); //вызываем здесь же первую функцию для показа текущего слайда
  }

  //текущий слайд, т.е.тыкаем на 4 точку, показ 4 слайда
  function currentSlide(n) {
    showSlides((slideIndex = n));
  }

  //реализация стрелки "назад"
  prev.addEventListener("click", function () {
    plusSlides(-1);
  });

  //реализация стрелки "вперед"
  next.addEventListener("click", function () {
    plusSlides(1);
  });

  //реализация кликабельности точек
  dotsWrap.addEventListener("click", function (event) {
    for (let i = 0; i < dots.length + 1; i++) {
      if (
        event.target.classList.contains("dot") && //если текущий элемент - точка
        event.target == dots[i - 1] // и номер точки
      ) {
        currentSlide(i); //вызываем функцию показа текущего слайда
      }
    }
  });

  // Calculator

  let persons = document.querySelectorAll(".counter-block-input")[0], // 1-ый инпут, куда пользователь вводит количество людей
    restDays = document.querySelectorAll(".counter-block-input")[1], //2-ой инпут, куда пользователь вводит количество дней
    place = document.getElementById("select"), //место, где будут отдыхать люди
    totalValue = document.getElementById("total"), //общая стоимость поездки
    personsSum = 0, // количество людей
    daysSum = 0, // количество дней
    total = 0; //общая стоимость

  totalValue.innerHTML = 0; //обнуляем значение общей стоимости

//работаем с 1-ым инпутом
  persons.addEventListener("change", function () {
    personsSum = +this.value; //записываем количество людей, что ввел пользователь
    total = (daysSum + personsSum) * 4000; //производим расчет по формуле

    //если одно поле пустое, то общая стоимость равна 0
    if (restDays.value == "" || persons.value == "") {
      totalValue.innerHTML = 0;
    } else {
      totalValue.innerHTML = total;
    }
  });

  //работаем со 2-ым инпутом
  restDays.addEventListener("change", function () {
    daysSum = +this.value;
    total = (daysSum + personsSum) * 4000;

    //если поле инпута пустое, то общая стоимость равна 0
    if (restDays.value == "" || persons.value == "") {
      totalValue.innerHTML = 0;
    } else {
      totalValue.innerHTML = total;
    }
  });

  //работаем с селектором с выбором мест отдыха
  place.addEventListener("change", function () {
    if (restDays.value == "" || persons.value == "") {
      totalValue.innerHTML = 0;
    } else {
      let a = total;
      totalValue.innerHTML = a * this.options[this.selectedIndex].value; //значение из HTML кода, соответствующее определенному элементу option
    }
  });
});
