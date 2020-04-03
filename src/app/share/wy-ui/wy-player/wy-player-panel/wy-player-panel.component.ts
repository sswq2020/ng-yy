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

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  @ViewChild('panelUl', { static: true }) private panelUl: ElementRef;

  constructor(private store$: Store<AppStoreModule>) { }

  ngAfterViewInit(): void {
    console.log('#panelUl', this.panelUl.nativeElement);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.songList) {
      console.info('songList', this.songList);
    }

    if (changes.currentSong) {
      const index = _findIndex(this.songList, this.currentSong);
      console.log('songList', index);
      console.log('songList', this.songList);
      if (index > -1 && this.show) {
        this.scrolltoLi(index);
      }
    }

    if (changes.show) {
      const index = _findIndex(this.songList, this.currentSong);
      console.log('songList', index);
      if (!changes.show.firstChange && this.show && index > -1) {
        this.wyScroll.first.refreshScroll();
        setTimeout(() => {
          this.scrolltoLi(index);
        }, 100);
      }
    }
  }

  private scrolltoLi(index) {
    const dom = this.panelUl.nativeElement.querySelectorAll('li')[index] as HTMLElement;
    const offsetTop = dom.offsetTop;
    const offsetHeight = dom.offsetHeight;
    if (offsetTop - Math.abs(this.scrollY) > offsetHeight * 5 || offsetTop < Math.abs(this.scrollY)) {
      this.wyScroll.first.scrollToElement(dom, 500, false, false);
    }
  }

  changeCurrentSong(song: Song) {
    const index = _findIndex(this.playList, song);
    console.log('playList', index);
    console.log('playList', this.playList);
    this.store$.dispatch(setCurrentIndex({ currentIndex: index }));
  }

}

