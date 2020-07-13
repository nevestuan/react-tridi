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

## Props
| Prop Name        | Prop Type           | Default Value  | Required? | Description |
| ---------------- |:-------------------:|:--------------:|:---------:| ----------- |
| className | `string` | `undefined` | no | Add class name for the component
| style | `object` | `undefined` | no | Add style for the component
| images | `arrays` | `"numbered"` | no | Source of images to be used by Tridi
| format | `string` | `undefined` | yes* | Image extension (e.g. "jpg"). Required if images = "numbered"
| location | `string` | `undefined` | yes* | Path to images folder. Required if images = "numbered"
| count | `number` | `undefined` | yes* | Number of images in the series. Required if images = "numbered"
| draggable | `boolean` | `true` | no | Enable/disable mouse drag event
| hintOnStartUp | `boolean` | `false` | no | Enable/disable hint on start up
| hintText | `string` | `undefined` | no | Enable/disable hint text
| autoplay | `boolean` | `false` | no | Enable/disable autoplay
| autoplaySpeed | `number` | `50` | no | Adjust autoplay speed
| stopAutoplayOnClick | `boolean` | `false` | no | Stop autoplay if user clicks on container
| stopAutoplayOnMouseEnter | `boolean` | `false` | no | Stop autoplay if user hovers over container
| resumeAutoplayOnMouseLeave | `boolean` | `false` | no | Resume autoplay if user moves mouse cursor away from container
| touch | `boolean` | `true` | no | Enable/disable touch support
| mousewheel | `boolean` | `false` | no | Enable/disable mousewheel support
| inverse | `boolean` | `false` | no | Swap image rotation direction. Affects mouse drag, mousewheel and touch
| dragInterval | `number` | `1` | no | Adjust rotation speed for mouse drag events
| touchDragInterval | `number` | `2` | no | Adjust rotation speed for touch events
| mouseleaveDetect | `boolean` | `false` | no | If true, active drag event will stop whenever mouse cursor leaves Tridi container


## Prop Events
| Prop Name | Params Type | Description |
| --------- | ------ | ----------- |
| onHintHide | `null` | Hint is hidden
| onAutoplayStart | `null` | Autoplay is started
| onAutoplayStop | `null` | Autoplay is stopped
| onNextMove | `null` | Next image is loaded (obeying inverse option)
| onPrevMove | `null` | Previous image is loaded (obeying inverse option)
| onNextFrame | `null` | Next image is loaded following the order in the image source (indifferent to inverse option)
| onPrevFrame | `null` | Previous image is loaded according to the order in the image source (indifferent to inverse option)
| onDragStart | `null` | Image rotation sequence (dragging) starts
| onDragEnd | `null` | Image rotation sequence (dragging) ends
| onFrameChange | `number` | Next image is loaded, sending out the current image index


## Ref Functions
| Function Name | Params Type | Description |
| ------------- | ----------- | ----------- |
| prev() | `null` | trigger prev move
| next() | `null` | trigger next move
| toggleAutoPlay(true/false) | `boolean` | toogle autoplay


## License

MIT © [nevestuan](https://github.com/nevestuan)
