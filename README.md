# [WIP] react-form-mobx

[![Build Status](https://travis-ci.org/cantonjs/react-form-mobx.svg?branch=master)](https://travis-ci.org/cantonjs/react-form-mobx)

Declarative Form components for [React](https://reactjs.org/), built on top of [MobX](https://mobx.js.org/)

![screenshot](/.github/screenshot.png)

## WTF

```jsx
import React, { Component } from 'react';
import { Form, Input, Checkbox, ObjectOf } from 'react-form-mobx';

export default class MyFriend extends Component {
  myData = {
    name: 'Luke Skywalker',
    height: 172,
    films: ['A New Hope', 'The Empire Strikes Back', 'Return of the Jedi'],
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
        <Checkbox name="films" value="A New Hope" />
        <Checkbox name="films" value="The Empire Strikes Back" />
        <Checkbox name="films" value="Return of the Jedi" />
        <ObjectOf name="colors">
          <Input name="hair" />
          <Input name="skin" />
        </ObjectOf>
      </Form>
    );
  }
}
```

## Dynamic Array Items

```jsx
import React, { Component } from 'react';
import { Form, Input, ArrayOf } from 'react-form-mobx';

export default class MyFriend extends Component {
  myData = {
    name: 'Luke Skywalker',
    starships: ['X-wing', 'Imperial shuttle'],
  },

  handleSubmit = (data) => {
    console.log('data', data);
  };

  render() {
    return (
      <Form value={this.myData} onSubmit={this.handleSubmit}>
        <Input name="name" />
        <ArrayOf name="starships">
          {(starships, { push, removeBy }) =>
            <div>
              {starships.map((starship) =>
                <span key={starship}>
                  <Input name={starship} />
                  <button type="button" onClick={removeBy(starship)}>Remove</button>
                </span>
              )}
              <button type="button" onClick={push}>Add Starship</button>
            </div>
          }
        </ArrayOf>
      </Form>
    );
  }
}
```

## Creating Custom Input Component

**MyInput.js**

```jsx
import React, { Component } from "react";
import { Demon } from "react-form-mobx";

export default class MyInput extends Component {
  render() {
    return (
      <Demon forwardedProps={this.props}>
        {(props, { isInvalid, errorMessage }) => (
          <label>
            <input
              style={{ borderColor: isInvalid ? "red" : "green" }}
              {...props}
            />
            {isInvalid && <span style={{ color: "red" }}>{errorMessage}</span>}
          </label>
        )}
      </Demon>
    );
  }
}
```

**MyApp.js**

```jsx
import React, { Component } from "react";
import { Form } from "react-form-mobx";
import MyInput from "./MyInput";

export default class MyApp extends Component {
  render() {
    return (
      <Form value={this.myData}>
        <MyInput name="name" />
        {/* ... */}
      </Form>
    );
  }
}
```

## License

MIT
