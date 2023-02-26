import { atom } from "recoil";
import { persistAtom } from "./persist";

export interface CredentialsStateType {
    login: string
    password: string
}

export const credentialsState = atom({
    key: "credentialsState",
    default: {},
    effects_UNSTABLE: [persistAtom("credentialsState")]
});

export const tokenState = atom({
    key: "tokenState",
    default: "",
    effects_UNSTABLE: [persistAtom("token")]
});