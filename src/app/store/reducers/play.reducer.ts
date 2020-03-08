import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import { Song } from 'src/app/services/data-types/common.types';
import { setPlaying, setPlayList, setSongList, setPlayMode, setCurrentIndex } from '../actions/player.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface PlayState {
  // 播放状态
  playing: boolean;
  // 播放模式
  playMode: PlayMode;
  // 歌曲列表
  songList: Song[];
  // 播放列表
  playList: Song[];
  // 当前正在播放歌曲的索引
  currentIndex: number;
}

export const initialState: PlayState = {
  playing: false,
  playMode: { type: 'loop', label: '循环' },
  songList: [],
  playList: [],
  currentIndex: -1
};

const reducer = createReducer(initialState,
  on(setPlaying, (state, { playing }) => {
    return { ...state, playing };
  }),
  on(setPlayList, (state, { playList }) => {
    return { ...state, playList };
  }),
  on(setSongList, (state, { songList }) => {
    return { ...state, songList };
  }),
  on(setPlayMode, (state, { playMode }) => {
    return { ...state, playMode };
  }),
  on(setCurrentIndex, (state, { currentIndex }) => {
    return { ...state, currentIndex };
  }),
);

export function playReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}
