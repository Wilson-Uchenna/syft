import { Router, Request, Response } from "express";

import { User } from "../models/User";

const router: Router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await User.findByPk(id);
  res.send(item);
});

export const UserRouter: Router = router;
