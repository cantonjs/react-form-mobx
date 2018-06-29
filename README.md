# react-form-mobx

[![CircleCI](https://circleci.com/gh/cantonjs/react-form-mobx.svg?style=shield)](https://circleci.com/gh/cantonjs/react-form-mobx)
[![Build Status](https://travis-ci.org/cantonjs/react-form-mobx.svg?branch=master)](https://travis-ci.org/cantonjs/react-form-mobx)
[![Coverage Status](https://coveralls.io/repos/github/cantonjs/react-form-mobx/badge.svg?branch=master)](https://coveralls.io/github/cantonjs/react-form-mobx?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License](https://img.shields.io/badge/license-MIT_License-brightgreen.svg?style=flat)](https://github.com/cantonjs/react-form-mobx/blob/master/LICENSE.md)

Declarative Form components for [React](https://reactjs.org/), built on top of [MobX](https://mobx.js.org/)

![screenshot](/.github/screenshot.png)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Philosophy](#philosophy)
  - [Features Included](#features-included)
  - [Features NOT Included](#features-not-included)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
  - [Installing](#installing)
  - [Usage](#usage)
- [Advanced Guides](#advanced-guides)
  - [Dynamic Array Items](#dynamic-array-items)
  - [Creating Custom Input Component](#creating-custom-input-component)
- [References](#references)
  - [Form Component](#form-component)
  - [Input Components](#input-components)
  - [ObjectOf Component](#objectof-component)
  - [ArrayOf Component](#arrayof-component)
  - [Submit, Reset, Clear Component](#submit-reset-clear-component)
  - [Demon Component](#demon-component)
  - [DemonButton Component](#demonbutton-component)
- [License](#license)

## Philosophy

Declarative, just like React and HTML

### Features Included

- Support nested objects and arrays
- Easy to create custom Input (or Select, Checkbox, Radio, etc) components
- Easy to push, update or remove array items
- Built-in validations (eg `required`, `pattern`, `enum`, etc)
- Built-in formats (eg `integer`, `number`, `boolean`, etc)
- Support data transformers / filters

### Features NOT Included

- No styles, just the original appearance, but you could add style easily
- No HTTP requests, but you could choose any HTTP request library you like

## Live Demo

[Live demo on codesandbox](https://codesandbox.io/s/52v7y2v304)

## Getting Started

### Installing

```bash
yarn add react-form-mobx
```

You may also need to install `react`, `mobx` and `mobx-react`

```bash
yarn add react mobx mobx-react react-form-mobx
```


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

## References

### Form Component

```jsx
import { Form } from 'react-form-mobx';
```

Form component, just like HTML `form` component.

#### Props

| Property      | Description                                                         | Type     | Default |
| ------------- | ------------------------------------------------------------------- | -------- | ------- |
| value         | Form data                                                           | Object   | `{}`    |
| onSubmit      | Defines a function will be called when form submit                  | Function |         |
| onValid       | Defines a function will be called when form is valid                | Function |         |
| onInvalid     | Defines a function will be called when form is invalid              | Function |         |
| onValidChange | Defines a function will be called when form valid status changed    | Function |         |
| onChange      | Defines a function will be called when form data changed            | Function |         |
| inputFilter   | Defines a filter function will be called when providing a new value | Function |         |
| outputFilter  | Defines a filter function will be called when getting output value  | Function |         |

### Input Components

```jsx
import { Input, Checkbox, Radio, Select, TextArea } from 'react-form-mobx';
```

These Input Components mean `Input`, `Checkbox`, `Radio`, `Select`, `TextArea` or other custom input components created by `Demon`.

#### Props

| Property         | Description                                                                  | Type                                                                 | Default |
| ---------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------- |
| name             | Field name                                                                   | String `Required`                                                    |         |
| defaultValue     | Default value when value is empty                                            | Any                                                                  |         |
| defaultChecked   | Default checked, only work in checkable components (eg: `Checkbox`, `Radio`) | Boolean                                                              |         |
| format           | Data format                                                                  | "integer", "number", "string", "boolean", "date", "time", "dateTime" |         |
| required         | Indicates whether field is required                                          | Boolean                                                              | `false` |
| enum             | Validate a value from a list of possible values                              | Array of `String`                                                    | `[]`    |
| pattern          | Validate from a regular expression                                           | RegExp                                                               |         |
| maxLength        | Validate a max length of the field                                           | Number                                                               |         |
| minLength        | Validate a min length of the field                                           | Number                                                               |         |
| maximum          | Validate if the field is less than or exactly equal to "maximum"             | Number                                                               |         |
| exclusiveMaximum | Validate if the field is less than (not equal to) "exclusiveMaximum"         | Number                                                               |         |
| minimum          | Validate if the field is greater than or exactly equal to "minimum"          | Number                                                               |         |
| exclusiveMinimum | Validate if the field is greater than or exactly equal to "exclusiveMinimum" | Number                                                               |         |
| validation       | Defines a validator function, should throw error if invalid                  | Function                                                             |         |
| inputFilter      | Defines a filter function will be called when providing a new value to form  | Function                                                             |         |
| outputFilter     | Defines a filter function will be called when getting output value from form | Function                                                             |         |
| withEmpty        | Indicates whether submit empty value or not                                  | "auto", `true`, `false`                                              | "auto"  |

The rest of the props are exactly the same as the original [DOM attributes](https://reactjs.org/docs/dom-elements.html#all-supported-html-attributes).

##### Notes

- `withEmpty`: If value is empty (saying `""`, `undefined`, `null`, `{}` or `[]`):
  * `"auto"` (Default): Will submit empty value only if pristine value is NOT empty
  * `true`: Will submit empty value
  * `false`: Will not submit empty value

### ObjectOf Component

```jsx
import { ObjectOf } from 'react-form-mobx';
```

`ObjectOf` component provides nested fields.

#### Props

| Property     | Description                                                                  | Type              | Default |
| ------------ | ---------------------------------------------------------------------------- | ----------------- | ------- |
| name         | Field name                                                                   | String `Required` |         |
| children     | Nested input nodes                                                           | Node `Required`   |         |
| onChange     | Defines a function will be called when data changed                          | Function          |         |
| inputFilter  | Defines a filter function will be called when providing a new value to form  | Function          |         |
| outputFilter | Defines a filter function will be called when getting output value from form | Function          |         |

### ArrayOf Component

```jsx
import { ArrayOf } from 'react-form-mobx';
```

`ArrayOf` component provides array fields, and could be push, update or remove easily.

#### Props

| Property     | Description                                                                  | Type                        | Default |
| ------------ | ---------------------------------------------------------------------------- | --------------------------- | ------- |
| name         | Field name                                                                   | String `Required`           |         |
| children     | Nested input nodes or function child that should return a node               | Node or Function `Required` |         |
| onChange     | Defines a function will be called when data changed                          | Function                    |         |
| inputFilter  | Defines a filter function will be called when providing a new value to form  | Function                    |         |
| outputFilter | Defines a filter function will be called when getting output value from form | Function                    |         |

#### Function Child

If `children` prop is a callback renderer function, it will provide two arguments:

- `names` \<Array\>: An array of unique names that could be used as the `key` and `name` props of chidren components
- `helper` \<Object\>: A helper object to manipulate the array:
  * `push()` \<Function\>: To push a new item
  * `remove(name)` \<Function\>: To remove a item by `name`
  * `removeBy(name)` \<Function\>: To create and return a `remove(name)` currying function

Please checkout [Dynamic Array Items](#dynamic-array-items) for usage example.

### Submit, Reset, Clear Component

```jsx
import { Submit, Reset, Clear } from 'react-form-mobx';
```

- `Submit`: Just like HTML `button` component. Will emit `onSubmit()` in `Form` when click.
- `Reset`: Just like HTML `button` component. Will reset all input values to pristine values in `Form` when click
- `Clear`: Just like HTML `button` component. Will clear all input values in `Form` when click.

#### Props

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| children | children    | Node |         |

The rest of the props are exactly the same as the original [DOM attributes](https://reactjs.org/docs/dom-elements.html#all-supported-html-attributes).

### Demon Component

```jsx
import { Demon } from 'react-form-mobx';
```

`Demon` component is the core of creating custom input components.

#### Props

| Property                  | Description                                                  | Type                | Default                            |
| ------------------------- | ------------------------------------------------------------ | ------------------- | ---------------------------------- |
| name                      | Field name                                                   | String `Required`   |                                    |
| children                  | Function child that should return a node                     | Function `Required` |                                    |
| forwardedProps            | Forward props, `Demon` will decide to handle or forward them | Object              | `{}`                               |
| checkable                 | Indicates whether the component is checkable                 | Boolean             | `false`                            |
| getValueFromChangeEvent   | Defines a function to get `value` in `onChange` arguments    | Function            | `(ev) => ev.currentTarget.value`   |
| getCheckedFromChangeEvent | Defines a function to get `checked` in `onChange` arguments  | Function            | `(ev) => ev.currentTarget.checked` |
| getKeyFromKeyPressEvent   | Defines a function to get `key` in `onPress` arguments       | Function            | `(ev) => ev.key`                   |
| propOnChange              | Defines the prop name of change event                        | String              | "onChange"                         |
| propOnKeyPress            | Defines the prop name of key press event                     | String              | "onKeyPress"                       |
| propOnBlur                | Defines the prop name of blur event                          | String              | "onBlur"                           |

#### Function Child

`children` prop provides two arguments:

- `proxyProps` \<Object\>: Forwarded props object including `value` or `checked`, but excluding `name`, `format`, `enum` and other props only work in `Demon` component. Can be directly pass to child component (like `<input {...proxyProps} />`)

- `validState` \<Object\>: Valid state helper object, including:
  * `errorMessage` \<String\>: Error message. Would be empty if the status is valid
  * `isValid` \<Boolean\>: Would be true if the status is valid
  * `isInvalid` \<Boolean\>: Would be true if the status is invalid
  * `isTouched` \<Boolean\>: Is touched or not. Useful if you don't want to show `errorMessage` when field is not touched

#### Proxied Props

By default, `onChange`, `onKeyPress`, `onBlur` props will be proxied.

- `onChange`: `Demon` need to get the changed `value` or `checked` from the `change` event object to update value. You can change the getting function by setting `getValueFromChangeEvent` or `getCheckedFromChangeEvent` prop to `Demon` component.
- `onKeyPress`: `Demon` need to get the `key` from the `keyPress` event object to decide to submit. You can change the getting function by settting `propOnKeyPress` prop to `Demon` component
- `onBlur`: `Demon` need to listen to the `blur` event to set `isTouched` to `true`

Please checkout [Creating Custom Input Component](#creating-custom-input-component) for usage example.

### DemonButton Component

```jsx
import { DemonButton } from 'react-form-mobx';
```

`DemonButton` component is the core of creating custom button (Submit, Reset or Clear) components.

#### Props

| Property                | Description                                                        | Type                       | Default          |
| ----------------------- | ------------------------------------------------------------------ | -------------------------- | ---------------- |
| children                | Function child that should return a node                           | Function `Required`        |                  |
| type                    | Button type                                                        | "submit", "reset", "clear" | "submit"         |
| forwardedProps          | Forward props, `DemonButton` will decide to handle or forward them | Object                     | `{}`             |
| getKeyFromKeyPressEvent | Defines a function to get `key` in `onPress` arguments             | Function                   | `(ev) => ev.key` |
| propOnKeyPress          | Defines the prop name of key press event                           | String                     | "onKeyPress"     |

#### Function Child

`children` prop provides one argument:

- `proxyProps` \<Object\>: Forwarded props object. Can be directly pass to child component (like `<button {...proxyProps} type="button" />`)

## License

MIT
