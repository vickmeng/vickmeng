import { proxy } from 'valtio/index';

export const playingStore = proxy<{ playing: boolean }>({ playing: false });

export const sideIndexStore = proxy<{ sideIndex: number }>({ sideIndex: 0 });

export const trackIndexStore = proxy<{ trackIndex: number }>({ trackIndex: 0 });

export const loadingStore = proxy<{ loading: boolean }>({ loading: true });
