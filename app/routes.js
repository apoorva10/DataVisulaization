var Subjects = require('./models/SubjectViews');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route
 app.get('/api/data', function(req, res) {
  // use mongoose to get all nerds in the database
  //alert('check1');
  Subjects.find({"business_id":"xkVMIk_Vqh17f48ZQ_6b0w"},function(err, subjectDetails) {
   // if there is an error retrieving, send the error. 
       // nothing after res.send(err) will execute
   if (err) 
   res.send(err);
    res.json(subjectDetails); // return all nerds in JSON format
  });
  //res.send('check');
 });
 app.get('/api/data1',function(req,res)
 {
Subjects.find({"business_id":"uuGlYAIvYAX1q1KhpY6dtA"},function(err, subjectDetails) {
   // if there is an error retrieving, send the error. 
       // nothing after res.send(err) will execute
   if (err) 
   res.send(err);
    res.json(subjectDetails); // return all nerds in JSON format
  });
 });

 



 // frontend routes =========================================================
 app.get('*', function(req, res) {
  res.sendfile('./public/login.html');
 });
}