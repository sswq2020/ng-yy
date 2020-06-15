/**
 * @description 封装歌词类,主要功能承担歌词展示和歌词滚动
 * @author sswq
 */

import { Lyric } from 'src/app/services/data-types/common.types';
import { from, zip, Observable, Subject } from 'rxjs';
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

interface Handler extends BaseLyric {
  lineNum: number;
}

/**
 * @description
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

  private playing = false;

  private curNum:number

  private startStamp:number

  private pauseStamp:number

  private timer:any

  handler = new Subject<Handler>()

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

  /**
   * @description 只有原歌词的处理
   */
  generLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach((line) => this.makeLine(line));
  }
  /**
   * @description 原歌词和翻译歌词的处理
   */
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
        const thirdResult = result[4] || '00'; // 正则修改后,这里也要向后推一位,本来是result[3]
        const adaptThirdResult = thirdResult.length > 2 ? parseInt(thirdResult, 0) : parseInt(thirdResult, 0) * 10;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + adaptThirdResult;
        this.lines.push({txt, txtCn, time});
      }
    }
  }

  getLines() {
    return this.lines;
  }

  /**
   * @description
   * @param startTime 播放从什么时间开始
   */
  play(startTime:number = 0){
    if(!this.lines.length) return
    if(!this.playing) {
      this.playing = true
    }

    this.curNum = this.findCurNum(startTime)
    const now = Date.now();
    console.log(`this.startStamp = now - startTime = ${now} - ${startTime} = ${now - startTime}`)
    this.startStamp = now - startTime;
    if(this.curNum < this.lines.length){
      clearTimeout(this.timer)
      this.playReset()
    }
  }

  private playReset(){
    let line = this.lines[this.curNum]
    const now = Date.now();
    console.log(`delay = line.time - (now - this.startStamp) =
     ${line.time} - (${now} - ${this.startStamp}) = ${line.time - (now - this.startStamp)}`)
    const delay = line.time - (now - this.startStamp) // 这里想过没有为什么不用简单的方法,让两行歌词间隔作为delay?
    this.timer = setTimeout(()=>{
      this.callHandler(this.curNum++);
      if(this.curNum < this.lines.length && this.playing){
        this.playReset()
      }
    },delay)
  }

  private callHandler(i:number){
    console.log(i)
    this.handler.next({
      txt:this.lines[i].txt,
      txtCn:this.lines[i].txtCn,
      lineNum:i,
    })
  }

  /**
   * @description 根据time从this.lines找到第几行
   * @param time
   */
  findCurNum(time:number):number {
    const index = this.lines.findIndex(line => time <= line.time)
    return index === -1 ? this.lines.length - 1: index;
  }

  togglePlay(playing:boolean){
  const now = Date.now()
  this.playing = playing
  if(playing){
    const startTime = (this.pauseStamp || now) - (this.startStamp || now)
    this.play(startTime)
  }else {
    this.stop();
    this.pauseStamp = now
    console.log('停止的时间',this.pauseStamp)
  }
}

  stop(){
    if(this.playing){
      this.playing = false
    }
    clearTimeout(this.timer)
  }
}
