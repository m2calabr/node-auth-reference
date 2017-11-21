# node-auth-reference
A reference build to be a good example for setting up an authentication system.
## Getting Started
* Clone the repo
* Install dependencies
```
cd <project_name>
npm install
```
* Start your mongoDB server
```
mongod
```
* Run the node server
```
node server.js
```
Navigate to `http://localhost:3000`


## Project Structure
| Name | Description |
| ------------- | ----------------------------- |
| **api**       | Controllers for the API calls |
| **config**    | App config files              |
| **Models**    | Mongoose DB Models            |
| **tests**     | Jest Test Scripts             |
| **db.js**     | Database set up code          |
| **jwt.js**    | Java Web Tools set up code    |
| **server.js** | Server Start up               |
| **app.js**    | App base and routing def      |
