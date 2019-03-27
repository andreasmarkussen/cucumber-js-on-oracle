import * as path from "path";
import * as fs from "fs";
export class TypeScriptFile {
    public content: string;
    public filePath: string = "";
    constructor(public pathName: string, public fileName: string) {
        this.filePath = path.join(pathName, fileName);
        if (!this.fileName.includes(".ts"))
            this.filePath += ".ts";
        this.addLine("//Generated file - DO NOT ALTER");
        this.addLine("//Timestamp:" + new Date(Date.now()).toISOString());
        this.addLine("//Generated using TypeScriptGenerator.ts ");
    }
    public addLine(line) {
        if (this.content === undefined)
            this.content = line;
        else
            this.content += "\n" + line;
    }
    public save() {
        fs.writeFileSync(this.filePath, this.content);
    }
}
