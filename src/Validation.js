import { isEmpty } from './utils';

export default class Validation {
	constructor(rules, required, dataTypeFilter) {
		this.required = required;

		this.rules = [].concat(rules).filter(Boolean);

		console.log('dataTypeFilter', dataTypeFilter);

		if (dataTypeFilter) {
			const dataTypeValidator = (val) => dataTypeFilter(val) || true;
			this.rules.push(dataTypeValidator);
		}
	}

	exec(value) {
		const { length } = this.rules;

		if (isEmpty(value)) {
			if (this.required) throw new Error('Required');
			return;
		}

		for (let index = 0; index < length; index++) {
			const rule = this.rules[index];
			const isValid = rule(value);
			if (!isValid) {
				throw new Error('Invalid');
			}
		}
	}
}
