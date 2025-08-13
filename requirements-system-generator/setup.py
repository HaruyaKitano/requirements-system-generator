#!/usr/bin/env python3
"""
要件定義書システムジェネレーター セットアップスクリプト
"""

import os
import sys
import subprocess
import platform

def run_command(command, cwd=None):
    """コマンドを実行し、結果を返す"""
    try:
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=True, text=True, cwd=cwd)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def check_python_version():
    """Python バージョンチェック"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8以上が必要です")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_node_version():
    """Node.js バージョンチェック"""
    success, output = run_command("node --version")
    if not success:
        print("❌ Node.js がインストールされていません")
        return False
    
    version = output.strip().replace('v', '')
    major_version = int(version.split('.')[0])
    if major_version < 16:
        print(f"❌ Node.js 16以上が必要です (現在: {version})")
        return False
    
    print(f"✅ Node.js {version}")
    return True

def setup_backend():
    """バックエンドのセットアップ"""
    print("\n📦 バックエンドのセットアップ中...")
    
    backend_dir = os.path.join(os.getcwd(), 'backend')
    
    # 仮想環境の作成
    print("  仮想環境を作成中...")
    success, output = run_command("python -m venv venv", cwd=backend_dir)
    if not success:
        print(f"❌ 仮想環境の作成に失敗: {output}")
        return False
    
    # 仮想環境のアクティベートコマンドを取得
    if platform.system() == "Windows":
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
    else:
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    # 依存関係のインストール
    print("  依存関係をインストール中...")
    success, output = run_command(f"{pip_cmd} install -r requirements.txt", cwd=backend_dir)
    if not success:
        print(f"❌ 依存関係のインストールに失敗: {output}")
        return False
    
    # .envファイルの作成
    env_file = os.path.join(backend_dir, '.env')
    if not os.path.exists(env_file):
        print("  .envファイルを作成中...")
        with open(env_file, 'w') as f:
            f.write("# OpenAI API設定\n")
            f.write("OPENAI_API_KEY=your_openai_api_key_here\n\n")
            f.write("# FastAPI設定\n")
            f.write("DEBUG=True\n")
            f.write("HOST=0.0.0.0\n")
            f.write("PORT=8000\n\n")
            f.write("# CORS設定\n")
            f.write("FRONTEND_URL=http://localhost:3000\n")
        
        print("  ⚠️  .envファイルでOpenAI API キーを設定してください")
    
    print("✅ バックエンドのセットアップ完了")
    return True

def setup_frontend():
    """フロントエンドのセットアップ"""
    print("\n📦 フロントエンドのセットアップ中...")
    
    frontend_dir = os.path.join(os.getcwd(), 'frontend')
    
    # 依存関係のインストール
    print("  依存関係をインストール中...")
    success, output = run_command("npm install", cwd=frontend_dir)
    if not success:
        print(f"❌ 依存関係のインストールに失敗: {output}")
        return False
    
    print("✅ フロントエンドのセットアップ完了")
    return True

def main():
    print("🚀 要件定義書システムジェネレーター セットアップ")
    print("=" * 50)
    
    # 前提条件のチェック
    print("\n🔍 前提条件をチェック中...")
    if not check_python_version():
        sys.exit(1)
    
    if not check_node_version():
        sys.exit(1)
    
    # バックエンドのセットアップ
    if not setup_backend():
        sys.exit(1)
    
    # フロントエンドのセットアップ
    if not setup_frontend():
        sys.exit(1)
    
    print("\n🎉 セットアップ完了！")
    print("\n📋 次のステップ:")
    print("1. backend/.env ファイルでOpenAI API キーを設定")
    print("2. バックエンド起動: cd backend && python -m app.main")
    print("3. フロントエンド起動: cd frontend && npm start")
    print("4. ブラウザで http://localhost:3000 を開く")

if __name__ == "__main__":
    main()