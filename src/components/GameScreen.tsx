'use client';

import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { gameStateAtom, updateGameStateFromRoom, currentPlayerAtom } from '@/lib/game-atoms';
import { subscribeToRoom } from '@/firebase/db_handler';
import SelectNumber from './select-number';
import RevealOtherCards from './reveal-other-cards';
import GameFinishedScreen from './GameFinishedScreen';
import { Container, Box, Typography, Button, Alert } from '@mui/material';

export default function GameScreen() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Firebaseからのリアルタイム更新を監視
  useEffect(() => {
    if (!gameState.roomCode || !isMounted) return;

    const unsubscribe = subscribeToRoom(gameState.roomCode, (room) => {
      if (!room) {
        return;
      }

      const updatedGameState = updateGameStateFromRoom(
        gameState,
        room,
        gameState.currentPlayerName || ''
      );
      
      setGameState(updatedGameState);
      
      // currentPlayerAtomも更新
      const updatedCurrentPlayer = updatedGameState.players.find(
        p => p.name === gameState.currentPlayerName
      );
      if (updatedCurrentPlayer) {
        setCurrentPlayer(updatedCurrentPlayer);
      }
    });

    return () => unsubscribe();
  }, [gameState.roomCode, isMounted]); // 依存配列から gameState.currentPlayerName と setGameState を削除

  // マウント前は何も表示しない
  if (!isMounted) {
    return null;
  }

  if (!gameState.room) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          ゲーム情報の読み込み中にエラーが発生しました。
        </Alert>
      </Container>
    );
  }

  switch (gameState.phase) {
    case 'selecting':
      return <SelectNumber />;
    case 'revealing':
      return <RevealOtherCards />;
    case 'finished':
      return <GameFinishedScreen />;
    default:
      return <SelectNumber />;
  }
}

