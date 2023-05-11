import { db } from "../database/database.connect.js";
import dayjs from "dayjs";

export async function getCustomers(req, res) {
  const {cpf} = req.query;
  try {
    const customersQuery = cpf? await db.query(`SELECT * FROM customers WHERE cpf LIKE $1 || '%';`, [cpf]) : await db.query("SELECT * FROM customers;");
    const customers = customersQuery.rows.map((c)=>(
      {
        ...c,
        birthday: dayjs(c.birthday).format("YYYY-MM-DD"),
      }
    ));
    return res.send(customers);
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
    return res.send({
      ...customer.rows[0],
      birthday: dayjs(customer.rows[0].birthday).format("YYYY-MM-DD"),
    });
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
