import Joi from 'joi';

const recomendationSchema = Joi.object({
	name: Joi.string().min(1).required(),
	youtubeLink: Joi.string()
		.pattern(
			/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
		)
		.required(),
	genresIds: Joi.array().items(Joi.number().min(1)).min(1).required(),
});

// prettier-ignore
const isInvalidRecomendation = (recomendationObject) => recomendationSchema
	.validate(recomendationObject)
	.error;

const recomendationIdSchema = Joi.object({
	recomendationId: Joi.number().min(1).required(),
});

// prettier-ignore
const isInvalidRecomendationId = (idObject) => recomendationIdSchema
	.validate(idObject)
	.error;

export { isInvalidRecomendation, isInvalidRecomendationId };
