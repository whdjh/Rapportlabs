# Falling Apple Game

라포랩스 프론트엔드 엔지니어 인턴 과제 - 모바일 사과 낙하 게임

## 게임 소개

사과를 터치하여 낙하시키고, 도착선에 최대한 가깝게 떨어뜨리는 게임

## 게임 규칙
- **성공**: 도착선에서 0~400m 이내에 멈춤
- **실패**: 400m 초과하거나 도착선을 지나침
- **조작**: 터치하면 사과가 떨어지고, 터치를 놓으면 멈춤

## 시작하기

```bash
git clone git@github.com:whdjh/Rapportlabs.git

npm install

npm run dev
```

## 좌표 위치 계산

### 1. 전체 게임 영역
- **BG_HEIGHT** → 게임 전체 세로 길이(배경 이미지, 도착선, 사과 모두 이 영역 안에서 배치)
- **CONTAINER_WIDTH** → 모바일 기준 최대 너비

### 2. 도착선
- **FINISH_LINE_HEIGHT** → 도착선의 두께
- **FINISH_LINE_MB** → 도착선의 바텀 마진 값
- Y좌표 = BG_HEIGHT - FINISH_LINE_HEIGHT - METRIC.FINISH_LINE_MB

### 3. 사과
- **APPLE_SIZE**: 50 → 요구사항 준수
- X좌표 = (Math.min(innerWidth || METRIC.CONTAINER_WIDTH, METRIC.CONTAINER_WIDTH) - METRIC.APPLE_SIZE) / 2 -> 중앙정렬
- Y좌표 = finishLineY - METRIC.APPLE_START_DISTANCE - METRIC.APPLE_SIZE

## Spring 애니메이션 시스템

### 애니메이션 구조
```typescript
// tension: 220 -> 스프링의 강도 (높을수록 빠르게 목표값 도달)
// friction: 28 -> 마찰력 (높을수록 빨리 멈춤, 오버슈트 방지)
// 사과 Y좌표 spring
const [appleYSpring, apiAppleY] = useSpring(() => ({ 
  y: appleY, 
  config: { tension: 220, friction: 28 } 
}))

// 카메라 이동 spring  
const [cameraYSpring, apiCameraY] = useSpring(() => ({ 
  y: cameraY, 
  config: { tension: 220, friction: 28 } 
}))
```

### 애니메이션 동작 원리
1. `distance` 값이 변경됨
2. `appleY`, `cameraY` 계산됨
3. `useEffect`가 감지하여 spring 값 업데이트
4. `@react-spring/web`이 부드러운 애니메이션 적용

## 카메라 시스템
```typescript
// 카메라: 사과가 항상 화면 중앙에 오도록 월드 전체를 이동
const appleScreenY = 200  // 사과가 보여질 화면 Y좌표
const cameraY = Math.max(appleScreenY - appleY, maxCameraY)
```

## 개발 과정에서의 고민들

### 1. 카메라 시스템 설계 고민
**문제**: 사과가 화면 밖으로 나가는 문제
**해결**: 카메라가 사과를 따라가는 시스템 구현
**결과**: 더 자연스러운 시각적 효과

### 2. 성능 최적화 고민
**문제**: 60fps 유지가 어려움
**해결**: `requestAnimationFrame` + spring 애니메이션 조합
**결과**: 부드러운 게임 경험

### 3. 애니메이션 라이브러리 선택 고민
**고민했던 대안들**:
- `framer-motion`: 기능이 많지만 무거움
- `react-spring`: 가볍고 성능 좋음
- CSS 애니메이션: 제어가 어려움

**최종 선택 이유**:
- 가벼운 번들 크기
- 부드러운 spring 물리 효과

### 4. 좌표계 설계 고민
**문제**: 복잡한 좌표 계산
**해결**: 월드 좌표계와 화면 좌표계 분리
**결과**: 계산 단순화 및 유지보수성 향상

### 5. 모바일 최적화 고민
**문제**: 모바일에서 성능 이슈
**해결**: 다양한 최적화 적용
- 터치/마우스 이벤트 크로스 플랫폼 지원
- 480px 모바일 컨테이너

### 6. 상태 관리 고민
**문제**: 복잡한 게임 상태 관리
**해결**: 4가지 상태로 분리
```typescript
type GameState = 'ready' | 'playing' | 'success' | 'fail'
const [gameState, setGameState] = useState<GameState>('ready')
const [isFalling, setIsFalling] = useState<boolean>(false)
```