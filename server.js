const express = require('express'),
			dotenv = require('dotenv');

// Load config file for env vars
dotenv.config({path:'./config/config.env'});


const {PORT, NODE_ENV} = {...process.env}
console.log(PORT)
const app = express();

app.get('/api/v1/bootcamps', (req,res)=>{
	res.status(200).json({success:true, data:{first_name:'Josue', last_name:'Martinez', id:10023, route:'show all bootcamps'}});
});

app.post('/api/v1/bootcamps', (req,res)=>{
	res.status(200).json({success:true, data:{first_name:'Josue', last_name:'Martinez', id:10023, route:'create new bootcamp'}});
});

app.get('/api/v1/bootcamps/:bootId', (req,res)=>{
	const {bootId} = {...req.params}
	res.status(200).json({success:true, data:{first_name:'Josue', last_name:'Martinez', id:10023, route:`show bootcamp ${bootId}`, bootId}});
});

app.put('/api/v1/bootcamps/:bootId', (req,res)=>{
	const {bootId} = {...req.params}
	res.status(200).json({success:true, data:{first_name:'Josue', last_name:'Martinez', id:10023, route:`update bootcamp ${bootId}`, bootId}});
});

app.delete('/api/v1/bootcamps/:bootId', (req,res)=>{
	const {bootId} = {...req.params}
	res.status(200).json({success:true, data:{first_name:'Josue', last_name:'Martinez', id:10023, route:`delete bootcamp ${bootId}`, bootId}});
});

app.get('*',(req,res)=>{
	res.status(404).json({success:false, message: 'page not found'})
})

app.listen(PORT,()=>{
	console.log(`Dev Boot Camp running in ${NODE_ENV} mode on port: ${PORT}`)
});