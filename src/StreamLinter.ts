// @ts-nocheck

import stream from 'stream';
import iconv from "iconv-lite";

export default class StreamLinter {
  constructor() {


  }

  init() {
    var liner = new stream.Transform({ objectMode: true })

    liner._transform = function (chunk, encoding, done) {
      var data = iconv.decode(chunk, 'cp936');
      if (this._lastLineData) data = this._lastLineData + data

      var lines = data.split('\n')
      this._lastLineData = lines.splice(lines.length - 1, 1)[0]

      lines.forEach(this.push.bind(this))
      done()
    }

    liner._flush = function (done) {
      if (this._lastLineData) this.push(this._lastLineData)
      this._lastLineData = null
      done()
    }

    return liner
  }
}