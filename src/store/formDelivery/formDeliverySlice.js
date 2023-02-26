import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { closeModal } from '../modalDelivery/modalDeliverySlice';
import { clearOrder } from '../order/orderSlice';

/* Создаем initialState с изначальными значениями, разными полям формы */
const initialState = {
  name: '',
  phone: '',
  format: '',
  address: '',
  floor: '',
  intercom: '',
};

export const submitForm = createAsyncThunk(
  'formDelivery/submit',
  async (data, {dispatch, rejectithValue}) => {
    try {
      const response = await fetch('https://cloudy-slash-rubidium.glitch.me/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      };

      dispatch(clearOrder());
      dispatch(closeModal());

      return await response.json(); /* он вернется в state.response = action.payload; (53строка) */
    } catch (error) {
      return rejectithValue(e.message);
    }
  }
);

/* Создаем Slice, в котором один редьюсер будет обновлять все поля формы. По field будем определять, что за поле,
а по value - значение.

В экстраредьюсере обрабатываем запрос, выполняемый с помощью submitForm*/
const formDeliverySlice = createSlice({
  name: 'formDelivery',
  initialState,
  reducers: {
    updateFormValue: (state, action) => {
      state[action.payload.field] = action.payload.value;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(submitForm.pending, (state) => {
        state.status = 'loading';
        state.response = null;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state, action) => {
        state.status = 'success';
        state.response = action.payload;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

export const { updateFormValue } = formDeliverySlice.actions;
export default formDeliverySlice.reducer;
