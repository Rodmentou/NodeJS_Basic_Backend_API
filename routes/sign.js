module.exports = function (apiRouter) {
	var User = require('../models/user');
	var jwt = require('jsonwebtoken');
	var config = require('../config.js');
	var jwtSecret = config.jwtSecret;
	
	apiRouter.post('/sign/in', function (req, res) {
		User.findOne( {
			username: req.body.username
		}).select('username password').exec( function (err, user) {
			if (err) res.json({ success: false, message: 'DB error'});

			if (!user) {
				res.json({ success: false, message: 'User not found' });

			} else if (user) {
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json( { success: false, message: 'Wrong password' });
				} else {
					var token = jwt.sign({
						username: user.username,
						_id: user._id
					}, jwtSecret, {
						expiresIn: 360000
					});

					res.json({
						success: true,
						message: 'Token created',
						token: token
					});
				}
			}
		});	
	});

	apiRouter.post('/sign/up', function (req, res) {
		var user = new User();
		if (req.body.username && req.body.password) {
			user.username = req.body.username;
			user.password = req.body.password;

			user.save( function (err) {
				if (err) {
					if (err.code == 11000) {
						return res.json({ success: false, message: 'User already exists'});
					} else { 
						return res.send({ success: false, message: 'User not created'}) }
				}
				res.json({ success: true, message: 'User created'});
			});	
		} else {
			return res.status(403).send({
				success: false,
				message: 'Username or password not provided.'
			});
		}

	});

}