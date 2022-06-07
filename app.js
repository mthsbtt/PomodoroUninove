const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/pomodoro.html'));
});

app.post('/register', async (req, res) => {
    try {
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list:', users);
            res.send("<script>alert('Cadastro realizado com sucesso.'); window.location.replace('http://localhost:3000/');</script>");
        } else {
            res.send("<script>alert('E-mail já cadastrado.'); window.location.replace('http://localhost:3000/');</script>");
        }
    } catch {
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try {
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.sendFile(path.join(__dirname,'./public/pomodoro.html'));
            } else {
                res.send("<script>alert('E-mail ou senha inválidos.'); window.location.replace('http://localhost:3000/');</script>");
            }
        } else {   
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<script>alert('E-mail ou senha inválidos.'); window.location.replace('http://localhost:3000/');</script>");
        }
    } catch {
        res.send("Internal server error");
    }
});


server.listen(3000, function() {
    console.log("server is listening on port: http://localhost:3000");
});