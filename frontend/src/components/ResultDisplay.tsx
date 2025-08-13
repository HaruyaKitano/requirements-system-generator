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
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '24px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div className="file-info">
          <h2>📄 {filename}</h2>
          <p>システム要件定義書のドラフトが生成されました</p>
        </div>
        <div className="action-buttons">
          <button onClick={onDownload} className="download-btn">
            💾 ダウンロード
          </button>
          <button onClick={onReset} className="reset-btn">
            🔄 新しいファイル
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'generated' ? 'active' : ''}`}
          onClick={() => setActiveTab('generated')}
        >
          生成されたシステム要件定義書
        </button>
        <button
          className={`tab ${activeTab === 'extracted' ? 'active' : ''}`}
          onClick={() => setActiveTab('extracted')}
        >
          抽出されたテキスト
        </button>
      </div>

      <div className="content-area">
        {activeTab === 'generated' ? (
          <div className="generated-content">
            <div className="markdown-content">
              <pre>{generatedRequirements}</pre>
            </div>
          </div>
        ) : (
          <div className="extracted-content">
            <div className="text-content">
              <pre>{extractedText}</pre>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ResultDisplay;