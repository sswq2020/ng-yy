import { Component, OnInit } from '@angular/core';
import { SiderDirection } from '../wy-slider/wy-slider-types';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  sliderValue =  35;

  sliderVericalValue = 22;

  Vertical = SiderDirection.Vertical;

  bufferOffet = 70;

  constructor() { }

  ngOnInit(): void {
  }

}
