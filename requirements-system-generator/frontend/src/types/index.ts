// API レスポンスの型定義

export interface SystemRequirementsResponse {
  original_filename: string;
  extracted_text: string;
  generated_requirements: string;
  status: string;
}

export interface FileUploadResponse {
  filename: string;
  extracted_text: string;
  text_length: number;
}

export interface ErrorResponse {
  detail: string;
  status: string;
}

// アプリケーションの状態管理用の型
export interface AppState {
  isLoading: boolean;
  error: string | null;
  uploadedFile: File | null;
  extractedText: string | null;
  generatedRequirements: string | null;
  currentStep: 'upload' | 'processing' | 'result';
}

// ファイルアップロード用の型
export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

// 結果表示用の型
export interface ResultDisplayProps {
  filename: string;
  extractedText: string;
  generatedRequirements: string;
  onDownload: () => void;
  onReset: () => void;
}