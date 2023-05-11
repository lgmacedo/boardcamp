import { db } from "../database/database.connect.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  try {
    const rentalsQuery = await db.query(
      `SELECT rentals.*, customers.name AS customer, games.name AS game 
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id 
      JOIN games ON rentals."gameId" = games.id;`
    );
    const rentals = rentalsQuery.rows.map((r) => ({
      ...r,
      rentDate: dayjs(r.rentDate).format("YYYY-MM-DD"),
      returnDate:
        r.returnDate !== null ? dayjs(r.returnDate).format("YYYY-MM-DD") : null,
      customer: { id: r.customerId, name: r.customer },
      game: { id: r.gameId, name: r.game },
    }));
    return res.send(rentals);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  if (
    isNaN(Number(customerId)) ||
    isNaN(Number(gameId)) ||
    isNaN(Number(daysRented)) ||
    daysRented <= 0
  )
    return res.sendStatus(400);
  try {
    const customerQuery = await db.query(
      `SELECT * FROM customers WHERE id = $1;`,
      [customerId]
    );
    const gameQuery = await db.query(`SELECT * FROM games WHERE id = $1;`, [
      gameId,
    ]);
    if (!customerQuery.rowCount || !gameQuery.rowCount)
      return res.sendStatus(400);
    const game = gameQuery.rows[0];

    const rentals = await db.query(
      `SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`,
      [game.id]
    );
    if (rentals.rowCount === game.stockTotal) return res.sendStatus(400);

    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = daysRented * game.pricePerDay;

    await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") 
        VALUES ($1, $2, $3, $4, $5)`,
      [customerId, gameId, rentDate, daysRented, originalPrice]
    );
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function finalizeRentals(req, res) {
  const { id } = req.params;
  try {
    const rentalQuery = await db.query(
      `SELECT rentals.*, games."pricePerDay" 
        FROM rentals JOIN games ON rentals."gameId" = games.id
        WHERE rentals.id = $1;`,
      [id]
    );
    if (!rentalQuery.rowCount) return res.sendStatus(404);
    const rental = rentalQuery.rows[0];
    if (rental.returnDate !== null) return res.sendStatus(400);

    const returnDate = dayjs().format("YYYY-MM-DD");
    const daysLate =
      dayjs(returnDate).diff(dayjs(rental.rentDate), "day") - rental.daysRented;
    const delayFee = daysLate > 0 ? daysLate * rental.pricePerDay : 0;

    await db.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [returnDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function deleteRentals(req, res) {
  const { id } = req.params;
  try {
    const rentalQuery = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [
      id,
    ]);
    if (!rentalQuery.rowCount) return res.sendStatus(404);
    const rental = rentalQuery.rows[0];
    if (rental.returnDate === null) return res.sendStatus(400);
    await db.query(`DELETE FROM rentals WHERE id = $1;`, [id]);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
