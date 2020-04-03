import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { setSongList, setPlayList, setCurrentIndex } from 'src/app/store/actions/player.actions';
import { getPlayer, getPlayMode } from 'src/app/store/selectors/player.selector';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-types';
import { shuffle, _findIndex } from 'src/app/utils';

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
  /***播放模式**/
  mode: PlayMode;

  @ViewChild('wyCarousel', { static: true }) wyCarousel: TemplateRef<any>;
  // 使用ViewChild获取子组件的实例 https://www.jianshu.com/p/ac5366abfa74
  @ViewChild(NzCarouselComponent, { static: true }) private nzcarousel: NzCarouselComponent;

  constructor(private route: ActivatedRoute, private sheetServe: SheetService, private store$: Store<AppStoreModule>) {
    this.route.data.pipe(map(res => res.homeDatas))
    // 主要这种函数参数的解构赋值我平时用的不多,需要注意https://es6.ruanyifeng.com/#docs/destructuring#函数参数的解构赋值
    .subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
    });

    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => {
      this.mode = mode;
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

  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.store$.dispatch(setSongList({songList: list}));
      let playIndex = 0;
      const playSong = list[playIndex];
      if (this.mode.type === 'random') {
        list = shuffle(list);
        playIndex = _findIndex(list, playSong);
      }
      this.store$.dispatch(setPlayList({playList: list}));
      this.store$.dispatch(setCurrentIndex({currentIndex: playIndex}));
    });
  }
}
