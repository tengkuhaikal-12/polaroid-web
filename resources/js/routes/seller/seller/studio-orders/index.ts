import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Seller\StudioOrderController::productionStatus
 * @see app/Http/Controllers/Seller/StudioOrderController.php:155
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
 * @see app/Http/Controllers/Seller/StudioOrderController.php:155
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
 * @see app/Http/Controllers/Seller/StudioOrderController.php:155
 * @route '/seller/studio-orders/{order}/production-status'
 */
productionStatus.patch = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: productionStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Seller\StudioOrderController::productionStatus
 * @see app/Http/Controllers/Seller/StudioOrderController.php:155
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
 * @see app/Http/Controllers/Seller/StudioOrderController.php:155
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
    productionStatus: Object.assign(productionStatus, productionStatus),
}

export default studioOrders