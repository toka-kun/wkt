const axios = require("axios");
const express = require("express");
const router = express.Router();
const path = require("path");
const http = require('http');
const serverYt = require("../../server/youtube.js");

// ▼▼ ここを "video_config.json" から params を取得する式に変更 ▼▼
async function getYtParams() {
  const url = "https://raw.githubusercontent.com/siawaseok3/wakame/master/video_config.json";

  try {
    const response = await axios.get(url);
    if (response.data && response.data.params) {
      return response.data.params;
    }
    throw new Error("params が JSON 内に見つかりませんでした");
  } catch (err) {
    console.error("getYtParams error:", err.message);
    throw new Error("params を取得できませんでした");
  }
}
// ▲▲ ここまで変更 ▲▲


router.get('/edu/:id', async (req, res) => {
  const videoId = req.params.id;
  try {
    const params = await getYtParams();
    const videosrc = `https://www.youtubeeducation.com/embed/${videoId}${params}`;

    const Info = await serverYt.infoGet(videoId);

    const videoInfo = {
      title: Info.primary_info.title.text || "",
      channelId: Info.secondary_info.owner.author.id || "",
      channelIcon: Info.secondary_info.owner.author.thumbnails[0].url || '',
      channelName: Info.secondary_info.owner.author.name || "",
      channelSubsc: Info.secondary_info.owner.subscriber_count.text || "",
      published: Info.primary_info.published,
      viewCount: Info.primary_info.view_count.short_view_count?.text || Info.primary_info.view_count.view_count?.text || "",
      likeCount: Info.primary_info.menu.top_level_buttons.short_like_count || Info.primary_info.menu.top_level_buttons.like_count || Info.basic_info.like_count || "",
      description: Info.secondary_info.description.text || "",
      watch_next_feed: Info.watch_next_feed || "",
    };
          
    res.render('tube/umekomi/edu.ejs', {videosrc, videoInfo, videoId});
  } catch (error) {
     res.status(500).render('tube/mattev', { 
      videoId, 
      error: '動画を取得できません',
      details: error.message 
    });
  }
});

router.get('/edurl', async (req, res) => {
  try {
    const params = await getYtParams();
    res.send(`${params}`);
  } catch (error) {
     res.status(500).send(error);
  }
});

router.get('/nocookie/:id', async (req, res) => {
  const videoId = req.params.id;
  try {
    const videosrc = `https://www.youtube-nocookie.com/embed/${videoId}`;

    const Info = await serverYt.infoGet(videoId);

    const videoInfo = {
      title: Info.primary_info.title.text || "",
      channelId: Info.secondary_info.owner.author.id || "",
      channelIcon: Info.secondary_info.owner.author.thumbnails[0].url || '',
      channelName: Info.secondary_info.owner.author.name || "",
      channelSubsc: Info.secondary_info.owner.subscriber_count.text || "",
      published: Info.primary_info.published,
      viewCount: Info.primary_info.view_count.short_view_count?.text || Info.primary_info.view_count.view_count?.text || "",
      likeCount: Info.primary_info.menu.top_level_buttons.short_like_count || Info.primary_info.menu.top_level_buttons.like_count || Info.basic_info.like_count || "",
      description: Info.secondary_info.description.text || "",
      watch_next_feed: Info.watch_next_feed || "",
    };
          
    res.render('tube/umekomi/nocookie.ejs', {videosrc, videoInfo, videoId});
  } catch (error) {
     res.status(500).render('matte', { 
      videoId, 
      error: '動画を取得できません',
      details: error.message 
    });
  }
});

module.exports = router;
