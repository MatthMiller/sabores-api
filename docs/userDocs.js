/**
 * @swagger
 * /user/check-auth:
 *  get:
 *    summary: Check if a token is valid for a given email
 *    tags: [Users]
 *    parameters:
 *      - in: query
 *        name: email
 *        required: true
 *        schema:
 *          type: string
 *          format: email
 *          example: "example@email.com"
 *        description: The email associated with the token.
 *      - in: query
 *        name: token
 *        required: true
 *        schema:
 *          type: string
 *          example: "eyJhbGciOijIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJtYXRoZXVzQG1haWwuY29tIiwiaWF0IjoxNjkwMzE0Njc0LCJleHAiOjE2OTAzNTA2NzR9.BfPvRqo39Ii9njCycjSyP68GDLaZwBg5rNALsXhUI-E"
 *        description: The authentication token to check.
 *
 * /user/all:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 *
 * /user/login:
 *  post:
 *    summary: Authenticate user with email and password
 *    tags: [Users]
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *              example: example@email.com
 *            password:
 *              type: string
 *              example: validP4ssw@ord
 *
 * /user/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Users]
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - email
 *            - password
 *          properties:
 *            name:
 *              type: string
 *              example: Example Name
 *            email:
 *              type: string
 *              example: example@email.com
 *            password:
 *              type: string
 *              example: validP4ssw@ord
 *
 *
 */
