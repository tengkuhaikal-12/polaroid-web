<?php

namespace App\Services;

use DateTime;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Contract\Storage;
use Throwable;

class FirebaseStorageService
{
    public function __construct(
        protected Storage $storage
    ) {
    }

    /**
     * Check whether the configured bucket exists.
     */
    public function checkBucket(): bool
    {
        return $this->storage->getBucket()->exists();
    }

    /**
     * Upload a file and return its object path.
     * Store this path, not the signed URL, in the database.
     */
    public function upload(UploadedFile $file, string $path): string
    {
        $fileStream = null;

        try {
            $bucket = $this->storage->getBucket();

            $filename = uniqid('', true) . '_'
                . basename($file->getClientOriginalName());

            $fullPath = trim($path, '/') . '/' . $filename;

            $fileStream = fopen($file->getRealPath(), 'rb');

            if ($fileStream === false) {
                $fileStream = null;

                throw new \RuntimeException(
                    'Unable to open the uploaded file.'
                );
            }

            $bucket->upload($fileStream, [
                'name' => $fullPath,
                'metadata' => [
                    'contentType' => $file->getMimeType(),
                ],
            ]);

            return $fullPath;
        } catch (Throwable $e) {
            Log::error('Firebase upload failed.', [
                'path' => $path,
                'message' => $e->getMessage(),
            ]);

            throw $e;
        } finally {
            if (is_resource($fileStream)) {
                fclose($fileStream);
            }
        }
    }

    /**
     * Upload an existing stream and return its object path.
     */
    public function uploadStream(
        $stream,
        string $path,
        string $originalFilename
    ): string {
        try {
            if (!is_resource($stream)) {
                throw new \InvalidArgumentException(
                    'The supplied file stream is invalid.'
                );
            }

            $filename = basename($originalFilename);
            $fullPath = trim($path, '/') . '/' . $filename;

            $this->storage->getBucket()->upload($stream, [
                'name' => $fullPath,
            ]);

            return $fullPath;
        } catch (Throwable $e) {
            Log::error('Firebase stream upload failed.', [
                'message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Delete an object using its stored path.
     */
    public function delete(?string $path): bool
    {
        if (!$path) {
            return false;
        }

        try {
            $this->storage->getBucket()
                ->object($path)
                ->delete();

            return true;
        } catch (Throwable $e) {
            Log::warning('Firebase delete failed.', [
                'path' => $path,
                'message' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Generate a signed URL for displaying an image.
     *
     * The URL expires after seven days.
     */
    public function getUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        try {
            $object = $this->storage->getBucket()->object($path);

            if (!$object->exists()) {
                Log::warning('Firebase image object does not exist.', [
                    'path' => $path,
                ]);

                return null;
            }

            return $object->signedUrl(new DateTime('+7 days'));
        } catch (Throwable $e) {
            Log::error('Firebase URL generation failed.', [
                'path' => $path,
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
