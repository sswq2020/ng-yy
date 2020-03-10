import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SiderDirection } from '../wy-slider/wy-slider-types';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayer, getPlayList, getCurrentIndex, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from './player-types';
import { setCurrentIndex } from 'src/app/store/actions/player.actions';
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

  sliderVericalValue = 22;

  Vertical = SiderDirection.Vertical;

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

  constructor(private store$: Store<AppStoreModule>) {
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
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log(mode);
  }

  private watchCurrentSong(song: Song): void {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
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
  onPercentChange(per) {
    this.audioEl.currentTime = this.duration * (per / 100);
  }

}
