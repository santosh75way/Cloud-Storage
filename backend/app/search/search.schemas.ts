import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().max(255).optional(),
  type: z.enum(["FILE", "FOLDER"]).optional(),
  ownership: z.enum(["MINE", "NOT_MINE", "ALL"]).default("ALL"),
  sharedStatus: z
    .enum(["SHARED_WITH_ME", "SHARED_BY_ME", "PUBLIC_LINKED", "ALL"])
    .default("ALL"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});