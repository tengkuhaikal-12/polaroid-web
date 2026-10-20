<?php

namespace App\Services;

use InvalidArgumentException;

class StudioPricingService
{
    private const PRICING_TABLE = [
        'regular' => 3.50,
        'borderless' => 4.50,
        'designed_border' => 5.50,
    ];

    private const ALBUM_PRICE = 6.00;

    public function validateQuantity(int $quantity): void
    {
        if ($quantity < 0 || $quantity > 144) {
            throw new InvalidArgumentException(
                'Quantity must be between 0 and 144.'
            );
        }

        if ($quantity !== 0 && $quantity % 9 !== 0) {
            throw new InvalidArgumentException(
                'Printing quantity must be in multiples of 9.'
            );
        }
    }

    public function calculatePrintingPrice(
        int $quantity,
        string $style
    ): float {
        $this->validateQuantity($quantity);

        if (!array_key_exists($style, self::PRICING_TABLE)) {
            throw new InvalidArgumentException(
                "Invalid printing style: {$style}."
            );
        }

        return round(
            ($quantity / 9) * self::PRICING_TABLE[$style],
            2
        );
    }

    public function getAlbumPrice(): float
    {
        return self::ALBUM_PRICE;
    }

    public function calculateTotal(
        int $quantity,
        string $style,
        bool $hasAlbum
    ): float {
        return round(
            $this->calculatePrintingPrice($quantity, $style)
            + ($hasAlbum ? self::ALBUM_PRICE : 0),
            2
        );
    }
}
