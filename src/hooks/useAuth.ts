import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = trpc.user.getProfile.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!localStorage.getItem("auth_token"),
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      localStorage.removeItem("auth_token");
      await utils.invalidate();
      window.location.href = "/login";
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    logoutMutation.mutate();
    window.location.href = "/login";
  }, [logoutMutation]);

  return useMemo(
    () => ({
      user: profileData?.user ?? null,
      profile: profileData?.profile ?? null,
      isAuthenticated: !!profileData?.user,
      isLoading: isLoading || logoutMutation.isPending,
      error,
      logout,
      refresh: refetch,
    }),
    [profileData, isLoading, logoutMutation.isPending, error, logout, refetch],
  );
}
