import { Component, OnInit } from '@angular/core';
import { SiderDirection } from '../wy-slider/wy-slider-types';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayer } from 'src/app/store/selectors/player.selector';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  sliderValue = 35;

  sliderVericalValue = 22;

  Vertical = SiderDirection.Vertical;

  bufferOffet = 70;

  constructor(private store$: Store<AppStoreModule>) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => {
      console.log('getSongList', list);
    });
  }

  ngOnInit(): void {
  }

}
