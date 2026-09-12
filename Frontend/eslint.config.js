import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Without this, no-unused-vars can't see that a JSX tag like <Icon />
      // references the `Icon` binding, and flags it as unused.
      'react/jsx-uses-vars': 'error',
      // This project fetches data with a plain useEffect + local loading
      // state across ~15 pages (React's own long-documented pattern). The
      // rule now flags that pattern outright, and it only fires on the
      // components the compiler manages to fully analyze — most of the
      // duplicate call sites go unflagged — so it isn't actionable without
      // migrating data fetching onto something like React Query. Revisit
      // if/when that migration happens.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
