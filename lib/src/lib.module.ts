import { NgModule } from '@angular/core';

import { NativeShadowDirective } from './nativescript-ngx-shadow/ng-shadow.directive';

@NgModule({
  imports: [],
  declarations: [
    NativeShadowDirective,
  ],
  exports: [
    NativeShadowDirective,
  ],
  providers: [],
})
export class NgShadowModule { }
