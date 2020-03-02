import { Injectable, inject, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG_BASE_URL } from './services.module';
import { Observable } from 'rxjs';
import { SongSheet, Song } from './data-types/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongService } from './song.service';


@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(private http: HttpClient, private songServe: SongService, @Inject(API_CONFIG_BASE_URL) private uri: string) { }

  getSongSheetDetail(id: number): Observable<SongSheet> {
    // 注意get请求参数的处理
    // 1.通过 new HttpParams()
    // 2.单个参数可以set方法来书写
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.uri}playlist/detail`, {params}).pipe(
      map((res: { playlist: SongSheet}) => res.playlist)
    );
  }

  /***
   * 1.这里需要包含播放地址歌曲数组,处理逻辑有Songserve去做
   * 2.这种一个请求依赖上个请求结果的时候,请用switchMap
   * 3.你可以这么理解,之前请求都是map操作,现在切换到另一个map上
   * **/
  playSheet(id: number): Observable<Song[]> {
     return this.getSongSheetDetail(id).pipe(
       // plick操作符 https://www.bookstack.cn/read/Learn-RxJS-zh/operators-transformation-pluck.md
       pluck('tracks'),
       switchMap(tracks => {
         return this.songServe.getSongList(tracks);
       })
     );
  }

}
