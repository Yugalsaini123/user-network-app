// ==================== backend/src/routes/userRoutes.js ====================
import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { validateCreateUser, validateUpdateUser, validateLinkUsers, validateAddHobby } from '../middleware/validator.js';

const router = Router();

router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', validateCreateUser, UserController.createUser);
router.put('/users/:id', validateUpdateUser, UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);
router.post('/users/:id/link', validateLinkUsers, UserController.linkUsers);
router.delete('/users/:id/unlink', validateLinkUsers, UserController.unlinkUsers);
router.post('/users/:id/hobby', validateAddHobby, UserController.addHobby);
router.get('/graph', UserController.getGraphData);

export default router;