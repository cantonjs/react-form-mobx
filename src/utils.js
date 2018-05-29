import { isObservableArray } from 'mobx';
import warning from 'warning';

let uniqueId = 0;

export const isUndefined = (s) => typeof s === 'undefined';
export const isFunction = (s) => typeof s === 'function';
export const isObject = (s) => typeof s === 'object';
export const isArray = (s) => s.constructor === Array || isObservableArray(s);
export const isEmpty = (v) => !v && v !== false && v !== 0;
export const noop = () => {};
export const emptyFunctionReturnsArg = (arg) => arg;
export const clone = (s) => (isArray(s) ? s.slice() : { ...s });

export const createId = (key) => `${key}[${uniqueId++}]`;

export const warn = (...msgs) =>
	warning(false, `[react-form-mobx] ${msgs.join(' ')}`);

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
