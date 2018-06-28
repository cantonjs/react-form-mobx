import React, { createRef } from 'react';
import { Form, TextArea } from '../src';
import { mount, unmount } from './utils';

afterEach(unmount);

describe('TextArea component', () => {
	test('should submit typed data', () => {
		const formRef = createRef();
		mount(
			<Form value={{ foo: 'hello\nworld' }} ref={formRef}>
				<TextArea name="foo" />
			</Form>,
		);
		expect(formRef.current.submit()).toEqual({ foo: 'hello\nworld' });
	});
});
