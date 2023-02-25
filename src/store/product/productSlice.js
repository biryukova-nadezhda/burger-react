import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URI, POSTFIX } from '../../const';

/* 1 шаг. Инициализируем начальный State, представляющий собой объект, в котором в ключе products будет массив с нашими продуктами,
а также error, содержащий ошибку, если есть*/
const initialState = {
  products: [],
  error: '',
};

/* 3 шаг. Описываем функцию для запросов, которые будут происходить при нажатии на кнопки навигации. На этом этапе мы делаем запрос на сервер
и получаем от него данные. Эти данные мы обрабатываем в методах addCase описанных в bilder на втором шаге
Придумываем имя, под каким будет запрос, будет в type,
а дальше будет функция, которая будет сразу возвращать результат запроса fetch (Promise). Т.е здесь мы:
1. Отправляем запрос по адресу ${API_URI}/${POSTFIX}?category=${category} для получения продуктов по категории, которую получаем первым
параметром функции.
2. Обрабатываем, если нет ошибки, данные, используя метод json
3. Обрабатываем ошибки, если есть */
export const productRequestAsync = createAsyncThunk(
  'product/fetch', (category) =>
    fetch(`${API_URI}${POSTFIX}?category=${category}`)
      .then(req => req.json())
      .catch(error => ({ error }))
);

/* 2 шаг. Создаем ProductSlice с помощью встроенной в redux createSlice. В нее передаем объект с ключами:
name - имя, которое сами придумываем
initialState в котором содержится наш initialState,
далее должны быть редьюсеры, мы здесь сразу пишем extraReducers.Под этим ключом нужно использовать функцию, которая принимает билдер.
bilder здесь -это объект, в котором есть несколько методов. Мы используем методы addCase, внутри которых будем использовать requestAsync,
который опишем выше на третьем шаге
В addCase обрабатываем все стадии запроса, промисы
Первым параметром в addCase передаем строку, мы получаем в ответ state и обрабатываем его функцией

Получается, что в state, мы записываем данные, которые нам пришли с сервера, а в action эти данные находятся

!!! Здесь нам не обязательно писать productRequestAsync.pending.type, так как там срабатывает toString и возвращает нам автоматически
этот type */
const productSlice = createSlice({
  name: 'product',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(productRequestAsync.pending, state => {
        state.error = '';
      })
      .addCase(productRequestAsync.fulfilled, (state, action) => {
        state.error = '';
        state.products = action.payload;
      })
      .addCase(productRequestAsync.rejected, (state, action) => {
        state.error = action.payload.error;
      })
  }
});

/* 4 шаг. Возвращаем наш reducer из слайсера */
export default productSlice.reducer;

/* !!!!!!!!!!!!! В файле categorySlice  мы сделали почти тоже самое, просто здесь использовали более современный синтаксис и методы */

/* 5 шаг. Подключить productReducer  в index.js */
