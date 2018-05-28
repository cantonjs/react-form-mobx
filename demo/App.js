import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox, ObjectOf, ArrayOf } from '../src';

const InputItem = function InputItem({ label, display, component, ...other }) {
	const Comp = component;
	return (
		<div style={{ margin: '1em', display }}>
			<label>
				<span>{label}</span>
				<Comp {...other} />
			</label>
		</div>
	);
};

InputItem.propTypes = {
	label: PropTypes.string.isRequired,
	component: PropTypes.any,
	display: PropTypes.oneOf(['inline-block', 'block']),
};

InputItem.defaultProps = {
	component: Input,
	display: 'block',
};

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

	handleSubmit = (formData) => {
		console.log('submit', formData);
		this.setState(() => formData);
	};

	render() {
		return (
			<Form value={this.state} onSubmit={this.handleSubmit} ref={this.formRef}>
				<InputItem label="name" name="name" />
				<InputItem label="height" name="height" />
				<ArrayOf name="starships">
					{(starships, helper) => (
						<div>
							{starships.map((starship) => (
								<div key={starship}>
									<InputItem
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
					<InputItem label="hair color" name="hair" />
					<InputItem label="skin color" name="skin" />
				</ObjectOf>

				<InputItem
					component={Checkbox}
					label="foo"
					value="foo"
					name="checkboxes"
				/>
				<InputItem
					component={Checkbox}
					label="bar"
					value="bar"
					name="checkboxes"
				/>
				<InputItem
					component={Checkbox}
					label="baz"
					value="baz"
					name="checkboxes"
				/>
			</Form>
		);
	}
}
