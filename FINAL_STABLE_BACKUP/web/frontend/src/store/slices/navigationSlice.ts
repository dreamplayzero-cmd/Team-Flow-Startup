import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ViewType = 'dashboard' | 'persona' | 'business_plan' | 'district_analysis' | 'district_leaderboard' | 'district_report';

interface NavigationState {
    currentView: ViewType;
}

const initialState: NavigationState = {
    currentView: 'dashboard',
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setView: (state, action: PayloadAction<ViewType>) => {
            state.currentView = action.payload;
        },
    },
});

export const { setView } = navigationSlice.actions;
export default navigationSlice.reducer;
