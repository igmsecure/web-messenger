import { useState } from 'react'
import { RootState } from "./store/store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { v4 as uuid } from "uuid";
import { addUser } from "./store/authSlice";
import UserLogin from "./components/UserLogin";
import ChatCard from "./components/ChatCard";

interface User {
  id: string;
  username: string;
}

import './App.css'

function App() {

  const dispatch = useAppDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => (state.auth.user as unknown) as User);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  const handleLogin = (username: string) => {
    if (username.trim() !== "") {
      const existingUser = user && user.username === username ? user : undefined;
      const requestedUser: { id: string, username: string; } = { id: '', username: username };
      if (existingUser) {
        requestedUser.id = existingUser.id;
      } else {
        requestedUser.id = uuid();
        dispatch(addUser(requestedUser));
      }
      const ws = new WebSocket(`ws://localhost:3000?username=${username}`);
      setWebSocket(ws);
      console.log(username, ' - Подключился к серверу');
      setIsLoggedIn(true);
    }
  };

  return (
    <>
      <div className="App">
        <div className="container">
          {isLoggedIn ? (
            <ChatCard user={user} webSocket={webSocket} />
          ) : (
            <UserLogin handleLogin={handleLogin} />
          )}
        </div>
      </div>
    </>
  )
}

export default App
