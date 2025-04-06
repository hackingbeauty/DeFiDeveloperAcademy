import constants from 'core/types'

const initialState = {
  modalState: {
    openModal: false,
    modalKey: ''
  },
  confirmModalState: {
    openModal: false,
    modalKey: ''
  },
  rightDrawerIsOpen: false,
  displayMetaMaskPrompt: false,
  snackBarOpen: false,
  showLoader: false
}

function uiReducer(state = initialState, action) {
  switch (action.type) {
    case constants.OPEN_MODAL:
      return Object.assign({}, state, {
        modalState: {
          openModal: true,
          modalKey: action.modalKey
        }
      })

    case constants.OPEN_CONFIRM_MODAL:
      return Object.assign({}, state, {
        confirmModalState: {
          openModal: true,
          modalKey: action.modalKey
        }
      })

    case constants.CLOSE_MODAL:
      return Object.assign({}, state, {
        modalState: {
          openModal: false
        }
      })

    case constants.CLOSE_CONFIRM_MODAL:
      return Object.assign({}, state, {
        confirmModalState: {
          openModal: false
        }
      })

    case constants.OPEN_RIGHT_DRAWER:
      return Object.assign({}, state, {
        rightDrawerIsOpen: true
      })

    case constants.CLOSE_RIGHT_DRAWER:
      return Object.assign({}, state, {
        rightDrawerIsOpen: false
      })

    case constants.DISPLAY_METAMASK_INSTALL_PROMPT:
      return Object.assign({}, state, {
        modalState: {
          openModal: true,
          modalKey: action.payload.modalKey
        }
      })

    case constants.CHANGE_CONTRACT_OWNER:
      return Object.assign({}, state, {
        showLoader: action.showLoader
      })

    case constants.ADD_LIQUIDITY_TX:
      return Object.assign({}, state, {
        snackBarOpen: true,
        showLoader: false
      })

    case constants.CHANGE_CONTRACT_OWNER_TX:
      return Object.assign({}, state, {
        snackBarOpen: true,
        showLoader: false
      })

    case constants.CLOSE_SNACK_BAR:
      return Object.assign({}, state, {
        snackBarOpen: false
      })
  
    default:
      return state
  }
}

export default uiReducer
