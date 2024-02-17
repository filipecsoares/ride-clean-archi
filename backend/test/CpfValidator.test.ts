import { validateCpf } from "../src/domain/CpfValidator";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Should test valid cpfs", function (cpf: string) {
	expect(validateCpf(cpf)).toBe(true);
});

test.each([
	"",
	undefined,
	null,
	"11111111111",
	"111",
	"11111111111111"
])("Should test invalid cpfs", function (cpf: any) {
	expect(validateCpf(cpf)).toBe(false);
});