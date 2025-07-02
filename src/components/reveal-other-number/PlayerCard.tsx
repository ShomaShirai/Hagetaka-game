import React from 'react';
import { Card, Box, Typography, Paper } from '@mui/material';

interface PlayerCardProps {
  player: any;
  backgroundColor?: string;
}

export default function PlayerCard({ 
  player, 
  backgroundColor = 'primary.main' 
}: PlayerCardProps) {
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
        <Typography variant='body1' sx={{ mt: 2 }}>
          現在のスコア：{player?.score || 0}
        </Typography>
      </Box>
    </Card>
  );
}
