from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import List
import os
from dotenv import load_dotenv

from .file_processor import FileProcessor
from .openai_client import OpenAIClient
from .models import SystemRequirementsResponse

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

        # OpenAI APIでシステム要件定義書生成
        system_requirements = await openai_client.generate_system_requirements(extracted_text)
        
        return SystemRequirementsResponse(
            original_filename=file.filename,
            extracted_text=extracted_text,
            generated_requirements=system_requirements,
            status="success"
        )

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)