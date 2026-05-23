/**
 * Joi Validation Middleware
 * Validates request data against Joi schemas
 */
const models = (schema, location = 'payload') => {
  return (req, res, next) => {
    let dataToValidate = {};

    // Get data from different locations
    if (location === 'payload' || location === 'body') {
      dataToValidate = req.body;
    } else if (location === 'query') {
      dataToValidate = req.query;
    } else if (location === 'params') {
      dataToValidate = req.params;
    }

    // Validate using Joi schema
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Report all errors, not just the first
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(422).json({
        status: 'error',
        code: 422,
        message: 'Validation failed',
        errors: errorMessages
      });
    }

    // Attach validated data back to request
    req.body = value;
    next();
  };
};

export default models;
