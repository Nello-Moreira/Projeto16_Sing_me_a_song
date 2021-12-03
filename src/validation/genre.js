import Joi from 'joi';

const genreNameSchema = Joi.object({
	name: Joi.string().min(1).required(),
});

const isInvalidGenreName = (name) => genreNameSchema.validate(name).error;

const genreIdSchema = Joi.object({
	id: Joi.number().min(1).required(),
});

// prettier-ignore
const isInvalidGenreId = (idObject) => genreIdSchema
	.validate(idObject)
	.error;

export { isInvalidGenreName, isInvalidGenreId };
