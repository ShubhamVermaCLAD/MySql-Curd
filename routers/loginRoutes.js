const express = require('express');
const loginControler = require('../controller/mySqlController');
const router = express.Router();


/**
 * End Point for login 
 */
router.post('/', async (req, res) => {
    const result = await loginControler.login('login', req.body);
    const {err,status}=result;
    if(err && status)
    return res.status(status).json({"err":err});
    res.json(result);
});

module.exports=router;