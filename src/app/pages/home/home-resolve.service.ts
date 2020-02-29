import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { first } from 'rxjs/internal/operators';
/***需要获取的所有数据类型**/
type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

// 最好预先从服务器上获取完数据，这样在路由激活的那一刻数据就准备好了。 https://angular.cn/guide/router#resolve-pre-fetching-component-data
@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(private homeService: HomeService, private singerService: SingerService) { }

  resolve(): Observable<HomeDataType> {
  return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSinger(),
    ]).pipe(first());
  }
}
