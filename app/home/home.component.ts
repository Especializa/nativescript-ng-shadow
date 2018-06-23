import { Component, OnInit } from "@angular/core";
import {
  AndroidData,
  Elevation,
  Shape,
  ShapeEnum
} from "../lib/src/public_api";

import { ListPicker } from "ui/list-picker";

@Component({
  moduleId: module.id,
  selector: "Home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  elevation = 2;
  shape = ShapeEnum;
  stdElevations: string[] = [];
  androidData: AndroidData;

  ngOnInit(): void {
    for (const x in Elevation) {
      if (isNaN(parseInt(x, 10))) {
        this.stdElevations.push(x);
      }
    }
    this.androidData = this.getAndroidData();
  }

  getAndroidData(): AndroidData {
    return {
      elevation: this.elevation,
      bgcolor: "#ff1744",
      shape: ShapeEnum.OVAL
    };
  }

  setElevation(newValue) {
    const picker = newValue.object as ListPicker;
    this.elevation = Elevation[this.stdElevations[picker.selectedIndex]];
    this.androidData = this.getAndroidData();
  }
}
