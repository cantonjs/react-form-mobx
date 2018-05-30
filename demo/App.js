import React, { Component, createRef } from 'react';
import { Form, Submit, Reset, Clear, ObjectOf, ArrayOf } from '../src';
import Input from './Input';
import Checkbox from './Checkbox';

export default class App extends Component {
	state = {
		name: 'Luke Skywalker',
		height: 172,
		starships: ['X-wing', 'Imperial shuttle'],
		colors: {
			hair: 'blond',
			skin: 'fair',
		},
		checkboxes: ['foo', 'baz'],
	};

	formRef = createRef();

	componentDidMount() {
		// setTimeout(() => {
		// 	this.setState(() => ({
		// 		height: 200,
		// 	}));
		// }, 2000);

		// setTimeout(() => {
		// 	console.log(this.formRef.current.submit());
		// }, 4000);

		setTimeout(() => {
			this.formRef.current.reset();
		}, 4000);
	}

	handleSubmit = (formData, { isValid }) => {
		if (isValid) {
			console.log('submit', formData);
			this.setState(() => formData);
		}
		else {
			console.warn('invalid');
		}
	};

	handleValid = () => {
		console.log('valid');
	};

	handleInvalid = () => {
		console.log('invalid');
	};

	render() {
		return (
			<Form
				value={this.state}
				onSubmit={this.handleSubmit}
				onValid={this.handleValid}
				onInvalid={this.handleInvalid}
				ref={this.formRef}
			>
				<Input
					label="name"
					name="name"
					validation={(val) => /a/.test(val)}
					required
				/>
				<Input label="height" name="height" dataType="integer" />
				<ArrayOf name="starships">
					{(starships, { push, removeBy }) => (
						<div>
							{starships.map((starship) => (
								<div key={starship}>
									<Input
										label="starship"
										name={starship}
										display="inline-block"
									/>
									<button type="button" onClick={removeBy(starship)}>
										remove
									</button>
								</div>
							))}
							<button type="button" onClick={push}>
								add item
							</button>
						</div>
					)}
				</ArrayOf>
				<ObjectOf name="colors">
					<Input label="hair color" name="hair" />
					<Input label="skin color" name="skin" />
				</ObjectOf>

				<Checkbox label="foo" value="foo" name="checkboxes" />
				<Checkbox label="bar" value="bar" name="checkboxes" />
				<Checkbox label="baz" value="baz" name="checkboxes" />

				<Submit>submit</Submit>
				<Reset>reset</Reset>
				<Clear>clear</Clear>
			</Form>
		);
	}
}
