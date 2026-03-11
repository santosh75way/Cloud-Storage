import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";
import type {
    PublicShareLink,
    CreatePublicLinkPayload,
    PublicNodeResponse,
    PublicChildrenResponse,
    PublicBreadcrumbsResponse,
    PublicFileAccessUrlResponse,
} from "../types/publicLinks";
import type { ApiSuccessResponse } from "../types/storage";

const axiosBaseQuery =
    ({ baseUrl }: { baseUrl: string } = { baseUrl: "" }): BaseQueryFn<
        {
            url: string;
            method?: AxiosRequestConfig["method"];
            body?: AxiosRequestConfig["data"];
            params?: AxiosRequestConfig["params"];
        },
        unknown,
        unknown
    > =>
        async ({ url, method = "GET", body, params }) => {
            try {
                const result = await api({
                    url: baseUrl + url,
                    method,
                    data: body,
                    params,
                });
                return { data: result.data };
            } catch (axiosError) {
                const err = axiosError as AxiosError;
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                };
            }
        };

export const publicLinksApi = createApi({
    reducerPath: "publicLinksApi",
    baseQuery: axiosBaseQuery({ baseUrl: "/api/" }),
    tagTypes: ["PublicLink", "PublicNode"],
    endpoints: (builder) => ({
        // --- Admin Endpoints ---
        createPublicLink: builder.mutation<ApiSuccessResponse<PublicShareLink>, CreatePublicLinkPayload>({
            query: (payload) => ({
                url: "public-links",
                method: "POST",
                body: { body: payload },
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "PublicLink", id: arg.nodeId }],
        }),

        getPublicLinksForNode: builder.query<
            ApiSuccessResponse<{ items: PublicShareLink[]; totalPages: number; total: number; page: number }>,
            { nodeId: string; page: number; limit: number }
        >({
            query: ({ nodeId, page, limit }) => ({
                url: `public-links/node/${nodeId}`,
                params: { page, limit },
            }),
            providesTags: (result, _error, arg) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: "PublicLink" as const, id })),
                        { type: "PublicLink", id: arg.nodeId },
                    ]
                    : [{ type: "PublicLink", id: arg.nodeId }],
        }),

        revokePublicLink: builder.mutation<ApiSuccessResponse<PublicShareLink>, string>({
            query: (id) => ({
                url: `public-links/${id}/revoke`,
                method: "PATCH",
            }),
            invalidatesTags: (result) =>
                result?.data ? [{ type: "PublicLink", id: result.data.nodeId }] : ["PublicLink"],
        }),

        deletePublicLink: builder.mutation<ApiSuccessResponse<void>, { id: string, nodeId: string }>({
            query: ({ id }) => ({
                url: `public-links/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "PublicLink", id: arg.nodeId }],
        }),

        // --- Anonymous Public Endpoints ---
        getPublicNodeByToken: builder.query<ApiSuccessResponse<PublicNodeResponse>, string>({
            query: (token) => ({ url: `public/${token}` }),
            providesTags: (_result, _error, arg) => [{ type: "PublicNode", id: arg }],
        }),

        getPublicChildrenByToken: builder.query<
            ApiSuccessResponse<PublicChildrenResponse>,
            { token: string; nodeId?: string; page?: number; limit?: number }
        >({
            query: ({ token, nodeId, page = 1, limit = 50 }) => ({
                url: `public/${token}/children`,
                params: nodeId ? { nodeId, page, limit } : { page, limit },
            }),
            providesTags: (_result, _error, arg) => [{ type: "PublicNode", id: `children_${arg.token}_${arg.nodeId || "root"}` }],
        }),

        getPublicBreadcrumbsByToken: builder.query<
            ApiSuccessResponse<PublicBreadcrumbsResponse>,
            { token: string; nodeId?: string }
        >({
            query: ({ token, nodeId }) => ({
                url: `public/${token}/breadcrumbs`,
                params: nodeId ? { nodeId } : undefined,
            }),
        }),

        getPublicFileAccessUrlByToken: builder.query<ApiSuccessResponse<PublicFileAccessUrlResponse>, string>({
            query: (token) => ({ url: `public/${token}/file-access-url` }),
        }),

        getPublicDescendantFileAccessUrl: builder.query<
            ApiSuccessResponse<PublicFileAccessUrlResponse>,
            { token: string; nodeId: string }
        >({
            query: ({ token, nodeId }) => ({ url: `public/${token}/files/${nodeId}/access-url` }),
        }),
    }),
});

export const {
    useCreatePublicLinkMutation,
    useGetPublicLinksForNodeQuery,
    useRevokePublicLinkMutation,
    useDeletePublicLinkMutation,
    useGetPublicNodeByTokenQuery,
    useGetPublicChildrenByTokenQuery,
    useGetPublicBreadcrumbsByTokenQuery,
    useLazyGetPublicFileAccessUrlByTokenQuery,
    useLazyGetPublicDescendantFileAccessUrlQuery,
} = publicLinksApi;
