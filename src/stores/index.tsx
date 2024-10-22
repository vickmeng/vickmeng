import { proxy } from 'valtio';

export const initLoadingProgressStore = proxy<{ progress: number; message: string }>({ progress: 0, message: '' });
