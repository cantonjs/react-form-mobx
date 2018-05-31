import React, { createRef } from 'react';
import { Form, Input, ArrayOf, ObjectOf, Reset } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Reset component', () => {
	test('click reset button', () => {
		const formRef = createRef();
		const inputRef = createRef();
		const buttonRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" ref={inputRef} />
				<Reset ref={buttonRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'foo');
		simulate(buttonRef).click();
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});
});

describe('form.reset()', () => {
	test('reset input', () => {
		const formRef = createRef();
		const inputRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'foo');
		formRef.current.reset();
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('reset object', () => {
		const formRef = createRef();
		const inputRef = createRef();
		const value = { hello: { foo: 'bar' } };
		mount(
			<Form value={value} ref={formRef}>
				<ObjectOf name="hello">
					<Input name="foo" ref={inputRef} />
				</ObjectOf>
			</Form>,
		);
		simulate(inputRef).change('value', 'foo');
		formRef.current.reset();
		expect(formRef.current.submit()).toEqual({ hello: { foo: 'bar' } });
	});

	test('reset array', () => {
		const formRef = createRef();
		const inputRef = createRef();
		const value = { hello: ['foo', 'bar', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="hello">
					{(list) =>
						list.map((id) => <Input name={id} key={id} ref={inputRef} />)
					}
				</ArrayOf>
			</Form>,
		);
		simulate(inputRef).change('value', 'qux');
		formRef.current.reset();
		expect(formRef.current.submit()).toEqual({ hello: ['foo', 'bar', 'baz'] });
	});
});
