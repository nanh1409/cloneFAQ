import { NextApiHandler, NextApiResponse } from "next";

export const errorResponse = (res: NextApiResponse, statusCode: number = 500, message: string = "Internal Server Error") => {
  res.status(statusCode).send(message);
  res.end();
  return;
}

export const getNextEndpoint = (endpoint: string) => {
  if (endpoint.startsWith("http")) return endpoint;
  return `${window.location.origin}${endpoint}`;
}

export class APIHandler {
  get?: NextApiHandler;
  post?: NextApiHandler;
  patch?: NextApiHandler;
  del?: NextApiHandler;
  constructor(args: Partial<Record<"get" | "post" | "patch" | "del", NextApiHandler>>) {
    this.get = args.get;
    this.post = args.post;
    this.patch = args.patch;
    this.del = args.del;
  }
}

export const createHandler = (args: APIHandler): NextApiHandler => (req, res) => {
  if (req.method === "GET" && args.get) {
    return args.get(req, res);
  }
  if (req.method === "POST" && args.post) {
    return args.post(req, res);
  }
  if (req.method === "PATCH" && args.patch) {
    return args.patch(req, res);
  }
  if (req.method === "DELETE" && args.del) {
    return args.del(req, res);
  }
  return res.status(405).json({ message: "Method is not allowed" });
}