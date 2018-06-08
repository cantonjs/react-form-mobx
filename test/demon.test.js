import React from 'react';
import { Form, Demon } from '../src';
import { mount, unmount } from './utils';

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
				isValid: true,
				isInvalid: false,
				errorMessage: '',
			}),
		);
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
		expect(log).toHaveBeenCalledTimes(2);
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
		expect(log).toHaveBeenCalledTimes(2);
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
		expect(log).toHaveBeenCalledTimes(2);
	});
});
