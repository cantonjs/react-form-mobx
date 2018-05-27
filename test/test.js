import React, { createRef } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Form, Input, ArrayOf, ObjectOf } from '../src';
// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// configure({ adapter: new Adapter() });

let div;
const mount = (element) => {
	div = document.createElement('div');
	render(element, div);
};

const unmount = () => {
	if (div) {
		unmountComponentAtNode(div);
		div = null;
	}
};

afterEach(unmount);

describe('Submitting', () => {
	test('submitting basic', function () {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ hello: 'world' });
	});

	test('submitting array', function () {
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

	test('submitting nested objects', function () {
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
