import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

class CommentController {
  static starsChecker(stars) {
    let messageFinal = 'Valid star ratings: 0.5, 1, ..., 4.5, 5.0';
    if (!(+stars % 5 === 0 || +stars % 0.5 === 0)) {
      return { valid: false, message: messageFinal };
    }
    if (!(+stars <= 5 && +stars >= 0)) {
      return {
        valid: false,
        message: `${stars} need be between 0 and 5. ${messageFinal}`,
      };
    }
    return { valid: true };
  }

  static async getOne(req, res) {
    try {
      const id = req.params.id;
      const comment = await Comment.findByPk(id);

      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error getting specific comment' });
      console.log(error);
      return;
    }
  }

  static async create(req, res) {
    try {
      const postId = req.params.postId;
      const { content, stars } = req.body;

      if (!(content && stars)) {
        res
          .status(400)
          .json({ message: 'Stars and content of comment are required' });
        return;
      }

      const post = await Post.findByPk(postId);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      if (!this.starsChecker(stars).valid) {
        res.status(400).json({ message: this.starsChecker(stars).message });
        return;
      }

      const existingComment = await Comment.findOne({
        where: {
          UserId: req.userData.id,
          PostId: postId,
        },
      });
      if (existingComment) {
        res.status(409).json({ message: 'User already commented' });
        return;
      }

      await Comment.create({
        stars,
        content,
        UserId: req.userData.id,
        PostId: postId,
      });

      res.status(200).json({ message: 'Comment created with success' });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Error on creating comment' });
      console.log(error);
      return;
    }
  }

  static async update(req, res) {
    const id = req.params.id;
    const userId = req.userData.id;
    const { content, stars } = req.body;

    try {
      if (!(content && stars)) {
        res
          .status(400)
          .json({ message: 'Stars and content of comment are required' });
        return;
      }

      const comment = await Comment.findByPk(id);
      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      if (!(comment.get().UserId == userId)) {
        res
          .status(401)
          .json({ message: "This comment doesn't belong to actual user" });
        return;
      }

      if (!this.starsChecker(stars).valid) {
        res.status(400).json({ message: this.starsChecker(stars).message });
        return;
      }

      await comment.update({
        stars,
        content,
      });

      res.status(200).json({ message: 'Comment successfully updated' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating comment' });
      console.log(error);
      return;
    }
  }

  static async delete(req, res) {
    const userId = req.userData.id;
    const commentId = req.params.id;

    try {
      const comment = await Comment.findByPk(commentId);

      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      if (!(comment.get().UserId == userId)) {
        res
          .status(401)
          .json({ message: "This comment doesn't belong to actual user" });
        return;
      }

      await comment.destroy();

      res.status(200).json({ message: 'Comment successfully deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment' });
      console.log(error);
      return;
    }
  }
}

export default CommentController;
