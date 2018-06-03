import React, { createRef } from 'react';
import { Form, Input, ArrayOf, ObjectOf } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Typing', () => {
	test('should submit typed data', () => {
		const formRef = createRef();
		const inputRef = createRef();
		mount(
			<Form value={{ hello: 'world' }} ref={formRef}>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'chris');
		expect(formRef.current.submit()).toEqual({ hello: 'chris' });
	});

	test('should submit typed data in nested object', () => {
		const formRef = createRef();
		const inputRef = createRef();
		mount(
			<Form value={{ foo: { bar: 'baz' } }} ref={formRef}>
				<ObjectOf name="foo">
					<Input name="bar" ref={inputRef} />
				</ObjectOf>
			</Form>,
		);
		simulate(inputRef).change('value', 'qux');
		expect(formRef.current.submit()).toEqual({ foo: { bar: 'qux' } });
	});

	test('should submit typed data in array', () => {
		const formRef = createRef();
		const inputRef = createRef();
		mount(
			<Form value={{ foo: ['bar', 'baz'] }} ref={formRef}>
				<ArrayOf name="foo">
					{(list) =>
						list.map((id) => <Input name={id} key={id} ref={inputRef} />)
					}
				</ArrayOf>
			</Form>,
		);
		simulate(inputRef).change('value', 'qux');
		expect(formRef.current.submit()).toEqual({ foo: ['bar', 'qux'] });
	});
});
