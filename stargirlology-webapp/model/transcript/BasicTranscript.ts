import type { TimeInfo, TimeInfoCreated } from '../TimeInfo';

interface EditorInfo extends TimeInfoCreated {
  userId: string;
  displayName: string;
}

interface BasicTranscriptRow extends TimeInfo {
  confidence: number;
  startTime: number;
  endTime: number;
  transcript: string;
  speakerTag: string;
  originalUuid: string;
  uuid: string;
  index: number;
  editors: Array<EditorInfo>;
}

interface BasicTranscriptListItem {
  editors: Array<EditorInfo>;
  episodeNumber: number;
  episodeTitle: string;
}


interface BasicTranscript extends TimeInfo, BasicTranscriptListItem {
  speaker1: string;
  speaker2: string;
  rows: Array<BasicTranscriptRow>;
}

export type { BasicTranscript, BasicTranscriptRow, EditorInfo, BasicTranscriptListItem };