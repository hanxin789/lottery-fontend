//有一点需要注意在frontendJs或者react、vue 就是export的func或者变量导入可以使用{}或者不使用,但是module的导入一定不能使用{}
import { useEffect } from "react"
import { useMoralis } from "react-moralis"
import React from "react"

export default function ManualHeader() {
  // useMoralis()方法连接了moralis hook库  hook类似于spring中的context全局变量,在react中可以在js脚本返回数据变化后重新渲染页面
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis()
  //useEffect方法是react的核心hook,监听[]中的变量或函数是否触发,触发即重新渲染页面
  //只要链接到了钱包isWeb3Enabled的值就为true
  //逻辑：如果只是做了一个连接按钮(使用函数enableWeb3)的话那么在刷新页面的时候页面还是会按照连接之前的逻辑渲染页面
  //所以需要将连接状态存储到浏览器localstore中,监听到连接状态就重新渲染页面
  //但是这样子做了之后呢,一旦断开钱包连接.连接界面就会一直弹出让你连接,就是因为你断开与钱包的连接之后没有将isWeb3Enable的值设置为false
  //所以需要监听连接是否断开并将isWeb3Enable的值设置为false
  useEffect(() => {
    if (isWeb3Enabled) return
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("connected")
    ) {
      enableWeb3()
    }
  }, [enableWeb3, isWeb3Enabled])
  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("account change to", account)
      if (account === null) {
        window.localStorage.removeItem("connected")
        deactivateWeb3() //设置isWeb3Enable为false
      }
    })
  }, [Moralis, Moralis.onAccountChanged, deactivateWeb3])
  return (
    <div>
      {account ? (
        <div>
          Connected To {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            enableWeb3()
            //localstore记录已经连接钱包
            if (typeof window !== "undefined")
              window.localStorage.setItem("connected", "injectWallet")
          }}
          disabled={isWeb3EnableLoading} //连接钱包过程中不允许按钮再被调用
        >
          ConnectToWallet
        </button>
      )}
    </div>
  )
}
