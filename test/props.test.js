import React, { createRef } from 'react';
import { Form, Input, ObjectOf, Submit } from '../src';
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
