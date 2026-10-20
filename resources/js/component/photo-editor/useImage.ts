import useImage from 'use-image';

export function usePhotoImage(src: string) {
    const [image, status] = useImage(src || '', 'anonymous');

    return {
        image,
        status,
        isLoading: status === 'loading',
        isLoaded: status === 'loaded',
        isError: status === 'failed',
    };
}