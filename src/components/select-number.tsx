'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Button,
  Box,
  Paper,
  Container,
  Chip
} from '@mui/material';
import { useAtom } from 'jotai';
import { gameStateAtom, currentPlayerAtom } from '@/lib/atoms';
import { createScoreCards, createUserCards } from '@/lib/game-logic';

export default function SelectNumber() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const scoreCards = createScoreCards();
  const userCards = createUserCards();
  
  // 使用可能なカード（まだ使用していないカード）
  const availableCards = userCards.filter(card => 
    currentPlayer?.cards.includes(card)
  );

  const handleCardSelect = (cardNumber: number) => {
    setSelectedCard(cardNumber);
  };

  const handleConfirm = () => {
    if (selectedCard && currentPlayer) {
      // プレイヤーのプレイしたカードを更新し、手札から削除
      const updatedPlayer = { 
        ...currentPlayer, 
        playedCard: selectedCard,
        cards: currentPlayer.cards.filter(card => card !== selectedCard)
      };
      setCurrentPlayer(updatedPlayer);
      
      // ゲーム状態を更新
      setGameState(prev => ({
        ...prev,
        phase: 'revealing' as const,
        players: prev.players.map(p => 
          p.id === currentPlayer.id ? updatedPlayer : p
        )
      }));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', py: 2, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          gap: 2
        }}
      >
        {/* 上部：スコアカード */}
        <Card>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                スコアカード
              </Typography>
            }
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {scoreCards.map((card) => {
                const isUsed = gameState.usedScoreCards.includes(card);
                const isCurrent = gameState.currentScoreCard === card;
                
                return (
                  <Chip
                    key={card}
                    label={card}
                    variant={isUsed ? "filled" : "outlined"}
                    sx={{
                      fontSize: '1rem',
                      padding: '8px',
                      backgroundColor: isCurrent 
                        ? 'warning.main'
                        : isUsed 
                          ? 'grey.400' 
                          : card > 0 
                            ? 'success.light' 
                            : 'error.light',
                      color: isCurrent
                        ? 'warning.contrastText'
                        : isUsed
                          ? 'grey.600'
                          : card > 0 
                            ? 'success.contrastText' 
                            : 'error.contrastText',
                      fontWeight: 'bold',
                      opacity: isUsed ? 0.5 : 1,
                      textDecoration: isUsed ? 'line-through' : 'none'
                    }}
                  />
                );
              })}
            </Box>
          </CardContent>
        </Card>

        {/* 現在のスコアカード */}
        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="h6" gutterBottom>
            今回のスコアカード
          </Typography>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 2, 
              display: 'inline-block',
              backgroundColor: 'warning.main',
              color: 'warning.contrastText'
            }}
          >
            <Typography variant="h2">
              {gameState.currentScoreCard || '?'}
            </Typography>
          </Paper>
        </Box>

        {/* 下部：ユーザーカード選択 */}
        <Card sx={{ flexGrow: 1 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: "center"}}>
                手持ちのカードから数字を選択してください
              </Typography>
            }
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 2 }}>
              {availableCards.map((card) => (
                <Button
                  key={card}
                  variant={selectedCard === card ? "contained" : "outlined"}
                  onClick={() => handleCardSelect(card)}
                  sx={{
                    minWidth: '50px',
                    height: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {card}
                </Button>
              ))}
            </Box>
            
            {selectedCard && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" gutterBottom>
                  選択したカード: <strong>{selectedCard}</strong>
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={handleConfirm}
                  sx={{ mt: 1 }}
                >
                  決定
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}