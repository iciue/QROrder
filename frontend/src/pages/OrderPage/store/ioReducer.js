import io from 'socket.io-client'

const initialState = {
  socket: {}
}

function ioReducer(state = initialState, action) {
  switch (action.type) {
    case 'createSocket':
      const socket = io('localhost:8888', {
        path: '/desk',
        query: {
          desk: action.did
        }
      })
      socket.on('connect', () => {
        console.log('connect on')
        socket.emit('join desk', action.did)
      })

      socket.on('cart food', (cartStatus) => {
        console.log('new client get newest cartStatus from server');
        action.dispatch({
          type: 'cartFood',
          cartStatus,
        })
      })

      socket.on('new food', (newFood) => {
        console.log('receive newest newFood from server');
        action.dispatch({
          type: 'updateFood',
          food: newFood.food,
          amount: newFood.amount,
          totalPrice: newFood.amount * newFood.food.price
        })
      })

      socket.on('placeOrder success', (order) => {
        console.log('placeOrder success');
        action.dispatch({
          type: 'placeOrderSuccess',
        })
      })

      return {socket};

    case 'closeSocket':
      state.socket.close()
      console.log('socket closed');
      return state

    case 'newFood':
      console.log(state.socket);
      state.socket.emit('new food', {
        desk: action.desk,
        food: action.food,
        amount: action.amount,
        totalPrice: action.totalPrice
      })
      return state

    default:
      return state
  }
}

export default ioReducer