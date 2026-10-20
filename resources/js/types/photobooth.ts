export type PhotoFilter =
    | 'normal'
    | 'grayscale'
    | 'sepia'
    | 'vintage';

export type PatternType =
    | 'solid'
    | 'plaid'
    | 'sunburst'
    | 'checkerboard';

export interface TemplateSlot {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface PhotoboothTemplate {
    id: string;
    name: string;
    width: number;
    height: number;
    backgroundColor: string;
    frameColor: string;
    slots: TemplateSlot[];
}

export interface PhotoAsset {
    id: string;
    src: string;
    name: string;
}

export interface Sticker {
    id: string;
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

export interface PhotoboothState {
    selectedTemplate: PhotoboothTemplate;
    backgroundColor: string;
    selectedPattern: PatternType;
    selectedFilter: PhotoFilter;
    photos: Record<string, PhotoAsset | null>;
    stickers: Sticker[];
    selectedStickerId: string | null;
}