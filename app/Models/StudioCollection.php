<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudioCollection extends Model
{
    protected $fillable = [
        'user_id',
        'cart_item_id',
        'order_id',
        'status',
        'pdf_path',
        'pdf_generated_at',
    ];

    protected function casts(): array
    {
        return [
            'pdf_generated_at' => 'datetime',
        ];
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