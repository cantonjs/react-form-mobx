import { Component, PureComponent } from 'react';
import { isObservableArray } from 'mobx';
import warning from 'warning';

let uniqueId = 0;

const pad = function pad(target, length, fillString, calc) {
	let prev = target.toString();
	while (prev.length < length) prev = calc(prev);
	return prev;
};

export const MaybePureComponent =
	PureComponent || /* istanbul ignore next */ Component;

export const noop = () => {};

export const isFunction = (s) => typeof s === 'function';
export const isNativeArray = (s) => s && s.constructor === Array;
export const isArray = (s) => isNativeArray(s) || isObservableArray(s);
export const isEmpty = (s) => !s && s !== false && s !== 0;
export const isString = (s) => typeof s === 'string';
export const isDate = (s) => s && s.constructor === Date;
export const isObject = (s) => typeof s === 'object';
export const isPlainObject = (s) => !!s && isObject(s) && !isDate(s);

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
