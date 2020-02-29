import { Injectable, inject, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG_BASE_URL } from './services.module';
import { Observable } from 'rxjs';
import { Singer } from './data-types/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import queryString from 'query-string';

interface SingerParams {
  /***偏移数量，用于分页**/
  offset: number;
  /***返回数量**/
  limit: number;
  /***category Code,歌手类型**/
  cat: string;
}

const defualtParams: SingerParams = {
  offset: 1,
  limit: 9,
  cat: '5001'
};

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG_BASE_URL) private uri: string) { }

  getEnterSinger(args: SingerParams = defualtParams): Observable<Singer[]> {
    // 注意get请求参数的处理
    // 1.通过 new HttpParams()
    // 2.利用第三方库queryString进行序列化
    const params = new HttpParams({fromString: queryString.stringify(args)});
    return this.http.get(`${this.uri}artist/list`, {params}).pipe(
      map((res: { artists: Singer[] }) => res.artists)
    );
  }

}
