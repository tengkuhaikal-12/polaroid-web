<?php

 namespace App\Console\Commands;

 use Illuminate\Console\Attributes\Description;
 use Illuminate\Console\Attributes\Signature;
 use Illuminate\Console\Command;
 use App\Models\Product;
 use App\Models\StudioPhoto;
 use App\Models\StudioCollection;
 use App\Services\FirebaseStorageService;
 use Illuminate\Support\Facades\Storage;
 use Illuminate\Support\Facades\DB;
 use Exception;

 #[Signature('app:migrate-local-images-to-firebase {--dry-run : Only simulate the migration}')]
 #[Description('Migrates existing local images to Firebase Storage')]
 class MigrateLocalImagesToFirebase extends Command
 {
     public function __construct()
     {
         parent::__construct();
         $this->firebaseStorage = app(FirebaseStorageService::class);
     }

     protected FirebaseStorageService $firebaseStorage;

     public function handle(): int
     {
         $this->info('Starting migration of local images to Firebase...');

         if ($this->option('dry-run')) {
             $this->warn('DRY RUN MODE: No files will be uploaded or database records updated.');
         }

         $totalMigrated = 0;
         $totalErrors = 0;

         // 1. Migrate Products
         $this->info('Migrating Products...');
         $products = Product::where('image', '!=', null)
             ->where('image', 'like', '/storage/%')
             ->get();

         foreach ($products as $product) {
             try {
                 $localPath = str_replace('/storage/', '', $product->image);

                 if ($this->option('dry-run')) {
                     $this->line("Simulating upload for Product {$product->id}: {$localPath}");
                     $totalMigrated++;
                     continue;
                 }

                 if (!Storage::disk('public')->exists($localPath)) {
                     $this->error("File not found: {$localPath}");
                     $totalErrors++;
                     continue;
                 }

                 $fileStream = Storage::disk('public')->readStream($localPath);
                 $firebasePath = $this->firebaseStorage->uploadStream(
                     $fileStream,
                     'products',
                     $localPath
                 );
                 fclose($fileStream);

                 $product->update(['image' => $firebasePath]);
                 $this->info("Migrated Product {$product->id}: {$firebasePath}");
                 $totalMigrated++;
             } catch (Exception $e) {
                 $this->error("Error migrating Product {$product->id}: " . $e->getMessage());
                 $totalErrors++;
             }
         }

         // 2. Migrate Studio Photos
         $this->info('Migrating Studio Photos...');
         $photos = StudioPhoto::where('image_path', '!=', null)
             ->where('image_path', 'like', 'studio-photos/%')
             ->get();

         foreach ($photos as $photo) {
             try {
                 $localPath = $photo->image_path;

                 if ($this->option('dry-run')) {
                     $this->line("Simulating upload for StudioPhoto {$photo->id}: {$localPath}");
                     $totalMigrated++;
                     continue;
                 }

                 if (!Storage::disk('public')->exists($localPath)) {
                     $this->error("File not found: {$localPath}");
                     $totalErrors++;
                     continue;
                 }

                 $fileStream = Storage::disk('public')->readStream($localPath);
                 $firebasePath = $this->firebaseStorage->uploadStream(
                     $fileStream,
                     'studio-photos',
                     $localPath
                 );
                 fclose($fileStream);

                 $photo->update(['image_path' => $firebasePath]);
                 $this->info("Migrated StudioPhoto {$photo->id}: {$firebasePath}");
                 $totalMigrated++;
             } catch (Exception $e) {
                 $this->error("Error migrating StudioPhoto {$photo->id}: " . $e->getMessage());
                 $totalErrors++;
             }
         }

         // 3. Migrate Studio Collection Previews and Print Files
         $this->info('Migrating Studio Collections...');
         $collections = StudioCollection::where(function($query) {
             $query->whereNotNull('preview_path')->where('preview_path', 'like', 'studio/%')
                  ->orWhereNotNull('print_file_path')->where('print_file_path', 'like', 'studio/%');
         })->get();

         foreach ($collections as $collection) {
             try {
                 if ($collection->preview_path && str_starts_with($collection->preview_path, 'studio/')) {
                     if ($this->option('dry-run')) {
                         $this->line("Simulating upload for Collection {$collection->id} preview: {$collection->preview_path}");
                     } else {
                         if (Storage::disk('public')->exists($collection->preview_path)) {
                             $fileStream = Storage::disk('public')->readStream($collection->preview_path);
                             $firebasePath = $this->firebaseStorage->uploadStream(
                                 $fileStream,
                                 'studio/previews',
                                 $collection->preview_path
                             );
                             fclose($fileStream);
                             $collection->preview_path = $firebasePath;
                         }
                     }
                 }

                 if ($collection->print_file_path && str_starts_with($collection->print_file_path, 'studio/')) {
                     if ($this->option('dry-run')) {
                         $this->line("Simulating upload for Collection {$collection->id} print file: {$collection->print_file_path}");
                     } else {
                         if (Storage::disk('public')->exists($collection->print_file_path)) {
                             $fileStream = Storage::disk('public')->readStream($collection->print_file_path);
                             $firebasePath = $this->firebaseStorage->uploadStream(
                                 $fileStream,
                                 'studio/print-files',
                                 $collection->print_file_path
                             );
                             fclose($fileStream);
                             $collection->print_file_path = $firebasePath;
                         }
                     }
                 }

                 if (!$this->option('dry-run')) {
                     $collection->save();
                 }
                 $totalMigrated++;
             } catch (Exception $e) {
                 $this->error("Error migrating Collection {$collection->id}: " . $e->getMessage());
                 $totalErrors++;
             }
         }

         $this->info('Migration completed.');
         $this->info("Total items migrated: {$totalMigrated}");
         $this->info("Total errors: {$totalErrors}");

         return self::SUCCESS;
     }
 }
