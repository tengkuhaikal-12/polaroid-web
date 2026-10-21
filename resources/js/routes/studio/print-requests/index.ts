import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\StudioController::store
 * @see app/Http/Controllers/StudioController.php:17
 * @route '/studio/print-requests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/studio/print-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StudioController::store
 * @see app/Http/Controllers/StudioController.php:17
 * @route '/studio/print-requests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudioController::store
 * @see app/Http/Controllers/StudioController.php:17
 * @route '/studio/print-requests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StudioController::store
 * @see app/Http/Controllers/StudioController.php:17
 * @route '/studio/print-requests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudioController::store
 * @see app/Http/Controllers/StudioController.php:17
 * @route '/studio/print-requests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const printRequests = {
    store: Object.assign(store, store),
}

export default printRequests