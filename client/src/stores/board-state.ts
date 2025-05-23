import { create } from "zustand"

type Store = {
  isDragging: boolean
  setDragging: (isDragging: boolean) => void
  canDrag: boolean
  setCanDrag: (isDragging: boolean) => void
}

export const useBoardState = create<Store>((set) => ({
  isDragging: false,
  setDragging: (isDragging) => set({ isDragging }),
  canDrag: true,
  setCanDrag: (canDrag) => set({ canDrag }),
}))