const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

const DL_API_BASE = "https://ytdl-api-xdi.onrender.com/api/dl";
const FALLBACK_API = "https://video-down-api.vercel.app/api/download";

async function fetchSongInfo(videoUrl) {
	// First API
	try {
		const res = await axios.get(DL_API_BASE, {
			params: { link: videoUrl, format: "mp3" },
			timeout: 60000
		});

		if (res.data?.downloadUrl) {
			return {
				downloadUrl: res.data.downloadUrl,
				source: "primary"
			};
		}
	} catch (err) {
		console.log("[sing] Primary API failed:", err.message);
	}

	// Fallback API
	try {
		const res = await axios.get(FALLBACK_API, {
			params: {
				url: videoUrl,
				type: "mp3"
			},
			responseType: "stream",
			timeout: 120000
		});

		const contentType = res.headers["content-type"] || "";

		if (
			contentType.includes("audio") ||
			contentType.includes("octet-stream")
		) {
			return {
				stream: res.data,
				source: "fallback"
			};
		}

		res.data.destroy();
		throw new Error("Fallback API returned invalid content");
	} catch (err) {
		console.log("[sing] Fallback API failed:", err.message);
		throw new Error("Both download APIs failed: " + err.message);
	}
}

async function saveStream(stream, filePath) {
	if (!fs.existsSync(CACHE_DIR)) {
		fs.mkdirSync(CACHE_DIR, { recursive: true });
	}

	const writer = fs.createWriteStream(filePath);

	await new Promise((resolve, reject) => {
		stream.pipe(writer);

		stream.on("error", reject);
		writer.on("error", reject);
		writer.on("finish", resolve);
	});

	const stats = fs.statSync(filePath);

	if (stats.size < 1024) {
		fs.unlinkSync(filePath);
		throw new Error("Downloaded file is too small");
	}
}

async function downloadFile(url, filePath) {
	const response = await axios.get(url, {
		responseType: "stream",
		timeout: 300000,
		maxContentLength: Infinity,
		maxBodyLength: Infinity,
		headers: {
			"U
