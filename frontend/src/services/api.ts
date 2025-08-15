import axios from 'axios';
import { SystemRequirementsResponse, FileUploadResponse } from '../types';

// APIベースURL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002';

// Axiosインスタンスの作成
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5分のタイムアウト
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // サーバーがエラーレスポンスを返した場合
      throw new Error(error.response.data.detail || 'サーバーエラーが発生しました');
    } else if (error.request) {
      // リクエストが送信されたがレスポンスがない場合
      throw new Error('サーバーに接続できません');
    } else {
      // その他のエラー
      throw new Error('予期しないエラーが発生しました');
    }
  }
);

export class ApiService {
  /**
   * 要件定義書をアップロードしてシステム要件定義書を生成
   */
  static async uploadAndGenerate(file: File): Promise<SystemRequirementsResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<SystemRequirementsResponse>(
      '/upload-and-generate',
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      }
    );

    return response.data;
  }

  /**
   * ファイルからテキストのみ抽出（テスト用）
   */
  static async extractTextOnly(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<FileUploadResponse>(
      '/extract-text',
      formData
    );

    return response.data;
  }

  /**
   * 包括的なシステム要件定義書を生成
   */
  static async generateComprehensive(file: File): Promise<SystemRequirementsResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<SystemRequirementsResponse>(
      '/generate-comprehensive',
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      }
    );

    return response.data;
  }

  /**
   * 機能構成図を生成
   */
  static async generateFunctionalDiagram(file: File): Promise<{ original_filename: string; functional_diagram: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      '/generate-functional-diagram',
      formData
    );

    return response.data;
  }

  /**
   * 外部インターフェース要件を生成
   */
  static async generateExternalInterfaces(file: File): Promise<{ original_filename: string; external_interfaces: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      '/generate-external-interfaces',
      formData
    );

    return response.data;
  }

  /**
   * 性能要件を生成
   */
  static async generatePerformanceRequirements(file: File): Promise<{ original_filename: string; performance_requirements: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      '/generate-performance-requirements',
      formData
    );

    return response.data;
  }

  /**
   * セキュリティ要件を生成
   */
  static async generateSecurityRequirements(file: File): Promise<{ original_filename: string; security_requirements: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      '/generate-security-requirements',
      formData
    );

    return response.data;
  }

  /**
   * セッションIDを使用して機能構成図を生成
   */
  static async generateFunctionalDiagramFromSession(sessionId: string): Promise<{ original_filename: string; functional_diagram: string; status: string }> {
    const formData = new FormData();
    formData.append('session_id', sessionId);

    const response = await apiClient.post(
      '/generate-from-session/functional-diagram',
      formData
    );

    return response.data;
  }

  /**
   * セッションIDを使用して外部インターフェース要件を生成
   */
  static async generateExternalInterfacesFromSession(sessionId: string): Promise<{ original_filename: string; external_interfaces: string; status: string }> {
    const formData = new FormData();
    formData.append('session_id', sessionId);

    const response = await apiClient.post(
      '/generate-from-session/external-interfaces',
      formData
    );

    return response.data;
  }

  /**
   * セッションIDを使用して性能要件を生成
   */
  static async generatePerformanceRequirementsFromSession(sessionId: string): Promise<{ original_filename: string; performance_requirements: string; status: string }> {
    const formData = new FormData();
    formData.append('session_id', sessionId);

    const response = await apiClient.post(
      '/generate-from-session/performance-requirements',
      formData
    );

    return response.data;
  }

  /**
   * セッションIDを使用してセキュリティ要件を生成
   */
  static async generateSecurityRequirementsFromSession(sessionId: string): Promise<{ original_filename: string; security_requirements: string; status: string }> {
    const formData = new FormData();
    formData.append('session_id', sessionId);

    const response = await apiClient.post(
      '/generate-from-session/security-requirements',
      formData
    );

    return response.data;
  }

  /**
   * セッション情報を取得
   */
  static async getSessionInfo(sessionId: string): Promise<{ session_id: string; filename: string; created_at: string; last_accessed: string; text_length: number }> {
    const response = await apiClient.get(`/session/${sessionId}`);
    return response.data;
  }

  /**
   * セッションを削除
   */
  static async deleteSession(sessionId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/session/${sessionId}`);
    return response.data;
  }

  /**
   * ヘルスチェック
   */
  static async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  }
}

// ファイルバリデーション関数
export const validateFile = (file: File): string | null => {

  const allowedExtensions = ['.pdf', '.docx', '.doc', '.xlsx', '.xls'];
  
  // ファイルサイズチェック（10MB）
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'ファイルサイズは10MB以下である必要があります';
  }

  // ファイル形式チェック
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return '対応していないファイル形式です。PDF、Word、Excelファイルのみアップロード可能です';
  }

  return null;
};

// ダウンロード関数
export const downloadAsFile = (content: string, filename: string, contentType: string = 'text/markdown') => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};