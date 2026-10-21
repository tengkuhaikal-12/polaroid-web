import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentController::returnMethod
 * @see app/Http/Controllers/PaymentController.php:284
 * @route '/payment/return'
 */
export const returnMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnMethod.url(options),
    method: 'get',
})

returnMethod.definition = {
    methods: ["get","head"],
    url: '/payment/return',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentController::returnMethod
 * @see app/Http/Controllers/PaymentController.php:284
 * @route '/payment/return'
 */
returnMethod.url = (options?: RouteQueryOptions) => {
    return returnMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::returnMethod
 * @see app/Http/Controllers/PaymentController.php:284
 * @route '/payment/return'
 */
returnMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentController::returnMethod
 * @see app/Http/Controllers/PaymentController.php:284
 * @route '/payment/return'
 */
returnMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: returnMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PaymentController::returnMethod
 * @see app/Http/Controllers/PaymentController.php:284
 * @route '/payment/return'
 */
    const returnMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: returnMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PaymentController::returnMethod
 * @see app/Http/Controllers/PaymentController.php:284
 * @route '/payment/return'
 */
        returnMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: returnMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PaymentController::returnMethod
 * @see app/Http/Controllers/PaymentController.php:284
 * @route '/payment/return'
 */
        returnMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: returnMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    returnMethod.form = returnMethodForm
/**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:324
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
 * @see app/Http/Controllers/PaymentController.php:324
 * @route '/payment/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:324
 * @route '/payment/callback'
 */
callback.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: callback.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:324
 * @route '/payment/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: callback.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentController::callback
 * @see app/Http/Controllers/PaymentController.php:324
 * @route '/payment/callback'
 */
        callbackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: callback.url(options),
            method: 'post',
        })
    
    callback.form = callbackForm
const payment = {
    return: Object.assign(returnMethod, returnMethod),
callback: Object.assign(callback, callback),
}

export default payment