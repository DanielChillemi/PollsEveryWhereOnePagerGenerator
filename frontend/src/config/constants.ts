// See /docs/ARCHITECTURE_PRINCIPLES.md for full architectural guidelines
export const APP_CONFIG = {
    docs: {
        architecturePrinciples: '/docs/ARCHITECTURE_PRINCIPLES.md'
    },
    security: {
        authTokenKey: 'auth_token',
        refreshTokenKey: 'refresh_token',
        tokenExpiryKey: 'token_expiry',
    },
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
        timeout: 5000,
    },
    testing: {
        coverageThreshold: 80,
    },
    ux: {
        menuItemLimit: 7, // Miller's Rule
        interactionDelay: 300, // ms
    }
};

// Feature flags for gradual rollout
export const FEATURE_FLAGS = {
    useNewAuthFlow: true,
    enableAnalytics: false,
    debugMode: import.meta.env.DEV,
};

// Error message constants
export const ERROR_MESSAGES = {
    networkError: 'Unable to connect to the server. Please check your internet connection.',
    authError: 'Authentication failed. Please login again.',
    validationError: 'Please check your input and try again.',
    serverError: 'An unexpected error occurred. Please try again later.',
};

// Validation constants
export const VALIDATION = {
    maxTitleLength: 100,
    minPasswordLength: 8,
    maxFileSize: 5 * 1024 * 1024, // 5MB
};

// Analytics events
export const ANALYTICS_EVENTS = {
    pageView: 'PAGE_VIEW',
    buttonClick: 'BUTTON_CLICK',
    formSubmit: 'FORM_SUBMIT',
    error: 'ERROR_OCCURRED',
};