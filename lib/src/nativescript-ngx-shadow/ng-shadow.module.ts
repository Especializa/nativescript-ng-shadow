import { NgModule } from '@angular/core';

import { NativeShadowDirective } from './ng-shadow.directive';
export * from './ng-shadow.directive';

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
