const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: "show all bootcamps",
    },
  });
});

router.post("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: "create new bootcamp",
    },
  });
});

router.get("/:bootId", (req, res) => {
  const { bootId } = { ...req.params };
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: `show bootcamp ${bootId}`,
      bootId,
    },
  });
});

router.put("/:bootId", (req, res) => {
  const { bootId } = { ...req.params };
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: `update bootcamp ${bootId}`,
      bootId,
    },
  });
});

router.delete("/:bootId", (req, res) => {
  const { bootId } = { ...req.params };
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: `delete bootcamp ${bootId}`,
      bootId,
    },
  });
});

module.exports = router;
