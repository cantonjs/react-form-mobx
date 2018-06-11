# react-form-mobx

[![CircleCI](https://circleci.com/gh/cantonjs/react-form-mobx.svg?style=shield)](https://circleci.com/gh/cantonjs/react-form-mobx)
[![Build Status](https://travis-ci.org/cantonjs/react-form-mobx.svg?branch=master)](https://travis-ci.org/cantonjs/react-form-mobx)
[![Coverage Status](https://coveralls.io/repos/github/cantonjs/react-form-mobx/badge.svg?branch=master)](https://coveralls.io/github/cantonjs/react-form-mobx?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License](https://img.shields.io/badge/license-MIT_License-brightgreen.svg?style=flat)](https://github.com/cantonjs/react-form-mobx/blob/master/LICENSE.md)

Declarative Form components for [React](https://reactjs.org/), built on top of [MobX](https://mobx.js.org/)

![screenshot](/.github/screenshot.png)


## Table of Contents
<!-- TOC -->

- [Table of Contents](#table-of-contents)
- [Philosophy](#philosophy)
  - [Features Included](#features-included)
  - [Features NOT Included](#features-not-included)
- [Getting Started](#getting-started)
  - [Installing](#installing)
  - [Usage](#usage)
- [Advanced Guides](#advanced-guides)
  - [Dynamic Array Items](#dynamic-array-items)
  - [Creating Custom Input Component](#creating-custom-input-component)
- [License](#license)

<!-- /TOC -->

## Philosophy

Declarative, just like React and HTML

### Features Included

- Support nested objects and arrays
- Easy to create custom Input components
- Easy to push, update or remove array items
- Built-in validations (eg `required`, `pattern`, `enum`, etc)
- Built-in formats (eg `integer`, `number`, `boolean`, etc)
- Support data transformers / filters

### Features NOT Included

- No styles, just the original appearance, but you could add style easily
- No HTTP requests, but you could choose any HTTP request library you like

## Getting Started

### Installing

```bash
yarn add react-form-mobx
```

**Please note that you also need to install `react`, `mobx` and `mobx-react`**

### Usage

```jsx
import React, { Component } from 'react';
import { Form, Input, ObjectOf } from 'react-form-mobx';

export default class MyFriend extends Component {
  myData = {
    name: 'Luke Skywalker',
    height: 172,
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
        <Input name="height" format="number" />
        <ObjectOf name="colors">
          <Input name="hair" />
          <Input name="skin" />
        </ObjectOf>
      </Form>
    );
  }
}
```

## Advanced Guides

### Dynamic Array Items

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

### Creating Custom Input Component

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
