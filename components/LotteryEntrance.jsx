/* eslint-disable react-hooks/exhaustive-deps */
// @ts-ignore
import React, { useCallback, useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAbi, contractaddress } from "../constant/index"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"
import { Bell } from "@web3uikit/icons"

export default function LotteryEntrance() {
  // @ts-ignore
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //钱包中的chainId数据
  let address
  //state hook [需要更新的变量，更新变量的方法] = useState(变量初始值)
  const [entranceFee, setEntrance] = useState("0")
  const [NumPlyer, setNumPlyer] = useState("0")
  const [recentWinner, setReccentWinner] = useState("0")

  const dispath = useNotification()

  if (chainIdHex !== null) {
    const chainId = parseInt(chainIdHex)
    address =
      chainId.toString() in contractaddress
        ? contractaddress[chainId.toString()][0]
        : null
  }

  const {
    runContractFunction: enter,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: address,
    functionName: "enter",
    params: {},
    msgValue: entranceFee,
  })
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: address,
    functionName: "getEntranceFee",
    params: {},
  })
  const { runContractFunction: getPlayerNumber } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: address,
    functionName: "getPlayerNumber",
    params: {},
  })
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: address,
    functionName: "getRecentWinner",
    params: {},
  })

  // @ts-ignore
  async function updateUI() {
    // @ts-ignore
    const fee = (await getEntranceFee()).toString()
    if (fee !== undefined) {
      setEntrance(fee)
    }
    // @ts-ignore
    const Num = (await getPlayerNumber()).toString()
    if (Num !== undefined) {
      setNumPlyer(Num)
    }
    // @ts-ignore
    const winner = (await getRecentWinner()).toString()
    if (winner !== undefined) {
      setReccentWinner(winner)
    }
  }
  //只要调用了只要链接到了钱包isWeb3Enabled的值就为true //保证数据刷新
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled, updateUI])

  //处理交易成功通知方法,等待区块1 使用web3uikit的useNotification方法设置弹出消息
  const handlesuccess = async (tx) => {
    await tx.wait(1)
    handleNotification() //弹出通知
    updateUI() //刷新页面元素
  }
  const handleNotification = () => {
    dispath({
      type: "info",
      message: "Transaction complete",
      title: "Tx Notification",
      position: "topR",
      icon: <Bell />,
    })
  }
  return (
    <div className="p-5">
      {address === null ? (
        <div>Contract not exist </div>
      ) : (
        <div>
          立即支付费用参与抽奖：
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white  font-bold py-2 -x-6  rounded ml-auto"
            onClick={async () => {
              await enter({ onSuccess: handlesuccess })
            }}
            disabled={isLoading || isFetching}
          >
            {isWeb3Enabled ? (
              isLoading || isFetching ? (
                <div className="animate-spin spinner-border h-8 w-8 broder-b-2 rounded-full"></div>
              ) : (
                <div>立即支付</div>
              )
            ) : (
              <div>请连接钱包</div>
            )}
          </button>
          <div>
            最低参与抽奖费用 ： {ethers.utils.formatUnits(entranceFee, "ether")}{" "}
            ETH
          </div>
          <div> 已参与玩家： {NumPlyer}</div>
          <div>
            {" "}
            最近赢家：
            {recentWinner === "0x0000000000000000000000000000000000000000" ? (
              <text>还没有赢家</text>
            ) : (
              recentWinner
            )}
          </div>
        </div>
      )}
    </div>
  )
}
