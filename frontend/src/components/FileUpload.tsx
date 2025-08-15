import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUploadProps, GenerationType } from '../types';
import { validateFile } from '../services/api';
import GenerationTypeSelector from './GenerationTypeSelector';

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading, sessionId }) => {
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
  
  // セッションがある場合、ファイルアップロードなしで直接生成選択画面へ
  const handleSessionBasedGeneration = () => {
    if (sessionId) {
      setShowTypeSelector(true);
    }
  };

  const handleFileSelectClick = () => {
    // セッションがある場合はファイルなしで生成（個別生成のみ）
    if (sessionId && selectedType !== 'comprehensive' && selectedType !== 'basic') {
      onFileSelect(new File([], ''), selectedType);
      setSelectedFile(null);
      setShowTypeSelector(false);
    } else if (selectedFile || sessionId) {
      onFileSelect(selectedFile || new File([], ''), selectedType);
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
      {sessionId && (
        <div className="render-card" style={{
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
          textAlign: 'center',
          background: 'rgba(124, 58, 237, 0.05)',
          border: '1px solid rgba(124, 58, 237, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--color-purple-600)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white'
            }}>💾</div>
            <h3 className="render-heading-3" style={{ 
              color: 'var(--color-purple-700)'
            }}>ドキュメント保存済み</h3>
          </div>
          <p className="render-text-body" style={{
            marginBottom: 'var(--space-5)',
            color: 'var(--color-purple-600)'
          }}>
            既にアップロードされたドキュメントから<br />追加の要件を生成できます
          </p>
          <button
            className="render-button render-button-primary"
            onClick={handleSessionBasedGeneration}
          >
            <span>✨</span>
            <span>追加要件を生成</span>
          </button>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className="render-card"
        style={{
          border: isDragActive 
            ? `2px dashed var(--color-purple-500)` 
            : `2px dashed var(--color-border-strong)`,
          padding: 'var(--space-12) var(--space-8)',
          textAlign: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          background: isDragActive 
            ? 'rgba(124, 58, 237, 0.05)' 
            : 'var(--color-surface)',
          opacity: isLoading ? 0.6 : 1,
          transform: isDragActive ? 'scale(1.01)' : 'scale(1)'
        }}
      >
        <input {...getInputProps()} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          {isLoading ? (
            <>
              <div style={{
                width: '64px',
                height: '64px',
                position: 'relative'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '20px'
                }}>📄</div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '18px', 
                  color: '#1f2937',
                  fontWeight: 600
                }}>アップロード中...</p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: '#6b7280'
                }}>しばらくお待ちください</p>
              </div>
            </>
          ) : (
            <>
              <div style={{
                width: '80px',
                height: '80px',
                background: isDragActive 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                transform: isDragActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease',
                boxShadow: isDragActive 
                  ? '0 10px 20px rgba(102, 126, 234, 0.3)'
                  : '0 4px 10px rgba(0, 0, 0, 0.1)'
              }}>
                {isDragActive ? '🎯' : '📄'}
              </div>
              
              <div style={{ maxWidth: '400px' }}>
                {isDragActive ? (
                  <div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '20px', 
                      color: '#1f2937',
                      fontWeight: 700,
                      marginBottom: '8px'
                    }}>ここにドロップ！</p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '15px', 
                      color: '#6b7280'
                    }}>ファイルを離して、アップロードを開始してください</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '18px', 
                      color: '#1f2937',
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      {sessionId ? '新しい要件定義書をアップロード' : 'ファイルをドラッグ&ドロップ'}
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '15px', 
                      color: '#6b7280',
                      marginBottom: '16px'
                    }}>
                      またはクリックしてファイルを選択
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      {[
                        { ext: 'PDF', color: '#ef4444' },
                        { ext: 'Word', color: '#2563eb' },
                        { ext: 'Excel', color: '#16a34a' }
                      ].map(({ ext, color }) => (
                        <span
                          key={ext}
                          style={{
                            backgroundColor: color,
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          {ext}
                        </span>
                      ))}
                    </div>
                    
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#9ca3af',
                      margin: 0
                    }}>最大ファイルサイズ: 10MB</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;