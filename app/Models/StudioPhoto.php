<?php

 namespace App\Models;

 use Illuminate\Database\Eloquent\Model;
 use Illuminate\Database\Eloquent\Relations\BelongsTo;
 use App\Services\FirebaseStorageService;

 class StudioPhoto extends Model
 {
     protected $fillable = [
         'studio_collection_id',
         'position',
         'image_path',
         'placement',
         'is_selected',
     ];

     protected function casts(): array
     {
         return [
             'position' => 'integer',
             'placement' => 'array',
             'is_selected' => 'boolean',
         ];
     }

     /**
      * Get the public URL for the studio photo.
      */
     public function getImageUrlAttribute(): string
     {
         if (!$this->image_path) {
             return '';
         }

         // If it's a legacy local path, return it as is (or handle migration fallback)
         if (str_contains($this->image_path, 'studio-photos/')) {
             return asset('storage/' . $this->image_path);
         }

         return app(FirebaseStorageService::class)->getUrl($this->image_path);
     }

     public function collection(): BelongsTo
     {
         return $this->belongsTo(
             StudioCollection::class,
             'studio_collection_id'
         );
     }
 }
