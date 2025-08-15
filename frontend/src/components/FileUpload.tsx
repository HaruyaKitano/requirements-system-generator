import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUploadProps, GenerationType } from '../types';
import { validateFile } from '../services/api';
import GenerationTypeSelector from './GenerationTypeSelector';

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<GenerationType>('comprehensive');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const error = validateFile(file);
      
      if (error) {
        alert(error);
        return;
      }
      
      setSelectedFile(file);
      setShowTypeSelector(true);
    }
  }, []);

  const handleFileSelectClick = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, selectedType);
      setSelectedFile(null);
      setShowTypeSelector(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setShowTypeSelector(false);
  };

  const handleTypeSelect = (type: GenerationType) => {
    setSelectedType(type);
  };

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

  if (showTypeSelector && selectedFile) {
    return (
      <div style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>📄</span>
            <span style={{ fontWeight: 600, color: '#333' }}>選択されたファイル:</span>
            <span style={{ color: '#007bff' }}>{selectedFile.name}</span>
          </div>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#666'
          }}>ファイルサイズ: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>

        <GenerationTypeSelector
          onTypeSelect={handleTypeSelect}
          isLoading={isLoading}
        />

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              border: '2px solid #ccc',
              borderRadius: '6px',
              backgroundColor: '#fff',
              color: '#333',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 500,
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleFileSelectClick}
            disabled={isLoading}
            style={{
              padding: '12px 32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,123,255,0.2)'
            }}
          >
            {isLoading ? '処理中...' : '生成開始'}
          </button>
        </div>
      </div>
    );
  }

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