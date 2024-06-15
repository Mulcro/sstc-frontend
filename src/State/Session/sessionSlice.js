import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../../baseUrl";

const initialState = {
    loading: false,
    data: [],
    error: '',
}

export const fetchActiveSessions = createAsyncThunk(
    'sessions/fetchActiveSessions',
    async () => {
        const res = await fetch(baseUrl + `/sessions/active`).then(res => res.json())
        return res.sessions;
    }
)

//All the if's are to prevent unecessary re-rendering as this slice is dispatched periodically every second
const sessionSlice = createSlice({
    name:"sessions",
    initialState,
    reducers:{
        clearSessions: (state) => {
            state.data = [];
        }
    },
    extraReducers: (builder) => {
        //Was previouly updating the error to '' here but that was causing re-renders on every call and in the event of an error once it's set it's probably not going to change unless data is fetched and the error is resolved, which would result in the error being set to '' anyways
        builder.addCase(fetchActiveSessions.pending, (state) => {
            if(!state.loading){
                state.loading = true;
            }
        })
        builder.addCase(fetchActiveSessions.fulfilled, (state,action) => {
            if((state.error !== '') ){
                state.error = '';
            }
            if(JSON.stringify(state.data) != JSON.stringify(action.payload)){
                state.loading = false;
                state.data = action.payload;
            }
        })
        builder.addCase(fetchActiveSessions.rejected, (state,action) => {
            if((state.error !== action.error.message) ){
                state.loading = false;
                state.sessions = [],
                state.error = action.error.message
            }
        })
    }
});

export const {clearSessions} = sessionSlice.actions
export default sessionSlice.reducer;

