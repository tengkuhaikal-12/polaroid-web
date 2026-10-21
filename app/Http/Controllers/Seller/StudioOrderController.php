<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use TCPDF;

class StudioOrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::query()
            ->whereHas('studioCollections')
            ->with([
                'customer:id,name,email',
                'studioCollections.photos',
            ])
            ->latest()
            ->paginate(20);

        $orders->getCollection()->each(function ($order) {
            $this->addPhotoUrls($order);
        });

        return Inertia::render('seller/Seller', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        abort_unless(
            $order->studioCollections()->exists(),
            404
        );

        $order->load([
            'customer:id,name,email',
            'studioCollections.photos',
        ]);

        $this->addPhotoUrls($order);

        return Inertia::render('seller/ShowIndividual', [
            'order' => $order,
        ]);
    }

    /**
     * Add browser-accessible URLs to uploaded photos.
     */
    private function addPhotoUrls(Order $order): void
    {
        $order->studioCollections->each(function ($collection) {
            $collection->photos->each(function ($photo) {
                $photo->setAttribute(
                    'image_url',
                    $photo->image_path
                    ? Storage::disk('public')->url(
                        $photo->image_path
                    )
                    : null
                );
            });
        });
    }

    public function approve(
        Order $order,
        Request $request
    ): RedirectResponse {
        DB::transaction(function () use ($order, $request) {
            $order = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($order->status !== 'pending_review') {
                throw ValidationException::withMessages([
                    'order' =>
                        'Only orders pending review can be approved.',
                ]);
            }

            $order->update([
                'status' => 'awaiting_payment',
                'approved_at' => now(),
                'seller_note' => $request->input('seller_note'),
            ]);

            $order->studioCollections()->update([
                'status' => 'approved',
                'approved_at' => now(),
                'seller_note' => $request->input('seller_note'),
            ]);
        });

        return back()->with(
            'success',
            'Order approved. The customer can now proceed to payment.'
        );
    }

    public function reject(
        Order $order,
        Request $request
    ): RedirectResponse {
        $validated = $request->validate([
            'seller_note' => ['required', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($order, $validated) {
            $order = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($order->status !== 'pending_review') {
                throw ValidationException::withMessages([
                    'order' =>
                        'Only orders pending review can be rejected.',
                ]);
            }

            $order->update([
                'status' => 'cancelled',
                'seller_note' => $validated['seller_note'],
            ]);

            $order->studioCollections()->update([
                'status' => 'rejected',
                'seller_note' => $validated['seller_note'],
            ]);
        });

        return back()->with('success', 'Print request rejected.');
    }

    public function updateProductionStatus(
        Order $order,
        Request $request
    ): RedirectResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:preparing,ready,completed',
            ],
        ]);

        if (!$order->payments()->where('status', 'paid')->exists()) {
            throw ValidationException::withMessages([
                'status' =>
                    'The order must be paid before production.',
            ]);
        }

        $allowedTransitions = [
            'paid' => ['preparing'],
            'preparing' => ['ready'],
            'ready' => ['completed'],
        ];

        $current = $order->status;
        $next = $validated['status'];

        if (
            !in_array(
                $next,
                $allowedTransitions[$current] ?? [],
                true
            )
        ) {
            throw ValidationException::withMessages([
                'status' => 'Invalid production status transition.',
            ]);
        }

        DB::transaction(function () use ($order, $next) {
            $lockedOrder = Order::query()
                ->whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedOrder->update([
                'status' => $next,
                'completed_at' => $next === 'completed'
                    ? now()
                    : null,
            ]);

            if ($next === 'completed') {
                $lockedOrder->studioCollections()->update([
                    'status' => 'completed',
                ]);
            }
        });

        return back()->with('success', 'Order status updated.');
    }

    public function downloadPrintPdf(Order $order)
    {
        abort_unless(
            $order->studioCollections()->exists(),
            404,
            'No print collection found.'
        );

        $order->load('studioCollections.photos');

        $photos = $order->studioCollections
            ->flatMap(fn($collection) => $collection->photos)
            ->sortBy('position')
            ->values();

        abort_if($photos->isEmpty(), 404, 'No photos found.');

        // A4 portrait dimensions in millimetres.
        $pageWidth = 210;
        $pageHeight = 297;

        // Each photo is exactly 56 x 88 mm.
        $photoWidth = 56;
        $photoHeight = 88;
        $gap = 2;

        $columns = 3;
        $rows = 3;
        $photosPerPage = $columns * $rows;

        $gridWidth = ($columns * $photoWidth)
            + (($columns - 1) * $gap);

        $gridHeight = ($rows * $photoHeight)
            + (($rows - 1) * $gap);

        $leftMargin = ($pageWidth - $gridWidth) / 2;
        $topMargin = ($pageHeight - $gridHeight) / 2;

        $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);

        $pdf->SetCreator(config('app.name'));
        $pdf->SetTitle("Print Order #{$order->id}");
        $pdf->SetMargins(0, 0, 0);
        $pdf->SetAutoPageBreak(false);
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->setJPEGQuality(100);

        $temporaryFiles = [];

        try {
            foreach (
                $photos->chunk($photosPerPage) as $pagePhotos
            ) {
                $pdf->AddPage('P', 'A4');

                foreach ($pagePhotos->values() as $index => $photo) {
                    $row = intdiv($index, $columns);
                    $column = $index % $columns;

                    $x = $leftMargin
                        + $column * ($photoWidth + $gap);

                    $y = $topMargin
                        + $row * ($photoHeight + $gap);

                    $relativePath = $photo->image_path;

                    abort_if(
                        !$relativePath,
                        422,
                        "Photo {$photo->id} has no image path."
                    );

                    // Resolve the actual file on Laravel's public disk.
                    $imagePath = Storage::disk('public')->path(
                        $relativePath
                    );

                    abort_unless(
                        is_file($imagePath),
                        404,
                        "Image file for photo {$photo->id} was not found: {$imagePath}"
                    );

                    $printImagePath = $imagePath;

                    /*
                     * Optional CMYK conversion.
                     *
                     * For accurate print colors, configure a suitable
                     * source RGB profile and destination printer CMYK
                     * profile. Setting the colorspace alone does not
                     * guarantee accurate color conversion.
                     */
                    if (extension_loaded('imagick')) {
                        $image = new \Imagick($imagePath);

                        try {
                            $image->setImageFormat('jpeg');
                            $image->setImageCompression(
                                \Imagick::COMPRESSION_JPEG
                            );
                            $image->setImageCompressionQuality(100);

                            $convertedPath = tempnam(
                                sys_get_temp_dir(),
                                'print-image-'
                            );

                            if ($convertedPath === false) {
                                throw new \RuntimeException(
                                    'Unable to create temporary image.'
                                );
                            }

                            $temporaryFiles[] = $convertedPath;

                            $image->writeImage($convertedPath);

                            $printImagePath = $convertedPath;
                        } finally {
                            $image->clear();
                            $image->destroy();
                        }
                    }

                    // Print at exact physical dimensions.
                    $pdf->Image(
                        $printImagePath,
                        $x,
                        $y,
                        $photoWidth,
                        $photoHeight,
                        '',
                        '',
                        '',
                        false,
                        300
                    );

                    // Thin cut border.
                    $pdf->SetDrawColor(180, 180, 180);
                    $pdf->SetLineWidth(0.15);
                    $pdf->Rect(
                        $x,
                        $y,
                        $photoWidth,
                        $photoHeight
                    );
                }
            }

            /*
             * IMPORTANT:
             * TCPDF's 'S' mode returns the PDF bytes as a string.
             * Send those bytes in the HTTP response.
             */
            $pdfContent = $pdf->Output('', 'S');

            abort_unless(
                is_string($pdfContent)
                && str_starts_with($pdfContent, '%PDF-'),
                500,
                'TCPDF failed to generate a valid PDF.'
            );

            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' =>
                    'attachment; filename="print-order-'
                    . $order->id
                    . '.pdf"',
                'Content-Length' => (string) strlen($pdfContent),
                'Cache-Control' => 'private, no-store',
            ]);
        } finally {
            foreach ($temporaryFiles as $file) {
                if (is_file($file)) {
                    @unlink($file);
                }
            }
        }
    }
}
