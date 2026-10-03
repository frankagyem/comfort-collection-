import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      userInfo: null,
      theme: 'light',
      
      // Theme
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      
      // User Auth
      setUserInfo: (info) => set({ userInfo: info }),
      logout: () => set({ userInfo: null, cart: [], wishlist: [] }), // optional: keep cart if guest
      
      // Cart Actions
      addToCart: (item) =>
        set((state) => {
          const existItem = state.cart.find((x) => x.product === item.product && x.size === item.size);
          if (existItem) {
            return {
              cart: state.cart.map((x) =>
                x.product === existItem.product && x.size === existItem.size ? item : x
              ),
            };
          } else {
            return { cart: [...state.cart, item] };
          }
        }),
      removeFromCart: (id, size) =>
        set((state) => ({
          cart: state.cart.filter((x) => !(x.product === id && x.size === size)),
        })),
      clearCart: () => set({ cart: [] }),
      
      // Wishlist Actions
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.find((x) => x._id === product._id);
          if (exists) {
            return { wishlist: state.wishlist.filter((x) => x._id !== product._id) };
          } else {
            return { wishlist: [...state.wishlist, product] };
          }
        }),
    }),
    {
      name: 'comfort-collections-storage',
    }
  )
);

export default useStore;
