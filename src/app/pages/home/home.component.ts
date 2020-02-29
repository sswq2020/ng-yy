import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singers: Singer[];

  @ViewChild('wyCarousel', { static: true }) wyCarousel: TemplateRef<any>;
  // 使用ViewChild获取子组件的实例 https://www.jianshu.com/p/ac5366abfa74
  @ViewChild(NzCarouselComponent, {static: true})  private nzcarousel: NzCarouselComponent;
  constructor(private homeService: HomeService, private singerService: SingerService) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalSheetList();
    this.getEnterSinger();
  }

  private getBanners() {
    this.homeService.getBanners().subscribe((banners) => {
      this.banners = banners;
    });
  }

  private getHotTags() {
    this.homeService.getHotTags().subscribe((hotTags) => {
      this.hotTags = hotTags.sort((a, b) => {
        return a.position - b.position;
      }).slice(0, 5);
    });
  }

  private getPersonalSheetList() {
    this.homeService.getPersonalSheetList().subscribe((songSheet) => {
      this.songSheetList = songSheet.slice(0, 16);
    });
  }

  private getEnterSinger() {
    this.singerService.getEnterSinger().subscribe((singers) => {
      this.singers = singers;
    });
  }

  ngOnInit(): void {
    console.info((this.wyCarousel));
  }

  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  getType(type: string) {
    this.nzcarousel[type]();
  }
}
