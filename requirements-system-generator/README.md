# 要件定義書からシステム要件定義書ドラフト生成アプリ

## 概要
要件定義書をアップロードし、その内容を解析してAIがシステム要件定義書のドラフトを自動生成するWebアプリケーションです。

## 技術スタック
- **フロントエンド**: React + TypeScript
- **バックエンド**: Python + FastAPI
- **AI連携**: OpenAI API (GPT-4)
- **ファイル処理**: PDF, Word, Excel対応

## プロジェクト構造
```
requirements-system-generator/
├── backend/                    # FastAPI バックエンド
│   ├── app/
│   │   ├── main.py            # FastAPI アプリケーション
│   │   ├── file_processor.py  # ファイル処理ロジック
│   │   ├── openai_client.py   # OpenAI API クライアント
│   │   └── models.py          # データモデル
│   ├── requirements.txt       # Python依存関係
│   ├── .env.example          # 環境変数テンプレート
│   └── README.md
├── frontend/                   # React フロントエンド
│   ├── src/
│   │   ├── components/        # Reactコンポーネント
│   │   ├── services/          # API通信
│   │   ├── types/             # TypeScript型定義
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── README.md
├── setup.py                   # 自動セットアップスクリプト
├── start.bat                  # Windows用起動スクリプト
├── start.sh                   # Linux/Mac用起動スクリプト
└── README.md
```

## 🚀 クイックスタート

### 1. 自動セットアップ（推奨）
```bash
python setup.py
```

### 2. 手動セットアップ

#### 前提条件
- Python 3.8以上
- Node.js 16以上
- OpenAI API キー

#### バックエンドセットアップ
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# .envファイルでOpenAI API キーを設定
```

#### フロントエンドセットアップ
```bash
cd frontend
npm install
```

### 3. アプリケーション起動

#### 自動起動（推奨）
```bash
# Windows
start.bat

# Linux/Mac  
./start.sh
```

#### 手動起動
```bash
# バックエンド起動（ターミナル1）
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python -m app.main

# フロントエンド起動（ターミナル2）
cd frontend
npm start
```

### 4. アクセス
- フロントエンド: http://localhost:3001
- バックエンドAPI: http://localhost:8002
- API ドキュメント: http://localhost:8002/docs

## 📋 機能

### ファイルアップロード
- ドラッグ&ドロップ対応
- 対応形式: PDF, Word (.docx, .doc), Excel (.xlsx, .xls)
- ファイルサイズ制限: 10MB
- リアルタイムバリデーション

### AI生成機能
- OpenAI GPT-4による高精度なシステム要件定義書生成
- 機能要件・非機能要件の自動分類
- Markdown形式での構造化出力

### ユーザーインターフェース
- 直感的なファイルアップロード画面
- 処理進捗のリアルタイム表示
- 生成結果の表示・編集
- Markdownファイルのダウンロード

## 🔧 設定

### 環境変数
`backend/.env` ファイルで以下を設定:

```bash
# OpenAI API設定（必須）
OPENAI_API_KEY=your_openai_api_key_here

# FastAPI設定
DEBUG=True
HOST=0.0.0.0
PORT=8002

# CORS設定
FRONTEND_URL=http://localhost:3001
```

## 📚 API ドキュメント

アプリケーション起動後、以下で確認可能:
- Swagger UI: http://localhost:8002/docs
- ReDoc: http://localhost:8002/redoc

### 主要エンドポイント
- `POST /upload-and-generate`: ファイルアップロードとシステム要件定義書生成
- `POST /extract-text`: テキスト抽出のみ（テスト用）
- `GET /health`: ヘルスチェック

## 🔍 トラブルシューティング

### よくある問題

1. **OpenAI API エラー**
   - `.env`ファイルでAPIキーが正しく設定されているか確認
   - APIキーの有効性を確認

2. **ファイルアップロードエラー**
   - ファイルサイズが10MB以下か確認
   - 対応形式（PDF, Word, Excel）か確認

3. **ポートエラー**
   - 8002番ポート（バックエンド）と3001番ポート（フロントエンド）が使用可能か確認

## 📄 ライセンス
このプロジェクトはMITライセンスの下で公開されています。