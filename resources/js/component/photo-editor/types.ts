
export type TemplateCategory =
    | 'bff'
    | 'wedding'
    | 'y2k'
    | 'polaroid'
    | 'collage'
    | 'classic';

export type PatternType =
    | 'none'
    | 'dots'
    | 'stripes'
    | 'grid'
    | 'hearts';

export interface BackgroundPattern {
    type: PatternType;
    color: string;
    spacing: number;
    size: number;
    opacity: number;
    angle?: number;
}

export interface TemplateBackground {
    color: string;
    pattern?: BackgroundPattern;
    imageUrl?: string;
}

export interface PhotoAsset {
    id: string;
    name: string;
    url: string;
}

export interface PhotoPlacement {
    photoId: string;
    offsetX: number;
    offsetY: number;
    zoom: number;
}

export type PhotoPlacements = Record<
    string,
    PhotoPlacement | undefined
>;

export interface PhotoSlot {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;

    rotation?: number;
    cornerRadius?: number;

    borderColor?: string;
    borderWidth?: number;
    borderPadding?: number;

    backgroundColor?: string;
}

export interface StickerOverlay {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;

    rotation?: number;
    opacity?: number;

    text?: string;
    src?: string;
    color?: string;
    backgroundColor?: string;
}

export interface TypographyOverlay {
    id: string;
    text: string;

    x: number;
    y: number;
    width: number;
    height: number;

    fontFamily?: string;
    fontSize: number;
    fontStyle?: 'normal' | 'bold' | 'italic' | 'bold italic';

    color: string;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';

    rotation?: number;
    letterSpacing?: number;
    opacity?: number;
}

export interface PhotoTemplate {
    id: string;
    name: string;
    category: TemplateCategory;
    description: string;

    width: number;
    height: number;

    background: TemplateBackground;

    /** Optional legacy compatibility for existing components. */
    backgroundColor?: string;
    caption?: string;

    slots: PhotoSlot[];
    stickers: StickerOverlay[];
    typography: TypographyOverlay[];
}
