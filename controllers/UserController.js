import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

/**
 * Essa classe se trata de um 'controller' das operações relacionadas ao cadastro de usuários.
 */
class UserController {
  /**
   * Método responsável por validar token JWT em relação a determinado e-mail.
   * Se não forem obtidos da requisição token e email, o retorno é de que são necessários email e token.
   * Quando os dois são obtidos pelo método, a validade do token é checada;
   * Se for falsa, o retorno dirá que o token está inválido ou expirado;
   * Se for verdadeira, o email contido no token e o email advindo da requisição são comparados;
   * Se forem iguais, então o retorno é dado como token válido;
   * Caso contrário, o retorno é de que o Token não corresponde aquele e-mail.   *
   * @param {*} req informações da requisição, por onde se obtem tanto o token quanto o email a serem utilizados no método.
   * @param {*} res a reposta, que tem seu valor definido durante o método.
   * @returns retorna um novo valor a res.status, o que indica o resultado da verificação.
   */
  static async checkAuth(req, res) {
    const email = req.query.email;
    const token = req.query.token;

    try {
      if (email && token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (email === decodedToken.email) {
          res.status(200).json({ message: 'Valid token' });
          return;
        }
        res.status(401).json({ message: `Token doesn't match email` });
        return;
      } else {
        res.status(400).json({ message: 'E-mail and token are required' });
        return;
      }
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
  }

  /**
   * Método com o propósito de recuperar todos os usuários do banco de dados, ignorando seus emails e senhas, por se tratarem de informações sensíveis.
   * @param {*} req contéudo da requisição, nesse caso a "ordem" para que sejam listados todos os usuários
   * @param {*} res o contéudo onde se dará a resposta da requisição.
   * @returns retorna novos valores de status indicando o sucesso ou o fracasso da operação. No caso de sucesso é retornado um .json com todos os usuários, se fracassar, uma mensagem de erro é retornada no .json.
   */
  static async getAll(req, res) {
    try {
      const users = await User.findAll({
        raw: true,
        attributes: { exclude: ['password', 'email'] },
      });

      res.status(200).json(users);
      return;
    } catch (error) {
      res.status(500).json({ message: 'Error getting all users' });
    }
  }

  /**
   * Método responsável pelo processo de login. Recebe email e senha por meio da requisição e os valida com o banco de dados.
   * O método checa se foram informados email e senha e a existência de um usuário com o email informado, retornando respostas HTTP e mensagens que indicam estes erros.
   * Encontrando o usuário com o email informado, é verificado se a senha informada está de acordo com a do banco de dados, fazendo o uso do bcrypt.
   * Caso elas não sejam iguais, mais uma resposta HTTP e uma mensagem de senha inválida retornaml.
   * Caso a verificação seja bem sucedia, um token JWT é gerado com o id e email do usuário. São retornados o token, reposta http e uma mensagem de sucesso.
   * @param {*} req conteúdo da requisição, no caso o email e senha que estão serão usados na tentativa de login.
   * @param {*} res conteúdo da resposta da requisição.
   * @returns retorna respostas http junto de mesagens e no caso de sucesso, também retorna um Token JWT.
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        res.status(400).json({ message: 'E-mail and password are required' });
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: 'E-mail unregistered' });
        return;
      }

      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: '10h',
        }
      );

      res.status(200).json({ token, message: 'User logged with success!' });
    } catch (error) {
      res.status(500).json({ message: 'Error on login' });
      console.log(error);
    }
  }

  /**
   * Método responsável por criar um novo cadastro de usuário.
   * Checa se nome, email e senha foram todos informados, em caso negativo retorna uma resposta HTTP e uma mensagem de que estes são necessários.
   * Checa se nome, email e senha não possuem mais de 100 caracteres, retornando uma resposta HTTP e mesagem de erro.
   * Checa se já não existe um usuário cadastrado no sistema com o mesmo e-mail, retornando resposta HTTP e uma mesagem de erro em caso de já existir.
   * Verifica se a senha satisfaz os requisitos de segurança, em caso negativo retornando resposta HTTP e mesagem de erro.
   * Tendo sucesso em todas as verificações é criptografa pelo bcrypt, e o usuário é finalmente criado no banco de dados.
   * O Retorno vem com uma resposta HTPP e uma mensagem que indicam o sucesso ao criar a conta.
   * @param {*} req conteúdo da requisição, no caso as informações informadas para a criação da conta.
   * @param {*} res conteúdo de resposta da requisição.
   * @returns respostas HTPP e mensagens que podem ser de erro ou de sucesso.
   */
  static async register(req, res) {
    const { name, email, password } = req.body;

    if (name && email && password) {
      const lengthCheck =
        [name, email, password].filter(
          (actualString) => actualString.length <= 100
        ).length === 3;
      if (!lengthCheck) {
        res.status(400).json({ message: 'The maximum of characters is 100' });
        return;
      }

      const isExistingUser = await User.findOne({ where: { email } });
      if (isExistingUser) {
        res.status(400).json({ message: 'E-mail already in use' });
        return;
      }

      const isValidPassword =
        password.length >= 6 &&
        password.match(/[!#$@]/g) &&
        password.match(/[\d]/g);
      if (!isValidPassword) {
        res.status(400).json({
          message:
            'Password must have at least 6 characters, one special character (!, #, $, @) and one number',
        });
        return;
      }
      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = {
        name,
        email,
        password: hashPassword,
      };

      await User.create(newUser);
      res.status(200).json({ message: 'User successfully created' });
    } else {
      res
        .status(400)
        .json({ message: 'Name, e-mail and password are required' });
      return;
    }
    try {
    } catch (error) {
      res.status(500).json({ message: 'Error registering user' });
      console.log(error);
      return;
    }
  }

  /**
   * Método responsável por informar os dados básicos de um perfil específico.
   * Os dados são obtidos através da autenticação e descriptografia pelo middleware.
   * O retorno vem com uma resposta HTTP e uma mensagem de um objeto contendo nome, e-mail e imagem de perfil.
   * @param {*} req conteúdo da requisição, no caso as informações informadas para a criação da conta.
   * @param {*} res conteúdo de resposta da requisição.
   * @returns respostas HTTP e mensagens que podem ser de erro ou de sucesso.
   */
  static async profile(req, res) {
    const { name, email, profilePictureName } = req.userData;
    res.status(200).json({ name, email, profilePictureName });
  }
}

export default UserController;
