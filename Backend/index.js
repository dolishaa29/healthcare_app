let express=require("express");
let path=require("path");
let app=express();

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
let cors=require('cors');

let { health}=require("./dbconnection");
health();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'/public')));
app.use(cors({
  origin:"http://localhost:5173",
  methods:["POST","GET","DELETE","PUT"],
  credentials:true,
}));
app.use("/",require("./router/adminrouter"));
app.use("/",require("./router/doctorrouter"));
app.use("/",require("./router/userrouter"));
const PORT=7000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});