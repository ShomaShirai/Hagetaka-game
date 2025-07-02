import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Box,
  Fade,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { ContentCopy, Person } from '@mui/icons-material';
import { Room } from '../../firebase/db_handler';

interface WaitingScreenProps {
  playerName: string;
  roomCode: string;
  currentRoom: Room;
  onCopyRoomCode: () => void;
  onStartGame: () => void;
  onBackToInitial?: () => void;
  loading?: boolean;
}

export default function WaitingScreen({
  playerName,
  roomCode,
  currentRoom,
  onCopyRoomCode,
  onStartGame,
  onBackToInitial,
  loading = false
}: WaitingScreenProps) {
  const isHost = currentRoom.hostName === playerName;
  const canStartGame = currentRoom.players.length >= 2; // 最低2人でゲーム開始可能

  return (
    <Fade in timeout={500}>
      <Card sx={{ width: '100%', boxShadow: 4 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            {isHost ? 'ルーム作成完了' : 'ルームに参加中'}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            プレイヤー: <strong>{playerName}</strong>
            {isHost && <Chip label="ホスト" size="small" color="primary" sx={{ ml: 1 }} />}
          </Typography>

          <Typography variant="h6" sx={{ mb: 2 }}>
            ルームコード
          </Typography>
          
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              mb: 3, 
              backgroundColor: 'warning.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
              {roomCode}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ContentCopy />}
              onClick={onCopyRoomCode}
            >
              コピー
            </Button>
          </Paper>

          {/* 参加者リスト */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Person sx={{ mr: 1 }} />
              参加者 ({currentRoom.players.length}/{currentRoom.maxPlayers})
            </Typography>
            <Paper elevation={1} sx={{ maxHeight: 150, overflow: 'auto' }}>
              <List dense>
                {currentRoom.players.map((player, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={player}
                      secondary={player === currentRoom.hostName ? 'ホスト' : 'プレイヤー'}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            {isHost 
              ? 'このコードを他のプレイヤーに教えて、ルームに参加してもらいましょう' 
              : 'ホストがゲームを開始するまでお待ちください'
            }
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onBackToInitial || (() => {})}
              sx={{ flex: 1 }}
              disabled={loading}
            >
              戻る
            </Button>
            {isHost && (
              <Button
                variant="contained"
                onClick={onStartGame}
                sx={{ flex: 1 }}
                disabled={!canStartGame || loading}
              >
                {loading ? 'ゲーム開始中...' : `ゲーム開始 ${!canStartGame ? '(2人以上必要)' : ''}`}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
