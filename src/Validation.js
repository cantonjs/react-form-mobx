import { isEmpty } from './utils';

export default class Validation {
	constructor(rules, required) {
		this.required = required;
		this.rules = [].concat(rules).filter(Boolean);
	}

	exec(value) {
		const { length } = this.rules;

		if (isEmpty(value)) {
			if (this.required) return new Error('Required');
			return null;
		}

		try {
			for (let index = 0; index < length; index++) {
				const rule = this.rules[index];
				const isValid = rule(value);
				if (!isValid) {
					return new Error('Invalid');
				}
			}
		}
		catch (err) {
			return err;
		}
		return null;
	}
}
