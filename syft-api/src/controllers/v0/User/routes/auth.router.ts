import { Response, Request, Router, NextFunction } from "express";
import { User } from "../models/User";
import * as jwt from "jsonwebtoken";
import * as c from "../../../../config/config";
import * as EmailValidator from "email-validator";
import bcrypt from "bcrypt";

const router: Router = Router();

function generateToken(user: User): string {
  return jwt.sign(user.short(), c.config[c.env].app.jwt_secret);
}

async function generatePasswordHash(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.headers || !req.headers.authorization) {
    res.status(401).send({ message: "No authorization headers." });
    return;
  }

  const tokenBearer = req.headers.authorization.split(" ");
  if (tokenBearer.length !== 2) {
    res.status(401).send({ message: "Malformed token." });
    return;
  }

  const token = tokenBearer[1];

  jwt.verify(token, c.config[c.env].app.jwt_secret, (err) => {
    if (err) {
      res.status(401).send({ auth: false, message: "Failed to authenticate." });
      return;
    }

    // Optionally attach the decoded token to the request

    next(); // ✅ Continue to the route
  });
}

router.get("/verification", requireAuth, async (req: Request, res: Response): Promise<void> => {
  res.status(200).send({ auth: true, message: "Authenticated." });
});

router.post("/login", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !EmailValidator.validate(email)) {
    res.status(400).send({ auth: false, message: "Email is required or malformed." });
    return;
  }

  if (!password) {
    res.status(400).send({ auth: false, message: "Password is required." });
    return;
  }

  const user = await User.findByPk(email);
  if (!user) {
    res.status(401).send({ auth: false, message: "User was not found.." });
    return;
  }

  const authValid = await comparePassword(password, user.passwordHash);

  if (!authValid) {
    res.status(401).send({ auth: false, message: "Password was invalid." });
    return;
  }

  const jwt = generateToken(user);
  res.status(200).send({ auth: true, token: jwt, user: user.short() });
});

router.post("/register", async (req: Request, res: Response) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;

  if (!email || !EmailValidator.validate(email)) {
    res.status(400).send({ auth: false, message: "Email is missing or malformed." });
    return;
  }

  if (!plainTextPassword) {
    res.status(400).send({ auth: false, message: "Password is required." });
    return;
  }

  const user = await User.findByPk(email);
  if (user) {
    res.status(422).send({ auth: false, message: "User already exists." });
    return;
  }

  const generatedHash = await generatePasswordHash(plainTextPassword);

  //@ts-ignore
  const newUser = await new User({
    email: email,
    passwordHash: generatedHash,
  });

  const savedUser = await newUser.save();

  const jwt = generateToken(savedUser);
  res.status(201).send({ token: jwt, user: savedUser.short() });
});

router.get("/", async (req: Request, res: Response) => {
  res.send("auth");
});

// This is the main router for authentication-related routes
export const AuthRouter: Router = router;
 