import { ElementRef, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { BackgroundData } from '../common/background-data.model';
import { Shape } from '../common/shape.enum';
export declare class NativeShadowDirective implements OnInit, OnChanges {
    private el;
    shadow: string | BackgroundData;
    elevation?: number | string;
    shape?: Shape;
    bgcolor?: string;
    cornerRadius?: number | string;
    private loaded;
    constructor(el: ElementRef);
    ngOnInit(): void;
    onLoaded(): void;
    ngOnChanges(changes: SimpleChanges): void;
    applyShadow(): void;
    private loadFromObject();
}
