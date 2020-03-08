import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playReducer } from './reducers/play.reducer';




@NgModule({
  declarations: [],
  imports: [
    // 注册reducer
    StoreModule.forRoot({ player: playReducer }, {
      // 就是一些严格模式的要求 https://ngrx.io/guide/store/configuration/runtime-checks
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    })
  ]
})
export class AppStoreModule { }
