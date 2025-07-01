'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import InitialScreen from './InitialScreen';
import WaitingScreen from './WaitingScreen';
import { createRoom, joinRoom, subscribeToRoom, Room } from '../firebase/db_handler';

type ScreenMode = 'initial' | 'waiting' | 'joining';

export default function TitleScreen() {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [screenMode, setScreenMode] = useState<ScreenMode>('initial');
  const [nameError, setNameError] = useState('');
  const [roomCodeError, setRoomCodeError] = useState('');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'success' | 'error' | 'info' });
  const [loading, setLoading] = useState(false);

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

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateRoom = async () => {
    if (!validateName(playerName)) return;
    
    setLoading(true);
    try {
      const newRoomCode = generateRoomCode();
      await createRoom(newRoomCode, playerName.trim());
      setRoomCode(newRoomCode);
      setScreenMode('waiting');
      showSnackbar('ルームを作成しました', 'success');
    } catch (error) {
      console.error('ルーム作成エラー:', error);
      showSnackbar('ルームの作成に失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
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
    setLoading(true);
    
    try {
      await joinRoom(joinRoomCode, playerName.trim());
      setRoomCode(joinRoomCode);
      setScreenMode('waiting');
      showSnackbar('ルームに参加しました', 'success');
    } catch (error: any) {
      console.error('ルーム参加エラー:', error);
      showSnackbar(error.message || 'ルームへの参加に失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    showSnackbar('ルームコードをコピーしました', 'success');
  };

  const resetToInitial = () => {
    setScreenMode('initial');
    setPlayerName('');
    setJoinRoomCode('');
    setRoomCode('');
    setNameError('');
    setRoomCodeError('');
    setCurrentRoom(null);
  };

  const handleNameChange = (name: string) => {
    if (nameError) validateName(name);
  };

  const handleRoomCodeChange = (code: string) => {
    if (roomCodeError) setRoomCodeError('');
  };

  // ルームの状態を監視
  useEffect(() => {
    if (roomCode && screenMode === 'waiting') {
      const unsubscribe = subscribeToRoom(roomCode, (room) => {
        setCurrentRoom(room);
        if (!room) {
          showSnackbar('ルームが削除されました', 'error');
          resetToInitial();
        }
      });

      return () => unsubscribe();
    }
  }, [roomCode, screenMode]);

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
            <InitialScreen
              playerName={playerName}
              setPlayerName={setPlayerName}
              joinRoomCode={joinRoomCode}
              setJoinRoomCode={setJoinRoomCode}
              nameError={nameError}
              roomCodeError={roomCodeError}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onNameChange={handleNameChange}
              onRoomCodeChange={handleRoomCodeChange}
              loading={loading}
            />
          )}

          {screenMode === 'waiting' && currentRoom && (
            <WaitingScreen
              playerName={playerName}
              roomCode={roomCode}
              currentRoom={currentRoom}
              onCopyRoomCode={copyRoomCode}
              onBack={resetToInitial}
            />
          )}

        </Box>
      </Box>

      {/* スナックバー */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
