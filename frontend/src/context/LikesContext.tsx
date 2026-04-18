import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { fetchLikedIds, toggleLike } from "@/api/likes";
import { useAuth } from "@/context/AuthContext";

interface LikesContextValue {
  likedIds: Set<number>;
  isLiked: (beatId: number) => boolean;
  toggle: (beatId: number) => void;
  isLoading: boolean;
}

const LikesContext = createContext<LikesContextValue>({
  likedIds: new Set(),
  isLiked: () => false,
  toggle: () => {},
  isLoading: false,
});

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["likes"],
    queryFn: fetchLikedIds,
    enabled: !!token,
    select: (d) => new Set<number>(d.beat_ids),
  });

  const likedIds = data ?? new Set<number>();

  const mutation = useMutation({
    mutationFn: toggleLike,
    onMutate: async (beatId) => {
      await queryClient.cancelQueries({ queryKey: ["likes"] });
      const prev = queryClient.getQueryData<{ beat_ids: number[] }>(["likes"]);

      queryClient.setQueryData<{ beat_ids: number[] }>(["likes"], (old) => {
        if (!old) return { beat_ids: [beatId] };
        const set = new Set(old.beat_ids);
        if (set.has(beatId)) set.delete(beatId);
        else set.add(beatId);
        return { beat_ids: Array.from(set) };
      });

      return { prev };
    },
    onError: (_err, _beatId, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["likes"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
      queryClient.invalidateQueries({ queryKey: ["liked-beats"] });
    },
  });

  return (
    <LikesContext.Provider value={{
      likedIds,
      isLiked: (id) => likedIds.has(id),
      toggle: (id) => {
        if (!token) {
          toast({
            title: "Требуется авторизация",
            description: "Войдите в аккаунт, чтобы добавлять биты в избранное.",
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
    </LikesContext.Provider>
  );
}

export function useLikes() {
  return useContext(LikesContext);
}
