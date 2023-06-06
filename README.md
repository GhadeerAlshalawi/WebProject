<h1 align="center">CS346 Web Development Project </h1>
<h3 align="center">by: </h3>
<h3 align="center">Hanan Owaidh Almutairi </h3>
<h3 align="center">Ghadeer Muiedh Alshalawi </h3>
<h3 align="center">Nouf Hassan Alnakhli </h3>

Web development is the process of creating websites and web applications that can be accessed through the internet. It involves a combination of programming, design, and web server management skills to create dynamic and interactive web pages. 

Web development is typically divided into two main categories: front-end development and back-end development, Front-end development involves creating the user interface and designing the user experience using programming languages such as HTML, CSS, and JavaScript. Back-end development involves creating the server-side code and database management using programming languages such as PHP, Python, or Ruby.

# Project Idea
This ptoject is about <b>ChatRoom</b>, which is a web-based platform that enables users to communicate with each other in real-time.
The ChatRoom can be used for various purposes, such as socializing, networking, or collaborating.

# Project goals

<b>Our goals of creating a chat room is:</b> 
1. Communication: users can connect with each other and share information.
2. Collaboration: A chat room can facilitate collaboration and teamwork among users who are working on a project or task together.
3. Community building: A chat room can help build a community of users who share common interests, goals, or values.
5. Education: A chat room can be used as a platform for online education, such as live classes or study groups.

# Project Description

In this project the ChatRoom enables the user to interact and chat with another person.

<b> This ChatRoom have many basic features which are:</b>
1. User registration and authentication: Users can create an account and log in to the chat room using their credentials.
2. Chat interface: The chat interface allows users to send and receive messages in real-time. 
3. Save and retrieve messages: User messages can be saved and retrieved when the user logs in again.
4. 
# How to use
1. As a new user, click on the register link
2. Enter your username and password
3. You will be directed to the login page
4. Enter your username and password, in addition to the name of the recipient you want to send
5. You will be directed to the chatRoom page with the desired recipient
6. When the conversation is finished, press the Exit button, which will exit the chatRoom


# User Interaction

![4902e80f-901b-49d9-8bfc-0a368dac89c5](https://github.com/noof450/WebProject/assets/95547167/c99052ff-c786-4b09-8c79-577e6380dff6)<br>
                                                     <b> Application flowchart</b>


# ChatRoom
![RegisterPage](https://github.com/noof450/WebProject/assets/95547167/97270836-8511-423b-aa21-fb7e966f4a02)
<b align="center">RegisterPage</b>

![loginPage](https://github.com/noof450/WebProject/assets/95547167/4e5e24e5-34c6-4df1-9788-3a4abf8f79c1)
<b>LoginPage</b>
![chatRoom](https://github.com/noof450/WebProject/assets/95547167/2a3b1ea3-4f5a-4914-b03f-3615b5e683c1)
<b>chatRoom</b>

![chatRoomMessages](https://github.com/noof450/WebProject/assets/95547167/397500ea-c118-4f82-98ad-cdd9fbe1bd82)
<b>chatRoomMessages</b>



# Application main components

Sure! Let me explain each component used in the code snippet you provided for a simple web chat app:

1. <b>`express`:</b> a web framework for Node.js that provides a set of functions and tools for handling HTTP requests, routing, and middleware.

2. <b>`path`:</b>  built-in Node.js module that is used to define the path to the public folder where static files (such as HTML, CSS, and JavaScript) for the web chat app are located.

3. <b>`app`:</b> It the Express object. It is responsible for configuring and managing the web application's routes, middleware, and other settings.

4. <b>`http`:</b>  a built-in Node.js module that is used to create an HTTP server instance named `server`, which will be used by the Socket.IO library.

5. <b>`bcrypt`</b>: a library for Node.js that provides password hashing functions. It is used for securely hashing and comparing passwords.  can be used to hash and store user passwords securely.

6. <b>`socket.io`:</b> a library that enables real-time, bidirectional communication between the web clients and the server. It uses WebSockets under the hood to establish a persistent connection and facilitate real-time messaging. The `io` object represents the Socket.IO server instance.

7. <b>`body-parser`</b>: It is a middleware for Express that parses the body of incoming HTTP requests and makes it accessible in the `req.body` object. It is commonly used to handle form data or JSON payloads sent by clients.

8. <b>`express-session`:</b> a middleware for managing user sessions in Express. It allows the web application to store session data, such as user authentication information, between HTTP requests. This can be useful for authenticating users in a web chat app.




# References
https://github.com/imgitto/Simple-Chatroom-Socket-Based <br>
https://www.freecodecamp.org/news/simple-chat-application-in-node-js-using-express-mongoose-and-socket-io-ee62d94f5804/<br>
https://youtu.be/kLxGA7EtqFk<br>


