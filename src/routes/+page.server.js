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
export const actions = {
	// 'default' runs when a form on the page is submitted with no action= attribute.
	default: async ({ request }) => {
		// 1. Get the form data the browser sent.
		const formData = await request.formData();

		const date = formData.get('date');
		const description = formData.get('description');
		const debit = formData.get('debit');
		const credit = formData.get('credit');
		const amount = formData.get('amount');

		// 2. Insert the new row into Postgres.
		await sql`
			INSERT INTO transactions
				(date, description, debit, credit, amount)
			VALUES
				(${date}, ${description}, ${debit}, ${credit}, ${amount})
		`;

		// 3. Return success. SvelteKit automatically re-runs load().
		return { success: true };
	}
};
