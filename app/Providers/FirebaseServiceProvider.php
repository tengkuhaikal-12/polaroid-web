<?php

namespace App\Providers;

use App\Services\FirebaseStorageService;
use Illuminate\Support\Facades\Log;
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
                Log::warning(
                    'Firebase credentials are not configured.'
                );

                throw new \RuntimeException(
                    'Firebase credentials are missing. Check FIREBASE_CREDENTIALS in .env.'
                );
            }

            if (!is_file($credentials)) {
                throw new \RuntimeException(
                    "Firebase credentials file not found: {$credentials}"
                );
            }

            if (!$bucketName) {
                throw new \RuntimeException(
                    'Firebase storage bucket is missing. Check FIREBASE_STORAGE_BUCKET in .env.'
                );
            }

            $factory = (new Factory())
                ->withServiceAccount($credentials)
                ->withDefaultStorageBucket($bucketName);

            return $factory->createStorage();
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
