import { Injectable, inject, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG_BASE_URL } from './services.module';
import { Observable } from 'rxjs';
import { SongSheet } from './data-types/common.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';


@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(private http: HttpClient, @Inject(API_CONFIG_BASE_URL) private uri: string) { }

  getSongSheetDetail(id: number): Observable<SongSheet> {
    // 注意get请求参数的处理
    // 1.通过 new HttpParams()
    // 2.单个参数可以set方法来书写
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.uri}playlist/detail`, {params}).pipe(
      map((res: { playlist: SongSheet}) => res.playlist)
    );
  }

}
