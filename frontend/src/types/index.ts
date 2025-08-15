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
  generationType: GenerationType | null;
  individualResults: {
    functionalDiagram?: string;
    externalInterfaces?: string;
    performanceRequirements?: string;
    securityRequirements?: string;
  };
}

// ファイルアップロード用の型
export interface FileUploadProps {
  onFileSelect: (file: File, generationType?: GenerationType) => void;
  isLoading: boolean;
}

// 生成タイプの型
export type GenerationType = 'comprehensive' | 'basic' | 'functional-diagram' | 'external-interfaces' | 'performance' | 'security';

// 個別生成レスポンスの型
export interface FunctionalDiagramResponse {
  original_filename: string;
  functional_diagram: string;
  status: string;
}

export interface ExternalInterfacesResponse {
  original_filename: string;
  external_interfaces: string;
  status: string;
}

export interface PerformanceRequirementsResponse {
  original_filename: string;
  performance_requirements: string;
  status: string;
}

export interface SecurityRequirementsResponse {
  original_filename: string;
  security_requirements: string;
  status: string;
}

// 結果表示用の型
export interface ResultDisplayProps {
  filename: string;
  extractedText: string;
  generatedRequirements: string;
  onDownload: () => void;
  onReset: () => void;
}