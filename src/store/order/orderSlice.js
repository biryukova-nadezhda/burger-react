import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URI, POSTFIX } from '../../const';
import { calcTotal } from '../../utils/calcTotal';

const initialState = {
  orderList: JSON.parse(localStorage.getItem('order') || '[]'),
  orderGoods: [],
  totalPrice: 0,
  totalCount: 0,
  error: []
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
};

/* Напишем асинхронную функцию для запросов, для отображения товаров в корзине.
При помощи метода getState получаем state.order в нем находим лист с товарами и перебирая их методом map,
записываем их в массив, который используем для запроса на сервер */
export const orderRequestAsync = createAsyncThunk(
  'order/fetch',
  (_, { getState }) => {
    const listId = getState().order.orderList.map(item => item.id);
    return fetch(`${API_URI}${POSTFIX}?list=${listId}`)
      .then(req => req.json())
      .catch(error => ({ error }));
  }
)

/* Если таким образом пропишем в addProduct state.orderList.push({...action.payload, count: 1}), то будет добавляться только
1 товар */
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const productOrderList = state.orderList.find(item => item.id === action.payload.id);

      if (productOrderList) {
        productOrderList.count += 1;

        const productOrderGoods = state.orderGoods.find(item => item.id === action.payload.id);
        productOrderGoods.count = productOrderList.count;
        [state.totalCount, state.totalPrice] = calcTotal(state.orderGoods);
      } else {
        state.orderList.push({...action.payload, count: 1})
      }
    },
    removeProduct: (state, action) => {
      const productOrderList = state.orderList.find(item => item.id === action.payload.id);

      if (productOrderList.count > 1) {
        productOrderList.count -= 1;

        const productOrderGoods = state.orderGoods.find(item => item.id === action.payload.id);
        productOrderGoods.count = productOrderList.count;
        [state.totalCount, state.totalPrice] = calcTotal(state.orderGoods);
      } else {
        state.orderList = state.orderList.filter(item => item.id !== action.payload.id);
      }
    },
    clearOrder : (state) => {
      state.orderList = [];
      state.orderGoods = [];
    }
  },

  extraReducers: builder => {
    builder
      .addCase(orderRequestAsync.pending, (state) => {
        state.error = '';
      })
      .addCase(orderRequestAsync.fulfilled, (state, action) => {
        const orderGoods = state.orderList.map(item => {
          const product = action.payload.find(product => product.id === item.id);
          product.count = item.count;
          return product;
        });

        state.error = '';
        state.orderGoods = orderGoods;

        /* Это можно переписать через деструктуризацию. Описана в utils -> calcTotal */
        /* state.totalCount = orderGoods.reduce((acc, item) => acc + item.count, 0);
        state.totalPrice = orderGoods.reduce((acc, item) => acc + item.count * item.price, 0); */

        [state.totalCount, state.totalPrice] = calcTotal(orderGoods);
      })
      .addCase(orderRequestAsync.rejected, (state, action) => {
        state.error = action.payload.error;
      })
  }
});

export const { addProduct, removeProduct, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
