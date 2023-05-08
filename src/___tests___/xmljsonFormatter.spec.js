import jsonFormatter from '../modules/xmljsonFormatter.ts';
import {describe,it,expect} from "vitest"
describe('jsonFormatter', () => {
    it('should handle a simple object with text value', () => {
        const input = {
            "_text": "foo"
        };
        const expected = "foo"
        expect(jsonFormatter(input)).toEqual(expected);
    });

    it('should handle an object with attributes', () => {
        const input = {
            "_attributes": {
                "foo": "bar"
            }
        };
        const expected = {
            "foo": "bar"
        };
        expect(jsonFormatter(input)).toEqual(expected);
    });

    it('should handle an object with attributes and text value', () => {
        const input = {
            "_attributes": {
                "foo": "bar"
            },
            "_text": "baz"
        };
        const expected = {
            "foo": "bar",
            "value": "baz"
        };
        expect(jsonFormatter(input)).toEqual(expected);
    });

    it('should handle an object with a single child object', () => {
        const input = {
            "foo": {
                "_text": "bar"
            }
        };
        const expected = {
            "foo": "bar"
        };
        expect(jsonFormatter(input)).toEqual(expected);
    });

    it('should handle an object with multiple child objects', () => {
        const input = {
            "foo": {
                "_text": "bar"
            },
            "baz": {
                "_text": "qux"
            }
        };
        const expected = {
            "foo": "bar",
            "baz": "qux"
        };
        expect(jsonFormatter(input)).toEqual(expected);
    });

    it('should handle an object with an array', () => {
        const input = {
            "foo": [
                {
                    "_text": "bar"
                },
                {
                    "_text": "baz"
                }
            ]
        };
        const expected = {
            "foo": ["bar","baz"]
        };
        expect(jsonFormatter(input)).toEqual(expected);
    });

});