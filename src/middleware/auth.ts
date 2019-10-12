import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export interface IRequest extends Request {
  token?: string | null | undefined;
  user?: { [u: string]: any } | null | undefined;
  header: string | any;
}

const auth = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded: string | object | any = jwt.verify(
      token,
      process.env.JWT_SECRET || ''
    );
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export default auth;
