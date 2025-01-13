import { proxy } from 'valtio/index';

export const sideIndexStore = proxy<{ sideIndex: number }>({ sideIndex: 0 });
