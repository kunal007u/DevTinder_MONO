

import { createSlice } from "@reduxjs/toolkit";
import type { IAuthState } from "../store.d";

const initialState: IAuthState = {
    firstName: "Test",
    lastName: "Test",
    email: "Test@gmail.com",
    age: 28,
    gender: "Male",
    profilePicture: "",
    bio: "heloo i am test",
    skills: ["React", "Node.js"],
    location: "New York, USA"
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        adminLogin: (state, action) => {
            state.firstName = action.payload.firstName ?? ""
            state.lastName = action.payload.lastName ?? ""
            state.email = action.payload.email ?? ""
            state.age = action.payload.age ?? 0
            state.gender = action.payload.gender ?? ""
            state.profilePicture = action.payload.profilePicture ?? ""
            state.bio = action.payload.bio ?? ""
            state.skills = action.payload.skills ?? []
            state.location = action.payload.location ?? ""
        }
    }
})

export const { adminLogin } = authSlice.actions;

export default authSlice.reducer;