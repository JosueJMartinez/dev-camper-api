const express = require('express'),
			dotenv = require('dotenv');

// Load config file for env vars
dotenv.config({path:'./config/config.env'});

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV;

console.log(PORT)
const app = express();

app.get('/', (req,res)=>{
	console.log('in root');
	res.send('hello world');
})

app.listen(PORT,()=>{
	console.log(`Dev Boot Camp running in ${NODE_ENV} mode on port: ${PORT}`)
});