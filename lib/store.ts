import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useUserDataStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser: { id: String; email: String }) =>
        set({ user: newUser }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
