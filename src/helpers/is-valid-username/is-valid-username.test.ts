import {isValidUsername} from "./is-valid-username";

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
        expect(isValidUsername(testCase.case)).toBe(testCase.result);
    });
});