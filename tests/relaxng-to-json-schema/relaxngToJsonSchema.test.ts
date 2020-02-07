import * as fs from "fs";
import { relaxngToJsonSchema } from "../../src/relaxng-to-json-schema/relaxngToJsonSchema";

const read = (file: string) => fs.readFileSync("tests/relaxng-to-json-schema/" + file, "utf8");

describe("relaxngToJsonSchema", () => {
	for (let i = 1; i <= 7; ++i) {
		test(`correctly converts example ${i}`, () => {
			const result = relaxngToJsonSchema(read(`ex${i}.rng`));
			expect(result).toMatchSnapshot();
		});
	}
});
