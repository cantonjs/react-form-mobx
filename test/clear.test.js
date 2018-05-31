import React, { createRef } from 'react';
import { Form, Input, ArrayOf, ObjectOf, Clear } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Clear component', () => {
	test('click clear button', () => {
		const formRef = createRef();
		const buttonRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<Clear ref={buttonRef} />
			</Form>,
		);
		simulate(buttonRef).click();
		expect(formRef.current.submit()).toEqual({});
	});
});

describe('form.clear()', () => {
	test('clear input', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
			</Form>,
		);
		formRef.current.clear();
		expect(formRef.current.submit()).toEqual({});
	});

	test('clear object', () => {
		const formRef = createRef();
		const value = { hello: { foo: 'bar' } };
		mount(
			<Form value={value} ref={formRef}>
				<ObjectOf name="hello">
					<Input name="foo" />
				</ObjectOf>
			</Form>,
		);
		formRef.current.clear();
		expect(formRef.current.submit()).toEqual({});
	});

	test('clear array', () => {
		const formRef = createRef();
		const value = { hello: ['foo', 'bar', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="hello">
					{(list) => list.map((id) => <Input name={id} key={id} />)}
				</ArrayOf>
			</Form>,
		);
		formRef.current.clear();
		expect(formRef.current.submit()).toEqual({});
	});

	test('clear after typed', () => {
		const formRef = createRef();
		const inputRef = createRef();
		const value = {};
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'foo');
		formRef.current.clear();
		expect(formRef.current.submit()).toEqual({});
	});
});
