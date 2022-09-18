import express from "express";
import passport from "passport";

const router = express.Router();

// authentication w/ Google (Redirects to this route when user clicks the "Log In With Google" button in the login page)
// GET /auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

// Google auth callback (Redirects to this route after user clicks on their google account)
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