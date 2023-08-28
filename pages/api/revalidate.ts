import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.token !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }
  try {
    const path = req.query.path;
    if (typeof path !== "string") return res.json({ revalidated: true });
    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (error) {
    return res.status(500).send("Error revalidating");
  }
}