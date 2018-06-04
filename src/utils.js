import { isObservableArray } from 'mobx';
import warning from 'warning';

let uniqueId = 0;

const pad = function pad(target, length, fillString, calc) {
	let prev = target.toString();
	while (prev.length < length) prev = calc(prev);
	return prev;
};

export const noop = () => {};

export const isUndefined = (s) => typeof s === 'undefined';
export const isFunction = (s) => typeof s === 'function';
export const isArray = (s) =>
	(s && s.constructor === Array) || isObservableArray(s);
export const isEmpty = (s) => !s && s !== false && s !== 0;
export const isString = (s) => typeof s === 'string';
export const isNumber = (s) => typeof s === 'number';
export const isDate = (s) => s && isFunction(s.toISOString);
export const isObject = (s) => typeof s === 'object';
export const isPlainObject = (obj) => !!(obj && isObject(obj) && !isDate(obj));

export const clone = (s) => {
	if (isArray(s)) return s.slice();
	if (isObject(s)) return { ...s };
	return s;
};

export const createId = (key) => `${key}[${uniqueId++}]`;

export const warn = (...msgs) =>
	warning(false, `[react-form-mobx] ${msgs.join(' ')}`);

export const padEnd = (target, length, fillString) =>
	pad(target, length, fillString, (prev) => `${prev}${fillString}`);

export const padStart = (target, length, fillString) =>
	pad(target, length, fillString, (prev) => `${fillString}${prev}`);

export const filtersFlow = (filters, value, options) => {
	filters = filters.filter(Boolean);
	const next = (value, options) => {
		if (!filters.length) return value;
		const filter = filters.shift();
		return next(filter(value, options), options);
	};
	return next(value, options);
};
