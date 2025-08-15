import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import IndividualResultDisplay from './components/IndividualResultDisplay';
import { AppState, GenerationType } from './types';
import { ApiService, downloadAsFile } from './services/api';
import { SystemRequirementsResponse } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    error: null,
    uploadedFile: null,
    extractedText: null,
    generatedRequirements: null,
    sessionId: null,
    currentStep: 'upload',
    generationType: null,
    individualResults: {},
  });

  const handleFileSelect = async (file: File, generationType: GenerationType = 'comprehensive') => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      uploadedFile: file,
      generationType,
      currentStep: 'processing',
    }));

    try {
      if (generationType === 'comprehensive' || generationType === 'basic') {
        // 包括的・基本生成の場合
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
          sessionId: response.session_id,
          currentStep: 'result',
        }));
      } else {
        // 個別生成の場合
        let result: string = '';
        let sessionId: string = '';
        
        // セッションIDがある場合はセッションベースの生成を使用
        if (state.sessionId) {
          switch (generationType) {
            case 'functional-diagram':
              const diagResponse = await ApiService.generateFunctionalDiagramFromSession(state.sessionId);
              result = diagResponse.functional_diagram;
              break;
            case 'external-interfaces':
              const extResponse = await ApiService.generateExternalInterfacesFromSession(state.sessionId);
              result = extResponse.external_interfaces;
              break;
            case 'performance':
              const perfResponse = await ApiService.generatePerformanceRequirementsFromSession(state.sessionId);
              result = perfResponse.performance_requirements;
              break;
            case 'security':
              const secResponse = await ApiService.generateSecurityRequirementsFromSession(state.sessionId);
              result = secResponse.security_requirements;
              break;
          }
          sessionId = state.sessionId;
        } else {
          // 新しいファイルアップロードの場合
          switch (generationType) {
            case 'functional-diagram':
              const diagResponse = await ApiService.generateFunctionalDiagram(file);
              result = diagResponse.functional_diagram;
              break;
            case 'external-interfaces':
              const extResponse = await ApiService.generateExternalInterfaces(file);
              result = extResponse.external_interfaces;
              break;
            case 'performance':
              const perfResponse = await ApiService.generatePerformanceRequirements(file);
              result = perfResponse.performance_requirements;
              break;
            case 'security':
              const secResponse = await ApiService.generateSecurityRequirements(file);
              result = secResponse.security_requirements;
              break;
          }
        }
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          sessionId: sessionId || prev.sessionId,
          individualResults: {
            ...prev.individualResults,
            [generationType.replace('-', '')]: result
          },
          currentStep: 'result',
        }));
      }
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
    // セッションがある場合は削除
    if (state.sessionId) {
      ApiService.deleteSession(state.sessionId).catch(console.error);
    }
    
    setState({
      isLoading: false,
      error: null,
      uploadedFile: null,
      extractedText: null,
      generatedRequirements: null,
      sessionId: null,
      currentStep: 'upload',
      generationType: null,
      individualResults: {},
    });
  };

  const handleGenerateMore = (file: File) => {
    // セッションがある場合は新たな生成に移行
    setState(prev => ({
      ...prev,
      currentStep: 'upload',
      isLoading: false,
      error: null,
      // セッションIDは保持して再利用可能にする
    }));
  };

  const handleGenerateNext = async (generationType: GenerationType) => {
    if (!state.sessionId) return;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      currentStep: 'processing',
      generationType,
    }));

    try {
      let result: string = '';
      
      switch (generationType) {
        case 'functional-diagram':
          const diagResponse = await ApiService.generateFunctionalDiagramFromSession(state.sessionId);
          result = diagResponse.functional_diagram;
          break;
        case 'external-interfaces':
          const extResponse = await ApiService.generateExternalInterfacesFromSession(state.sessionId);
          result = extResponse.external_interfaces;
          break;
        case 'performance':
          const perfResponse = await ApiService.generatePerformanceRequirementsFromSession(state.sessionId);
          result = perfResponse.performance_requirements;
          break;
        case 'security':
          const secResponse = await ApiService.generateSecurityRequirementsFromSession(state.sessionId);
          result = secResponse.security_requirements;
          break;
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        individualResults: {
          ...prev.individualResults,
          [generationType.replace('-', '')]: result
        },
        currentStep: 'result',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
        currentStep: 'result',
      }));
    }
  };

  const getIndividualResult = (generationType: GenerationType, results: any): string => {
    switch (generationType) {
      case 'functional-diagram':
        return results.functionaldiagram || '';
      case 'external-interfaces':
        return results.externalinterfaces || '';
      case 'performance':
        return results.performance || '';
      case 'security':
        return results.security || '';
      default:
        return '';
    }
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
                sessionId={state.sessionId}
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

          {state.currentStep === 'result' && state.uploadedFile && (
            <div className="result-section">
              {(state.generationType === 'comprehensive' || state.generationType === 'basic') && 
               state.extractedText && state.generatedRequirements ? (
                <ResultDisplay
                  filename={state.uploadedFile.name}
                  extractedText={state.extractedText}
                  generatedRequirements={state.generatedRequirements}
                  onDownload={handleDownload}
                  onReset={handleReset}
                />
              ) : state.generationType && (
                <IndividualResultDisplay
                  filename={state.uploadedFile.name}
                  generationType={state.generationType}
                  result={getIndividualResult(state.generationType, state.individualResults)}
                  onReset={handleReset}
                  onGenerateMore={handleGenerateMore}
                  onGenerateNext={handleGenerateNext}
                  uploadedFile={state.uploadedFile}
                  sessionId={state.sessionId}
                />
              )}
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