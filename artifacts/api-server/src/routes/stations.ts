import { Router, type IRouter } from "express";
import { ALL_STATIONS, ALL_LINES, getStationById } from "../data/stations";

const router: IRouter = Router();

router.get("/stations", async (_req, res): Promise<void> => {
  res.json(ALL_STATIONS);
});

router.get("/stations/lines", async (_req, res): Promise<void> => {
  res.json(ALL_LINES);
});

router.get("/stations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const station = getStationById(raw);

  if (!station) {
    res.status(404).json({ error: "Station not found" });
    return;
  }

  const crowdLevels: Array<"low" | "moderate" | "high"> = ["low", "moderate", "high"];
  const crowdLevel = crowdLevels[Math.floor(Math.random() * crowdLevels.length)];

  const nextTrains = [
    { direction: "Northbound", minutesUntil: Math.floor(Math.random() * 5) + 1 },
    { direction: "Southbound", minutesUntil: Math.floor(Math.random() * 8) + 2 },
  ];

  const amenities = ["Wheelchair Access", "Air Conditioning", "Ticket Machines", "CCTV"];
  if (station.isInterchange) amenities.push("Interchange Platform", "Information Desk");

  res.json({ ...station, crowdLevel, nextTrains, amenities });
});

export default router;
