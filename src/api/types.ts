export interface SchoolInfo {
    id: number;

    name: string;
}

export interface User {
    id: number;

    firstName: string;
    lastName: string;

    email: string;

    school: SchoolInfo;
    grade: string;

    role: string;

    balance: number;
}

export interface Contact {
    id: number;

    firstName: string;
    lastName: string;
    grade: string;
    school: string;
}

export enum AchievementStatus {
    inProcess = 1,
    approved,
    denied,
}

export interface Achievement {
    id: number;

    status: AchievementStatus;
    comment: string;
    attachments: string[];

    user: User;
}
