import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush // 组件相对简单,且不怎么发生变化,只会在@Input()发生变化时用这个策略提升性能
})
export class WyCarouselComponent implements OnInit {
  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;

  @Output() changeSlide: EventEmitter<'pre'|'next'> = new EventEmitter();

  @Input() activeIndex = 0;

  constructor() { }

  ngOnInit(): void {
    console.log((this.dotRef));
  }

  onchangeSlide(type: 'pre'|'next') {
    this.changeSlide.emit(type);
  }

}
