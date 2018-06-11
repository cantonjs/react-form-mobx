import React, { createRef } from 'react';
import { Form, Radio } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Radio component', () => {
	test('should submit matched field', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Radio name="hello" value="world" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should submit matched field in radios group', () => {
		const formRef = createRef();
		const value = { hello: 'bar' };
		mount(
			<Form value={value} ref={formRef}>
				<Radio name="hello" value="foo" />
				<Radio name="hello" value="bar" />
				<Radio name="hello" value="baz" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'bar' });
	});

	test('should submit user checked field in radios group', () => {
		const formRef = createRef();
		const radioRef1 = createRef();
		const radioRef2 = createRef();
		const value = { hello: 'bar' };
		mount(
			<Form value={value} ref={formRef}>
				<Radio name="hello" value="foo" ref={radioRef1} />
				<Radio name="hello" value="bar" ref={radioRef2} />
				<Radio name="hello" value="baz" />
			</Form>,
		);
		simulate(radioRef1).change('checked', true);
		simulate(radioRef2).change('checked', true);
		simulate(radioRef1).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: 'foo' });
	});

	test('should be able to get dom node', () => {
		const radioRef = createRef();
		mount(
			<Form>
				<Radio name="hello" ref={radioRef} />
			</Form>,
		);
		expect(radioRef.current.node.nodeName).toBe('INPUT');
	});
});

describe('Radio defaultChecked', () => {
	test('should submit defaultChecked field', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Radio name="hello" defaultChecked />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});

	test('should not submit defaultChecked=false field', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<Radio name="hello" defaultChecked={false} />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({});
	});

	test('should submit defaultChecked=false field if user checked', () => {
		const formRef = createRef();
		const checkboxRef = createRef();
		mount(
			<Form ref={formRef}>
				<Radio name="hello" defaultChecked ref={checkboxRef} />
			</Form>,
		);
		simulate(checkboxRef).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: true });
	});

	test('should not submit defaultChecked field if data value is false', () => {
		const formRef = createRef();
		mount(
			<Form value={{ hello: false }} ref={formRef}>
				<Radio name="hello" defaultChecked />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({});
	});
});
