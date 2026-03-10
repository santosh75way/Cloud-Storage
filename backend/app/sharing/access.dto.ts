export type AccessActor = {
    userId: string;
    role: "ADMIN" | "USER";
};

export type ResolvedAccessLevel = "OWNER" | "EDIT" | "VIEW" | "NONE";
