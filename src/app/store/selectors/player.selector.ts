import { PlayState } from '../reducers/play.reducer';
import { createSelector } from '@ngrx/store';

const selectPlayer = (state: PlayState) => state;

export const getPlaying = createSelector(selectPlayer, (state: PlayState) => state.playing);
export const getPlayList = createSelector(selectPlayer, (state: PlayState) => state.playList);
export const getSongList = createSelector(selectPlayer, (state: PlayState) => state.songList);
export const getPlayMode = createSelector(selectPlayer, (state: PlayState) => state.playMode);
export const getCurrentIndex = createSelector(selectPlayer, (state: PlayState) => state.currentIndex);
export const getCurrentSong = createSelector(selectPlayer, ({ playList, currentIndex }: PlayState) => playList[currentIndex]);
