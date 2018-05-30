import { isObservableArray } from 'mobx';
import warning from 'warning';

let uniqueId = 0;

export const noop = () => {};

export const isUndefined = (s) => typeof s === 'undefined';
export const isFunction = (s) => typeof s === 'function';
export const isArray = (s) =>
	(s && s.constructor === Array) || isObservableArray(s);
export const isEmpty = (s) => !s && s !== false && s !== 0;
export const isString = (s) => typeof s === 'string';
export const isNumber = (s) => typeof s === 'number';
export const isDate = (s) => s && isFunction(s.toISOString);
export const isByte = (s) =>
	/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(s);
export const isObject = (s) => typeof s === 'object';
export const isPlainObject = (obj) => !!(obj && isObject(obj) && !isDate(obj));

export const createId = (key) => `${key}[${uniqueId++}]`;

export const warn = (...msgs) =>
	warning(false, `[react-form-mobx] ${msgs.join(' ')}`);

export const padEnd = (target, length, fillString) => {
	while (target.length < length) target += fillString;
	return target;
};
