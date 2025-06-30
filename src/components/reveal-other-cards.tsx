'use client';

import React, { useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Paper,
  Container,
  Button
} from '@mui/material';
import { useAtom } from 'jotai';
import { gameStateAtom, currentPlayerAtom } from '@/lib/atoms';
import ThreePlayerLayout from './layouts/ThreePlayerLayout';
import FourPlayerLayout from './layouts/FourPlayerLayout';
import FivePlayerLayout from './layouts/FivePlayerLayout';
import SixPlayerLayout from './layouts/SixPlayerLayout';
import PlayerCard from './PlayerCard';

export default function RevealOtherCards() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [currentPlayer] = useAtom(currentPlayerAtom);

  // CPUプレイヤーにランダムなカードをプレイさせる
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(player => {
          if (player.id !== currentPlayer?.id && !player.playedCard) {
            // CPUプレイヤーにランダムなカードをプレイさせる
            const availableCards = player.cards;
            const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
            return { 
              ...player, 
              playedCard: randomCard,
              cards: player.cards.filter(card => card !== randomCard)
            };
          }
          return player;
        })
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [setGameState, currentPlayer?.id]);

  // 他のプレイヤーを取得
  const otherPlayers = gameState.players.filter(p => p.id !== currentPlayer?.id);
  
  const handleNextRound = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'selecting',
      currentRound: prev.currentRound + 1,
      currentScoreCard: prev.scoreCards[Math.floor(Math.random() * prev.scoreCards.length)],
      players: prev.players.map(player => ({
        ...player,
        playedCard: null
      }))
    }));
  };

  // プレイヤー数に応じたレイアウト決定
  const renderPlayerLayout = () => {
    if (otherPlayers.length === 2) {
      return <ThreePlayerLayout otherPlayers={otherPlayers} currentScoreCard={gameState.currentScoreCard} />;
    } else if (otherPlayers.length === 3) {
      return <FourPlayerLayout otherPlayers={otherPlayers} currentScoreCard={gameState.currentScoreCard} />;
    } else if (otherPlayers.length === 4) {
      return <FivePlayerLayout otherPlayers={otherPlayers} currentScoreCard={gameState.currentScoreCard} />;
    } else if (otherPlayers.length === 5) {
      return <SixPlayerLayout otherPlayers={otherPlayers} currentScoreCard={gameState.currentScoreCard} />;
    } else {
      // 7人以上：グリッド配置
      return (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {otherPlayers.map((player, index) => (
              <Box key={player.id} sx={{ display: 'flex', justifyContent: 'center', minWidth: '30%' }}>
                <PlayerCard player={player} />
              </Box>
            ))}
          </Box>
          
          {/* 中央：現在のスコアカード */}
          <Box sx={{ textAlign: 'center', py: 4, flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              スコアカード
            </Typography>
            {gameState.currentScoreCard && (
              <Paper 
                elevation={6} 
                sx={{ 
                  p: 3, 
                  display: 'inline-block',
                  backgroundColor: gameState.currentScoreCard > 0 ? 'success.main' : 'error.main',
                  color: gameState.currentScoreCard > 0 ? 'success.contrastText' : 'error.contrastText'
                }}
              >
                <Typography variant="h2">
                  {gameState.currentScoreCard}
                </Typography>
              </Paper>
            )}
          </Box>
        </>
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', py: 2, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)'}}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          gap: 2
        }}
      >
        {/* 他のプレイヤーのカードとスコアカード */}
        {renderPlayerLayout()}
        
        {/* 下部：自分のカード */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ flexGrow: 1, maxWidth: "40%" }}>
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6" gutterBottom>
                あなた
              </Typography>
              {currentPlayer?.playedCard && (
                <Paper 
                  elevation={6} 
                  sx={{ 
                    p: 3, 
                    display: 'inline-block',
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText'
                  }}
                >
                  <Typography variant="h2">
                    {currentPlayer.playedCard}
                  </Typography>
                </Paper>
              )}
              <Typography variant='body1' sx={{ mt: 2 }}>
                現在のスコア：{currentPlayer?.score || 0}
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* 次のラウンドボタン用のスペース（常に確保）*/}
        <Box sx={{ textAlign: 'center', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {gameState.players.every(p => p.playedCard !== null) && (
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleNextRound}
            >
              次のラウンド
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}

