import React, { Component, createRef } from 'react';
import { Form, ObjectOf, ArrayOf } from '../src';
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
		setTimeout(() => {
			this.setState(() => ({
				height: 200,
			}));
		}, 2000);

		setTimeout(() => {
			console.log(this.formRef.current.submit());
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
					{(starships, helper) => (
						<div>
							{starships.map((starship) => (
								<div key={starship}>
									<Input
										label="starship"
										name={starship}
										display="inline-block"
									/>
									<button type="button" onClick={() => helper.remove(starship)}>
										remove
									</button>
								</div>
							))}
							<button type="button" onClick={helper.push}>
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
			</Form>
		);
	}
}
