module.exports = {
    "extends": "airbnb",
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "indent": ["error", 4, { "ignoredNodes": ["JSXElement"] }],
        "react/jsx-indent": ["error", 4],
        
        "implicit-arrow-linebreak": [0, "as-beside"],
        "react/prefer-stateless-function": [0, { "ignorePureComponents": true }]
    },
    // "env": {
    //     "browser": true,
    //     "node": true
    // },
    "globals": {
        "document": 1
    }
};