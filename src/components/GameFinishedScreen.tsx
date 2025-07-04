import React from 'react';
import { useAtom } from 'jotai';
import { Container, Box, Typography, Button } from '@mui/material';
import { gameStateAtom } from '@/lib/game-atoms';

export default function GameFinishedScreen() {
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