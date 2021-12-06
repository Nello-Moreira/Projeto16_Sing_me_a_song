import Joi from 'joi';

const recommendationSchema = Joi.object({
	name: Joi.string().min(1).required(),
	youtubeLink: Joi.string()
		.pattern(
			/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
		)
		.required(),
	genresIds: Joi.array().items(Joi.number().min(1)).min(1).required(),
});

// prettier-ignore
const isInvalidRecommendation = (recommendationObject) => recommendationSchema
	.validate(recommendationObject)
	.error;

const recommendationIdSchema = Joi.object({
	recommendationId: Joi.number().min(1).required(),
});

// prettier-ignore
const isInvalidRecommendationId = (idObject) => recommendationIdSchema
	.validate(idObject)
	.error;

const amountSchema = Joi.object({
	amount: Joi.number().min(1).required(),
});

// prettier-ignore
const isInvalidAmount = (idObject) => amountSchema
	.validate(idObject)
	.error;

export { isInvalidRecommendation, isInvalidRecommendationId, isInvalidAmount };
