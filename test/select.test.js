import React, { createRef } from 'react';
import { Form, Select, Option } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Select component', () => {
	test('should submit matched field', () => {
		const formRef = createRef();
		const value = { hello: 'bar' };
		mount(
			<Form value={value} ref={formRef}>
				<Select name="hello">
					<Option value="foo">foo</Option>
					<Option value="bar">bar</Option>
					<Option value="baz">baz</Option>
				</Select>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'bar' });
	});

	test('should submit the first option value', () => {
		const formRef = createRef();
		const selectRef = createRef();
		mount(
			<Form ref={formRef}>
				<Select name="hello" ref={selectRef}>
					<Option value="foo">foo</Option>
					<Option value="bar">bar</Option>
					<Option value="baz">baz</Option>
				</Select>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'foo' });
	});

	test('should submit default value', () => {
		const formRef = createRef();
		const selectRef = createRef();
		mount(
			<Form ref={formRef}>
				<Select name="hello" defaultValue="bar" ref={selectRef}>
					<Option value="foo">foo</Option>
					<Option value="bar">bar</Option>
					<Option value="baz">baz</Option>
				</Select>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'bar' });
	});

	test('should submit user selected field', () => {
		const formRef = createRef();
		const selectRef = createRef();
		mount(
			<Form ref={formRef}>
				<Select name="hello" ref={selectRef}>
					<Option value="foo">foo</Option>
					<Option value="bar">bar</Option>
					<Option value="baz">baz</Option>
				</Select>
			</Form>,
		);
		simulate(selectRef).change('value', 'bar');
		expect(formRef.current.submit()).toEqual({ hello: 'bar' });
	});

	test('should be able to get dom node', () => {
		const selectRef = createRef();
		mount(
			<Form>
				<Select name="hello" ref={selectRef} />
			</Form>,
		);
		expect(selectRef.current.node.nodeName).toBe('SELECT');
	});
});
