import { Response } from "@/dto/http-dto";
import { Api } from "@/utils/axios";
import { ToastError, ToastSuccess } from "@/utils/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useQueryTanstack = (keys: any[], url: string) => {
  return useQuery({
    queryKey: keys,
    queryFn: async () => {
      const res = await Api.get(url);
      return res.data as Response;
    },
  });
};

export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

export enum ContentType {
  JSON = "application/json",
  FORM = "multipart/form-data",
}

interface Mutate {
  url: string;
  body: any;
  method: HttpMethod;
  contentType?: ContentType;
}

export function useMutationTanstack(
  mutationKey: any[],
  useToast: boolean = false,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      url,
      body,
      method,
      contentType = ContentType.JSON,
    }: Mutate) => {
      const res = await Api({
        url: url,
        data: body,
        method: method,
        headers: {
          "Content-Type": contentType,
        },
      });

      return res.data;
    },
    mutationKey,
    onSuccess: (data: any) => {
      if (data.message && useToast) {
        ToastSuccess(data.message);
      }

      return queryClient.invalidateQueries({ queryKey: mutationKey });
    },
    onError: (err: any) => {
      if (err.response?.data && useToast) {
        ToastError(err.response.data.message);
      }
    },
  });
}
