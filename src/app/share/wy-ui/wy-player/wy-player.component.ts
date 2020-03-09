import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SiderDirection } from '../wy-slider/wy-slider-types';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayer, getPlayList, getCurrentIndex, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from './player-types';
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

  sliderValue = 35;

  sliderVericalValue = 22;

  Vertical = SiderDirection.Vertical;

  bufferOffet = 70;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song | null;

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
    this.currentSong = song;
  }

  onCanplay() {
    this.play();
  }

  private play() {
    this.audioEl.play();
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

}
