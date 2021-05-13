const app = require('../app');
const router = require('express').Router();
const { hashSync, genSaltSync, compareSync} = require('bcrypt');
const { sign } = require('jsonwebtoken');
const User = require('../models/user');


router.post('/register', (req, res, next) =>{
    const body = req.body;
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
});
//Get all
router.get('/', (req,res,next) => {
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
router.get('/:ID', (req,res,next) => {
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
router.delete('/:ID', (req,res,next) =>{
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


module.exports = router;
