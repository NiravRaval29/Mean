var UserDetails = require('../models/UserDetails.js');

// Create / Insert Data into table
exports.create = (req, res) => {
    var data = req.body;
	
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            message: "UserDetails content can not be empty"
        });
    }    
    
    // Create a Interface
    var userDetails = new UserDetails({
        "firstName": data.firstName,
        "lastName" : data.lastName,
        "roles" : data.roles,
        "email" : data.email,
        "password" : data.password,
        "phoneNo" : data.phoneNo,
        "city" : data.city,
        "state" : data.state,
        "country" : data.country,
        "isActive" : true,
        "create_at" : new Date()
    });
    
    // Save UserDetails in the database
    userDetails.save()
    .then(data => {

        //send success message and redirect into login page
        req.flash('success', 'You have successfull signup up.');
        res.redirect('/login');
    }).catch(err => {
        //here you can pass error message into routers
        req.flash('error', 'Please enter valid input in form.');
        res.redirect('/signup');   
    });
};

// Find All Data into table.
exports.findAll  = (req, res) => {
    // Find All UserDetails in the database using limit and sorting
    UserDetails
    .find()             
    .limit( 10 )
    .sort( 'firstName' )
    .then(data => {
        sess = req.session;
        // when you use session remove comment if - else
        // if(sess.userData && sess.userData.length > 0){
            res.render('dashboard',{
                data :req.flash('data') || data ,
                firstName : sess.userData[0].firstName,
                dataTableErrorMsg: req.flash('error')
            });
        // }else{
            // req.flash('error', 'Session Expired.');
            // res.redirect(301,'/login');
        // }
    }).catch(err => {
        //here you can pass error message into routers
        req.flash('error', 'Please enter valid input in form.');
        res.redirect('/login');
    });
};


//Retrieve single details while user try to login
exports.findOne = (req,res) => {

    // Validate request
    if(!req.body) {
        return res.status(400).send({
            message: "UserDetails body can not be empty"
        });
    }

    var email  = req.body.username;
    var password = req.body.password;

    //find user when user is try to login
    UserDetails.find({"email" : email, "password" : password})
    .then(data => {
        if(data.length > 0){
            // set session    
            var sess = req.session;
            sess.userData = data;
            
            //pass message to view using req.flash
            req.flash('success', 'You have successfull logged in');
            res.redirect('dashboard');
        }else{
            //data not found.
            req.flash('error', 'Please enter valid email and password.');
            res.redirect('/login');
        } 
    }).catch(err => {
        req.flash('error', 'Please enter valid email and password.');
        res.redirect('/login');
    });
}

//Search User with firstname, lastname,email
exports.searchUser = (req,res) => {
    var search  = req.body.search;
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            message: "UserDetails body can not be empty"
        });
    }
    //Search data with $OR condition
    UserDetails.find({ $or:[ { "firstName" : { $regex: `^${search}.*`, $options: "i" }},{"email" : { $regex: `^${search}.*`, $options: "i" }},{"lastName" : { $regex: `^${search}.*`, $options: "i" }}] })
    .then(data => {
        sess = req.session;
        if(data.length > 0){
            
            req.flash('data', data);
            res.redirect('/dashboard');
            
        }else{
            req.flash('data', data);
            req.flash('error', "Search data is not found");
            res.redirect('/dashboard');
        }
    }).catch(err => {
        req.flash('error', 'Please enter valid email and password.');
        res.redirect(301,'/login');
    });

}

// fetch user using id while edit page
exports.fetchOne = (req,res) => {
    var userId  = req.params.userId;
    
    UserDetails.findById(userId)
    .then(data => {
        //render edit page with params
        res.render('editUser',{
                data :data,
                message: "Welcome My Signup Page.",
                role : data.roles,
                flag : false,
                city : ["Sihor","Bhavnagar","Ahmedabad","Surat","Baroda"],
                state : ["Gujarat","Rajasthan","Goa","Diu"],
                country : ['India'],
                roles : ["admin","user"]
            }); 

    }).catch(err => {
        req.flash('error', 'Please enter valid email and password.');
        res.redirect('/login');
    });

}

//Update data using id
exports.update = (req,res) => {
    //Get Id
    var userId  = req.params.userId;
    //Get Update Data
    var data = req.body
    UserDetails.findByIdAndUpdate(userId,{
        firstName: data.firstName,
        lastName : data.lastName,
        roles : data.roles,
        email : data.email,
        password : data.password,
        phoneNo : data.phoneNo,
        city : data.city,
        country : data.country
    }, {new: true})
    .then(data => {
        req.flash('success', 'successfull updated record.');
        res.redirect('/dashboard');        
    }).catch(err => {
        req.flash('error', 'Please enter valid email and password.');
        res.redirect('/login');
    });

}

//Delete User using Id
exports.delete = (req, res) => {
    UserDetails.findByIdAndRemove(req.params.userId)
    .then(data => {
        //If data is getting null or undefined through error.
        if(!data) {
            return res.status(404).send({
                message: "Interface not found with id " + req.params.noteId
            });
        }
        req.flash('success', 'successfull updated record.');
        res.redirect('/dashboard');
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Interface not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete interface with id " + req.params.noteId
        });
    });
};