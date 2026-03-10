export type SearchQueryDto = {
  q?: string;
  type?: "FILE" | "FOLDER";
  ownership?: "MINE" | "NOT_MINE" | "ALL";
  sharedStatus?: "SHARED_WITH_ME" | "SHARED_BY_ME" | "PUBLIC_LINKED" | "ALL";
  page: number;
  limit: number;
};

export type SearchActor = {
  userId: string;
  role: "ADMIN" | "USER";
};