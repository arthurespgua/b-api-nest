export interface SessionRepository {
    createSession(userId: string, jwtToken: string) : Promise<void>;
    invalidateSession(jwtToken: string)             : Promise<void>;
    invalidateAllUserSessions(userId: string)       : Promise<void>;
    isSessionValid(jwtToken: string)                : Promise<boolean>;
    cleanExpiredSessions()                          : Promise<number>;
}
