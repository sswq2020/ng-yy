import { Injectable, inject, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG_BASE_URL } from './services.module';
import { Observable } from 'rxjs';
import { Banner } from './data-types/common.types';
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
}
