import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import {
  createTodo,
  deleteTodoById,
  editTodo,
  getAllTodo,
  handleSummarize,
} from "../controllers/todo.controller";

const router = Router();

router.use(isLoggedIn);

router.route("/todo").put(editTodo);

router.route("/summarize").post(handleSummarize);

router.route("/todos").get(getAllTodo).post(createTodo);

router.route("/todos/:id").delete(deleteTodoById);

export default router;
