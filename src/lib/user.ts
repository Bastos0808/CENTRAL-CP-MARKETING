
export interface User {
    uid: string;
    email?: string | null;
    name?: string;
    role?: 'admin' | 'strategy' | 'podcast' | 'commercial';
    // Add other user properties here
}
