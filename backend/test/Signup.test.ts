import AccountDAO from "../src/AccountDAO";
import AccountDAODatabase from "../src/AccountDAODatabase";
import GetAccount from "../src/GetAccount";
import Logger from "../src/Logger";
import LoggerConsole from "../src/LoggerConsole";
import Signup from "../src/Signup";
import sinon from "sinon";


let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const logger = new LoggerConsole();
	signup = new Signup(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
})

test("Should create a passenger account with stub", async function () {
	const stubAccountDAOSave = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
	const stubAccountDAOGetByEmail = sinon.stub(AccountDAODatabase.prototype, "getByEmail").resolves(null);
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const stubAccountDAOGetById = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	stubAccountDAOSave.restore();
	stubAccountDAOGetByEmail.restore();
	stubAccountDAOGetById.restore();
});

test("Should create a passenger account with mock", async function () {
	const mockLogger = sinon.mock(LoggerConsole.prototype);
	mockLogger.expects("log").withArgs("signup John Doe").once();
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	mockLogger.verify();
	mockLogger.restore();
});

test("Should not create an account if name is invalid", async function () {
	// given
	const inputSignup = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid name"));
});

test("Should not create an account if email is invalid", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid email"));
});

test("Should not create an account if cpf is invalid", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "11111111111",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Should not create an account if email is duplicated", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await signup.execute(inputSignup);
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Duplicated account"));
});

test("Should create a driver account", async function () {
	const spyLoggerLog = sinon.spy(LoggerConsole.prototype, "log");
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(spyLoggerLog.calledOnce).toBeTruthy();
	expect(spyLoggerLog.calledWith("signup John Doe")).toBeTruthy();
	spyLoggerLog.restore();
});

test("Should not create a driver account with invalid car plate", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid car plate"));
});

test("Should create a passenger account with fake", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const accounts: any = [];
	const accountDAO: AccountDAO = {
		async save (account: any): Promise<void> {
			accounts.push(account);
		},
		async getById (accountId: string): Promise<any> {
			return accounts.find((account: any) => account.accountId === accountId);
		},
		async getByEmail (email: string): Promise<any> {
			return accounts.find((account: any) => account.email === email);
		}
	}
	const logger: Logger = {
		log (message: string): void {
			console.log(message);
		}
	}
	const signup = new Signup(accountDAO, logger);
	const getAccount = new GetAccount(accountDAO);
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
});