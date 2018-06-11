import React, { createRef } from 'react';
import { Form, Input } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Form instance methods', () => {
	test('should `getValue()` work', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Input name="hello" defaultValue="world" />
			</Form>,
		);
		expect(formRef.current.getValue()).toEqual({ hello: 'world' });
	});

	test('should `setValue()` work', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Input name="hello" defaultValue="world" />
			</Form>,
		);
		formRef.current.setValue({ hello: 'chris' });
		expect(formRef.current.getValue()).toEqual({ hello: 'chris' });
		expect(formRef.current.submit()).toEqual({ hello: 'chris' });
	});

	test('should `getPristineValue()` work', () => {
		const formRef = createRef();
		const inputRef = createRef();
		mount(
			<Form ref={formRef}>
				<Input name="hello" defaultValue="world" ref={inputRef} />
			</Form>,
		);
		expect(formRef.current.getPristineValue()).toEqual({});
		simulate(inputRef).change('value', 'chris');
		expect(formRef.current.getPristineValue()).toEqual({});
	});

	test('should `setPristineValue()` work', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Input name="hello" defaultValue="world" />
			</Form>,
		);
		formRef.current.setPristineValue({ hello: 'chris' });
		expect(formRef.current.getValue()).toEqual({ hello: 'chris' });
		expect(formRef.current.getPristineValue()).toEqual({ hello: 'chris' });
		expect(formRef.current.submit()).toEqual({ hello: 'chris' });
	});

	test('should `getValidState()` work', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Input name="hello" defaultValue="world" />
			</Form>,
		);
		expect(formRef.current.getValidState()).toMatchObject({
			isValid: true,
			isInvalid: false,
			isTouched: false,
			errorMessage: '',
		});
	});
});
