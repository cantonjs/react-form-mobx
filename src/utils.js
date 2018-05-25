export const isFunction = (src) => typeof src === 'function';
export const isObject = (src) => typeof src === 'object';
export const noop = () => {};

export const getFieldName = function getFieldName(name = '') {
	const regExp = /\[(\d*)\]$/;
	let isArray = false;
	let index = -1;
	name = (name + '').replace(regExp, (m, i) => {
		isArray = true;
		if (/\d/.test(i)) index = +i;
		return '';
	});
	return isArray ? index : name;
};
