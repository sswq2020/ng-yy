import { Lyric } from 'src/app/services/data-types/common.types';

// [03:56.234]
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export interface BaseLyric {
  txt: string;
  txtCn: string;
}

interface LyricLine extends BaseLyric {
  time: number;
}


export class WyLyric {
  private lrc: Lyric;

  private lines: LyricLine[] = [];

  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
  }
  private init() {
    if (this.lrc.tlyric) {
      this.generTLyric();
    } else {
      this.generLyric();
    }
  }

  generLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach((line) => this.makeLine(line));
  }

  generTLyric() {

  }

  makeLine(line: string) {
    const result = timeExp.exec(line);
    if (result) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = '';
      // 说明是有歌词的
      if (txt) {
        const thirdResult = result[3] || '00';
        const adaptThirdResult = thirdResult.length > 2 ? parseInt(thirdResult, 0) : parseInt(thirdResult, 0) * 10;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + adaptThirdResult;
        this.lines.push({txt, txtCn, time});
      }
    }
  }

  getLines() {
    return this.lines;
  }

}
