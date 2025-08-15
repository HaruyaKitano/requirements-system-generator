import React, { useState } from 'react';
import { GenerationType } from '../types';
import { downloadAsFile } from '../services/api';

interface IndividualResultDisplayProps {
  filename: string;
  generationType: GenerationType;
  result: string;
  onReset: () => void;
  onGenerateMore?: (file: File) => void;
  onGenerateNext?: (generationType: GenerationType) => void;
  uploadedFile?: File | null;
  sessionId?: string | null;
}

const IndividualResultDisplay: React.FC<IndividualResultDisplayProps> = ({
  filename,
  generationType,
  result,
  onReset,
  onGenerateMore,
  onGenerateNext,
  uploadedFile,
  sessionId
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getTypeInfo = (type: GenerationType) => {
    switch (type) {
      case 'comprehensive':
        return { title: '包括的システム要件定義書', icon: '📋', color: '#28a745' };
      case 'basic':
        return { title: '基本システム要件定義書', icon: '📄', color: '#007bff' };
      case 'functional-diagram':
        return { title: '機能構成図', icon: '🔗', color: '#6f42c1' };
      case 'external-interfaces':
        return { title: '外部インターフェース要件', icon: '🔌', color: '#fd7e14' };
      case 'performance':
        return { title: '性能要件', icon: '⚡', color: '#ffc107' };
      case 'security':
        return { title: 'セキュリティ要件', icon: '🔒', color: '#dc3545' };
      default:
        return { title: '生成結果', icon: '📄', color: '#6c757d' };
    }
  };

  const typeInfo = getTypeInfo(generationType);

  const handleDownload = () => {
    const fileExtension = generationType === 'functional-diagram' ? '.md' : '.md';
    const downloadFilename = `${typeInfo.title}_${filename.split('.')[0]}${fileExtension}`;
    downloadAsFile(result, downloadFilename);
  };

  const handleGenerateMore = () => {
    if (onGenerateMore && uploadedFile) {
      onGenerateMore(uploadedFile);
    }
  };

  const getAvailableGenerationTypes = (): { type: GenerationType; label: string; icon: string }[] => {
    const allTypes = [
      { type: 'functional-diagram' as GenerationType, label: '機能構成図', icon: '🔗' },
      { type: 'external-interfaces' as GenerationType, label: '外部インターフェース要件', icon: '🔌' },
      { type: 'performance' as GenerationType, label: '性能要件', icon: '⚡' },
      { type: 'security' as GenerationType, label: 'セキュリティ要件', icon: '🔒' }
    ];
    
    // 現在のタイプ以外を返す
    return allTypes.filter(item => item.type !== generationType);
  };

  const handleGenerateNext = (nextType: GenerationType) => {
    if (onGenerateNext) {
      onGenerateNext(nextType);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 0'
    }}>
      {/* ヘッダー */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ 
              fontSize: '24px',
              backgroundColor: typeInfo.color,
              color: 'white',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {typeInfo.icon}
            </span>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                color: '#333',
                fontWeight: 600
              }}>{typeInfo.title}</h2>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: '#666'
              }}>ファイル: {filename}</p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '8px 16px',
                border: '1px solid #007bff',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease'
              }}
            >
              📥 ダウンロード
            </button>
            
            {onGenerateMore && (sessionId || uploadedFile) && (
              <button
                onClick={handleGenerateMore}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #28a745',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  color: '#28a745',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease'
                }}
              >
                ➕ 他の要件も生成
              </button>
            )}
            
            <button
              onClick={onReset}
              style={{
                padding: '8px 16px',
                border: '1px solid #6c757d',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#6c757d',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 最初から
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>生成完了</span>
            <span style={{ fontSize: '16px', color: '#28a745' }}>✅</span>
          </div>
          <div style={{
            height: '16px',
            width: '1px',
            backgroundColor: '#dee2e6'
          }}></div>
          <span style={{ fontSize: '14px', color: '#666' }}>
            文字数: {result.length.toLocaleString()}文字
          </span>
        </div>
      </div>

      {/* 結果表示 */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e9ecef',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background-color 0.3s ease'
          }}
        >
          <h3 style={{
            margin: 0,
            fontSize: '16px',
            color: '#333',
            fontWeight: 600
          }}>生成された{typeInfo.title}</h3>
          <span style={{
            fontSize: '18px',
            color: '#666',
            transform: isExpanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </span>
        </div>

        {isExpanded && (
          <div style={{
            padding: '24px',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '6px',
              padding: '20px',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              color: '#333',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {result}
            </div>
          </div>
        )}
      </div>

      {/* 次の生成選択セクション */}
      {sessionId && onGenerateNext && (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            color: '#333',
            fontWeight: 600,
            textAlign: 'center'
          }}>🔄 同じドキュメントから他の要件も生成</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginTop: '16px'
          }}>
            {getAvailableGenerationTypes().map((item) => (
              <button
                key={item.type}
                onClick={() => handleGenerateNext(item.type)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#007bff';
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef';
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          
          <p style={{
            margin: '16px 0 0 0',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
          }}>
            💡 既にアップロードされたドキュメントを使用するため、再アップロードは不要です
          </p>
        </div>
      )}

      {/* フッター情報 */}
      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666'
        }}>
          💡 ヒント: Mermaid記法の図表は、Mermaid対応エディタやGitHubで表示できます
        </p>
      </div>
    </div>
  );
};

export default IndividualResultDisplay;