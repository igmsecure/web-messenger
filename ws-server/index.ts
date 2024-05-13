import http from "http";
import axios from "axios";
import WebSocket from "ws";
import express from "express";
import swaggerUi from "swagger-ui-express";
// import * as swaggerDocument from "./swagger/openapi.json";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.json());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

type MessageData = {
  sender: string;
  payload: string;
  time: Date;
  isError?: boolean;
};

type Connection = {
  id: number;
  ws: WebSocket;
};

type ConectionsData = {
  [key: string]: Connection;
};

let connections: ConectionsData = {};
// await axios("http://localhost:3001/send", {

// Отправка сообщения на транспортный уровень
const sendMessageToAnotherLevel = async (message: MessageData) => {
  try {
    await axios("http://192.168.52.44:8000/send/", {
      method: "POST",
      data: message,
    });
  } catch (error) {
    console.log('--------------------------------');
    console.log('Ошибка отправки сообщения на транспортный уровень', error);
    console.log('--------------------------------');
  }
};

const sendMessageToOtherUsers = (message: MessageData) => {
  for (const [key, value] of Object.entries(connections)) {

    value.ws.send(JSON.stringify(message)); // Отправляем все пользователям кроме отправителя

  }
};

//Метод для получения сообщений с транспортного уровня
app.post("/receive", (req, res) => {
  const message: MessageData = req.body;
  sendMessageToOtherUsers(message);
  console.log(message)
  res.sendStatus(200);
});

wss.on("connection", (ws, req: any) => {
  console.log('--------------------------------');
  console.log('Клиент подключился к серверу!');
  const url = new URL(req.url, `http://${req.headers.host}`);
  const username = url.searchParams.get("username");
  console.log('Имя клиента: ', username);
  console.log('--------------------------------');

  if (username) {
    // Проверяем, есть ли уже подключение для данного пользователя
    if (connections[username]) {
      // Если подключение уже существует, закрываем его
      connections[username].ws.close();
    }
    // Добавляем новое подключение
    connections[username] = { id: Date.now(), ws: ws };
  } else {
    ws.close();
  }

  ws.on("message", (message) => {
    try {
      // Получение сообщения от отправителя с браузера отправителя
      const messageString = message.toString();
      const messageJSON = JSON.parse(messageString);
      console.log(messageJSON);

      sendMessageToAnotherLevel(messageJSON);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  ws.on("close", () => {
    console.log('--------------------------------');
    console.log('Соединение закрыто! - ', username);
    console.log('--------------------------------');
    // Удаляем закрытое подключение из объекта connections при закрытии о
    if (username && connections[username]) {
      delete connections[username];
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log('--------------------------------');
  console.log(`Сервер запущен на порту - / :${port}`);
  console.log('--------------------------------');

});
