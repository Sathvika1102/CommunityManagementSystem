const express = require('express');
const mongoose = require('mongoose');
const devuser = require('./devusermodel');
const complaint=require('./complaintmodel');
const notice = require('./noticeboardmodel');
const middleware = require('./middleware');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const { GetAuthHeader } = require('./client/src/Headers');
const admin = require('./adminmodel');

mongoose.connect('mongodb+srv://21b01a05c1:1234@cluster0.bmcefay.mongodb.net/?retryWrites=true&w=majority').then(
    () => console.log('DB connected')
)

app.get('/', (req, res) => {
    return res.send('hello world')
})
app.use(express.json())
app.use(cors({origin:'*'}));

app.post('/register',async (req, res) =>{
    try{ 
        console.log(req.body)
        const {fullname, email,mobile, societyname, societyaddress, city, district, postalcode, flatno, password, confirmpassword} = req.body;
        const exist = await devuser.findOne({email});
        if(exist){
            return res.status(400).send('user already exists')
        }

        console.log('passwprd = ', password)
        console.log('confirmpassword = ', confirmpassword)
        if(password !== confirmpassword){
           return res.status(403).send('password invalid');
        }

        let newUser = new devuser({
            fullname, email,mobile, societyname, societyaddress, city, district, postalcode, flatno, password, confirmpassword
        })

        newUser.save();
        return res.json({status:'success', message: 'user registered successfully'})
    }
    catch(err){
        console.log(err);
        return res.json({status:'error', message: 'Server error'})
    }
});

app.post('/login', async (req, res) =>{
    try{
      const {email, password} = req.body;
      const exist = await devuser.findOne({email});
      if(!exist){
        return res.status(400).send('user not exists')
      }
      if(exist.password != password){
        return res.status(404).send('incorrect password');
      }
      let payload = {
        user:{
            id:exist.id
        }
      }
      jwt.sign(payload, 'jwtPassword', {expiresIn:360000000},
      (err, token) =>{
          if(err) throw err
          return res.json({token})
      })
    }

    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.get('/allprofiles' ,async (req, res) =>{

    try{
        let allprofiles = await devuser.find(); 
        return res.json(allprofiles);
    }
    catch(err){
        console.log(err);
        return res.status(404).send('Server Error')
    }
})

app.get('/myprofile', middleware, async (req, res) =>{
    try{
        let user = await devuser.findById(req.user.id);
        return res.json(user);
    }
    catch(err){
        console.log(err);
        return res.status(400).send('Server Error')
    }
})


app.post('/complaint',async (req, res) =>{
    try{ 
        
        // const {title, description, status, createdAt, createdBy } = req.body;
        const {title, description} = req.body;
         const token = req.headers.authorization;
        // const token = localStorage.getItem('jwtToken');
        console.log(req.body)
        
        let decoded = jwt.verify(token, 'jwtPassword');
        console.log('decoded', decoded);

        const userid =  decoded.user.id;
        console.log('userid', userid);

       const existuser = await devuser.findOne({_id: userid});
       console.log('existuser', existuser);


        let newComplaint = new complaint({
            title,
            description,
            status:false,
            createdAt: new Date(),
            createdBy: existuser._id
        })

        newComplaint.save();
        return res.json({status:'success', message: 'complaint registered successfully'})
    }
    catch(err){
        console.log(err);
        return res.status(504).send('Server Error')
    }
});

app.get('/allcomplaints', async (req, res) => {
    try {
        console.log('came to allcomplaints')
        let allComplaints = await complaint.find(); 
        return res.json(allComplaints);
      } 
    catch (err) {
        console.log(err);
        return res.status(404).send('Server Error');
    }
});



app.get('/mycomplaint', middleware, async (req, res) =>{
    try{
        const token = req.headers.authorization;
        console.log(token)
        
        let decoded = jwt.verify(token, 'jwtPassword');
        console.log('decoded', decoded);

        const userid =  decoded.user.id;
        console.log('userid', userid);

        let existComplaint = await complaint.find({createdBy: userid});
        return res.json(existComplaint);
    }
    catch(err){
        console.log(err);
        return res.status(400).send('Server Error')
    }
})

app.post('/notice', async (req, res) => {

    try{
        const{title, content} = req.body;
        let newNotice = new notice({
            title, content
        }) 
        newNotice.save();
        return res.json({status:'success', message:'notice registered successfully'}) 
    }
    catch(err){
        console.log(err);
        return res.json({status:'error', message:'Server error'})
    }
});

app.get('/allnotice', async (req, res) =>{

    try{
        let allnotices = await notice.find();
        console.log(allnotices); 
        return res.json(allnotices); 
    }
    catch(err){
        console.log(err);
        return res.status(404).send('Server Error');
    }
})

app.post('/adminregister', async (req, res) => {

    try{
        const {email, password} = req.body;
        let adminreg = new admin({
            email, password
        }) 

        adminreg.save();
        return res.json({status:'success', message:'admin registered successfully'})
    }

    catch(err){
        console.log(err);
        return res.json({status:'error', message:'server error'})
    }
})

app.post('/adminlogin', async (req, res) => {

    try{
        
        const {email, password} = req.body;
        const exist = await admin.findOne({email});
        if(!exist){
          return res.status(400).send('user not exists')
          }
        if(exist.password != password){
            return res.status(404).send('incorrect password');
          }
       return res.json({status:'success', message: 'admin login successfully'})

    }
    catch(err){
        console.log(err);
        res.json({status:'error', message:'server error'})
    }
})
const port = 7008;
app.listen(port, () => console.log('server running'));

