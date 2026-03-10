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

export type CreateShareSchemaInput = z.infer<typeof createShareSchema>;
export type UpdateShareSchemaInput = z.infer<typeof updateShareSchema>;