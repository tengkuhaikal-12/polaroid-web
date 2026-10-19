
import React from 'react';
import {
    Group,
    Image as KonvaImage,
    Layer,
    Rect,
    Text,
} from 'react-konva';
import useImage from 'use-image';

import type {
    BackgroundPattern,
    PhotoTemplate,
    StickerOverlay,
    TypographyOverlay,
} from './types';

interface BackgroundProps {
    template: PhotoTemplate;
}

interface PatternProps {
    pattern: BackgroundPattern;
    width: number;
    height: number;
}

interface OverlayProps {
    template: PhotoTemplate;
}

function PatternLayer({
    pattern,
    width,
    height,
}: PatternProps) {
    const spacing = Math.max(8, pattern.spacing);
    const size = Math.max(1, pattern.size);
    const opacity = Math.min(1, Math.max(0, pattern.opacity));

    if (pattern.type === 'none') {
        return null;
    }

    if (pattern.type === 'dots' || pattern.type === 'hearts') {
        const items = [];

        for (let y = spacing / 2; y < height; y += spacing) {
            for (let x = spacing / 2; x < width; x += spacing) {
                if (pattern.type === 'dots') {
                    items.push(
                        <Rect
                            key={`${x}-${y}`}
                            x={x - size}
                            y={y - size}
                            width={size * 2}
                            height={size * 2}
                            fill={pattern.color}
                            opacity={opacity}
                            cornerRadius={size}
                            listening={false}
                        />,
                    );
                } else {
                    items.push(
                        <Text
                            key={`${x}-${y}`}
                            x={x - size * 3}
                            y={y - size * 3}
                            width={size * 6}
                            height={size * 6}
                            text="♥"
                            fontSize={size * 5}
                            fill={pattern.color}
                            opacity={opacity}
                            align="center"
                            verticalAlign="middle"
                            listening={false}
                        />,
                    );
                }
            }
        }

        return <Group listening={false}>{items}</Group>;
    }

    if (pattern.type === 'grid') {
        const lines = [];

        for (let x = 0; x < width; x += spacing) {
            lines.push(
                <Rect
                    key={`v-${x}`}
                    x={x}
                    y={0}
                    width={size}
                    height={height}
                    fill={pattern.color}
                    opacity={opacity}
                    listening={false}
                />,
            );
        }

        for (let y = 0; y < height; y += spacing) {
            lines.push(
                <Rect
                    key={`h-${y}`}
                    x={0}
                    y={y}
                    width={width}
                    height={size}
                    fill={pattern.color}
                    opacity={opacity}
                    listening={false}
                />,
            );
        }

        return <Group listening={false}>{lines}</Group>;
    }

    // Draw a diagonal pattern using a clipped group.
    if (pattern.type === 'stripes') {
        const stripes = [];

        for (let x = -height; x < width + height; x += spacing) {
            stripes.push(
                <Rect
                    key={`stripe-${x}`}
                    x={x}
                    y={-height}
                    width={size}
                    height={height * 3}
                    fill={pattern.color}
                    opacity={opacity}
                    rotation={pattern.angle ?? 35}
                    listening={false}
                />,
            );
        }

        return (
            <Group
                clipX={0}
                clipY={0}
                clipWidth={width}
                clipHeight={height}
                listening={false}
            >
                {stripes}
            </Group>
        );
    }

    return null;
}

function StickerItem({
    sticker,
}: {
    sticker: StickerOverlay;
}) {
    const [image] = useImage(sticker.src ?? '', 'anonymous');

    return (
        <Group
            x={sticker.x}
            y={sticker.y}
            rotation={sticker.rotation ?? 0}
            opacity={sticker.opacity ?? 1}
            listening={false}
        >
            {sticker.backgroundColor && (
                <Rect
                    width={sticker.width}
                    height={sticker.height}
                    fill={sticker.backgroundColor}
                    cornerRadius={8}
                />
            )}

            {image ? (
                <KonvaImage
                    image={image}
                    width={sticker.width}
                    height={sticker.height}
                    listening={false}
                />
            ) : sticker.text ? (
                <Text
                    width={sticker.width}
                    height={sticker.height}
                    text={sticker.text}
                    fontSize={Math.min(
                        sticker.width,
                        sticker.height,
                    ) * 0.8}
                    fontFamily="Arial"
                    fill={sticker.color ?? '#333333'}
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                />
            ) : null}
        </Group>
    );
}

function TypographyItem({
    item,
}: {
    item: TypographyOverlay;
}) {
    return (
        <Group
            x={item.x}
            y={item.y}
            rotation={item.rotation ?? 0}
            opacity={item.opacity ?? 1}
            listening={false}
        >
            <Text
                width={item.width}
                height={item.height}
                text={item.text}
                fontFamily={item.fontFamily ?? 'Arial'}
                fontSize={item.fontSize}
                fontStyle={item.fontStyle ?? 'normal'}
                fill={item.color}
                align={item.align ?? 'center'}
                verticalAlign={item.verticalAlign ?? 'middle'}
                letterSpacing={item.letterSpacing ?? 0}
                wrap="word"
                listening={false}
            />
        </Group>
    );
}

/**
 * Render this before the interactive photo slots.
 */
export function TemplateBackgroundLayer({
    template,
}: BackgroundProps) {
    const [backgroundImage] = useImage(
        template.background.imageUrl ?? '',
        'anonymous',
    );

    return (
        <Layer>
            <Rect
                width={template.width}
                height={template.height}
                fill={
                    template.background.color ??
                    template.backgroundColor ??
                    '#FFFFFF'
                }
                listening={false}
            />

            {backgroundImage && (
                <KonvaImage
                    image={backgroundImage}
                    width={template.width}
                    height={template.height}
                    listening={false}
                />
            )}

            {template.background.pattern && (
                <PatternLayer
                    pattern={template.background.pattern}
                    width={template.width}
                    height={template.height}
                />
            )}
        </Layer>
    );
}

/**
 * Render this after the interactive photo slots.
 */
export function TemplateOverlayLayer({
    template,
}: OverlayProps) {
    return (
        <Layer>
            {template.stickers.map((sticker) => (
                <StickerItem
                    key={sticker.id}
                    sticker={sticker}
                />
            ))}

            {template.typography.map((item) => (
                <TypographyItem
                    key={item.id}
                    item={item}
                />
            ))}

            {template.category === 'polaroid' &&
                template.caption && (
                    <Text
                        x={30}
                        y={template.height - 115}
                        width={template.width - 60}
                        height={70}
                        text={template.caption}
                        fontSize={24}
                        fontStyle="bold"
                        fill="#31513A"
                        align="center"
                        verticalAlign="middle"
                        listening={false}
                    />
                )}
        </Layer>
    );
}

/**
 * Optional standalone renderer.
 *
 * Use the two named layer components separately when
 * integrating with the existing interactive PhotoCanvas.
 */
export default function Renderer({
    template,
}: BackgroundProps) {
    return (
        <>
            <TemplateBackgroundLayer template={template} />
            <TemplateOverlayLayer template={template} />
        </>
    );
}
