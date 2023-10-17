export default {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleNameMapper: {
        // "jose/jwe/compact/decrypt": "<rootDir>/node_modules/jose/dist/node/cjs/jwe/compact/decrypt.js",
        // "jose/jwe/compact/encrypt": "<rootDir>/node_modules/jose/dist/node/cjs/jwe/compact/encrypt.js",
        // "jose/jwk/parse": "<rootDir>/node_modules/jose/dist/node/cjs/jwk/parse.js",
        "\\.(css|less|scss|sss|styl)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.(gif|ttf|eot|svg|png|webp)$": "<rootDir>/test.Jest/__mocks__/fileMock.js",
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
};
