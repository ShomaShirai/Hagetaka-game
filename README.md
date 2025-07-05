# ハゲタカのえじき - オンライン対戦ゲーム

リアルタイムで楽しめるカードゲーム「ハゲタカのえじき」のWeb版です。友達と一緒にオンラインで対戦できます。

## 🎮 ゲームについて

「ハゲタカのえじき」は、手札の数字カードを使ってスコアカードを獲得する心理戦ゲームです。

### ゲームルール
- 各プレイヤーは1〜15の数字カード（手札）を持ちます
- 毎ラウンド、中央にスコアカード（-5〜10）が1枚公開されます
- 全プレイヤーが同時に手札から1枚を選択します
- **プラスカード**: 最高値を出したプレイヤーが獲得（同点の場合は次点が獲得）
- **マイナスカード**: 最低値を出したプレイヤーが受け取り（同点の場合は次点が受け取り）
- 全15ラウンド終了後、最も高いスコアのプレイヤーが勝利

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15.3.4** - Reactフレームワーク
- **React 19.0.0** - UIライブラリ
- **TypeScript 5** - 型安全性
- **Material-UI (MUI) 7** - UIコンポーネント
- **Jotai 2.12.5** - 状態管理
- **Emotion** - CSS-in-JS

### バックエンド・データベース
- **Firebase 11.9.1**
  - **Firestore** - リアルタイムデータベース
  - **Firebase Hosting** - 静的サイトホスティング

### 開発ツール
- **ESLint** - コード品質チェック
- **Tailwind CSS** - スタイリング
- **Turbopack** - 高速バンドラー（開発時）

## 🏗️ DB設計

### Firestoreコレクション: `rooms`

```typescript
interface Room {
  id: string;                    // ルームコード（6桁数字）
  hostName: string;              // ホストプレイヤー名
  players: {                     // プレイヤー配列
    playerName: string;
    score?: number;              // 現在のスコア
    phase?: string;              // プレイヤーの現在フェーズ
    usedCards?: number[];        // 使用済みカード履歴
  }[];
  phase: 'waiting' | 'selecting' | 'revealing' | 'finished';
  maxPlayers: number;            // 最大プレイヤー数（6人）
  currentRound?: number;         // 現在のラウンド
  currentScoreCard?: number;     // 現在のスコアカード
  scoreCards?: number[];         // シャッフル済みスコアカード順序
  usedScoreCards?: number[];     // 使用済みスコアカード
  playerMoves?: {                // 各プレイヤーの選択カード
    [playerName: string]: number;
  };
  roundResults?: any[];          // ラウンド結果履歴
  createdAt: Timestamp;
  gameStartedAt?: Timestamp;
  lastUpdated?: Timestamp;
}
```

## 🚀セットアップ方法
- Node.js 20.0.0以上(Firebase CLIのインストールでエラーが出るため)
- npm または yarn
```
npm install
npm run dev
```

## デプロイ方法
```
sudo npm install -g firebase-tools
firebase login
firebase init
npm run build
npx firebase deploy --only hosting
```

## 🎯主要機能

### リアルタイム機能
- ルーム作成・参加: 6桁のルームコードで簡単参加
- リアルタイム同期: Firestoreを使用した即座の状態同期
- フェーズ管理: 各プレイヤーの進行状況を個別管理

### ゲーム機能
- カード選択: 直感的なUI でカード選択
- 使用カード管理: 過去に使用したカードは選択不可
- スコア計算: ゲームルールに従った自動スコア計算
- 結果表示: 視覚的なスコア変動表示



