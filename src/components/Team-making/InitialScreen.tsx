import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Fade,
  CircularProgress
} from '@mui/material';
import { PersonAdd, Login } from '@mui/icons-material';

interface InitialScreenProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  joinRoomCode: string;
  setJoinRoomCode: (code: string) => void;
  nameError: string;
  roomCodeError: string;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onNameChange: (name: string) => void;
  onRoomCodeChange: (code: string) => void;
  loading: boolean;
}

export default function InitialScreen({
  playerName,
  setPlayerName,
  joinRoomCode,
  setJoinRoomCode,
  nameError,
  roomCodeError,
  onCreateRoom,
  onJoinRoom,
  onNameChange,
  onRoomCodeChange,
  loading
}: InitialScreenProps) {
  return (
    <Fade in timeout={500}>
      <Card sx={{ width: '100%', boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            ゲームに参加
          </Typography>
          
          {/* 名前入力 */}
          <TextField
            fullWidth
            label="プレイヤー名"
            variant="outlined"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              onNameChange(e.target.value);
            }}
            error={!!nameError}
            helperText={nameError}
            sx={{ mb: 3 }}
            placeholder="ニックネームを入力してください"
            disabled={loading}
          />

          {/* ルームコード入力 */}
          <TextField
            fullWidth
            label="ルームコード（参加する場合）"
            variant="outlined"
            value={joinRoomCode}
            onChange={(e) => {
              setJoinRoomCode(e.target.value);
              onRoomCodeChange(e.target.value);
            }}
            error={!!roomCodeError}
            helperText={roomCodeError}
            sx={{ mb: 3 }}
            placeholder="6桁の数字を入力"
            inputProps={{ maxLength: 6 }}
            disabled={loading}
          />

          {/* ボタン */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <PersonAdd />}
              onClick={onCreateRoom}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
              disabled={loading}
            >
              新しいルームを作成
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <Login />}
              onClick={onJoinRoom}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
              disabled={loading}
            >
              ルームに参加
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
