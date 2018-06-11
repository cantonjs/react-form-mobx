import React, { createRef } from 'react';
import { Form, ObjectOf, Input } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('ObjectOf instance methods', () => {
	test('should `getValue()` work', () => {
		const objectRef = createRef();
		mount(
			<Form>
				<ObjectOf name="foo" ref={objectRef}>
					<Input name="hello" defaultValue="world" />
				</ObjectOf>
			</Form>,
		);
		expect(objectRef.current.getValue()).toEqual({ hello: 'world' });
	});

	test('should `setValue()` work', () => {
		const formRef = createRef();
		const objectRef = createRef();
		mount(
			<Form ref={formRef}>
				<ObjectOf name="foo" ref={objectRef}>
					<Input name="hello" defaultValue="world" />
				</ObjectOf>
			</Form>,
		);
		objectRef.current.setValue({ hello: 'chris' });
		expect(objectRef.current.getValue()).toEqual({ hello: 'chris' });
		expect(formRef.current.submit()).toEqual({ foo: { hello: 'chris' } });
	});

	test('should `getPristineValue()` work', () => {
		const objectRef = createRef();
		const inputRef = createRef();
		mount(
			<Form>
				<ObjectOf name="foo" ref={objectRef}>
					<Input name="hello" defaultValue="world" ref={inputRef} />
				</ObjectOf>
			</Form>,
		);
		expect(objectRef.current.getPristineValue()).toEqual({});
		simulate(inputRef).change('value', 'chris');
		expect(objectRef.current.getPristineValue()).toEqual({});
	});

	test('should `setPristineValue()` work', () => {
		const formRef = createRef();
		const objectRef = createRef();
		mount(
			<Form ref={formRef}>
				<ObjectOf name="foo" ref={objectRef}>
					<Input name="hello" defaultValue="world" />
				</ObjectOf>
			</Form>,
		);
		objectRef.current.setPristineValue({ hello: 'chris' });
		expect(objectRef.current.getValue()).toEqual({ hello: 'chris' });
		expect(objectRef.current.getPristineValue()).toEqual({ hello: 'chris' });
		expect(formRef.current.submit()).toEqual({ foo: { hello: 'chris' } });
	});

	test('should `getValidState()` work', () => {
		const objectRef = createRef();
		mount(
			<Form>
				<ObjectOf name="foo" ref={objectRef}>
					<Input name="hello" defaultValue="world" />
				</ObjectOf>
			</Form>,
		);
		expect(objectRef.current.getValidState()).toMatchObject({
			isValid: true,
			isInvalid: false,
			isTouched: false,
			errorMessage: '',
		});
	});
});
