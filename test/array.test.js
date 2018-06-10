import React, { createRef } from 'react';
import { Form, Input, ArrayOf, Radio, Checkbox } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

describe('ArrayOf component with function children', () => {
	test('should ArrayOf component work with callback', () => {
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

	test('should nested array work', () => {
		const formRef = createRef();
		const value = { hello: [['foo', 'bar'], ['baz', 'qux']] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="hello">
					{(outerArray) =>
						outerArray.map((outerItem) => (
							<ArrayOf name={outerItem} key={outerItem}>
								{(innerArray) =>
									innerArray.map((innerItem) => (
										<Input name={innerItem} key={innerItem} />
									))
								}
							</ArrayOf>
						))
					}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({
			hello: [['foo', 'bar'], ['baz', 'qux']],
		});
	});

	test('should array of radio groups work', () => {
		const formRef = createRef();
		const value = { hello: ['yes', 'no', 'yes'] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="hello">
					{(arr) =>
						arr.map((item) => (
							<div key={item}>
								<Radio name={item} value="yes" />
								<Radio name={item} value="no" />
							</div>
						))
					}
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({
			hello: ['yes', 'no', 'yes'],
		});
	});
});

describe('ArrayOf component with node children', () => {
	test('should ArrayOf component work with children', () => {
		const formRef = createRef();
		const value = { foo: ['bar', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="foo">
					<Input />
					<Input />
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ foo: ['bar', 'baz'] });
	});

	test('should array of checkboxes work', () => {
		const formRef = createRef();
		const value = { foo: ['bar', 'baz'] };
		mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="foo">
					<Checkbox value="bar" />
					<Checkbox value="baz" />
					<Checkbox value="qux" />
				</ArrayOf>
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ foo: ['bar', 'baz'] });
	});
});

describe('Updating value in ArrayOf component', () => {
	test('should override array after setting new props', () => {
		const formRef = createRef();
		const value = { hello: ['bar', 'baz'] };
		const wrapper = mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="hello">
					{(list) => list.map((id) => <Input key={id} name={id} />)}
				</ArrayOf>
			</Form>,
		);
		wrapper.setProps({ value: { hello: ['qux'] } });
		expect(formRef.current.submit()).toEqual({ hello: ['qux'] });
	});

	test('should override array if new array length greater than the prev one', () => {
		const formRef = createRef();
		const value = { hello: ['bar'] };
		const wrapper = mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="hello">
					{(list) => list.map((id) => <Input key={id} name={id} />)}
				</ArrayOf>
			</Form>,
		);
		wrapper.setProps({ value: { hello: ['foo', 'bar'] } });
		expect(formRef.current.submit()).toEqual({ hello: ['foo', 'bar'] });
	});

	test('should override array if new array length less than the prev one', () => {
		const formRef = createRef();
		const value = { hello: ['foo', 'bar'] };
		const wrapper = mount(
			<Form value={value} ref={formRef}>
				<ArrayOf name="hello">
					{(list) => list.map((id) => <Input key={id} name={id} />)}
				</ArrayOf>
			</Form>,
		);
		wrapper.setProps({ value: { hello: ['baz'] } });
		expect(formRef.current.submit()).toEqual({ hello: ['baz'] });
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
