
# ChatsApp - Real-Time Chatting Application

ChatsApp is a modern real-time chat application built using the MERN stack. Stay connected with friends and family through seamless messaging.




## Features

- Instant messaging with real-time updates
- Photo and file sharing for seamless communication
- Group chats to connect with multiple people at once
- Secure authentication for safe conversations
- User-friendly and responsive UI


## Tech Stack

**Client:** React, TailwindCSS, React-Router, Zustand

**Server:** Node, Express

**Communication:** Socket.IO

**Database:** MongoDB, Mongoose (ODM)

**UI:** ShadCN

**Image Management:** Cloudinary

**Authentication:** JWT




## Screenshot and Demo 

![Register Page](https://github.com/user-attachments/assets/31c1225d-d846-48f6-8760-4f6b7fe4a55f)

Minimalistic and clean **Login and Registration** Page

---

![Profile](https://github.com/user-attachments/assets/a91518a6-36b0-48bb-a6f6-6cc34397858d)

Once logged in, a new user would require to complete their **profile** setup where they can add their name, upload a profile picture or choose from the different colours for their avatar.

---

![Chat Page](https://github.com/user-attachments/assets/2912837f-7b38-4228-8658-5c42e37bf53e)

After profile completion, the user would be guided to an empty chat screen. Here they can add new people or create new groups.

---

![Add Contact](https://github.com/user-attachments/assets/2607ce94-0311-45f1-b36a-b56e1e458634)

The user can **add new people** to chat with them.

---

![DM](https://github.com/user-attachments/assets/14c15e70-8423-49f8-8982-89d8b973008e)

Send **real time messages** to your friends/family. 

---

![Smiley](https://github.com/user-attachments/assets/f28d328a-5114-4db7-bdb8-b327ec3925c9)

Users can **send images and also use smileys** in ChatsApp.

---

![New Group](https://github.com/user-attachments/assets/c5539487-e129-4938-93b1-7c598f233081)

Make new **groups** to send messages and communicate with a group of  people at the same time.

---

![Group Chat](https://github.com/user-attachments/assets/f15d9687-752e-4a37-9aef-66645583b25f)

 All the users will receive the messages instantly.







## Run Locally

Clone the project

```bash
  git clone https://github.com/sarthakchugh/chatsapp-messenger.git  
```

Before following the next steps, please check the [environment variables](#environment-variables) required to run the project.

Go to the project directory

```bash
  cd chatsapp-messenger
```

Go to the server directory

```bash
  cd server
```

Install server dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

In a new terminal, navigate to the client directory

```bash
  cd client
```
Install server dependencies

```bash
  npm install
```
Start the client

```bash
  npm run dev
```
Navigate to the link in the terminal (http://localhost:5173)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the server directory:

To use Mongo DB - 
`MONGODB_URI`

To link to client -
`ORIGIN`

Secure key for JWT -
`JWT_KEY`

To use Cloudinary - 
`CLOUD_NAME`
`API_KEY`
`API_SECRET`

Add the following environment variables to your .env file in the client directory:

To link to server -
`VITE_API_URL`








## Feedback

If you liked this project, please star it on Github. If you have any feedback, please reach out to me at sar.chugh@gmail.com. 

