import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  ViewChildren,
  QueryList,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { setCurrentIndex } from 'src/app/store/actions/player.actions';
import { Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { _findIndex } from 'src/app/utils';
import { timer } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { WyLyric, BaseLyric } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() songList: Song[];
  @Input() playList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;
  @Output() closed = new EventEmitter<void>();
  /***BScroll发射滚动的Y值,Y值为负**/
  scrollY = 0;

  currentLyric: BaseLyric[];

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  @ViewChild('panelUl', { static: true }) private panelUl: ElementRef;

  constructor(private store$: Store<AppStoreModule>, private songServe: SongService) { }

  ngAfterViewInit(): void {
    console.log('#panelUl', this.panelUl.nativeElement);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.songList) {
    }

    if (changes.currentSong) {
      if (!this.currentSong) { return; }
      const index = _findIndex(this.songList, this.currentSong);
      this.updateLyric();
      if (index > -1 && this.show) {
        this.scrolltoLi(index);
      }
    }

    if (changes.show) {
      const index = _findIndex(this.songList, this.currentSong);
      if (!changes.show.firstChange && this.show && index > -1) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll();
        timer(100).subscribe(() => {
          this.scrolltoLi(index, 0);
        });
      }
    }
  }

  private scrolltoLi(index, delay = 500) {
    const dom = this.panelUl.nativeElement.querySelectorAll('li')[index] as HTMLElement;
    const offsetTop = dom.offsetTop;
    const offsetHeight = dom.offsetHeight;
    if (offsetTop - Math.abs(this.scrollY) > offsetHeight * 5 || offsetTop < Math.abs(this.scrollY)) {
      this.wyScroll.first.scrollToElement(dom, delay, false, false);
    }
  }

  changeCurrentSong(song: Song) {
    const index = _findIndex(this.playList, song);
    this.store$.dispatch(setCurrentIndex({ currentIndex: index }));
  }

  private updateLyric() {
    this.songServe.getLyric(this.currentSong.id).subscribe(res => {
      if (!res.lyric && !res.tlyric) { return; }
      const lyric = new WyLyric(res);
      this.currentLyric = lyric.getLines();
      console.log(this.currentLyric);
    });
  }

}

