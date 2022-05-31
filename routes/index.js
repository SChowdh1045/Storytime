import express from "express";
import {ensureGuest, ensureAuth} from "../middleware/authenticate.js"
import Story from "../models/Story.js";

const router = express.Router();

// Login/Landing Page
// GET /
// 1st "login" parameter is the from "views" dir ; 2nd "login" in the object is from "layouts" dir (within "views")
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {layout: 'login'});
})

// Dashboard Page
// GET /dashboard
// {layout: 'main'} is optional to put because 'main' is the default template that we specified in app.js
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {layout: 'main', name: req.user.firstName, stories});
    } catch(err) {
        console.error(err)
        res.render('error/500')        
    }    
})


export default router;