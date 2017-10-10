import { Directive, ElementRef, HostListener,
         Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Color } from 'tns-core-modules/color';

import { AndroidData } from '../common/android-data.model';
import { Shape, ShapeEnum } from '../common/shape.enum';

declare const android: any;
declare const CGSizeMake: any;

@Directive({ selector: '[shadow]' })
export class NativeShadowDirective implements OnInit, OnChanges {
  @Input()
  public shadow: string | AndroidData;
  @Input()
  public elevation?: number | string;
  @Input()
  public shape?: Shape;
  @Input()
  public bgcolor?: string;
  @Input()
  public cornerRadius?: number | string;

  private loaded = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.shadow === null || (this.shadow === '' && !this.elevation)) {
      return;
    }
    const tShadow = typeof this.shadow;
    if ((tShadow === 'string' || tShadow === 'number') && !this.elevation) {
      this.elevation = this.shadow ? parseInt(<string>this.shadow, 10) : 2;
    }
    const tElevation = typeof this.elevation;
    if (tElevation === 'string' || tElevation === 'number') {
      this.elevation = this.elevation ? parseInt(<string>this.elevation, 10) : 2;
    }
    if (typeof this.cornerRadius === 'string') {
      this.cornerRadius = parseInt(this.cornerRadius, 10);
    }
    if (!this.shape) {
      this.shape = ShapeEnum.RECTANGLE;
    }
    if (!this.bgcolor) {
      this.bgcolor = '#FFFFFF';
    }
    if (this.shadow && (<AndroidData>this.shadow).elevation) {
      this.loadFromObject();
    }
  }

  @HostListener('loaded')
  onLoaded() {
    this.loaded = true;
    this.applyShadow();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.loaded &&
        !!changes &&
        ( changes.hasOwnProperty('shadow') ||
          changes.hasOwnProperty('elevation') ||
          changes.hasOwnProperty('shape') ||
          changes.hasOwnProperty('bgcolor') ||
          changes.hasOwnProperty('cornerRadius')) ) {
      if (changes.shadow &&
          (<AndroidData>changes.shadow.currentValue).elevation) {
        this.loadFromObject();
      }
      this.applyShadow();
    }
  }

  applyShadow() {
    if (this.shadow === null || (this.shadow === '' && !this.elevation)) {
      return;
    }
    const tnsView = this.el.nativeElement;
    if (tnsView.android) {
      const shape = new android.graphics.drawable.GradientDrawable();
      shape.setShape(
        android.graphics.drawable.GradientDrawable[this.shape],
      );
      shape.setColor(android.graphics.Color.parseColor(this.bgcolor));
      shape.setCornerRadius(this.cornerRadius);
      tnsView.android.setBackgroundDrawable(shape);
      tnsView.android.setElevation(this.elevation);
    } else if (tnsView.ios) {
      const elevation = parseFloat(((this.elevation as number) - 0).toFixed(2));
      tnsView.ios.layer.maskToBounds = false;
      tnsView.ios.layer.shadowColor = new Color('#000000').ios.CGColor;
      tnsView.ios.layer.shadowOffset = CGSizeMake(0, 0.35 * elevation);
      tnsView.ios.layer.shadowOpacity = 0.015 * elevation + 0.18;
      tnsView.ios.layer.shadowRadius = 0.35 * elevation - 0.1;
    }
  }

  private loadFromObject() {
    this.elevation = (<AndroidData>this.shadow).elevation || this.elevation;
    this.shape = (<AndroidData>this.shadow).shape || this.shape;
    this.bgcolor = (<AndroidData>this.shadow).bgcolor || this.bgcolor;
    this.cornerRadius = (<AndroidData>this.shadow).cornerRadius || this.cornerRadius;
  }
}
