// 毎ラウンドの状態を管理するインターフェイスを作成
export interface RoundResult {
  winnerId: string | null;
  points: number;
  invalidPlayers: string[];
  duplicateCards: number[];
}

export function createScoreCards(): number[] {
  const negativeCards = [-5, -4, -3, -2, -1];
  const positiveCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return [...negativeCards, ...positiveCards];
}

export function createUserCards(): number[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
}
