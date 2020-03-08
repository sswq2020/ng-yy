import { NgModule } from '@angular/core';
import { WyPlayerComponent } from './wy-player.component';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [WyPlayerComponent],
  imports: [
    WySliderModule,
    FormsModule
  ],
  exports: [
    WyPlayerComponent
  ]
})
export class WyPlayerModule { }
