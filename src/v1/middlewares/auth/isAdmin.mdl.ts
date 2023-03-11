import { Request, Response, NextFunction } from "express";
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_BAD_REQUEST } from "../../constants/http-status/http_status";
import { getErrorMessage } from "../../utils/error/errorMessage";
import { getUserById } from "../../services/users/User.service";
import { validateID } from "../../utils/validation/validateID";
import jwt from "jsonwebtoken";
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    validateID(id);
    const foundUser = await getUserById(id);
    !foundUser && new Error("User not found");
    foundUser?.role !== true && new Error("You are not admin");
    next();
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: getErrorMessage(error) });
  }
};

export const authenticationToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHearder = req.headers["authorization"];
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = (authHearder && authHearder.split(" ")[1]) || "";
    if (!token) {
      res.status(HTTP_BAD_REQUEST).json({ error: "Invalid token" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
      req.body.user = decoded;
      next();
    } catch (error) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: getErrorMessage(error) });
    }
  }
};
