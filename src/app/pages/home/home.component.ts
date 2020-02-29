import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

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
  @ViewChild(NzCarouselComponent, { static: true }) private nzcarousel: NzCarouselComponent;

  constructor(private route: ActivatedRoute) {
    this.route.data.pipe(map(res => res.homeDatas))
    // 主要这种函数参数的解构赋值我平时用的不多,需要注意https://es6.ruanyifeng.com/#docs/destructuring#函数参数的解构赋值
    .subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
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
