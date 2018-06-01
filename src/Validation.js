import { isEmpty } from './utils';

const throwIfNot = function throwIfNot(isValid, errorMessage) {
	if (isValid) return true;
	throw new Error(errorMessage);
};

export default class Validation {
	static enum(list) {
		return function validateByEnum(val) {
			const whiteList = list.map((str) => `"${str}"`).join(', ');
			return throwIfNot(
				~list.indexOf(val),
				`Expect one of ${whiteList}, but received "${val}"`,
			);
		};
	}

	static pattern(regexp) {
		return function validateByPattern(val) {
			return throwIfNot(
				regexp.test(val),
				`"${val}" did NOT match pattern "${regexp}"`,
			);
		};
	}

	static maxLength(max) {
		return function validateByMaxLength(val) {
			return throwIfNot(
				max > val.toString().length,
				`Expect max length is "${max}", but received "${val}"`,
			);
		};
	}

	static minLength(min) {
		return function validateByMinLength(val) {
			return throwIfNot(
				min < val.toString().length,
				`Expect min length is "${min}", but received "${val}"`,
			);
		};
	}

	constructor(options) {
		const {
			validation: rules,
			required,
			enum: enumeration,
			pattern,
			maxLength,
			minLength,
			dataTypeFilter,
		} = options;
		this.required = required;
		this.rules = [].concat(rules).filter(Boolean);

		if (enumeration) this.rules.push(Validation.enum(enumeration));
		if (pattern) this.rules.push(Validation.pattern(pattern));
		if (maxLength) this.rules.push(Validation.maxLength(maxLength));
		if (minLength) this.rules.push(Validation.minLength(minLength));

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
