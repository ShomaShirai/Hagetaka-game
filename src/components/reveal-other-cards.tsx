'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Paper,
  Container,
  Button,
  Chip
} from '@mui/material';
import { useAtom } from 'jotai';
import { gameStateAtom, currentPlayerAtom } from '@/lib/game-atoms';
import { calculateScore, isGameFinished } from '@/lib/game-logic';
import TwoPlayerLayout from './reveal-other-number/TwoPlayerLayout';
import ThreePlayerLayout from './reveal-other-number/ThreePlayerLayout';
import FourPlayerLayout from './reveal-other-number/FourPlayerLayout';
import FivePlayerLayout from './reveal-other-number/FivePlayerLayout';
import SixPlayerLayout from './reveal-other-number/SixPlayerLayout';
import { updateDBPlayerScore, processRoundResult } from '@/firebase/db_handler';

export default function RevealOtherCards() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [isMounted, setIsMounted] = useState(false);
  const [scoreResults, setScoreResults] = useState<any[]>([]);
  const [showScoreChanges, setShowScoreChanges] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 画面表示時にスコア計算を実行
  useEffect(() => {
    if (isMounted && gameState.currentScoreCard && gameState.players.every(p => p.playedCard !== null)) {
      const results = calculateScore(gameState.players, gameState.currentScoreCard);
      setScoreResults(results);
      setShowScoreChanges(true);
    }
    // ゲームが終了したかどうかをチェック
    if (isMounted && gameState.usedScoreCards && gameState.scoreCards) {
      const finished = isGameFinished(gameState.scoreCards, gameState.usedScoreCards);
      setIsFinished(finished);
    }
  }, [isMounted, gameState.currentScoreCard, gameState.players, gameState.usedScoreCards, gameState.scoreCards]);

  // currentPlayerが正しく設定されていない場合の対策
  useEffect(() => {
    if (isMounted && gameState.currentPlayerName && !currentPlayer) {
      const foundCurrentPlayer = gameState.players.find(
        p => p.name === gameState.currentPlayerName
      );
      if (foundCurrentPlayer) {
        setCurrentPlayer(foundCurrentPlayer);
      }
    }
  }, [gameState.players, gameState.currentPlayerName, currentPlayer, setCurrentPlayer, isMounted]);

  // マウント前は何も表示しない
  if (!isMounted) {
    return null;
  }

  // currentPlayerを確実に取得
  const actualCurrentPlayer = currentPlayer || gameState.players.find(
    p => p.name === gameState.currentPlayerName
  );

  // 他のプレイヤーを取得
  const otherPlayers = gameState.players.filter(p => p.name !== gameState.currentPlayerName);

  // プレイヤーのスコア変動を取得
  const getScoreChange = (playerId: string) => {
    const result = scoreResults.find(r => r.playerId === playerId);
    return result ? result.scoreChange : 0;
  };

  // スコア変動表示コンポーネント
  const ScoreChangeChip = ({ scoreChange }: { scoreChange: number }) => {
    if (scoreChange === 0) return null;
    
    return (
      <Chip
        label={scoreChange > 0 ? `+${scoreChange}` : `${scoreChange}`}
        size="small"
        sx={{
          ml: 1,
          backgroundColor: scoreChange > 0 ? 'success.main' : 'error.main',
          color: scoreChange > 0 ? 'success.contrastText' : 'error.contrastText',
          fontWeight: 'bold',
          animation: 'pulse 1s infinite'
        }}
      />
    );
  };


  const handleNextRound = async () => {
    if (gameState.currentScoreCard && gameState.roomCode) {
      try {
        // 各プレイヤーのスコア変更をFirebaseに保存
        for (const result of scoreResults) {
          const player = gameState.players.find(p => p.id === result.playerId);
          if (player && result.scoreChange !== 0) {
            await updateDBPlayerScore(gameState.roomCode, player.name, result.scoreChange);
          }
        }

        // ラウンド結果の処理（次のラウンドへの移行など）
        await processRoundResult(gameState.roomCode);

        // 状態をリセット
        setScoreResults([]);
        setShowScoreChanges(false);

        console.log('Round completed and scores updated');
      } catch (error) {
        console.error('Error processing round:', error);
        alert('ラウンド処理中にエラーが発生しました');
      }
    }
  };

  const handleViewResults = async () => {
    if (gameState.currentScoreCard && gameState.roomCode) {
      try {
        // 各プレイヤーのスコア変更をFirebaseに保存
        for (const result of scoreResults) {
          const player = gameState.players.find(p => p.id === result.playerId);
          if (player && result.scoreChange !== 0) {
            await updateDBPlayerScore(gameState.roomCode, player.name, result.scoreChange);
          }
        }

        // 最終ラウンドの処理（ゲーム終了状態に移行）
        await processRoundResult(gameState.roomCode);

        console.log('Game completed and final scores updated');
      } catch (error) {
        console.error('Error processing final round:', error);
        alert('最終ラウンド処理中にエラーが発生しました');
      }
    }
  };

  // プレイヤー数に応じたレイアウト決定（スコア変動情報付き）
  const renderPlayerLayout = () => {
    // 他のプレイヤーにスコア変動情報を追加
    const otherPlayersWithScoreChange = otherPlayers.map(player => ({
      ...player,
      scoreChange: showScoreChanges ? getScoreChange(player.id) : 0
    }));

    if (otherPlayers.length === 1) {
      return <TwoPlayerLayout otherPlayers={otherPlayersWithScoreChange} currentScoreCard={gameState.currentScoreCard} />;
    } else if (otherPlayers.length === 2) {
      return <ThreePlayerLayout otherPlayers={otherPlayersWithScoreChange} currentScoreCard={gameState.currentScoreCard} />;
    } else if (otherPlayers.length === 3) {
      return <FourPlayerLayout otherPlayers={otherPlayersWithScoreChange} currentScoreCard={gameState.currentScoreCard} />;
    } else if (otherPlayers.length === 4) {
      return <FivePlayerLayout otherPlayers={otherPlayersWithScoreChange} currentScoreCard={gameState.currentScoreCard} />;
    } else if (otherPlayers.length === 5) {
      return <SixPlayerLayout otherPlayers={otherPlayersWithScoreChange} currentScoreCard={gameState.currentScoreCard} />;
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
                あなた ({gameState.currentPlayerName})
              </Typography>
              {actualCurrentPlayer?.playedCard && (
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
                    {actualCurrentPlayer.playedCard}
                  </Typography>
                </Paper>
              )}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='body1'>
                  現在のスコア：{actualCurrentPlayer?.score || 0}
                </Typography>
                {showScoreChanges && actualCurrentPlayer && (
                  <ScoreChangeChip scoreChange={getScoreChange(actualCurrentPlayer.id)} />
                )}
              </Box>
            </Box>
          </Card>
        </Box>

        {/* スコア変動の説明 */}
        {showScoreChanges && scoreResults.length > 0 && (
          <Box sx={{ textAlign: 'center', px: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {scoreResults.find(r => r.scoreChange !== 0)?.reason || 'このラウンドはスコア変動なし'}
            </Typography>
          </Box>
        )}

        {/* 次のラウンドボタン用のスペース（常に確保）*/}
        <Box sx={{ textAlign: 'center', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {gameState.players.every(p => p.playedCard !== null) && gameState.isHost && (
            <Button 
              variant="contained" 
              color={isFinished ? "secondary" : "primary"}
              size="large"
              onClick={isFinished ? handleViewResults : handleNextRound}
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                px: 4,
                py: 1.5
              }}
            >
              {isFinished ? '結果を見る' : '次のラウンド'}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}

