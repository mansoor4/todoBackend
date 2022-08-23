import { Router } from 'express';

/* Import Middlewares */
import isAuthenticated from '../middlewares/index/isAuthenticated';
import todoValidation from '../middlewares/todo/todoValidation';
import validationError from '../middlewares/index/validationError';

/* Import Controllers */
import {
    createTodo, getAllTodo, updateTodo, deleteTodo,
} from '../controllers/todo';

const router = Router();

router.post('/', isAuthenticated, todoValidation, validationError, createTodo);
router.get('/', isAuthenticated, getAllTodo);
router.put('/:todoId', isAuthenticated, todoValidation, validationError, updateTodo);
router.delete('/:todoId', isAuthenticated, deleteTodo);

export default router;
