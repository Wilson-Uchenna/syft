"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
exports.requireAuth = requireAuth;
const express_1 = require("express");
const User_1 = require("../models/User");
const jwt = __importStar(require("jsonwebtoken"));
const c = __importStar(require("../../../../config/config"));
const EmailValidator = __importStar(require("email-validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = (0, express_1.Router)();
function generateToken(user) {
    return jwt.sign(user.short(), c.config[c.env].app.jwt_secret);
}
async function generatePasswordHash(password) {
    const saltRounds = 10;
    const salt = await bcrypt_1.default.genSalt(saltRounds);
    return bcrypt_1.default.hash(password, salt);
}
async function comparePassword(password, hash) {
    return bcrypt_1.default.compare(password, hash);
}
function requireAuth(req, res, next) {
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
router.get("/verification", requireAuth, async (req, res) => {
    res.status(200).send({ auth: true, message: "Authenticated." });
});
router.post("/login", async (req, res) => {
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
    const user = await User_1.User.findByPk(email);
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
router.post("/register", async (req, res) => {
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
    const user = await User_1.User.findByPk(email);
    if (user) {
        res.status(422).send({ auth: false, message: "User already exists." });
        return;
    }
    const generatedHash = await generatePasswordHash(plainTextPassword);
    //@ts-ignore
    const newUser = await new User_1.User({
        email: email,
        passwordHash: generatedHash,
    });
    const savedUser = await newUser.save();
    const jwt = generateToken(savedUser);
    res.status(201).send({ token: jwt, user: savedUser.short() });
});
router.get("/", async (req, res) => {
    res.send("auth");
});
// This is the main router for authentication-related routes
exports.AuthRouter = router;
