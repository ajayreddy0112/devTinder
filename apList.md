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

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/connection
- GET /user/request/received
- GET /user/feed - Gets you the profiles of other users on platforms

Status: ignore, interested, accepted, rejected
