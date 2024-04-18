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
    let timer = document.getElementById(id),// получаем элемент таймер
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

      if (t.total <= 0) { //условие, при котором таймер остановится
        clearInterval(timeInterval);
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";
      }
    }
  }

  setClock("timer", deadline); //вызываем функцию динамической отрисовки таймера
});
