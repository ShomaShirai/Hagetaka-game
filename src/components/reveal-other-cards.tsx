'use client';

import React, { useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Paper,
  Container,
  Button
} from '@mui/material';
import { useAtom } from 'jotai';
import { gameStateAtom, currentPlayerAtom } from '@/lib/atoms';

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

  // 他のプレイヤー（左上、右上）
  const otherPlayers = gameState.players.filter(p => p.id !== currentPlayer?.id).slice(0, 2);
  
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
        {/* 上部：他のプレイヤーのカード */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          {/* 左上のプレイヤー */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            <Card sx={{ flexGrow: 1, minWidth: "30%" }}>
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {otherPlayers[0]?.name || 'プレイヤー1'}
                </Typography>
                {otherPlayers[0]?.playedCard ? (
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      display: 'inline-block',
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  >
                    <Typography variant="h2">
                      {otherPlayers[0].playedCard}
                    </Typography>
                  </Paper>
                ) : (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      display: 'inline-block',
                      backgroundColor: 'grey.300'
                    }}
                  >
                    <Typography variant="h2">
                      ?
                    </Typography>
                  </Paper>
                )}
                <Typography variant='body1' sx={{ mt: 2 }}>
                  現在のスコア：{otherPlayers[0]?.score || 0}
                </Typography>
              </Box>
            </Card>
          </Box>

          {/* 右上のプレイヤー */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            <Card sx={{ flexGrow: 1, minWidth: "30%" }}>
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {otherPlayers[1]?.name || 'プレイヤー2'}
                </Typography>
                {otherPlayers[1]?.playedCard ? (
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      display: 'inline-block',
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  >
                    <Typography variant="h2">
                      {otherPlayers[1].playedCard}
                    </Typography>
                  </Paper>
                ) : (
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      display: 'inline-block',
                      backgroundColor: 'grey.300'
                    }}
                  >
                    <Typography variant="h2">
                      ?
                    </Typography>
                  </Paper>
                )}
                <Typography variant='body1' sx={{ mt: 2 }}>
                  現在のスコア：{otherPlayers[1]?.score || 0}
                </Typography>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* 中央：現在のスコアカード */}
        <Box sx={{ textAlign: 'center', py:4, flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            現在のスコアカード
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

        {/* 次のラウンドボタン用のスペース（常に確保） */}
        <Box sx={{ textAlign: 'center', mt: 1, minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
