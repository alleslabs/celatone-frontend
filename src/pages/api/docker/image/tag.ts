import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "GET") {
    const { repository, image } = req.query;
    const endpoint = "https://hub.docker.com/v2/namespaces";

    const response = await axios.get(
      `${endpoint}/${repository}/repositories/${image}/tags`
    );

    res.status(response.status).send(response.data);
  }

  res.status(405).send({ message: "Method Not Allowed" });
}
