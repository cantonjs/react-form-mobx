import React, { createRef } from 'react';
import { Form, Checkbox, ArrayOf } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Checkbox component', () => {
	test('should submit matched field', () => {
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

	test('should convert "true" string to boolean by default', () => {
		const formRef = createRef();
		const checkboxRef = createRef();
		mount(
			<Form value={{ hello: 'true' }} ref={formRef}>
				<Checkbox name="hello" ref={checkboxRef} />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});

	test('should be able to get dom node', () => {
		const checkboxRef = createRef();
		mount(
			<Form>
				<Checkbox name="hello" ref={checkboxRef} />
			</Form>,
		);
		expect(checkboxRef.current.node.nodeName).toBe('INPUT');
	});
});

describe('Checkbox component for array', () => {
	test('should submit checked fields', () => {
		const formRef = createRef();
		const value = { hello: ['foo', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="hello">
					<Checkbox value="foo" />
					<Checkbox value="bar" />
					<Checkbox value="baz" />
				</ArrayOf>
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
				<ArrayOf name="hello">
					<Checkbox value="foo" ref={checkboxRef1} />
					<Checkbox value="bar" ref={checkboxRef2} />
					<Checkbox value="baz" />
				</ArrayOf>
			</Form>,
		);
		simulate(checkboxRef1).change('checked', false);
		simulate(checkboxRef2).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: ['bar', 'baz'] });
	});
});

describe('Checkbox defaultChecked', () => {
	test('should submit defaultChecked field', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Checkbox name="hello" defaultChecked />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});

	test('should not submit defaultChecked=false field', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Checkbox name="hello" defaultChecked={false} />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({});
	});

	test('should submit defaultChecked=false field if user checked', () => {
		const formRef = createRef();
		const checkboxRef = createRef();
		mount(
			<Form ref={formRef}>
				<Checkbox name="hello" defaultChecked ref={checkboxRef} />
			</Form>,
		);
		simulate(checkboxRef).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});

	test('should not submit defaultChecked field if data value is false', () => {
		const formRef = createRef();
		mount(
			<Form value={{ hello: false }} ref={formRef}>
				<Checkbox name="hello" defaultChecked />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({});
	});
});
