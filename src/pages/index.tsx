import { useState, useRef, useCallback, useEffect } from 'react'
import { MobileContainer } from '@/components/MobileLayoutContainer'
import { useInnerSize } from '@/utils/useInnerSize'

const METRIC = {
  BG_HEIGHT: 5000,
  APPLE_SIZE: 50,
  CONTAINER_WIDTH: 480,
  FINISH_LINE_HEIGHT: 30,
  FINISH_LINE_MB: 640,
  APPLE_START_DISTANCE: 4000,
}

export default function Home() {
  const { innerHeight } = useInnerSize()
  const [isReady, setIsReady] = useState(true)
  const [isFalling, setIsFalling] = useState(false)
  const [distance, setDistance] = useState(METRIC.APPLE_START_DISTANCE)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  // 도착선 위치 및 사과 월드 내 위치
  const finishLineY = METRIC.BG_HEIGHT - METRIC.FINISH_LINE_HEIGHT - METRIC.FINISH_LINE_MB
  const appleX = (METRIC.CONTAINER_WIDTH - METRIC.APPLE_SIZE) / 2
  // 사과의 월드 내 위치: 도착선에서 distance만큼 위
  const appleY = finishLineY - distance - METRIC.APPLE_SIZE

  // 카메라: 사과가 항상 화면 중앙(appleScreenY)에 오도록 월드 전체를 이동
  const appleScreenY = 200
  const viewportHeight = innerHeight || 600
  const maxCameraY = viewportHeight - METRIC.BG_HEIGHT
  const cameraY = Math.max(appleScreenY - appleY, maxCameraY)

  // 낙하 속도(px/ms)
  const FALL_SPEED = 2.0 // 1ms에 2px = 2000px/s

  // 낙하 애니메이션 루프
  const gameLoop = useCallback((now: number) => {
    if (!isFalling) return
    if (lastTimeRef.current === null) lastTimeRef.current = now
    const delta = now - lastTimeRef.current
    lastTimeRef.current = now
    setDistance(prev => {
      const next = prev - delta * FALL_SPEED
      return Math.max(-200, next)
    })
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [isFalling])

  // 낙하 시작/정지 관리
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

  // 터치/마우스 이벤트 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!isFalling) setIsFalling(true)
  }, [isFalling])
  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (isFalling) setIsFalling(false)
  }, [isFalling])

  // 준비 상태에서 게임 시작
  const handleStart = () => {
    setIsReady(false)
    setDistance(METRIC.APPLE_START_DISTANCE)
    setIsFalling(false)
  }

  // UI 버튼/안내 위치(사과 기준)
  const buttonY = appleScreenY + METRIC.APPLE_SIZE + 150

  return (
    <MobileContainer>
      <div
        style={{
          position: 'relative',
          width: METRIC.CONTAINER_WIDTH,
          height: innerHeight || 600,
          margin: '0 auto',
          overflow: 'hidden',
          background: '#e2e2e8',
        }}
        onTouchStart={!isReady && !isFalling ? handleTouchStart : undefined}
        onTouchEnd={!isReady ? handleTouchEnd : undefined}
        onMouseDown={!isReady && !isFalling ? handleTouchStart : undefined}
        onMouseUp={!isReady ? handleTouchEnd : undefined}
      >
        {/* 월드 컨테이너: 배경, 사과, 도착선 등 모두 포함 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: METRIC.CONTAINER_WIDTH,
            height: METRIC.BG_HEIGHT,
            transform: `translateY(${cameraY}px)`,
            willChange: 'transform',
            zIndex: 1,
          }}
        >
          {/* 배경 */}
          <img
            src="/background.png"
            alt="배경"
            width={METRIC.CONTAINER_WIDTH}
            height={METRIC.BG_HEIGHT}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              userSelect: 'none',
              pointerEvents: 'none',
              display: 'block',
            }}
            draggable={false}
          />
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
          {/* 사과 */}
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
        </div>
        {/* UI: 게임 시작 버튼, 안내 UI는 월드 밖에 고정 */}
        {isReady && (
          <button
            style={{
              position: 'absolute',
              left: '50%',
              top: buttonY,
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
        {!isReady && !isFalling && (
          <img
            src="/click-please.png"
            alt="꾹 눌러주세요~"
            draggable={false}
            style={{
              position: 'absolute',
              right: 24,
              top: buttonY,
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
