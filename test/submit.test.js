import React, { createRef } from 'react';
import { Form, Input, ArrayOf, ObjectOf, Submit } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Submit component', () => {
	test('click submit button', () => {
		const buttonRef = createRef();
		const value = { hello: 'world' };
		const handleSubmit = jest.fn();
		mount(
			<Form value={value} onSubmit={handleSubmit}>
				<Input name="hello" />
				<Submit ref={buttonRef} />
			</Form>,
		);
		simulate(buttonRef).click();
		expect(handleSubmit).toHaveBeenCalledWith(
			{ hello: 'world' },
			{ isValid: true },
		);
	});
});

describe('submit', () => {
	test('submitting basic', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('submitting array', () => {
		const formRef = createRef();
		const value = { foo: ['bar', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="foo">
					{(arr) => arr.map((item) => <Input name={item} key={item} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ foo: ['bar', 'baz'] });
	});

	test('submitting nested objects', () => {
		const formRef = createRef();
		const value = { foo: { bar: { baz: 'hello' } } };
		mount(
			<Form value={value} ref={formRef}>
				<ObjectOf name="foo">
					<ObjectOf name="bar">
						<Input name="baz" />
					</ObjectOf>
				</ObjectOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({
			foo: { bar: { baz: 'hello' } },
		});
	});
});

describe('Submitting empty data', () => {
	test('should be an empty object without value prop', () => {
		const formRef = createRef();
		mount(<Form ref={formRef} />);
		expect(formRef.current.submit()).toEqual({});
	});

	test('should not submit empty input', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<Input name="foo" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should not submit empty object', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<ObjectOf name="foo">
					<Input name="bar" />
				</ObjectOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should not submit empty array', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<ArrayOf name="foo">
					{(list) => list.map((id) => <Input key={id} name={id} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should submit empty data if input has `enforceSubmit` prop', () => {
		const formRef = createRef();
		mount(
			<Form value={{}} ref={formRef}>
				<Input name="hello" enforceSubmit />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: '' });
	});

	test('should submit empty data if original data is not empty', () => {
		const formRef = createRef();
		const inputRef = createRef();
		mount(
			<Form value={{ hello: 'world' }} ref={formRef}>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', '');
		expect(formRef.current.submit()).toEqual({ hello: '' });
	});
});
