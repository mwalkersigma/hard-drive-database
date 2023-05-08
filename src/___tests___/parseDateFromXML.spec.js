import { parseDateFromXML } from "../modules/parseDateFromXML";
import {describe,it,expect} from "vitest"


describe('parseDate', () => {
    it('should parse a valid date string', () => {
        const input = '08/05/2023 16:30:45';
        const expected = new Date('2023-05-08T16:30:45');
        const result = parseDateFromXML(input);
        expect(result).toEqual(expected);
    });

    it('should handle single-digit day and month values', () => {
        const input = '01/01/2023 01:01:01';
        const expected = new Date('2023-01-01T01:01:01');
        const result = parseDateFromXML(input);
        expect(result).toEqual(expected);
    });

    it('should handle leading/trailing whitespace', () => {
        const input = '   08/05/2023 16:30:45   ';
        const expected = new Date('2023-05-08T16:30:45');
        const result = parseDateFromXML(input);
        expect(result).toEqual(expected);
    });
});
