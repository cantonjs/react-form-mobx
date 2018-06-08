import React, { createRef } from 'react';
import { Form, Input } from '../src';
import { mount, unmount, simulate } from './utils';

afterEach(unmount);

// TODO:
// describe.only('Error handling', () => {
// 	test('should be invalid if something wrong', () => {
// 		const formRef = createRef();
// 		const value = { hello: 'world' };
// 		const inputFilter = () => {
// 			throw new Error();
// 		};
// 		mount(
// 			<Form value={value} ref={formRef}>
// 				<Input name="hello" inputFilter={inputFilter} />
// 			</Form>,
// 		);
// 		expect(formRef.current.getValidState()).toEqual(
// 			expect.objectContaining({
// 				isInvalid: true,
// 				errorMessage: 'Invalid',
// 			}),
// 		);
// 	});
// });

describe('Form validation event props', () => {
	test('should trigger onValid', () => {
		const validHandler = jest.fn();
		const inputRef = createRef();
		const value = {};
		mount(
			<Form value={value} onValid={validHandler}>
				<Input name="hello" required ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', 'world');
		expect(validHandler).toHaveBeenCalledTimes(1);
	});

	test('should trigger onInvalid', () => {
		const invalidHandler = jest.fn();
		const inputRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} onInvalid={invalidHandler}>
				<Input name="hello" required ref={inputRef} />
			</Form>,
		);
		simulate(inputRef).change('value', '');
		expect(invalidHandler).toHaveBeenCalledTimes(1);
	});
});

describe('validation prop', () => {
	test('should be invalid if fail to validate', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		const validation = () => false;
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" validation={validation} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to validate', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		const validation = () => true;
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" validation={validation} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('required prop', () => {
	test('should be invalid if required field is empty', () => {
		const formRef = createRef();
		const value = { hello: '' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" required />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if required field is not empty', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" required />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('enum prop', () => {
	test('should be invalid if fail to enum', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" enum={['foo', 'bar']} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to enum', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" enum={['foo', 'bar']} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('pattern prop', () => {
	test('should be invalid if fail to pattern', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" pattern={/^f/} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to pattern', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" pattern={/^f/} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('maxLength prop', () => {
	test('should be invalid if fail to maxLength', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" maxLength={1} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to maxLength', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" maxLength={10} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('minLength prop', () => {
	test('should be invalid if fail to minLength', () => {
		const formRef = createRef();
		const value = { hello: 'world' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" minLength={10} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to minLength', () => {
		const formRef = createRef();
		const value = { hello: 'foo' };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="hello" minLength={1} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('maximum prop', () => {
	test('should be invalid if fail to maximum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" maximum={30} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to maximum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" maximum={100} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});

	test('should be valid if equal to maximum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" maximum={32} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('exclusiveMaximum prop', () => {
	test('should be invalid if fail to exclusiveMaximum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" exclusiveMaximum={30} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to exclusiveMaximum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" exclusiveMaximum={100} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});

	test('should be invalid if equal to exclusiveMaximum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" exclusiveMaximum={32} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});
});

describe('minimum prop', () => {
	test('should be invalid if fail to minimum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" minimum={100} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to minimum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" minimum={30} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});

	test('should be valid if equal to minimum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" minimum={32} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});
});

describe('exclusiveMinimum prop', () => {
	test('should be invalid if fail to exclusiveMinimum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" exclusiveMinimum={100} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});

	test('should be valid if success to exclusiveMinimum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" exclusiveMinimum={30} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: true,
			}),
		);
	});

	test('should be invalid if equal to exclusiveMinimum', () => {
		const formRef = createRef();
		const value = { num: 32 };
		mount(
			<Form value={value} ref={formRef}>
				<Input name="num" exclusiveMinimum={32} />
			</Form>,
		);
		expect(formRef.current.getValidState()).toEqual(
			expect.objectContaining({
				isValid: false,
			}),
		);
	});
});
