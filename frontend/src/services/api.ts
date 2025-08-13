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
   * ヘルスチェック
   */
  static async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  }
}

// ファイルバリデーション関数
export const validateFile = (file: File): string | null => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

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