# バックエンド (FastAPI)

## セットアップ

### 1. 仮想環境の作成・有効化
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# または
venv\Scripts\activate  # Windows
```

### 2. 依存関係のインストール
```bash
pip install -r requirements.txt
```

### 3. 環境変数の設定
`.env.example`をコピーして`.env`ファイルを作成し、OpenAI APIキーを設定してください。

```bash
cp .env.example .env
```

`.env`ファイルを編集:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### 4. サーバー起動
```bash
# 開発モード
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# または
python -m app.main
```

## API エンドポイント

### GET /
- 基本ヘルスチェック

### GET /health
- アプリケーションの健全性確認

### POST /upload-and-generate
- 要件定義書をアップロードしてシステム要件定義書ドラフトを生成
- 対応形式: PDF, DOCX, DOC, XLSX, XLS
- レスポンス: 抽出テキストと生成された要件定義書

### POST /extract-text
- ファイルからテキストのみ抽出（テスト用）

## 対応ファイル形式

- **PDF**: PyPDF2を使用
- **Word (.docx)**: python-docxを使用  
- **Word (.doc)**: mammothを使用
- **Excel (.xlsx, .xls)**: openpyxlを使用

## 環境変数

- `OPENAI_API_KEY`: OpenAI APIキー（必須）
- `DEBUG`: デバッグモード (default: True)
- `HOST`: サーバーホスト (default: 0.0.0.0)
- `PORT`: サーバーポート (default: 8000)
- `FRONTEND_URL`: フロントエンドURL (CORS用)