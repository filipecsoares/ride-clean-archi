import SignupComponentDomain from "../src/domain/SignupComponentDomain";

test("Should test the wizard flow", async function () {
	const signupComponent = new SignupComponentDomain();
	signupComponent.isPassenger = true;
	const name = "John Doe";
	const email = `john.doe${Math.random()}@gmail.com`;
	const cpf = "97456321558";
	const carPlate = "AAA9999";
	expect(signupComponent.step).toBe(1);
	expect(signupComponent.isPreviousButtonVisible()).toBe(false);
	signupComponent.next();
	expect(signupComponent.step).toBe(2);
	signupComponent.name = name;
	signupComponent.email = email;
	signupComponent.cpf = cpf;
	signupComponent.isDriver = true;
	signupComponent.carPlate = carPlate;
	signupComponent.next();
	expect(signupComponent.step).toBe(3);
	expect(signupComponent.isNextButtonVisible()).toBe(false);
	signupComponent.previous();
	expect(signupComponent.step).toBe(2);
	signupComponent.previous();
	expect(signupComponent.step).toBe(1);
});

test("Should not go to step 2 if no option is selected", async function () {
	const signupComponent = new SignupComponentDomain();
	expect(signupComponent.step).toBe(1);
	signupComponent.next();
	expect(signupComponent.error).toBe("Select at least one option");
	signupComponent.isPassenger = true;
	signupComponent.next();
	expect(signupComponent.error).toBe("");
});

test("Should not go to step 3 if name, email, cpf and car plate are not filled", async function () {
	const signupComponent = new SignupComponentDomain();
	const name = "John Doe";
	const email = `john.doe${Math.random()}@gmail.com`;
	const cpf = "97456321558";
	const carPlate = "AAA9999";
	expect(signupComponent.step).toBe(1);
	signupComponent.isPassenger = true;
	signupComponent.isDriver = true;
	expect(signupComponent.isPreviousButtonVisible()).toBe(false);
	signupComponent.next();
	expect(signupComponent.step).toBe(2);
	signupComponent.next();
	expect(signupComponent.error).toBe("Invalid name");
	signupComponent.name = name;
	signupComponent.next();
	expect(signupComponent.error).toBe("Invalid email");
	signupComponent.email = email;
	signupComponent.next();
	expect(signupComponent.error).toBe("Invalid cpf");
	signupComponent.cpf = cpf;
	signupComponent.next();
	expect(signupComponent.error).toBe("Invalid car plate");
	signupComponent.carPlate = carPlate;
	signupComponent.next();
	expect(signupComponent.error).toBe("");
	expect(signupComponent.step).toBe(3);
});