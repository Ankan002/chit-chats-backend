# Chit Chats API

<img src="https://res.cloudinary.com/exponents/image/upload/v1654398191/chit-chats/deployment-assets/icon_sk9phu.png" style="width: 200px;" />

An API to manage all workings of the main Chit Chats app.

## Getting Started

- First of all create a folder and open a terminal on it.

- Now run this following command to clone the repo: ```git clone https://github.com/Ankan002/chit-chats-backend.git```.

- You should now go into the cloned directory.

- Open up the directory in to a code editor now.

- Finally create a ``.env`` file.

- Now create the following environment variables:

  - ``PORT``: This variable defines on which PORT number the app will run. Not required for production if deployed on ``HEROKU``

  - ``SECRET``: This variable defines secret key for Jsonwebtoken (``JWT``).

  - ``DB_URI``: This will define the ``MongoDB`` database to which the app will get connected.

  - ``CLOUDINARY_NAME``: This variable defines ``cloudinary`` cloud name.

  - ``CLOUDINARY_API_KEY``: This variable defines ``cloudinary`` API key.

  - ``CLOUDINARY_API_SECRET``: This variable defines ``cloudinary`` API secret.

- Failure in putting up of any of these environment variables might lead to crashing of the app.

- Now go back to the terminal and run first ```npm i -g typescript```.

- Then run ```yarn``` to install all the dependencies.

- Finally run ```yarn dev``` to start the development server.

- ``Note``: If there is a ``ts-node`` error then again run ```npm i -g ts-node```

That's you will be ready to test the app locally. Once app starts successfully you will be able to see the following in your terminal:

```curl
App is running at port ${PORT}
Connected to DB
```

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Couldinary](https://img.shields.io/badge/-Cloudinary-%233577E5?style=for-the-badge)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
