import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AnalysisState {
    formData: {
        age: number;
        gender: string;
        experience: number;
        capital: number;
        industry: string;
        target: string;
        op_type: string;
        op_time: string;
        areas: string[];
    };
    results: Record<string, number> | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AnalysisState = {
    formData: {
        age: 30,
        gender: '무관',
        experience: 0,
        capital: 50000000,
        industry: '한식 음식점업',
        target: '2030 MZ',
        op_type: '홀 중심',
        op_time: '상관없음',
        areas: ['성수동', '이태원'],
    },
    results: null,
    status: 'idle',
    error: null,
};

export const startAnalysis = createAsyncThunk(
    'analysis/startAnalysis',
    async (formData: AnalysisState['formData']) => {
        const response = await fetch('http://localhost:8000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data.reports;
    }
);

const analysisSlice = createSlice({
    name: 'analysis',
    initialState,
    reducers: {
        updateFormData: (state, action: PayloadAction<Partial<AnalysisState['formData']>>) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        resetAnalysis: (state) => {
            state.results = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startAnalysis.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(startAnalysis.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.results = action.payload;
            })
            .addCase(startAnalysis.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || '분석 중 오류가 발생했습니다.';
            });
    },
});

export const { updateFormData, resetAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer;
