import uuid
from typing import Dict, Optional
from datetime import datetime, timedelta
import threading

class SessionManager:
    def __init__(self, session_timeout_minutes: int = 60):
        self._sessions: Dict[str, dict] = {}
        self._lock = threading.Lock()
        self.timeout = timedelta(minutes=session_timeout_minutes)
    
    def create_session(self, extracted_text: str, filename: str) -> str:
        """
        新しいセッションを作成し、抽出されたテキストを保存
        """
        session_id = str(uuid.uuid4())
        
        with self._lock:
            self._sessions[session_id] = {
                'extracted_text': extracted_text,
                'filename': filename,
                'created_at': datetime.now(),
                'last_accessed': datetime.now()
            }
        
        return session_id
    
    def get_session_data(self, session_id: str) -> Optional[dict]:
        """
        セッションデータを取得
        """
        with self._lock:
            if session_id not in self._sessions:
                return None
            
            session = self._sessions[session_id]
            
            # セッションの有効期限をチェック
            if datetime.now() - session['created_at'] > self.timeout:
                del self._sessions[session_id]
                return None
            
            # 最終アクセス時刻を更新
            session['last_accessed'] = datetime.now()
            return session.copy()
    
    def update_session(self, session_id: str, **kwargs) -> bool:
        """
        セッションデータを更新
        """
        with self._lock:
            if session_id not in self._sessions:
                return False
            
            session = self._sessions[session_id]
            
            # セッションの有効期限をチェック
            if datetime.now() - session['created_at'] > self.timeout:
                del self._sessions[session_id]
                return False
            
            # データを更新
            for key, value in kwargs.items():
                session[key] = value
            
            session['last_accessed'] = datetime.now()
            return True
    
    def delete_session(self, session_id: str) -> bool:
        """
        セッションを削除
        """
        with self._lock:
            if session_id in self._sessions:
                del self._sessions[session_id]
                return True
            return False
    
    def cleanup_expired_sessions(self):
        """
        期限切れのセッションを削除
        """
        current_time = datetime.now()
        expired_sessions = []
        
        with self._lock:
            for session_id, session in self._sessions.items():
                if current_time - session['created_at'] > self.timeout:
                    expired_sessions.append(session_id)
            
            for session_id in expired_sessions:
                del self._sessions[session_id]
        
        return len(expired_sessions)
    
    def get_session_count(self) -> int:
        """
        アクティブなセッション数を取得
        """
        with self._lock:
            return len(self._sessions)

# グローバルなセッションマネージャーインスタンス
session_manager = SessionManager()