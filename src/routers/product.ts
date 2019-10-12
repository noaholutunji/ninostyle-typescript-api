import express, { Response, Router } from 'express';
import Product, { IProductDocument } from '../models/product';
import auth, { IRequest } from '../middleware/auth';

const router = express.Router();

router.post(
  '/products',
  auth,
  async (req: IRequest, res: Response): Promise<void> => {
    const product: IProductDocument = new Product({
      ...req.body,
      owner: req.user && req.user._id
    });

    try {
      await product.save();
      res.status(201).send(product);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get('/products', (req: IRequest, res: Response) => {
  Product.find({}, function(err, product) {
    if (err) {
      res.status(500).send();
    } else {
      res.status(200).send(product);
    }
  });
});

router.get('/products/:id', (req: IRequest, res: Response) => {
  const _id = req.params.id;

  Product.findById(_id)
    .then(product => {
      if (!product) {
        return res.status(404).send();
      }
      res.send(product);
    })
    .catch(e => {
      res.status(500).send();
    });
});

// Update a campground by id
router.patch('/products/:id', auth, async (req: IRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'brand', 'price', 'image', 'description'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      {
        _id: req.params.id,
        owner: req.user && req.user._id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).send();
    }

    res.send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/products/:id', auth, async (req: IRequest, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user && req.user._id
    });

    if (!product) {
      res.status(404).send();
    }

    res.send(product);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
