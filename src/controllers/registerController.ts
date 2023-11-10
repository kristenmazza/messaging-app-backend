import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { body, validationResult } from 'express-validator';

export const register_user = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email is not valid')
    .notEmpty()
    .withMessage('Email cannot be blank')
    .custom(async (value: string) => {
      const existingUser = await User.findOne({ email: value });

      if (existingUser) {
        throw new Error('A user already exists with this email');
      }
    }),

  body('password')
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 0,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
    .withMessage(
      'Password must contain 6 characters with at least 1 lowercase letter, 1 uppercase letter, and 1 symbol'
    ),

  body('c_password')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Passwords do not match'),

  body('displayName').notEmpty().withMessage('Display name cannot be blank'),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { displayName, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.create({
        email: email,
        displayName: displayName,
        password: hashedPassword,
      });

      res.status(201).json({ success: `New user ${email} created` });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ message: message });
    }
  },
];
