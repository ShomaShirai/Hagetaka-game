import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PlayerCard from '../PlayerCard';

interface ThreePlayerLayoutProps {
  otherPlayers: any[];
  currentScoreCard: number | null;
}

export default function ThreePlayerLayout({ 
  otherPlayers, 
  currentScoreCard 
}: ThreePlayerLayoutProps) {
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
        {currentScoreCard && (
          <Paper 
            elevation={6} 
            sx={{ 
              p: 1, 
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
