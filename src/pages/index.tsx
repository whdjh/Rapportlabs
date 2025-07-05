import { useState, useRef, useCallback, useEffect } from 'react'
import { MobileContainer } from '@/components/MobileLayoutContainer'
import { useInnerSize } from '@/utils/useInnerSize'
import { GameModal } from '@/components/GameModal'
import { useSpring, animated } from '@react-spring/web'

const METRIC = {
  BG_HEIGHT: 5000,
  APPLE_SIZE: 50,
  CONTAINER_WIDTH: 480,
  FINISH_LINE_HEIGHT: 30,
  FINISH_LINE_MB: 640,
  APPLE_START_DISTANCE: 4000,
}

type GameState = 'ready' | 'playing' | 'success' | 'fail'

export default function Home() {
  const { innerHeight } = useInnerSize()
  const [gameState, setGameState] = useState<GameState>('ready')
  const [isFalling, setIsFalling] = useState<boolean>(false)
  const [distance, setDistance] = useState<number>(METRIC.APPLE_START_DISTANCE)
  const [showModal, setShowModal] = useState<boolean>(false)
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

  // 사과가 내려갈 수 있는 최소 거리
  const minDistance = -METRIC.FINISH_LINE_MB

  // react-spring: 사과 Y좌표 spring
  const [appleYSpring, apiAppleY] = useSpring(() => ({ y: appleY, config: { tension: 220, friction: 28 } }))
  // react-spring: 카메라 이동 spring
  const [cameraYSpring, apiCameraY] = useSpring(() => ({ y: cameraY, config: { tension: 220, friction: 28 } }))

  // spring 값 업데이트
  useEffect(() => {
    apiAppleY.start({ y: appleY })
    apiCameraY.start({ y: cameraY })
  }, [appleY, cameraY, apiAppleY, apiCameraY])

  // 낙하 속도(px/ms)
  const FALL_SPEED = 2.0 // 1ms에 2px = 2000px/s

  // 성공/실패 판정 함수
  const checkResult = useCallback((finalDistance: number) => {
    if (finalDistance <= minDistance) {
      setGameState('fail')
      setTimeout(() => setShowModal(true), 500)
      return
    }
    if (finalDistance >= 0 && finalDistance <= 400) {
      setGameState('success')
      setTimeout(() => setShowModal(true), 500)
      return
    }
    setGameState('fail')
    setTimeout(() => setShowModal(true), 500)
  }, [minDistance])

  // 낙하 애니메이션 루프
  const gameLoop = useCallback((now: number) => {
    if (!isFalling) return
    if (lastTimeRef.current === null) lastTimeRef.current = now
    const delta = now - lastTimeRef.current
    lastTimeRef.current = now
    setDistance(prev => {
      const next = prev - delta * FALL_SPEED
      if (next <= minDistance) {
        setIsFalling(false)
        checkResult(next)
        return minDistance
      }
      return next
    })
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [isFalling, minDistance, checkResult])

  // 낙하 시작/정지 관리
  useEffect(() => {
    if (isFalling) {
      setGameState('playing')
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
    if (!isFalling && gameState === 'playing') setIsFalling(true)
  }, [isFalling, gameState])
  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (isFalling) {
      setIsFalling(false)
      // 성공/실패 판정
      checkResult(distance)
    }
  }, [isFalling, distance, checkResult])

  // 게임 시작
  const handleStart = () => {
    setGameState('playing')
    setDistance(METRIC.APPLE_START_DISTANCE)
    setIsFalling(false)
    setShowModal(false)
  }

  // 재시도(초기화)
  const handleRetry = () => {
    setGameState('ready')
    setDistance(METRIC.APPLE_START_DISTANCE)
    setIsFalling(false)
    setShowModal(false)
  }

  // UI 버튼/안내 위치(사과 기준)
  const buttonY = appleScreenY + METRIC.APPLE_SIZE + 150

  return (
    <MobileContainer>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          maxWidth: 480,
          height: innerHeight || 600,
          margin: '0 auto',
          overflow: 'hidden',
          background: '#e2e2e8',
        }}
        onTouchStart={!isFalling && gameState === 'playing' ? handleTouchStart : undefined}
        onTouchEnd={isFalling ? handleTouchEnd : undefined}
        onMouseDown={!isFalling && gameState === 'playing' ? handleTouchStart : undefined}
        onMouseUp={isFalling ? handleTouchEnd : undefined}
      >
        {/* 월드 컨테이너: 배경, 사과, 도착선 등 모두 포함 */}
        <animated.div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100vw',
            maxWidth: 480,
            height: METRIC.BG_HEIGHT,
            transform: cameraYSpring.y.to(y => `translateY(${y}px)`),
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
              width: '100vw',
              maxWidth: 480,
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
              width: '100vw',
              maxWidth: 480,
              height: METRIC.FINISH_LINE_HEIGHT,
              backgroundColor: '#EC083F',
              zIndex: 2,
            }}
          />
          {/* 사과 */}
          <animated.div
            style={{
              position: 'absolute',
              left: appleX,
              top: appleYSpring.y,
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
          </animated.div>
        </animated.div>
        {/* UI: 게임 시작 버튼, 안내 UI는 월드 밖에 고정 */}
        {gameState === 'ready' && (
          <button
            style={{
              position: 'absolute',
              left: '50%',
              top: buttonY,
              transform: 'translateX(-50%)',
              width: 180,
              height: 48,
              borderRadius: 24,
              border: '3px solid #7B61FF',
              background: '#fff',
              color: '#7B61FF',
              fontSize: 22,
              fontWeight: 700,
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
        {gameState === 'playing' && !isFalling && (
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
        {/* 성공/실패 모달 */}
        <GameModal
          open={showModal}
          type={gameState === 'success' ? 'success' : 'fail'}
          distance={Math.abs(Math.round(distance))}
          onRetry={handleRetry}
        />
      </div>
    </MobileContainer>
  )
}
