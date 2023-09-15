import Post from '../models/Post.js';
import User from '../models/User.js';

class PostController {
  // post/all/<recent|old>?page=<x>&postsPerPage=<x>
  static async getAll(req, res) {
    try {
      const orderParam = req.params.order || 'recent';
      const actualPage = parseInt(req.query.page) || 1;
      const postsPerPage = parseInt(req.query.postsPerPage) || 10;

      let order = '';
      if (orderParam === 'recent') {
        order = 'DESC';
      } else if (orderParam === 'old') {
        order = 'ASC';
      } else {
        res.status(400).json({ message: 'Invalid order filter' });
        return;
      }

      const { count, rows } = await Post.findAndCountAll({
        raw: true,
        limit: postsPerPage,
        offset: (actualPage - 1) * postsPerPage,
        order: [['createdAt', order]],
        include: [
          {
            model: User,
            attributes: ['name'],
          },
        ],
        attributes: { exclude: ['UserId'] },
      });

      const posts = rows.map((post) => ({
        id: post.id,
        title: post.title,
        author: post['User.name'],
        content:
          post.content.substring(0, 500) +
          (post.content.length >= 500 ? '...' : ''),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }));

      res.status(200).json({
        posts,
        actualPage,
        totalPages: Math.ceil(count / postsPerPage),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error getting all posts' });
      return;
    }
  }

  // post/<id>
  static async getOne(req, res) {
    try {
      const id = req.params.id;
      const post = await Post.findByPk(id);

      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error getting specific post' });
      console.log(error);
      return;
    }
    // Puxar comentários também
    // seria o post.getComments();
  }

  // post/<id>/comments
  static async comments(req, res) {
    const id = req.params.id;

    const post = await Post.findByPk(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const comments = await post.getComments();

    res.status(200).json(comments);
  }

  // post/create
  static async create(req, res) {
    try {
      const { id } = req.userData; // from middleware
      const { title, content } = req.body;

      if (!title && !content) {
        res.status(400).json({ message: 'Title and content are required' });
        return;
      }

      if (title.length >= 120) {
        res
          .status(400)
          .json({ message: 'Title must have less than 120 characters' });
        return;
      }

      await Post.create({ title, content, UserId: id });
      res
        .status(200)
        .json({ message: `Post '${title}' created with success!` });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Error creating post' });
      console.log(error);
    }
  }

  // post/<id>/update
  static async update(req, res) {
    try {
      const { id } = req.userData;
      const { title, content } = req.body;
      const postId = req.params.id;

      const post = await Post.findByPk(postId);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      if (!(post.get().UserId == id)) {
        res
          .status(401)
          .json({ message: "This post doesn't belong to actual user" });
        return;
      }

      if (!title && !content) {
        res.status(400).json({ message: 'Title and content are required' });
        return;
      }

      if (title.length >= 120) {
        res
          .status(400)
          .json({ message: 'Title must have less than 120 characters' });
        return;
      }

      await post.update({ title, content });
      res.status(200).json({ message: `Post updated with success!` });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Error editing post' });
      console.log(error);
      return;
    }
  }

  static async delete(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.userData.id;

      const post = await Post.findByPk(postId);

      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      if (!(post.get().UserId == userId)) {
        res
          .status(401)
          .json({ message: "This post doesn't belong to actual user" });
        return;
      }

      post.destroy();

      res.status(200).json({ message: 'Post deleted with success' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post' });
      console.log(error);
      return;
    }
  }
}

export default PostController;
