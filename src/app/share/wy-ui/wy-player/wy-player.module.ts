import { NgModule } from '@angular/core';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormatTimePipe } from '../../pipes/format-time.pipe';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';



@NgModule({
  declarations: [WyPlayerComponent, FormatTimePipe, WyPlayerPanelComponent],
  imports: [
    WySliderModule,
    FormsModule,
    CommonModule
  ],
  exports: [
    WyPlayerComponent,
    WyPlayerPanelComponent,
    FormatTimePipe
  ]
})
export class WyPlayerModule { }
