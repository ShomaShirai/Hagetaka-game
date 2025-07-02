import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp, arrayUnion, Timestamp } from "firebase/firestore";

// Firebase Web SDKの設定
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

// ルームの型定義
export interface Room {
  id: string;
  hostName: string;
  players: { playerName: string, score?: number, phase?: string }[]; // プレイヤー情報をオブジェクトの配列に変更
  phase: 'first' | 'waiting' | 'selecting' | 'revealing' | 'finished';
  createdAt: any;
  gameStartedAt?: any;
  lastUpdated?: any;
  maxPlayers: number;
  // ゲーム状態
  currentRound?: number;
  currentScoreCard?: number | null;
  scoreCards?: number[];
  usedScoreCards?: number[];
  carryOverCards?: number[];
  playerMoves?: { [playerId: string]: number };
  roundResults?: any[];
}

// ルームを作成
export const createRoom = async (roomCode: string, hostName: string): Promise<void> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const roomData: Room = {
      id: roomCode,
      hostName,
      players: [{ playerName: hostName, score: 0, phase: 'waiting' }], // 配列として初期化
      phase: 'waiting',
      createdAt: serverTimestamp(),
      maxPlayers: 6
    };
    
    await setDoc(roomRef, roomData);
    console.log('Room created successfully');
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// ルームに参加
export const joinRoom = async (roomCode: string, playerName: string): Promise<boolean> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('ルームが見つかりません');
    }
    
    const roomData = roomDoc.data() as Room;
    
    if (roomData.phase !== 'waiting') {
      throw new Error('このルームは既にゲームが開始されています');
    }
    
    if (roomData.players.length >= roomData.maxPlayers) {
      throw new Error('ルームが満員です');
    }
    
    // プレイヤー名の重複チェック
    if (roomData.players.some(player => player.playerName === playerName)) {
      throw new Error('同じ名前のプレイヤーが既に参加しています');
    }
    
    const updatedPlayers = [...roomData.players, { playerName, score: 0, phase: 'waiting' }];
    await updateDoc(roomRef, { players: updatedPlayers });
    console.log('Player joined successfully');
    
    return true;
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

// ルームの状態を監視
export const subscribeToRoom = (roomCode: string, callback: (room: Room | null) => void) => {
  const roomRef = doc(db, 'rooms', roomCode);
  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as Room);
    } else {
      callback(null);
    }
  });
};

// ゲームを開始
export const startGame = async (roomCode: string): Promise<void> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('ルームが見つかりません');
    }
    
    const roomData = roomDoc.data() as Room;
    
    if (roomData.phase !== 'waiting') {
      throw new Error('ゲームは既に開始されているか、終了しています');
    }
    
    if (roomData.players.length < 2) {
      throw new Error('ゲームを開始するには最低2人のプレイヤーが必要です');
    }
    
    // ゲーム状態を'selecting'に変更
    await updateDoc(roomRef, { 
      phase: 'selecting',
      gameStartedAt: serverTimestamp()
    });
    
    console.log('Game started for room:', roomCode);
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};

// ホストがゲームを開始（ホスト権限チェック付き）
export const startGameAsHost = async (roomCode: string, playerName: string): Promise<void> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('ルームが見つかりません');
    }
    
    const roomData = roomDoc.data() as Room;
    
    // ホスト権限チェック
    if (roomData.hostName !== playerName) {
      throw new Error('ゲームを開始できるのはホストのみです');
    }
    
    if (roomData.phase !== 'waiting') {
      throw new Error('ゲームは既に開始されているか、終了しています');
    }
    
    if (roomData.players.length < 2) {
      throw new Error('ゲームを開始するには最低2人のプレイヤーが必要です');
    }
    
    if (roomData.players.length > 6) {
      throw new Error('ゲームに参加できるのは最大6人までです');
    }
    
    // 全プレイヤーのphaseを'selecting'に設定
    const updatedPlayers = roomData.players.map(player => ({
      ...player,
      phase: 'selecting'
    }));
    
    // ゲーム状態を'selecting'に変更
    await updateDoc(roomRef, { 
      phase: 'selecting',
      players: updatedPlayers,
      gameStartedAt: serverTimestamp()
    });
    
    // ゲーム状態を初期化
    await initializeGameState(roomCode);
    
    console.log(`Game started by host ${playerName} for room: ${roomCode}`);
  } catch (error) {
    console.error('Error starting game as host:', error);
    throw error;
  }
};

// ルームが存在するかチェック
export const checkRoomExists = async (roomCode: string): Promise<boolean> => {
  const roomRef = doc(db, 'rooms', roomCode);
  const roomDoc = await getDoc(roomRef);
  return roomDoc.exists();
};

// ゲームの状態を確認
export const getGameStatus = async (roomCode: string): Promise<Room | null> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      return null;
    }
    
    return roomDoc.data() as Room;
  } catch (error) {
    console.error('Error getting game status:', error);
    throw error;
  }
};

// プレイヤーがホストかどうかを確認
export const isHost = async (roomCode: string, playerName: string): Promise<boolean> => {
  try {
    const roomData = await getGameStatus(roomCode);
    return roomData?.hostName === playerName;
  } catch (error) {
    console.error('Error checking host status:', error);
    return false;
  }
};

// ゲーム状態を初期化
export const initializeGameState = async (roomCode: string): Promise<void> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const scoreCards = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffledScoreCards = [...scoreCards].sort(() => Math.random() - 0.5);
    
    await updateDoc(roomRef, {
      currentRound: 1,
      currentScoreCard: shuffledScoreCards[0],
      scoreCards: shuffledScoreCards,
      usedScoreCards: [],
      carryOverCards: [],
      playerMoves: {},
      roundResults: []
    });
    
    console.log('Game state initialized for room:', roomCode);
  } catch (error) {
    console.error('Error initializing game state:', error);
    throw error;
  }
};

// プレイヤーの手札選択を送信
export const submitPlayerMove = async (roomCode: string, playerName: string, cardValue: number): Promise<void> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('ルームが見つかりません');
    }
    
    const roomData = roomDoc.data() as Room;
    
    if (roomData.phase !== 'selecting') {
      throw new Error('ゲームが開始されていません');
    }
    
    const currentMoves = roomData.playerMoves || {};
    const updatedMoves = {
      ...currentMoves,
      [playerName]: cardValue
    };
    
    // 該当プレイヤーのphaseを'revealing'に更新
    const updatedPlayers = roomData.players.map(player => 
      player.playerName === playerName 
        ? { ...player, phase: 'revealing' }
        : player
    );
    
    // 全プレイヤーが'revealing'フェーズになったかチェック
    const allPlayersRevealing = updatedPlayers.every(player => player.phase === 'revealing');
    console.log(`All players revealing: ${allPlayersRevealing}`);
    
    await updateDoc(roomRef, {
      playerMoves: updatedMoves,
      players: updatedPlayers,
      // 全員がrevealingになったら全体のphaseも更新
      ...(allPlayersRevealing && { phase: 'revealing' })
    });
    
    console.log(`Player ${playerName} played card ${cardValue}, phase updated to revealing`);
    
    // // 全プレイヤーが選択したかチェック
    // if (Object.keys(updatedMoves).length === roomData.players.length) {
    //   await processRoundResult(roomCode);
    // }
  } catch (error) {
    console.error('Error submitting player move:', error);
    throw error;
  }
};

// ラウンド結果を処理
export const processRoundResult = async (roomCode: string): Promise<void> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('ルームが見つかりません');
    }
    
    const roomData = roomDoc.data() as Room;
    const currentMoves = roomData.playerMoves || {};
    const currentScoreCard = roomData.currentScoreCard || 0;
    
    // ラウンド結果を計算
    const roundResult = {
      round: roomData.currentRound || 1,
      scoreCard: currentScoreCard,
      playerMoves: { ...currentMoves },
      timestamp: Timestamp.now()
    };
    
    // 結果を保存
    const updatedResults = [...(roomData.roundResults || []), roundResult];
    const updatedUsedScoreCards = [...(roomData.usedScoreCards || []), currentScoreCard];
    
    // 次のスコアカード
    const remainingScoreCards = (roomData.scoreCards || []).filter(
      card => !updatedUsedScoreCards.includes(card)
    );
    
    const nextScoreCard = remainingScoreCards.length > 0 ? remainingScoreCards[0] : null;
    const nextRound = (roomData.currentRound || 1) + 1;
    
    // ゲーム終了判定
    const isGameFinished = remainingScoreCards.length === 0 || nextRound > 15;
    
    await updateDoc(roomRef, {
      roundResults: updatedResults,
      usedScoreCards: updatedUsedScoreCards,
      currentScoreCard: nextScoreCard,
      currentRound: nextRound,
      playerMoves: {},
      phase: isGameFinished ? 'finished' : 'selecting',
      lastUpdated: serverTimestamp()
    });
    
    console.log(`Round ${roomData.currentRound} processed for room:`, roomCode);
  } catch (error) {
    console.error('Error processing round result:', error);
    throw error;
  }
};

export { db };