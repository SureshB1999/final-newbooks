// src/routes/+page.server.js
// Server-only code. Connects to Postgres. Never sent to the browser.

import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';

const sql = neon(DATABASE_URL);

export async function load() {
	const rows = await sql`
		SELECT
			id,
			date::text AS date,
			description,
			debit,
			credit,
			amount
		FROM transactions
		ORDER BY date
	`;

	return { transactions: rows };
}
