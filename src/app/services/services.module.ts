import { NgModule, InjectionToken } from '@angular/core';

export const API_CONFIG_BASE_URL = new InjectionToken('ApiConfigBaseUrl');

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    {provide: API_CONFIG_BASE_URL, useValue: 'http://localhost:3000/'}
  ]

})
export class ServicesModule { }
