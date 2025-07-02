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

// ルームが存在するかチェック
export const checkRoomExists = async (roomCode: string): Promise<boolean> => {
  const roomRef = doc(db, 'rooms', roomCode);
  const roomDoc = await getDoc(roomRef);
  return roomDoc.exists();
};

export { db };