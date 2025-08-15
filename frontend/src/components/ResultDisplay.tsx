import React, { useState } from 'react';
import { ResultDisplayProps } from '../types';

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  filename,
  extractedText,
  generatedRequirements,
  onDownload,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'generated' | 'extracted'>('generated');

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          position: 'relative'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                backdropFilter: 'blur(10px)'
              }}>📄</div>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'white'
              }}>{filename}</h2>
            </div>
            <p style={{
              margin: 0,
              fontSize: '16px',
              opacity: 0.9,
              lineHeight: 1.5,
              fontWeight: 400
            }}>システム要件定義書のドラフトが生成されました</p>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={onDownload}
              style={{
                padding: '12px 24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💾 ダウンロード
            </button>
            <button
              onClick={onReset}
              style={{
                padding: '12px 24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔄 新しいファイル
            </button>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <button
          onClick={() => setActiveTab('generated')}
          style={{
            flex: 1,
            padding: '20px 32px',
            border: 'none',
            background: activeTab === 'generated' 
              ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' 
              : 'transparent',
            color: activeTab === 'generated' ? '#1f2937' : '#6b7280',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'generated' ? 600 : 500,
            transition: 'all 0.3s ease',
            borderBottom: activeTab === 'generated' ? '3px solid #667eea' : '3px solid transparent',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'generated') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.color = '#374151';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'generated') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }
          }}
        >
          ✨ 生成されたシステム要件定義書
        </button>
        <button
          onClick={() => setActiveTab('extracted')}
          style={{
            flex: 1,
            padding: '20px 32px',
            border: 'none',
            background: activeTab === 'extracted' 
              ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' 
              : 'transparent',
            color: activeTab === 'extracted' ? '#1f2937' : '#6b7280',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'extracted' ? 600 : 500,
            transition: 'all 0.3s ease',
            borderBottom: activeTab === 'extracted' ? '3px solid #667eea' : '3px solid transparent',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'extracted') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.color = '#374151';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'extracted') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }
          }}
        >
          📝 抽出されたテキスト
        </button>
      </div>

      <div style={{
        padding: '32px',
        minHeight: '500px',
        background: 'white'
      }}>
        {activeTab === 'generated' ? (
          <div>
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
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#0c4a6e'
                }}>AI生成コンテンツ</h3>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#0c4a6e',
                opacity: 0.8,
                lineHeight: 1.5
              }}>以下は、アップロードされた文書から自動生成されたシステム要件定義書です</p>
            </div>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#374151',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '600px',
              overflowY: 'auto'
            }}>
              {generatedRequirements}
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '1px solid #fbbf24',
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
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: 'white'
                }}>📄</div>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#92400e'
                }}>抽出されたテキスト</h3>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#92400e',
                opacity: 0.8,
                lineHeight: 1.5
              }}>アップロードされたファイルから抽出された元のテキスト内容です</p>
            </div>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#374151',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '600px',
              overflowY: 'auto'
            }}>
              {extractedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;