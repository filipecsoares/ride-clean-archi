import { deleteAccount, getAccount, signup } from "../src/main";

test.each([
    "97456321558",
	"71428793860",
	"87748248800"
])("Should create a passenger account", async (cpf: string) => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: "j@j.com",
        cpf: cpf,
        isPassenger: true,
        password: "123456"
    }
    // when
    const outputSignup = await signup(inputSignup);
    const outputGetAccount = await getAccount(outputSignup.accountId);
    // cleanup
    await deleteAccount(outputSignup.accountId);
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});

test("Should not create a passenger account if name is invalid", async () => {
    // given
    const inputSignup = {
        name: "John",
        email: "j@j.com",
        cpf: "76552179049",
        isPassenger: true,
        password: "123456"
    }
    // when/then
    await expect(signup(inputSignup)).rejects.toThrow(new Error("Invalid name"));
});

test("Should not create a passenger account if email is invalid", async () => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: "jmm",
        cpf: "76552179049",
        isPassenger: true,
        password: "123456"
    }
    // when/then
    await expect(signup(inputSignup)).rejects.toThrow(new Error("Invalid email"));
});

test.each([
    "",
    " ",
    "123",
    "123456789",
    "1234567890999999",
    "11111111111",
    undefined,
    null

])("Should not create a passenger account if cpf is invalid", async (cpf: any) => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: "jmm@j.com",
        cpf: cpf,
        isPassenger: true,
        password: "123456"
    }
    // when/then
    await expect(signup(inputSignup)).rejects.toThrow(new Error("Invalid CPF"));
});

test("Should not create a passenger account if email is duplicated", async () => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: "jmm@j.com",
        cpf: "76552179049",
        isPassenger: true,
        password: "123456"
    }
    // when
    const {accountId} = await signup(inputSignup);
    await expect(signup(inputSignup)).rejects.toThrow(new Error("Account already exists"));

    // cleanup
    await deleteAccount(accountId);
});

test("Should create a driver account", async () => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: "j@j.com",
        cpf: "76552179049",
        carPlate: "ABC1234",
        isPassenger: false,
        isDriver: true,
        password: "123456"
    }
    // when
    const outputSignup = await signup(inputSignup);
    const outputGetAccount = await getAccount(outputSignup.accountId);
    // cleanup
    await deleteAccount(outputSignup.accountId);
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});

test("Should not create a driver account if plate is invalid", async () => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: "j@j.com",
        cpf: "76552179049",
        carPlate: "ABC1",
        isPassenger: false,
        isDriver: true,
        password: "123456"
    }
    // when/then
    await expect(signup(inputSignup)).rejects.toThrow(new Error("Invalid car plate"));
});