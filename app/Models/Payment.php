<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'cart_id',
        'order_id',
        'order_number',
        'amount',
        'status',
        'transaction_id',
        'callback_payload',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'callback_payload' => 'array',
        ];
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
