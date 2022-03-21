



module.exports = {
   ensureAuthenticated: function(req, res, next) {
      if(req.isAuthenticated()) {
         return next();
      }
      // req.flash("error_msg", "Please log in to view this resource");
      console.log("Moet inloggen om te kunnen bekijken");
      res.redirect("/log_in");
   }
}




// Node.js With Passport Authentication | Full Project. (2018, 29 december). [Video]. YouTube. https://www.youtube.com/watch?v=6FOq4cUdH8k

