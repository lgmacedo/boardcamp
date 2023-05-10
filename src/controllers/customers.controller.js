import { db } from "../database/database.connect.js";

export async function getCustomers(req, res) {
  try {
    const customers = await db.query("SELECT * FROM customers;");
    return res.send(customers.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [
      id,
    ]);
    if (!customer.rows.length) return res.sendStatus(404);
    return res.send(customer.rows[0]);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function postCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [
      cpf,
    ]);
    if (customer.rows.length) return res.sendStatus(409);
    await db.query(
      `INSERT INTO customers ("name", "phone", "cpf", "birthday") VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
    return res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function editCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  try {
    const customer = await db.query(
      `SELECT * FROM customers WHERE cpf = $1 AND id <> $2;`,
      [cpf, id]
    );
    if (customer.rows.length) return res.sendStatus(409);
    await db.query(
      `UPDATE customers SET "name" = $1, "phone" = $2, "cpf" = $3, "birthday" = $4 WHERE id = $5;`,
      [name, phone, cpf, birthday, id]
    );
    return res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
