import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { closeModal } from '../modalDelivery/modalDeliverySlice';
import { clearOrder } from '../order/orderSlice';

/* Создаем initialState с изначальными значениями, разными полям формы */
const initialState = {
  name: '',
  phone: '',
  format: 'delivery',
  address: '',
  floor: '',
  intercom: '',
  error: null,
  errors: {},
  touch: false,
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
    },
    setError: (state, action) => ({
      ...state,
      errors: action.payload,
    }),
    clearError: state => {
      state.error = {};
    },
    changeTouch: state => {
      state.touch = true;
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

export const { updateFormValue, setError, clearError, changeTouch } = formDeliverySlice.actions;
export default formDeliverySlice.reducer;

export const validateForm = () => (dispatch, getState) => {
  const form = getState().formDelivery;
  const errors = {};

  if(!form.name) {
    errors.name = 'Name is required';
  };

  if(!form.phone) {
    errors.phone = 'Phone is required';
  };

  if(!form.address && form.format === 'delivery') {
    errors.address = 'Address is required';
  };

  if(!form.floor && form.format === 'delivery') {
    errors.floor = 'Floor is required';
  };

  if(!form.intercom && form.format === 'delivery') {
    errors.intercom = 'Intercom is required';
  };

  if(form.format === 'pickup') {
    dispatch(updateFormValue({ field:'address', value: ''}));
    dispatch(updateFormValue({ field:'floor', value: ''}));
    dispatch(updateFormValue({ field:'intercom', value: ''}));
  }

  if(Object.keys.length) {
    dispatch(setError(errors));
  } else {
    dispatch(clearError());
  };
}
