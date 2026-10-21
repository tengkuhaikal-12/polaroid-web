import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Seller\StudioOrderController::index
 * @see app/Http/Controllers/Seller/StudioOrderController.php:16
 * @route '/seller/studio-orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/seller/studio-orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::index
 * @see app/Http/Controllers/Seller/StudioOrderController.php:16
 * @route '/seller/studio-orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::index
 * @see app/Http/Controllers/Seller/StudioOrderController.php:16
 * @route '/seller/studio-orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\StudioOrderController::index
 * @see app/Http/Controllers/Seller/StudioOrderController.php:16
 * @route '/seller/studio-orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\StudioOrderController::index
 * @see app/Http/Controllers/Seller/StudioOrderController.php:16
 * @route '/seller/studio-orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\StudioOrderController::index
 * @see app/Http/Controllers/Seller/StudioOrderController.php:16
 * @route '/seller/studio-orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\StudioOrderController::index
 * @see app/Http/Controllers/Seller/StudioOrderController.php:16
 * @route '/seller/studio-orders'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Seller\StudioOrderController::show
 * @see app/Http/Controllers/Seller/StudioOrderController.php:32
 * @route '/seller/studio-orders/{order}'
 */
export const show = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/seller/studio-orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::show
 * @see app/Http/Controllers/Seller/StudioOrderController.php:32
 * @route '/seller/studio-orders/{order}'
 */
show.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::show
 * @see app/Http/Controllers/Seller/StudioOrderController.php:32
 * @route '/seller/studio-orders/{order}'
 */
show.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\StudioOrderController::show
 * @see app/Http/Controllers/Seller/StudioOrderController.php:32
 * @route '/seller/studio-orders/{order}'
 */
show.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\StudioOrderController::show
 * @see app/Http/Controllers/Seller/StudioOrderController.php:32
 * @route '/seller/studio-orders/{order}'
 */
    const showForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\StudioOrderController::show
 * @see app/Http/Controllers/Seller/StudioOrderController.php:32
 * @route '/seller/studio-orders/{order}'
 */
        showForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\StudioOrderController::show
 * @see app/Http/Controllers/Seller/StudioOrderController.php:32
 * @route '/seller/studio-orders/{order}'
 */
        showForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Seller\StudioOrderController::approve
 * @see app/Http/Controllers/Seller/StudioOrderController.php:49
 * @route '/seller/studio-orders/{order}/approve'
 */
export const approve = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/seller/studio-orders/{order}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::approve
 * @see app/Http/Controllers/Seller/StudioOrderController.php:49
 * @route '/seller/studio-orders/{order}/approve'
 */
approve.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return approve.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::approve
 * @see app/Http/Controllers/Seller/StudioOrderController.php:49
 * @route '/seller/studio-orders/{order}/approve'
 */
approve.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\StudioOrderController::approve
 * @see app/Http/Controllers/Seller/StudioOrderController.php:49
 * @route '/seller/studio-orders/{order}/approve'
 */
    const approveForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\StudioOrderController::approve
 * @see app/Http/Controllers/Seller/StudioOrderController.php:49
 * @route '/seller/studio-orders/{order}/approve'
 */
        approveForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Seller\StudioOrderController::reject
 * @see app/Http/Controllers/Seller/StudioOrderController.php:84
 * @route '/seller/studio-orders/{order}/reject'
 */
export const reject = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/seller/studio-orders/{order}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::reject
 * @see app/Http/Controllers/Seller/StudioOrderController.php:84
 * @route '/seller/studio-orders/{order}/reject'
 */
reject.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return reject.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::reject
 * @see app/Http/Controllers/Seller/StudioOrderController.php:84
 * @route '/seller/studio-orders/{order}/reject'
 */
reject.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\StudioOrderController::reject
 * @see app/Http/Controllers/Seller/StudioOrderController.php:84
 * @route '/seller/studio-orders/{order}/reject'
 */
    const rejectForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\StudioOrderController::reject
 * @see app/Http/Controllers/Seller/StudioOrderController.php:84
 * @route '/seller/studio-orders/{order}/reject'
 */
        rejectForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\Seller\StudioOrderController::productionStatus
 * @see app/Http/Controllers/Seller/StudioOrderController.php:118
 * @route '/seller/studio-orders/{order}/production-status'
 */
export const productionStatus = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: productionStatus.url(args, options),
    method: 'patch',
})

productionStatus.definition = {
    methods: ["patch"],
    url: '/seller/studio-orders/{order}/production-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::productionStatus
 * @see app/Http/Controllers/Seller/StudioOrderController.php:118
 * @route '/seller/studio-orders/{order}/production-status'
 */
productionStatus.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return productionStatus.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\StudioOrderController::productionStatus
 * @see app/Http/Controllers/Seller/StudioOrderController.php:118
 * @route '/seller/studio-orders/{order}/production-status'
 */
productionStatus.patch = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: productionStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Seller\StudioOrderController::productionStatus
 * @see app/Http/Controllers/Seller/StudioOrderController.php:118
 * @route '/seller/studio-orders/{order}/production-status'
 */
    const productionStatusForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: productionStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\StudioOrderController::productionStatus
 * @see app/Http/Controllers/Seller/StudioOrderController.php:118
 * @route '/seller/studio-orders/{order}/production-status'
 */
        productionStatusForm.patch = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: productionStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    productionStatus.form = productionStatusForm
const studioOrders = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
productionStatus: Object.assign(productionStatus, productionStatus),
}

export default studioOrders