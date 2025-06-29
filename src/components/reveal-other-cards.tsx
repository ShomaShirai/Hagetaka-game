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

// プレイヤーカードコンポーネント
const PlayerCard = ({ player, backgroundColor = 'primary.main' }: { 
  player: any, 
  backgroundColor?: string 
}) => (
  <Card sx={{ flexGrow: 1, minWidth: "30%", maxWidth: "40%" }}>
    <Box sx={{ textAlign: 'center', py: 1 }}>
      <Typography variant="h6" component="div" gutterBottom>
        {player?.name || `プレイヤー${player?.id}`}
      </Typography>
      {player?.playedCard ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            display: 'inline-block',
            backgroundColor,
            color: 'primary.contrastText'
          }}
        >
          <Typography variant="h2">
            {player.playedCard}
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
        現在のスコア：{player?.score || 0}
      </Typography>
    </Box>
  </Card>
);

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
      // 3人プレイ：左右に配置
      return (
        <>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <PlayerCard player={otherPlayers[0]} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <PlayerCard player={otherPlayers[1]} />
            </Box>
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
                  p: 1, 
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
    } else if (otherPlayers.length === 3) {
      // 4人プレイ：上、左、右に配置（スコアカードは左右と同じ高さ）
      return (
        <>
          {/* 上部のプレイヤー */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ flexGrow: 1, minWidth: "20%", maxWidth: "40%" }}>
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {otherPlayers[0]?.name || `プレイヤー${otherPlayers[0]?.id}`}
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
          
          {/* 中央の行：左のプレイヤー、スコアカード、右のプレイヤー */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
            {/* 左のプレイヤー */}
            <Box sx={{ display: 'flex', justifyContent: 'left', flex: 1 }}>
              <Card sx={{ flexGrow: 1, minWidth: "50%" }}>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {otherPlayers[1]?.name || `プレイヤー${otherPlayers[1]?.id}`}
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
            
            {/* 中央：現在のスコアカード */}
            <Box sx={{ textAlign: 'center', flex: 1 }}>
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
            
            {/* 右のプレイヤー */}
            <Box sx={{ display: 'flex', justifyContent: 'right', flex: 1 }}>
              <Card sx={{ flexGrow: 1, minWidth: "50%" }}>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {otherPlayers[2]?.name || `プレイヤー${otherPlayers[2]?.id}`}
                  </Typography>
                  {otherPlayers[2]?.playedCard ? (
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
                        {otherPlayers[2].playedCard}
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
                    現在のスコア：{otherPlayers[2]?.score || 0}
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Box>
        </>
      );
    } else if (otherPlayers.length === 4) { 
      // 5人プレイ：上部左右、中央左右に配置
      return (
        <>
          {/* 上部のプレイヤー */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <Card sx={{ flexGrow: 1, maxWidth: "60%" }}>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {otherPlayers[0]?.name || `プレイヤー${otherPlayers[0]?.id}`}
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
            <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <Card sx={{ flexGrow: 1, maxWidth: "60%" }}>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {otherPlayers[1]?.name || `プレイヤー${otherPlayers[1]?.id}`}
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
          
          {/* 中央の行：左のプレイヤー、スコアカード、右のプレイヤー */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
            {/* 左のプレイヤー */}
            <Box sx={{ display: 'flex', justifyContent: 'left', flex: 1 }}>
              <Card sx={{ flexGrow: 1, minWidth: "50%" }}>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {otherPlayers[2]?.name || `プレイヤー${otherPlayers[2]?.id}`}
                  </Typography>
                  {otherPlayers[2]?.playedCard ? (
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
                        {otherPlayers[2].playedCard}
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
                    現在のスコア：{otherPlayers[2]?.score || 0}
                  </Typography>
                </Box>
              </Card>
            </Box>
            
            {/* 中央：現在のスコアカード */}
            <Box sx={{ textAlign: 'center', flex: 1 }}>
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
            
            {/* 右のプレイヤー */}
            <Box sx={{ display: 'flex', justifyContent: 'right', flex: 1 }}>
              <Card sx={{ flexGrow: 1, minWidth: "50%" }}>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {otherPlayers[3]?.name || `プレイヤー${otherPlayers[3]?.id}`}
                  </Typography>
                  {otherPlayers[3]?.playedCard ? (
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
                        {otherPlayers[3].playedCard}
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
                    現在のスコア：{otherPlayers[3]?.score || 0}
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Box>
        </>
      );
    } else if (otherPlayers.length === 5) { 
      return (
        <>

        </>
      )
    } else {
      // 6人以上：グリッド配置
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
