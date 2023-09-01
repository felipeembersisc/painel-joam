import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    selectedItem: ['dashboard'],
    selectedID: null,
    drawerOpen: false,
    error: null,
    menu: {}
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        activeItem(state, action) {
            state.selectedItem = action.payload;
        },

        activeID(state, action) {
            state.selectedID = action.payload;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload;
        },

        // has error
        hasError(state, action) {
            state.error = action.payload;
        },

        // get dashboard menu
        getMenuListSuccess(state, action) {
            state.menu = action.payload;
        }
    }
});

export default menu.reducer;

export const { activeItem, openDrawer, activeID } = menu.actions;
