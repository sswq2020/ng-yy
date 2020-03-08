/***轮播图接口**/
export interface Banner {
  targetId: number;
  url: string | null;
  imageUrl: string;
}

/***热门标签接口**/
export interface HotTag {
  id: number;
  name: string | null;
  position: number;
}

/***歌手**/
export interface Singer {
  id: number;
  name: string | null;
  picUrl: string;
  albumSize: number;
}

/***歌曲**/
export interface Song {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number; name: string | null; picUrl: string };
  dt: number;
}

/***歌单接口**/
export interface SongSheet {
  id: number;
  name: string | null;
  picUrl: string | null;
  playCount: number;
  tracks: Song[];
}

/***歌曲播放地址**/
export interface SongUrl {
  id: number;
  url: string;
}


export type sliderValue = number | null;
