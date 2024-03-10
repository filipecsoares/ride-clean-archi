import Name from "../src/domain/Name";

test("Should create a valid name.", function () {
	const name = new Name("John Doe");
	expect(name.value).toBe("John Doe");
});

test("Should not create a name with invalid name.", function () {
	expect(() => new Name("John")).toThrow(new Error("Invalid name"));
});