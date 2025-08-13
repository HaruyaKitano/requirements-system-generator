@echo off
echo 🚀 要件定義書システムジェネレーター起動スクリプト
echo ==========================================

echo.
echo 📍 プロジェクトディレクトリ: %CD%

REM バックエンドとフロントエンドを並行で起動
echo.
echo 🔧 バックエンドとフロントエンドを起動中...

REM バックエンド起動（新しいウィンドウで）
start "Backend Server" cmd /k "cd /d %CD%\backend && venv\Scripts\activate && python -m app.main"

REM 少し待機
timeout /t 3 /nobreak > nul

REM フロントエンド起動（新しいウィンドウで）
start "Frontend Server" cmd /k "cd /d %CD%\frontend && npm start"

echo.
echo ✅ 起動完了！
echo.
echo 📋 アクセス方法:
echo   - フロントエンド: http://localhost:3000
echo   - バックエンドAPI: http://localhost:8000
echo   - API ドキュメント: http://localhost:8000/docs
echo.
echo ⚠️  注意: 初回起動時は.envファイルでOpenAI API キーを設定してください
echo.
pause