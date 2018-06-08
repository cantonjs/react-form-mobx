import React, { createRef } from 'react';
import { Form, Input } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('defaultValue prop', () => {
	test('should submit defaultValue if value is empty', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Input name="hello" defaultValue="world" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should not submit defaultValue if value is not empty', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" defaultValue="chris" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should not submit defaultValue if user typed', () => {
		const formRef = createRef();
		const inputRef = createRef();
		mount(
			<Form ref={formRef}>
				<Input name="hello" defaultValue="chris" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'world');
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});
});

describe('onKeyPress prop', () => {
	test('should trigger onKeyPress', () => {
		const eventHandler = jest.fn();
		const inputRef = createRef();
		mount(
			<Form>
				<Input name="hello" onKeyPress={eventHandler} ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).keyPress('key', 1);
		expect(eventHandler).toHaveBeenCalledTimes(1);
	});

	test('should not throw error if onKeyPress is undefined', () => {
		const inputRef = createRef();
		mount(
			<Form>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).keyPress('key', 1);
	});
});

describe('onChange prop', () => {
	test('should trigger onChange', () => {
		const eventHandler = jest.fn();
		const inputRef = createRef();
		mount(
			<Form>
				<Input name="hello" onChange={eventHandler} ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'chris');
		expect(eventHandler).toHaveBeenCalledTimes(1);
	});

	test('should not throw error if onChange is undefined', () => {
		const inputRef = createRef();
		mount(
			<Form>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'chris');
	});
});

describe('onBlur prop', () => {
	test('should trigger onBlur', () => {
		const eventHandler = jest.fn();
		const inputRef = createRef();
		mount(
			<Form>
				<Input name="hello" onBlur={eventHandler} ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).blur();
		expect(eventHandler).toHaveBeenCalledTimes(1);
	});

	test('should not throw error if onBlur is undefined', () => {
		const inputRef = createRef();
		mount(
			<Form>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).blur();
	});
});
