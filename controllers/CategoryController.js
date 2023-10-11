import Category from '../models/Category.js';

class CategoryController {
  static async create(req, res) {
    try {
      const { title } = req.body;

      if (title === undefined) {
        res.status(400).json({ message: "A chave 'title' é obrigatória." });
        return;
      }

      if (title.length < 3 || title.length > 50) {
        res
          .status(400)
          .json({ message: 'O título deve ter entre 3 e 50 caracteres.' });
        return;
      }

      await Category.create({ title, imageName: req.uuid });
      res
        .status(200)
        .json({ message: `Categoria '${title}' criada com sucesso` });
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }

  static async getAll(req, res) {
    try {
      const categories = await Category.findAll({ raw: true });

      if (categories.length) {
        const categoriesWithLink = categories.map((actualRegister) => {
          const tempRegister = actualRegister;
          tempRegister.imageLink = `http://${req.headers.host}/images/${tempRegister.imageName}`;
          delete tempRegister.imageName;
          return tempRegister;
        });
        res.status(200).json(categoriesWithLink);
        return;
      }

      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Erro inesperado' });
      console.log(error);
      return;
    }
  }
}

export default CategoryController;
