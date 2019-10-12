const express = require('express');
const loginControler = require('../controller/mySqlController');
const middleware=require('../controller/middleware');
const router = express.Router();


/**
 * End point use to get all the User
 */
router.get('/searchAllRecord',async (req, res) => {
    result = await loginControler.searchUsers('login');
    const {err,status}=result;
    if(err && status)
    return res.status(status).json({"err":err});
    res.json(result);
});

/**
 * End Point to add user in database
 */
router.post('/add', middleware.validateJwt, async (req, res) => {
    const result = await loginControler.addUser('login', req.body);
    const {err,status}=result;
    if(err && status)
    return res.status(status).json({"err":err});
    res.json(result);
});


/**
 * EndPoint to delete user
 */
router.delete('/delete',middleware.validateJwt,async (req, res) => {
    const result = await loginControler.deleteUser('login', req.body);
    const {err,status}=result;
    if(err && status)
    return res.status(status).json({"err":err});
    res.json(result);
});

module.exports = router;