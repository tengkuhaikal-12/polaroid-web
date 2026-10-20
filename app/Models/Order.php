<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\StudioCollection;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'customer_id',
        'subtotal',
        'total',
        'billing_address_id',
        'shipping_address_id',
        'status',
        'payment_type',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function studioCollections(): HasMany
    {
        return $this->hasMany(StudioCollection::class);
    }
}
