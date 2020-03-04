import {
  Component, OnInit, ViewEncapsulation,
  ChangeDetectionStrategy, ViewChild, ElementRef,
  Input, Inject, ChangeDetectorRef
} from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { SiderDirection, SliderEventObserverConfig } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';
import { inArr, limitNumberInRange, _getPercent } from 'src/app/utils';
import { getElementOffset } from './wy-slider-hleper';
import { sliderValue } from 'src/app/services/data-types/common.types';

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
  /***默认是百分制**/
  @Input() wyMin = 0;
  @Input() wyMax = 100;

  /***是否正在滑动,默认不滑动**/
  isDragging = false;

  value: sliderValue = null;
  /***offet作为最终给子组件输出的滑动百分比**/
  offet: sliderValue = null;

  @ViewChild('wySlider', { static: true }) wySlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc: Document, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // 1.绑定DOM
    this.sliderDom = this.wySlider.nativeElement;
    // 2.给DOM绑定6个Event事件转化为流
    this.createDraggingObservables();
    // 3.订阅mousedown或者touchstart事件流
    this.subscribeDrag(['start']);
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

  /***订阅一个或者多个事件流**/
  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArr(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this)); // 为什么是bind,能理解吗？
    }
    if (inArr(events, 'move') && this.dragMove$) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArr(events, 'end') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  /***订阅start时的回调函数**/
  private onDragStart(value: number) {
    this.setValue(value);
    this.toggleDragMoving(true);
  }

  /***订阅move时的回调函数**/
  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
    }
  }

  /***订阅end时的回调函数**/
  private onDragEnd() {
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private toggleDragMoving(movable: boolean) {
    this.isDragging = movable;
    if (movable) {
      this.subscribeDrag(['move', 'end']);
    } else {
      // this.unsubscribeDrag(['move', 'end']);
    }
  }

  // position / 滑动组件总长度  === position - 初始位置 / 滑动组件总长度
  private findCloseValue(position: number) {
    // 滑块总长
    const silderLength = this.getSliderlength();
    // 滑块(左,上)端点
    const sliderStart = this.getSliderStartPosition();
    // 滑块当前位置/滑块总长
    let ratio = (position - sliderStart) / silderLength;
    ratio = limitNumberInRange(ratio, 0, 1);
    // 垂直方向就是1-ratio
    ratio = this.wyVertical === SiderDirection.Vertical ? ratio : 1 - ratio;

    return ratio * (this.wyMax - this.wyMin) + this.wyMin;
  }

  /***滑动组件视口距离左边和上边的距离**/
  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical === SiderDirection.Vertical ? offset.left : offset.top;
  }

  /***滑动组件总长,区分水平垂直**/
  private getSliderlength(): number {
    return this.wyVertical === SiderDirection.Horizontal ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private setValue(value: sliderValue) {
    if (!this.valuesEqual) {
      this.value = value;
      this.updateTrackAndHandles();
    }
  }

  private valuesEqual(valA: sliderValue, valB: sliderValue) {
    if (typeof valA !== typeof valB) {
      return false;
    }
    return valA === valB;
  }

  private updateTrackAndHandles() {
    this.offet = this.getValuetoOffset(this.value);
    this.cdr.markForCheck();
  }

  private getValuetoOffset(value: sliderValue) {
    return _getPercent(value, this.wyMin, this.wyMax);
  }

}
