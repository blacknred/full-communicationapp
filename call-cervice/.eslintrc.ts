export default {
    "extends": "airbnb-base",
    "rules": {
        "indent": ["error", 4, { "ignoredNodes": ["JSXElement"] }],
        "object-curly-newline": "off",
        'no-console': 'off',
        "import/no-extraneous-dependencies": ["error", {
            "devDependencies": true,
            "optionalDependencies": false,
            "peerDependencies": false
        }]
    },
    "globals": {
        'describe': 1,
        'test': 1,
        'expect': 1,
    },
};