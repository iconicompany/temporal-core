import type { Response } from "express";

export const withErrorHandling = async (handler: () => Promise<void>, res: Response): Promise<void> => {
  try {
    await handler();
  } catch (error) {
    console.error("Error in /loadVacancy:", error);

    if (error instanceof Error) {
      res.status(500).json({
        error: "An error occurred while processing resumes.",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "An error occurred while processing resumes.",
      });
    }
  }
};
