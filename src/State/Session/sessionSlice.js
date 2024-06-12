import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    data: [],
    error: ''
}

export const fetchActiveSessions = createAsyncThunk(
    'sessions/fetchActiveSessions',
    async () => {
        const res = await fetch(`http://localhost:5000/sessions/active`).then(res => res.json())
        return res.sessions;
    }
)
const sessionSlice = createSlice({
    name:"sessions",
    initialState,
    reducers:{
        clearSessions: (state) => {
            state.sessions = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchActiveSessions.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchActiveSessions.fulfilled, (state,action) => {
            state.loading = false;
            state.data = action.payload
            state.error = ''
        })
        builder.addCase(fetchActiveSessions.rejected, (state,action) => {
            state.loading = false;
            state.sessions = [],
            state.error = action.error.message
        })
    }
});

export const {clearSessions} = sessionSlice.actions
export default sessionSlice.reducer;

