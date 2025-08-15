import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import IndividualResultDisplay from './components/IndividualResultDisplay';
import ProgressBar from './components/ProgressBar';
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
    progress: 0,
    currentProgressStep: '',
    progressSteps: ['アップロード', 'テキスト抽出', 'AI分析', '生成完了']
  });

  // 進捗更新関数
  const updateProgress = (progress: number, step: string) => {
    setState(prev => ({
      ...prev,
      progress,
      currentProgressStep: step
    }));
  };

  // 進捗をシミュレートする関数
  const simulateProgress = async (generationType: GenerationType) => {
    const steps = {
      comprehensive: [
        { progress: 15, step: 'ファイルをアップロード中...', delay: 500 },
        { progress: 35, step: 'テキストを抽出中...', delay: 1000 },
        { progress: 65, step: 'AI分析を実行中...', delay: 2000 },
        { progress: 85, step: 'システム要件定義書を生成中...', delay: 2500 },
        { progress: 100, step: '生成完了', delay: 500 }
      ],
      basic: [
        { progress: 20, step: 'ファイルをアップロード中...', delay: 500 },
        { progress: 40, step: 'テキストを抽出中...', delay: 800 },
        { progress: 70, step: 'AI分析を実行中...', delay: 1500 },
        { progress: 90, step: '基本要件定義書を生成中...', delay: 1000 },
        { progress: 100, step: '生成完了', delay: 500 }
      ],
      'functional-diagram': [
        { progress: 25, step: 'セッションからデータを取得中...', delay: 300 },
        { progress: 55, step: 'システム構成を分析中...', delay: 1000 },
        { progress: 85, step: '機能構成図を生成中...', delay: 1500 },
        { progress: 100, step: '生成完了', delay: 300 }
      ],
      'external-interfaces': [
        { progress: 25, step: 'セッションからデータを取得中...', delay: 300 },
        { progress: 50, step: 'インターフェースを分析中...', delay: 1000 },
        { progress: 80, step: '外部インターフェース要件を生成中...', delay: 1200 },
        { progress: 100, step: '生成完了', delay: 300 }
      ],
      'performance': [
        { progress: 25, step: 'セッションからデータを取得中...', delay: 300 },
        { progress: 55, step: 'パフォーマンス要素を分析中...', delay: 1000 },
        { progress: 85, step: '性能要件を生成中...', delay: 1000 },
        { progress: 100, step: '生成完了', delay: 300 }
      ],
      'security': [
        { progress: 25, step: 'セッションからデータを取得中...', delay: 300 },
        { progress: 50, step: 'セキュリティ要素を分析中...', delay: 1000 },
        { progress: 80, step: 'セキュリティ要件を生成中...', delay: 1200 },
        { progress: 100, step: '生成完了', delay: 300 }
      ]
    };

    const progressSteps = steps[generationType] || steps.comprehensive;

    for (const { progress, step, delay } of progressSteps) {
      updateProgress(progress, step);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  const handleFileSelect = async (file: File, generationType: GenerationType = 'comprehensive') => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      uploadedFile: file,
      generationType,
      currentStep: 'processing',
      progress: 0,
      currentProgressStep: '処理を開始しています...'
    }));

    try {
      // 進捗シミュレーションを並行実行
      const progressPromise = simulateProgress(generationType);
      if (generationType === 'comprehensive' || generationType === 'basic') {
        // 包括的・基本生成の場合
        let response: SystemRequirementsResponse;
        if (generationType === 'comprehensive') {
          response = await ApiService.generateComprehensive(file);
        } else {
          response = await ApiService.uploadAndGenerate(file);
        }
        
        // 進捗完了を待ってから結果表示
        await progressPromise;
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          extractedText: response.extracted_text,
          generatedRequirements: response.generated_requirements,
          sessionId: response.session_id,
          currentStep: 'result',
          progress: 100,
          currentProgressStep: '生成完了'
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
        
        // 進捗完了を待ってから結果表示
        await progressPromise;
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          sessionId: sessionId || prev.sessionId,
          individualResults: {
            ...prev.individualResults,
            [generationType.replace('-', '')]: result
          },
          currentStep: 'result',
          progress: 100,
          currentProgressStep: '生成完了'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
        currentStep: 'upload',
        progress: 0,
        currentProgressStep: ''
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
      progress: 0,
      currentProgressStep: '',
      progressSteps: ['アップロード', 'テキスト抽出', 'AI分析', '生成完了']
    });
  };

  const handleGenerateMore = (file: File) => {
    // セッションがある場合は新たな生成に移行
    setState(prev => ({
      ...prev,
      currentStep: 'upload',
      isLoading: false,
      error: null,
      progress: 0,
      currentProgressStep: '',
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
      progress: 0,
      currentProgressStep: '処理を開始しています...'
    }));

    try {
      // 進捗シミュレーションを並行実行
      const progressPromise = simulateProgress(generationType);
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
      
      // 進捗完了を待ってから結果表示
      await progressPromise;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        individualResults: {
          ...prev.individualResults,
          [generationType.replace('-', '')]: result
        },
        currentStep: 'result',
        progress: 100,
        currentProgressStep: '生成完了'
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '予期しないエラーが発生しました',
        currentStep: 'upload',
        progress: 0,
        currentProgressStep: ''
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
            margin: '0 auto',
            fontSize: '18px',
            opacity: 0.9,
            maxWidth: '600px',
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
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '24px',
                padding: '48px',
                textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                maxWidth: '600px',
                width: '100%',
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
                  position: 'relative',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      color: 'white',
                      position: 'relative',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                    }}>
                      🤖
                      <div style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '12px',
                        height: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%',
                        border: '2px solid white',
                        animation: 'pulse 2s infinite'
                      }}></div>
                    </div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#1f2937',
                      letterSpacing: '-0.025em'
                    }}>AI処理中</h2>
                  </div>
                  <p style={{
                    margin: '0 auto',
                    fontSize: '16px',
                    color: '#6b7280',
                    lineHeight: 1.6,
                    maxWidth: '400px'
                  }}>
                    高度なAI技術により、アップロードされた文書から包括的なシステム要件定義書を生成しています
                  </p>
                </div>

                {/* ProgressBar を統合 */}
                <ProgressBar
                  progress={state.progress}
                  currentStep={state.currentProgressStep}
                  steps={state.progressSteps}
                  isAnimated={true}
                />
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