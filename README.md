# Testing task for a Fora Soft JS Developer
## The chat which is implemented with socket.io

### To test please follow the below instructions.

* `git clone <this repo>`
* In the `server` directory run: 
    * `npm install`
    * `npm run build`
    * `npm run start` (port must be 3000)

* Then to start frontend:
* In the `client` directory run:
    * `cd timur-eit-chat` 
    * `npm install` 
    * `npm run start`

* Then on the welcome page please input your name, click on the button or press TAB => ENTER
* To join to the chat room, please copy full URL string and paste it into a new browser window
* Then enter the name of another user
* To send a message please input your text into the text filed and then click on ‘SEND’ or press TAB => ENTER

## List of technologies used:

Server:
* TypeScript (Node.js)
* Express
* socket.io

Frontend:
* ReactJS
* TypeScript
* Material-UI
* SASS
* socket.io-client