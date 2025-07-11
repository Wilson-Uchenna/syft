import { Router, Request, Response } from "express";
import { FeedItem } from "../models/FeedItem";
import { NextFunction } from "connect";
import * as jwt from "jsonwebtoken";
import * as AWS from "../../../../aws";
import * as c from "../../../../config/config";

const router: Router = Router();

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
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
router.get("/0", async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({ order: [["id", "DESC"]] });
  items.rows.map((item) => {
    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });
  res.send(items);
});

// Get a feed resource
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await FeedItem.findByPk(id);
  res.send(item);
});

// Get a signed url to put a new item in the bucket
router.get("/signed-url/:fileName", requireAuth, async (req: Request, res: Response) => {
  const { fileName } = req.params;
  const url = AWS.getPutSignedUrl(fileName);
  res.status(201).send({ url: url });
});

// Create feed with metadata
router.post("/", requireAuth, async (req: Request, res: Response) => {
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
  const item = await new FeedItem({
    caption: caption,
    url: fileName,
  });

  const savedItem = await item.save();

  savedItem.url = AWS.getGetSignedUrl(savedItem.url);
  res.status(201).send(savedItem);
});

export const FeedRouter: Router = router;
