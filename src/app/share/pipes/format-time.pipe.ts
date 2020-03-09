import { Pipe, PipeTransform } from '@angular/core';
import { pad } from 'src/app/utils';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    value = value | 0; // 向下取整
    const minute = value / 60 | 0;
    const second = pad(value % 60);
    return `${minute}:${second}`;
  }

}
