// ==================== backend/src/controllers/userController.js ====================
import { UserService } from '../services/userService.js';

export class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async linkUsers(req, res, next) {
    try {
      await UserService.linkUsers(req.params.id, req.body.targetUserId);
      res.status(201).json({ message: 'Users linked successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async unlinkUsers(req, res, next) {
    try {
      await UserService.unlinkUsers(req.params.id, req.body.targetUserId);
      res.json({ message: 'Users unlinked successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getGraphData(req, res, next) {
    try {
      const graphData = await UserService.getGraphData();
      res.json(graphData);
    } catch (error) {
      next(error);
    }
  }

  static async addHobby(req, res, next) {
    try {
      const user = await UserService.addHobbyToUser(req.params.id, req.body.hobby);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
