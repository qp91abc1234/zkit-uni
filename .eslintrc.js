module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true // setup script 宏处理
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'airbnb-base',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'lines-between-class-members': 'off',
    'no-undef': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'prefer-destructuring': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-plusplus': 'off',
    'no-use-before-define': 'off',
    'no-unused-vars': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    camelcase: 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'vue/multi-word-component-names': 'off',
    'no-loop-func': 'off',
    'no-unused-expressions': 'off'
  }
}
