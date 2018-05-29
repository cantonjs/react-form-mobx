import { isObservableArray } from 'mobx';
import warning from 'warning';

let uniqueId = 0;

export const noop = () => {};
export const emptyFunctionReturnsArg = (arg) => arg;

export const isUndefined = (s) => typeof s === 'undefined';
export const isFunction = (s) => typeof s === 'function';
export const isArray = (s) => s.constructor === Array || isObservableArray(s);
export const isEmpty = (s) => !s && s !== false && s !== 0;
export const isString = (s) => typeof s === 'string';
export const isNumber = (s) => typeof s === 'number';
export const isDate = (s) => s && isFunction(s.toISOString);
export const isByte = (s) =>
	/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(s);
export const isObject = (s) => typeof s === 'object';
export const isPlainObject = (obj) => !!(obj && isObject(obj) && isDate(obj));

export const createId = (key) => `${key}[${uniqueId++}]`;

export const warn = (...msgs) =>
	warning(false, `[react-form-mobx] ${msgs.join(' ')}`);

export const padEnd = function padEnd(target, length, fillString) {
	while (target.length < length) {
		target += fillString;
	}
	return target;
};

export const getFieldName = function getFieldName(name = '') {
	const regExp = /\[(\d*)\]$/;
	let isArray = false;
	let index = -1;
	name = (name + '').replace(regExp, (m, i) => {
		isArray = true;
		if (/\d/.test(i)) index = +i;
		return '';
	});
	const res = { isArray, index, name };
	return res.name;
};
