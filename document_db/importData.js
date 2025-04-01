const nano = require('nano')('http://admin:password@localhost:15984');
const fs = require('fs');

const dbName = 'books';
const booksDb = nano.db.use(dbName);

async function createDatabase() {
    try {
        await nano.db.create(dbName);
        console.log(`Databáze '${dbName}' vytvořena.`);
    } catch (error) {
        if (error.statusCode === 412) {
            console.log(`Databáze '${dbName}' už existuje.`);
        } else {
            console.error("Chyba při vytváření databáze:", error.message);
        }
    }
}

async function importData() {
    try {
        const rawData = fs.readFileSync('data.json');
        const books = JSON.parse(rawData);

        for (const book of books) {
            const response = await booksDb.insert(book);
            console.log(`Kniha '${book.title}' nahrána s ID: ${response.id}`);
        }
    } catch (error) {
        console.error("Chyba při nahrávání dat:", error.message);
    }
}

(async () => {
    await createDatabase();
    await importData();
})();
