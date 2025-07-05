import React from 'react'
import { MobileContainer } from '@/components/MobileLayoutContainer'

const METRIC = {
  BG_HEIGHT: 5000,
  APPLE_SIZE: 50,
  CONTAINER_WIDTH: 480,
  FINISH_LINE_HEIGHT: 30,
  FINISH_LINE_MB: 640,
  APPLE_START_DISTANCE: 4000, // m
}

export default function Home() {
  const appleX = (METRIC.CONTAINER_WIDTH - METRIC.APPLE_SIZE) / 2
  const finishLineY = METRIC.BG_HEIGHT - METRIC.FINISH_LINE_HEIGHT - METRIC.FINISH_LINE_MB
  const appleY = finishLineY - METRIC.APPLE_START_DISTANCE - METRIC.APPLE_SIZE

  return (
    <MobileContainer>
      <div
        style={{
          position: 'relative',
          width: METRIC.CONTAINER_WIDTH,
          height: METRIC.BG_HEIGHT,
          margin: '0 auto',
          background: `url('/background.png') no-repeat center top / cover`,
          overflow: 'hidden',
        }}
      >
        {/* 도착선 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: finishLineY,
            width: METRIC.CONTAINER_WIDTH,
            height: METRIC.FINISH_LINE_HEIGHT,
            backgroundColor: '#EC083F',
            zIndex: 2,
          }}
        />
        {/* 사과와 거리 */}
        <div
          style={{
            position: 'absolute',
            left: appleX,
            top: appleY,
            width: METRIC.APPLE_SIZE,
            height: METRIC.APPLE_SIZE,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3,
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 32,
              color: '#000',
              marginBottom: 2,
              textShadow: '0 1px 2px #fff8',
            }}
          >
            4000m
          </span>
          <img
            src={'/apple.png'}
            width={METRIC.APPLE_SIZE}
            height={METRIC.APPLE_SIZE}
            draggable={false}
            alt="사과"
            style={{ display: 'block' }}
          />
        </div>
        {/* 게임 시작 버튼 */}
        <button
          style={{
            position: 'absolute',
            left: '50%',
            top: appleY + METRIC.APPLE_SIZE + 150,
            transform: 'translateX(-50%)',
            width: 180,
            height: 48,
            borderRadius: 24,
            border: '3px solid #fff',
            background: '#7B61FF',
            color: '#fff',
            fontSize: 22,
            fontWeight: 500,
            boxShadow: '0 2px 8px #0002',
            cursor: 'pointer',
            zIndex: 10,
            userSelect: 'none',
          }}
        >
          게임 시작
        </button>
      </div>
    </MobileContainer>
  )
}
