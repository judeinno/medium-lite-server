const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken")
const { ObjectId } = require('mongodb');

const register = (req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
    });
    
    return user
    .save()
    .then(
        (response) => {
            const accessToken = jwt.sign({ email: response.email, userId: response._id.toString() }, "accessSecret", {
                expiresIn: '2h',
            })
            return res.status(200).json({
            statusCode: 200,
            message: "User successfully created",
            user: { 
                name: response.name,
                email: response.email
             },
            accessToken
        })},
        (err) => res.status(500).json(err)
    );
}

const login = (req, res, next) => {
    const password = req.body.password;
    return User
        .findOne({email: req.body.email})
        .then((response) => {
            const userId = response._id.toString();
            if (response) {
                const checkPassord = bcrypt.compareSync(password, response.password);
                if(checkPassord) {
                    const accessToken = jwt.sign({ email: req.body.email, userId  }, "accessSecret", {
                            expiresIn: '2h',
                        })
                    return res.status(200).json({
                        statusCode: 200, accessToken, user: {
                            name: response.name,
                            email: response.email
                        } })
                } else {
                    return res.status(401).json({ message: "Wrong password" });
                }
            } else {
                return res.status(404).json({message: "User not found"});
            }
            
        }
        ).catch(err => res.status(500).json(err));
}

const getUser = (req, res, next) => {
    return User
        .findOne({ _id: new ObjectId(req.userId) })
        .then(
            (response) => res.status(200).json({
                statusCode: 200, message: 'success', user: {
                    name: response.name,
                    email: response.email
                } }),
            (err) => res.status(500).json(err)
        );
    

}

module.exports = { register, login, getUser };

