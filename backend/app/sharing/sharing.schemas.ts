import { z } from "zod";

export const sharePermissionSchema = z.enum(["VIEW", "EDIT"]);

export const createShareSchema = z.object({
  nodeId: z.string().cuid("Valid node id is required"),
  sharedWithUserId: z.string().cuid("Valid user id is required"),
  permission: sharePermissionSchema,
});

export const updateShareSchema = z.object({
  permission: sharePermissionSchema,
});

export const listSharingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateShareSchemaInput = z.infer<typeof createShareSchema>;
export type UpdateShareSchemaInput = z.infer<typeof updateShareSchema>;