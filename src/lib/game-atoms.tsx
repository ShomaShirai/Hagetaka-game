import { atom } from 'jotai';
import { Room } from '@/firebase/db_handler';

// プレイヤーの型定義（ゲーム用）
export interface GamePlayer {
  id: string;
  name: string;
  cards: number[];
  playedCard: number | null;
  score: number;
  isReady: boolean;
  isConnected: boolean;
}

// ゲーム全体の状態
export interface GameState {
  // ルーム情報
  roomCode: string | null;
  currentPlayerName: string | null;
  isHost: boolean;
  
  // ゲーム状態
  players: GamePlayer[];
  currentRound: number;
  scoreCards: number[];
  usedScoreCards: number[];
  currentScoreCard: number | null;
  carryOverCards: number[];
  phase: 'lobby' | 'waiting' | 'selecting' | 'revealing' | 'finished';
  winner: string | null;
  
  // Firebase連携用
  room: Room | null;
}

// アプリケーションの画面状態
export type AppScreen = 'title' | 'lobby' | 'game';

// デフォルトの手札を生成
const createDefaultCards = (): number[] => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// スコアカードを生成
export const createScoreCards = (): number[] => {
  const negativeCards = [-5, -4, -3, -2, -1];
  const positiveCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return [...negativeCards, ...positiveCards];
};

// アプリケーション全体の状態
export const appScreenAtom = atom<AppScreen>('title');

// ゲーム状態のAtom
export const gameStateAtom = atom<GameState>({
  roomCode: null,
  currentPlayerName: null,
  isHost: false,
  players: [],
  currentRound: 1,
  scoreCards: createScoreCards(),
  usedScoreCards: [],
  currentScoreCard: null,
  carryOverCards: [],
  phase: 'lobby',
  winner: null,
  room: null,
});

// ユーティリティ関数：RoomからGamePlayerを作成
export const createGamePlayerFromRoom = (playerName: string, isCurrentPlayer = false): GamePlayer => ({
  id: `player_${playerName}`,
  name: playerName,
  cards: createDefaultCards(),
  playedCard: null,
  score: 0,
  isReady: false,
  isConnected: true,
});

// ユーティリティ関数：ルーム情報からゲーム状態を更新
export const updateGameStateFromRoom = (
  currentState: GameState,
  room: Room,
  currentPlayerName: string
): GameState => {
  const players = room.players.map(playerName =>
    createGamePlayerFromRoom(playerName, playerName === currentPlayerName)
  );

  return {
    ...currentState,
    roomCode: room.id,
    currentPlayerName,
    isHost: room.hostName === currentPlayerName,
    players,
    room,
    phase: room.status === 'waiting' ? 'waiting' : 
           room.status === 'playing' ? 'selecting' : 
           currentState.phase,
  };
};
