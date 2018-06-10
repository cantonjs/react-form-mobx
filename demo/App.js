import React, { Component, createRef } from 'react';
import { Form, Submit, Reset, Clear, ObjectOf, ArrayOf } from '../src';
import Input from './Input';
import Checkbox from './Checkbox';
import Radio from './Radio';

export default class App extends Component {
	state = {
		name: 'Luke Skywalker',
		height: 172,
		starships: ['X-wing', 'Imperial shuttle'],
		colors: {
			// hair: 'blond',
			skin: 'fair',
		},
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
		// setTimeout(() => {
		// 	this.formRef.current.reset();
		// }, 4000);
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
				<Input label="height" name="height" format="integer" />
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
					<Input label="hair color" name="hair" defaultValue="black" />
					<Input label="skin color" name="skin" />
				</ObjectOf>

				<ArrayOf name="checkboxes">
					<Checkbox label="foo" value="foo" />
					<Checkbox label="bar" value="bar" />
					<Checkbox label="baz" value="baz" />
				</ArrayOf>
				<Checkbox label="checkbox" value="shit" name="checkbox" />

				<Radio label="yes" value={true} name="radio" />
				<Radio label="no" value={false} name="radio" />

				<Submit>submit</Submit>
				<Reset>reset</Reset>
				<Clear>clear</Clear>
			</Form>
		);
	}
}
