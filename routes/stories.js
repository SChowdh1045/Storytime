import express from "express";
import {ensureAuth} from "../middleware/authenticate.js"
import Story from "../models/Story.js";

const router = express.Router();

// Shows "add story" page
// GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/addStory');
})

// Processing "Add Story" Form
// POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try{
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } 
    catch(err){
        console.log(err)
        res.render('error/500')        
    }
})

// Shows all stories
// GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try{
        const stories = await Story.find({status: 'public'}).populate('user').sort({createdAt: 'desc'}).lean()
        res.render('stories/index', {stories})
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})


export default router;