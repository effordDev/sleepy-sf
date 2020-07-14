const express  = require('express')
const sf = require('node-salesforce')
require('dotenv').config();

const { sf_user, sf_password, sf_token } = process.env

const app = express()

const port = process.env.PORT || 3000

const conn = new sf.Connection({
    loginUrl : 'https://login.salesforce.com'
})

conn.login(sf_user, sf_password + sf_token, error => {
    if (error) { return console.error(err); }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
  });

app.get('/contact/:id', (req, res) => {
    res.send('hello from node')

    const _id  = req.params.id 

    const soql = `
        SELECT Id, Name
        FROM Contact
        WHERE Id =: ${_id};`

    conn.query(soql, (err, result) => {
        if (err) {
            res.sendStatus(500);
        } else if (result.records.length === 0) {
            res.status(404).send('Session not found.');
        } else {

            const formattedData = result.records.map(r => {
                let speakers = [];
                
                speakers = r.records.map(
                    record => {
                        return {
                            id: record.Id,
                            name: record.Name
                        };
                    }
                );
            });
            res.send({ data: formattedData });
        }
    });

    

})



app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})