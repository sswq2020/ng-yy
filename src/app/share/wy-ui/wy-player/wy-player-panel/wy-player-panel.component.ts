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

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;
  @Input() currentIndex: number;
  @Output() closed = new EventEmitter<void>();

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  @ViewChild('panelUl', { static: true }) private panelUl: ElementRef;

  constructor(private store$: Store<AppStoreModule>) { }

  ngAfterViewInit(): void {
    console.log('#panelUl', this.panelUl.nativeElement);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      console.info('songList', this.songList);
    }

    if (changes['currentSong']) {
      console.info('currentSong', this.currentSong);
    }

    if (changes['currentIndex']) {
      if (this.currentIndex > -1 && this.show) {
        this.scrolltoLi(this.currentIndex);
      }
    }

    if (changes['show']) {
      if (!changes['show'].firstChange && this.show && this.currentIndex > -1) {
        this.wyScroll.first.refreshScroll();
        setTimeout(() => {
          this.scrolltoLi(this.currentIndex);
        }, 50)
        console.log('#panelUl', this.panelUl.nativeElement.querySelectorAll('li'));
      }
      console.info('currentSong', this.currentSong);
    }

  }

  private scrolltoLi(index) {
    const dom = this.panelUl.nativeElement.querySelectorAll('li')[index];
    this.wyScroll.first.scrollToElement(dom, 500);
  }

  changeCurrentSong(index: number) {
    console.log(index);
    this.store$.dispatch(setCurrentIndex({ currentIndex: index }));
  }

}

