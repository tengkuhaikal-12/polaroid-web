import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
 * @see routes/web.php:23
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:23
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:23
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:23
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:23
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:23
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:23
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
 * @see routes/web.php:29
 * @route '/selfie'
 */
export const selfie = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: selfie.url(options),
    method: 'get',
})

selfie.definition = {
    methods: ["get","head"],
    url: '/selfie',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:29
 * @route '/selfie'
 */
selfie.url = (options?: RouteQueryOptions) => {
    return selfie.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:29
 * @route '/selfie'
 */
selfie.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: selfie.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:29
 * @route '/selfie'
 */
selfie.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: selfie.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:29
 * @route '/selfie'
 */
    const selfieForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: selfie.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:29
 * @route '/selfie'
 */
        selfieForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: selfie.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:29
 * @route '/selfie'
 */
        selfieForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: selfie.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    selfie.form = selfieForm
/**
* @see \App\Http\Controllers\PhotoEditorController::photoStudio
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
export const photoStudio = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: photoStudio.url(options),
    method: 'get',
})

photoStudio.definition = {
    methods: ["get","head"],
    url: '/photo-studio',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PhotoEditorController::photoStudio
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
photoStudio.url = (options?: RouteQueryOptions) => {
    return photoStudio.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoEditorController::photoStudio
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
photoStudio.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: photoStudio.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PhotoEditorController::photoStudio
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
photoStudio.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: photoStudio.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PhotoEditorController::photoStudio
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
    const photoStudioForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: photoStudio.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PhotoEditorController::photoStudio
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
        photoStudioForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: photoStudio.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PhotoEditorController::photoStudio
 * @see app/Http/Controllers/PhotoEditorController.php:10
 * @route '/photo-studio'
 */
        photoStudioForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: photoStudio.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    photoStudio.form = photoStudioForm
/**
 * @see routes/web.php:38
 * @route '/studio'
 */
export const studio = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studio.url(options),
    method: 'get',
})

studio.definition = {
    methods: ["get","head"],
    url: '/studio',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:38
 * @route '/studio'
 */
studio.url = (options?: RouteQueryOptions) => {
    return studio.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:38
 * @route '/studio'
 */
studio.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: studio.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:38
 * @route '/studio'
 */
studio.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: studio.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:38
 * @route '/studio'
 */
    const studioForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: studio.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:38
 * @route '/studio'
 */
        studioForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studio.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:38
 * @route '/studio'
 */
        studioForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: studio.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    studio.form = studioForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:59
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:59
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:59
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:59
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:59
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\CartController::cart
 * @see app/Http/Controllers/CartController.php:30
 * @route '/cart'
 */
export const cart = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cart.url(options),
    method: 'get',
})

cart.definition = {
    methods: ["get","head"],
    url: '/cart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CartController::cart
 * @see app/Http/Controllers/CartController.php:30
 * @route '/cart'
 */
cart.url = (options?: RouteQueryOptions) => {
    return cart.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::cart
 * @see app/Http/Controllers/CartController.php:30
 * @route '/cart'
 */
cart.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cart.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CartController::cart
 * @see app/Http/Controllers/CartController.php:30
 * @route '/cart'
 */
cart.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cart.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CartController::cart
 * @see app/Http/Controllers/CartController.php:30
 * @route '/cart'
 */
    const cartForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cart.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CartController::cart
 * @see app/Http/Controllers/CartController.php:30
 * @route '/cart'
 */
        cartForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cart.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CartController::cart
 * @see app/Http/Controllers/CartController.php:30
 * @route '/cart'
 */
        cartForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cart.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cart.form = cartForm
/**
 * @see routes/web.php:188
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:188
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:188
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:188
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:188
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:188
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:188
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm