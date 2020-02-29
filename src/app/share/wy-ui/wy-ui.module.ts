import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../play-count.pipe';

@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe],
  imports: [
  ],
  exports: [
    // 这里注意一下,之前导出都是模块,这里导出是组件,因为这个组件是共享的,多个地方使用。
    // 当然申明依然是在这里
    // 这里有个小技巧,如果这里不导出,页面写html的时候,不会自动推断标签哦
    SingleSheetComponent,
    PlayCountPipe
  ]
})
export class WyUiModule { }
