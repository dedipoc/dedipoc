import { model, Schema } from "mongoose";
import { IVideo } from "../types/video.type";

const VideoSchema = new Schema(
  {
    displayName: { type: String },
    rawFile: { type: String },
    streamFile: { type: String },
  },
  {
    timestamps: true,
    collation: { locale: "fr", strength: 2 },
  }
);

const VideoModel = model<IVideo>("Video", VideoSchema);

export default VideoModel;
