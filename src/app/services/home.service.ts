import { Injectable, inject, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG_BASE_URL } from './services.module';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet } from './data-types/common.types';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
@Injectable({
  providedIn: ServicesModule
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG_BASE_URL) private uri: string) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get(`${this.uri}banner`).pipe(
      map((res: { banners: Banner[] }) => res.banners)
    );
  }

  getHotTags(): Observable<HotTag[]> {
    return this.http.get(`${this.uri}playlist/hot`).pipe(
      map((res: { tags: HotTag[] }) => res.tags)
    );
  }

  getPersonalSheetList(): Observable<SongSheet[]> {
    return this.http.get(`${this.uri}personalized`).pipe(
      map((res: { result: SongSheet[] }) => res.result)
    );
  }

}
