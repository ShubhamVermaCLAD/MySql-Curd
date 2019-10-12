const jsonWebToken = require('./jwtValidator');
const validator = require("./validator")
const mySql = require('../models/mysql');
const errConfig = require('../config/errorConfig.json');

module.exports = {
    /**
     * function to search all user 
     * return json 
     */
    searchUsers: async (tableName) => {
        result = await mySql.searchAll(tableName);
        const { err } = result;
        //for database server related error
        if (err) return errConfig.database.connection;
        return result;
    },
    /**
     * function to add user 
     * return json  
     */
    addUser: async (tableName, prams) => {
        let err;
        //check prams (userName , password,email)
        if (!(err = validator.validateUserName(prams.userName)) && !(err = validator.validatePassword(prams.password)) && !(err = validator.validateEmail(prams.email))) {
            const value = `"${prams.userName}","${prams.password}","${prams.email}","${prams.role}"`
            const result = await mySql.insertUser(tableName, value);
            const { err } = result;
            //for database server related error
            if (err) return errConfig.database.connection;
            return { "msg": "user is added", "data": result }
        }
        return { "status": errConfig.filed_validation.status, "err": err }
    },
    /**
     * function for login
     * @param {string} tableName tableName
     * @param {object} prams user object
     * return json 
     */
    login: async (tableName, prams) => {
        let err;
        //check prams (userName , password)
        if (!(err = validator.validateUserName(prams.userName)) && !(err = validator.validatePassword(prams.password))) {
            const sql = `userName="${prams.userName}" AND password="${prams.password}"`;
            const record = await mySql.searchRecord(tableName, sql)
            const { err } = record;
            //for database server related error
            if (err) return errConfig.database.connection;
            const userData = record[0];
            if (record.length > 0) {
                const payload = { "userName": record[0].userName, "password": record[0].password, "role": record[0].role };
                const token =await jsonWebToken.getToken(payload);
                const refToken=await jsonWebToken.getRefToken(payload);
                return { "Authorization": token, "refToken": refToken, "userData": userData }
            }
            return errConfig.authorization.user_not_exist;
        }
        return { "status": errConfig.filed_validation.status, "err": err }
    },
    /**
     * function to delete user
     * @param {string} tableName tableName
     * @param {object} prams user object
     * return json 
     */
    deleteUser: async (tableName, prams) => {
        let err;
        if (!(err = validator.validateUserName(prams.userName))) {

            const result = await mySql.deleteUser(tableName, prams);
            const { err } = result;
            //for database server related error
            if (err) return errConfig.database.connection;
            if (result.affectedRows > 0) {
                return { "msg": "user is deleted", "data": result }
            }
            return errConfig.authorization.user_not_exist;
        }
        else {
            return { "status": errConfig.filed_validation.status, "err": err }
        }
    },
}