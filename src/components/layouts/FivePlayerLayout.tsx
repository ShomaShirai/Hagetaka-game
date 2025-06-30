import React from 'react';
import { Box, Typography, Paper, Card } from '@mui/material';

interface FivePlayerLayoutProps {
  otherPlayers: any[];
  currentScoreCard: number | null;
}

export default function FivePlayerLayout({ 
  otherPlayers, 
  currentScoreCard 
}: FivePlayerLayoutProps) {
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
};
