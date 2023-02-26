import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './category/categorySlice.js';
import productReducer from './product/productSlice.js';
import orderReducer, { localStorageMiddleware } from './order/orderSlice.js';
import modalReducer from './modalDelivery/modalDeliverySlice.js';
import formDeliveryReducer from './formDelivery/formDeliverySlice.js';

/* Формируем хранилище, store, с данными, которыми смогут пользоваться любые компоненты, расположенные внутри
Provider в файле App.jsx

Чтобы работали наши написанные middlewares мы должны в методе middleware получить все дефолтные функции, которые уже
используются, используя метод getDefaultMiddleware, а затем добавить к ним массив с нашей функцией и вернуть итоговый массив*/
export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    order: orderReducer,
    modal: modalReducer,
    formDelivery: formDeliveryReducer,
  },

  middleware: getDefaultMiddleware => {
    const mdws = getDefaultMiddleware().concat(localStorageMiddleware);
    return mdws;
  }
});
