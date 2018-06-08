import React, { createRef } from 'react';
import { Form, Input, ObjectOf, Submit } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('Submit component', () => {
	test('click submit button', () => {
		const buttonRef = createRef();
		const value = { hello: 'world' };
		const handleSubmit = jest.fn();
		mount(
			<Form value={value} onSubmit={handleSubmit}>
				<Input name="hello" />
				<Submit ref={buttonRef} />
			</Form>,
		);
		simulate(buttonRef).click();
		expect(handleSubmit).toHaveBeenCalledWith(
			{ hello: 'world' },
			{ isValid: true },
		);
	});

	test('press ENTER key to submit', () => {
		const buttonRef = createRef();
		const value = { hello: 'world' };
		const handleSubmit = jest.fn();
		mount(
			<Form value={value} onSubmit={handleSubmit}>
				<Input name="hello" />
				<Submit ref={buttonRef} />
			</Form>,
		);
		simulate(buttonRef).keyPress('Enter');
		expect(handleSubmit).toHaveBeenCalledWith(
			{ hello: 'world' },
			{ isValid: true },
		);
	});

	test('should onClick() work', () => {
		const handleClick = jest.fn();
		const buttonRef = createRef();
		mount(
			<Form>
				<Submit ref={buttonRef} onClick={handleClick} />
			</Form>,
		);
		simulate(buttonRef).click();
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test('should onKeyPress() work', () => {
		const handlePress = jest.fn();
		const buttonRef = createRef();
		mount(
			<Form>
				<Submit ref={buttonRef} onKeyPress={handlePress} />
			</Form>,
		);
		simulate(buttonRef).keyPress('Enter');
		expect(handlePress).toHaveBeenCalledTimes(1);
	});
});

describe('submit', () => {
	test('submitting basic', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('submitting nested objects', () => {
		const formRef = createRef();
		const value = { foo: { bar: { baz: 'hello' } } };
		mount(
			<Form value={value} ref={formRef}>
				<ObjectOf name="foo">
					<ObjectOf name="bar">
						<Input name="baz" />
					</ObjectOf>
				</ObjectOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({
			foo: { bar: { baz: 'hello' } },
		});
	});
});

describe('Submitting empty data', () => {
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

	test('should submit empty data if input has `enforceSubmit` prop', () => {
		const formRef = createRef();
		mount(
			<Form value={{}} ref={formRef}>
				<Input name="hello" enforceSubmit />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: '' });
	});

	test('should submit empty data if original data is not empty', () => {
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
