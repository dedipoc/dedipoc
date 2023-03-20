import { Request, Response } from "express";
import VideoModel from "../database/models/video.model";
import logger from "../utils/logger";
import fs from "fs";
import path from "path";

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
    let videos = await VideoModel.find({});
    return res.json({ videos });
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
    return res.download(filePath);
  } catch (error: any) {
    logger.error("[Add Video] Failed to add video", error);
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
