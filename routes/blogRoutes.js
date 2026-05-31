const router = require("express").Router();

const path = require("path");

const slugify = require("slugify");

const upload = require("../middleware/upload");

const auth = require("../middleware/authMiddleware");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post(
  "/create",
  auth,
  upload.single("featuredImage"),

  async (req, res) => {
    try {
      const {
        title,
        excerpt,
        content,
        seoTitle,
        seoDescription
      } = req.body;

      if (!title || !excerpt || !content) {
        return res.status(400).json({
          message: "Title, excerpt, and content are required"
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Featured image is required"
        });
      }

      const slug = slugify(title, {
        lower: true
      });

      const uploadedPath = req.file.path.replace(/\\/g, "/");
      const featuredImage = uploadedPath.startsWith("http")
        ? uploadedPath
        : `${req.protocol}://${req.get("host")}/uploads/blogs/${path.basename(uploadedPath)}`;

      const blog = await prisma.blog.create({
        data: {
          title,
          slug,
          excerpt,
          content,

          seoTitle,
          seoDescription,

          featuredImage
        }
      });

      res.json(blog);
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "A blog with this title already exists"
        });
      }

      console.error(error);

      res.status(500).json({
        message: "Failed to create blog"
      });
    }
  }
);

router.get("/", async (req, res) => {

  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(blogs);
});

router.get("/:slug", async (req, res) => {

  const blog = await prisma.blog.findUnique({
    where: {
      slug: req.params.slug
    }
  });

  res.json(blog);
});

router.delete("/:id", async (req, res) => {

  await prisma.blog.delete({
    where: {
      id: Number(req.params.id)
    }
  });

  res.json({
    success: true
  });
});

module.exports = router;
