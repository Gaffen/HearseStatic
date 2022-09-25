const fullWidth = [1920, 1650, 1440, 1280, 1024, 800, 720, 600, 320];

const trackPageArt = [984, 762, 492, 320];

const record = [320, 160];

const imgSizes = {
	fullWidth,
	record,
};

const getImgObj = (id, url, size) => {
	const sizes = imgSizes[size] ? imgSizes[size] : fullWidth;
	return {
		src: `${url}/assets/${id}?width=${Math.min(...sizes)}`,
		srcset: sizes
			.map((imgSize) => `${url}/assets/${id}?width=${imgSize} ${imgSize}w`)
			.join(', '),
	};
};

module.exports = { imgSizes, getImgObj };
