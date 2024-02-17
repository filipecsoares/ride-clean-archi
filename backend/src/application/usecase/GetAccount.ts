import AccountRepository from "../repository/AccountRepository";

export default class GetAccount {

	constructor (private accountRepository: AccountRepository) {
	}
	
	async execute (accountId: string) {
		return await this.accountRepository.getById(accountId);
	}
}