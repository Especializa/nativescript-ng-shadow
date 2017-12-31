# NativeScript Angular Shadow Directive Plugin  ![apple](https://cdn3.iconfinder.com/data/icons/picons-social/57/16-apple-32.png) ![android](https://cdn4.iconfinder.com/data/icons/logos-3/228/android-32.png)

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]:https://travis-ci.org/Especializa/nativescript-ng-shadow.svg?branch=master
[build-url]:https://travis-ci.org/Especializa/nativescript-ng-shadow
[npm-image]:http://img.shields.io/npm/v/nativescript-ng-shadow.svg
[npm-url]:https://npmjs.org/package/nativescript-ng-shadow
[downloads-image]:http://img.shields.io/npm/dt/nativescript-ng-shadow.svg
[twitter-image]:https://img.shields.io/twitter/follow/especializa.svg?style=social&label=Follow%20us
[twitter-url]:https://twitter.com/especializa

## Installation
From the command prompt go to your app's root folder and execute:
```
tns plugin add nativescript-ng-shadow
```

## Demo
If you want a quickstart, [check out the demo app](https://github.com/Especializa/nativescript-ng-shadow/tree/master/demo).

[![N|Solid](demo/app/tools/assets/screenshot.png)](https://www.udemy.com/angular-native)

### How to use it
This is an Angular directive to make your life easier when it comes to native shadows.

Shadows are a very important part of [Material design specification](https://material.io/).
It brings up the [concept of elevation](https://material.io/guidelines/material-design/elevation-shadows.html), which implies in the natural human way of perceiving objects raising up from the surface.

With this directive, you won't have to worry about all the aspects regarding shadowing on Android and on iOS.
On the other hand, if you care about any details, just provide extra attributes and they will superseed the default ones.

However, running this on Android you will require the SDK to be greater or equal than 21 (Android 5.0 Lollipop or later), otherwise shadows will simply not be shown. There should be no problem running this on any version of iOS.

#### Import the NgShadowModule
```typescript
// ...
import { NgShadowModule } from 'nativescript-ng-shadow';

@NgModule({
    imports: [
        NgShadowModule,
        // ...
    ],
    // ...
})
export class MyModule { }
```

#### Just use in your templates
Simple attribute `shadow`:
```xml
<Label shadow="2"></Label>
```
Of course you can property bind it:
```xml
<Label [shadow]="myCustomShadow"></Label>
```
To provide other details, combine the `shadow` directive with other attributes:
```xml
<Label shadow [elevation]="myElevation" cornerRadius="5"></Label>
```
There are a couple of platform specific attributes you might want to use to customize your view. Bear in mind some of them clash with CSS styles applied to the same views. When it happens, the default behaviour on Android is the original HTML/CSS styles are lost in favor of the ones provided by this directive. On iOS, on the other hand, HTML/CSS pre-existent styles are regarded, consequently the shadow might not be applied.

The tip is avoid applying things like **background color** and **border radius** to the same view you intend to apply this directive. You are always able to nest views and get what you want. If not, please [leave a message](https://github.com/Especializa/nativescript-ng-shadow/issues) so we can try to help.

### List of attributes
The table below list and describes all possible attributes as well as show which platform supports each one of them:

| Attribute | Type | Platform | Description |
| --- | -- | --- | --- |
| shadow | string \| number \| [AndroidData](https://github.com/Especializa/nativescript-ng-shadow/blob/master/src/common/android-data.model.ts) \| [IOSData](https://github.com/Especializa/nativescript-ng-shadow/blob/master/src/common/ios-data.model.ts) | both | Directive attribute. Providing `null` or empty string with no `elevation` attribute, will switch off the shadow |
| elevation | number \| string | both | Determines the elevation of the view from the surface. It does all shadow related calculations. You might want to have a look at [this enum](https://github.com/Especializa/nativescript-ng-shadow/blob/master/src/common/elevation.enum.ts) of standard material design elevations. <br>PS: Since version 2.0, it's calculated in DIPs (or DPs, _density independent pixels_) on Android, or PTs (_points_) on iOS.
| shape | string => `'RECTANGLE'` \| `'OVAL'` \| `'RING'` \| `'LINE'` | Android | Determines the shape of the view and overrides its format styles.
| bgcolor | string => color #RGB | Android | Determines view's background color and overrides its previous background. |
| cornerRadius | number | Android | Determines view's corner radius *(CSS border-radius)* and overrides its previous style. <br>PS: Since version 2.0, it's calculated in DIPs (or DPs, _density independent pixels_). |
| translationZ | number | Android | Determines an extra distance (in DIP) to the surface. |
| maskToBounds | boolean => default: false | iOS | Determines whether the shadow will be limited to the view margins. |
| shadowColor | string => color #RGB | iOS | Determines shadow color. Shadow won't be applied if the view already has background. |
| shadowOffset | number | iOS | Determines the distance in points (only on Y axis) of the shadow. Negative value shows the shadow above the view. |
| shadowOpacity | number | iOS | From 0 to 1. Determines the opacity level of the shadow. |
| shadowRadius | number | iOS | Determines the blurring effect in points of the shadow. The higher the more blurred. |

### `AndroidData` and `IOSData`
As you might have noticed the main `shadow` attribute accepts object as argument. You'll be able to assign it in a property bind and it will override any possible separate attribute you might have defined:

#### Component
```typescript
import { AndroidData, ShapeEnum } from 'nativescript-ng-shadow';
// ...
export class MyComponent {
  fabShadow: AndroidData = {
    elevation: 6,
    bgcolor: '#ff1744',
    shape: ShapeEnum.OVAL,
  };
  // ...
}
```
In the template you can do:
```xml
<Label [shadow]="fabShadow" width="56" height="56"></Label>
```

## Pre-defined elevations
If you want to be consistent with the Material Design specification but you're sick trying to memorize which elevation your view should have. We put together a list of pre-defined elevations:
- SWITCH: 1
- CARD_RESTING: 2
- RAISED_BUTTON_RESTING: 2
- SEARCH_BAR_RESTING: 2
- REFRESH_INDICADOR: 3
- SEARCH_BAR_SCROLLED: 3
- APPBAR: 4
- FAB_RESTING: 6
- SNACKBAR: 6
- BOTTOM_NAVIGATION_BAR: 8
- MENU: 8
- CARD_PICKED_UP: 8,
- RAISED_BUTTON_PRESSED: 8
- SUBMENU_LEVEL1: 9
- SUBMENU_LEVEL2: 10
- SUBMENU_LEVEL3: 11
- SUBMENU_LEVEL4: 12
- SUBMENU_LEVEL5: 13
- FAB_PRESSED: 12
- NAV_DRAWER: 16
- RIGHT_DRAWER: 16
- MODAL_BOTTOM_SHEET: 16
- DIALOG: 24
- PICKER: 24

If you don't even want to check it out every time you have to shadow a view, just import the `Elevation` enum and enjoy :)

#### Component
```typescript
import { Elevation } from 'nativescript-ng-shadow';
class MyComponent {
  // ...
  ngOnInit(): init {
    this.mySnackBar.elevation = Elevation.SNACKBAR;
  }
  // ...
}
```

## Notes about version 2+
Here are the list of improvements on version 2.0:

1. BugFix: Integer directive not rendering on iOS.
1. Density independent pixels: Now you no longer have to worry about providing
   the correct values for pixel related attributes based on the device's
   screen density.
   Since iPhone 6S, each point correspond to 9 device pixels
   (3 horizontally x 3 vertically - that's the reason behind the @3x images -
   [view more here](https://medium.com/@pnowelldesign/pixel-density-demystified-a4db63ba2922)).
   The same happens to Android where the benchmark (mdpi) is considered ~160 pixels
   (or dots) per inch (dpi) and the majority of the modern devices having way
   denser screens, reaching ~640dpi or more.
   [Find out more here](https://developer.android.com/guide/practices/screens_support.html).
1. New Android specific attribute called translationZ. The elevation attribute
   is the baseline of the virtual Z axis (3D axis), but according to the [official
   documentation](https://developer.android.com/training/material/shadows-clipping.html)
   it's not the only part. Then, `translationZ` will add extra distance to the surface
   and it's mainly used for animations.
1. **2.1.X** Override Android default StateListAnimator as explained below:

### Override Android default StateListAnimator

Android buttons are split into three categories:
floating, raised and flat. Different from labels and other ui elements,
each button category has its own state animator.
So, when buttons are tapped, Android does affect their elevation
(and z translation) in a way that Angular is not notified. At the end of tap animation, buttons get back to
resting defaults (i.e. raised button's `elevation` at 2dp and `translationZ` at 0) overriding
the shadow stablished by this plugin.

Since version 2.1.0, this plugin replaces the default `StateListAnimator` with one
that gets back to the values you provide for `elevation` and `translationZ`.

Feel free to fill an issue if you want the flexibility of defining your own
`StateListAnimator`. The motivation so far was simply put this plugin to work with
buttons without changing the original state once they are clicked.

## Changelog
- 2.1.0  Decouple shadow logic / Override default StateListAnimator
- 2.0.1  Fix error on old Android devices (< Lollipop)
- 2.0.0  Density Independent Pixels / TranslationZ
- 1.1.3  Minor issues
- 1.1.2  Fix CI build
- 1.1.0  Support for iOS custom attributes
- 1.0.0  Initial implementation

## License
Apache License Version 2.0, January 2004
