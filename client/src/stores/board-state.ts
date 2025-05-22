import { create } from "zustand"


type Store = {
  isDragging: boolean
  canDrag: boolean
  setDragging: (isDragging: boolean) => void
  setCanDrag: (isDragging: boolean) => void
}

export const useBoardState = create<Store>((set) => ({
  isDragging: false,
  canDrag: true,
  setDragging: (isDragging) => set({ isDragging }),
  setCanDrag: (canDrag) => set({ canDrag }),
}))