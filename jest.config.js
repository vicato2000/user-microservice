// jest.config.js
export default {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setup.js'],
    testTimeout: 30000,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    roots: ['./tests'],
};
