import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from '../models/User.js';

export default function(passport){
    // "use()" takes 1 argument
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {        
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,            
            image: profile.photos[0].value
        }

        try {
            let user = await User.findOne({googleId: profile.id})

            if(user){
                done(null, user)
            } 
            else{
                user = await User.create(newUser)
                done(null, user)
            }            
        } catch (err) {
            console.log(err)
        }
    }))

    // used to serialize the user for the session
    passport.serializeUser( (user, done) => {
        done(null, user.id); 
    });

    // used to deserialize the user
    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}