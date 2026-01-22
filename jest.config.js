/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(t|j)sx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
                isolatedModules: true,
            },
        ],
    },
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!(query-string|@noble/hashes|@noble/curves|@streamr)/)',
    ],
    testEnvironment: './test/test-utils/env',
    collectCoverage: true,
    coverageProvider: 'v8',
    coverageReporters: ['text-summary', 'lcov'],
    coverageThreshold: {
        global: {
            lines: 15,
        },
    },
    testTimeout: 30000,
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!*.test.{ts,tsx}', '!*.stories.*'],
    coveragePathIgnorePatterns: [
        '<rootDir>/src/marketplace/components/deprecated',
        '<rootDir>/src/marketplace/modules/deprecated/',
        '/types/',
        '/tests/',
    ],
    moduleNameMapper: {
        '\\.svg$': '<rootDir>/test/test-utils/fileMock.ts',
        '\\.(css|md)$': 'identity-obj-proxy',
        '\\.png$': '<rootDir>/scripts/emptyObject',
        '\\~/config/(.*).toml$': '<rootDir>/test/test-config/$1.ts',
        '\\~/(.*)$': '<rootDir>/src/$1',
        '\\$testUtils/(.*)$': '<rootDir>/test/test-utils/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/test/test-utils/setupTests.ts'],
}
