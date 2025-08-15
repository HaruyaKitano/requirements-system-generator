import React, { useState } from 'react';
import { GenerationType } from '../types';

interface GenerationTypeSelectorProps {
  onTypeSelect: (type: GenerationType) => void;
  isLoading: boolean;
}

const GenerationTypeSelector: React.FC<GenerationTypeSelectorProps> = ({ onTypeSelect, isLoading }) => {
  const [selectedType, setSelectedType] = useState<GenerationType>('comprehensive');

  const generationTypes = [
    {
      type: 'comprehensive' as GenerationType,
      title: '包括的生成',
      description: 'システム概要から性能・セキュリティ要件まで全てを含む完全版',
      icon: '📋',
      recommended: true
    },
    {
      type: 'basic' as GenerationType,
      title: '基本生成',
      description: '基本的なシステム要件定義書のみ',
      icon: '📄',
      recommended: false
    },
    {
      type: 'functional-diagram' as GenerationType,
      title: '機能構成図',
      description: 'システムの機能構成図のみをMermaid記法で生成',
      icon: '🔗',
      recommended: false
    },
    {
      type: 'external-interfaces' as GenerationType,
      title: '外部インターフェース',
      description: '外部システム連携とAPI仕様のみ',
      icon: '🔌',
      recommended: false
    },
    {
      type: 'performance' as GenerationType,
      title: '性能要件',
      description: 'レスポンス時間・スループット・可用性要件のみ',
      icon: '⚡',
      recommended: false
    },
    {
      type: 'security' as GenerationType,
      title: 'セキュリティ要件',
      description: '認証・暗号化・監査ログ等のセキュリティ要件のみ',
      icon: '🔒',
      recommended: false
    }
  ];

  const handleSelect = (type: GenerationType) => {
    setSelectedType(type);
    onTypeSelect(type);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px 0'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '24px',
          color: '#333'
        }}>生成タイプを選択してください</h2>
        <p style={{
          margin: 0,
          color: '#666',
          fontSize: '14px'
        }}>ニーズに応じて最適な生成タイプをお選びください</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        {generationTypes.map((item) => (
          <div
            key={item.type}
            onClick={() => !isLoading && handleSelect(item.type)}
            style={{
              border: selectedType === item.type ? '2px solid #007bff' : '2px solid #e0e0e0',
              borderRadius: '12px',
              padding: '20px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: selectedType === item.type ? '#f8f9ff' : '#fff',
              position: 'relative',
              opacity: isLoading ? 0.6 : 1,
              transform: selectedType === item.type ? 'translateY(-2px)' : 'none',
              boxShadow: selectedType === item.type 
                ? '0 4px 12px rgba(0, 123, 255, 0.15)' 
                : '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {item.recommended && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '16px',
                backgroundColor: '#28a745',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                推奨
              </div>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                color: '#333',
                fontWeight: 600
              }}>{item.title}</h3>
              {selectedType === item.type && (
                <span style={{
                  marginLeft: 'auto',
                  color: '#007bff',
                  fontSize: '18px'
                }}>✓</span>
              )}
            </div>
            
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.4'
            }}>{item.description}</p>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <p style={{
            margin: '0 0 8px 0',
            fontWeight: 600,
            color: '#333'
          }}>選択中: {generationTypes.find(t => t.type === selectedType)?.title}</p>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#666'
          }}>{generationTypes.find(t => t.type === selectedType)?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default GenerationTypeSelector;