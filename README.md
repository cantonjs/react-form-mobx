# react-form-mobx

## WTF

```js
import React, { Component, Fragment } from 'react';
import { Form, Input, ArrayOf, ObjectOf } from 'react-form-mobx';

export default class MyFriend extends Component {
  myData = {
    name: 'Luke Skywalker',
    height: 172,
    starships: ['X-wing', 'Imperial shuttle'],
    colors: {
      hair: 'blond',
      skin: 'fair',
    },
  },

  handleSubmit = (data) => {
    console.log('data', data);
  };

  render() {
    return (
      <Form value={this.myData} onSubmit={this.handleSubmit}>
        <Input name="name" />
        <Input name="height" dataType="number" />
        <ArrayOf name="starships">
          {(starships, helper) => starships.map((starship) =>
            <Input name={starship} key={starship} />
          )}
        </ArrayOf>
        <ObjectOf name="colors">
          <Input name="hair" />
          <Input name="skin" />
        </ObjectOf>
      </Form>
    );
  }
}
```

## Creating Custom Input Component

```js
import React, { Component } from "react";
import { Demon } from "react-form-mobx";

export default class MyInput extends Component {
  render() {
    return (
      <Demon {...this.props}>
        {({ label, isRequired, isInvalid, errorMessage, ...other }) => (
          <label>
            <span>
              {label} {isRequired ? "*" : ""}
            </span>
            <input
              style={{ borderColor: isInvalid ? "red" : "green" }}
              {...other}
            />
            {isInvalid && <span style={{ color: "red" }}>{errorMessage}</span>}
          </label>
        )}
      </Demon>
    );
  }
}
```

## License

MIT
