import React, { createRef } from 'react';
import { Form, Input, ArrayOf } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('ArrayOf component', () => {
	test('should ArrayOf component work', () => {
		const formRef = createRef();
		const value = { foo: ['bar', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="foo">
					{(arr) => arr.map((item) => <Input name={item} key={item} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ foo: ['bar', 'baz'] });
	});

	test('should not submit empty array', () => {
		const formRef = createRef();
		mount(
			<Form ref={formRef}>
				<ArrayOf name="foo">
					{(list) => list.map((id) => <Input key={id} name={id} />)}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({});
	});
});

describe('ArrayOf callback render helper', () => {
	test('should callback render helper arguments work', () => {
		const value = { foo: ['bar'] };
		const callbackRenderer = jest.fn(() => null);
		mount(
			<Form value={value}>
				<ArrayOf name="foo">{callbackRenderer}</ArrayOf>
			</Form>,
		);
		expect(callbackRenderer).toHaveBeenCalledWith(
			expect.any(Array),
			expect.objectContaining({
				push: expect.any(Function),
				remove: expect.any(Function),
				removeBy: expect.any(Function),
			}),
		);
	});

	test('should `helper.push()` work', () => {
		const value = { foo: ['bar'] };
		const formRef = createRef();
		const buttonRef = createRef();
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="foo">
					{(list, { push }) => (
						<div>
							{list.map((id) => <Input key={id} name={id} />)}
							<button type="button" onClick={push} ref={buttonRef} />
						</div>
					)}
				</ArrayOf>
			</Form>,
		);
		simulate(buttonRef).click();
		expect(formRef.current.submit()).toEqual({ foo: ['bar', undefined] });
	});

	test('should `helper.remove()` work', () => {
		const value = { foo: ['bar', 'baz'] };
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
		expect(formRef.current.submit()).toEqual({ foo: ['bar'] });
	});

	test('should `helper.removeBy()` work', () => {
		const value = { foo: ['bar', 'baz'] };
		const formRef = createRef();
		const buttonRef = createRef();
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="foo">
					{(list, { removeBy }) =>
						list.map((id) => (
							<div key={id}>
								<Input key={id} name={id} />
								<button type="button" onClick={removeBy(id)} ref={buttonRef} />
							</div>
						))
					}
				</ArrayOf>
			</Form>,
		);
		simulate(buttonRef).click();
		expect(formRef.current.submit()).toEqual({ foo: ['bar'] });
	});
});
