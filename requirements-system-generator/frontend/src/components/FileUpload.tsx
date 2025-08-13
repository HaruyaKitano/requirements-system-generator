import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUploadProps } from '../types';
import { validateFile } from '../services/api';

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const error = validateFile(file);
      
      if (error) {
        alert(error);
        return;
      }
      
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isDragActive ? '#e6f3ff' : '#fafafa',
          borderColor: isDragActive ? '#007bff' : '#ccc',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        <input {...getInputProps()} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '48px',
            opacity: 0.7
          }}>📄</div>
          {isLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>処理中...</p>
            </div>
          ) : (
            <>
              {isDragActive ? (
                <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>ファイルをここにドロップしてください</p>
              ) : (
                <div>
                  <p style={{ margin: 0, fontSize: '16px', color: '#333' }}>要件定義書をドラッグ&ドロップするか、クリックしてファイルを選択</p>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>対応形式: PDF, Word (.docx, .doc), Excel (.xlsx, .xls)</p>
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>最大ファイルサイズ: 10MB</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default FileUpload;