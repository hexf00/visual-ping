
import child_process, { ChildProcessWithoutNullStreams } from 'child_process';

import fs from "fs";
import StreamLinter from "./StreamLinter";
import EventEmiter from './EventEmiter';

export default class PingManager extends EventEmiter {
  private ip: string = ""
  private stream: ChildProcessWithoutNullStreams | null = null

  constructor(ip: string) {
    super();
    this.ip = ip

  }

  start() {
    this.stream = child_process.spawn('ping', [this.ip, '-t'])

    // 每次读取一行
    var liner = new StreamLinter().init()
    this.stream.stdout.pipe(liner)

    liner.on("readable", () => {
      var line
      while (line = liner.read()) {
        var r = line.match(/时间[<|=](\d+)ms/)
        if (r) {
          var now = new Date()
          this.emit("data", { delay: parseInt(r[1]), time: new Date().toISOString().substr(0, 19) + "Z" })
        }
      }
    })

    this.stream.stderr.on('data', (err: any) => {
      console.error("error", this.ip, err)
    })

    this.stream.on('close', (err: any) => {
      console.log("close", this.ip)
    })

    return this
  }

  stop() {
    return this.stream?.disconnect()
  }
}