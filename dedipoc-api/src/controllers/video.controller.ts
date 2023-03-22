import { Request, Response } from "express";
import VideoModel from "../database/models/video.model";
import logger from "../utils/logger";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { PipelineStage } from "mongoose";

export async function addVideo(req: Request, res: Response) {
  try {
    const { displayName, rawFile, streamFile } = req.body;

    if (!displayName) {
      throw new Error(
        "[Validation Error] Missing displayName from request body."
      );
    }
    if (!rawFile && !streamFile) {
      throw new Error(
        "[Validation Error] Missing rawFile or streamFile from request body."
      );
    }

    let video = new VideoModel(req.body);
    await video.save();

    return res.json({ id: video._id });
  } catch (error: any) {
    logger.error("[Add Video] Failed to add video", error);
    return res.status(500).send(error);
  }
}

export async function updateVideo(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { displayName, rawFile, streamFile } = req.body;

    if (!id) {
      throw new Error(
        "[Validation Error] Missing video Id from request params."
      );
    }

    if (!displayName && !rawFile && !streamFile) {
      throw new Error(
        "[Validation Error] Missing displayName or rawFile or streamFile from request body."
      );
    }

    let video = await VideoModel.findById(id);
    if (!video)
      throw new Error(`[Database Error] Could not find video with id ${id} `);
    if (displayName) video.displayName = displayName;
    if (rawFile) video.rawFile = rawFile;
    if (streamFile) video.streamFile = streamFile;

    await video.save();
    return res.json({ video });
  } catch (error: any) {
    logger.error("[Add Video] Failed to add video", error);
    return res.status(500).send(error);
  }
}

export async function getVideos(req: Request, res: Response) {
  try {
    let group = req.query.group;

    let pipeline: PipelineStage[] = [
      {
        $group: {
          _id: "$group",
          videos: {
            $push: {
              id: "$_id",
              displayName: "$displayName",
              rawFile: "$rawFile",
              streamFile: "$streamFile",
              group: "$group",
            },
          },
        },
      },
    ];
    if (group) {
      pipeline = [{ $match: { group } }, ...pipeline];
    }
    let groups = await VideoModel.aggregate(pipeline);
    if (groups.length < 2) {
      groups[0]._id = null;
    }
    return res.json({ groups });
  } catch (error: any) {
    logger.error("[Add Video] Failed to add video", error);
    return res.status(500).send(error);
  }
}

export async function downloadVideo(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error(
        "[Validation Error] Missing video Id from request params."
      );
    }
    const video = await VideoModel.findById(id);
    if (!video)
      throw new Error(`[Database Error] Could not find video with id ${id} `);

    if (!video.rawFile)
      throw new Error(`[File Error] This video cannot be downloaded.`);

    const filePath = path.join("/app/media", video.rawFile);

    if (!fs.existsSync(filePath)) {
      throw new Error(`[File Error] This video cannot be downloaded.`);
    }
    res.type("blob");
    return res.download(filePath);
  } catch (error: any) {
    logger.error(`[Download Video] ${error.toString()}`);
    return res.status(500).send(error);
  }
}

export async function streamVideo(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error(
        "[Validation Error] Missing video Id from request params."
      );
    }
    const video = await VideoModel.findById(id);
    if (!video)
      throw new Error(`[Database Error] Could not find video with id ${id} `);

    if (!video.streamFile)
      throw new Error(`[File Error] This video cannot be streamed.`);

    const filePath = path.join("/app/media", video.streamFile);

    if (!fs.existsSync(filePath)) {
      throw new Error(`[File Error] This video cannot be streamed.`);
    }

    const { size } = fs.statSync(filePath);

    const { range } = req.headers;
    if (!range) {
      const head = {
        "Content-Length": size,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
    const chunksize = end - start + 1;
    const stream = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
      "Cross-Origin-Resource-Policy": "cross-origin",
    };
    res.writeHead(206, head);
    stream.pipe(res);
  } catch (error: any) {
    logger.error("[Add Video] Failed to add video", error);
    return res.status(500).send(error);
  }
}

export async function explore(req: Request, res: Response) {
  try {
    const { path: currentPath } = req.body;
    const currentDir = path.join("/app/media", currentPath);
    const dirContent = fs.readdirSync(currentDir).map((f) => ({
      name: f,
      fullPath: path.join(currentPath, f),
      isDirectory: fs.statSync(path.join(currentDir, f)).isDirectory(),
    }));
    res.send({ path: currentPath, directory: dirContent });
  } catch (error: any) {
    res.status(500).send({ error });
  }
}

export async function getDownloadToken(req: Request, res: Response) {
  const token = jwt.sign({}, process.env.JWT_SECRET || "dev", {
    expiresIn: 60,
  });
  res.send({ token });
}
