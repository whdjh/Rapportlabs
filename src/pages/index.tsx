import { useState, useRef, useCallback, useEffect } from 'react'
import { MobileContainer } from '@/components/MobileLayoutContainer'

const METRIC = {
  BG_HEIGHT: 5000,
  APPLE_SIZE: 50,
  CONTAINER_WIDTH: 480,
  FINISH_LINE_HEIGHT: 30,
  FINISH_LINE_MB: 640,
  APPLE_START_DISTANCE: 4000,
}

export default function Home() {
  const [isReady, setIsReady] = useState(true)
  const [isFalling, setIsFalling] = useState(false)
  const [distance, setDistance] = useState(METRIC.APPLE_START_DISTANCE)

  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const appleX = (METRIC.CONTAINER_WIDTH - METRIC.APPLE_SIZE) / 2
  const finishLineY = METRIC.BG_HEIGHT - METRIC.FINISH_LINE_HEIGHT - METRIC.FINISH_LINE_MB
  const appleY = finishLineY - distance - METRIC.APPLE_SIZE
  const FALL_SPEED = 2.0 

  const gameLoop = useCallback((now: number) => {
    if (!isFalling) return
    if (lastTimeRef.current === null) lastTimeRef.current = now

    const delta = now - lastTimeRef.current

    lastTimeRef.current = now
    
    setDistance(prev => {
      const next = Math.max(0, prev - delta * FALL_SPEED)
      return next
    })
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [isFalling])

  useEffect(() => {
    if (isFalling) {
      animationRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      lastTimeRef.current = null
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isFalling, gameLoop])

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!isFalling) setIsFalling(true)
  }, [isFalling])
  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (isFalling) setIsFalling(false)
  }, [isFalling])

  const handleStart = () => {
    setIsReady(false)
    setDistance(METRIC.APPLE_START_DISTANCE)
    setIsFalling(false)
  }

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
        // 안내 UI가 보일 때만 터치 이벤트 활성화
        onTouchStart={!isReady && !isFalling ? handleTouchStart : undefined}
        onTouchEnd={!isReady ? handleTouchEnd : undefined}
        onMouseDown={!isReady && !isFalling ? handleTouchStart : undefined}
        onMouseUp={!isReady ? handleTouchEnd : undefined}
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
            {Math.round(distance)}m
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
        {isReady && (
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
            onClick={handleStart}
          >
            게임 시작
          </button>
        )}
        {/* 꾹 눌러주세요~ 안내 UI */}
        {!isReady && !isFalling && (
          <img
            src="/click-please.png"
            alt="꾹 눌러주세요~"
            draggable={false}
            style={{
              position: 'absolute',
              right: 24,
              top: appleY + METRIC.APPLE_SIZE + 150,
              width: 160,
              zIndex: 20,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </MobileContainer>
  )
}
