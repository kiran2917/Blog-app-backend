const router = require("express").Router();

const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { username }
  });

  if (!admin) {
    return res.status(400).json({
      message: "Invalid credentials"
    });
  }


  const valid = await bcrypt.compare(
    password,
    admin.password
  );

  if (!valid) {
    return res.status(400).json({
      message: "Invalid credentials"
    });
  }

  req.session.adminId = admin.id;

  res.json({
    success: true
  });
});

router.post("/logout", (req, res) => {

  req.session.destroy();

  res.json({
    success: true
  });
});

module.exports = router;