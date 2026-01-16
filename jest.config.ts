module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: 'src',
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/$1',
      '^@prisma/client$': '<rootDir>/prisma/$1',
    },
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    testRegex: '.*\\.spec\\.ts$', 
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
};