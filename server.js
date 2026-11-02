
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [];

// Task 1: Home Route
app.get("/", (req, res) => {
    res.send("Library Management System API is running");
});

// Task 2: Add New Book
app.post("/api/books", (req, res) => {
    const { id, title, author, category, quantity } = req.body;

    if (
        id === undefined || id === null || String(id).trim() === "" ||
        !title || !author || !category ||
        quantity === undefined || quantity === null
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
            message: "Invalid quantity"
        });
    }
    console.log("Existing books:", books);
    console.log("Requested ID:", id);

    if (books.some(book => String(book.id) === String(id))) {
        return res.status(400).json({
            message: "Book ID already exists"
        });
    }

    const book = {
        id,
        title,
        author,
        category,
        quantity,
        available: quantity
    };

    books.push(book);

    res.status(201).json({
        message: "Book added successfully",
        book
    });
});


app.get("/api/books", (req, res) => {
    res.json(books);
});


app.get("/api/books/:id", (req, res) => {
    const book = books.find(
        book => String(book.id) === req.params.id
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});


app.put("/api/books/:id", (req, res) => {
    const book = books.find(
        book => String(book.id) === req.params.id
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (
        req.body.id !== undefined &&
        String(req.body.id) !== String(book.id)
    ) {
        return res.status(400).json({
            message: "Book ID cannot be changed"
        });
    }

    const { title, author, category, quantity } = req.body;

    if (
        (title !== undefined &&
            (typeof title !== "string" || !title.trim())) ||
        (author !== undefined &&
            (typeof author !== "string" || !author.trim())) ||
        (category !== undefined &&
            (typeof category !== "string" || !category.trim()))
    ) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    if (quantity !== undefined) {
        if (
            !Number.isInteger(quantity) ||
            quantity < book.quantity - book.available
        ) {
            return res.status(400).json({
                message: "Invalid quantity"
            });
        }

        book.available += quantity - book.quantity;
        book.quantity = quantity;
    }

    if (title !== undefined) book.title = title.trim();
    if (author !== undefined) book.author = author.trim();
    if (category !== undefined) book.category = category.trim();

    res.json({
        message: "Book updated successfully",
        book
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});