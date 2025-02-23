import { Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { GenerateImageRequest } from "../types/requests";

export const validateGenerateRequest = (
  req: GenerateImageRequest,
  res: Response,
  next: NextFunction
) => {
  const validations = [
    body("model").optional().isString(),
    body("prompt")
      .isString()
      .notEmpty()
      .withMessage("Prompt is required")
      .isLength({ max: 500 })
      .withMessage("Prompt exceeds 500 characters"),
    body("negativePrompt")
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage("Negative prompt exceeds 500 characters"),
    body("width")
      .optional()
      .isInt({ min: 256, max: 1024 })
      .withMessage("Width must be between 256 and 1024"),
    body("height")
      .optional()
      .isInt({ min: 256, max: 1024 })
      .withMessage("Height must be between 256 and 1024"),
    body("format")
      .optional()
      .isString()
      .isIn(["jpeg", "png"])
      .withMessage("Invalid format. Must be 'jpeg' or 'png'"),
  ];

  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });
};
