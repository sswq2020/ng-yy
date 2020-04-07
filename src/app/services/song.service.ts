import { Injectable, inject, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG_BASE_URL } from './services.module';
import { Observable, observable } from 'rxjs';
import { SongUrl, Song, Lyric } from './data-types/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';


@Injectable({
  providedIn: ServicesModule
})
export class SongService {

  constructor(private http: HttpClient, @Inject(API_CONFIG_BASE_URL) private uri: string) { }

  /***根据ids字符串返回一个或者多个歌曲播放地址**/
  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http.get(`${this.uri}song/url`, { params }).pipe(
      map((res: { data: SongUrl[] }) => res.data)
    );
  }

  /***
   * 1.歌单数组里已经包含每首歌的数据,但是缺播放url;
   * 2.因此根据id获取url,之后还要拼接;
   * 3.返回的数据必须是个Observable,因此需要 Observable.create和next方法
  **/
  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const that = this;
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(song => song.id).join(',');
    // return Observable.create(observer => {
    //   that.getSongUrl(ids).subscribe(urls => {
    //     observer.next(that.generateSongList(songArr, urls));
    //    });
    // });
    return that.getSongUrl(ids).pipe(
      map((urls) => that.generateSongList(songArr, urls))
    );
  }

  /**
   * @description 这个方法就是为了将歌单里每首歌曲都拼接上播放地址,毕竟是2个接口
   */
  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const list = [];
    songs.forEach(item => {
      const index = urls.findIndex(url => url.id === item.id);
      if (index > -1) {
        list.push({ ...item, url: urls[index].url });
      }
    });
    return list;
  }

  /***根据id字符串返回歌曲歌词,可能包含翻译**/
  getLyric(id: number): Observable<Lyric> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.uri}lyric`, {params}).pipe(
    map((res: {[key: string]: {lyric: string}}) => {
      return {
        lyric: res.lrc.lyric,
        tlyric: res.tlyric.lyric
      };
    }));
  }


}
