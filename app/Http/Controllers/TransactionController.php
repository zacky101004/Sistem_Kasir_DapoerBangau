<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Menu;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TransactionController extends Controller
{
    // Transaksi: list, buat order, lihat detail, bayar
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user || !in_array($user->level_id, [2, 3])) {
            abort(403);
        }

        // paginate dengan page size besar agar menampilkan semua entri tanpa memotong
        $pageSize = 1000;

        $all = Transaction::with(['transaction_details', 'transaction_details.menu'])
                            ->latest()
                            ->filter(request(['year', 'month']))
                            ->paginate($pageSize);
        $today = Transaction::with(['transaction_details', 'transaction_details.menu'])
                            ->whereDate('created_at',Carbon::now())
                            ->latest()
                            ->filter(request(['year', 'month']))
                            ->paginate($pageSize);
        $thisMonth = Transaction::with(['transaction_details', 'transaction_details.menu'])
                            ->whereMonth('created_at',Carbon::now()->month)
                            ->latest()
                            ->filter(request(['year', 'month']))
                            ->paginate($pageSize);
    
        return response()->json([
            'all' => $all, 
            'today' => $today,
            'thisMonth' => $thisMonth
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    // GET /api/transactions/create -> data menu + meja unpaid
    public function create(Menu $menu)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 2) {
            abort(403);
        }

        $decorate = fn ($collection) => $collection->map(function ($item) {
            $item->picture_url = $item->picture ? url('/media/' . $item->picture) : null;
            return $item;
        });
        
        return response()->json([
            'makanan' => $decorate($menu->whereIn('category',["makanan","food","foods"])->latest()->get()),
            'minuman' => $decorate($menu->whereIn('category', ["minuman", "drink", "drinks"])->latest()->get()),
            'paket_komplit' => $decorate($menu->whereIn('category', ["paket_komplit", "dessert", "desserts", "pencuci_mulut"])->latest()->get()),
            'tables' => Transaction::select('no_table')->where('status','unpaid')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // POST /api/transactions
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 2) {
            abort(403);
        }

        $transaction = $request->validate([
            'no_table' => 'required',
            'total_transaction' => 'required' 
        ]);
        $transaction['user_id'] = auth()->user()->id;
        $transaction['total_payment'] = 0;
        $transaction['status'] = 'unpaid';
        $transaction['created_at'] = Carbon::now();
        $transaction['updated_at'] = Carbon::now();

        $id = Transaction::insertGetId($transaction);

        $transactionDetail = $request->validate([
            'menu_id' => 'required'
        ]);

        $menu_id = json_decode($request->menu_id);

        for ($i=0; $i < count($menu_id); $i++) {
            $transactionDetail['transaction_id'] = $id;
            $transactionDetail['menu_id'] = $menu_id[$i]->menu_id;
            $transactionDetail['qty'] = $menu_id[$i]->qty;
            $transactionDetail['price'] = $menu_id[$i]->price;
            TransactionDetail::create($transactionDetail);
        };

        return response()->json([
            'message' => 'New transaction successfully created',
            'transaction_id' => $id
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Http\Response
     */
    // GET /api/transactions/{transaction}
    public function show(Transaction $transaction)
    {
        $user = Auth::user();

        if (!$user || !in_array($user->level_id, [2, 3])) {
            abort(403);
        }
        
        return response()->json([
            'data' => $transaction->with(['transaction_details','transaction_details.menu','user'])->where('id', '=', $transaction->id)->get()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Http\Response
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Http\Response
     */
    // PUT /api/transactions/{transaction} -> bayar transaksi
    public function update(Request $request, Transaction $transaction)
    {
        $user = Auth::user();

        if (!$user || $user->level_id !== 2) {
            abort(403);
        }
        
        $validateddata = $request->validate([
            'total_transaction' => 'required|numeric',
            'total_payment' => 'required|numeric|gte:total_transaction'
        ]);

        $validateddata["total_payment"] = filter_var($request->total_payment, FILTER_SANITIZE_NUMBER_INT);
        $validateddata["status"] = 'paid';
      
        Transaction::where('id', $transaction->id)
                    ->update($validateddata);
        
        return response()->json([
            'message' => 'Transaction updated',
            'transaction' => Transaction::find($transaction->id)
        ]);
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Http\Response
     */
    public function destroy(Transaction $transaction)
    {
        //
    }

   
}



