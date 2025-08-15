from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import List, Optional
import os
from dotenv import load_dotenv

from .file_processor import FileProcessor
from .openai_client import OpenAIClient
from .models import SystemRequirementsResponse
from .session_manager import session_manager

load_dotenv()

app = FastAPI(title="Requirements System Generator", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発環境では全て許可
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# 初期化
file_processor = FileProcessor()
openai_client = OpenAIClient()

@app.get("/")
async def root():
    return {"message": "Requirements System Generator API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/favicon.ico")
async def favicon():
    return {"message": "No favicon"}

@app.post("/upload-and-generate", response_model=SystemRequirementsResponse)
async def upload_and_generate_requirements(file: UploadFile = File(...)):
    """
    要件定義書をアップロードし、システム要件定義書のドラフトを生成
    """
    try:
        # ファイル形式のチェック
        allowed_extensions = {'.pdf', '.docx', '.doc', '.xlsx', '.xls'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format. Allowed: {', '.join(allowed_extensions)}"
            )

        # ファイル内容を読み込み
        file_content = await file.read()
        
        # テキスト抽出
        extracted_text = file_processor.extract_text(file_content, file_extension)
        
        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No text could be extracted from the file"
            )

        # セッションを作成してテキストを保存
        session_id = session_manager.create_session(extracted_text, file.filename)
        
        # OpenAI APIでシステム要件定義書生成
        system_requirements = await openai_client.generate_system_requirements(extracted_text)
        
        return {
            "original_filename": file.filename,
            "extracted_text": extracted_text,
            "generated_requirements": system_requirements,
            "session_id": session_id,
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/extract-text")
async def extract_text_only(file: UploadFile = File(...)):
    """
    ファイルからテキストのみ抽出（テスト用）
    """
    try:
        file_extension = os.path.splitext(file.filename)[1].lower()
        file_content = await file.read()
        
        extracted_text = file_processor.extract_text(file_content, file_extension)
        
        return {
            "filename": file.filename,
            "extracted_text": extracted_text,
            "text_length": len(extracted_text)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")

@app.post("/generate-comprehensive")
async def generate_comprehensive_requirements(file: UploadFile = File(...)):
    """
    包括的なシステム要件定義書を生成（機能構成図・外部IF・性能・セキュリティ要件を含む）
    """
    try:
        # ファイル形式のチェック
        allowed_extensions = {'.pdf', '.docx', '.doc', '.xlsx', '.xls'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format. Allowed: {', '.join(allowed_extensions)}"
            )

        # ファイル内容を読み込み
        file_content = await file.read()
        
        # テキスト抽出
        extracted_text = file_processor.extract_text(file_content, file_extension)
        
        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No text could be extracted from the file"
            )

        # セッションを作成してテキストを保存
        session_id = session_manager.create_session(extracted_text, file.filename)
        
        # 包括的なシステム要件定義書生成
        system_requirements = await openai_client.generate_system_requirements(extracted_text)
        
        return {
            "original_filename": file.filename,
            "extracted_text": extracted_text,
            "generated_requirements": system_requirements,
            "session_id": session_id,
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/generate-functional-diagram")
async def generate_functional_diagram(file: UploadFile = File(...)):
    """
    機能構成図を生成
    """
    try:
        file_extension = os.path.splitext(file.filename)[1].lower()
        file_content = await file.read()
        extracted_text = file_processor.extract_text(file_content, file_extension)
        
        functional_diagram = await openai_client.generate_functional_diagram(extracted_text)
        
        return {
            "original_filename": file.filename,
            "functional_diagram": functional_diagram,
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating functional diagram: {str(e)}")

@app.post("/generate-external-interfaces")
async def generate_external_interfaces(file: UploadFile = File(...)):
    """
    外部インターフェース要件を生成
    """
    try:
        file_extension = os.path.splitext(file.filename)[1].lower()
        file_content = await file.read()
        extracted_text = file_processor.extract_text(file_content, file_extension)
        
        external_interfaces = await openai_client.generate_external_interfaces(extracted_text)
        
        return {
            "original_filename": file.filename,
            "external_interfaces": external_interfaces,
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating external interfaces: {str(e)}")

@app.post("/generate-performance-requirements")
async def generate_performance_requirements(file: UploadFile = File(...)):
    """
    性能要件を生成
    """
    try:
        file_extension = os.path.splitext(file.filename)[1].lower()
        file_content = await file.read()
        extracted_text = file_processor.extract_text(file_content, file_extension)
        
        performance_requirements = await openai_client.generate_performance_requirements(extracted_text)
        
        return {
            "original_filename": file.filename,
            "performance_requirements": performance_requirements,
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating performance requirements: {str(e)}")

@app.post("/generate-security-requirements")
async def generate_security_requirements(file: UploadFile = File(...)):
    """
    セキュリティ要件を生成
    """
    try:
        file_extension = os.path.splitext(file.filename)[1].lower()
        file_content = await file.read()
        extracted_text = file_processor.extract_text(file_content, file_extension)
        
        security_requirements = await openai_client.generate_security_requirements(extracted_text)
        
        return {
            "original_filename": file.filename,
            "security_requirements": security_requirements,
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating security requirements: {str(e)}")

# セッションベースの生成エンドポイント
@app.post("/generate-from-session/functional-diagram")
async def generate_functional_diagram_from_session(session_id: str = Form(...)):
    """
    セッションIDを使用して機能構成図を生成
    """
    try:
        session_data = session_manager.get_session_data(session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found or expired")
        
        functional_diagram = await openai_client.generate_functional_diagram(session_data['extracted_text'])
        
        return {
            "original_filename": session_data['filename'],
            "functional_diagram": functional_diagram,
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating functional diagram: {str(e)}")

@app.post("/generate-from-session/external-interfaces")
async def generate_external_interfaces_from_session(session_id: str = Form(...)):
    """
    セッションIDを使用して外部インターフェース要件を生成
    """
    try:
        session_data = session_manager.get_session_data(session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found or expired")
        
        external_interfaces = await openai_client.generate_external_interfaces(session_data['extracted_text'])
        
        return {
            "original_filename": session_data['filename'],
            "external_interfaces": external_interfaces,
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating external interfaces: {str(e)}")

@app.post("/generate-from-session/performance-requirements")
async def generate_performance_requirements_from_session(session_id: str = Form(...)):
    """
    セッションIDを使用して性能要件を生成
    """
    try:
        session_data = session_manager.get_session_data(session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found or expired")
        
        performance_requirements = await openai_client.generate_performance_requirements(session_data['extracted_text'])
        
        return {
            "original_filename": session_data['filename'],
            "performance_requirements": performance_requirements,
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating performance requirements: {str(e)}")

@app.post("/generate-from-session/security-requirements")
async def generate_security_requirements_from_session(session_id: str = Form(...)):
    """
    セッションIDを使用してセキュリティ要件を生成
    """
    try:
        session_data = session_manager.get_session_data(session_id)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found or expired")
        
        security_requirements = await openai_client.generate_security_requirements(session_data['extracted_text'])
        
        return {
            "original_filename": session_data['filename'],
            "security_requirements": security_requirements,
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating security requirements: {str(e)}")

@app.get("/session/{session_id}")
async def get_session_info(session_id: str):
    """
    セッション情報を取得
    """
    session_data = session_manager.get_session_data(session_id)
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found or expired")
    
    return {
        "session_id": session_id,
        "filename": session_data['filename'],
        "created_at": session_data['created_at'].isoformat(),
        "last_accessed": session_data['last_accessed'].isoformat(),
        "text_length": len(session_data['extracted_text'])
    }

@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """
    セッションを削除
    """
    success = session_manager.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"message": "Session deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)