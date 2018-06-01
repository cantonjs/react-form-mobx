import React, { createRef } from 'react';
import { Form, Input, ObjectOf, ArrayOf } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('validation prop', () => {
	test('should be invalid if fail to validate', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		const validation = () => false;
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" validation={validation} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to validate', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		const validation = () => true;
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" validation={validation} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('enum prop', () => {
	test('should be invalid if fail to enum', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" enum={['foo', 'bar']} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to enum', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" enum={['foo', 'bar']} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('pattern prop', () => {
	test('should be invalid if fail to pattern', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" pattern={/^f/} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to pattern', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" pattern={/^f/} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('maxLength prop', () => {
	test('should be invalid if fail to maxLength', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" maxLength={1} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to maxLength', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" maxLength={10} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('minLength prop', () => {
	test('should be invalid if fail to minLength', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" minLength={10} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to minLength', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" minLength={1} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});
