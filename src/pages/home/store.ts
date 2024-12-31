import { proxy } from 'valtio';

export const currentIndexStore = proxy<{ currentIndex: number }>({ currentIndex: 0 });

export const switchModelProcessStore = proxy<{
  process: {
    fromIndex: number;
    toIndex: number;
    value: number;
  } | null;
}>({ process: null });

export const modelOpenStore = proxy<{ open: boolean }>({ open: false });
