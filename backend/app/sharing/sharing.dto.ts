import type { SharePermission } from "@prisma/client";

export type CreateShareDto = {
  nodeId: string;
  sharedWithUserId: string;
  permission: SharePermission;
};

export type UpdateShareDto = {
  permission: SharePermission;
};

export type ShareListItemDto = {
  id: string;
  nodeId: string;
  sharedByUserId: string;
  sharedWithUserId: string;
  permission: SharePermission;
  createdAt: Date;
  updatedAt: Date;
  sharedWithUser: {
    id: string;
    email: string;
    fullName: string;
  };
};

export type ShareMutationActor = {
  userId: string;
  role: "ADMIN" | "USER";
};