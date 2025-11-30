# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile
- PATCH /profile
- POST /profile/password/reset

## connectionRequestRouter

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter

- GET /user/request/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platforms

Status: ignore, interested, accepted, rejected
