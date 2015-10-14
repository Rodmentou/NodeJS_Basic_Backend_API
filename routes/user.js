module.exports = function (apiRouter) {
	var User = require('../models/user');

	apiRouter.route('/user')
		.get( function (req, res) {
			User.findById( req.decoded._id, function (err, user) {
				if (err) res.json({ success: false, message: 'User not found'});
				res.json(user);
			});
		})

		.put( function (req, res) {
			User.findById(req.decoded._id, function (err, user) {
				if (err) res.json({ success: false, message: 'User not found'});

				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				user.save( function (err){
					if (err) res.json({ success: false, message: 'Could not save'});
					res.json({ success: true, message: 'User updated'});
			});
		})

		.delete( function (req, res) {
			console.log("Hello, I'm on DELETE.");
		});
	});

}