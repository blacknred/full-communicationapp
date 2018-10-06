module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "indent": ["error", 4, { "ignoredNodes": ["JSXElement"] }],
        "object-curly-newline": "off",
        'no-console': 'off',
    },
    "globals": {
        'describe': 1,
        'test': 1,
        'expect': 1,
    },
};