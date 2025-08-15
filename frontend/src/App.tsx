import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { AppState } from './types';
import { ApiService, downloadAsFile } from './services/api';
import { SystemRequirementsResponse } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    error: null,
    uploadedFile: null,
    extractedText: null,
    generatedRequirements: null,
    currentStep: 'upload',
  });

  const handleFileSelect = async (file: File, generationType: 'comprehensive' | 'basic' = 'comprehensive') => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      uploadedFile: file,
      currentStep: 'processing',
    }));

    try {
      // 型を明示的に指定
      let response: SystemRequirementsResponse;
      if (generationType === 'comprehensive') {
        response = await ApiService.generateComprehensive(file);
      } else {
        response = await ApiService.uploadAndGenerate(file);
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        extractedText: response.extracted_text,
        generatedRequirements: response.generated_requirements,
        currentStep: 'result',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
        currentStep: 'upload',
      }));
    }
  };

  const handleDownload = () => {
    if (state.generatedRequirements && state.uploadedFile) {
      const filename = `システム要件定義書_${state.uploadedFile.name.split('.')[0]}.md`;
      downloadAsFile(state.generatedRequirements, filename);
    }
  };

  const handleReset = () => {
    setState({
      isLoading: false,
      error: null,
      uploadedFile: null,
      extractedText: null,
      generatedRequirements: null,
      currentStep: 'upload',
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        color: 'white',
        padding: '32px 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{
            margin: '0 0 12px 0',
            fontSize: '32px',
            fontWeight: 600
          }}>🤖 システム要件定義書ジェネレーター</h1>
          <p style={{
            margin: 0,
            fontSize: '16px',
            opacity: 0.9
          }}>要件定義書をアップロードして、機能構成図・外部IF・性能/セキュリティ要件を含む包括的なシステム要件定義書を自動生成します</p>
        </div>
      </header>

      <main style={{
        flex: 1,
        padding: '40px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {state.error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '16px',
              borderRadius: '6px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span>⚠️</span>
              <span>{state.error}</span>
              <button 
                onClick={() => setState(prev => ({ ...prev, error: null }))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#721c24',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginLeft: 'auto'
                }}
              >
                ✕
              </button>
            </div>
          )}

          {state.currentStep === 'upload' && (
            <div className="upload-section">
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={state.isLoading}
              />
            </div>
          )}

          {state.currentStep === 'processing' && (
            <div className="processing-section">
              <div className="processing-content">
                <div className="spinner-large"></div>
                <h2>処理中...</h2>
                <p>ファイルを解析して包括的なシステム要件定義書を生成しています</p>
                <div className="processing-steps">
                  <div className="step completed">✓ ファイルアップロード完了</div>
                  <div className="step processing">⏳ テキスト抽出中...</div>
                  <div className="step">🤖 AI分析・生成中（機能構成図・外部IF・性能/セキュリティ要件含む）...</div>
                </div>
              </div>
            </div>
          )}

          {state.currentStep === 'result' && state.uploadedFile && state.extractedText && state.generatedRequirements && (
            <div className="result-section">
              <ResultDisplay
                filename={state.uploadedFile.name}
                extractedText={state.extractedText}
                generatedRequirements={state.generatedRequirements}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>

      <footer style={{
        backgroundColor: '#f8f9fa',
        padding: '20px 0',
        textAlign: 'center',
        borderTop: '1px solid #eee'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '14px'
          }}>&copy; 2024 システム要件定義書ジェネレーター</p>
        </div>
      </footer>

    </div>
  );
};

export default App;