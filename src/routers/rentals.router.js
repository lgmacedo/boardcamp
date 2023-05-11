import { Router } from "express";

import { deleteRentals, finalizeRentals, getRentals, postRentals } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);
rentalsRouter.post("/rentals/:id/return", finalizeRentals);
rentalsRouter.delete("/rentals/:id", deleteRentals);

export default rentalsRouter;