import express from "express";
import passport from "passport";

const router = express.Router();

// auth w/ Google
// GET /auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

// Google auth callback
// GET /auth/google/callback
router.get(
    '/google/callback', 
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        res.redirect('/dashboard')
    })

// Logging out user
// GET /auth/logout
router.get('/logout', (req, res, next) => {
    req.logout( (err) => {
        if(err){return next(err)}
        res.redirect('/')
    })
})


export default router;