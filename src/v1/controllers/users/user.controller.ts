import { Request, Response, NextFunction } from 'express';
import {
   HTTP_INTERNAL_SERVER_ERROR,
   HTTP_SUCCESS,
   HTTP_FORBIDDEN,
} from '../../constants/http-status/http_status';
import { getErrorMessage } from '../../utils/error/errorMessage';
import * as userServices from '../../services/users/User.service';
import { validateID } from '../../utils/validation/validateID';
import { generateToken } from '../../middlewares/jwt/jwtToken';

// Login user client
export const login = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = await userServices.login(req.body);
      res.cookie('refreshToken', user.refreshToken, {
         httpOnly: true,
         maxAge: 72 * 60 * 60 * 1000,
      });
      res.status(HTTP_SUCCESS).json({ user: user, Token: generateToken(user.user._id) });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

// send otp

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
   const { email, otp } = req.body;
   try {
      const verifyOTP = await userServices.verifyOTP(email, otp);
      res.status(HTTP_SUCCESS).json(verifyOTP);
   } catch (error) {
      console.error(error);
      next(error);
   }
};
export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
   const { email } = req.body;
   try {
      const sendOTP = await userServices.sendOTP(email);
      res.status(HTTP_SUCCESS).json(sendOTP);
   } catch (error) {
      console.error(error);
      next(error);
   }
};
// register user client
export const register = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = await userServices.register(req.body);
      res.status(HTTP_SUCCESS).json(user);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      validateID(id);
      const { currentPassword, newPassword } = req.body;
      const user = await userServices.changePassword(id, currentPassword, newPassword);
      res.status(HTTP_SUCCESS).json(user);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = await userServices.logout(req.cookies.refreshToken);

      if (!user) {
         res.clearCookie('refreshToken', { httpOnly: true, secure: true });
         return res.status(HTTP_FORBIDDEN).json({ error: 'User not found' });
      }
      res.clearCookie('refreshToken', { httpOnly: true, secure: true });
      res.status(HTTP_SUCCESS).json({ message: 'Logout successfully' });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

// Admin Controller
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const user = await userServices.getUsers();
      res.status(HTTP_SUCCESS).json(user);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      validateID(id);
      const user = await userServices.getUserById(id);
      res.status(HTTP_SUCCESS).json(user);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      validateID(id);
      await userServices.deleteUser(id);
      res.status(HTTP_SUCCESS).json({ message: 'User deleted successfully' });
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      validateID(id);
      const user = await userServices.updateUser(id, req.body);
      res.status(HTTP_SUCCESS).json(user);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const handleRefreshToken = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const cookie = req.cookies;
      console.log(cookie);
      if (!cookie?.refreshToken) throw new Error('Token not found');
      const refreshToken = cookie.refreshToken;
      const user = await userServices.getUserByRefreshToken(refreshToken);
      console.log(user);
      if (!user) throw new Error('User not found');
   } catch (error) {
      console.error(error);
      next(error);
   }
};
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
   const { email, newPassword } = req.body;
   try {
      const user = await userServices.changePasswordForget(email, newPassword);
      res.status(HTTP_SUCCESS).json(user);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      validateID(id);
      const user = await userServices.blockUser(id);
      res.status(HTTP_SUCCESS).json(user);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      validateID(id);
      const user = await userServices.unblockUser(id);
      res.status(HTTP_SUCCESS).json(user);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

// customer
export const getAllCustomer = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const customer = await userServices.getAllCustomer();
      res.status(HTTP_SUCCESS).json(customer);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const getCustomerById = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { id } = req.params;
   validateID(id);
   try {
      const customer = await userServices.getCustomerById(id);
      res.status(HTTP_SUCCESS).json(customer);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const customer = await userServices.register(req.body);
      res.status(HTTP_SUCCESS).json(customer);
   } catch (error) {
      console.error(error);
      next(error);
   }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
   const { id } = req.params;
   validateID(id);
   try {
      const updateCustomer = await userServices.updateCustomer(id, req.body);
      res.status(HTTP_SUCCESS).json(updateCustomer);
   } catch (error) {
      console.error(error);
      next(error);
   }
};
/* export const changePasswordCustomer = async (req: Request, res: Response) => {
   const { id } = req.query;
   validateID(id as string);
   try {
      console.log(id);
      //      const changePassword = await userServices.changePasswordCustomer(id, req.body);
   } catch (error) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: getErrorMessage(error) });
   }
};
 */

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
   const { id } = req.params;
   validateID(id);
   try {
      const deleteCustomer = await userServices.deleteUser(id);
      res.status(HTTP_SUCCESS).json(deleteCustomer);
   } catch (error) {
      console.error(error);
      next(error);
   }
};
