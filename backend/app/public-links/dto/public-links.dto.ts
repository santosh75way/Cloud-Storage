export interface CreatePublicLinkDto {
    nodeId: string;
    expiresAt?: string | null;
}

export interface PublicLinkResponseDto {
    id: string;
    nodeId: string;
    token: string;
    createdByUserId: string;
    isActive: boolean;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
