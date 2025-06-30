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

// スコア計算の結果を表す型
export interface ScoreResult {
  playerId: string;
  scoreChange: number;
  reason: string;
}

// スコア計算を行う関数
export function calculateScore(players: any[], scoreCard: number): ScoreResult[] {
  const playedCards = players
    .filter(player => player.playedCard !== null)
    .map(player => ({
      playerId: player.id,
      playerName: player.name,
      card: player.playedCard
    }))
    .sort((a, b) => b.card - a.card); // 降順でソート

  const results: ScoreResult[] = [];

  if (scoreCard > 0) {
    // プラスのスコアカードの場合
    const highestCard = playedCards[0].card;
    const highestPlayers = playedCards.filter(p => p.card === highestCard);

    if (highestPlayers.length === 1) {
      // 最高値が一人だけの場合、その人がスコアを獲得
      results.push({
        playerId: highestPlayers[0].playerId,
        scoreChange: scoreCard,
        reason: `最高値${highestCard}でスコア獲得`
      });
    } else {
      // 最高値が複数人の場合、次に高い値を出した一人がスコアを獲得
      const nextHighestPlayers = playedCards.filter(p => p.card < highestCard);
      if (nextHighestPlayers.length > 0) {
        const nextHighestCard = nextHighestPlayers[0].card;
        const nextHighestUniquePlayers = nextHighestPlayers.filter(p => p.card === nextHighestCard);
        
        if (nextHighestUniquePlayers.length === 1) {
          results.push({
            playerId: nextHighestUniquePlayers[0].playerId,
            scoreChange: scoreCard,
            reason: `最高値${highestCard}が複数のため、次点${nextHighestCard}でスコア獲得`
          });
        }
      }
    }
  } else {
    // マイナスのスコアカードの場合
    const sortedAscending = [...playedCards].sort((a, b) => a.card - b.card); // 昇順でソート
    const lowestCard = sortedAscending[0].card;
    const lowestPlayers = sortedAscending.filter(p => p.card === lowestCard);

    if (lowestPlayers.length === 1) {
      // 最低値が一人だけの場合、その人がマイナススコアを受ける
      results.push({
        playerId: lowestPlayers[0].playerId,
        scoreChange: scoreCard, // scoreCardは既にマイナス値
        reason: `最低値${lowestCard}でマイナススコア`
      });
    } else {
      // 最低値が複数人の場合、次に低い値を出した一人がマイナススコアを受ける
      const nextLowestPlayers = sortedAscending.filter(p => p.card > lowestCard);
      if (nextLowestPlayers.length > 0) {
        const nextLowestCard = nextLowestPlayers[0].card;
        const nextLowestUniquePlayers = nextLowestPlayers.filter(p => p.card === nextLowestCard);
        
        if (nextLowestUniquePlayers.length === 1) {
          results.push({
            playerId: nextLowestUniquePlayers[0].playerId,
            scoreChange: scoreCard, // scoreCardは既にマイナス値
            reason: `最低値${lowestCard}が複数のため、次点${nextLowestCard}でマイナススコア`
          });
        }
        // 次点も複数の場合は誰もマイナススコアを受けない
      }
      // 次点がいない場合は誰もマイナススコアを受けない
    }
  }

  return results;
}

// プレイヤーのスコアを更新する関数
export function updatePlayersScore(players: any[], scoreResults: ScoreResult[]): any[] {
  return players.map(player => {
    const scoreResult = scoreResults.find(result => result.playerId === player.id);
    if (scoreResult) {
      return {
        ...player,
        score: player.score + scoreResult.scoreChange
      };
    }
    return player;
  });
}

// 次のスコアカードを選択する関数（使用済みを除外）
export function getNextScoreCard(scoreCards: number[], usedScoreCards: number[]): number | null {
  const availableCards = scoreCards.filter(card => !usedScoreCards.includes(card));
  
  if (availableCards.length === 0) {
    return null; // ゲーム終了
  }
  
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
}

// ゲームが終了したかどうかを判定する関数
export function isGameFinished(scoreCards: number[], usedScoreCards: number[]): boolean {
  return usedScoreCards.length >= scoreCards.length;
}

// 使用済みスコアカードリストに追加する関数
export function addUsedScoreCard(usedCards: number[], newCard: number): number[] {
  if (!usedCards.includes(newCard)) {
    return [...usedCards, newCard];
  }
  return usedCards;
}
