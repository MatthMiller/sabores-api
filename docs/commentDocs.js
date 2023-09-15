/**
 * @swagger
 * /comment/{commentId}:
 *  get:
 *    summary: Get a single comment by ID
 *    tags: [Comments]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1 (example)
 *        description: The ID of the comment to retrieve.
 *
 * /comment/create:
 *  post:
 *    summary: Create a comment (needs auth)
 *    tags: [Comments]
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - stars
 *            - content
 *          properties:
 *            stars:
 *              type: decimal
 *              example: 4.5
 *            content:
 *              type: string
 *              example: Content of the comment.
 *
 * /comment/update/{commentId}:
 *  put:
 *    summary: Update a comment (needs auth)
 *    tags: [Comments]
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - stars
 *            - content
 *          properties:
 *            stars:
 *              type: decimal
 *              example: 4.5
 *            content:
 *              type: string
 *              example: Content of the comment.
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1 (example)
 *        description: The ID of the comment.
 *
 * /comment/delete/{commentId}:
 *  delete:
 *    summary: Delete a comment (needs auth)
 *    tags: [Comments]
 *    parameters:
 *      - in: path
 *        name: commentId
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1 (example)
 *
 *        description: The comment ID.
 */
