import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None //https://angular.cn/guide/component-styles#external-and-global-style-files
})
export class WySliderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
