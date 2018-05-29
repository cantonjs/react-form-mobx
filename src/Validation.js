import { warn } from './utils';

export default class Validation {
	constructor(rules) {
		this.rules = [].concat(rules).filter(Boolean);
	}

	exec(value) {
		const { length } = this.rules;
		try {
			for (let index = 0; index < length; index++) {
				const rule = this.rules[index];
				const isValid = rule(value);
				if (!isValid) {
					throw new Error('Invalid');
				}
			}
		}
		catch (err) {
			warn('Validate Error:', err.message);
			return err;
		}
		return null;
	}
}
