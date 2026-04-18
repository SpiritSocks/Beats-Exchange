import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { fetchFollowedIds, toggleFollow } from "@/api/follows";
import { useAuth } from "@/context/AuthContext";

interface FollowsContextValue {
  followedIds: Set<number>;
  isFollowing: (producerId: number) => boolean;
  toggle: (producerId: number) => void;
  isLoading: boolean;
}

const FollowsContext = createContext<FollowsContextValue>({
  followedIds: new Set(),
  isFollowing: () => false,
  toggle: () => {},
  isLoading: false,
});

export function FollowsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["follows"],
    queryFn: fetchFollowedIds,
    enabled: !!token,
    select: (d) => new Set<number>(d.producer_ids),
  });

  const followedIds = data ?? new Set<number>();

  const mutation = useMutation({
    mutationFn: toggleFollow,
    onMutate: async (producerId) => {
      await queryClient.cancelQueries({ queryKey: ["follows"] });
      const prev = queryClient.getQueryData<{ producer_ids: number[] }>(["follows"]);

      queryClient.setQueryData<{ producer_ids: number[] }>(["follows"], (old) => {
        if (!old) return { producer_ids: [producerId] };
        const set = new Set(old.producer_ids);
        if (set.has(producerId)) set.delete(producerId);
        else set.add(producerId);
        return { producer_ids: Array.from(set) };
      });

      return { prev };
    },
    onError: (_err, _producerId, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["follows"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["followed-producers"] });
    },
  });

  return (
    <FollowsContext.Provider value={{
      followedIds,
      isFollowing: (id) => followedIds.has(id),
      toggle: (id) => {
        if (!token) {
          toast({
            title: "Требуется авторизация",
            description: "Войдите в аккаунт, чтобы подписываться на продюсеров.",
            action: (
              <ToastAction altText="Войти" onClick={() => navigate("/auth")}>
                Войти
              </ToastAction>
            ),
          });
          return;
        }
        mutation.mutate(id);
      },
      isLoading,
    }}>
      {children}
    </FollowsContext.Provider>
  );
}

export function useFollows() {
  return useContext(FollowsContext);
}
