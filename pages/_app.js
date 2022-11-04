import React from "react"
import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "@web3uikit/core"

function MyApp({ Component, pageProps }) {
  return (
    //moralisProvider提供webapp与区块链交互的方法 initializeOnMount此参数必须设置 表示是否连接到中心化服务器后端接口
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}

export default MyApp
