import { Directive, ElementRef, HostListener,
         Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Color } from 'tns-core-modules/color';
import { isAndroid, isIOS } from 'tns-core-modules/platform';

import { AndroidData } from '../common/android-data.model';
import { IOSData } from '../common/ios-data.model';
import { Shape, ShapeEnum } from '../common/shape.enum';

declare const android: any;
declare const CGSizeMake: any;

@Directive({ selector: '[shadow]' })
export class NativeShadowDirective implements OnInit, OnChanges {
  @Input() shadow: string | AndroidData | IOSData;
  @Input() elevation?: number | string;
  @Input() shape?: Shape;
  @Input() bgcolor?: string;
  @Input() cornerRadius?: number | string;
  @Input() maskToBounds?: boolean;
  @Input() shadowColor?: string;
  @Input() shadowOffset?: number | string;
  @Input() shadowOpacity?: number | string;
  @Input() shadowRadius?: number | string;

  private loaded = false;
  private initialized = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.shadow === null || (this.shadow === '' && !this.elevation)) {
      return;
    }

    this.initializeCommonData();

    if (isAndroid) {
      this.initializeAndroidData();
    } else if (isIOS) {
      this.initializeIOSData();
    }
    if (
      this.shadow &&
      (this.shadow as AndroidData | IOSData).elevation
    ) {
      if (isAndroid) {
        this.loadFromAndroidData(this.shadow as AndroidData);
      } else if (isIOS) {
        this.loadFromIOSData(this.shadow as IOSData);
      }
    }
    this.initialized = true;
  }

  @HostListener('loaded')
  onLoaded() {
    this.loaded = true;
    // Weirdly ngOnInit isn't called on iOS on demo app
    // Managed to get it working on iOS when applying to
    // FlexboxLayout, but on the demo app, we apply to a
    // Label, and, for that case, ngOnInit isn't called

    // This is just enforcing the Directive is initialized
    // before calling this.applyShadow()
    if (!this.initialized) {
      this.ngOnInit();
    }
    this.applyShadow();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.loaded &&
      !!changes &&
      ( changes.hasOwnProperty('shadow') ||
        changes.hasOwnProperty('elevation') ||
        changes.hasOwnProperty('shape') ||
        changes.hasOwnProperty('bgcolor') ||
        changes.hasOwnProperty('cornerRadius') ||
        changes.hasOwnProperty('maskToBounds') ||
        changes.hasOwnProperty('shadowColor') ||
        changes.hasOwnProperty('shadowOffset') ||
        changes.hasOwnProperty('shadowOpacity') ||
        changes.hasOwnProperty('shadowRadius') )
    ) {
      if (
        changes.shadow &&
        changes.shadow.currentValue.elevation
      ) {
        if (isAndroid) {
          this.loadFromAndroidData(this.shadow as AndroidData);
        } else if (isIOS) {
          this.loadFromIOSData(this.shadow as IOSData);
        }
      }
      this.applyShadow();
    }
  }

  private applyShadow() {
    if (this.shadow === null || (this.shadow === '' && !this.elevation)) {
      return;
    }
    const tnsView = this.el.nativeElement;
    if (tnsView.android) {
      this.applyOnAndroid(tnsView.android);
    } else if (tnsView.ios) {
      this.applyOnIOS(tnsView.ios);
    }
  }

  private initializeCommonData() {
    const tShadow = typeof this.shadow;
    if ((tShadow === 'string' || tShadow === 'number') && !this.elevation) {
      this.elevation = this.shadow ?
        parseInt(this.shadow as string, 10) : 2;
    }
    const tElevation = typeof this.elevation;
    if (tElevation === 'string' || tElevation === 'number') {
      this.elevation = this.elevation ?
        parseInt(this.elevation as string, 10) : 2;
    }
  }

  private initializeAndroidData() {
    if (typeof this.cornerRadius === 'string') {
      this.cornerRadius = parseInt(this.cornerRadius, 10);
    }
    if (!this.shape) {
      this.shape = ShapeEnum.RECTANGLE;
    }
    if (!this.bgcolor) {
      this.bgcolor = '#FFFFFF';
    }
  }

  private initializeIOSData() {
    if (!this.shadowColor) {
      this.shadowColor = '#000000';
    }
    if (typeof this.shadowOffset === 'string') {
      this.shadowOffset = parseFloat(this.shadowOffset);
    }
    if (typeof this.shadowOpacity === 'string') {
      this.shadowOpacity = parseFloat(this.shadowOpacity);
    }
    if (typeof this.shadowRadius === 'string') {
      this.shadowRadius = parseFloat(this.shadowRadius);
    }
  }

  private applyOnAndroid(nativeView: any) {
    const shape = new android.graphics.drawable.GradientDrawable();
    shape.setShape(
      android.graphics.drawable.GradientDrawable[this.shape],
    );
    shape.setColor(android.graphics.Color.parseColor(this.bgcolor));
    shape.setCornerRadius(this.cornerRadius);
    nativeView.setBackgroundDrawable(shape);
    nativeView.setElevation(this.elevation);
  }

  private applyOnIOS(nativeView: any) {
    const elevation = parseFloat(((this.elevation as number) - 0).toFixed(2));
    nativeView.layer.maskToBounds = false;
    nativeView.layer.shadowColor = new Color(this.shadowColor).ios.CGColor;
    nativeView.layer.shadowOffset =
      this.shadowOffset ?
      CGSizeMake(0, parseFloat(this.shadowOffset as string)) :
      CGSizeMake(0, 0.35 * elevation);
    nativeView.layer.shadowOpacity =
      this.shadowOpacity ?
      parseFloat(this.shadowOpacity as string) :
      0.015 * elevation + 0.18;
    nativeView.layer.shadowRadius =
      this.shadowRadius ?
      parseFloat(this.shadowRadius as string) :
      0.35 * elevation - 0.1;
  }

  private loadFromAndroidData(data: AndroidData) {
    this.elevation = data.elevation || this.elevation;
    this.shape = data.shape || this.shape;
    this.bgcolor = data.bgcolor || this.bgcolor;
    this.cornerRadius = data.cornerRadius || this.cornerRadius;
  }

  private loadFromIOSData(data: IOSData) {
    this.maskToBounds = data.maskToBounds || this.maskToBounds;
    this.shadowColor = data.shadowColor || this.shadowColor;
    this.shadowOffset = data.shadowOffset || this.shadowOffset;
    this.shadowOpacity = data.shadowOpacity || this.shadowOpacity;
    this.shadowRadius = data.shadowRadius || this.shadowRadius;
  }
}
