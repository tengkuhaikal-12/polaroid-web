<?php

 namespace App\Models;

 use Illuminate\Database\Eloquent\Model;
 use App\Services\FirebaseStorageService;

 class Product extends Model
 {
     protected $fillable = [
         'name',
         'sku',
         'price',
         'stock_quantity',
         'prints',
         'image',
         'color',
     ];

     protected function casts(): array
     {
         return [
             'price' => 'decimal:2',
             'stock_quantity' => 'integer',
         ];
     }

     /**
      * Get the public URL for the product image.
      */
     public function getImageUrlAttribute(): string
     {
         if (!$this->image) {
             return '';
         }

         // Check if the image is already a Firebase object path
         // (local paths typically start with /storage/)
         if (str_starts_with($this->image, '/storage/')) {
             // Fallback for legacy images: we will eventually migrate these
             return $this->image;
         }

         return app(FirebaseStorageService::class)->getUrl($this->image);
     }
 }
