const validator = require("validator");


module.exports = class Validations{
    /**
     * @desc validates and sanitize an input
     * @param {object} userProfile 
     */
    static async newUser(userProfile){
        let error = {}
        if(validator.isEmpty(userProfile['firstName']) || validator.isEmpty(userProfile['lastName'])
         || validator.isEmpty(userProfile['displayName']) || validator.isEmpty(userProfile['email']) || 
         validator.isEmpty(userProfile['password']) || validator.isEmpty(userProfile['country']) || validator.isEmpty(userProfile['tel'])){
            error.msg = 'please fill all required field'
        }

        if(validator.isBoolean(userProfile['firstName']) || validator.isBoolean(userProfile['lastName'])
         || validator.isBoolean(userProfile['displayName']) || validator.isBoolean(userProfile['email']) || 
         validator.isBoolean(userProfile['password']) || validator.isBoolean(userProfile['country']) || validator.isBoolean(userProfile['tel'])){
            error.msg = 'sorry, boolean values are not allowed'
        }

        if(!validator.isAlpha(userProfile['firstName']) || !validator.isAlpha(userProfile['lastName']) 
            || !validator.isAlpha(userProfile['country'])){
             error.msg = 'Names must be completely filled with only alphabets!'
       }

       if(!validator.isEmail(userProfile['email'])) {
           error.msg = 'please, input a valid email!'
       }

       if(userProfile['tel'].length < 10) {
           error.msg = 'please, provide a valid phone number'
       }

       if(!validator.isMobilePhone(userProfile['tel'])) {
        error.msg = 'please, input a valid telephone number'
       }

       if(!validator.isStrongPassword(userProfile['password'])) {
           error.msg = 'password is not strong enough!'
       }

       return {
           error,
           isValid: Object.keys(error).length == 0
       }
    }

    static async newPost(content) {
        let error = {}
        if(validator.isEmpty(content)) {
            error.msg = 'you cannot submit an empty post!'
        }

        if(validator.isNumeric(content)) {
            error.msg = 'post cannot contain only numbers!'
        }

        if(validator.isBoolean(content)) {
            error.msg = 'invalid input!'
        }

        return {
            error,
            isValid: Object.keys(error).length == 0
        }
    }

    static async checkMail(mail) {
        let error = {}
        if(validator.isEmpty(mail)) {
            error.msg = 'please, fill in the fields!'
        }

        if(!validator.isEmail(mail)) {
            error.msg = 'please, provide a valid email!'
        }

        return {
            error,
            isValid: Object.keys(error).length == 0
        }
    }
}