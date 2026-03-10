import { z } from "zod";

const nodeNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(255, "Name must not exceed 255 characters")
  .refine((value) => !value.includes("/"), {
    message: "Name must not contain '/'",
  });

export const createFolderSchema = z.object({
  name: nodeNameSchema,
  parentId: z.string().cuid().nullable(),
});

export const renameNodeSchema = z.object({
  name: nodeNameSchema,
});

export const listChildrenQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const generateUploadSignatureSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(1, "File name is required")
    .max(255, "File name must not exceed 255 characters"),
  folderId: z.string().cuid().nullable(),
  mimeType: z
    .string()
    .trim()
    .min(1, "MIME type is required")
    .max(255, "MIME type must not exceed 255 characters"),
});

export const createFileNodeSchema = z.object({
  name: nodeNameSchema,
  parentId: z.string().cuid().nullable(),
  mimeType: z.string().trim().min(1, "MIME type is required").max(255),
  size: z.number().int().nonnegative(),
  extension: z.string().trim().min(1).max(50).nullable(),
  cloudinaryPublicId: z.string().trim().min(1, "Cloudinary public id is required"),
  cloudinaryResourceType: z.string().trim().min(1, "Cloudinary resource type is required"),
});

export type CreateFolderSchemaInput = z.infer<typeof createFolderSchema>;
export type RenameNodeSchemaInput = z.infer<typeof renameNodeSchema>;
export type ListChildrenQuerySchemaInput = z.infer<typeof listChildrenQuerySchema>;
export type GenerateUploadSignatureSchemaInput = z.infer<typeof generateUploadSignatureSchema>;
export type CreateFileNodeSchemaInput = z.infer<typeof createFileNodeSchema>;