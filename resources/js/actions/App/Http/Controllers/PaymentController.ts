import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentController::retry
 * @see app/Http/Controllers/PaymentController.php:163
 * @route '/orders/{order}/checkout'
 */
export const retry = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/orders/{order}/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::retry
 * @see app/Http/Controllers/PaymentController.php:163
 * @route '/orders/{order}/checkout'
 */
retry.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return retry.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::retry
 * @see app/Http/Controllers/PaymentController.php:163
 * @route '/orders/{order}/checkout'
 */
retry.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentController::retry
 * @see app/Http/Controllers/PaymentController.php:163
 * @route '/orders/{order}/checkout'
 */
    const retryForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentController::retry
 * @see app/Http/Controllers/PaymentController.php:163
 * @route '/orders/{order}/checkout'
 */
        retryForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, options),
            method: 'post',
        })
    
    retry.form = retryForm
/**
* @see \App\Http\Controllers\PaymentController::checkout
 * @see app/Http/Controllers/PaymentController.php:37
 * @route '/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::checkout
 * @see app/Http/Controllers/PaymentController.php:37
 * @route '/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::checkout
 * @see app/Http/Controllers/PaymentController.php:37
 * @route '/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentController::checkout
 * @see app/Http/Controllers/PaymentController.php:37
 * @route '/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentController::checkout
 * @see app/Http/Controllers/PaymentController.php:37
 * @route '/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\PaymentController::returnUrl
 * @see app/Http/Controllers/PaymentController.php:289
 * @route '/payment/return'
 */
export const returnUrl = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnUrl.url(options),
    method: 'get',
})

returnUrl.definition = {
    methods: ["get","head"],
    url: '/payment/return',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentController::returnUrl
 * @see app/Http/Controllers/PaymentController.php:289
 * @route '/payment/return'
 */
returnUrl.url = (options?: RouteQueryOptions) => {
    return returnUrl.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::returnUrl
 * @see app/Http/Controllers/PaymentController.php:289
 * @route '/payment/return'
 */
returnUrl.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnUrl.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentController::returnUrl
 * @see app/Http/Controllers/PaymentController.php:289
 * @route '/payment/return'
 */
returnUrl.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: returnUrl.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PaymentController::returnUrl
 * @see app/Http/Controllers/PaymentController.php:289
 * @route '/payment/return'
 */
    const returnUrlForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: returnUrl.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PaymentController::returnUrl
 * @see app/Http/Controllers/PaymentController.php:289
 * @route '/payment/return'
 */
        returnUrlForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: returnUrl.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PaymentController::returnUrl
 * @see app/Http/Controllers/PaymentController.php:289
 * @route '/payment/return'
 */
        returnUrlForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: returnUrl.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    returnUrl.form = returnUrlForm
/**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:329
 * @route '/payment/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

callback.definition = {
    methods: ["post"],
    url: '/payment/callback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:329
 * @route '/payment/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:329
 * @route '/payment/callback'
 */
callback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:329
 * @route '/payment/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: callback.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:329
 * @route '/payment/callback'
 */
        callbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: callback.url(options),
            method: 'post',
        })
    
    callback.form = callbackForm
const PaymentController = { retry, checkout, returnUrl, callback }

export default PaymentController