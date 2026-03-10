import { z } from "zod";

export const createPublicLinkSchema = z.object({
    body: z.object({
        nodeId: z.string().min(1, "Node ID is required"),
        expiresAt: z.string().datetime().optional().nullable(),
    }),
});

export type CreatePublicLinkInput = z.infer<typeof createPublicLinkSchema>["body"];
