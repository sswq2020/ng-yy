import { Lyric } from 'src/app/services/data-types/common.types';
import { from, zip, Observable } from 'rxjs';
import { skip } from 'rxjs/internal/operators';

// [03:56.234]
const timeExp = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?\]/;

export interface BaseLyric {
  txt: string;
  txtCn: string;
}

interface LyricLine extends BaseLyric {
  time: number;
}

/**
 * 1.封装网易歌词类,从接口返回的歌词,一步步转换符合LyricLine类型的歌词
 *
 * 2.分成2种情况,一种是没有翻译的歌词,只有lyric,较为简单.另一种是原歌词和翻译歌词lyric和tlyric,较为复杂,只分析第二种情况
 *
 * 3.无论是lyric.length >= tlyric.length,还是lyric.length < tlyric.length
 *
 * 4.原歌词lyric保持完整,翻译歌词tlyric过滤第一次出现时间形如[00:17.048]之前的字符串
 *
 * 5.另外必须获取到原歌词lyric第一次出现[00:17.048]的序号,序号之前的进行截取放在整个歌词的第一部分
 *
 * 6.序号之后的部分,将两种歌词转化为流,利用zip进行融合,最后返回我们想要的歌词
 */
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
    const lines = this.lrc.lyric.split('\n');
    const tlines = this.lrc.tlyric.split('\n').filter(item => {
     return timeExp.exec(item) !== null;
    });

    let timeArr: Array<Array<string>> = [];
    const morelines = lines.length - tlines.length;
    if (morelines >= 0) {
      timeArr = [lines, tlines];
    } else {
      timeArr = [tlines, lines];
    }
    const firstTime = timeExp.exec(timeArr[1][0])[0] ;
    let skipIndex = timeArr[0].findIndex(item => {
      const time = timeExp.exec(item) ? timeExp.exec(item)[0] : null;
      return time === firstTime;
    });
    skipIndex = skipIndex === -1 ? 0 : skipIndex;
    const startLyric = timeArr[0].slice(0, skipIndex);
    if (startLyric.length) {
      startLyric.forEach(line => {
        this.makeLine(line);
      });
    }

    let ziplines$: Observable<Array<string>>;
    if (morelines > 0 ) {
      ziplines$ = zip(from(lines).pipe(skip(skipIndex)), from(tlines));
    } else {
      ziplines$ = zip(from(lines)), from(tlines).pipe(skip(skipIndex));
    }
    // 以后看这里的时候先不要解构,直接打印值,就能理解zip返回的是啥
    ziplines$.subscribe(([line, tline]) => {
      this.makeLine(line, tline);
    } );
  }

  makeLine(line: string, tline: string = '') {
    // exec用法 https://wangdoc.com/javascript/stdlib/regexp.html#regexpprototypeexec
    const result = timeExp.exec(line);
    if (result) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
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
