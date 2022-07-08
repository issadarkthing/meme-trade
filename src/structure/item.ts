import fetch from "node-fetch"
import { validSubs } from "../main";

interface Data {
  value: number;
  score: number;
  age: number;
  url: string;
  isValid: boolean;
  upvoteRatio: number;
  unit: number;
  image: string;
  subreddit: string;
  title: string;
}

export const MARKET_CAP = 100_000;

export class Item {
  value: number;
  score: number;
  age: number;
  url: string;
  isValid: boolean;
  upvoteRatio: number;
  unit: number;
  image: string;
  subreddit: string;
  title: string;
  constructor(data: Data) {
    this.value = data.value
    this.score = data.score
    this.age = data.age
    this.url = data.url
    this.isValid = data.isValid;
    this.upvoteRatio = data.upvoteRatio;
    this.unit = data.unit;
    this.image = data.image;
    this.subreddit = data.subreddit;
    this.title = data.title;
  }

  async getDelta(): Promise<number> {
    const updatedItem = await Item.getItem(this.url)
    return updatedItem.value - this.value
  }

  async getDeltaPercentage(): Promise<number> {
    const delta = await this.getDelta()
    return delta / this.value * 100
  }

  getMaxUnit() {
    return Math.floor(MARKET_CAP / this.value);
  }

  getValue() {
    return this.value * this.unit;
  }

  static async getItem(url: string, unit = 1) {

    const targetUrl = parseUrl(url)

    const options = {
      headers: {
        'User-Agent': 'sample',
      }
    }
    const res = await fetch(targetUrl + ".json", options)
    const jsonContent = await res.json()

    const post = jsonContent[0].data.children[0].data

    const subreddit = post.subreddit;
    const isValid = isValidSubreddit(subreddit);

    const score: number = post.score;
    const upvoteRatio: number = post.upvote_ratio;
    const age = getTimeSecond() - post.created_utc
    const value = (score / Math.pow(age, 1.2)) * upvoteRatio;
    const image = post.url;
    const title = post.title;
    return new Item({ 
      score, 
      age, 
      value, 
      url, 
      isValid, 
      upvoteRatio, 
      unit,
      image,
      subreddit,
      title,
    })
  }

}

// get rid of query paramater and leading slash
export function parseUrl(targetUrl: string) {
  return targetUrl.replace(/\?.*$/, "").replace(/\/$/, "")
}

export function isComment(targetUrl: string) {
  return targetUrl.split("/").length === 8;
}

function getTimeSecond() {
  return Math.floor(new Date().getTime() / 1000)
}

function isValidSubreddit(subreddit: string) {
  return validSubs.some(validSub => validSub === subreddit);
}
