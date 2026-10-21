import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
const Controllerb6041c76e8e1cd791f8f89d035d48611 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'get',
})

Controllerb6041c76e8e1cd791f8f89d035d48611.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
Controllerb6041c76e8e1cd791f8f89d035d48611.url = (options?: RouteQueryOptions) => {
    return Controllerb6041c76e8e1cd791f8f89d035d48611.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
Controllerb6041c76e8e1cd791f8f89d035d48611.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
Controllerb6041c76e8e1cd791f8f89d035d48611.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
    const Controllerb6041c76e8e1cd791f8f89d035d48611Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerb6041c76e8e1cd791f8f89d035d48611.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
        Controllerb6041c76e8e1cd791f8f89d035d48611Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerb6041c76e8e1cd791f8f89d035d48611.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
        Controllerb6041c76e8e1cd791f8f89d035d48611Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerb6041c76e8e1cd791f8f89d035d48611.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerb6041c76e8e1cd791f8f89d035d48611.form = Controllerb6041c76e8e1cd791f8f89d035d48611Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
const Controllere9819db9819a1d19b38dd89a0c4218c4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'get',
})

Controllere9819db9819a1d19b38dd89a0c4218c4.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
Controllere9819db9819a1d19b38dd89a0c4218c4.url = (options?: RouteQueryOptions) => {
    return Controllere9819db9819a1d19b38dd89a0c4218c4.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
Controllere9819db9819a1d19b38dd89a0c4218c4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
Controllere9819db9819a1d19b38dd89a0c4218c4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
    const Controllere9819db9819a1d19b38dd89a0c4218c4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllere9819db9819a1d19b38dd89a0c4218c4.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
        Controllere9819db9819a1d19b38dd89a0c4218c4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllere9819db9819a1d19b38dd89a0c4218c4.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
        Controllere9819db9819a1d19b38dd89a0c4218c4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllere9819db9819a1d19b38dd89a0c4218c4.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllere9819db9819a1d19b38dd89a0c4218c4.form = Controllere9819db9819a1d19b38dd89a0c4218c4Form

/**
* Multiple routes resolve to \Inertia\Controller::Controller, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `Controller['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
const Controller = {
    '/login': Controllerb6041c76e8e1cd791f8f89d035d48611,
    '/register': Controllere9819db9819a1d19b38dd89a0c4218c4,
}

export default Controller