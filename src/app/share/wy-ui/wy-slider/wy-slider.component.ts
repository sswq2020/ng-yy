import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { SiderDirection, SliderEventObserverConfig } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None // https://angular.cn/guide/component-styles#external-and-global-style-files
})
export class WySliderComponent implements OnInit {
  /***模板变量获取的DOM**/
  private sliderDom: HTMLDivElement;

  /***水平方向还是垂直方向**/
  @Input() wyVertical: string = SiderDirection.Vertical;

  @ViewChild('wySlider', { static: true }) wySlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc: Document) { }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
  }

  /***
   * 策略模式
   *
   * 给拿到的DOM绑定6个事件函数
   *
   * PC端 mousedown mousemove mouseup---MouseEvent---e.pageX, e.pageY
   *
   * 移动端 touchstart touchmove touchend---TouchEvent---e.touches[0].pageX, e.touches[0].pageY
   * */
  private createDraggingObservables() {
    const orientField = this.wyVertical === SiderDirection.Vertical ? 'pageX' : 'pageY';

    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField],
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField],
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filterFunc, pluckKey } = source;
      // formEvent产生的值都是Event类实例
      // 比如常见MouseEvent,TouchEvent下的实例
      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filterFunc),
        tap((e: Event) => {
          e.stopPropagation();
          e.preventDefault();
        }),
        pluck(...pluckKey),
        map((position: number) => this.findCloseValue(position))
      );

      source.end$ = fromEvent(this.doc, end);

      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filterFunc),
        tap((e: Event) => {
          e.stopPropagation();
          e.preventDefault();
        }),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findCloseValue(position)),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  findCloseValue(position: number) {
    console.log(position);
    return 2;
  }
}
