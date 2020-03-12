import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { SiderDirection } from '../wy-slider/wy-slider-types';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayer, getPlayList, getCurrentIndex, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from './player-types';
import { setCurrentIndex, setPlayMode, setPlayList } from 'src/app/store/actions/player.actions';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle } from 'src/app/utils';

const modeTypes: PlayMode[] = [
  { type: 'loop', label: '循环' },
  { type: 'random', label: '随机' },
  { type: 'singleLoop', label: '单曲循环' }
];


@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  /***获取audio标签的引用**/
  @ViewChild('audio', { static: true }) private audio: ElementRef;
  /***获取audio的DOM,上面nativeElement属性**/
  private audioEl: HTMLAudioElement;

  /***播放器滑块百分比**/
  percent = 0;
  /***播放器缓冲的百分比**/
  bufferPercent = 0;
  /***音量**/
  volume = 22;
  /***是否显示音量面板**/
  showVolumnPanel = false;
  /***是否显示播放面板**/
  showPanel = false;
  /***是否点击音量面板本身**/
  selfClick = false;
  /***自定义常量,垂直**/
  Vertical = SiderDirection.Vertical;

  private winClick: Subscription | null;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  /***歌曲总时长**/
  duration: number;
  /***歌曲实时播放的进度时间**/
  currentTime: number;
  /***播放状态**/
  playing = false;
  /***是否可以播放**/
  songReady = false;
  /***播放模式**/
  mode: PlayMode;
  /***点击模式的次数**/
  modeCount = 0;

  constructor(private store$: Store<AppStoreModule>, @Inject(DOCUMENT) private doc: Document, ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
  }

  ngOnInit(): void {
    this.audioEl = this.audio.nativeElement;
    console.log(this.playList);
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
    console.log(type, list);
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log(mode);
    this.mode = mode;
  }

  private watchCurrentSong(song: Song): void {
    if (song && song.url) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    } else {
      if (this.currentIndex < this.playList.length -1) {
        this.updateIndex(this.currentIndex + 1);
      }
    }
  }

  onCanplay() {
    this.songReady = true;
    this.play();
  }

  private play() {
    this.audioEl.play();
    this.playing = true;
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }
  /***歌曲播放中,DOM返回的currentTime经过处理赋值给滑动组件的slideValue**/
  onTimeUpdate(e: Event) {
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }

  }

  onToggle() {
    // 如果设定播放的时候,歌曲并不存在,需要做进一步的处理
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    }
  }

  onEnd() {
    this.playing = false;
    if (this.mode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext();
    }
  }


  /***上一曲**/
  onPrev() {
    if (!this.songReady) { return; }
    if (this.playList.length === 1) {
      this.loop();
      return;
    }
    const index = this.currentIndex - 1 < 0 ? this.playList.length - 1 : this.currentIndex - 1;
    this.updateIndex(index);
  }
  /***下一曲**/
  onNext() {
    if (!this.songReady) { return; }
    if (this.playList.length === 1) {
      this.loop();
      return;
    }
    const index = this.currentIndex + 1 > this.playList.length ? 0 : this.currentIndex + 1;
    this.updateIndex(index);
  }

  private updateIndex(index: number) {
    this.store$.dispatch(setCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }
  /***循环播放**/
  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }
  /***手动拖拽滑动,赋值给audio的DOM的currentTime**/
  onPercentChange(per: number) {
    // 只能在当前有歌曲的时候,再赋值DOM的currentTime*
    if (this.currentSong) {
      this.audioEl.currentTime = this.duration * (per / 100);
    }
  }
  /***控制音量,audio的DOM的音量时0,1区间**/
  onVolumeChange(vol: number) {
    this.audioEl.volume = vol / 100;
  }

  toggleVolPanel() {
    this.togglePanel('showVolumnPanel');
  }

  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showPanel');
    }
  }


  /**
   * 1.面板初始状态是隐藏的,showVolumnPanel为false
   *
   * 2.这时通过点击togglePanel,面板显示,showVolumnPanel为true,同时执行bindDocumentClickListener函数
   *
   * 3.winClick一开始为null,进行窗口流的绑定订阅
   *
   * 4.如果在面板之外点击,selfClick为false,订阅函数中,面板消失,并执行取消订阅流,winClick赋值null
   *
   * 5.如果在面板之内点击,如果不是点击togglePanel的话,selfClick先是为true,后面因为在订阅函数中又赋值selfClick为false,这样面板就不会消失,流依然存在
   *
   * 6.如果在面板之内点击,如果是点击togglePanel的话,面板消失,还是会取消订阅流,winClick赋值null
   */
  togglePanel(type: string) {
    this[type] = !this[type];
    if (this[type]) {
      // 当音量面板显示的时候,绑定一个全局的click事件
      this.bindDocumentClickListener();
    } else {
      // 当音量面板隐藏的时候,解绑click事件
      this.unbindDocumentClickListener();
    }
  }

  /***绑定全局点击事件流并且订阅并赋值给winClick**/
  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) {
          this.showVolumnPanel = false;
          this.showPanel = false;
          this.unbindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }

  /***取消订阅全局点击事件流**/
  private unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  changeMode() {
    this.modeCount = this.modeCount + 1;
    const count = this.modeCount % 3;
    const mode = modeTypes[count];
    this.store$.dispatch(setPlayMode({ playMode: mode }));
    let list = null;
    if (mode.type === 'random') {
      list = shuffle(this.songList);
      this.resetCurrentIndex(list);
      this.store$.dispatch(setPlayList({ playList: list }));
    }
  }

  resetCurrentIndex(list: Song[]) {
    const index = list.findIndex((item) => {
      return item.id === this.currentSong.id;
    });
    this.store$.dispatch(setCurrentIndex({ currentIndex: index }));
  }


}
