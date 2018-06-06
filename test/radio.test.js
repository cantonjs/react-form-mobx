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
		const radioRef = createRef();
		const value = { hello: 'bar' };
		mount(
			<Form value={value} ref={formRef}>
				<Radio name="hello" value="foo" />
				<Radio name="hello" value="bar" />
				<Radio name="hello" value="baz" ref={radioRef} />
			</Form>,
		);
		simulate(radioRef).change('checked', true);
		expect(formRef.current.submit()).toEqual({ hello: 'baz' });
	});
});
