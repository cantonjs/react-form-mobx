import React, { createRef } from 'react';
import { Form, Demon } from '../src';
import { mount, unmount, simulate } from './utils';
import { observable } from 'mobx';

afterEach(unmount);

describe('Demon component', () => {
	test('should children callback be called', () => {
		const children = jest.fn(() => <span />);
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello', defaultValue: 'world' }}>
					{children}
				</Demon>
			</Form>,
		);
		expect(children).toHaveBeenCalledWith(
			expect.objectContaining({
				value: 'world',
				onChange: expect.any(Function),
				onKeyPress: expect.any(Function),
				onBlur: expect.any(Function),
			}),
			expect.objectContaining({
				isTouched: false,
				isValid: true,
				isInvalid: false,
				errorMessage: '',
			}),
		);
	});

	test('should array value be native array', () => {
		const children = jest.fn(() => <span />);
		const demonRef = createRef();
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{children}
				</Demon>
			</Form>,
		);
		demonRef.current.setValue(observable(['foo', 'bar']));
		const lastCall = children.mock.calls[children.mock.calls.length - 1];
		expect(Array.isArray(lastCall[0].value)).toBe(true);
	});
});

describe('Catching errors on events', () => {
	let nativeConsoleError = console.error;
	afterAll(() => {
		console.error = nativeConsoleError.bind(console);
	});

	test('should catch error if `getValueFromChangeEvent` failed', () => {
		const log = jest.fn();
		console.error = log;
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello' }}>
					{({ onChange }) => {
						onChange();
						return <span />;
					}}
				</Demon>
			</Form>,
		);
		expect(log).toHaveBeenCalled();
	});

	test('should catch error if `getCheckedFromChangeEvent` failed', () => {
		const log = jest.fn();
		console.error = log;
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello' }} checkable>
					{({ onChange }) => {
						onChange();
						return <span />;
					}}
				</Demon>
			</Form>,
		);
		expect(log).toHaveBeenCalled();
	});

	test('should catch error if `getKeyFromKeyPressEvent` failed', () => {
		const log = jest.fn();
		console.error = log;
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello' }} checkable>
					{({ onKeyPress }) => {
						onKeyPress();
						return <span />;
					}}
				</Demon>
			</Form>,
		);
		expect(log).toHaveBeenCalled();
	});
});

describe('isTouched', () => {
	test('should `isTouched` be false by default', () => {
		const children = jest.fn((props) => <input {...props} />);
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello' }}>{children}</Demon>
			</Form>,
		);
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isTouched: false }),
		);
	});

	test('should `isTouched` be true after blured', () => {
		const inputRef = createRef();
		const children = jest.fn((props) => <input {...props} ref={inputRef} />);
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello' }}>{children}</Demon>
			</Form>,
		);
		simulate(inputRef).blur();
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isTouched: true }),
		);
	});

	test('should `isTouched` be true after typed', () => {
		const inputRef = createRef();
		const children = jest.fn((props) => <input {...props} ref={inputRef} />);
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello' }}>{children}</Demon>
			</Form>,
		);
		simulate(inputRef).change('value', 'chris');
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isTouched: true }),
		);
	});

	test('should `isTouched` be true after typed and invalid', () => {
		const inputRef = createRef();
		const children = jest.fn((props) => <input {...props} ref={inputRef} />);
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello', required: true }}>
					{children}
				</Demon>
			</Form>,
		);
		simulate(inputRef).change('value', '');
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isTouched: true }),
		);
	});

	test('should `isTouched` be true after submitted', () => {
		const formRef = createRef();
		const children = jest.fn((props) => <input {...props} />);
		mount(
			<Form ref={formRef}>
				<Demon forwardedProps={{ name: 'hello' }}>{children}</Demon>
			</Form>,
		);
		formRef.current.submit();
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isTouched: true }),
		);
	});

	test('should `isTouched` be false after set new value', () => {
		const value = { hello: 'world' };
		const formRef = createRef();
		const children = jest.fn((props) => <input {...props} />);
		const wrapper = mount(
			<Form value={value} ref={formRef}>
				<Demon forwardedProps={{ name: 'hello' }}>{children}</Demon>
			</Form>,
		);
		formRef.current.submit();
		wrapper.setProps({ value: { hello: 'chris' } });
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isTouched: false }),
		);
	});

	test('should `isTouched` be true after form.clear()', () => {
		const value = { hello: 'world' };
		const formRef = createRef();
		const children = jest.fn((props) => <input {...props} />);
		mount(
			<Form value={value} ref={formRef}>
				<Demon forwardedProps={{ name: 'hello' }}>{children}</Demon>
			</Form>,
		);
		formRef.current.clear();
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isTouched: true }),
		);
	});
});

describe('isValid', () => {
	test('should `isValid` be true by default', () => {
		const children = jest.fn((props) => <input {...props} />);
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello' }}>{children}</Demon>
			</Form>,
		);
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isValid: true }),
		);
	});

	test('should `isValid` be false if missing required field', () => {
		const children = jest.fn((props) => <input {...props} />);
		mount(
			<Form>
				<Demon forwardedProps={{ name: 'hello', required: true }}>
					{children}
				</Demon>
			</Form>,
		);
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isValid: false }),
		);
	});

	test('should `isValid` be false if failed to format', () => {
		const value = { hello: 'world' };
		const children = jest.fn((props) => <input {...props} />);
		mount(
			<Form value={value}>
				<Demon forwardedProps={{ name: 'hello', format: 'number' }}>
					{children}
				</Demon>
			</Form>,
		);
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isValid: false }),
		);
	});

	test('should `isValid` be false after typed invalid value', () => {
		const value = { hello: 20 };
		const inputRef = createRef();
		const children = jest.fn((props) => <input {...props} ref={inputRef} />);
		mount(
			<Form value={value}>
				<Demon forwardedProps={{ name: 'hello', format: 'number' }}>
					{children}
				</Demon>
			</Form>,
		);
		simulate(inputRef).change('value', 'chris');
		expect(children).toHaveBeenLastCalledWith(
			expect.any(Object),
			expect.objectContaining({ isValid: false }),
		);
	});

	test('should `isValid` be false after set invalid value', () => {
		const value = { hello: 20 };
		const children = jest.fn((props) => <input {...props} />);
		const wrapper = mount(
			<Form value={value}>
				<Demon forwardedProps={{ name: 'hello', format: 'number' }}>
					{children}
				</Demon>
			</Form>,
		);
		wrapper.setProps({ value: { hello: 'chris' } });
		expect(children).toHaveBeenLastCalledWith(
			expect.any(Object),
			expect.objectContaining({ isValid: false }),
		);
	});

	test('should `isValid` be false if inputFilter throw error', () => {
		const value = { hello: 'world' };
		const children = jest.fn((props) => <input {...props} />);
		mount(
			<Form value={value}>
				<Demon
					forwardedProps={{
						name: 'hello',
						inputFilter() {
							throw new Error();
						},
					}}
				>
					{children}
				</Demon>
			</Form>,
		);
		expect(children).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ isValid: false }),
		);
	});
});

describe('Demon instance methods', () => {
	test('should `getValue()` work', () => {
		const demonRef = createRef();
		mount(
			<Form value={{ hello: 'world' }}>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{() => <span />}
				</Demon>
			</Form>,
		);
		expect(demonRef.current.getValue()).toBe('world');
	});

	test('should `setValue()` work', () => {
		const formRef = createRef();
		const demonRef = createRef();
		mount(
			<Form value={{ hello: 'world' }} ref={formRef}>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{() => <span />}
				</Demon>
			</Form>,
		);
		demonRef.current.setValue('chris');
		expect(demonRef.current.getValue()).toBe('chris');
		expect(formRef.current.submit()).toEqual({ hello: 'chris' });
	});

	test('should `getPristineValue()` work', () => {
		const demonRef = createRef();
		mount(
			<Form value={{ hello: 'world' }}>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{() => <span />}
				</Demon>
			</Form>,
		);
		expect(demonRef.current.getPristineValue()).toBe('world');
		demonRef.current.setValue('chris');
		expect(demonRef.current.getPristineValue()).toBe('world');
	});

	test('should `setPristineValue()` work', () => {
		const formRef = createRef();
		const demonRef = createRef();
		mount(
			<Form value={{ hello: 'world' }} ref={formRef}>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{() => <span />}
				</Demon>
			</Form>,
		);
		demonRef.current.setPristineValue('chris');
		expect(demonRef.current.getValue()).toBe('chris');
		expect(demonRef.current.getPristineValue()).toBe('chris');
		expect(formRef.current.submit()).toEqual({ hello: 'chris' });
	});

	test('should `getValidState()` work', () => {
		const demonRef = createRef();
		mount(
			<Form value={{ hello: 'world' }}>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{() => <span />}
				</Demon>
			</Form>,
		);
		expect(demonRef.current.getValidState()).toMatchObject({
			isValid: true,
			isInvalid: false,
			isTouched: false,
			errorMessage: '',
		});
	});

	test('should `submit()` work', () => {
		const demonRef = createRef();
		mount(
			<Form value={{ hello: 'world' }}>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{() => <span />}
				</Demon>
			</Form>,
		);
		expect(demonRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('should `clear()` work', () => {
		const demonRef = createRef();
		mount(
			<Form value={{ hello: 'world' }}>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{() => <span />}
				</Demon>
			</Form>,
		);
		expect(demonRef.current.clear()).toEqual({});
	});

	test('should `reset()` work', () => {
		const demonRef = createRef();
		mount(
			<Form value={{ hello: 'world' }}>
				<Demon forwardedProps={{ name: 'hello' }} ref={demonRef}>
					{() => <span />}
				</Demon>
			</Form>,
		);
		demonRef.current.setValue('chris');
		expect(demonRef.current.reset()).toEqual({ hello: 'world' });
	});
});
