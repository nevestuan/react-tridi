# react-tridi

> React Tridi is a react component for 360-degree product viewer

[![NPM](https://img.shields.io/npm/v/react-tridi.svg)](https://www.npmjs.com/package/react-tridi) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Inspired by the [Tridi](https://github.com/lukemnet/tridi) javascript library for 360-degree 3D product visualizations based on series of images. Special thanks to [Łukasz Wójcik](https://github.com/lwojcik)

![](https://media.giphy.com/media/h7EVOL8vQwCtUo7hXV/giphy.gif)

## Install

```bash

npm install --save react-tridi

```

## Usage

```jsx
import React from 'react';
import Tridi from 'react-tridi';
import 'react-tridi/dist/index.css';

const Example = () => (
    <div style={{ width: '500px' }}>
        <Tridi location="./images" format="jpg" count="36" />
    </div>
);
```

## License

MIT © [nevestuan](https://github.com/nevestuan)
