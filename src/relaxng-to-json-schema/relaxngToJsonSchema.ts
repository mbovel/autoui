import { ensure } from "../model/utils";
import { JSONSchema7 } from "json-schema";

const AUNS = "https://github.com/mbovel/autoui";
const RGNG = "http://relaxng.org/ns/structure/1.0";

export function relaxngToJsonSchema(schemaString: string): JSONSchema7 {
	const fullSchema = parseXML(schemaString);
	return convert(fullSchema.children[0], fullSchema)[1];
}

let noNameCounter = 1;

function convert(el: Element, root: Document): [string, JSONSchema7] {
	let schema: JSONSchema7;
	switch (el.tagName) {
		case "zeroOrMore":
			schema = { type: "array", items: convertChildren(el.children, root) };
			break;
		case "oneOrMore":
			schema = { type: "array", items: convertChildren(el.children, root), minItems: 1 };
			break;
		case "optional":
			return convert(el.children[0], root);
		case "element":
		case "attribute":
		case "group":
			schema = convertChildren(el.children, root);
			break;
		case "choice":
			const choices = [...el.children].map(c => convert(c, root)[1]);
			schema = {
				properties: { "autoui:choice": { type: "number", enum: [...choices.keys()] } },
				oneOf: choices
			};
			break;
		case "grammar":
			schema = convertChildren(find(root, "start").children, root);
			break;
		case "value":
			schema = { type: "string", const: el.textContent };
			break;
		case "data":
			schema = { type: "string" };
			break;
		case "text":
			schema = { type: "string" };
			break;
		case "ref":
			const name = el.getAttribute("name");
			ensure(name, "Missing name attribute");
			const defineEl = find(root, `define[name='${name}']`);
			schema = convertChildren(defineEl.children, root);
			break;
		default:
			throw new Error("Unknown tag name: " + el.tagName);
	}
	const key =
		el.getAttribute("name") ?? el.getAttributeNS(AUNS, "key") ?? `noName${++noNameCounter}`;
	schema.title = el.getAttribute("name") ?? el.getAttributeNS(AUNS, "title") ?? undefined;
	return [key, schema];
}

function convertChildren(children: HTMLCollection, root: Document): JSONSchema7 {
	if (children.length === 1) return convert(children[0], root)[1];
	return { type: "object", properties: Object.fromEntries(convertAll(children, root)) };
}

function convertAll(els: HTMLCollection, root: Document) {
	return [...els].filter(isRelevant).map(c => convert(c, root));
}

/*function xpathNsResolver(prefix: string | null): string | null {
	var ns: { [key: string]: string | undefined } = {
		rng: RGNG
	};
	return (prefix && ns[prefix]) ?? null;
}*/

function find(root: Document, query: string) {
	// Does not work in JSDom
	/*const result = root
		.evaluate(xpath, context, xpathNsResolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE)
		.iterateNext();*/
	const result = root.querySelector(query);
	ensure(result, "XPath query " + query + " returned no result");
	ensure(isElement(result), "XPath query " + query + " returned a non-element node");
	return result;
}

const nodeNames = new Set([
	"zeroOrMore",
	"oneOrMore",
	"optional",
	"element",
	"attribute",
	"group",
	"choice",
	"grammar",
	"value",
	"data",
	"text",
	"ref"
]);

function isRelevant(node: Element) {
	return node.namespaceURI === RGNG && nodeNames.has(node.tagName);
}

function isElement(node: Node): node is Element {
	return node.nodeType === Node.ELEMENT_NODE;
}

function parseXML(string: string) {
	return new DOMParser().parseFromString(string, "text/xml");
}
