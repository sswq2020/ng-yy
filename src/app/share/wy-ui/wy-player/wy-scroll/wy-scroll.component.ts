import {
  Component,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import BScroll from '@better-scroll/core';

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{width:100%;height:100%;overflow:hidden;}`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {
  private bs: BScroll;

  @Input() data: any[];
  @Output() private scrollEnd = new EventEmitter<number>();

  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  constructor() { }

  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement);
    this.bs.on('scrollEnd', ({y}) => this.scrollEnd.emit(y));
  }

  ngOnInit(): void {
  }

  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    setTimeout(() => {
      this.refresh();
    }, 50);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.refreshScroll();
    }
  }
}
