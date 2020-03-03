import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SiderDirection, WysliderStyle } from './wy-slider-types';


/**
 * 水平:
 * track:width
 * handle:left
 */

/**
 * 垂直:
 * track:height
 * handle:bottom
 */

@Component({
  selector: 'app-wy-slider-handle',
  template: `<div class="wy-slider-handle" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderHandleComponent implements OnInit, OnChanges {
  @Input() wyVertical: string = SiderDirection.Vertical;
  @Input() wyOffset: number;

  style: WysliderStyle = {};

  constructor() { }

  ngOnInit(): void {
  }
  // ngOnChanges这个用法感觉和Vue里的watch监听属性差不多
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wyOffset) {
      this.style[this.wyVertical === SiderDirection.Vertical ? 'left' : 'bottom'] = this.wyOffset + '%';
    }
  }

}
