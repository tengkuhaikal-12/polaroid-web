<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('studio_collections', function (Blueprint $table) {
            $table->integer('printing_quantity')->default(0)->after('order_id');
            $table->string('printing_style')->default('regular')->after('printing_quantity');
            $table->boolean('album_option')->default(false)->after('printing_style');
            $table->decimal('printing_price', 10, 2)->default(0.00)->after('album_option');
            $table->decimal('album_price', 10, 2)->default(0.00)->after('printing_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('studio_collections', function (Blueprint $table) {
            $table->dropColumn(['printing_quantity', 'printing_style', 'album_option', 'printing_price', 'album_price']);
        });
    }
};
