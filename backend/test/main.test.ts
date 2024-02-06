import { deleteAccount, getAccount, signup } from "../src/main";

test("Should create a passenger account", async () => {
    // given
    const inputSignup = {
        name: "John Doe",
        email: "j@j.com",
        cpf: "76552179049",
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
