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
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '48px 0',
        textAlign: 'center',
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
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              backdropFilter: 'blur(10px)'
            }}>🤖</div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>システム要件定義書ジェネレーター</h1>
          </div>
          <p style={{
            margin: 0,
            fontSize: '18px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontWeight: 400
          }}>AI駆動の自動生成で、要件定義書から包括的なシステム要件定義書を瞬時に作成</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '24px',
            fontSize: '14px',
            opacity: 0.8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔗</span>
              <span>機能構成図</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔌</span>
              <span>外部IF要件</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span>
              <span>性能要件</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔒</span>
              <span>セキュリティ要件</span>
            </div>
          </div>
        </div>
      </header>

      <main style={{
        flex: 1,
        padding: '48px 0',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          {state.error && (
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '1px solid #f87171',
              color: '#dc2626',
              padding: '20px 24px',
              borderRadius: '16px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#dc2626',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: 'white',
                flexShrink: 0
              }}>⚠️</div>
              <span style={{ 
                fontSize: '15px', 
                fontWeight: 500,
                flex: 1,
                lineHeight: 1.5
              }}>{state.error}</span>
              <button 
                onClick={() => setState(prev => ({ ...prev, error: null }))}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  borderRadius: '8px',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '8px 12px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                閉じる
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
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '48px',
                textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                maxWidth: '500px',
                width: '100%'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
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
                    fontSize: '24px'
                  }}>🤖</div>
                </div>
                <h2 style={{
                  margin: '0 0 16px 0',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1f2937',
                  letterSpacing: '-0.025em'
                }}>AI処理中</h2>
                <p style={{
                  margin: '0 0 32px 0',
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: 1.6
                }}>ファイルを解析して包括的なシステム要件定義書を生成しています</p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  textAlign: 'left'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <span style={{ fontSize: '16px', color: '#16a34a' }}>✓</span>
                    <span style={{ fontSize: '14px', color: '#166534', fontWeight: 500 }}>ファイルアップロード完了</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '12px',
                    border: '1px solid #fde68a'
                  }}>
                    <span style={{ fontSize: '16px' }}>⏳</span>
                    <span style={{ fontSize: '14px', color: '#92400e', fontWeight: 500 }}>テキスト抽出・AI分析中...</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <span style={{ fontSize: '16px', opacity: 0.5 }}>🤖</span>
                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>システム要件定義書生成中...</span>
                  </div>
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
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '40px 0',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>🤖</div>
            <span style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 600
            }}>システム要件定義書ジェネレーター</span>
          </div>
          <p style={{
            margin: 0,
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: 400
          }}>&copy; 2024 All rights reserved. Powered by AI technology.</p>
        </div>
      </footer>

    </div>
  );
};

export default App;