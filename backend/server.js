import express from 'express';
import client from './client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT;

const app = express();


app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

app.use(cookieParser());

app.use(express.json());


const verifyToken = async (req, res, next) => {
  // const {Authorization} = req.headers;
  // const token = Authorization.split(' ')[1];

  // const token = req.cookies.token
  try {

    const { token } = req.cookies

    if (!token) return res.status(401).send('unauthorized!');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return res.status(401).send('not authed');

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).send('unauthorized!');
  }
}

app.get('/api/me', verifyToken, async (req, res, next) => {

  try {
    const { user } = req;
    console.log(user);

    if (!user) return res.status(401).send('not authed');

    res.json({ message: 'user is authenticated using cookies and JWT', user });

  } catch (err) {
    console.log(err);
    res.send('err with auth');
  }
});

app.post('/api/register', async (req, res, next) => {
  try {
    const { email, password, firstName } = req.body;

    const { rows: [newUser] } = await client.query(`
      INSERT INTO users (email, password, first_name)
      VALUES ($1, $2, $3)
      RETURNING *;`, [email, await bcrypt.hash(password, 5), firstName]);

    if (!newUser) return res.status(400).send('couldnt create user');

    const token = jwt.sign({ id: newUser.id, name: newUser.first_name }, process.env.JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: true,
      maxAge: 1000 * 60 * 1,
    }).json(newUser);

  } catch (err) {
    console.log(err);
    res.send('err with registering')
  }
});


app.post('/api/login', async (req, res, next) => {

  try {
    const { email, password } = req.body;

    const { rows: [userAcc] } = await client.query(`SELECT * FROM users WHERE email = $1;`, [email]);
    if (!userAcc) return res.status(404).send('no acc with that info');

    const pwMatch = await bcrypt.compare(password, userAcc.password);
    if (!pwMatch) return res.status(401).send('unauthed');

    const token = jwt.sign({ id: userAcc.id, name: userAcc.first_name }, process.env.JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 5,
    }).json({ message: 'logged in!', user: userAcc });
  } catch (err) {
    console.log(err);
    return res.status(400).send('trouble logging in');
  }
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
