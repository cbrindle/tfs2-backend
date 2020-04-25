const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


async function createUserToken(user) {
    const payload = {
        name: user.name,
        email: user.email,
        id: user._id
    }

    const jwtToken = jwt.sign(payload, process.env.USER_SECRET_KEY, {
        expiresIn: (60000 * 60)
    });
    return jwtToken;
}

async function comparePassword(incomingPassword, userPassword) {
    try {
        let comparedPassword = await bcrypt.compare(incomingPassword, userPassword);
        if (comparedPassword) {
            return comparedPassword;
        } else {
            throw 409;
        }
    } catch (error) {
        return error;
    }
}


module.exports = {
    createUserToken,
    comparePassword
};