# EC サイト (Kiro Workshop 用)

こちらは Kiro Workshop で利用する React で作成された EC サイトです。

## 機能

- 📦 商品一覧表示
- 🛍️ ショッピングカート機能
- 💳 チェックアウトフォーム

## セットアップ

### 必要要件

- Node.js (推奨: v18以上)
- npm

Node.js および npm のセットアップは https://nodejs.org/ja/download を参照してください。

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションを確認できます。

## プロジェクト構造

```
src/
├── components/     # Reactコンポーネント
│   ├── cart/      # カート関連コンポーネント
│   ├── checkout/  # チェックアウト関連コンポーネント
│   └── layout/    # レイアウトコンポーネント
├── context/       # React Context
├── data/          # 静的データ
├── hooks/         # カスタムフック
├── pages/         # ページコンポーネント
├── utils/         # ユーティリティ関数
├── App.jsx        # メインアプリケーション
└── main.jsx       # エントリーポイント
```
