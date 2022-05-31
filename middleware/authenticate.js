const ensureGuest = (req,res,next) => {
    if(req.isAuthenticated()){res.redirect('/dashboard')}
    else{return next()}
}

const ensureAuth = (req,res,next) => {
    if(req.isAuthenticated()){return next()}
    else{res.redirect('/')}
}

export {ensureGuest, ensureAuth}