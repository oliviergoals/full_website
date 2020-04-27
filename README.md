# Team Swaggy Cohort 2 Group 1
<p align="center"> <img src="https://i.imgur.com/QCclySf.png" width=200></p>

Welcome to the client side of our project. This repository would encompass of a few things, particularly the following: <br>
1. Client WebApp
2. Testings


## How to Run
Here are the steps to load up the web-application: 
1. Enter `cd chat_function`
2. Run `npm install`
3. Run `npm start`
4. This will load up the project on your browser.

In the chat_function, you will file -> **index.html**  
This is the file that we're running on the browser, it calls the following js scripts:
1. ./src/js/sdkSampleApp-noLoader.js
2. ./src/js/components/connection/connectionCmp.js 
3. ./src/js/components/contacts/contactsCmp.js
4. ./src/js/components/contacts/contactCmp.js
5. ./src/js/components/conversations/conversationsCmp.js
6. ./src/js/components/conversations/conversationCmp.js
7. ./src/js/components/conversations/messageCmp.js
8. ./src/js/components/contoller/controllerCmp.js

Each of these scripts will contain the code that has been changed and ammended such that it runs the program, the CSS of each page can be found in the respective folders. 


**Here are the steps to execute the testing.**  
Selenium test:  
1. Change working directory to `./escproject_testing`
2. Change the path of the webdriver to the path that you have downloaded the webdriver for Selenium
3. While running `npm start` for the web-application, run Injection_Test.java or SpamChat.java or SubmitButtTest.java


