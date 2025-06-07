1. Please install MySQL and MySQL Workbench.
MySQL - https://dev.mysql.com/downloads/mysql/
MySQL Workbench - https://dev.mysql.com/downloads/workbench

2. create new connectction with:
Connection Name: for your choice
HOST: localhost
Username: root
Password: connectRoot
Default Schema: 

2. create DB and fill in the data:
use schema.sql attached.

4. open visual studio code with the project attached.

5. install packages:
npm install --save express // framework to simplify nodejs - using .get and .post, middlware and more
npm install --save mysql2 dotenv body-parser

6. create .env file:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=you_password_here
DB_NAME=hometask
PORT=3000
API_KEY=your_api_key_here

(DB_PASS and API_KEY will be sent in mail)

7. run node app.js to start listening to the port.

8. I used postman to do GET and POST request - you can use URL instead. (see Testing.txt)

9. DO NOT FORGET TO ADD x-api-key
