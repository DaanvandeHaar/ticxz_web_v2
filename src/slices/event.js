import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {eventApi} from "../api/event";

const initialState = {
    activeEvent: {},
    events: [],
    error: null,
    ticketTypes:[],
};




export const getTicketTypes = createAsyncThunk(
    'event/ticketTypes/get',
    async eventId => {
        return await eventApi.getTicketTypes(eventId)
    }
)
export const getEvents = createAsyncThunk(
    'events',
    async events => {
        return await eventApi.myEvents()
    }
)

export const createEvent = createAsyncThunk(
    'event/new',
    async event => {
        return await eventApi.createEvent(event);
    }
);
export const updateEvent = createAsyncThunk(
    'event/update',
    async ({data, eventId}) => {
        console.log(data, eventId)
        return await eventApi.updateEvent(data, eventId)
    }
);
export const createTicketType = createAsyncThunk(
    'event/ticketType/new',
    async ({data, eventId}) => {
        return await eventApi.createTicketType(data, eventId)
    }
);
export const updateTicketType = createAsyncThunk(
    'event/ticketType/update',
    async ({data, eventId}) => {
        return await eventApi.updateTicketType(data, eventId)
    }
);

export const deleteTicketType = createAsyncThunk(
    'event/ticketType/delete',
    async ({eventId, ticketTypeId}) => {
        return await eventApi.deleteTicketType(eventId, ticketTypeId)
    }
);


const slice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        clearState: (state, action) => {
            state.activeEvent = {};
            state.events = [];
            state.error = null;
            state.ticketTypes = [];
        },
        getTicketTypes(state, action) {
            state.ticketTypes = action.payload;
        },
        setActiveEvent(state, action) {
            state.activeEvent = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(getEvents.fulfilled, (state, action) => {
            if (!action.payload.length) {
                state.events = []
                state.activeEvent = {}
                return
            }
            let events = action.payload;
            state.activeEvent = events.filter(function (event) {
                return event.eventId === state.activeEvent.eventId;
            })[0] || {};
            state.events = action.payload || []
        });
        builder.addCase(getEvents.rejected, (state, action) => {
            state.activeEvent = {};
            state.events = []
            throw new Error("Events could not be fetched")
        });
        builder.addCase(createEvent.fulfilled, (state, action) => {
            state.events.push(action.payload);
            state.activeEvent = action.payload
        });
        builder.addCase(createEvent.rejected, () => {
            throw new Error('Failed to add event')
        });
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            state.events = state.events.map(event => {
                if(event.eventId === action.payload.eventId) return action.payload;
                if (state.activeEvent.eventId === action.payload.eventId) {
                    state.activeEvent = action.payload
                    return event
                } else {
                    return event
                }
            })
        });
        builder.addCase(updateEvent.rejected, () => {
            throw new Error('Failed to update event')
        });
        builder.addCase(getTicketTypes.fulfilled, (state, action) => {
            state.ticketTypes = action.payload || []
        })
        builder.addCase(getTicketTypes.pending, (state, action) => {
            state.ticketTypes = []
        })

        builder.addCase(getTicketTypes.rejected, (state, action) => {
            state.ticketTypes = []
        })
        builder.addCase(createTicketType.fulfilled, (state, action) => {
            state.ticketTypes.push(action.payload)
        });
        builder.addCase(createTicketType.rejected, (state, action) => {
            throw state.error
        });
        builder.addCase(updateTicketType.fulfilled, (state, action) => {
            state.ticketTypes = state.ticketTypes.map(ticketType => {
                if (ticketType.typeId === action.payload.typeId) return action.payload;
                return ticketType ;
            });
        });
        builder.addCase(updateTicketType.rejected, (state, action) => {
            console.log(action.error.message);
            throw new Error('Failed to update ticketType')
        });
        builder.addCase(deleteTicketType.fulfilled, (state, action) => {
            console.log(state, action)
            state.ticketTypes = state.ticketTypes.filter(ticketType => ticketType.typeId === action.payload.typeId)
        });
        builder.addCase(deleteTicketType.rejected, (state, action) => {
            console.log(state, action)
            throw new Error('Failed to delete ticketType')

        });
    }
});

export const { reducer } = slice;
export const { setActiveEvent } = slice.actions;


