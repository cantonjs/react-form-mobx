import React, { createRef } from 'react';
import { Form, Checkbox, ArrayOf, ObjectOf, Reset } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Checkbox component', () => {
	test('should submit checked field', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Checkbox name="hello" value="world" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should not submit non-checked field', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Checkbox name="hello" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({});
	});

	test('should submit checked field after user checked', () => {
		const formRef = createRef();
		const checkboxRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Checkbox name="hello" ref={checkboxRef} />
			</Form>,
		);
		simulate(checkboxRef).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});

	test('should submit `true` if checked', () => {
		const formRef = createRef();
		const checkboxRef = createRef();
		const value = { hello: true };
		mount(
			<Form value={value} ref={formRef}>
				<Checkbox name="hello" ref={checkboxRef} format="boolean" />
			</Form>,
		);
		simulate(checkboxRef).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});

	test('should submit checked field after user checked a new field', () => {
		const formRef = createRef();
		const checkboxRef = createRef();
		mount(
			<Form ref={formRef}>
				<Checkbox name="hello" value="world" ref={checkboxRef} />
			</Form>,
		);
		simulate(checkboxRef).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should not submit field after user unchecked', () => {
		const formRef = createRef();
		const checkboxRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Checkbox name="hello" value="world" ref={checkboxRef} />
			</Form>,
		);
		simulate(checkboxRef).change('checked', false);
		expect(formRef.current.submit()).toEqual({});
	});

	test('should default value be `true`', () => {
		const formRef = createRef();
		const checkboxRef = createRef();
		mount(
			<Form ref={formRef}>
				<Checkbox name="hello" ref={checkboxRef} />
			</Form>,
		);
		simulate(checkboxRef).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});
});

describe('Checkbox component for array', () => {
	test('should submit checked fields', () => {
		const formRef = createRef();
		const value = { hello: ['foo', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<Checkbox name="hello" value="foo" />
				<Checkbox name="hello" value="bar" />
				<Checkbox name="hello" value="baz" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: ['foo', 'baz'] });
	});

	test('should submit checked fields after user checked', () => {
		const formRef = createRef();
		const checkboxRef1 = createRef();
		const checkboxRef2 = createRef();
		const value = { hello: ['foo', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<Checkbox name="hello" value="foo" ref={checkboxRef1} />
				<Checkbox name="hello" value="bar" ref={checkboxRef2} />
				<Checkbox name="hello" value="baz" />
			</Form>,
		);
		simulate(checkboxRef1).change('checked', false);
		simulate(checkboxRef2).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: ['bar', 'baz'] });
	});
});
