```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>PolaroidKU Receipt</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 35px 15px;
            font-family: DejaVu Sans, sans-serif;
            background: #FFF8EA;
            color: #31513A;
            font-size: 12px;
            line-height: 1.6;
        }

        .receipt {
            max-width: 720px;
            margin: 0 auto;
            padding: 35px;
            background: #FFFFFF;
            border: 3px solid #31513A;
            border-radius: 20px;
            box-shadow: 8px 8px 0 #31513A;
        }

        .header {
            text-align: center;
            padding-bottom: 25px;
            border-bottom: 2px dashed #9CCB83;
        }

        .brand-label {
            display: inline-block;
            padding: 7px 16px;
            margin-bottom: 12px;
            background: #FFF0A8;
            border: 2px solid #31513A;
            border-radius: 30px;
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        h1 {
            margin: 0;
            font-size: 30px;
            font-weight: bold;
            letter-spacing: -1px;
        }

        .pink {
            color: #F26B82;
        }

        .subtitle {
            margin: 8px 0 0;
            color: #55725D;
            font-size: 11px;
            font-weight: bold;
        }

        .order-info {
            width: 100%;
            margin: 25px 0;
            padding: 18px;
            background: #CDE8B5;
            border: 2px solid #31513A;
            border-radius: 12px;
        }

        .order-info td {
            padding: 4px 0;
        }

        .label {
            font-weight: bold;
        }

        .right {
            text-align: right;
        }

        .status {
            display: inline-block;
            padding: 3px 9px;
            background: #FFF0A8;
            border: 1px solid #31513A;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
        }

        .section-title {
            margin: 25px 0 12px;
            font-size: 17px;
            font-weight: bold;
        }

        table.items {
            width: 100%;
            border-collapse: collapse;
        }

        .items th {
            padding: 12px 8px;
            background: #31513A;
            color: #FFFFFF;
            text-align: left;
            font-size: 10px;
        }

        .items th:first-child {
            border-radius: 8px 0 0 8px;
        }

        .items th:last-child {
            border-radius: 0 8px 8px 0;
        }

        .items td {
            padding: 13px 8px;
            border-bottom: 1px solid #DDE7D7;
            vertical-align: top;
        }

        .items tbody tr:nth-child(even) {
            background: #FFF8EA;
        }

        .items .right {
            text-align: right;
        }

        .totals {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }

        .totals td {
            padding: 7px 5px;
        }

        .grand-total td {
            padding: 14px 12px;
            background: #F26B82;
            color: #FFFFFF;
            border: 2px solid #31513A;
            font-size: 16px;
            font-weight: bold;
        }

        .grand-total td:first-child {
            border-radius: 10px 0 0 10px;
        }

        .grand-total td:last-child {
            border-radius: 0 10px 10px 0;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px dashed #9CCB83;
            text-align: center;
            color: #55725D;
        }

        .footer p {
            margin: 5px 0;
        }

        .footer-heart {
            color: #F26B82;
            font-size: 20px;
            font-weight: bold;
        }

        @media print {
            body {
                padding: 0;
                background: #FFFFFF;
            }

            .receipt {
                max-width: 100%;
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>

<body>
    <div class="receipt">

        <!-- HEADER -->
        <div class="header">
            <div class="brand-label">
                ✨ YOUR MEMORIES, BUT CUTER ✨
            </div>

            <h1>
                Polaroid<span class="pink">KU</span> ♡
            </h1>

            <p class="subtitle">
                MADE WITH LOVE, JUST FOR YOU!
            </p>
        </div>

        <!-- ORDER INFORMATION -->
        <table class="order-info">
            <tr>
                <td class="label">Order Number</td>
                <td class="right">
                    #{{ $order->id }}
                </td>
            </tr>

            <tr>
                <td class="label">Order Date</td>
                <td class="right">
                    {{ $order->created_at->format('d M Y') }}
                </td>
            </tr>

            <tr>
                <td class="label">Customer</td>
                <td class="right">
                    {{ $order->customer->name }}
                </td>
            </tr>

            <tr>
                <td class="label">Status</td>
                <td class="right">
                    <span class="status">
                        {{ strtoupper($order->status) }}
                    </span>
                </td>
            </tr>
        </table>

        <!-- ORDER ITEMS -->
        <h2 class="section-title">
            ♡ Your Cute Little Order
        </h2>

        <table class="items">
            <thead>
                <tr>
                    <th>ITEM</th>
                    <th class="right">QTY</th>
                    <th class="right">PRICE</th>
                    <th class="right">TOTAL</th>
                </tr>
            </thead>

            <tbody>
                @foreach ($order->items as $item)
                    <tr>
                        <td>
                            <strong>{{ $item->name }}</strong>
                        </td>

                        <td class="right">
                            {{ $item->quantity }}
                        </td>

                        <td class="right">
                            RM {{ number_format($item->price, 2) }}
                        </td>

                        <td class="right">
                            RM {{ number_format($item->price * $item->quantity, 2) }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- TOTALS -->
        <table class="totals">
            <tr>
                <td>Subtotal</td>
                <td class="right">
                    RM {{ number_format($order->subtotal, 2) }}
                </td>
            </tr>

            <tr class="grand-total">
                <td>♡ TOTAL</td>
                <td class="right">
                    RM {{ number_format($order->total, 2) }}
                </td>
            </tr>
        </table>

        <!-- FOOTER -->
        <div class="footer">
            <div class="footer-heart">♡</div>

            <p><strong>Thank you for shopping with PolaroidKU!</strong></p>

            <p>Your favourite memories, printed with love.</p>

            <p>🍓 Capture it. Print it. Keep it forever. ✨</p>
        </div>

    </div>
</body>
</html>
```