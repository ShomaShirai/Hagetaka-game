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
    <Container maxWidth="sm" sx={{ height: '100vh', py: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          gap: 2
        }}
      >
        {/* 上部：他のプレイヤーのカード */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
            {/* 左上のプレイヤー */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ height: '100%', minHeight: 120 }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {otherPlayers[0]?.name || 'プレイヤー1'}
                  </Typography>
                  {otherPlayers[0]?.playedCard ? (
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
                      }}
                    >
                      <Typography variant="h3">
                        {otherPlayers[0].playedCard}
                      </Typography>
                    </Paper>
                  ) : (
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        backgroundColor: 'grey.300'
                      }}
                    >
                      <Typography variant="h4">
                        ?
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* 右上のプレイヤー */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ height: '100%', minHeight: 120 }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {otherPlayers[1]?.name || 'プレイヤー2'}
                  </Typography>
                  {otherPlayers[1]?.playedCard ? (
                    <Paper 
                      elevation={3} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
                      }}
                    >
                      <Typography variant="h3">
                        {otherPlayers[1].playedCard}
                      </Typography>
                    </Paper>
                  ) : (
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        backgroundColor: 'grey.300'
                      }}
                    >
                      <Typography variant="h4">
                        ?
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* 中央：現在のスコアカード */}
        <Box sx={{ textAlign: 'center', py: 2 }}>
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
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {currentPlayer?.name || 'あなた'}
              </Typography>
              {currentPlayer?.playedCard && (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText'
                  }}
                >
                  <Typography variant="h3">
                    {currentPlayer.playedCard}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* 次のラウンドボタン */}
        {gameState.players.every(p => p.playedCard !== null) && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleNextRound}
            >
              次のラウンド
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
