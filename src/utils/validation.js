const validatotr = require('validator');
const validateSignup = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

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


const validateEditProfileData = (req) => {
const allowedFields = ["firstName", "lastName", "emailId", "Skills", "About", "age", "photoUrl", "gender"];



const isEditAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field)
);  
   return isEditAllowed;
}; 


module.exports = {
    validateSignup,
    validateEditProfileData,
}; 