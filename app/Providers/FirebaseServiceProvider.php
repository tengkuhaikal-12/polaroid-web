<?php

namespace App\Providers;

use App\Services\FirebaseStorageService;
use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Contract\Storage;
use Kreait\Firebase\Factory;

class FirebaseServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Storage::class, function () {
            $credentials = config('services.firebase.credentials');
            $bucketName = config('services.firebase.storage_bucket');

            if (!$credentials) {
                throw new \RuntimeException(
                    'Firebase credentials are not configured. Set FIREBASE_CREDENTIALS.'
                );
            }

            if (!is_file($credentials)) {
                throw new \RuntimeException(
                    "Firebase credentials file not found: {$credentials}"
                );
            }

            if (!$bucketName) {
                throw new \RuntimeException(
                    'Firebase storage bucket is not configured. Set FIREBASE_STORAGE_BUCKET.'
                );
            }

            return (new Factory())
                ->withServiceAccount($credentials)
                ->withDefaultStorageBucket($bucketName)
                ->createStorage();
        });

        $this->app->singleton(
            FirebaseStorageService::class,
            function ($app) {
                return new FirebaseStorageService(
                    $app->make(Storage::class)
                );
            }
        );
    }

    public function boot(): void
    {
        //
    }
}
