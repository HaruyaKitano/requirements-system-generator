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
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23667eea" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}></div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ 
              width: '64px',
              height: '64px',
              background: `linear-gradient(135deg, ${typeInfo.color} 0%, ${typeInfo.color}CC 100%)`,
              color: 'white',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: `0 8px 20px rgba(0, 0, 0, 0.15)`,
              border: '3px solid rgba(255, 255, 255, 0.2)'
            }}>
              {typeInfo.icon}
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '28px',
                color: '#1f2937',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                marginBottom: '8px'
              }}>{typeInfo.title}</h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>📄</div>
                <span style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  fontWeight: 500
                }}>{filename}</span>
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleDownload}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.3)';
              }}
            >
              💾 ダウンロード
            </button>
            
            {onGenerateMore && (sessionId || uploadedFile) && (
              <button
                onClick={handleGenerateMore}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(16, 185, 129, 0.3)';
                }}
              >
                ✨ 他の要件も生成
              </button>
            )}
            
            <button
              onClick={onReset}
              style={{
                padding: '12px 24px',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              🔄 最初から
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: '16px',
          border: '1px solid #bbf7d0',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white'
            }}>✓</div>
            <span style={{ 
              fontSize: '16px', 
              color: '#166534',
              fontWeight: 600
            }}>生成完了</span>
          </div>
          <div style={{
            height: '24px',
            width: '1px',
            background: 'linear-gradient(to bottom, transparent, #bbf7d0, transparent)'
          }}></div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white'
            }}>📊</div>
            <span style={{ 
              fontSize: '15px', 
              color: '#166534',
              fontWeight: 500
            }}>
              {result.length.toLocaleString()}文字
            </span>
          </div>
        </div>
      </div>

      {/* 結果表示 */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '24px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #5b6fe8 0%, #6b4ba0 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}></div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              backdropFilter: 'blur(10px)'
            }}>✨</div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.025em'
            }}>生成された{typeInfo.title}</h3>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            position: 'relative'
          }}>
            <span style={{
              fontSize: '14px',
              opacity: 0.8,
              fontWeight: 500
            }}>{isExpanded ? '閉じる' : '開く'}</span>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease'
            }}>
              ▼
            </div>
          </div>
        </div>

        {isExpanded && (
          <div style={{
            padding: '32px',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '1px solid #bae6fd',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: 'white'
                }}>🤖</div>
                <h4 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#0c4a6e'
                }}>AI生成コンテンツ</h4>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#0c4a6e',
                opacity: 0.8,
                lineHeight: 1.5
              }}>以下は、アップロードされた文書から自動生成された{typeInfo.title}です</p>
            </div>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '28px',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '14px',
              lineHeight: 1.7,
              color: '#374151',
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
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '24px',
          padding: '32px',
          marginTop: '32px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310b981" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}></div>
          
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
            position: 'relative'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: 'white',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
              }}>🔄</div>
              <h3 style={{
                margin: 0,
                fontSize: '24px',
                color: '#1f2937',
                fontWeight: 700,
                letterSpacing: '-0.025em'
              }}>同じドキュメントから他の要件も生成</h3>
            </div>
            <p style={{
              margin: 0,
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: 1.6
            }}>既にアップロードされた文書を使用して、追加の要件定義を瞬時に生成できます</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
            position: 'relative'
          }}>
            {getAvailableGenerationTypes().map((item) => (
              <button
                key={item.type}
                onClick={() => handleGenerateNext(item.type)}
                style={{
                  padding: '20px 24px',
                  border: 'none',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  color: '#1f2937',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(148, 163, 184, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
                  e.currentTarget.style.color = '#1f2937';
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>{item.icon}</div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '1px solid #93c5fd',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white'
              }}>💡</div>
              <p style={{
                margin: 0,
                fontSize: '15px',
                color: '#1e40af',
                fontWeight: 500
              }}>
                既にアップロードされたドキュメントを使用するため、再アップロードは不要です
              </p>
            </div>
          </div>
        </div>
      )}

      {/* フッター情報 */}
      <div style={{
        textAlign: 'center',
        marginTop: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderRadius: '20px',
        border: '1px solid #fbbf24',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'white'
          }}>💡</div>
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#92400e',
            fontWeight: 500,
            lineHeight: 1.5
          }}>
            ヒント: Mermaid記法の図表は、Mermaid対応エディタやGitHubで表示できます
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndividualResultDisplay;