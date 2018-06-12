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
			preValidate,
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
			preFormat,
			formatFilter,
			formatFunc,
		} = options;
		this.required = required;
		this._rules = [].concat(rules).filter(Boolean);
		this._preValidate = preValidate;

		if (enumeration) this._rules.push(Validation.enum(enumeration));
		if (pattern) this._rules.push(Validation.pattern(pattern));
		if (maxLength) this._rules.push(Validation.maxLength(maxLength));
		if (minLength) this._rules.push(Validation.minLength(minLength));
		if (maximum) this._rules.push(Validation.maximum(maximum));
		if (exclusiveMaximum) {
			this._rules.push(Validation.exclusiveMaximum(exclusiveMaximum));
		}
		if (minimum) this._rules.push(Validation.minimum(minimum));
		if (exclusiveMinimum) {
			this._rules.push(Validation.exclusiveMinimum(exclusiveMinimum));
		}

		if (formatFilter) {
			const formatFilterValidator = (val) => {
				val = preFormat ? preFormat(val) : val;
				formatFilter(val);
				return true;
			};
			this._rules.push(formatFilterValidator);
		}
		else if (formatFunc) {
			const formatFuncValidator = (val) => {
				val = preFormat ? preFormat(val) : val;
				formatFunc(val);
				return true;
			};
			this._rules.push(formatFuncValidator);
		}
	}

	exec(value) {
		const { _rules, _preValidate } = this;
		const { length } = _rules;

		if (isEmpty(value)) {
			if (this.required) throw new Error('Required');
			return;
		}

		if (_preValidate) value = _preValidate(value);

		for (let index = 0; index < length; index++) {
			const rule = _rules[index];
			const isValid = rule(value);
			if (!isValid) {
				throw new Error('Invalid');
			}
		}
	}
}
