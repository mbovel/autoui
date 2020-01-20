import { stateFromJson, touch } from "./State";

describe("fromJson", () => {
	test("correctly converts string", () => {
		expect(stateFromJson("test")).toMatchSnapshot();
	});

	test("correctly converts number", () => {
		expect(stateFromJson(2)).toMatchSnapshot();
	});

	test("correctly converts array", () => {
		expect(stateFromJson([1, 2, 3])).toMatchSnapshot();
	});

	test("correctly converts object", () => {
		expect(stateFromJson({ prop1: 1, prop2: 2 })).toMatchSnapshot();
	});
});

describe("touch", () => {
	test("works on single string", () => {
		const state = stateFromJson(2);
		touch(state, "");
		expect(state.touched).toBe(true);
	});

	test("touch all ancestors", () => {
		const state = stateFromJson({ foo: 2 });
		touch(state, "foo");
		expect(state.touched).toBe(true);
		expect(state.children.foo.touched).toBe(true);
	});

	test("doesn't touch descendants", () => {
		const state = stateFromJson({ foo: 2 });
		touch(state, "");
		expect(state.touched).toBe(true);
		expect(state.children.foo.touched).toBeFalsy();
	});
});
