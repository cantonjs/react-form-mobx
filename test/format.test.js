import React, { createRef } from 'react';
import { Form, Input } from '../src';
import { mount, unmount } from './utils';
import { DateTime } from 'luxon';

afterEach(unmount);

describe('formating empty data', () => {
	test('should not format empty data', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Input name="hello" format="integer" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({});
	});
});

describe('preFormat prop', () => {
	test('should transform value before format', () => {
		const formRef = createRef();
		const preFormat = jest.fn((val) => val.length);
		mount(
			<Form value={{ hello: ['a'] }} ref={formRef}>
				<Input name="hello" preFormat={preFormat} format="integer" />
			</Form>,
		);
		expect(preFormat).toHaveBeenCalledTimes(1);
		expect(formRef.current.submit()).toEqual({ hello: 1 });
	});

	test('should transform value before formatFunc', () => {
		const formRef = createRef();
		const preFormat = jest.fn((val) => val.length);
		const formatFunc = (val) => val + '';
		mount(
			<Form value={{ hello: ['a'] }} ref={formRef}>
				<Input name="hello" preFormat={preFormat} formatFunc={formatFunc} />
			</Form>,
		);
		expect(preFormat).toHaveBeenCalledTimes(1);
		expect(formRef.current.submit()).toEqual({ hello: '1' });
	});
});

describe('integer format', () => {
	test('should integer work', () => {
		const formRef = createRef();
		const value = { hello: '32' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="integer" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 32 });
	});

	test('should convert float type to intger format', () => {
		const formRef = createRef();
		const value = { hello: '32.9' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="integer" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 32 });
	});

	test('should be invalid if value could not convert to number format', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="integer" />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});
});

describe('number format', () => {
	test('should number work', () => {
		const formRef = createRef();
		const value = { hello: '3.2' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="number" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 3.2 });
	});

	test('should 0 work', () => {
		const formRef = createRef();
		const value = { hello: 0 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="number" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 0 });
	});

	test('should be invalid if value could not convert to number format', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="number" />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});
});

describe('string format', () => {
	test('should convert number to string format', () => {
		const formRef = createRef();
		const value = { hello: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="string" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: '32' });
	});

	test('should convert bool to string format', () => {
		const formRef = createRef();
		const value = { hello: true };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="string" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'true' });
	});

	test('should convert object to string format', () => {
		const formRef = createRef();
		const value = { hello: {} };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="string" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: '[object Object]' });
	});
});

describe('boolean format', () => {
	test('should convert "false" to `false`', () => {
		const formRef = createRef();
		const value = { hello: 'false' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="boolean" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: false });
	});

	test('should convert "0" to `false`', () => {
		const formRef = createRef();
		const value = { hello: '0' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="boolean" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: false });
	});

	test('should convert "null" to `false`', () => {
		const formRef = createRef();
		const value = { hello: 'null' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="boolean" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: false });
	});

	test('should convert "undefined" to `false`', () => {
		const formRef = createRef();
		const value = { hello: 'undefined' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="boolean" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: false });
	});

	test('should convert other string to `true`', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="boolean" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});
});

describe('date format', () => {
	test('should convert date object to date format', () => {
		const formRef = createRef();
		const date = new Date();
		const expected = DateTime.fromJSDate(date).toISODate();
		const value = { hello: date };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="date" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should convert timestamp to date format', () => {
		const formRef = createRef();
		const date = new Date();
		const expected = DateTime.fromJSDate(date).toISODate();
		const value = { hello: date.getTime() };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="date" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should convert string to date format', () => {
		const formRef = createRef();
		const dateString = '2018-1-11';
		const date = new Date(dateString);
		const expected = DateTime.fromJSDate(date).toISODate();
		const value = { hello: dateString };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="date" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should array of date string work', () => {
		const formRef = createRef();
		const dates = [
			new Date('2018-1-11 5:20:00'),
			new Date('2018-7-20 5:20:00'),
		];
		const expected = dates
			.map((date) => DateTime.fromJSDate(date).toISODate())
			.join(',');
		const value = { hello: dates.map((date) => date.getTime()).join(',') };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="date" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should be invalid if value could not convert to date format', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="date" />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});
});

describe('time format', () => {
	test('should convert date object to time format', () => {
		const formRef = createRef();
		const date = new Date();
		const expected = DateTime.fromJSDate(date).toISOTime();
		const value = { hello: date };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="time" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should convert timestamp to time format', () => {
		const formRef = createRef();
		const date = new Date();
		const expected = DateTime.fromJSDate(date).toISOTime();
		const value = { hello: date.getTime() };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="time" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should convert string to time format', () => {
		const formRef = createRef();
		const dateString = '2018-1-11';
		const date = new Date(dateString);
		const expected = DateTime.fromJSDate(date).toISOTime();
		const value = { hello: dateString };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="time" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should array of time string work', () => {
		const formRef = createRef();
		const dates = [
			new Date('2018-1-11 5:20:00'),
			new Date('2018-7-20 5:20:00'),
		];
		const expected = dates
			.map((date) => DateTime.fromJSDate(date).toISOTime())
			.join(',');
		const value = { hello: dates.map((date) => date.getTime()).join(',') };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="time" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should be invalid if value could not convert to time format', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="time" />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});
});

describe('dateTime format', () => {
	test('should convert date object to dateTime format', () => {
		const formRef = createRef();
		const date = new Date();
		const expected = DateTime.fromJSDate(date).toISO();
		const value = { hello: date };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="dateTime" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should convert timestamp to dateTime format', () => {
		const formRef = createRef();
		const date = new Date();
		const expected = DateTime.fromJSDate(date).toISO();
		const value = { hello: date.getTime() };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="dateTime" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should convert seconds timestamp to dateTime format', () => {
		const formRef = createRef();
		const timestamp = Math.floor(Date.now() / 1000);
		const date = new Date(timestamp * 1000);
		const expected = DateTime.fromJSDate(date).toISO();
		const value = { hello: timestamp };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="dateTime" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should convert string to dateTime format', () => {
		const formRef = createRef();
		const dateString = '2018-1-11';
		const date = new Date(dateString);
		const expected = DateTime.fromJSDate(date).toISO();
		const value = { hello: dateString };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="dateTime" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should array of dateTime string work', () => {
		const formRef = createRef();
		const dates = [
			new Date('2018-1-11 5:20:00'),
			new Date('2018-7-20 5:20:00'),
		];
		const expected = dates
			.map((date) => DateTime.fromJSDate(date).toISO())
			.join(',');
		const value = { hello: dates.map((date) => date.getTime()).join(',') };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="dateTime" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: expected });
	});

	test('should be invalid if value could not convert to dateTime format', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" format="dateTime" />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});
});

describe('formatFunc prop', () => {
	test('should formatFunc work', () => {
		const formRef = createRef();
		const value = { hello: '32' };
		const formatFunc = jest.fn((val) => +val);
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" formatFunc={formatFunc} />
			</Form>,
		);
		expect(formatFunc).toHaveBeenCalled();
		expect(formRef.current.submit()).toEqual({ hello: 32 });
	});

	test('should be invalid if formatFunc throw error', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		const formatFunc = jest.fn(() => {
			throw new Error();
		});
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" formatFunc={formatFunc} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});
});
