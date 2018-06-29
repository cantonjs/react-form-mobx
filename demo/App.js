import React, { Component } from 'react';
import { Form, Submit, Clear, ObjectOf, ArrayOf } from 'react-form-mobx';
import Input from './Input';
import Console from './Console';
import GithubCorner from 'react-github-corner';

const projectURL = 'https://github.com/cantonjs/react-form-mobx';

export default class App extends Component {
	state = {
		data: {
			name: 'Luke Skywalker',
			height: 172,
			starships: ['X-wing', 'Imperial shuttle'],
			colors: {
				hair: 'blond',
				skin: 'fair',
			},
		},
		isValid: true,
	};

	handleSubmit = (data, { isValid }) => {
		if (isValid) {
			this.setState(() => ({ data }));
		}
		else {
			console.warn('invalid');
		}
	};

	handleValid = () => {
		this.setState(() => ({ isValid: true }));
	};

	handleInvalid = () => {
		this.setState(() => ({ isValid: false }));
	};

	render() {
		const { data, isValid } = this.state;
		return (
			<div className="container">
				<GithubCorner href={projectURL} />
				<Console className="console" data={data} />
				<Form
					className="form"
					value={data}
					onSubmit={this.handleSubmit}
					onValid={this.handleValid}
					onInvalid={this.handleInvalid}
				>
					<Input label="name" name="name" pattern={/^[\w ]+$/} required />
					<Input label="height" name="height" format="integer" />
					<ArrayOf name="starships">
						{(starships, { push, removeBy }) => (
							<div className="array">
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
									add starship
								</button>
							</div>
						)}
					</ArrayOf>
					<ObjectOf name="colors">
						<Input label="hair color" name="hair" defaultValue="black" />
						<Input label="skin color" name="skin" />
					</ObjectOf>

					<div className="actions">
						<Submit disabled={!isValid}>submit</Submit>
						<Clear>clear</Clear>
					</div>
				</Form>
			</div>
		);
	}
}
