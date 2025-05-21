import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import db from "../db";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const createTodo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    if (!title) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Please provide title..."));
    }
    console.info(title, req.body.user);
    const task = await db.todo.create({
      data: {
        title,
        userId: req.body.user.id,
      },
    });

    if (!task) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Error in create task please try later...")
        );
    }

    res.status(201).json(new ApiResponse(201, task, "Task created success..."));
  }
);

export const getAllTodo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body.user;

    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        todos: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Tasks not found..."));
    }

    res
      .status(200)
      .json(new ApiResponse(200, user.todos, "Tasks fetch success..."));
  }
);

export const editTodo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: todoId, completed } = req.body;
    const task = await db.todo.findUnique({
      where: {
        id: todoId,
      },
    });

    if (!task) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Task not found..."));
    }

    const { id: userId } = req.body.user;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "User not found..."));
    }

    const updatedTodo = await db.todo.update({
      where: {
        id: todoId,
      },
      data: {
        title: req.body.title,
        completed: req.body.completed,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, updatedTodo, "Task updated success..."));
  }
);

export const deleteTodoById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: todoId } = req.params;
    const task = await db.todo.findUnique({
      where: {
        id: todoId,
      },
    });
    if (!task) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Task not found..."));
    }

    const todo = await db.todo.delete({
      where: {
        id: todoId,
      },
    });

    res.status(202).json(new ApiResponse(202, todo, "Task delete success..."));
  }
);

export const handleSummarize = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const todos = await db.todo.findMany({
      where: {
        userId: req.body.user.id,
        completed: false,
      },
    });

    // console.info(todos);

    if (!todos || todos.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Task not found..."));
    }

    // summarize the todos using openai
    const summary = todos.map((todo) => todo.title).join(", ");
    // console.info(summary);
    const contents = `
      Summarize the following todos: 
      ${summary}.
      The summary should be a short and concise ordered list of the tasks.
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // const prompt = req.body.prompt;

    const result = await model.generateContent(contents);
    const response = await result.response;
    const text = response.text();

    // send the summary to slack
    const webhookURL = process.env.SLACK_WEBHOOK_URL!;
    const response1 = await axios.post(webhookURL, {
      text: `📝 *New Todo Summary Posted:*\n${text}`,
    });
    // console.info(response1);

    res
      .status(200)
      .json(new ApiResponse(200, { text }, "Summary is sent to slack..."));
  }
);
