
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadProductImage(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file.');
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error('The image must be 5 MB or smaller.');
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeExtension = /^[a-z0-9]+$/.test(extension) ? extension : 'jpg';
    const fileName = `${crypto.randomUUID()}.${safeExtension}`;
    const imageRef = ref(storage, `polaroidku/products/${fileName}`);

    await uploadBytes(imageRef, file, {
        contentType: file.type,
    });

    return getDownloadURL(imageRef);
}
