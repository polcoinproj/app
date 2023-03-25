import { credentialsState, tokenState } from "../state/credentials";
import { SchoolInfo, User, Contact, AchievementStatus } from "./types";
import { getRecoil, setRecoil } from "recoil-nexus";
import { ImageInfo } from "expo-image-picker";

export class Api {
    private apiUrl = __DEV__
        ? "http://127.0.0.1:1756/api"
        : "https://polcoin.ctw.re/api";

    async generateNewToken() {
        setRecoil(tokenState, await this.login(getRecoil(credentialsState)));
    }

    async get(method: string): Promise<any> {
        const token = getRecoil(tokenState);

        var res = await fetch(this.apiUrl + "/" + method, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });

        if (res.status == 401) {
            this.generateNewToken();

            return this.get(method);
        }

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return await res.json();
    }
    async postUnauthorized(method: string, data: any): Promise<Response> {
        var res = await fetch(this.apiUrl + "/" + method, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return res;
    }
    async post(method: string, data: any): Promise<Response> {
        const token = getRecoil(tokenState);

        var res = await fetch(this.apiUrl + "/" + method, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return res;
    }

    // School
    async getSchools(): Promise<SchoolInfo[]> {
        return await this.get("school");
    }

    // Auth
    async register(data: any) {
        await this.postUnauthorized("auth/register", data);
    }
    async login(data: any): Promise<string> {
        return await (await this.postUnauthorized("auth/login", data)).text();
    }

    // User
    async getUser(): Promise<User> {
        return await this.get("user");
    }

    // Contact
    async getContacts(): Promise<Contact[]> {
        return await this.get("contact");
    }
    async addContact(data: any): Promise<string> {
        return await (await this.post("contact", data)).text();
    }

    // Transaction
    async transactionMake(data: any) {
        await this.post("transaction", data);
    }

    // Achievement
    async createAchievement(data: any): Promise<number> {
        return parseInt(await (await this.post("achievement", data)).text());
    }

    async achievementsGetByStatus(status: AchievementStatus) {
        return await this.get(`achievement/byStatus/${status}`);
    }

    async achievementAttach(id: number, uris: ImageInfo[]) {
        const token = getRecoil(tokenState);

        var data = new FormData();
        uris.forEach((e, k) =>
            data.append("file" + k, {
                uri: e.uri,
                type: e.type!,
                name: e.fileName,
            } as any)
        );

        var res = await fetch(this.apiUrl + "/achievement/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
            },
            body: data,
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        return res;
    }
}
