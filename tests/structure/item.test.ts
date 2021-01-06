import { parseUrl } from "../../src/structure/item"


describe("strip query paramater", () => {
	
	it("with query param", () => {
		const url = "https://www.reddit.com/r/dankmemes/comments/kr41e3/i_searched_for_copper_and_found_gold/?utm_source=share&utm_medium=web2x&context=3"
		expect(parseUrl(url)).toBe("https://www.reddit.com/r/dankmemes/comments/kr41e3/i_searched_for_copper_and_found_gold")
	})

	it("without query param", () => {
		const url = "https://www.reddit.com/r/dankmemes/comments/kr41e3/i_searched_for_copper_and_found_gold/"
		expect(parseUrl(url)).toBe("https://www.reddit.com/r/dankmemes/comments/kr41e3/i_searched_for_copper_and_found_gold")
	})
})
