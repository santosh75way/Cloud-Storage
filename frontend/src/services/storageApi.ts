import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { api } from "./api";
import type {
    ApiSuccessResponse,
    CreateFileNodePayload,
    CreateFolderPayload,
    GenerateUploadSignaturePayload,
    GenerateUploadSignatureResponse,
    NodeBreadcrumbs,
    PaginatedNodeList,
    RenameNodePayload,
    StorageNode,
    FileAccessUrlResponse,
} from "../types/storage";

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

export const storageApi = createApi({
    reducerPath: "storageApi",
    baseQuery: axiosBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Storage", "Share"],
    endpoints: (builder) => ({
        getRootChildren: builder.query<
            ApiSuccessResponse<PaginatedNodeList>,
            { page?: number; limit?: number }
        >({
            query: ({ page = 1, limit = 20 }) => ({
                url: `/storage/root/children`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["Storage"],
        }),

        getFolderChildren: builder.query<
            ApiSuccessResponse<PaginatedNodeList>,
            { folderId: string; page?: number; limit?: number }
        >({
            query: ({ folderId, page = 1, limit = 20 }) => ({
                url: `/storage/${folderId}/children`,
                method: "GET",
                params: { page, limit },
            }),
            providesTags: (_result, _error, arg) => [{ type: "Storage", id: arg.folderId }],
        }),

        getNodeById: builder.query<ApiSuccessResponse<StorageNode>, string>({
            query: (nodeId) => ({
                url: `/storage/${nodeId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, nodeId) => [{ type: "Storage", id: nodeId }],
        }),

        getBreadcrumbs: builder.query<ApiSuccessResponse<NodeBreadcrumbs>, string>({
            query: (nodeId) => ({
                url: `/storage/${nodeId}/breadcrumbs`,
                method: "GET",
            }),
            providesTags: (_result, _error, nodeId) => [{ type: "Storage", id: `breadcrumbs-${nodeId}` }],
        }),

        createFolder: builder.mutation<ApiSuccessResponse<StorageNode>, CreateFolderPayload>({
            query: (body) => ({
                url: `/storage/folders`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Storage", "Share"],
        }),

        renameNode: builder.mutation<ApiSuccessResponse<StorageNode>, { nodeId: string; body: RenameNodePayload }>({
            query: ({ nodeId, body }) => ({
                url: `/storage/${nodeId}/rename`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Storage", "Share"],
        }),

        deleteNode: builder.mutation<ApiSuccessResponse<StorageNode>, string>({
            query: (nodeId) => ({
                url: `/storage/${nodeId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Storage", "Share"],
        }),

        generateUploadSignature: builder.mutation<
            ApiSuccessResponse<GenerateUploadSignatureResponse>,
            GenerateUploadSignaturePayload
        >({
            query: (body) => ({
                url: `/storage/uploads/sign`,
                method: "POST",
                body,
            }),
        }),

        createFileNode: builder.mutation<ApiSuccessResponse<StorageNode>, CreateFileNodePayload>({
            query: (body) => ({
                url: `/storage/files`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Storage", "Share"],
        }),

        getFileAccessUrl: builder.query<ApiSuccessResponse<FileAccessUrlResponse>, string>({
            query: (nodeId) => ({
                url: `/storage/${nodeId}/access-url`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetRootChildrenQuery,
    useGetFolderChildrenQuery,
    useGetNodeByIdQuery,
    useGetBreadcrumbsQuery,
    useCreateFolderMutation,
    useRenameNodeMutation,
    useDeleteNodeMutation,
    useGenerateUploadSignatureMutation,
    useCreateFileNodeMutation,
    useLazyGetFileAccessUrlQuery,
} = storageApi;