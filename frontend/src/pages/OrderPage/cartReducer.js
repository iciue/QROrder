const initialState = {
  menu: [],
  cartStatus: [],
}


function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'getMenu':
      return {
        ...state,
        menu: action.menu,
      }
    
    case "updateFood":
      let newCartStatus;
      const FoodIndex = state.cartStatus.findIndex(it => it.food.id === action.food.id)
      if (FoodIndex >= 0) {
        if (action.amount <= 0) {
          newCartStatus = state.cartStatus.filter(it => it.food.id !== action.food.id)
        } else {
          newCartStatus = state.cartStatus.map(it => {
            if (it.food.id === action.food.id) it.amount = action.amount
            return it
          })
        }
      } else {
        newCartStatus = state.cartStatus.slice()
        newCartStatus.push(action)
      }

      return {
        ...state,
        cartStatus: newCartStatus
      };

    case "cartFood":
      return {
        ...state,
        cartStatus: action.cartStatus
      }

    case "placeOrderSuccess":
      return {
        ...state,
        cartStatus: []
      }
      
    default:
      return state;
  }
}


export default cartReducer