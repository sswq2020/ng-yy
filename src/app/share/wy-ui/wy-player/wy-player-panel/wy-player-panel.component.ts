import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { setCurrentIndex } from 'src/app/store/actions/player.actions';
import { Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;
  @Input() currentIndex: number;
  @Output() closed = new EventEmitter<void>();

  constructor(private store$: Store<AppStoreModule>) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      console.info('songList', this.songList);
    }

    if (changes['currentSong']) {
      console.info('currentSong', this.currentSong);
    }

  }

  changeCurrentSong(index: number) {
    console.log(index);
    this.store$.dispatch(setCurrentIndex({ currentIndex: index }));
  }

}

