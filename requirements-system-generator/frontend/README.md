# フロントエンド (React + TypeScript)

## セットアップ

### 1. Node.js環境の確認
Node.js 16以上がインストールされていることを確認してください。

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定（オプション）
`.env`ファイルを作成してAPIのベースURLを設定できます。
```bash
REACT_APP_API_URL=http://localhost:8000
```

### 4. 開発サーバー起動
```bash
npm start
```

ブラウザで `http://localhost:3000` を開いてアプリケーションにアクセスできます。

## ビルド

本番用のビルドを作成する場合:
```bash
npm run build
```

## 主要機能

### ファイルアップロード
- ドラッグ&ドロップ対応
- PDF, Word (.docx, .doc), Excel (.xlsx, .xls) ファイルに対応
- ファイルサイズ制限: 10MB
- リアルタイムバリデーション

### 処理状況表示
- アップロード進捗表示
- 処理ステップの可視化
- エラーハンドリング

### 結果表示
- 生成されたシステム要件定義書の表示
- 抽出されたテキストの確認
- タブ切り替えインターフェース
- Markdownファイルのダウンロード

## 技術仕様

- **React**: 18.2.0
- **TypeScript**: 4.9.5
- **react-dropzone**: ファイルアップロード UI
- **axios**: HTTP クライアント
- **CSS-in-JS**: styled-jsx による動的スタイリング

## ディレクトリ構成

```
src/
├── components/          # Reactコンポーネント
│   ├── FileUpload.tsx   # ファイルアップロードコンポーネント
│   └── ResultDisplay.tsx # 結果表示コンポーネント
├── services/           # API通信関連
│   └── api.ts          # APIクライアント
├── types/              # TypeScript型定義
│   └── index.ts        # 型定義ファイル
├── App.tsx             # メインアプリケーションコンポーネント
└── index.tsx           # エントリーポイント
```

## 環境変数

- `REACT_APP_API_URL`: バックエンドAPIのベースURL (default: http://localhost:8000)