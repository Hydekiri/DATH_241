const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) =>{
        const token = req.headers.token;

        if(!token) res.status(401).json({message : "You have no authentication !"});

        accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user)=>{
            if(err){
                res.status(403).json("Invalid token !");
            }
            req.user = user;
            next();
        });
    },

    verifyControllerAndAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () =>{

            if(req.user.user_ID === parseInt(req.params.id) || req.user.role === "spso" ){
                next();
            }else{
                res.status(403).json("You are not allowed !");
            }
        });
    },

    verifyAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if(req.user.role === "spso"){
                next();
            }else{
                res.status(403).json("You are not allowed !");
            }
        });
    }
};

module.exports = middlewareController;