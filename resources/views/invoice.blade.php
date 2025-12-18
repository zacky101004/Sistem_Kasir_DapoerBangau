<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $data->id }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: 'Inter', 'Roboto', system-ui, -apple-system, sans-serif;
            background: #ffffff;
            color: #111827;
        }
        .invoice {
            max-width: 920px;
            margin: 32px auto;
            padding: 0 24px 48px;
        }
        .header {
            text-align: center;
            margin-bottom: 28px;
        }
        .header h1 {
            margin: 0 0 6px;
            font-size: 26px;
            letter-spacing: 0.5px;
        }
        .header p {
            margin: 2px 0;
            color: #6b7280;
            font-size: 14px;
        }
        .meta {
            margin-bottom: 18px;
            line-height: 1.6;
            color: #1f2937;
        }
        .meta span {
            display: inline-block;
            min-width: 80px;
            font-weight: 600;
        }
        .items {
            border-top: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
        }
        .item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .item:last-child {
            border-bottom: none;
        }
        .item-name {
            font-weight: 600;
        }
        .item-meta {
            color: #6b7280;
            font-size: 13px;
            margin-top: 4px;
        }
        .item-price {
            font-weight: 600;
        }
        .summary {
            margin-top: 24px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: flex-end;
        }
        .summary-row {
            display: flex;
            gap: 12px;
            min-width: 280px;
            justify-content: space-between;
            font-weight: 600;
        }
        .summary-row span:first-child {
            color: #6b7280;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <h1>DapoerBangau</h1>
            <p>Jl M. H. Thamrin, No. 9</p>
            <p>221-691-6080</p>
        </div>

        <div class="meta">
            <div><span>Cashier</span>: {{ $data->user->name ?? '-' }}</div>
            <div><span>Table</span>: {{ $data->no_table }}</div>
            <div><span>Date</span>: {{ $data->created_at->format('M d, Y h:i A') }}</div>
        </div>

        <div class="items">
            @foreach($data->transaction_details as $detail)
                <div class="item">
                    <div>
                        <div class="item-name">{{ $detail->menu->name ?? '-' }}</div>
                        <div class="item-meta">{{ $detail->qty }} x {{ number_format($detail->price, 0, ',', '.') }}</div>
                    </div>
                    <div class="item-price">{{ number_format($detail->qty * $detail->price, 0, ',', '.') }}</div>
                </div>
            @endforeach
        </div>

        <div class="summary">
            <div class="summary-row">
                <span>SubTotal :</span>
                <span>{{ number_format($data->total_transaction, 0, ',', '.') }}</span>
            </div>
            <div class="summary-row">
                <span>Total :</span>
                <span>{{ number_format($data->total_transaction, 0, ',', '.') }}</span>
            </div>
            <div class="summary-row">
                <span>Total Payment :</span>
                <span>{{ number_format($data->total_payment, 0, ',', '.') }}</span>
            </div>
            <div class="summary-row">
                <span>Change :</span>
                <span>{{ number_format(($data->total_payment ?? 0) - ($data->total_transaction ?? 0), 0, ',', '.') }}</span>
            </div>
        </div>
    </div>
</body>
</html>
