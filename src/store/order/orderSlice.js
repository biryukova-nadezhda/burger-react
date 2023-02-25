import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderList: JSON.parse(localStorage.getItem('order') || '[]'),
};

/* Напишем свой middleware для записи данных в localStorage.
Чтобы этот middleware заработал, нужно его передать в метод middleware в store (см. index.js).

Этот же функционал можно было создать с помощью асинхронной функции, как в предыдущих, но тут чтобы попробовать*/
export const localStorageMiddleware = store => next => action => {
  const nextAction = next(action);

  if (nextAction.type.startsWith('order/')) {
    const orderList = store.getState().order.orderList;
    localStorage.setItem('order', JSON.stringify(orderList));
  }

  return nextAction;
}

/* Если таким образом пропишем в addProduct state.orderList.push({...action.payload, count: 1}), то будет добавляться только
1 товар */
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = state.orderList.find(item => item.id === action.payload.id);

      if (product) {
        product.count += 1;
      } else {
        state.orderList.push({...action.payload, count: 1})
      }
    }
  }
});

export const { addProduct } = orderSlice.actions;
export default orderSlice.reducer;
