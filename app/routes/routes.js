module.exports = (app) => {
console.log("passport called :");
	
	const userDetails = require('../controllers/userDetails.js');
	 
    //load login page
    app.get('/login', function(req,res){
    	
		//render ejs template with parameters using nodejs    	
    	res.render('login',{
		   loginErrorMsg: req.flash('error')
	  	});
    });

    //load and Retrieve signup page
    app.get('/signup', function(req,res){

    	//render ejs template with parameters using nodejs
    	res.render('signup',{
		    message: "Welcome My Signup Page.",
		    flag : false,
		    city : ["Sihor","Bhavnagar","Ahmedabad","Surat","Baroda"],
		    state : ["Gujarat","Rajasthan","Goa","Diu"],
		    country : ['India'],
		    roles : ["admin","user"],
		    signupErrorMsg: req.flash('error')
	  	});
    });

    //signout session and redirect login page
    app.get('/logout',function(req,res){

    	//Session Destroy 
    	req.session.destroy();
    	req.flash('error', 'Session Expired.');
        res.redirect(301,'/login');
	});

    //Signup / Create User
    app.post('/signupCheck', userDetails.create);

    //Login / Find User using email and password
    app.post('/login', userDetails.findOne);

    //Get all user Details
    app.get('/userDetails',userDetails.findAll);

    //Get All User Data in Dashboard API
    app.get('/dashboard', userDetails.findAll);

    //Search API on Dashboard page
    app.post('/search',userDetails.searchUser);

    //Edit User using id
    app.post('/editUser/:userId', userDetails.update);

    //Fetch User using id
    app.get('/fetchUser/:userId', userDetails.fetchOne);

    //Delete User using id
    app.get('/deleteUser/:userId', userDetails.delete);

}