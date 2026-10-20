<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function collection(): BelongsTo
    {
        return $this->belongsTo(
            StudioCollection::class,
            'studio_collection_id'
        );
    }
}
