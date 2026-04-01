let express=require("express");
let path=require("path");

let app=express();
let dotenv=require("dotenv");
dotenv.config();

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
let cors=require('cors');

let { health}=require("./dbconnection");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/public')));
app.use(cors({
  origin:"https://auraahealth.vercel.app",
  methods:["POST","GET","DELETE","PUT"],
  credentials:true,
}));
app.use("/",require("./router/adminrouter"));
app.use("/",require("./router/doctorrouter"));
app.use("/",require("./router/userrouter"));
app.use("/",require("./router/appointrouter"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});