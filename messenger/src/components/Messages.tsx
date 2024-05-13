import React, { useEffect, useRef } from "react";
import "../styles/MessageCard.css";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { MessageData } from '../types/interfaces';


interface MessagesProps {
  messages: MessageData[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="messages-card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      {messages.slice(0).reverse().map((message, index) => ( // обратное добавление сообщений
        <Message key={index} messageItem={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};



interface MessageProps {
  messageItem: MessageData;
}

interface User {
  id: string;
  username: string;
}


const Message: React.FC<MessageProps> = ({ messageItem }) => {

  const user = useAppSelector((state: RootState) => (state.auth.user as unknown) as User);

  return (
    <>
      {messageItem.isError && typeof messageItem.isError !== 'undefined' && messageItem.sender !== user.username ? (
        <div
          className={`message-box ${messageItem.sender === user.username
            ? "message-box-right"
            : "message-box-left"
            }`}
        >

          <Avatar
            sx={{
              width: 30,
              height: 30,
              margin: "10px 5px",
            }}
            aria-label="current-user"
          >
            <PersonIcon />
          </Avatar>

          <div>
            <div className="username">{messageItem.sender}</div>
            <div className="message" style={{ backgroundColor: "#FF0000" }}>
              <div className="message-text" style={{ color: "#FFFFFF" }}>

                Ошибка при доставке!

              </div>

              {messageItem.time && (
                <div className="message-time" style={{ color: "#FFFFFF" }}>
                  {new Date(new Date(messageItem.time).getTime() - 3 * 60 * 60 * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' })}
                </div>
              )}

            </div>
          </div>
        </div>
      ) : messageItem.type === 'rec' && messageItem.sender !== user.username ? (
        <div
          className={`message-box ${messageItem.sender === user.username
            ? "message-box-right"
            : "message-box-left"
            }`}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              margin: "10px 5px",
            }}
            aria-label="current-user"
          >
            <PersonIcon />
          </Avatar>

          <div>
            <div className="username">{messageItem.sender}</div>
            <div className="message">
              <div className="message-text">

                {messageItem.payload}

              </div>

              {messageItem.time && (
                <div className="message-time">
                  {new Date(new Date(messageItem.time).getTime() - 3 * 60 * 60 * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' })}
                </div>
              )}

            </div>
          </div>
        </div>

      ) : messageItem.type === 'sen' && messageItem.sender == user.username ? (
        <div
          className={`message-box ${messageItem.sender === user.username
            ? "message-box-right"
            : "message-box-left"
            }`}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              margin: "10px 5px",
            }}
            aria-label="current-user"
          >
            <PersonIcon />
          </Avatar>

          <div>
            <div className="username">{messageItem.sender}</div>
            <div className="message">
              <div className="message-text">

                {messageItem.payload}

              </div>

              {messageItem.time && (
                <div className="message-time">
                  {new Date(new Date(messageItem.time).getTime() - 3 * 60 * 60 * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' })}
                </div>
              )}

            </div>
          </div>
        </div>

      ) : (
        <div>
        </div>
      )}

    </>
  );
};

export default Messages;