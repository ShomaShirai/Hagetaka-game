'use client';

import { Provider, useAtom } from 'jotai'
import { gameStateAtom } from '@/lib/atoms'
import SelectNumber from '@/components/select-number'
import RevealOtherCards from '@/components/reveal-other-cards'

function GameContent() {
  const [gameState] = useAtom(gameStateAtom);

  switch (gameState.phase) {
    case 'selecting':
      return <SelectNumber />;
    case 'revealing':
      return <RevealOtherCards />;
    default:
      return <SelectNumber />;
  }
}

export default function Home() {
  return (
    <Provider>
      <GameContent />
    </Provider>
  );
}
