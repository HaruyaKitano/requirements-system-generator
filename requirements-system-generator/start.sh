#!/bin/bash

echo "🚀 要件定義書システムジェネレーター起動スクリプト"
echo "=========================================="

echo ""
echo "📍 プロジェクトディレクトリ: $(pwd)"

# バックエンドの起動確認
if [ ! -d "backend/venv" ]; then
    echo "❌ バックエンドの仮想環境が見つかりません"
    echo "   setup.py を実行してセットアップを完了してください"
    exit 1
fi

# フロントエンドの依存関係確認
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ フロントエンドの依存関係がインストールされていません"
    echo "   setup.py を実行してセットアップを完了してください"
    exit 1
fi

echo ""
echo "🔧 バックエンドとフロントエンドを起動中..."

# バックエンド起動（バックグラウンド）
echo "  📊 バックエンドサーバーを起動中..."
cd backend
source venv/bin/activate
python -m app.main &
BACKEND_PID=$!
cd ..

# 少し待機
sleep 3

# フロントエンド起動（バックグラウンド）
echo "  🌐 フロントエンドサーバーを起動中..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 起動完了！"
echo ""
echo "📋 アクセス方法:"
echo "  - フロントエンド: http://localhost:3000"
echo "  - バックエンドAPI: http://localhost:8000"
echo "  - API ドキュメント: http://localhost:8000/docs"
echo ""
echo "⚠️  注意: .envファイルでOpenAI API キーを設定してください"
echo ""
echo "🛑 終了するには Ctrl+C を押してください"

# シグナルハンドラーで子プロセスを終了
trap 'echo ""; echo "🛑 サーバーを終了中..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT

# フォアグラウンドで待機
wait