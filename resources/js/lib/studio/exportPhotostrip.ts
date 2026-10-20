import type {
    PhotoboothState,
    PhotoFilter,
    PatternType,
} from '../../types/photobooth';

const FILTERS: Record<PhotoFilter, string> = {
    normal: 'none',
    grayscale: 'grayscale(1)',
    sepia: 'sepia(1)',
    vintage: 'sepia(.35) saturate(.75) contrast(.9)',
};

async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();

        // Same-origin images work without CORS configuration.
        // Remote image servers must permit cross-origin access.
        image.crossOrigin = 'anonymous';

        image.onload = () => resolve(image);
        image.onerror = () => reject(
            new Error(`Unable to load image: ${src}`),
        );

        image.src = src;
    });
}

function drawCover(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
) {
    const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight,
    );

    const sourceWidth = width / scale;
    const sourceHeight = height / scale;

    const sourceX = (image.naturalWidth - sourceWidth) / 2;
    const sourceY = (image.naturalHeight - sourceHeight) / 2;

    ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        x,
        y,
        width,
        height,
    );
}

function drawPattern(
    ctx: CanvasRenderingContext2D,
    pattern: PatternType,
    width: number,
    height: number,
) {
    if (pattern === 'solid') return;

    ctx.save();

    if (pattern === 'plaid') {
        ctx.strokeStyle = 'rgba(49,81,58,.13)';
        ctx.lineWidth = 3;

        for (let x = 0; x < width; x += 63) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y < height; y += 63) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    if (pattern === 'checkerboard') {
        const size = Math.max(16, width / 18);

        ctx.fillStyle = 'rgba(49,81,58,.12)';

        for (let y = 0; y < height; y += size) {
            for (let x = 0; x < width; x += size) {
                if (
                    (Math.floor(x / size) +
                        Math.floor(y / size)) % 2 === 0
                ) {
                    ctx.fillRect(x, y, size, size);
                }
            }
        }
    }

    if (pattern === 'sunburst') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.hypot(width, height);

        ctx.fillStyle = 'rgba(255,255,255,.30)';

        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 9) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(
                centerX,
                centerY,
                radius,
                angle,
                angle + Math.PI / 18,
            );
            ctx.closePath();
            ctx.fill();
        }
    }

    ctx.restore();
}

export async function exportPhotostrip(
    state: PhotoboothState,
    scale = 2,
): Promise<Blob> {
    const { selectedTemplate: template } = state;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(template.width * scale);
    canvas.height = Math.round(template.height * scale);

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Unable to initialize export canvas.');
    }

    ctx.scale(scale, scale);

    // 1. Background
    ctx.fillStyle = state.backgroundColor;
    ctx.fillRect(0, 0, template.width, template.height);

    // 2. Background pattern
    drawPattern(
        ctx,
        state.selectedPattern,
        template.width,
        template.height,
    );

    // 3. Photo slots
    for (const slot of template.slots) {
        const x = (slot.x / 100) * template.width;
        const y = (slot.y / 100) * template.height;
        const width = (slot.width / 100) * template.width;
        const height = (slot.height / 100) * template.height;

        // White frame behind each photo
        ctx.fillStyle = template.frameColor;
        ctx.fillRect(x, y, width, height);

        const photo = state.photos[slot.id];

        if (!photo) continue;

        const image = await loadImage(photo.src);

        ctx.save();

        // Keep the photo clipped to its slot.
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();

        ctx.filter = FILTERS[state.selectedFilter];

        drawCover(ctx, image, x, y, width, height);

        ctx.restore();
    }

    // 4. Stickers
    for (const sticker of state.stickers) {
        const image = await loadImage(sticker.src);

        const x = (sticker.x / 100) * template.width;
        const y = (sticker.y / 100) * template.height;
        const width = (sticker.width / 100) * template.width;
        const height = (sticker.height / 100) * template.height;

        ctx.save();

        // The stored position is the top-left corner.
        ctx.translate(x + width / 2, y + height / 2);

        ctx.rotate((sticker.rotation * Math.PI) / 180);

        ctx.drawImage(
            image,
            -width / 2,
            -height / 2,
            width,
            height,
        );

        ctx.restore();
    }

    // 5. Encode the finished image.
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('PNG encoding failed.'));
            },
            'image/png',
        );
    });
}