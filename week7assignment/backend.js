const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');   

const SECRET_KEY = 'mysecret';
const mongoose = require('mongoose');
const {userModel, todoModel} = require('./db.js');
app.use(express.json());

mongoose.connect('mongodb+srv://anshdeshwal1234:********@cluster0.scptd.mongodb.net/')
// signup endpoint
app.post("/signup", async (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        const createdUser  = await userModel.create({
        name: name,
        age: age,
        email: email,
        password: hashedPassword
    })

    // await createdUser.save()
    // console.log( `User ${createdUser.name} has been created` );

    res.json({
        message: `${createdUser.name} you have succesfully signed up`
    });
    } catch (error) {
        res.status(500).json({
            message: "threre was an error",
            error: error
        });
        return;
    }

});

// signin endpoint
app.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    try{
        const response = await userModel.findOne({
        email: email,
        password: password
    });

        const validPassword = await bcrypt.compare(password, response.password);
        if(validPassword){
            const token = jwt.sign({
                                id: response._id
                            },SECRET_KEY);
                            
                            res.json({
                                token,
                                message: `${response.name} you have successfully signed in`
                            })
        } 
    }catch(error){
        res.status(401).json({
            message: "Invalid email or password"
        });
    }

});



// get todo endpoint
app.get("/todo", async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    const userInDB = await userModel.findOne({
        email:email,
        password:password
    })
    
    const userId = userInDB._id;
    
    const todoOfUser = await todoModel.findOne({
        userID:userId
    })
    
    res.json(todoOfUser,{
        message: `here are your todos ${name}`// don't really know how this code will behave
    });  
});



// post todo endpoint
app.post("/todo", async (req, res) => {

    const userInDB = await userModel.findOne({
        email:email,
        password:password
    })

    try{
        await todoModel.create({
        description : req.body.description,
        done: req.body.done,
        userID: userInDB._id
    })
    res.json({
        message: "todo created successfully"
    })
    } catch (error) {
        res.json({
            message: "There was an error",
            error: error
        })
    }

});



// auth middleware
function auth(req, res, next) {
    const token = req.headers.authorization;

    const response = jwt.verify(token, SECRET_KEY);

    if (response) {
        req.userId = token.userId;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
}


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});