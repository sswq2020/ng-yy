import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';


/***存放全局共享的组件指令pipe***/
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
  ],
  exports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule
  ]
})
export class ShareModule { }
