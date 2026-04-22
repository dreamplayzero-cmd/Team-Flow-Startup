import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import navigationReducer from './slices/navigationSlice';
import authReducer from './slices/authSlice';
import analysisReducer from './slices/analysisSlice';

export const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        auth: authReducer,
        analysis: analysisReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks for typed access
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
