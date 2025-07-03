import { Router, Request, Response } from "express";
import {FeedRouter} from './FeedItem/routes/feed.router';
import { UserRouter } from "./User/routes/user.router";
import { AuthRouter } from "./User/routes/auth.router";

const router: Router = Router();

router.use('/feed', FeedRouter);
router.use("/users", UserRouter);
router.use("/auth", AuthRouter); // Assuming authRouter is part of UserRouter

router.get("/", async (req: Request, res: Response) => {
  res.send("V0");
});

export const IndexRouter: Router = router;
