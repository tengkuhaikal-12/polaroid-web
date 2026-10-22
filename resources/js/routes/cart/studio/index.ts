import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CartController::add
 * @see app/Http/Controllers/CartController.php:223
 * @route '/cart/add-studio'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

add.definition = {
    methods: ["post"],
    url: '/cart/add-studio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CartController::add
 * @see app/Http/Controllers/CartController.php:223
 * @route '/cart/add-studio'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::add
 * @see app/Http/Controllers/CartController.php:223
 * @route '/cart/add-studio'
 */
add.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CartController::add
 * @see app/Http/Controllers/CartController.php:223
 * @route '/cart/add-studio'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: add.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CartController::add
 * @see app/Http/Controllers/CartController.php:223
 * @route '/cart/add-studio'
 */
        addForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: add.url(options),
            method: 'post',
        })
    
    add.form = addForm
const studio = {
    add: Object.assign(add, add),
}

export default studio