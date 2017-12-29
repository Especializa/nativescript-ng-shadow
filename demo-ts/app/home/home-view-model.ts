import { Observable } from "data/observable";
import { AndroidData, Elevation,
         Shape, ShapeEnum } from "nativescript-ng-shadow/ng-shadow";
import { ListPicker } from 'ui/list-picker';

export class HomeViewModel extends Observable {
  elevation = 2;
  shape = ShapeEnum;
  stdElevations: string[] = [];
  androidData: AndroidData;

  constructor() {
    super();
  }

  getAndroidData(): AndroidData {
    return {
      elevation: this.elevation,
      bgcolor: '#ff1744',
      shape: ShapeEnum.OVAL,
    };
  }

  loadListPicker(event) {
    const picker = event.object as ListPicker;
    for (const x in Elevation) {
      if (isNaN(parseInt(x, 10))) {
        this.stdElevations.push(x);
      }
    }
    picker.items = this.setElevation;
    this.androidData = this.getAndroidData();
  }

  setElevation(newValue) {
    const picker = newValue.object as ListPicker;
    this.elevation = Elevation[this.stdElevations[picker.selectedIndex]];
    this.androidData = this.getAndroidData();
  }
}
