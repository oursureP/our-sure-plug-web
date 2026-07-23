import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, UpdateProfilePayload } from "@/app/lib/api/users.api";

export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: usersApi.getAll });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProfilePayload & { departmentId?: string };
    }) => usersApi.updateProfile(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersApi.updateRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate ? usersApi.reactivate(id) : usersApi.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.getOne(id),
    enabled: !!id,
  });
}

export function useAddPrivilege() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, privilege }: { id: string; privilege: string }) =>
      usersApi.addPrivilege(id, privilege),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user"] }),
  });
}

export function useRemovePrivilege() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, privilege }: { id: string; privilege: string }) =>
      usersApi.removePrivilege(id, privilege),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user"] }),
  });
}
export function usePrivilegeList() {
  return useQuery({
    queryKey: ["privilege-list"],
    queryFn: usersApi.getPrivilegeList,
  });
}
