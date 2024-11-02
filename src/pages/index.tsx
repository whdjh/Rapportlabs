const METRIC = {
    BG_HEIGHT: 5000,
    APPLE_HEIGHT: 50,
}

export default function Home() {
    return (
        <>
            <div
                style={{position: 'relative', width: '100%', height: METRIC.BG_HEIGHT}}
            >
                <img
                    src={'/background.png'}
                    width={'100%'}
                    height={METRIC.BG_HEIGHT}
                    draggable={false}
                />
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: 30,
                        backgroundColor: '#EC083F',
                        // FIXME: top 값을 적절히 조절하여 도착선과 사과의 시작점 사이의 거리가 4000px 차이나게 해주세요
                        // 현재는 도착선을 임의로 최하단에 붙여놨습니다
                        top: 5000,
                    }}
                />
            </div>
        </>
    );
}
