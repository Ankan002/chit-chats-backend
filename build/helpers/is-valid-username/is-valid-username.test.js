"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_valid_username_1 = require("./is-valid-username");
const testCases = [
    {
        case: "ankanbhattacharya89_gal",
        result: false
    },
    {
        case: "Ankan002",
        result: true
    },
    {
        case: "ankan_gal_bhattacharya",
        result: true
    },
    {
        case: "an",
        result: false
    },
    {
        case: "ankanbhattacharya_GAL",
        result: true
    }
];
testCases.map((testCase) => {
    test(`Validate username ${testCase.case}`, () => {
        expect((0, is_valid_username_1.isValidUsername)(testCase.case)).toBe(testCase.result);
    });
});
