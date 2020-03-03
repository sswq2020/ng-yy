import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
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
  selector: 'app-wy-slider-track',
  template: `<div class="wy-slider-track" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() wyVertical: string = SiderDirection.Vertical;
  @Input() wyLength: number;

  style: WysliderStyle = {};

  constructor() { }

  ngOnInit(): void {
  }

  // ngOnChanges这个用法感觉和Vue里的watch监听属性差不多
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wyLength) {
      if (this.wyVertical === SiderDirection.Vertical) {
        this.style.width = this.wyLength + '%';
        this.style.bottom = null;
        this.style.height = null;
      } else {
        this.style.height = this.wyLength + '%';
        this.style.left = null;
        this.style.width = null;
      }
    }
  }
}
