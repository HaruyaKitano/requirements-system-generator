import os
from openai import OpenAI
from typing import Optional
import asyncio
import functools

class OpenAIClient:
    """
    OpenAI APIとの連携を行うクラス
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        # HTTPXクライアント問題を回避
        try:
            import httpx
            # シンプルなHTTPクライアントを作成（タイムアウトを延長）
            http_client = httpx.Client(timeout=120.0)
            self.client = OpenAI(api_key=self.api_key, http_client=http_client, timeout=120.0)
        except Exception:
            # フォールバック: 環境変数経由で初期化
            original_key = os.environ.get('OPENAI_API_KEY')
            os.environ['OPENAI_API_KEY'] = self.api_key
            self.client = OpenAI(timeout=120.0)
            # 元の環境変数を復元
            if original_key:
                os.environ['OPENAI_API_KEY'] = original_key
            elif 'OPENAI_API_KEY' in os.environ:
                del os.environ['OPENAI_API_KEY']
            
        self.model = "gpt-4o"
    
    async def generate_system_requirements(self, requirements_text: str) -> str:
        """
        要件定義書のテキストからシステム要件定義書を生成
        
        Args:
            requirements_text: 抽出された要件定義書のテキスト
            
        Returns:
            生成されたシステム要件定義書のドラフト
        """
        try:
            # 非同期でOpenAI APIを呼び出し
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                functools.partial(self._call_openai_api, requirements_text)
            )
            return response
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    def _call_openai_api(self, requirements_text: str) -> str:
        """
        OpenAI APIの同期呼び出し
        """
        prompt = self._create_system_requirements_prompt(requirements_text)
        
        response = self.client.chat.completions.create(
            model=self.model,
            max_tokens=16000,
            temperature=0.7,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        return response.choices[0].message.content
    
    
    async def generate_functional_diagram(self, requirements_text: str) -> str:
        """
        機能構成図をMermaid記法で生成
        """
        try:
            prompt = f"""
以下の要件定義書を分析し、システムの機能構成図をMermaid記法で作成してください。

要件定義書:
{requirements_text}

## 出力要件:
1. Mermaid flowchart記法を使用
2. 主要な機能モジュールとその関係を表現
3. データフローも含める
4. ユーザーインターフェース、ビジネスロジック、データアクセス層を明確に分離
5. 外部システムとの連携も表現

## フォーマット例:
```mermaid
flowchart TD
    A[ユーザー] --> B[ユーザーインターフェース]
    B --> C[ビジネスロジック]
    C --> D[データアクセス層]
    D --> E[データベース]
```

機能構成図のMermaidコードを生成してください:
"""
            
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                functools.partial(self._call_openai_api_simple, prompt)
            )
            return response
        except Exception as e:
            raise Exception(f"機能構成図生成エラー: {str(e)}")
    
    async def generate_external_interfaces(self, requirements_text: str) -> str:
        """
        外部インターフェース要件を生成
        """
        try:
            prompt = f"""
以下の要件定義書を分析し、外部インターフェース要件を詳細に記述してください。

要件定義書:
{requirements_text}

## 含めるべき内容:
1. **外部システム連携一覧**
   - 連携先システム名
   - 連携目的
   - データ交換方式（REST API、ファイル連携等）

2. **API仕様**
   - エンドポイント仕様
   - リクエスト/レスポンス形式
   - 認証方式
   - エラーハンドリング

3. **ファイル連携仕様**
   - ファイル形式（CSV、XML、JSON等）
   - 配置場所
   - 処理タイミング

4. **データ形式・プロトコル**
   - 文字コード
   - 日付形式
   - 通信プロトコル

5. **セキュリティ要件**
   - 暗号化要件
   - 認証・認可方式
   - ネットワークセキュリティ

Markdown形式で詳細な外部インターフェース要件を作成してください:
"""
            
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                functools.partial(self._call_openai_api_simple, prompt)
            )
            return response
        except Exception as e:
            raise Exception(f"外部IF要件生成エラー: {str(e)}")
    
    async def generate_performance_requirements(self, requirements_text: str) -> str:
        """
        性能要件を詳細に生成
        """
        try:
            prompt = f"""
以下の要件定義書を分析し、詳細な性能要件を作成してください。

要件定義書:
{requirements_text}

## 含めるべき性能要件:
1. **レスポンス時間要件**
   - 画面表示時間（目標値・限界値）
   - API応答時間
   - バッチ処理時間

2. **スループット要件**
   - 同時接続ユーザー数
   - トランザクション処理件数/秒
   - データ処理量/時間

3. **リソース使用量**
   - CPU使用率
   - メモリ使用量
   - ディスク容量
   - ネットワーク帯域

4. **可用性要件**
   - システム稼働率（99.9%等）
   - 計画停止時間
   - 障害復旧時間（RTO・RPO）

5. **拡張性要件**
   - ユーザー数増加への対応
   - データ量増加への対応
   - 処理量増加への対応

6. **性能監視要件**
   - 監視項目
   - アラート条件
   - 性能測定方法

具体的な数値を含む詳細な性能要件をMarkdown形式で作成してください:
"""
            
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                functools.partial(self._call_openai_api_simple, prompt)
            )
            return response
        except Exception as e:
            raise Exception(f"性能要件生成エラー: {str(e)}")
    
    async def generate_security_requirements(self, requirements_text: str) -> str:
        """
        セキュリティ要件を詳細に生成
        """
        try:
            prompt = f"""
以下の要件定義書を分析し、包括的なセキュリティ要件を作成してください。

要件定義書:
{requirements_text}

## 含めるべきセキュリティ要件:
1. **認証・認可**
   - ユーザー認証方式
   - パスワードポリシー
   - 多要素認証
   - アクセス権限管理
   - セッション管理

2. **データ保護**
   - データ暗号化（保存時・転送時）
   - 個人情報保護
   - データマスキング
   - データバックアップ暗号化

3. **ネットワークセキュリティ**
   - ファイアウォール設定
   - VPN要件
   - SSL/TLS設定
   - 不正アクセス検知

4. **アプリケーションセキュリティ**
   - SQLインジェクション対策
   - XSS対策
   - CSRF対策
   - 入力値検証

5. **監査・ログ**
   - アクセスログ
   - 操作ログ
   - セキュリティイベントログ
   - ログ保存期間

6. **セキュリティテスト**
   - 脆弱性診断
   - ペネトレーションテスト
   - セキュリティコードレビュー

7. **インシデント対応**
   - セキュリティインシデント対応手順
   - 緊急時連絡体制
   - 証跡保全

詳細なセキュリティ要件をMarkdown形式で作成してください:
"""
            
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                functools.partial(self._call_openai_api_simple, prompt)
            )
            return response
        except Exception as e:
            raise Exception(f"セキュリティ要件生成エラー: {str(e)}")
    
    def _call_openai_api_simple(self, prompt: str) -> str:
        """
        シンプルなOpenAI API呼び出し
        """
        response = self.client.chat.completions.create(
            model=self.model,
            max_tokens=8000,
            temperature=0.7,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        return response.choices[0].message.content
    
    def _create_system_requirements_prompt(self, requirements_text: str) -> str:
        """
        システム要件定義書生成用のプロンプトを作成
        """
        prompt = f"""
あなたは経験豊富なシステムアナリストです。以下の要件定義書の内容を分析し、詳細なシステム要件定義書のドラフトを作成してください。

## 入力された要件定義書:
{requirements_text}

## システム要件定義書に含めるべき項目:

1. **システム概要**
   - システムの目的と背景
   - 対象ユーザー
   - システムのスコープ

2. **機能要件**
   - 主要機能の詳細
   - ユーザーストーリー/ユースケース
   - 入出力要件
   - データ要件

3. **機能構成図**
   - システム全体の機能構成をMermaid記法で表現
   - 主要機能モジュール間の関係
   - データフローの概要

4. **外部インターフェース要件**
   - 外部システムとの連携仕様
   - API接続要件
   - データ交換フォーマット
   - 認証・認可方式

5. **性能要件**
   - レスポンス時間要件（具体的な数値）
   - スループット要件（トランザクション数/秒）
   - 同時接続ユーザー数
   - データ容量・成長予測
   - 可用性要件（稼働率）

6. **セキュリティ要件**
   - 認証・認可方式
   - データ暗号化要件
   - アクセス制御ポリシー
   - 監査ログ要件
   - セキュリティテスト要件
   - 脆弱性対策

7. **非機能要件（その他）**
   - 運用・保守要件
   - 拡張性要件
   - 互換性要件
   - 国際化・ローカライゼーション

8. **システム構成**
   - システムアーキテクチャ概要
   - 技術スタック
   - データベース設計方針
   - インフラ構成

9. **制約事項**
   - 技術的制約
   - 業務上の制約
   - 予算・スケジュール制約

10. **リスクと対策**
    - 想定されるリスク
    - 対応策

## 出力フォーマット:
Markdown形式で構造化された文書として出力してください。
各セクションは見出しを使用し、必要に応じて表やリストを使用して整理してください。
機能構成図はMermaid記法を使用してください。

## 注意事項:
- 入力された要件定義書に明記されていない部分については、一般的なベストプラクティスに基づいて補完してください
- 具体的で実装可能な要件として記述してください
- 曖昧な表現は避け、定量的な指標を可能な限り含めてください
- 性能要件とセキュリティ要件は特に詳細に記述してください

システム要件定義書のドラフトを作成してください:
"""
        return prompt
    
    async def extract_key_requirements(self, requirements_text: str) -> dict:
        """
        要件定義書から主要な要件を抽出・分類
        
        Args:
            requirements_text: 要件定義書のテキスト
            
        Returns:
            分類された要件の辞書
        """
        try:
            prompt = f"""
以下の要件定義書から主要な要件を抽出し、カテゴリごとに分類してください。

要件定義書:
{requirements_text}

以下のJSON形式で出力してください:
{{
    "functional_requirements": ["機能要件1", "機能要件2", ...],
    "non_functional_requirements": ["非機能要件1", "非機能要件2", ...],
    "business_requirements": ["業務要件1", "業務要件2", ...],
    "technical_constraints": ["技術制約1", "技術制約2", ...],
    "stakeholders": ["ステークホルダー1", "ステークホルダー2", ...]
}}
"""
            
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                functools.partial(self._call_openai_api_json, prompt)
            )
            
            import json
            return json.loads(response)
            
        except Exception as e:
            # エラー時は空の辞書を返す
            return {
                "functional_requirements": [],
                "non_functional_requirements": [],
                "business_requirements": [],
                "technical_constraints": [],
                "stakeholders": []
            }
    
    def _call_openai_api_json(self, prompt: str) -> str:
        """
        JSON出力用のOpenAI API呼び出し
        """
        response = self.client.chat.completions.create(
            model=self.model,
            max_tokens=2000,
            temperature=0.3,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        return response.choices[0].message.content