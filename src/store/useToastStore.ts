import { create } from 'zustand';

interface ToastData {
    title: string;
    desc: string;
}

interface ToastState {
    activeToast: ToastData | null;
    setActiveToast: (toast: ToastData | null) => void;
}

export const useToastStore = create<ToastState>()((set) => ({
    activeToast: null,
    setActiveToast: (toast) => set({ activeToast: toast }),
}));
