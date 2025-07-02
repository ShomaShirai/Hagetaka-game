import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PlayerCard from './PlayerCard';

interface TwoPlayerLayoutProps {
  otherPlayers: any[];
  currentScoreCard: number | null;
}

export default function TwoPlayerLayout({ 
  otherPlayers, 
  currentScoreCard 
}: TwoPlayerLayoutProps) {
  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1, maxWidth: '60%' }}>
          <PlayerCard player={otherPlayers[0]} />
        </Box>
      </Box>
      
      {/* 中央：現在のスコアカード */}
      <Box sx={{ textAlign: 'center', flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          スコアカード
        </Typography>
        {currentScoreCard && (
          <Paper 
            elevation={6} 
            sx={{ 
              p: 3, 
              display: 'inline-block',
              backgroundColor: currentScoreCard > 0 ? 'success.main' : 'error.main',
              color: currentScoreCard > 0 ? 'success.contrastText' : 'error.contrastText'
            }}
          >
            <Typography variant="h2">
              {currentScoreCard}
            </Typography>
          </Paper>
        )}
      </Box>
    </>
  );
}
