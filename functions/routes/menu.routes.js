const {Router: expressRouter} = require("express");
const ctrlMenu = require("../controllers/menu.controller");

const router = expressRouter();

// Get all menues
router.get("/api/menues", ctrlMenu.getMenues);

// Create new menu
router.post("/api/menu", ctrlMenu.createMenu);

// Delete menu if exists
router.delete("/api/menu/:id", ctrlMenu.deleteMenu);

module.exports = router;
