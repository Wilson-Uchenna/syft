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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedRouter = void 0;
exports.requireAuth = requireAuth;
const express_1 = require("express");
const FeedItem_1 = require("../models/FeedItem");
const jwt = __importStar(require("jsonwebtoken"));
const AWS = __importStar(require("../../../../aws"));
const c = __importStar(require("../../../../config/config"));
const router = (0, express_1.Router)();
function requireAuth(req, res, next) {
    if (!req.headers || !req.headers.authorization) {
        res.status(401).send({ message: "No authorization headers." });
        return;
    }
    const tokenBearer = req.headers.authorization.split(" ");
    if (tokenBearer.length != 2) {
        res.status(401).send({ message: "Malformed token." });
        return;
    }
    const token = tokenBearer[1];
    return jwt.verify(token, c.config[c.env].app.jwt_secret, (err) => {
        if (err) {
            return res.status(500).send({ auth: false, message: "Failed to authenticate." });
        }
        return next();
    });
}
// Get all feed items
router.get("/0", async (req, res) => {
    const items = await FeedItem_1.FeedItem.findAndCountAll({ order: [["id", "DESC"]] });
    items.rows.map((item) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
});
// Get a feed resource
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const item = await FeedItem_1.FeedItem.findByPk(id);
    res.send(item);
});
// Get a signed url to put a new item in the bucket
router.get("/signed-url/:fileName", requireAuth, async (req, res) => {
    const { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
});
// Create feed with metadata
router.post("/", requireAuth, async (req, res) => {
    const caption = req.body.caption;
    const fileName = req.body.url; // same as S3 key name
    if (!caption) {
        res.status(400).send({ message: "Caption is required or malformed." });
        return;
    }
    if (!fileName) {
        res.status(400).send({ message: "File url is required." });
        return;
    }
    //@ts-expect-error
    const item = await new FeedItem_1.FeedItem({
        caption: caption,
        url: fileName,
    });
    const savedItem = await item.save();
    savedItem.url = AWS.getGetSignedUrl(savedItem.url);
    res.status(201).send(savedItem);
});
exports.FeedRouter = router;
