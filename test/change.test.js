import React, { createRef } from 'react';
import { Form, Input, ArrayOf, ObjectOf } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Change Event', () => {
	test('should trigger Input.onChange', () => {
		const handleChange = jest.fn();
		const inputRef = createRef();
		mount(
			<Form>
				<Input name="hello" ref={inputRef} onChange={handleChange} />
			</Form>,
		);
		simulate(inputRef).change('value', 'world');
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	test('should trigger Form.onChange', () => {
		const handleChange = jest.fn();
		const inputRef = createRef();
		mount(
			<Form value={{ hello: 'world' }} onChange={handleChange}>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'chris');
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ value: { hello: 'chris' } }),
		);
	});

	test('should trigger ObjectOf.onChange', () => {
		const handleChange = jest.fn();
		const inputRef = createRef();
		mount(
			<Form value={{ foo: { bar: 'baz' } }}>
				<ObjectOf name="foo" onChange={handleChange}>
					<Input name="bar" ref={inputRef} />
				</ObjectOf>
			</Form>,
		);
		simulate(inputRef).change('value', 'qux');
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ value: { bar: 'qux' } }),
		);
	});

	test('should trigger ArrayOf.onChange', () => {
		const handleChange = jest.fn();
		const inputRef = createRef();
		mount(
			<Form value={{ foo: ['bar', 'baz'] }}>
				<ArrayOf name="foo" onChange={handleChange}>
					{(list) =>
						list.map((id) => <Input name={id} key={id} ref={inputRef} />)
					}
				</ArrayOf>
			</Form>,
		);
		simulate(inputRef).change('value', 'qux');
		expect(handleChange).toHaveBeenCalledWith(
			expect.objectContaining({ value: ['bar', 'qux'] }),
		);
	});

	test('should not able to access event in an asynchronous way', (done) => {
		const handleChange = jest.fn();
		const inputRef = createRef();
		mount(
			<Form value={{ foo: { bar: 'baz' } }}>
				<ObjectOf name="foo" onChange={handleChange}>
					<Input name="bar" ref={inputRef} />
				</ObjectOf>
			</Form>,
		);
		simulate(inputRef).change('value', 'qux');
		setTimeout(() => {
			expect('value' in handleChange.mock.calls[0][0]).toBe(false);
			done();
		}, 0);
	});
});
