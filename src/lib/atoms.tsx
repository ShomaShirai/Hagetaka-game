import { atom } from 'jotai';
import { createScoreCards } from './game-logic';

export interface Player {
  id: string;
  name: string;
  cards: number[];
  playedCard: number | null;
  score: number;
  isReady: boolean;
}

export interface GameState {
  id: string;
  players: Player[];
  currentRound: number;
  scoreCards: number[];
  currentScoreCard: number | null;
  carryOverCards: number[];
  phase: 'waiting' | 'selecting' | 'revealing' | 'finished';
  winner: string | null;
}

// デフォルトプレイヤーを作成
const defaultPlayers: Player[] = [
  {
    id: 'player1',
    name: 'あなた',
    cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    playedCard: null,
    score: 0,
    isReady: false,
  },
  {
    id: 'player2',
    name: 'CPU1',
    cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    playedCard: null,
    score: 0,
    isReady: false,
  },
  {
    id: 'player3',
    name: 'CPU2',
    cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    playedCard: null,
    score: 0,
    isReady: false,
  },
  {
    id: 'player4',
    name: 'CPU3',
    cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    playedCard: null,
    score: 0,
    isReady: false,
  },
  // {
  //   id: 'player5',
  //   name: 'CPU4',
  //   cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  //   playedCard: null,
  //   score: 0,
  //   isReady: false,
  // },
  // {
  //   id: 'player6',
  //   name: 'CPU5',
  //   cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  //   playedCard: null,
  //   score: 0,
  //   isReady: false,
  // },
];

export const gameStateAtom = atom<GameState>({
  id: 'game1',
  players: defaultPlayers,
  currentRound: 1,
  scoreCards: createScoreCards(),
  currentScoreCard: 5, // 初期値として5を設定
  carryOverCards: [],
  phase: 'selecting',
  winner: null,
});

export const currentPlayerAtom = atom<Player | null>(defaultPlayers[0]);

export const isConnectedAtom = atom(false);