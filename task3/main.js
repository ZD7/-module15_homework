const wsUri = "wss://echo-ws-service.herokuapp.com";

const chatOutput = document.querySelector(".chat_output");

function writeToChat(message, isRecieved) {
    let messageHTML = `<div class="${isRecieved? "recieved" : "sent"}">${message}</div>`;
    chatOutput.innerHTML += messageHTML;
}

function pageLoaded() {
  const infoOutput = document.querySelector(".info_output");
  const input = document.querySelector("input");
  const sendBtn = document.querySelector(".btn_send");
  
  let socket = new WebSocket(wsUri);
  
  socket.onopen = () => {
    infoOutput.innerText = "Соединение установлено";
  }
  
  socket.onmessage = (event) => {
    writeToChat(event.data, true);
  }
  
  socket.onerror = () => {
    infoOutput.innerText = "При передаче данных произошла ошибка";
  }
  
  sendBtn.addEventListener("click", sendMessage);
  
  function sendMessage() {
    if (!input.value) return;
    socket.send(input.value);
    writeToChat(input.value, false);
    input.value = "";
  }
}

document.addEventListener("DOMContentLoaded", pageLoaded);

const geoBtn = document.querySelector('.geolocation');

// Функция, выводящая текст об ошибке
const error = () => {
  writeToChat('Невозможно получить ваше местоположение', false);
}

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  writeToChat(`<a href = ${href} class="red" target="_blank">Геолокация</a>`, false);
}

geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
	writeToChat('Geolocation не поддерживается вашим браузером', false);
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});