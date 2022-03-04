import { Document, Types, Schema, model, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  password: string;
  tokens: { token: string }[];
}

export interface IUser extends IUserDocument {
  generateAuthToken: () => string;
}

interface IUserModel extends Model<IUser> {
  findByCredentials: (email: string, password: string) => Promise<IUser>;
}

const userSchema: Schema = new Schema(
  {
    firstname: { type: String, required: true, trim: true},
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phonenumber: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    tokens: [{ token: { type: String, required: true } }]
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

userSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function(): Document {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const token: string = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWT_SECRET || ''
  );

  this.tokens = this.tokens.concat({ token });

  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async (
  email: string,
  password: string
): Promise<IUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to sign in');
  }
  return user;
};

// Hash the plain text password before saving
userSchema.pre<IUser>('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const plaintext = this.get('password');
  this.set('password', bcrypt.hashSync(plaintext, 8));
  next();
});

const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User;
