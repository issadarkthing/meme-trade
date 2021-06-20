import fs from "fs"
import { resolve } from "path"

export const sampleLink = "htts://reddit.com/sample";
export const coinEmoji = "<:upvote:856114013594714152>";
export const orange = "#ff4400";

export const time: { [key: string]: number } = {
	year: 12 * 30 * 24 * 60 * 60 * 1000,
	month: 30 * 24 * 60 * 60 * 1000,
	week: 7 * 24 * 60 * 60 * 1000,
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000
};

export function walk(dir: string, callBack: (err: Error | null, res?: string) => void) {
	fs.readdir(dir, (err, res) => {
		if (err) return callBack(err);

		res.forEach(child => {

			const p = resolve(dir, child)
			const f = fs.lstatSync(p)

			if (f && f.isDirectory()) {
				walk(p, callBack)
			} else {
				callBack(null, p)
			}
		})
	})
};

export function format(value: number) {
  return value > 1 ? value.toFixed(4) : value.toPrecision(4);
}
