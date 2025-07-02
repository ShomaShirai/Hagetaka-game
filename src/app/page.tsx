'use client';

import { Provider, useAtom } from 'jotai'
import { appScreenAtom } from '@/lib/game-atoms'
import TitleScreen from '@/components/TitleScreen'
import GameScreen from '@/components/GameScreen'

function AppContent() {
  const [currentScreen] = useAtom(appScreenAtom);

  switch (currentScreen) {
    case 'title':
      return <TitleScreen />;
    case 'game':
      return <GameScreen />;
    default:
      return <TitleScreen />;
  }
}

export default function Home() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  ) 
}

