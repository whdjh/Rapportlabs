import React from 'react'

interface GameModalProps {
  open: boolean
  type: 'success' | 'fail'
  distance?: number
  onRetry: () => void
}

export const GameModal: React.FC<GameModalProps> = ({ open, type, distance, onRetry }) => {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 28,
          minWidth: 280,
          maxWidth: 320,
          padding: '32px 24px 24px 24px',
          boxShadow: '0 4px 32px #0002',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: '#222' }}>
          {type === 'success' ? '성공했습니다' : '실패했습니다!'}
        </div>
        {type === 'success' && (
          <div style={{ fontSize: 18, marginBottom: 16, color: '#333' }}>
            기록: {distance ?? 0}m
          </div>
        )}
        {type === 'fail' && (
          <div style={{ fontSize: 15, marginBottom: 16, color: '#666', textAlign: 'center' }}>
            도착선과의 거리가 400m 이내여야 합니다.
          </div>
        )}
        <button
          style={{
            marginTop: 8,
            width: 160,
            height: 44,
            borderRadius: 22,
            border: 'none',
            background: '#7B61FF',
            color: '#fff',
            fontSize: 18,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0001',
          }}
          onClick={onRetry}
        >
          재시도
        </button>
      </div>
    </div>
  )
} 