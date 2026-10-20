
import {
    useCallback,
    useMemo,
} from 'react';

import type {
    DragEvent as ReactDragEvent,
    RefObject,
} from 'react';

import {
    Group,
    Image as KonvaImage,
    Layer,
    Rect,
    Stage,
    Text,
} from 'react-konva';

import type Konva from 'konva';

import type {
    PhotoAsset,
    PhotoPlacement,
    PhotoPlacements,
    PhotoSlot,
    PhotoTemplate,
} from './types';

import { usePhotoImage } from './useImage';

import {
    TemplateBackgroundLayer,
    TemplateOverlayLayer,
} from './Renderer';

interface Props {
    stageRef: RefObject<Konva.Stage | null>;
    template: PhotoTemplate;
    photos: PhotoAsset[];
    placements: PhotoPlacements;
    selectedSlotId: string | null;
    viewScale: number;

    onSelectSlot: (slotId: string) => void;

    onAssignPhoto: (
        slotId: string,
        photoId: string,
    ) => void;

    onUpdatePlacement: (
        slotId: string,
        placement: PhotoPlacement,
    ) => void;
}

interface SlotProps {
    slot: PhotoSlot;
    photo?: PhotoAsset;
    placement?: PhotoPlacement;
    selected: boolean;

    onSelect: () => void;

    onUpdatePlacement: (
        placement: PhotoPlacement,
    ) => void;
}

function EditablePhotoSlot({
    slot,
    photo,
    placement,
    selected,
    onSelect,
    onUpdatePlacement,
}: SlotProps) {
    const {
        x,
        y,
        width,
        height,
        rotation = 0,
        cornerRadius = 0,
        borderColor = '#FFFFFF',
        borderWidth = 2,
        borderPadding = 0,
        backgroundColor = '#FFFFFF',
    } = slot;

    const { image } = usePhotoImage(photo?.url ?? '');

    const imageScale = useMemo(() => {
        if (!image) return 1;

        const coverScale = Math.max(
            width / image.width,
            height / image.height,
        );

        return coverScale * (placement?.zoom ?? 1);
    }, [
        image,
        width,
        height,
        placement?.zoom,
    ]);

    const handleDragEnd = useCallback(
        (
            event: Konva.KonvaEventObject<DragEvent>,
        ) => {
            if (!image || !placement) return;

            const node = event.target;

            onUpdatePlacement({
                ...placement,
                offsetX: node.x() - width / 2,
                offsetY: node.y() - height / 2,
            });
        },
        [
            image,
            placement,
            width,
            height,
            onUpdatePlacement,
        ],
    );

    const framePadding = Math.max(0, borderPadding);
    const frameWidth = Math.max(0, borderWidth);

    return (
        <Group
            x={x}
            y={y}
            rotation={rotation}
            onClick={onSelect}
            onTap={onSelect}
        >
            {/* Frame backing, including the optional padding. */}
            <Rect
                x={-framePadding}
                y={-framePadding}
                width={width + framePadding * 2}
                height={height + framePadding * 2}
                fill={borderColor}
                cornerRadius={cornerRadius}
                listening={false}
            />

            {/* Clip photo content to the actual slot bounds. */}
            <Group
                clipX={0}
                clipY={0}
                clipWidth={width}
                clipHeight={height}
            >
                <Rect
                    width={width}
                    height={height}
                    fill={backgroundColor}
                    cornerRadius={cornerRadius}
                    listening={false}
                />

                {image && placement && (
                    <KonvaImage
                        image={image}
                        x={width / 2 + placement.offsetX}
                        y={height / 2 + placement.offsetY}
                        width={image.width * imageScale}
                        height={image.height * imageScale}
                        offsetX={image.width / 2}
                        offsetY={image.height / 2}
                        draggable
                        onClick={onSelect}
                        onTap={onSelect}
                        onDragStart={onSelect}
                        onDragEnd={handleDragEnd}
                    />
                )}

                {!image && (
                    <Group
                        x={width / 2}
                        y={height / 2}
                        listening={false}
                    >
                        <Text
                            x={-width / 2 + 8}
                            y={-14}
                            width={width - 16}
                            text="Drop photo here"
                            align="center"
                            fontSize={18}
                            fill="#68716A"
                        />
                    </Group>
                )}
            </Group>

            {/* Custom frame outline. */}
            {frameWidth > 0 && (
                <Rect
                    x={-framePadding}
                    y={-framePadding}
                    width={width + framePadding * 2}
                    height={height + framePadding * 2}
                    stroke={borderColor}
                    strokeWidth={frameWidth}
                    cornerRadius={cornerRadius}
                    listening={false}
                />
            )}

            {/* Selection indicator is an editing overlay. */}
            {selected && (
                <Rect
                    x={-framePadding - 3}
                    y={-framePadding - 3}
                    width={width + (framePadding + 3) * 2}
                    height={height + (framePadding + 3) * 2}
                    stroke="#31513A"
                    strokeWidth={3}
                    dash={[8, 5]}
                    listening={false}
                />
            )}
        </Group>
    );
}

export default function PhotoCanvas({
    stageRef,
    template,
    photos,
    placements,
    selectedSlotId,
    viewScale,
    onSelectSlot,
    onAssignPhoto,
    onUpdatePlacement,
}: Props) {
    const photoMap = useMemo(
        () => new Map(
            photos.map((photo) => [
                photo.id,
                photo,
            ]),
        ),
        [photos],
    );

    const handleDrop = useCallback(
        (event: ReactDragEvent<HTMLDivElement>) => {
            event.preventDefault();

            const photoId = event.dataTransfer.getData(
                'text/photo-id',
            );

            if (!photoId || !photoMap.has(photoId)) {
                return;
            }

            const stage = stageRef.current;

            if (!stage) return;

            const bounds =
                stage.container().getBoundingClientRect();

            const scale = Math.max(viewScale, 0.001);

            const pointerX =
                (event.clientX - bounds.left) / scale;

            const pointerY =
                (event.clientY - bounds.top) / scale;

            const slot = template.slots.find((item) => (
                pointerX >= item.x &&
                pointerX <= item.x + item.width &&
                pointerY >= item.y &&
                pointerY <= item.y + item.height
            ));

            if (!slot) return;

            onAssignPhoto(slot.id, photoId);
            onSelectSlot(slot.id);
        },
        [
            stageRef,
            photoMap,
            viewScale,
            template.slots,
            onAssignPhoto,
            onSelectSlot,
        ],
    );

    return (
        <div
            className="mx-auto"
            style={{
                width: template.width * viewScale,
                height: template.height * viewScale,
            }}
            onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={handleDrop}
        >
            <div
                style={{
                    width: template.width,
                    height: template.height,
                    transform: `scale(${viewScale})`,
                    transformOrigin: 'top left',
                }}
            >
                <Stage
                    ref={stageRef}
                    width={template.width}
                    height={template.height}
                    className="overflow-hidden rounded-sm shadow-xl"
                >
                    {/* 1. Background and pattern */}
                    <TemplateBackgroundLayer
                        template={template}
                    />

                    {/* 2. Interactive photo slots */}

                    <Layer>
                        {template.slots.map((slot) => {
                            const photoId = placements[slot.id]?.photoId;

                            const photo = photoId
                                ? photoMap.get(photoId)
                                : undefined;

                            return (
                                <EditablePhotoSlot
                                    key={slot.id}
                                    slot={slot}
                                    photo={photo}
                                    placement={placements[slot.id]}
                                    selected={selectedSlotId === slot.id}
                                    onSelect={() => {
                                        onSelectSlot(slot.id);
                                    }}
                                    onUpdatePlacement={(placement) => {
                                        onUpdatePlacement(slot.id, placement);
                                    }}
                                />
                            );
                        })}
                    </Layer>


                    {/* 3. Stickers and event typography */}
                    <TemplateOverlayLayer
                        template={template}
                    />
                </Stage>
            </div>
        </div>
    );
}
