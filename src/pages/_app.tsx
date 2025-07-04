import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MobileContainer } from '@/components/MobileLayoutContainer'

export default function App({Component, pageProps}: AppProps) {
  return <MobileContainer><Component {...pageProps} /></MobileContainer>
}
