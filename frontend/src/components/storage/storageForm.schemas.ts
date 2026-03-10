import { z } from "zod";

export const folderNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(255, "Name must not exceed 255 characters")
  .refine((value) => !value.includes("/"), {
    message: "Name must not contain '/'",
  });

export const createFolderFormSchema = z.object({
  name: folderNameSchema,
});

export const renameNodeFormSchema = z.object({
  name: folderNameSchema,
});