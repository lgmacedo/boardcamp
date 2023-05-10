import { Router } from "express";

import { editCustomer, getCustomerById, getCustomers, postCustomers } from "../controllers/customers.controller.js";

import validateSchema from "../middlewares/validateSchema.middleware.js";
import customerSchema from "../schemas/customer.schema.js";

const customersRouter = Router();
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(customerSchema), postCustomers);
customersRouter.put("/customers/:id", validateSchema(customerSchema), editCustomer);

export default customersRouter;