import Recipe from '../models/Recipe.js';

class RecipeController {
  /**
   * Como fazer puxar o base64 da imagem no JavaScript do client:
   * https://refine.dev/blog/how-to-base64-upload/#example
   * usando o objeto FileReader.
   */

  static async create(req, res) {
    try {
      const { title, videoLink, ingredients, content } = req.body;

      if ([title, ingredients, content].includes(undefined)) {
        res.status(400).json({
          message: "The keys 'title', 'ingredients' and 'content' are required",
        });
        return;
      }

      if (title.length < 3 || title.length > 100) {
        res.status(400).json({
          message: 'Title must have between 3 and 100 characters',
        });
        return;
      }

      if (typeof ingredients !== 'number' && ingredients % 1 !== 0) {
        res.status(400).json({
          message: "'ingredients' must be an integer",
        });
        return;
      }

      await Recipe.create({
        title,
        imageName: req.uuid,
        ingredients,
        content,
        videoLink: videoLink === undefined ? null : videoLink,
      });

      res.status(200).json({ message: 'Receita criada com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }
}

export default RecipeController;
