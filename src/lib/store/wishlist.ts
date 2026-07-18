import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  discountPrice?: number
  image: string
  brand: string
  addedAt: Date
}

export interface WishlistCollection {
  id: string
  name: string
  description?: string
  items: WishlistItem[]
  createdAt: Date
  isDefault: boolean
}

interface WishlistStore {
  items: WishlistItem[]
  collections: WishlistCollection[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  createCollection: (name: string, description?: string) => void
  deleteCollection: (collectionId: string) => void
  addToCollection: (collectionId: string, item: Omit<WishlistItem, 'addedAt'>) => void
  removeFromCollection: (collectionId: string, productId: string) => void
  moveToCollection: (productId: string, collectionId: string) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      collections: [
        {
          id: 'default',
          name: 'All Items',
          isDefault: true,
          items: [],
          createdAt: new Date(),
        },
      ],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId)
          if (existingItem) return state

          const newItem = { ...item, addedAt: new Date() }
          
          // Add to default collection
          const updatedCollections = state.collections.map((collection) =>
            collection.isDefault
              ? { ...collection, items: [...collection.items, newItem] }
              : collection
          )

          return {
            items: [...state.items, newItem],
            collections: updatedCollections,
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
          collections: state.collections.map((collection) => ({
            ...collection,
            items: collection.items.filter((item) => item.productId !== productId),
          })),
        }))
      },

      clearWishlist: () => {
        set(() => ({
          items: [],
          collections: [
            {
              id: 'default',
              name: 'All Items',
              isDefault: true,
              items: [],
              createdAt: new Date(),
            },
          ],
        }))
      },

      createCollection: (name, description) => {
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id: `collection-${Date.now()}`,
              name,
              description,
              items: [],
              createdAt: new Date(),
              isDefault: false,
            },
          ],
        }))
      },

      deleteCollection: (collectionId) => {
        set((state) => {
          const collection = state.collections.find((c) => c.id === collectionId)
          if (!collection || collection.isDefault) return state

          return {
            collections: state.collections.filter((c) => c.id !== collectionId),
          }
        })
      },

      addToCollection: (collectionId, item) => {
        set((state) => {
          const collection = state.collections.find((c) => c.id === collectionId)
          if (!collection) return state

          const existingItem = collection.items.find((i) => i.productId === item.productId)
          if (existingItem) return state

          const newItem = { ...item, addedAt: new Date() }

          return {
            collections: state.collections.map((c) =>
              c.id === collectionId
                ? { ...c, items: [...c.items, newItem] }
                : c
            ),
          }
        })
      },

      removeFromCollection: (collectionId, productId) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? {
                  ...collection,
                  items: collection.items.filter((item) => item.productId !== productId),
                }
              : collection
          ),
        }))
      },

      moveToCollection: (productId, collectionId) => {
        const item = get().items.find((i) => i.productId === productId)
        if (!item) return

        get().addToCollection(collectionId, item)
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
