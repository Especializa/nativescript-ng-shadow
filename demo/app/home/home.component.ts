import { ListPicker } from 'ui/list-picker';
import { Component, OnInit } from '@angular/core';
import { BackgroundData, Elevation,
        Shape, ShapeEnum } from 'nativescript-ng-shadow';

@Component({
  moduleId: module.id,
  selector: 'Home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    elevation = 2;
    shape = ShapeEnum;
    stdElevations: string[] = [];
    show = true;
    backgroundData: BackgroundData;

    constructor() {
    }

    ngOnInit(): void {
      for (const x in Elevation) {
        if (isNaN(parseInt(x, 10))) {
          this.stdElevations.push(x);
        }
      }
      this.backgroundData = this.getBackgroundData();
    }

    getBackgroundData(): BackgroundData {
      return {
        elevation: this.elevation,
        bgcolor: '#ff1744',
        shape: ShapeEnum.OVAL,
      };
    }

    setElevation(newValue) {
      const picker = <ListPicker>newValue.object;
      this.elevation = Elevation[this.stdElevations[picker.selectedIndex]];
      this.backgroundData = this.getBackgroundData();
    }
}
