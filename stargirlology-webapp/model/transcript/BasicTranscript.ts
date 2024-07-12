import type { TimeInfo, TimeInfoCreated } from '../TimeInfo';

interface EditorInfo extends TimeInfoCreated {
  userId: string;
}

interface BasicTranscriptRow extends TimeInfo {
  confidence: number;
  startTime: number;
  endTime: number;
  transcript: string;
  speakerTag: string;
  originalUuid: number;
  uuid: number;
  index: number;
  editors: Array<EditorInfo>;
}

interface BasicTranscript extends TimeInfo {
  editors: Array<EditorInfo>;
  episodeNumber: number;
  episodeTitle: string;
  speaker1: string;
  speaker2: string;
  rows: Array<BasicTranscriptRow>;
}

export type { BasicTranscript, BasicTranscriptRow, EditorInfo };