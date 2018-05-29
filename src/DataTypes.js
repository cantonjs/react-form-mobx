import { isEmpty, isDate, isString, isNumber, isByte, padEnd } from './utils';

const tsToDate = (n) => new Date(+padEnd(n, 13, '0')).toISOString();

const validNumber = (val) => {
	if (!/^-?\d+\.?\d*$/.test(val)) {
		throw new Error(`${val} is NOT a valid Number`);
	}
	return true;
};

const toInt = (val) => validNumber(val) && (parseInt(val, 10) || 0);
const toNumber = (val) => validNumber(val) && (+val || 0);

const toStr = (val) => (!val ? '' : val + '');
const toBoolean = (val) =>
	!!val &&
	val !== '0' &&
	val !== 'false' &&
	val !== 'undefined' &&
	val !== 'null';
const toByte = (val) => {
	const formated = toStr(val);
	if (!isByte(formated)) throw new Error(`${val} is NOT a valid Byte type`);
	return formated;
};

const toDateTime = (val) => {
	if (isEmpty(val)) {
		return;
	}

	if (isString(val) && val.includes(',')) {
		return val.split(',').map(toDateTime);
	}
	else if (Array.isArray(val)) {
		return val.map(toDateTime);
	}

	if (isDate(val)) {
		return val.toISOString();
	}
	else if (isNumber(val)) {
		return tsToDate(val);
	}
	else if (isString(val)) {
		if (/^\d*$/.test(val)) {
			return tsToDate(val);
		}
		return new Date(val).toISOString();
	}
	throw new Error(`${val} is NOT a valid dateTime type`);
};

const toDate = (val) => {
	if (isEmpty(val)) {
		return;
	}

	if (isString(val) && val.includes(',')) {
		return val.split(',').map(toDate);
	}
	else if (Array.isArray(val)) {
		return val.map(toDate);
	}

	const dateTime = toDateTime(val);
	if (isString(dateTime)) {
		const d = new Date(dateTime);
		const year = d.getFullYear();
		let month = d.getMonth() + 1;
		let date = d.getDate();
		if (month < 10) {
			month = `0${month}`;
		}
		if (date < 10) {
			date = `0${date}`;
		}
		return [year, month, date].join('/');
	}
	throw new Error(`${val} is NOT a valid date type`);
};

const DataTypes = {
	integer: toInt,
	number: toNumber,
	string: toStr,
	byte: toByte,
	boolean: toBoolean,
	date: toDate,
	dateTime: toDateTime,
	password: toStr,
};

export const DataTypeKeys = Object.keys(DataTypes);

// TODO: add cache
export function createFormatDataTypeFunc(type) {
	return function formatDataType(val) {
		if (isEmpty(val)) return val;
		return isString(type) ? DataTypes[type](val) : type(val);
	};
}
