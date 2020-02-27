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

/***歌单接口**/
export interface SongSheet {
  id: number;
  name: string | null;
  picUrl: string;
  playCount: number;
}
