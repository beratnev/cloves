import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Address {
  id: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

interface AddressState {
  addresses: Address[]
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (id: string, address: Partial<Omit<Address, 'id'>>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [
        {
          id: 'mock-address-1',
          name: 'Sarah Johnson',
          addressLine1: '123 Fashion Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          phone: '+1 (555) 123-4567',
          isDefault: true,
        }
      ],
      addAddress: (address) =>
        set((state) => {
          const newAddress = { ...address, id: Math.random().toString(36).substring(2, 9) }
          let newAddresses = [...state.addresses, newAddress]
          
          if (newAddress.isDefault || state.addresses.length === 0) {
            newAddresses = newAddresses.map(a => ({
              ...a,
              isDefault: a.id === newAddress.id
            }))
            // make sure the new address has isDefault = true if it was the first one
            const added = newAddresses.find(a => a.id === newAddress.id)
            if (added) added.isDefault = true
          }
          return { addresses: newAddresses }
        }),
      updateAddress: (id, address) =>
        set((state) => {
          let newAddresses = state.addresses.map((a) =>
            a.id === id ? { ...a, ...address } : a
          )
          
          if (address.isDefault) {
            newAddresses = newAddresses.map(a => ({
              ...a,
              isDefault: a.id === id
            }))
          }
          
          return { addresses: newAddresses }
        }),
      removeAddress: (id) =>
        set((state) => {
          const newAddresses = state.addresses.filter((a) => a.id !== id)
          if (newAddresses.length > 0 && !newAddresses.some(a => a.isDefault)) {
            newAddresses[0].isDefault = true
          }
          return { addresses: newAddresses }
        }),
      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),
    }),
    {
      name: 'address-storage',
    }
  )
)
