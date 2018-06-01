import { isEmpty } from './utils';

export default class Validation {
	static enum(list) {
		return function validateByEnum(val) {
			const valid = !!~list.indexOf(val);
			if (valid) return true;
			const whiteList = list.map((str) => `"${str}"`).join(', ');
			throw new Error(`Expect one of ${whiteList}, but received "${val}"`);
		};
	}

	static pattern(regexp) {
		return function validateByPattern(val) {
			const valid = regexp.test(val);
			if (valid) return true;
			throw new Error(`"${val}" did NOT match pattern "${regexp}"`);
		};
	}

	constructor(options) {
		const {
			validation: rules,
			required,
			enumeration,
			pattern,
			dataTypeFilter,
		} = options;
		this.required = required;
		this.rules = [].concat(rules).filter(Boolean);

		if (enumeration) this.rules.push(Validation.enum(enumeration));
		if (pattern) this.rules.push(Validation.pattern(pattern));

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
