import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  departmentsApi,
  DepartmentPayload,
} from "@/app/lib/api/departments.api";

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: departmentsApi.getAll,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentPayload) => departmentsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DepartmentPayload }) =>
      departmentsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
}

export function useAddUserToDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      departmentId,
      userId,
    }: {
      departmentId: string;
      userId: string;
    }) => departmentsApi.addUser(departmentId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRemoveUserFromDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      departmentId,
      userId,
    }: {
      departmentId: string;
      userId: string;
    }) => departmentsApi.removeUser(departmentId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
