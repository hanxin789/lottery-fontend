import { ConnectButton } from "@web3uikit/web3"
import React from "react"

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row">
      <h1 className="py-4 px-4 font-blog text-2xl">Token 抽奖</h1>
      <h6 className="py-1 px-1 font-blog text-blog ml-auto">
        将会在每个小时开奖一次 合约没有在主网部署
      </h6>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false}></ConnectButton>
      </div>
    </div>
  )
}
