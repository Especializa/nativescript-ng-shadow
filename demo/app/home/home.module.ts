import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { NgShadowModule } from 'nativescript-ng-shadow';

@NgModule({
    imports: [
        NativeScriptModule,
        HomeRoutingModule,
        NgShadowModule,
    ],
    declarations: [
        HomeComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
    ],
})
export class HomeModule { }
