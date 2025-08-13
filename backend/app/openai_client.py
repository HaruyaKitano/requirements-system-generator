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
        
        # 最も基本的な初期化方法でproxies問題を回避
        import os
        os.environ['OPENAI_API_KEY'] = self.api_key
        self.client = OpenAI()
            
        self.model = "gpt-4-turbo-preview"
    
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
            max_tokens=4000,
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

3. **非機能要件**
   - 性能要件（レスポンス時間、スループット等）
   - 可用性要件
   - セキュリティ要件
   - 運用・保守要件
   - 拡張性要件

4. **システム構成**
   - システムアーキテクチャ概要
   - 外部システム連携
   - データベース設計方針

5. **制約事項**
   - 技術的制約
   - 業務上の制約
   - 予算・スケジュール制約

6. **リスクと対策**
   - 想定されるリスク
   - 対応策

## 出力フォーマット:
Markdown形式で構造化された文書として出力してください。
各セクションは見出しを使用し、必要に応じて表やリストを使用して整理してください。

## 注意事項:
- 入力された要件定義書に明記されていない部分については、一般的なベストプラクティスに基づいて補完してください
- 具体的で実装可能な要件として記述してください
- 曖昧な表現は避け、定量的な指標を可能な限り含めてください

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