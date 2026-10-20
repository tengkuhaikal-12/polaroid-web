<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CartItem extends Model
{
    protected $fillable = [
        'product_id',
        'quantity',
        'price',
        'options',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'options' => 'array',
        ];
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the Studio collection associated with this cart item.
     */
    public function studioCollection(): HasOne
    {
        return $this->hasOne(
            StudioCollection::class,
            'cart_item_id'
        );
    }
}
