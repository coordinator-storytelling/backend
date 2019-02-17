const bcrypt = require('bcryptjs');
const userDb = require('../models/usersModel');
const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_SECRET || `add a .env file to the root of the project with a JWT_SECRET variable`;

// cors = (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// }

generateToken = (username, id, role) => {
    const payload = {
        username: username,
        role: role,
        user_id: id,
    }

    const options = {
        expiresIn: '3h'
    }

    return jwt.sign(payload, jwtKey, options)
}

authenticate = (req, res, next) => {
    const token = req.get('Authorization');

    if(token){
        jwt.verify(token, jwtKey, (err, decoded) => {
            if(err) return res.status(401).json(err);

            req.decoded = decoded;
            next();
        })
    } else {
        return res.status(401).json({
            error: "No token provided on the Authorization header"
        })
    }
}

checkRegistrationFields = (req, res, next) => {
    const user = req.body;

    if(user.username.length > 100){
        return res.status(400).json({
            message: "Username cannot be longer than 100 characters."
        })
    }

    if(user.username && user.password && user.email && user.role){
        next();
    } else if(!user.username){
        return res.status(400).json({
            message: "New accounts require a username!"
        })
    } else if(!user.password){
        return res.status(400).json({
            message: "New accounts require a password!"
        })
    } else if(!user.email){
        return res.status(400).json({
            message: "New accounts require an email address!"
        })
    } else if(!user.role){
        return res.status(400).json({
            message: "New accounts require a role!"
        })
    } else{
        return res.status(400).json({
            message: "New accounts require a username, password, email and role!"
        })
    }
}


//assign a large image and small image in object
assignImage = (country) => {
    let images = {
        Bolivia: { 
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Bolivia.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438986/Large%20Bountiful/Bolivia.jpg"
        },
        Brazil: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Brazil.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438986/Large%20Bountiful/Brazil.jpg"
        },
        Cambodia: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Cambodia.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Cambodia.jpg"
        },
        Colombia: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Colombia.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Colombia.jpg"
        },
        Ecuador: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Ecuador.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Ecuador.jpg"
        },
        El_Salvador: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340096/El_Salvador.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438986/Large%20Bountiful/El_Salvador.jpg"
        },
        Ghana: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Ghana.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438986/Large%20Bountiful/Ghana.jpg"
        },
        Guatemala: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340096/Guatemala.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Guatemala.jpg"
        },
        Haiti: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340096/Haiti.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Haiti.jpg"
        },
        Honduras: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Honduras.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Honduras.jpg"
        },
        Kiribati: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Kiribati.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438987/Large%20Bountiful/Kiribati.jpg"
        },
        Madagascar: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340096/Madagascar.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Madagascar.jpg"
        },
        Mongolia: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Mongolia.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438986/Large%20Bountiful/Mongolia.jpg"
        },
        Nicaragua: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340096/Nicaragua.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Nicaragua.jpg"
        },
        Paraguay: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340096/Paraguay.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Paraguay.jpg"
        },
        Peru: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Peru.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Peru.jpg"
        },
        Philippines: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340096/Philippines.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438985/Large%20Bountiful/Philippines.jpg"
        },
        Sierra_Leone: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Sierra_Leone.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438987/Large%20Bountiful/Sierra_Leone.jpg"
        },
        Zimbabwe: {
            small: "https://res.cloudinary.com/divjebnjg/image/upload/v1550340095/Zimbabwe.jpg",
            large: "https://res.cloudinary.com/divjebnjg/image/upload/v1550438992/Large%20Bountiful/Zimbabwe.jpg"
        }
    }

    return images[country]
}

async function assignCountry(id) {
    const countryString = await userDb.fetchCountry(id)
    const imageObj = assignImage(countryString)

    return {country: countryString, image: imageObj}
}


checkIfUser = (req, res, next) => {
    const {id} = req.params;

    userDb.fetch(id)
    .then(user => {
        if(user){
            return res.json(user)
        } else {
            return res.status(404).json({
                message: "This user does not exist."
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "This user could not be fetched."
        })
    })
}

checkStoryFields = (req, res, next) => {
    const story = req.body;

    if(story.title.length > 250){
        return res.status(400).json({
            message: "Story title cannot be longer than 250 characters."
        })
    }

    if(story.title && story.description){
        next();
    } else if(story.title){
        return res.status(400).json({
            message: "Stories require a description!"
        })
    } else if(story.description){
        return res.status(400).json({
            message: "Stories require a title!"
        })
    } else{
        return res.status(400).json({
            message: "Stories require a title and description!"
        })
    }
}

passwordProtection = (password) => {
    if(password.length > 11){
        hashed = bcrypt.hashSync(password, 12);
        return hashed;
    } else {
        return res.status(400).json({
            message: "Password must be at least 12 characters long."
        })
    }
}

loginCheck = (req, res, next) => {
    const user = req.body;
    if(user.username && user.password){
        next();
    } else {
        res.status(400).json({
            message: "Invalid username or password."
        })
    }
}

module.exports = {
    checkRegistrationFields, checkStoryFields, passwordProtection, loginCheck, assignCountry, checkIfUser, authenticate, generateToken,
}