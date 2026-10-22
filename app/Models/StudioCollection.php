<?php

 namespace App\Models;

 use Illuminate\Database\Eloquent\Model;
 use Illuminate\Database\Eloquent\Relations\BelongsTo;
 use Illuminate\Database\Eloquent\Relations\HasMany;
 use App\Services\FirebaseStorageService;

 class StudioCollection extends Model
 {
     protected $fillable = [
         'user_id',
         'cart_item_id',
         'order_id',
         'status',
         'design_json',
         'preview_path',
         'print_file_path',
         'pdf_path',
         'pdf_generated_at',
         'submitted_at',
         'approved_at',
         'seller_note',
         'printing_quantity',
         'printing_style',
         'album_option',
         'printing_price',
         'album_price',
     ];

     protected function casts(): array
     {
         return [
             'design_json' => 'array',
             'pdf_generated_at' => 'datetime',
             'submitted_at' => 'datetime',
             'approved_at' => 'datetime',
             'printing_quantity' => 'integer',
             'album_option' => 'boolean',
             'printing_price' => 'decimal:2',
             'album_price' => 'decimal:2',
         ];
     }

     /**
      * Get the public URL for the studio collection preview.
      */
     public function getPreviewUrlAttribute(): string
     {
         if (!$this->preview_path) {
             return '';
         }

         // Legacy fallback
         if (str_contains($this->preview_path, 'studio/')) {
             return asset('storage/' . $this->preview_path);
         }

         return app(FirebaseStorageService::class)->getUrl($this->preview_path);
     }

     public function user(): BelongsTo
     {
         return $this->belongsTo(User::class);
     }

     public function cartItem(): BelongsTo
     {
         return $this->belongsTo(CartItem::class);
     }

     public function order(): BelongsTo
     {
         return $this->belongsTo(Order::class);
     }

     public function photos(): HasMany
     {
         return $this->hasMany(StudioPhoto::class)
             ->orderBy('position');
     }
 }
