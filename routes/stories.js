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
        // console.log("req.body BEFORE: ", req.body)  
        req.body.user = req.user.id  // Adding a new req.body object property named "user" 
        // console.log("req.body AFTER: ", req.body)        

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

// Shows single story
// GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try{
        let story = await Story.findById(req.params.id).populate('user').lean()

        if(!story){
            return res.render('error/404')
        } 
        else{
            res.render('stories/show', {story})
        }
    } catch(err){
        console.error(err)
        res.render('error/404')
        
    }
})

// Shows edit page
// GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try{
        const story = await Story.findOne({_id: req.params.id}).lean()

        if(!story){
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            res.redirect('/stories')
        } 
        else{
            res.render('stories/edit', {story})
        }
    } catch(err){
        console.error(err)
        return res.render('error/500')
    }
    
})

// Update story
// PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try{
        let story = await Story.findById(req.params.id).lean()

        if(!story){
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            res.redirect('/stories')
        } 
        else{
            story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
            res.redirect('/dashboard')
        }        
    } catch(err){
        console.error(err)
        return res.render('error/500')
    }
    
})

// Delete story
// GET /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try{
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch(err){
        console.error(err)
        return res.render('error/500')        
    }
    
})

// User stories
// GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try{
        const stories = await Story.find({
            user: req.params.userId, 
            status: 'public'
        }).populate('user').lean()

        res.render('stories/index', {stories})
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})


export default router;