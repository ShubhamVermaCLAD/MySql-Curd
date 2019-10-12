const express=require('express');
const curdOperation=require('./routers/routes');
const login=require('./routers/loginRoutes');
const app = express();
const PORT=3000;

//Body Parser Middleware
app.use(express.json());

//To handle url encoded data (for forms)
app.use(express.urlencoded({extended:true}));

//To route all to curd Operation
app.use('/curd',curdOperation);

app.use('/login',login);


//host app
app.listen(PORT,()=>console.log(`Server is running on Port ${PORT}`));