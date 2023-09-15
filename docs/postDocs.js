/**
 * @swagger
 * /post/all/{order}:
 *  get:
 *    summary: Get a list of posts with pagination
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: order
 *        required: false
 *        schema:
 *          type: string
 *          enum: [recent, old]
 *          example: recent (example)
 *        description: The order of the posts. Use "recent" for most recent first, or "old" for oldest first. (defaults to "recent" if not specified)
 *      - in: query
 *        name: page
 *        required: false
 *        schema:
 *          type: integer
 *          example: 1 (example)
 *        description: The page number to retrieve (defaults to 1 if not specified).
 *      - in: query
 *        name: postsPerPage
 *        required: false
 *        schema:
 *          type: integer
 *          example: 10 (example)
 *        description: The number of posts to return per page (defaults to 10 if not specified).
 *
 * /post/{postId}:
 *  get:
 *    summary: Get a single post by ID
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1 (example)
 *        description: The ID of the post to retrieve.
 *
 * /post/create:
 *  post:
 *    summary: Create a new post (needs auth)
 *    tags: [Posts]
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - title
 *            - content
 *          properties:
 *            title:
 *              type: string
 *              example: Title of the post, max. 120 characters.
 *            content:
 *              type: string
 *              example: Content of the post, unlimited characters.
 *
 * /post/{postId}/update:
 *  put:
 *    summary: Update a post (needs auth)
 *    tags: [Posts]
 *    parameters:
 *      - in: body
 *        schema:
 *          type: object
 *          required:
 *            - title
 *            - content
 *          properties:
 *            title:
 *              type: string
 *              example: Title of the post, max. 120 characters.
 *            content:
 *              type: string
 *              example: Content of the post, unlimited characters.
 *      - in: path
 *        name: postId
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1 (example)
 *        description: The post ID.
 *
 * /post/{postId}/delete:
 *  delete:
 *    summary: Delete a post (needs auth)
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: postId
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1 (example)
 *        description: The post ID.
 */
