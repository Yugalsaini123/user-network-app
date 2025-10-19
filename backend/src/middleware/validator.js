// ==================== backend/src/middleware/validator.js ====================
import { AppError } from '../utils/AppError.js';

export const validateCreateUser = (req, res, next) => {
  const { username, age, hobbies } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    throw new AppError(400, 'Username is required and must be a non-empty string');
  }

  if (!age || typeof age !== 'number' || age < 1 || age > 150) {
    throw new AppError(400, 'Age is required and must be between 1 and 150');
  }

  if (!Array.isArray(hobbies) || hobbies.length === 0) {
    throw new AppError(400, 'Hobbies must be a non-empty array');
  }

  if (!hobbies.every(h => typeof h === 'string' && h.trim().length > 0)) {
    throw new AppError(400, 'All hobbies must be non-empty strings');
  }

  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { username, age, hobbies } = req.body;

  if (username !== undefined && (typeof username !== 'string' || username.trim().length === 0)) {
    throw new AppError(400, 'Username must be a non-empty string');
  }

  if (age !== undefined && (typeof age !== 'number' || age < 1 || age > 150)) {
    throw new AppError(400, 'Age must be between 1 and 150');
  }

  if (hobbies !== undefined) {
    if (!Array.isArray(hobbies) || hobbies.length === 0) {
      throw new AppError(400, 'Hobbies must be a non-empty array');
    }
    if (!hobbies.every(h => typeof h === 'string' && h.trim().length > 0)) {
      throw new AppError(400, 'All hobbies must be non-empty strings');
    }
  }

  next();
};

export const validateLinkUsers = (req, res, next) => {
  const { targetUserId } = req.body;

  if (!targetUserId || typeof targetUserId !== 'string') {
    throw new AppError(400, 'targetUserId is required and must be a string');
  }

  next();
};

export const validateAddHobby = (req, res, next) => {
  const { hobby } = req.body;

  if (!hobby || typeof hobby !== 'string' || hobby.trim().length === 0) {
    throw new AppError(400, 'Hobby is required and must be a non-empty string');
  }

  next();
};