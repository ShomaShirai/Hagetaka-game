'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Fade,
  Alert
} from '@mui/material';
import { PersonAdd, Login, ContentCopy } from '@mui/icons-material';

type ScreenMode = 'initial' | 'waiting' | 'joining';

export default function TitleScreen() {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [screenMode, setScreenMode] = useState<ScreenMode>('initial');
  const [nameError, setNameError] = useState('');
  const [roomCodeError, setRoomCodeError] = useState('');

  // 6桁のランダムなルームコードを生成
  const generateRoomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('名前を入力してください');
      return false;
    }
    if (name.trim().length > 10) {
      setNameError('名前は10文字以内で入力してください');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleCreateRoom = () => {
    if (!validateName(playerName)) return;
    
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setScreenMode('waiting');
  };

  const handleJoinRoom = () => {
    if (!validateName(playerName)) return;
    
    if (!joinRoomCode.trim()) {
      setRoomCodeError('ルームコードを入力してください');
      return;
    }
    
    if (joinRoomCode.length !== 6 || !/^\d+$/.test(joinRoomCode)) {
      setRoomCodeError('ルームコードは6桁の数字で入力してください');
      return;
    }
    
    setRoomCodeError('');
    // TODO: ルーム参加のロジック
    console.log(`プレイヤー ${playerName} がルーム ${joinRoomCode} に参加`);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const resetToInitial = () => {
    setScreenMode('initial');
    setPlayerName('');
    setJoinRoomCode('');
    setRoomCode('');
    setNameError('');
    setRoomCodeError('');
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', py: 2, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
        
        {/* タイトル */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
            ハゲタカのえじき
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            オンライン対戦ゲーム
          </Typography>
        </Box>

        {/* メインコンテンツ */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          
          {screenMode === 'initial' && (
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
                      if (nameError) validateName(e.target.value);
                    }}
                    error={!!nameError}
                    helperText={nameError}
                    sx={{ mb: 3 }}
                    placeholder="ニックネームを入力してください"
                  />

                  {/* チーム参加の場合のルームコード入力 */}
                  {screenMode === 'initial' && (
                    <TextField
                      fullWidth
                      label="ルームコード（参加する場合）"
                      variant="outlined"
                      value={joinRoomCode}
                      onChange={(e) => {
                        setJoinRoomCode(e.target.value);
                        if (roomCodeError) setRoomCodeError('');
                      }}
                      error={!!roomCodeError}
                      helperText={roomCodeError}
                      sx={{ mb: 3 }}
                      placeholder="6桁の数字を入力"
                      inputProps={{ maxLength: 6 }}
                    />
                  )}

                  {/* ボタン */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PersonAdd />}
                      onClick={handleCreateRoom}
                      sx={{ py: 1.5, fontSize: '1.1rem' }}
                    >
                      新しいルームを作成
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Login />}
                      onClick={handleJoinRoom}
                      sx={{ py: 1.5, fontSize: '1.1rem' }}
                    >
                      ルームに参加
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          )}

          {screenMode === 'waiting' && (
            <Fade in timeout={500}>
              <Card sx={{ width: '100%', boxShadow: 4 }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                    ルーム作成完了
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    プレイヤー: <strong>{playerName}</strong>
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
                      onClick={copyRoomCode}
                    >
                      コピー
                    </Button>
                  </Paper>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    このコードを他のプレイヤーに教えて、ルームに参加してもらいましょう
                  </Alert>

                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    参加者を待っています...
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={resetToInitial}
                      sx={{ flex: 1 }}
                    >
                      戻る
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ flex: 1 }}
                      disabled // TODO: 参加者が揃ったら有効化
                    >
                      ゲーム開始
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          )}

        </Box>
      </Box>
    </Container>
  );
}
