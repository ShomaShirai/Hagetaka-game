import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

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
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: any;
  gameStartedAt?: any; // ゲーム開始時刻（オプショナル）
  maxPlayers: number;
}

// ルームを作成
export const createRoom = async (roomCode: string, hostName: string): Promise<void> => {
  try {
    const roomRef = doc(db, 'rooms', roomCode);
    const roomData: Room = {
      id: roomCode,
      hostName,
      players: [hostName],
      status: 'waiting',
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
    
    if (roomData.status !== 'waiting') {
      throw new Error('このルームは既にゲームが開始されています');
    }
    
    if (roomData.players.length >= roomData.maxPlayers) {
      throw new Error('ルームが満員です');
    }
    
    if (roomData.players.includes(playerName)) {
      throw new Error('同じ名前のプレイヤーが既に参加しています');
    }
    
    const updatedPlayers = [...roomData.players, playerName];
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
    
    if (roomData.status !== 'waiting') {
      throw new Error('ゲームは既に開始されているか、終了しています');
    }
    
    if (roomData.players.length < 2) {
      throw new Error('ゲームを開始するには最低2人のプレイヤーが必要です');
    }
    
    // ゲーム状態を'playing'に変更
    await updateDoc(roomRef, { 
      status: 'playing',
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
    
    if (roomData.status !== 'waiting') {
      throw new Error('ゲームは既に開始されているか、終了しています');
    }
    
    if (roomData.players.length < 3) {
      throw new Error('ゲームを開始するには最低3人のプレイヤーが必要です');
    }
    
    if (roomData.players.length > 6) {
      throw new Error('ゲームに参加できるのは最大6人までです');
    }
    
    // ゲーム状態を'playing'に変更
    await updateDoc(roomRef, { 
      status: 'playing',
      gameStartedAt: serverTimestamp()
    });
    
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

export { db };