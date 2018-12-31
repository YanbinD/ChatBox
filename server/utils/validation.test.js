const expect = require('expect'); 
const {isRealString} = require('./validation');

describe('isRealString', () => {
    it ('should reject non-string value', () => {
        const res = isRealString(98);
        expect(res).toBe(false);
    });
    it ('should reject string with only spaces', () => {
        const res = isRealString('     ');
        expect(res).toBe(false);
    });
    it ('should allow string with non space character', () => {
        const res = isRealString('adfads df a');
        expect(res).toBe(true);
    });
});