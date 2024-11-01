const METRIC = {
    BG_HEIGHT: 5000
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
                />
            </div>
        </>
    );
}
