const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')

router.get("/signup", (req, res, next) => {
    res.render("signup.hbs")
  })

  router.post("/signup", (req, res, next) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        res.render('signup', {msg: 'Please enter all fields'})
        return;
      }

    // let re = /\S+@\S+\.\S+/;
    // if(!re.test(email)) {
    // res.render('signup', {msg: 'Email not in valid format'})
    // return;
    // };

    // let regexPass = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    // if(!regexPass.test(password)) {
    // res.render('signup', {msg: 'Password need to have special characters, some numbers and 6 characters at least'})
    // return;
    // };

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    console.log(hash)

    UserModel.create({name, email, password: hash})
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => {
      next(err)
    })
  })

  router.get("/signin", (req, res, next) => {
    res.render("signin.hbs")
  })

  router.post("/signin", (req, res, next) => {
    const {username, password} = req.body
    
    UserModel.findOne({username: username})
    .then((result) => {
        if (result) {
            bcrypt.compare(password, result.password)
            .then((isMatching) => {
                if (isMatching) {
                  req.session.user = result
                  res.redirect('/profile')
                }
                else {
                  res.render('signin.hbs', {msg: 'Passwords dont match'})
                }
            })
          }
          else {
            res.render('signin.hbs', {msg: 'Email does not exist'})
          }
        })
    .catch((err) => {
      next(err)
    })
  })

  const checkLoggedInUser = (req, res, next) => {
    if (req.session.loggedInUser) {
       next()
    }
     else {
       res.redirect('/signin')
     }
   }

  router.get('/profile', checkLoggedInUser, (req, res, next) => {
    let email = req.session.loggedInUser.email
    res.render('profile.hbs', {email})
  })

  module.exports = router