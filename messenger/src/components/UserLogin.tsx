// UserLogin.tsx
import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { cardStyles } from './loginStyles';

interface UserLoginProps {
  handleLogin: (name: string) => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ handleLogin }) => {

  const [name, setName] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleLoginClick = () => {
    handleLogin(name);
  };

  return (
    <Card sx={cardStyles.card}>
      <CardContent>
        <Typography
          textAlign="center"
          gutterBottom
          sx={cardStyles.typography}
        >
          Присоединиться к чату
        </Typography>
        <TextField
          label="Имя пользователя:"
          placeholder="Введите ваше имя"
          size="small"
          sx={cardStyles.textField}
          value={name}
          onChange={handleNameChange}
        />
        <br />
        <Button variant="contained" sx={cardStyles.button} onClick={handleLoginClick}>
          Войти
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserLogin;
