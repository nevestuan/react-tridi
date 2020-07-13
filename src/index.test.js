import React, { createRef } from 'react';
import { render, act } from '@testing-library/react';

import Tridi from '.';

const mockImages = [
	'https://i.ibb.co/NTRYMDT/1.jpg',
	'https://i.ibb.co/MPmjXrd/2.jpg',
	'https://i.ibb.co/jvDSDhF/3.jpg',
	'https://i.ibb.co/GsVGKNX/4.jpg',
	'https://i.ibb.co/F6y9RxV/5.jpg',
	'https://i.ibb.co/KKg3pWW/6.jpg',
	'https://i.ibb.co/LSDrNyW/7.jpg',
	'https://i.ibb.co/L8h7znm/8.jpg',
	'https://i.ibb.co/qdYshm7/9.jpg',
	'https://i.ibb.co/MnqWtXz/10.jpg',
	'https://i.ibb.co/ZY7Ts0z/11.jpg',
	'https://i.ibb.co/N2PhVSX/12.jpg',
	'https://i.ibb.co/JCppkzk/13.jpg',
	'https://i.ibb.co/h1b50ys/14.jpg',
	'https://i.ibb.co/QmgkYxn/15.jpg',
	'https://i.ibb.co/xmxQFT5/16.jpg',
	'https://i.ibb.co/QHjXSZK/17.jpg',
	'https://i.ibb.co/kcmMG57/18.jpg',
	'https://i.ibb.co/TkY5TWw/19.jpg',
	'https://i.ibb.co/W0gyb2F/20.jpg',
	'https://i.ibb.co/QjPRCT4/21.jpg',
	'https://i.ibb.co/PmzTBvv/22.jpg',
	'https://i.ibb.co/phGJMSs/23.jpg',
	'https://i.ibb.co/cJC26f2/24.jpg',
	'https://i.ibb.co/S3mV0cr/25.jpg',
	'https://i.ibb.co/CVrjNcv/26.jpg',
	'https://i.ibb.co/jwgtNBD/27.jpg',
	'https://i.ibb.co/ZBJL2WL/28.jpg',
	'https://i.ibb.co/MPpW8qK/29.jpg',
	'https://i.ibb.co/PmtPZys/30.jpg',
	'https://i.ibb.co/vqwzvLz/31.jpg',
	'https://i.ibb.co/L9Mn5Dp/32.jpg',
	'https://i.ibb.co/sQgVTTV/33.jpg',
	'https://i.ibb.co/gMNsnV9/34.jpg',
	'https://i.ibb.co/sC80Fvv/35.jpg',
	'https://i.ibb.co/qRXTNSD/36.jpg'
];

describe('Tridi', () => {
	it('renders with enough images', () => {
		const { container } = render(<Tridi images={mockImages} />);
		expect(container.querySelectorAll('img').length).toEqual(36);
	});

	it('shows next image', () => {
		const tridiRef = createRef();
		const { container } = render(<Tridi ref={tridiRef} images={mockImages} />);
		expect(container.querySelector('.tridi-viewer-image-shown').src).toEqual(
			'https://i.ibb.co/NTRYMDT/1.jpg'
		);
		act(() => {
			tridiRef.current.next();
		});
		expect(container.querySelector('.tridi-viewer-image-shown').src).toEqual(
			'https://i.ibb.co/MPmjXrd/2.jpg'
		);
	});

	it('shows previous image', () => {
		const tridiRef = createRef();
		const { container } = render(<Tridi ref={tridiRef} images={mockImages} />);
		expect(container.querySelector('.tridi-viewer-image-shown').src).toEqual(
			'https://i.ibb.co/NTRYMDT/1.jpg'
		);
		act(() => {
			tridiRef.current.prev();
		});
		expect(container.querySelector('.tridi-viewer-image-shown').src).toEqual(
			'https://i.ibb.co/qRXTNSD/36.jpg'
		);
	});

	it('shows next image inverse', () => {
		const tridiRef = createRef();
		const { container } = render(<Tridi ref={tridiRef} images={mockImages} inverse />);
		expect(container.querySelector('.tridi-viewer-image-shown').src).toEqual(
			'https://i.ibb.co/NTRYMDT/1.jpg'
		);
		act(() => {
			tridiRef.current.next();
		});
		expect(container.querySelector('.tridi-viewer-image-shown').src).toEqual(
			'https://i.ibb.co/qRXTNSD/36.jpg'
		);
	});

	it('shows previous image inverse', () => {
		const tridiRef = createRef();
		const { container } = render(<Tridi ref={tridiRef} images={mockImages} inverse />);
		expect(container.querySelector('.tridi-viewer-image-shown').src).toEqual(
			'https://i.ibb.co/NTRYMDT/1.jpg'
		);
		act(() => {
			tridiRef.current.prev();
		});
		expect(container.querySelector('.tridi-viewer-image-shown').src).toEqual(
			'https://i.ibb.co/MPmjXrd/2.jpg'
		);
	});
});
