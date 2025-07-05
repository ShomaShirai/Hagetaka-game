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
  usedScoreCards: number[]; // スコアカードなので，ユーザーのカードではない
  currentScoreCard: number | null;
  carryOverCards: number[];
  phase: 'first' | 'waiting' | 'selecting' | 'revealing' | 'finished';
  winner: string | null;
  
  // Firebase連携用
  room: Room | null;
}

// アプリケーションの画面状態(タイトルとゲーム中で分ける)
export type AppScreen = 'title' | 'game';

// デフォルトの手札を生成
const createDefaultCards = (): number[] => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// スコアカードを生成
export const createScoreCards = (): number[] => {
  const negativeCards = [-5, -4, -3, -2, -1];
  const positiveCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return [...negativeCards, ...positiveCards];
};

// アプリケーション全体の状態(初期はタイトルっ画面)
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
  phase: 'first',
  winner: null,
  room: null,
});

export const currentPlayerAtom = atom<GamePlayer | null>(null);

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
  // 既存のプレイヤー情報を保持しつつ、新しい情報で更新
  const existingPlayersMap = new Map(currentState.players.map(p => [p.name, p]));
  
  const players = room.players.map(playerObj => {
    const playerName = playerObj.playerName;
    const existingPlayer = existingPlayersMap.get(playerName);
    const roomMoves = room.playerMoves || {};
    
    // 手札を計算（初期手札から使用済みカードを除去）
    const initialCards = createDefaultCards();
    const usedCards = playerObj.usedCards || [];
    const availableCards = initialCards.filter(card => !usedCards.includes(card));
    
    // 現在のラウンドでプレイしたカード
    const playedCard = roomMoves[playerName] || null;
    
    return {
      id: `player_${playerName}`,
      name: playerName,
      cards: availableCards,
      playedCard: playedCard,
      score: playerObj.score || existingPlayer?.score || 0,
      isReady: existingPlayer?.isReady || false,
      isConnected: true,
    };
  });

  // フェーズ判定ロジック
  let newPhase = currentState.phase;
  
  if (room.phase === 'waiting') {
    newPhase = 'waiting';
  } else if (room.phase === 'finished') {
    newPhase = 'finished';
  } else if (room.phase === 'selecting') {
    newPhase = 'selecting';
  } else if (room.phase === 'revealing') {
    newPhase = 'revealing';
  } else if (room.phase) {
    newPhase = room.phase;
  }

  return {
    ...currentState,
    roomCode: room.id,
    currentPlayerName,
    isHost: room.hostName === currentPlayerName,
    players,
    room,
    currentRound: room.currentRound || currentState.currentRound,
    currentScoreCard: room.currentScoreCard !== undefined ? room.currentScoreCard : currentState.currentScoreCard,
    scoreCards: room.scoreCards || currentState.scoreCards,
    usedScoreCards: room.usedScoreCards || currentState.usedScoreCards,
    phase: newPhase,
  };
};

