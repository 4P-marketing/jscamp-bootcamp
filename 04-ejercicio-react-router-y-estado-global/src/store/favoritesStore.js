import { create } from 'zustand'

export const useFavoritesStore = create((set, get ) => ({
    favorites: [],
    
    addFavorite: (jobId) => {
        set((state) => ({
        favorites: state.favorites.includes(jobId)
            ? state.favorites
            : [...state.favorites, jobId]
        }))
    },

    removeFavorite: (jobId) => {
        set((state) => ({
            favorites: state.favorites.filter(fav => fav !== jobId)
        }))
    },

    isFavorite: (jobId) => {
        return get().favorites.includes(jobId)
    },

    toggleFavorite: (jobId) => {
        const { addFavorite, removeFavorite, isFavorite } = get()
        const isFav = isFavorite(jobId)
        isFav ? removeFavorite(jobId) : addFavorite(jobId)
    },

    countFavorites: () => {
        return get().favorites.length;
    }

}))