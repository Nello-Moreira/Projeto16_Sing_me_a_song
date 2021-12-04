export default function createRandomInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
