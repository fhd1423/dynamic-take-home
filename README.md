The tests won't run without the babel.config.js that I removed in the last commit, I removed it to be compatiable with the next.js code.

Notes:
I used NextJS, TailwindCSS, ethers.js, and Google Cloud Firestore because I am most familiar with them, and also I prefer using serverless NoSQL Databases. I also used Dynamic for the initial authentication, and only allowed web3 wallets for simplicity. I only allowed for users to create 1 wallet each as having more would complicate not only the backend but the frontend as well. However, it could definitely be easily implemented with more time. A key weakness is that the site is definitely not secure enough, because as users generate wallets, their public and private keys are simply pushed into a Firestore Database. It would definitely be necessary to encrypt these keys somehow, in case the data can be read from the website maliciously or if Firestore itself becomes insecure. For any custodial cryptocurrency platform there needs to be top-notch security.
