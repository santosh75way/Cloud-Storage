import { NodeType, SharePermission } from "@prisma/client";

export type StorageNodeType = NodeType;
export type StorageSharePermission = SharePermission;

export type NodeAccessLevel = "NONE" | "VIEW" | "EDIT" | "OWNER";