import { Color } from 'tns-core-modules/color';

import { AndroidData } from "./android-data.model";
import { IOSData } from "./ios-data.model";
import { ShapeEnum } from './shape.enum';

declare const android: any;
declare const java: any;
declare const CGSizeMake: any;
declare const UIScreen: any;

export class Shadow {
  static DEFAULT_SHAPE = ShapeEnum.RECTANGLE;
  static DEFAULT_BGCOLOR = '#FFFFFF';
  static DEFAULT_SHADOW_COLOR = '#000000';

  static apply(tnsView: any, data: IOSData | AndroidData) {
    if (
      tnsView.android &&
      android.os.Build.VERSION.SDK_INT >=
        android.os.Build.VERSION_CODES.LOLLIPOP
    ) {
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
      Shadow.androidDipToPx(nativeView, data.cornerRadius as number),
    );
    nativeView.setBackgroundDrawable(shape);
    nativeView.setElevation(
      Shadow.androidDipToPx(nativeView, data.elevation as number),
    );
    nativeView.setTranslationZ(
      Shadow.androidDipToPx(nativeView, data.translationZ as number),
    );
    if (nativeView.getStateListAnimator()) {
      this.overrideDefaultAnimator(nativeView, data);
    }
  }

  private static overrideDefaultAnimator(nativeView: any, data: AndroidData) {
    const sla = new android.animation.StateListAnimator();

    const ObjectAnimator = android.animation.ObjectAnimator;
    const AnimatorSet    = android.animation.AnimatorSet;
    const shortAnimTime  = android.R.integer.config_shortAnimTime;

    const buttonDuration =
      nativeView.getContext().getResources().getInteger(shortAnimTime) / 2;
    const pressedElevation = this.androidDipToPx(nativeView, 2);
    const pressedZ = this.androidDipToPx(nativeView, 4);
    const elevation = this.androidDipToPx(nativeView, data.elevation);
    const z = this.androidDipToPx(nativeView, data.translationZ || 0);

    const pressedSet = new AnimatorSet();
    const notPressedSet = new AnimatorSet();
    const defaultSet = new AnimatorSet();

    pressedSet.playTogether(java.util.Arrays.asList([
      ObjectAnimator.ofFloat(nativeView, "translationZ", [pressedZ])
        .setDuration(buttonDuration),
      ObjectAnimator.ofFloat(nativeView, "elevation", [pressedElevation])
        .setDuration(0),
    ]));
    notPressedSet.playTogether(java.util.Arrays.asList([
      ObjectAnimator.ofFloat(nativeView, "translationZ", [z])
        .setDuration(buttonDuration),
      ObjectAnimator.ofFloat(nativeView, "elevation", [elevation])
        .setDuration(0),
    ]));
    defaultSet.playTogether(java.util.Arrays.asList([
      ObjectAnimator.ofFloat(nativeView, "translationZ", [0]).setDuration(0),
      ObjectAnimator.ofFloat(nativeView, "elevation", [0]).setDuration(0),
    ]));

    sla.addState(
      [android.R.attr.state_pressed, android.R.attr.state_enabled],
      pressedSet,
    );
    sla.addState([android.R.attr.state_enabled], notPressedSet);
    sla.addState([], defaultSet);
    nativeView.setStateListAnimator(sla);
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

  static androidDipToPx(nativeView: any, dip: number) {
    const metrics = nativeView.getContext().getResources().getDisplayMetrics();
    return android.util.TypedValue.applyDimension(
      android.util.TypedValue.COMPLEX_UNIT_DIP,
      dip,
      metrics,
    );
  }
}
