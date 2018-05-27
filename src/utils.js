import { isObservableArray } from 'mobx';

export const isUndefined = (s) => typeof s === 'undefined';
export const isFunction = (s) => typeof s === 'function';
export const isObject = (s) => typeof s === 'object';
export const isArray = (s) => s.constructor === Array || isObservableArray(s);
export const noop = () => {};
export const clone = (s) => (isArray(s) ? s.slice() : { ...s });

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
