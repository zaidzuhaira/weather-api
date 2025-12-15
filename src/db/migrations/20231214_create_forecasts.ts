import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("forecasts", (table: Knex.TableBuilder) => {
    table.increments("id").primary();
    table.string("city").notNullable();
    table.string("state").notNullable();
    table.bigInteger("date").notNullable(); // timestamp in milliseconds
    table.decimal("lat", 10, 6).notNullable();
    table.decimal("long", 10, 6).notNullable();
    table.integer("temp_fahrenheit").notNullable();
    table.integer("temp_celsius").notNullable();
    table.integer("humidity").notNullable();
    table.integer("wind_speed").notNullable();
    table.text("daily_summary").notNullable();
    table.text("alerts").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.unique(["city", "state", "date"]);
    table.index(["city", "state"]);
    table.index(["date"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("forecasts");
}
