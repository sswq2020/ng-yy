import { Observable } from 'rxjs';

export enum SiderDirection {
  /***垂直**/
  Vertical = '0',
  /***水平**/
  Horizontal = '1'
}


export interface WysliderStyle {
  width?: string | null;
  height?: string | null;
  left?: string | null;
  bottom?: string | null;
}

/***定义的PC端和移动端对象**/
export interface SliderEventObserverConfig {
  start: string;
  move: string;
  end: string;
  filter: (e: Event) => boolean;
  pluckKey: string[];
  startPlucked$?: Observable<number>;
  moveResolved$?: Observable<number>;
  end$?: Observable<Event>;
}
