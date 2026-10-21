import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PhotoEditorController::index
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/photo-studio',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PhotoEditorController::index
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoEditorController::index
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PhotoEditorController::index
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PhotoEditorController::index
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PhotoEditorController::index
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PhotoEditorController::index
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
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
const PhotoEditorController = { index }

export default PhotoEditorController