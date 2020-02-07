import {
	JsonSchemaDeriver,
	getInitialData,
	storeToProps,
	stateFromJson,
	defaultComponents
} from "../../../src";
import { JSONSchema7 } from "json-schema";

describe("JsonSchemaDeriver", () => {
	test(`correctly converts example 7`, () => {
		const schema: JSONSchema7 = {
			oneOf: [
				{
					title: "age",
					type: "string"
				},
				{
					title: "age2",
					type: "string"
				}
			],
			title: undefined
		};
		const data = getInitialData(schema);
		const state = stateFromJson(data);
		const store = { state, dispatch: () => null, history: [] };
		const props = storeToProps(store);
		const derive = JsonSchemaDeriver(defaultComponents, schema);

		expect(derive(props, store.dispatch)).toMatchSnapshot();
	});

	test(`correctly converts example 4`, () => {
		const schema: JSONSchema7 = {
			items: {
				properties: {
					email: {
						title: "email",
						type: "string"
					},
					noName16: {
						oneOf: [
							{
								title: "name",
								type: "string"
							},
							{
								properties: {
									familyName: {
										title: "familyName",
										type: "string"
									},
									givenName: {
										title: "givenName",
										type: "string"
									}
								},
								title: undefined,
								type: "object"
							}
						],
						title: undefined
					},
					note: {
						title: "note",
						type: "string"
					}
				},
				title: "card",
				type: "object"
			},
			title: "addressBook",
			type: "array"
		};
		const data = getInitialData(schema);
		const state = stateFromJson(data);
		const store = { state, dispatch: () => null, history: [] };
		const props = storeToProps(store);
		const derive = JsonSchemaDeriver(defaultComponents, schema);

		expect(derive(props, store.dispatch)).toMatchSnapshot();
	});
});
