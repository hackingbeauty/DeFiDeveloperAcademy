import constants from 'core/types'
import { takeEvery, select, put, call } from 'redux-saga/effects'
import { parseUnits, Contract, toUtf8Bytes } from 'ethers'
import { getContractAddressFromChainId } from 'core/libs/lib-rpc-helpers'
import RouterABI from "../../../../artifacts/contracts/periphery/Router.sol/Router.json"
import { currencies } from "configs/config-main"

export function* addLiquidity(action) {
    const { metaMaskAccount } = yield select(state => state.provider)
    const { currency0, currency1 } = yield select(state => state.transaction)
    const { 
      currency0isETH,
      tickLower,
      tickUpper,
      liquidity,
      amount0Max,
      amount1Max,
      ethToSend,
      hookData,
      showLoader
    } = action

    if(window.ethereum) {
      // If user is logged into MetaMask, execute tx (transaction).
      // Otherwise, prompt user to install MetaMask
      if(metaMaskAccount){ 
        if(metaMaskAccount.length) {
          const { signer, chainId } =  yield select(state => state.provider)
          console.log('---- signer ----', signer)
          const contractAddress = getContractAddressFromChainId(chainId)
          // Connected to a Signer; can make state changing,
          // transactions which will cost the account ether.


          const contract = new Contract(
            contractAddress,
            RouterABI.abi,
            signer
          )

          yield put({
            type: constants.ADD_LIQUIDITY_MSG,
            payload: { transactionProcessingMsg: `Adding liquidity...` }
          })

          console.log('----- currencies[currency0.toUpperCase()] ----- ', currencies[currency0.toUpperCase()])
          console.log('----- currencies[currency1.toUpperCase()] ----- ', currencies[currency1.toUpperCase()])

          const currency0Address = currencies[currency0.toUpperCase()];
          const currency1Address = currencies[currency1.toUpperCase()];
    
          try {
            const tx= yield call([contract,'addLiquidity'], 
              currency0Address,
              currency1Address,
              tickLower,
              tickUpper,
              parseUnits(liquidity, 18),
              parseUnits(amount0Max, 18),
              parseUnits(amount1Max, 18),
              parseUnits(ethToSend, 18)
            )

            const txReceipt = yield call([tx,'wait'])
            const transactionStatus = `Liquidity Tokens credited to ${signer.address}`
            console.log('---- deposit liquidity receipt is: ----', txReceipt)

            yield put({
              type: constants.ADD_LIQUIDITY_TX,
              payload: { 
                transactionStatus,
                showLoader: false,
                txReceipt
              }
            })
          } catch(e) {
            console.log('==== e ====,', e)
            const errorToStr = JSON.stringify(e)
            const errorObj = JSON.parse(errorToStr)
            const { shortMessage } = errorObj
            const transactionStatus = `Transaction Failed: ${shortMessage}`
    
            yield put({
              type: constants.ADD_LIQUIDITY_TX,
              payload: { 
                transactionStatus,
                showLoader: false
              }
            })
          }
        }
      } else {
        yield put({ type: constants.OPEN_RIGHT_DRAWER });
      }
    } else {
      yield put({
        type: constants.DISPLAY_METAMASK_INSTALL_PROMPT,
        payload: { modalKey: 'install-metamask-prompt' }
      });
    }
}

export function* selectCurrency(action) {
  const { currency0, currency1 } = action

  if(currency0 || currency1) {
    yield put({
      type: constants.SET_CURRENCY,
      payload: { currency0, currency1 }
    });
  }
}

export function* watchTransactionActions() {
  yield takeEvery(constants.ADD_LIQUIDITY, addLiquidity);
  yield takeEvery(constants.SET_CURRENCY, selectCurrency);
}
