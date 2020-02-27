import mysql from "mysql2";
import { createWriteStream } from "fs";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: "13306",
  user: "dev_user",
  password: "dev_password",
});

function writeEmployees() {
  return new Promise((resolve, reject) => {
    const outFile = createWriteStream("./output.csv");
    connection.query("use employees");
    const query = connection.execute("SELECT * FROM `employees`");

    query.on("result", row => {
      const csvLine: string[] = [];
      csvLine.push(`"${row.emp_no}"`);
      csvLine.push(`"${formatDate(row.birth_date)}"`);
      csvLine.push(`"${row.first_name}"`);
      csvLine.push(`"${row.last_name}"`);
      csvLine.push(`"${row.gender}"`);
      csvLine.push(`"${formatDate(row.hire_date)}"`);
      outFile.write(csvLine.join(","));
      outFile.write("\n");
    });
    query.on("error", reject);
    query.on("end", () => {
      outFile.close();
      resolve();
    });
  });
}

async function main() {
  await writeEmployees();
  connection.close();
}

function formatDate(dt: Date): string {
  const yr = dt.getFullYear();
  const mo = `${dt.getMonth() + 1}`.padStart(2, "0");
  const day = `${dt.getDate()}`.padStart(2, "0");
  return `${mo}/${day}/${yr}`;
}

main();
