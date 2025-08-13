from pydantic import BaseModel
from typing import Optional

class SystemRequirementsResponse(BaseModel):
    original_filename: str
    extracted_text: str
    generated_requirements: str
    status: str

class FileUploadResponse(BaseModel):
    filename: str
    extracted_text: str
    text_length: int

class ErrorResponse(BaseModel):
    detail: str
    status: str = "error"