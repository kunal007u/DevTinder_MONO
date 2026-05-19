import CryptoJS from "crypto-js";
import type { IAuthState } from "../Store/store.d";

export const saveStorage = (state: IAuthState) => {
    console.log("🚀 ~💀 localStorage.ts:5 ~💀 saveStorage ~💀 state:", state);
    try {
        const serializedState = JSON.stringify(state); // Convert the state to a JSON string
        console.log("🚀 ~💀 localStorage.ts:8 ~💀 saveStorage ~💀 serializedState:", serializedState);
        return localStorage.setItem(
            "devTinder-state",
            CryptoJS.AES.encrypt( // Encrypt the serialized state using AES encryption
                CryptoJS.enc.Utf8.parse(serializedState),
                import.meta.env.VITE_CIPHER
            ).toString()
        );
    } catch (error) {
        console.log('Error While Saving LocalStorage State!!!');
    }
};
