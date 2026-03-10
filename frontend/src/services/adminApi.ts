import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";
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

export type AdminShareRecord = {
    id: string;
    createdAt: string;
    node: { name: string; type: string };
    sharedByUser: { fullName: string; email: string };
    sharedWithUser: { fullName: string; email: string };
};

export type AdminActivityRecord = {
    id: string;
    type: "NODE_CREATED" | "SHARE_CREATED";
    actor: string;
    target: string;
    targetUser?: string;
    timestamp: string;
};

export type PaginatedSharesList = {
    items: AdminShareRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type PaginatedActivityList = {
    items: AdminActivityRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: axiosBaseQuery({ baseUrl: "/api/admin" }),
    tagTypes: ["AdminShares", "AdminActivity"],
    endpoints: (builder) => ({
        getRecentShares: builder.query<ApiSuccessResponse<PaginatedSharesList>, { page: number; limit: number }>({
            query: (params) => ({
                url: `/shares/recent`,
                method: "GET",
                params,
            }),
            providesTags: ["AdminShares"],
        }),
        getActivityFeed: builder.query<ApiSuccessResponse<PaginatedActivityList>, { page: number; limit: number }>({
            query: (params) => ({
                url: `/activity`,
                method: "GET",
                params,
            }),
            providesTags: ["AdminActivity"],
        }),
    }),
});

export const { useGetRecentSharesQuery, useGetActivityFeedQuery } = adminApi;
