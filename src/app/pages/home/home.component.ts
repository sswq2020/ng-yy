import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner } from 'src/app/services/data-types/common.types';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];

  @ViewChild('wyCarousel', { static: true }) wyCarousel: TemplateRef<any>;
  // 使用ViewChild获取子组件的实例 https://www.jianshu.com/p/ac5366abfa74
  @ViewChild(NzCarouselComponent, {static: true})  private nzcarousel: NzCarouselComponent;
  constructor(private homeService: HomeService) {
    this.homeService.getBanners().subscribe((banners) => {
      this.banners = banners;
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
