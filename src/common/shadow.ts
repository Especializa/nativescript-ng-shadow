import { Color } from 'tns-core-modules/color';

import { AndroidData } from "./android-data.model";
import { IOSData } from "./ios-data.model";
import { ShapeEnum } from './shape.enum';

declare const android: any;
declare const CGSizeMake: any;
declare const UIScreen: any;

export class Shadow {
  static DEFAULT_SHAPE = ShapeEnum.RECTANGLE;
  static DEFAULT_BGCOLOR = '#FFFFFF';
  static DEFAULT_SHADOW_COLOR = '#000000';

  static apply(tnsView: any, data: IOSData | AndroidData) {
    if (tnsView.android) {
      Shadow.applyOnAndroid(tnsView, Shadow.getDefaults(data));
    } else if (tnsView.ios) {
      Shadow.applyOnIOS(tnsView, Shadow.getDefaults(data));
    }
  }

  private static getDefaults(data: IOSData | AndroidData) {
    return Object.assign(
      {},
      data,
      {
        shape: (data as AndroidData).shape || Shadow.DEFAULT_SHAPE,
        bgcolor: (data as AndroidData).bgcolor || Shadow.DEFAULT_BGCOLOR,
        shadowColor: (data as IOSData).shadowColor ||
          Shadow.DEFAULT_SHADOW_COLOR,
      },
    );
  }

  private static applyOnAndroid(tnsView: any, data: AndroidData) {
    const nativeView = tnsView.android;
    const shape = new android.graphics.drawable.GradientDrawable();
    shape.setShape(
      android.graphics.drawable.GradientDrawable[data.shape],
    );
    shape.setColor(android.graphics.Color.parseColor(data.bgcolor));
    shape.setCornerRadius(
      Shadow.androidDipToPx(tnsView, data.cornerRadius as number),
    );
    nativeView.setBackgroundDrawable(shape);
    nativeView.setElevation(
      Shadow.androidDipToPx(tnsView, data.elevation as number),
    );
    nativeView.setTranslationZ(
      Shadow.androidDipToPx(tnsView, data.translationZ as number),
    );
  }

  private static applyOnIOS(tnsView: any, data: IOSData) {
    const nativeView = tnsView.ios;
    const elevation = parseFloat(((data.elevation as number) - 0).toFixed(2));
    nativeView.layer.maskToBounds = false;
    nativeView.layer.shadowColor = new Color(data.shadowColor).ios.CGColor;
    nativeView.layer.shadowOffset =
      data.shadowOffset ?
      CGSizeMake(0, parseFloat(String(data.shadowOffset))) :
      CGSizeMake(0, 0.54 * elevation - 0.14);
    nativeView.layer.shadowOpacity =
      data.shadowOpacity ?
      parseFloat(String(data.shadowOpacity)) :
      0.006 * elevation + 0.25;
    nativeView.layer.shadowRadius =
      data.shadowRadius ?
      parseFloat(String(data.shadowRadius)) :
      0.66 * elevation - 0.5;
  }

  static androidDipToPx(tnsView: any, dip: number) {
    const nativeView = tnsView.android;
    const metrics = nativeView.getContext().getResources().getDisplayMetrics();
    return android.util.TypedValue.applyDimension(
      android.util.TypedValue.COMPLEX_UNIT_DIP,
      dip,
      metrics,
    );
  }
}
