import jsConvert from "js-convert-case"
/**
 * Recursively formats an object by removing unnecessary keys and converting XML attributes to object keys.
 * @param {Object} input - The object to format.
 * @param {Object} [obj={}] - The formatted object.
 * @param {String} subKey - When preforming recursive calls lets deeper calls know who the callee was.
 * @returns {Object} The formatted object.
 */
function formatter(input:any, obj:any = {}, subKey:string = "") {
    function handleTextKey() {
        const value:string = input["_text"];
        const title:string = obj?.["@title"];
        if (Object.keys(input).length === 1) {
            obj = value;
        } else if (title) {
            if (subKey === "smart-attributes") {
                obj = value;
            } else {
                obj[title] = value
                delete obj["@title"]
            }
        } else {
            obj["value"] = input["_text"];
        }
    }

    function handleAttributes(key:string) {
        let attributes = input[key];
        for (let attributeKey in attributes) {
            if (attributeKey === "title") {
                obj[`@${attributeKey}`] = attributes[attributeKey];
            } else {
                obj[`${attributeKey}`] = attributes[attributeKey];
            }
        }
    }

    function handleArray(key:string) {
        let items = input[key];
        obj[key] = items.map((item:any) =>
            typeof item === "object" ? formatter(item, {}, key) : item
        );
        if (subKey === "smart-parameters") {

            let res:any = {};
            for (let item of obj[key]) {
                Object
                    .entries(item)
                    .forEach(([k, v]) => {
                        res[k] = v
                    })
            }
            obj = res;
        }

    }

    function handleString(key:string) {
        obj[key] = input[key];
    }

    function handleObject(key:string) {
        obj[key] = formatter(input[key], {}, key);
    }

    for (let key of Object.keys(input)) {
        if (key === '_attributes') {
            handleAttributes(key)
        } else if (Array.isArray(input[key])) {
            handleArray(key);
        } else if (key === "_text") {
            handleTextKey()
        } else if (typeof input[key] === 'string') {
            handleString(key)
        } else if (typeof input[key] === 'object') {
            handleObject(key)
        }
    }

    return obj;
}

export default function jsonFormatter (input:any) {
    return jsConvert.toSnakeCase(formatter(input))
}

