const express  = require('express')
const sf = require('node-salesforce')
require('dotenv').config();

const { sf_user, sf_password, sf_token } = process.env

console.log('sf_user', sf_user)
console.log('sf_password', sf_password)
console.log('sf_token', sf_token)

const app = express()

const port = process.env.PORT || 3000

const conn = new sf.Connection({
    loginUrl : 'https://login.salesforce.com'
})

app.get('/contact/:id', async (req, res) => {

    try{
        const userInfo = await conn.login(sf_user, sf_password + sf_token)

        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        // logged in user property
        console.log('logged in')
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        console.log('getting data')

        const id = req.params.id
        console.log('id passed')
        console.log(id)

        const soql = `SELECT Id, Name FROM Contact WHERE Name LIKE '%${id}%'`
    
        const cons = await conn.query(soql) 

        console.log(cons)

        contact = cons.records.map(item => {
            return {
                Id: item.Id,
                Name: item.Name,
                
            }
        })

        res.send({ data: cons });
    
    } catch(error) {

        console.log('something went wrong')
        console.error(error)
    }
    
})

app.get('', async (req, res) => {

    try{
        const userInfo = await conn.login(sf_user, sf_password + sf_token)

        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        // logged in user property
        console.log('logged in')
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        console.log('getting data')

        const id = req.params.id
        console.log('id passed')
        console.log(id)

        const soql = `SELECT Id, Name, Developer_Level__c FROM Contact WHERE Developer_Level__c != null LIMIT 5`
    
        const cons = await conn.query(soql) 

        console.log(cons)

        contact = cons.records.map(item => {
            return {
                Id: item.Id,
                Name: item.Name,
                Developer_Level__c: item.Developer_Level__c
            }
        })

        res.send({ data: contact });
    
    } catch(error) {

        console.log('something went wrong')
        console.error(error)
    }
    
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})