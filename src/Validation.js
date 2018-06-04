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

	static maximum(max) {
		return function validateByMaximum(val) {
			return throwIfNot(
				max >= +val,

				/* eslint-disable-next-line max-len */
				`Expect strictly less than or exactly equal "${max}", but received "${val}"`,
			);
		};
	}

	static exclusiveMaximum(max) {
		return function validateByExclusiveMaximum(val) {
			return throwIfNot(
				max > +val,

				/* eslint-disable-next-line max-len */
				`Expect strictly less than (not equal to) "${max}", but received "${val}"`,
			);
		};
	}

	static minimum(min) {
		return function validateByMinimum(val) {
			return throwIfNot(
				min <= +val,

				/* eslint-disable-next-line max-len */
				`Expect strictly greater than or exactly equal "${min}", but received "${val}"`,
			);
		};
	}

	static exclusiveMinimum(min) {
		return function validateByExclusiveMinimum(val) {
			return throwIfNot(
				min < +val,

				/* eslint-disable-next-line max-len */
				`Expect strictly greater than (not equal to) "${min}", but received "${val}"`,
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
			maximum,
			exclusiveMaximum,
			minimum,
			exclusiveMinimum,
			formatFilter,
		} = options;
		this.required = required;
		this.rules = [].concat(rules).filter(Boolean);

		if (enumeration) this.rules.push(Validation.enum(enumeration));
		if (pattern) this.rules.push(Validation.pattern(pattern));
		if (maxLength) this.rules.push(Validation.maxLength(maxLength));
		if (minLength) this.rules.push(Validation.minLength(minLength));
		if (maximum) this.rules.push(Validation.maximum(maximum));
		if (exclusiveMaximum) {
			this.rules.push(Validation.exclusiveMaximum(exclusiveMaximum));
		}
		if (minimum) this.rules.push(Validation.minimum(minimum));
		if (exclusiveMinimum) {
			this.rules.push(Validation.exclusiveMinimum(exclusiveMinimum));
		}

		if (formatFilter) {
			const formatFilterValidator = (val) => formatFilter(val) || true;
			this.rules.push(formatFilterValidator);
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
