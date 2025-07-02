'use client';

import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { gameStateAtom } from '@/lib/game-atoms';
import { subscribeToRoom } from '@/firebase/db_handler';
import SelectNumber from './select-number';
import RevealOtherCards from './reveal-other-cards';
import { Container, Box, Typography, Button, Alert } from '@mui/material';

export default function GameScreen() {
  const [gameState, setGameState] = useAtom(gameStateAtom);

  // Firebaseからのリアルタイム更新を監視
  useEffect(() => {
    if (!gameState.roomCode) return;

    const unsubscribe = subscribeToRoom(gameState.roomCode, (room) => {
      if (!room) {
        // ルームが削除された場合の処理
        return;
      }

      setGameState(prev => ({
        ...prev,
        room,
        phase: room.status === 'playing' ? 
          (Object.keys(room.playerMoves || {}).length === room.players.length ? 'revealing' : 'selecting') :
          room.status === 'finished' ? 'finished' : prev.phase,
        currentScoreCard: room.currentScoreCard || prev.currentScoreCard,
        currentRound: room.currentRound || prev.currentRound,
      }));
    });

    return () => unsubscribe();
  }, [gameState.roomCode, setGameState]);

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

// ゲーム終了画面コンポーネント
function GameFinishedScreen() {
  const [gameState] = useAtom(gameStateAtom);

  return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          ゲーム終了
        </Typography>
        <Typography variant="h6" gutterBottom>
          お疲れ様でした！
        </Typography>
        
        {/* スコアテーブルなどを表示 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            最終スコア
          </Typography>
          {gameState.players.map((player) => (
            <Box key={player.id} sx={{ p: 1, border: '1px solid #ccc', mb: 1 }}>
              <Typography>
                {player.name}: {player.score}点
              </Typography>
            </Box>
          ))}
        </Box>

        <Button 
          variant="contained" 
          sx={{ mt: 4 }}
          onClick={() => window.location.reload()}
        >
          新しいゲームを開始
        </Button>
      </Box>
    </Container>
  );
}
