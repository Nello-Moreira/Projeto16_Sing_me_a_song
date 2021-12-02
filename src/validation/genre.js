import Joi from 'joi';

const genreNameSchema = Joi.object({
	name: Joi.string().min(1).required(),
});

const isInvalidGenreName = (name) => genreNameSchema.validate(name).error;

export { isInvalidGenreName };
