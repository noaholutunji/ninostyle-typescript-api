import express, { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import auth, { IRequest } from '../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  async (req: Request, res: Response): Promise<void> => {
    const user: IUser | null = new User(req.body);

    try {
      const data: IUser = await user.save();
      // const token = await user.generateAuthToken();
      res.status(201).send({ user: data });
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user: IUser = await User.findByCredentials(
        req.body.email,
        req.body.password
      );
      const token: string | null = await user.generateAuthToken();
      res.send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

router.post(
  '/users/logout',
  auth,
  async (req: IRequest, res: Response): Promise<void> => {
    try {
      if (req.user) {
        req.user.tokens = req.user.tokens.filter(
          (token: { token: string | null | undefined }) => {
            return token.token !== req.token;
          }
        );
        await req.user.save();
      }

      res.send();
    } catch (e) {
      res.status(500).send();
    }
  }
);

export default router;
