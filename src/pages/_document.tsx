import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <title>라포랩스 인턴 과제 전형</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="퀸잇 유저를 위한 모바일 사과 낙하 게임 과제" />
        <meta name="theme-color" content="#7B61FF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
