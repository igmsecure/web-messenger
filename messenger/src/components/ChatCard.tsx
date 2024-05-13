import { useState } from "react";
import {
  Typography,
  Avatar,
  TextField,
  CardActions,
  CardContent,
  CardHeader,
  Card,
  IconButton,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SendIcon from "@mui/icons-material/Send";
import Messages from "./Messages";


import { chatCardStyles } from './chatStyles';
import { MessageData, User } from '../types/interfaces';


const ChatCard = ({ user, webSocket }: { user: User, webSocket: WebSocket | null }) => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);

  // console.log(webSocket)

  if (webSocket) {
    webSocket.onopen = () => {
      console.log('Connected to server');
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [
        {
          sender: message.sender,
          payload: message.payload,
          time: message.time,
          isError: message.isError,
          type: "rec",
        },
        ...prevMessages,
      ]);
      console.log(messages);

      console.log('Received message:', message);
    };
  } else {
    console.error('User is not logged in');
  }

  const sendMessage = () => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 3);
    const formattedTime = currentTime.toISOString();
    if (webSocket) {
      webSocket.send(
        JSON.stringify({
          sender: user.username,
          payload: message.trim(),
          time: formattedTime,
        })
      );

      setMessages([
        {
          sender: user.username,
          payload: message.trim(),
          time: formattedTime,
          type: "sen",
        },
        ...messages,
      ]);
      setMessage("");
    }
  };


  const handleDisconnect = () => {
    if (webSocket) {
      webSocket.close();
      location.reload();
      console.log('Disconnected from server');
    } else {
      console.error('User is not logged in');
    }
  };

  return (
    <Card sx={chatCardStyles.card} style={chatCardStyles.cardStyle}>
      <CardHeader
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}
        sx={chatCardStyles.cardHeader}
        avatar={
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="current-user">
            <PersonIcon />
          </Avatar>
        }
        action={
          <div
            onClick={handleDisconnect}
            style={{ backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', marginRight: '10px', marginTop: '5px', color: 'white', padding: '5px', cursor: 'pointer' }}>
            <Typography variant="body1" style={{ color: 'white', paddingRight: '5px' }}>Выход</Typography>
            <IconButton color="inherit" style={{ padding: '0px', margin: '0px' }}>
              <ExitToAppIcon style={{ color: 'white' }} />
            </IconButton>
          </div>
        }
        title={user.username}
      />

      <CardContent sx={chatCardStyles.cardContentStyle}>
        <Messages messages={messages} />
      </CardContent>

      <CardActions disableSpacing style={{ background: grey[50] }}>
        <TextField
          sx={chatCardStyles.textField}
          hiddenLabel
          id="filled-hidden-label-small"
          variant="standard"
          size="small"
          multiline
          placeholder="Написать сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton
          aria-label="send-message"
          onClick={sendMessage}>
          <SendIcon
            style={{ color: !message ? 'grey' : 'black' }}
            sx={chatCardStyles.sendIcon}
          />
        </IconButton>
      </CardActions>
    </Card >
  );
};

export default ChatCard;
