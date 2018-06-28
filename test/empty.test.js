import React, { createRef } from 'react';
import { Form, Input, ObjectOf, ArrayOf } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Submitting empty data with empty pristine value', () => {
	test('should be an empty object without value prop', () => {
		const formRef = createRef();
		mount(<Form ref={formRef} />);
		expect(formRef.current.submit()).toEqual({});
	});

	test('should not submit empty input', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<Input name="foo" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should not submit empty object', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<ObjectOf name="foo">
					<Input name="bar" />
				</ObjectOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should not submit empty array', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<ArrayOf name="foo">
					{(list) => list.map((item) => <Input key={item} name={item} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should submit empty data if `withEmpty` is `true`', () => {
		const formRef = createRef();
		mount(
			<Form value={{}} ref={formRef}>
				<Input name="hello" withEmpty />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: '' });
	});

	test('should submit empty object if `withEmpty` is `true`', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<ObjectOf name="foo" withEmpty>
					<Input name="bar" />
				</ObjectOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world', foo: {} });
	});

	test('should submit nested empty data if `withEmpty` is `true`', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<ObjectOf name="foo" withEmpty>
					<Input name="bar" withEmpty />
				</ObjectOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({
			hello: 'world',
			foo: { bar: '' },
		});
	});

	test('should submit empty array if `withEmpty` is `true`', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
				<ArrayOf name="foo" withEmpty>
					{(list) => list.map((item) => <Input key={item} name={item} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world', foo: [] });
	});

	test('should be null if invalid', () => {
		const formRef = createRef();
		mount(
			<Form value={{ hello: '' }} ref={formRef}>
				<Input name="hello" required />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual(null);
	});
});

describe('Submitting empty data with pristine value', () => {
	test('should submit empty data', () => {
		const formRef = createRef();
		const inputRef = createRef();
		mount(
			<Form value={{ hello: 'world' }} ref={formRef}>
				<Input name="hello" ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', '');
		expect(formRef.current.submit()).toEqual({ hello: '' });
	});

	test('should not submit empty data if `withEmpty` is `false`', () => {
		const formRef = createRef();
		const inputRef = createRef();
		mount(
			<Form value={{ hello: 'world' }} ref={formRef}>
				<Input name="hello" ref={inputRef} withEmpty={false} />
			</Form>,
		);
		simulate(inputRef).change('value', '');
		expect(formRef.current.submit()).toEqual({});
	});

	test('should submit empty array', () => {
		const value = { foo: ['bar'] };
		const formRef = createRef();
		const buttonRef = createRef();
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="foo">
					{(list, { remove }) =>
						list.map((id) => (
							<div key={id}>
								<Input key={id} name={id} />
								<button
									type="button"
									onClick={() => remove(id)}
									ref={buttonRef}
								/>
							</div>
						))
					}
				</ArrayOf>
			</Form>,
		);
		simulate(buttonRef).click();
		expect(formRef.current.submit()).toEqual({ foo: [] });
	});

	test('should not submit empty array if `withEmpty` is `false`', () => {
		const value = { foo: ['bar'] };
		const formRef = createRef();
		const buttonRef = createRef();
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="foo" withEmpty={false}>
					{(list, { remove }) =>
						list.map((id) => (
							<div key={id}>
								<Input key={id} name={id} />
								<button
									type="button"
									onClick={() => remove(id)}
									ref={buttonRef}
								/>
							</div>
						))
					}
				</ArrayOf>
			</Form>,
		);
		simulate(buttonRef).click();
		expect(formRef.current.submit()).toEqual({});
	});
});
