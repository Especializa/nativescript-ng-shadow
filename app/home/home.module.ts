import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";

import { NgShadowModule } from "../../lib/src/public_api";

@NgModule({
  imports: [HomeRoutingModule, NgShadowModule],
  declarations: [HomeComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}
