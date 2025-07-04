import React from 'react';
import { Card, Box, Typography, Paper, Chip } from '@mui/material';

interface PlayerCardProps {
  player: any;
  backgroundColor?: string;
}

export default function PlayerCard({ 
  player, 
  backgroundColor = 'primary.main' 
}: PlayerCardProps) {
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

  return (
    <Card sx={{ flexGrow: 1, maxWidth: "60%" }}>
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
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='body1'>
            現在のスコア：{player?.score || 0}
          </Typography>
          {player?.scoreChange !== undefined && (
            <ScoreChangeChip scoreChange={player.scoreChange} />
          )}
        </Box>
      </Box>
    </Card>
  );
}
