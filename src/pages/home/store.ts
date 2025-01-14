import { proxy } from 'valtio/index';

export const playingStore = proxy<{ playing: boolean }>({ playing: false });
