import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate); 

const signUp = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).messages({
        
    'string.pattern.base': 'Invalid password combination, minimum of 8 characters having at least; 1 uppercase, 1 lowercase, 1 digit, and 1 special character'
  
}).required().min(8),
    confirm_password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).messages({    
    'string.pattern.base': 'Invalid password combination, minimum of 8 characters having at least; 1 uppercase, 1 lowercase, 1 digit, and 1 special character'
  
}).required().min(8),
});

const verify = Joi.object().keys({
  email: Joi.string().email().required(),
  verification_code: Joi.string().required().length(6)
});

const resendVerification = Joi.object().keys({
  email: Joi.string().email().required(),
});

const signIn = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).messages({    
    'string.pattern.base': 'Invalid password'
}).required().min(8)
  
});
const resetPassword = Joi.object().keys({
  new_password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).messages({  
    'string.pattern.base': 'Invalid password combination, minimum of 8 characters having at least; 1 uppercase, 1 lowercase, 1 digit, and 1 special character'
  
}).required().min(8),
  rewrite_newpassword: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).messages({  
    'string.pattern.base': 'Invalid password combination, minimum of 8 characters having at least; 1 uppercase, 1 lowercase, 1 digit, and 1 special character'
  
}).required().min(8),
});

export default {signUp, verify,resendVerification, resetPassword, signIn};