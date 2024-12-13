import { proxy } from 'valtio';

export const currentIndexStore = proxy<{ currentIndex: number }>({ currentIndex: 0 });
