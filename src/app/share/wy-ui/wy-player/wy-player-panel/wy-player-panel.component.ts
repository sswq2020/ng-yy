import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;

  constructor() { }

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

}

