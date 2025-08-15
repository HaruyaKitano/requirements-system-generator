import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  currentStep: string;
  steps: string[];
  isAnimated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  currentStep, 
  steps, 
  isAnimated = true 
}) => {
  return (
    <div style={{
      width: '100%',
      marginBottom: '32px'
    }}>
      {/* 進捗パーセンテージ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: '#1f2937'
        }}>処理進捗</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'white',
            fontWeight: 600
          }}>
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* 現在のステップ */}
      <p style={{
        margin: '0 0 16px 0',
        fontSize: '15px',
        color: '#6b7280',
        fontWeight: 500
      }}>
        {currentStep}
      </p>

      {/* プログレスバー */}
      <div style={{
        width: '100%',
        height: '12px',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '8px',
            transition: isAnimated ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* アニメーション効果 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-50%',
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            animation: isAnimated && progress < 100 ? 'shimmer 2s infinite' : 'none'
          }} />
        </div>
      </div>

      {/* ステップインジケーター */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        position: 'relative'
      }}>
        {steps.map((step, index) => {
          const stepProgress = (index + 1) * (100 / steps.length);
          const isCompleted = progress >= stepProgress;
          const isCurrent = currentStep.includes(step) || (index === Math.floor(progress / (100 / steps.length)));
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                position: 'relative'
              }}
            >
              {/* ステップ番号 */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isCompleted 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : isCurrent
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                color: isCompleted || isCurrent ? 'white' : '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '8px',
                transition: 'all 0.3s ease',
                boxShadow: isCompleted || isCurrent 
                  ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
                transform: isCurrent ? 'scale(1.1)' : 'scale(1)'
              }}>
                {isCompleted ? '✓' : index + 1}
              </div>

              {/* ステップ名 */}
              <span style={{
                fontSize: '13px',
                color: isCompleted || isCurrent ? '#374151' : '#9ca3af',
                fontWeight: isCompleted || isCurrent ? 600 : 500,
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: '80px'
              }}>
                {step}
              </span>

              {/* 接続線 */}
              {index < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '50%',
                  width: '100%',
                  height: '2px',
                  background: isCompleted 
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : 'linear-gradient(90deg, #e5e7eb, #d1d5db)',
                  zIndex: -1,
                  transition: 'background 0.3s ease'
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;