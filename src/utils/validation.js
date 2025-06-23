const validatotr = require('validator');
const validateSignup = (req) => {
    const { firstName, lastName, emailId, password} = req.body;
 
    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required");
    }
    else if (!validatotr.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }
    else if (!validatotr.isStrongPassword(password)) {
        throw new Error("Password must be strong");
            }
        };


    module.exports = {
            validateSignup
    }; 