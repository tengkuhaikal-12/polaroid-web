<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->restrictOnDelete();
            $table->string('order_number')->unique();
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending')->index();
            $table->string('transaction_id')->nullable()->index();
            $table->json('callback_payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
