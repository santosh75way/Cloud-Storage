import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";
import type {
    ShareRecord,
    CreateSharePayload,
    UpdateSharePayload,
    SharedWithMeItem,
} from "../types/sharing";
import type { ApiSuccessResponse } from "../types/storage";

const axiosBaseQuery =
    (
        { baseUrl }: { baseUrl: string } = { baseUrl: "" }
    ): BaseQueryFn<
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

export const sharingApi = createApi({
    reducerPath: "sharingApi",
    baseQuery: axiosBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Share"],
    endpoints: (builder) => ({
        createShare: builder.mutation<ApiSuccessResponse<ShareRecord>, CreateSharePayload>({
            query: (body) => ({
                url: `/shares`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Share", id: arg.nodeId }],
        }),

        getSharesForNode: builder.query<
            ApiSuccessResponse<{ items: ShareRecord[]; totalPages: number; total: number; page: number }>,
            { nodeId: string; page: number; limit: number }
        >({
            query: ({ nodeId, page, limit }) => ({
                url: `/shares/node/${nodeId}`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: (_result, _error, arg) => [{ type: "Share", id: arg.nodeId }],
        }),

        updateShare: builder.mutation<ApiSuccessResponse<ShareRecord>, { shareId: string; body: UpdateSharePayload; nodeId: string }>({
            query: ({ shareId, body }) => ({
                url: `/shares/${shareId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Share", id: arg.nodeId }],
        }),

        deleteShare: builder.mutation<ApiSuccessResponse<ShareRecord>, { shareId: string; nodeId: string }>({
            query: ({ shareId }) => ({
                url: `/shares/${shareId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Share", id: arg.nodeId }],
        }),

        getSharedWithMe: builder.query<
            ApiSuccessResponse<{ items: SharedWithMeItem[]; totalPages: number; total: number; page: number }>,
            { page: number; limit: number }
        >({
            query: ({ page, limit }) => ({
                url: `/shares/shared-with-me`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["Share"],
        }),
    }),
});

export const {
    useCreateShareMutation,
    useGetSharesForNodeQuery,
    useUpdateShareMutation,
    useDeleteShareMutation,
    useGetSharedWithMeQuery,
} = sharingApi;
