import React, { createRef } from 'react';
import { Form, Input, ObjectOf, ArrayOf } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Input filters', () => {
	test('default value with input filter', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" inputFilter={(v) => v + '!'} />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world!' });
	});

	test('update value prop with input filter', () => {
		const formRef = createRef();
		const state = { hello: 'world' };
		const wrapper = mount(
			<Form ref={formRef} value={state}>
				<Input name="hello" inputFilter={(v) => v + '!'} />
			</Form>,
		);
		wrapper.setProps({ value: { hello: 'chris' } });
		expect(formRef.current.submit()).toEqual({ hello: 'chris!' });
	});

	test('input filter in ObjectOf component', () => {
		const formRef = createRef();
		const value = { hello: { foo: 'bar' } };
		mount(
			<Form ref={formRef} value={value}>
				<ObjectOf
					name="hello"
					inputFilter={(o) => Object.assign(o, { foo: 'baz' })}
				>
					<Input name="foo" />
				</ObjectOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: { foo: 'baz' } });
	});

	test('input filter in ArrayOf component', () => {
		const formRef = createRef();
		const value = { hello: ['foo', 'bar'] };
		const inputFilter = (arr) => {
			arr[1] = 'baz';
			return arr;
		};
		mount(
			<Form ref={formRef} value={value}>
				<ArrayOf name="hello" inputFilter={inputFilter}>
					{(list) => list.map((id) => <Input name={id} key={id} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: ['foo', 'baz'] });
	});

	test('input filter in Form component', () => {
		const formRef = createRef();
		const value = { hello: ['foo', 'bar'] };
		const inputFilter = (o) => {
			o.hello = ['baz', 'qux', 'quux'];
			return o;
		};
		mount(
			<Form ref={formRef} value={value} inputFilter={inputFilter}>
				<ArrayOf name="hello">
					{(list) => list.map((id) => <Input name={id} key={id} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: ['baz', 'qux', 'quux'] });
	});

	test('input filter should not transform typed result', () => {
		const formRef = createRef();
		const inputRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" inputFilter={(v) => v + '!'} ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'chris');
		expect(formRef.current.submit()).toEqual({ hello: 'chris' });
	});

	test('input filter should transform data before rendering', () => {
		const formRef = createRef();
		const value = { hello: { object: true } };
		const inputFilter = (o) => Object.assign(o, { hello: 'world' });
		mount(
			<Form ref={formRef} value={value} inputFilter={inputFilter}>
				<Input name="hello" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});
});

describe('Output filters', () => {
	test('default value with output filter', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" outputFilter={(v) => v + '!'} />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world!' });
	});

	test('update value prop with output filter', () => {
		const formRef = createRef();
		const state = { hello: 'world' };
		const wrapper = mount(
			<Form ref={formRef} value={state}>
				<Input name="hello" outputFilter={(v) => v + '!'} />
			</Form>,
		);
		wrapper.setProps({ value: { hello: 'chris' } });
		expect(formRef.current.submit()).toEqual({ hello: 'chris!' });
	});

	test('output filter in ObjectOf component', () => {
		const formRef = createRef();
		const value = { hello: { foo: 'bar' } };
		mount(
			<Form ref={formRef} value={value}>
				<ObjectOf
					name="hello"
					outputFilter={(o) => Object.assign(o, { foo: 'baz' })}
				>
					<Input name="foo" />
				</ObjectOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: { foo: 'baz' } });
	});

	test('output filter in ArrayOf component', () => {
		const formRef = createRef();
		const value = { hello: ['foo', 'bar'] };
		const outputFilter = (arr) => {
			arr[1] = 'baz';
			return arr;
		};
		mount(
			<Form ref={formRef} value={value}>
				<ArrayOf name="hello" outputFilter={outputFilter}>
					{(list) => list.map((id) => <Input name={id} key={id} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: ['foo', 'baz'] });
	});

	test('output filter in Form component', () => {
		const formRef = createRef();
		const value = { hello: ['foo', 'bar'] };
		const outputFilter = (o) => {
			o.hello = ['baz', 'qux', 'quux'];
			return o;
		};
		mount(
			<Form ref={formRef} value={value} outputFilter={outputFilter}>
				<ArrayOf name="hello">
					{(list) => list.map((id) => <Input name={id} key={id} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: ['baz', 'qux', 'quux'] });
	});

	test('output filter should transform submitting result', () => {
		const formRef = createRef();
		const inputRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" outputFilter={(v) => v + '!'} ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'chris');
		expect(formRef.current.submit()).toEqual({ hello: 'chris!' });
	});
});
