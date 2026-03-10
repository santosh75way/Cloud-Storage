import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";
import type { ApiSuccessResponse } from "../types/storage";
import type { PaginatedSearchList, SearchQueryPayload } from "../types/search";

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

export const searchApi = createApi({
    reducerPath: "searchApi",
    baseQuery: axiosBaseQuery({ baseUrl: "/api/v1" }),
    tagTypes: ["Search", "Storage", "Share"],
    endpoints: (builder) => ({
        searchNodes: builder.query<ApiSuccessResponse<PaginatedSearchList>, SearchQueryPayload>({
            query: (params) => ({
                url: `/search`,
                method: "GET",
                params,
            }),
            providesTags: ["Search"],
        }),
    }),
});

export const { useSearchNodesQuery, useLazySearchNodesQuery } = searchApi;
