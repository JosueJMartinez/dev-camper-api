const express = require('express'),
			dotenv = require('dotenv');

// Load config file for env vars
dotenv.config({path:'./config/config.env'});


const {PORT, NODE_ENV} = {...process.env}
console.log(PORT)
const app = express();

app.get('/', (req,res)=>{
	res.status(400).json({first_name:'Josue', last_name:'Martinez'});
})

app.listen(PORT,()=>{
	console.log(`Dev Boot Camp running in ${NODE_ENV} mode on port: ${PORT}`)
});