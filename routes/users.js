const router = require('express').Router();
const { hashSync, genSaltSync, compareSync} = require('bcrypt');
const { sign } = require('jsonwebtoken');
const User = require('../models/user');
const checkToken = require("../auth/token_validation");


router.post('/login', (req,res,next)=> {
    User.findAll({where: {email: req.body.email}})
    .then(result =>{
        if(result.length < 1) {
            res.status(404).json({result: "Email does not exist"});
        } else {
            console.log("B");
            const validator = compareSync(req.body.password, result[0].password);
            if (validator) {
                result.password = undefined;
                const jsontoken = sign({ result: result[0] }, process.env.JWT_KEY,{
                    expiresIn: "1h"
                  });
                return res.status(200).json({
                  message: "Logged in successfully",
                  token: jsontoken
                });
              } else {
                return res.status(401).json({
                  message: "Invalid password"
                });
              }
        }
    })
    .catch(
        err =>{
            console.log(err);
            res.status(500).json({error:err})
        }
    )
});
router.post('/register', (req, res, next) =>{
    const body = req.body;
    User.findAll({where: {email: body.email}})
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                result: "Email is already registered"
            })
        } else {
            const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    User.create({
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        password: body.password,
        country: body.country,
        phonenumber: body.phonenumber,
        createdAt: body.createdAt,
        status: body.status,
    }
    )
    .then(result => {
        res.status(201).json({
            message: "User registered successfully.",
            result: result
        })
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({error: err});
        });
        }
    })
    .catch(
        err => {
            console.log(err);
            res.status(500).json({error: err});
        }
    );
});
//Get all
router.get('/',checkToken, (req,res,next) => {
    User.findAll()
    .then(results => {
        res.status(200).json({
            count: results.length,
            result: results,
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//Getting the user profile data
router.get('/:ID',checkToken, (req,res,next) => {
    const _id = req.params.ID;
    User.findAll({where:{id:_id}})
    .then(results => {
        res.status(200).json({
            result: results[0],
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//Deleting ID or user
router.delete('/:ID',checkToken, (req,res,next) =>{
    const _id = req.params.ID;
    User.destroy({
        where:{
            id: _id
        }
    })
    .then(result => {
        if(result == 1){
            res.status(200).json({
                result: "User deleted successfully" });
        } else if(result == 0 ) {
            res.status(404).json({
                result: "User does not exist" })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
})

router.patch('/:ID',checkToken, (req, res, next) => {
    const _id = req.params.ID;
    const updObj = {};
    for(const i in req.body){
        updObj[req.body[i].propName] = req.body[i].value;
    }
    console.log(updObj);
    User.update( updObj ,{where: {id: _id}})
    .then(result => {
        console.log(result);
            res.status(200).json({
                message: 'User updated',
            
        });
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

module.exports = router;
