# Storybook Addon Fake Request
##This addon is the typed version of storybook-addon-mock


This addon allows you to mock fetch or XMLHttprequest requests in storybook. If your component depends on backend requests, and your backend requests are not ready yet to feed your component, this addon provides mock response to build your component.

## Why we need this

There are few packages those help the developers to mock the backend requests while building components. But those packages aren't integrated properly in storybook and also there's no scope to play with those requests in the storybook. `storybook-addon-fake-request` provides a dedicated panel in the storybook which helps the developers to update the status and the response on the fly.

### Mock data properties

| Property   | Description                                                                                 | Required | Default |
| ---------- | :------------------------------------------------------------------------------------------ | :------- | :------ |
| `url`      | Supports both **named parameters** (`/:foo/:bar`) and **query parameters**(`/foo?bar=true`) | Y        |         |
| `method`   | Supports `GET`, `POST` and `PUT` methods                                                    |          | `GET`   |
| `status`   | All possible HTTP status codes                                                              |          | `200`   |
| `response` | JSON format                                                                                 | Y        |         |

> You can change the **status** and **response** from the storybook panel on the fly! :rocket:

---

## How to use

Install the addon in your project as dev dependencies.

```bash
  yarn add -D storybook-addon-mock
```

### Using Storybook 6

Add the decorator in your addons, in `.storybook/main.js`:

```js
module.exports = {
    addons: ['@storybook/addon-fake-request'],
};
```

Add decorator in the stories.

```js
import React from 'react';
import withMock from '@storybook/addon-fake-request';
import Component from './Component';

export default {
    title: 'Component',
    component: Component,
    decorators: [withMock],
};

const Template = (args) => <Component {...args} />;

export const Default = Template.bind({});
Default.parameters = {
    mockData: [
        {
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            method: 'GET',
            status: 200,
            response: {
                data: 'This is a Mock Response!',
            },
        },
    ],
};
```

Thanks to [shilman](https://github.com/storybookjs/storybook/issues/14817) for this solution

### Using older versions of Storybook

Add the register in your `.storybook/addons.js` file

```js
import '@storybook/addon-fake-request';
```

Add `withMock` as a decorator in the stories.

```js
import React from 'react';
import withMock from '@storybook/addon-fake-request';

storiesOf('Mock Response Story', module)
    .addDecorator(withMock)
    .add('Story Item', () => <ComponentWithAPICall />, {
        mockData: [
            {
                url: 'https://jsonplaceholder.typicode.com/todos/1',
                method: 'GET',
                status: 200,
                response: {
                    data: 'This is a Mock Response!',
                },
            },
        ],
    });
```

## License

This project is licensed under the MIT License - see the LICENSE file in the source code for details.
