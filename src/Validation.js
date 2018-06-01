import { isEmpty } from './utils';

export default class Validation {
	static enum(list) {
		return function validateEnum(val) {
			const included = !!~list.indexOf(val);
			if (included) return true;
			const whiteList = list.map((str) => `"${str}"`).join(', ');
			throw new Error(`Only one of ${whiteList} is valid.`);
		};
	}

	constructor(options) {
		const {
			validation: rules,
			required,
			enumeration,
			dataTypeFilter,
		} = options;
		this.required = required;
		this.rules = [].concat(rules).filter(Boolean);

		if (enumeration) this.rules.push(Validation.enum(enumeration));

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
