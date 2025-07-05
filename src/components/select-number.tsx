'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Button,
  Box,
  Paper,
  Container,
  Chip,
  Alert
} from '@mui/material';
import { useAtom } from 'jotai';
import { gameStateAtom, currentPlayerAtom } from '@/lib/game-atoms';
import { submitPlayerMove } from '@/firebase/db_handler';

export default function SelectNumber() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []); // 依存配列を空にして一度だけ実行

  // マウント前は何も表示しない（サーバーサイドレンダリングを完全に回避）
  if (!isMounted) {
    return null;
  }

  // 現在のプレイヤーを取得
  const currentPlayer = gameState.players.find(p => p.name === gameState.currentPlayerName);
  
  if (!currentPlayer || !gameState.room) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          プレイヤー情報が見つかりません。
        </Alert>
      </Container>
    );
  }

  // 使用可能なカード（まだ使用していないカード）
  const availableCards = currentPlayer.cards || [];
  
  const userCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const scoreCards = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleCardSelect = (cardNumber: number) => {
    // 使用可能なカードのみ選択可能
    if (availableCards.includes(cardNumber) && !isSubmitting) {
      setSelectedCard(cardNumber);
    }
  };

  const handleConfirm = async () => {
    if (!selectedCard || !gameState.roomCode || !gameState.currentPlayerName || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await submitPlayerMove(gameState.roomCode, gameState.currentPlayerName, selectedCard);
      
      // 楽観的更新：ローカル状態を即座に更新
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(player => 
          player.name === gameState.currentPlayerName 
            ? { 
                ...player, 
                playedCard: selectedCard,
                cards: player.cards.filter(card => card !== selectedCard)
              }
            : player
        ),
      }));
      
      setSelectedCard(null);
    } catch (error: any) {
      console.error('カード送信エラー:', error);
      alert(error.message || 'カードの送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 既にカードを選択済みの場合は待機画面を表示
  if (currentPlayer.playedCard !== null) {
    return (
      <Container maxWidth="sm" sx={{ height: '100vh', py: 2, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            カードを選択しました
          </Typography>
          <Paper elevation={4} sx={{ p: 3, backgroundColor: 'success.main', color: 'success.contrastText' }}>
            <Typography variant="h1">
              {currentPlayer.playedCard}
            </Typography>
          </Paper>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            他のプレイヤーの選択を待っています...
          </Typography>
        </Box>
      </Container>
    );
  }

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
              {userCards.map((card) => {
                const isAvailable = availableCards.includes(card);
                const isSelected = selectedCard === card;
                
                return (
                  <Button
                    key={card}
                    variant={isSelected ? "contained" : "outlined"}
                    onClick={() => handleCardSelect(card)}
                    disabled={!isAvailable}
                    sx={{
                      minWidth: '50px',
                      height: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      opacity: isAvailable ? 1 : 0.3,
                      backgroundColor: isSelected 
                        ? 'primary.main' 
                        : isAvailable 
                          ? 'transparent' 
                          : 'grey.200',
                      color: isSelected 
                        ? 'primary.contrastText' 
                        : isAvailable 
                          ? 'inherit' 
                          : 'grey.500',
                      textDecoration: !isAvailable ? 'line-through' : 'none',
                      '&:hover': {
                        backgroundColor: isAvailable 
                          ? isSelected 
                            ? 'primary.dark' 
                            : 'action.hover' 
                          : 'grey.200'
                      }
                    }}
                  >
                    {card}
                  </Button>
                );
              })}
            </Box>
            
            {/* 確認ボタン */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleConfirm}
                disabled={!selectedCard || isSubmitting}
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5
                }}
              >
                {isSubmitting ? '送信中...' : selectedCard ? `${selectedCard} を選択` : 'カードを選択してください'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* プレイヤー情報 */}
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            プレイヤー: {currentPlayer.name} | ラウンド: {gameState.currentRound} | 残りカード: {availableCards.length}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

