import {createSlice} from "@reduxjs/toolkit";
import {orderApi} from "../api/order";

const initialState = {
    orders: [],
    activeOrder: {},
    lastFetched: 0,
};



export const getOrders = (eventId) => async (dispatch) => {
    try {
        const data = await orderApi.getOrdersForEvent(eventId)
        if (data) {
            dispatch(slice.actions.getOrders(data))
        } else {
            dispatch(slice.actions.getOrders([]))
        }
    } catch (error) {
        throw error
    }
};

const slice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        getOrders(state, action) {
            state.orders = action.payload;
        },
    },
});


export const { reducer } = slice;