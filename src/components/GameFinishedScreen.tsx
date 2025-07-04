import React from 'react';
import { useAtom } from 'jotai';
import { Container, Box, Typography, Button, Card, CardContent, Paper, Chip } from '@mui/material';
import { EmojiEvents, WorkspacePremium, MilitaryTech } from '@mui/icons-material';
import { gameStateAtom } from '@/lib/game-atoms';

export default function GameFinishedScreen() {
  const [gameState] = useAtom(gameStateAtom);

  // プレイヤーをスコア順にソート
  const sortedPlayers = [...gameState.players].sort((a, b) => (b.score || 0) - (a.score || 0));

  // 順位アイコンを取得
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <EmojiEvents sx={{ color: '#FFD700', fontSize: '2rem' }} />; // 金色
      case 2:
        return <WorkspacePremium sx={{ color: '#C0C0C0', fontSize: '2rem' }} />; // 銀色
      case 3:
        return <MilitaryTech sx={{ color: '#CD7F32', fontSize: '2rem' }} />; // 銅色
      default:
        return (
          <Box
            sx={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: 'grey.400',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {rank}
          </Box>
        );
    }
  };

  // 順位の背景色を取得
  const getRankBackgroundColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'; // 金色グラデーション
      case 2:
        return 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)'; // 銀色グラデーション
      case 3:
        return 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)'; // 銅色グラデーション
      default:
        return 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'; // グレーグラデーション
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', py: 2, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          gap: 3,
          justifyContent: 'center'
        }}
      >
        {/* タイトル */}
        <Card sx={{ textAlign: 'center' }}>
          <CardContent sx={{ py: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🎉 ゲーム終了 🎉
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              お疲れ様でした！
            </Typography>
          </CardContent>
        </Card>

        {/* 最終順位 */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 3 }}>
              最終順位
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sortedPlayers.map((player, index) => {
                const rank = index + 1;
                return (
                  <Paper
                    key={player.id}
                    elevation={rank <= 3 ? 6 : 2}
                    sx={{
                      p: 2,
                      background: getRankBackgroundColor(rank),
                      border: rank === 1 ? '3px solid #FFD700' : 'none',
                      transform: rank === 1 ? 'scale(1.05)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {getRankIcon(rank)}
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: rank <= 3 ? 'white' : 'text.primary'
                            }}
                          >
                            {player.name}
                          </Typography>
                          {rank === 1 && (
                            <Chip 
                              label="優勝!" 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: '#FFD700',
                                fontWeight: 'bold'
                              }} 
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: rank <= 3 ? 'white' : 'text.primary'
                        }}
                      >
                        {player.score || 0}点
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </CardContent>
        </Card>

        {/* 新しいゲーム開始ボタン */}
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => window.location.reload()}
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 3
              }}
            >
              新しいゲームを開始
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}