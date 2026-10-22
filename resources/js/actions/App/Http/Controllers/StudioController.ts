import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StudioController::submitPrintRequest
 * @see app/Http/Controllers/StudioController.php:23
 * @route '/studio/print-requests'
 */
export const submitPrintRequest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitPrintRequest.url(options),
    method: 'post',
})

submitPrintRequest.definition = {
    methods: ["post"],
    url: '/studio/print-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StudioController::submitPrintRequest
 * @see app/Http/Controllers/StudioController.php:23
 * @route '/studio/print-requests'
 */
submitPrintRequest.url = (options?: RouteQueryOptions) => {
    return submitPrintRequest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudioController::submitPrintRequest
 * @see app/Http/Controllers/StudioController.php:23
 * @route '/studio/print-requests'
 */
submitPrintRequest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitPrintRequest.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StudioController::submitPrintRequest
 * @see app/Http/Controllers/StudioController.php:23
 * @route '/studio/print-requests'
 */
    const submitPrintRequestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitPrintRequest.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudioController::submitPrintRequest
 * @see app/Http/Controllers/StudioController.php:23
 * @route '/studio/print-requests'
 */
        submitPrintRequestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitPrintRequest.url(options),
            method: 'post',
        })
    
    submitPrintRequest.form = submitPrintRequestForm
const StudioController = { submitPrintRequest }

export default StudioController