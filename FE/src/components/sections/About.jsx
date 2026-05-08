"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Building2, ChevronLeft, ChevronRight, Pause, Play, ShieldCheck, Sparkles } from "lucide-react";
import { getSiteContent } from "@/services/api";

function cleanYouTubeId(value) {
  return value ? value.replace(/[^a-zA-Z0-9_-]/g, "") : null;
}

function getYouTubeId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return cleanYouTubeId(parsed.pathname.split("/").filter(Boolean)[0]);
    }

    if (host.endsWith("youtube.com")) {
      const videoParam = parsed.searchParams.get("v");
      if (videoParam) return cleanYouTubeId(videoParam);

      const [type, id] = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(type)) return cleanYouTubeId(id);
    }
  } catch {
    const match = url.match(/(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([^&?/\s]+)/);
    return match ? cleanYouTubeId(match[1]) : null;
  }

  return null;
}

function getAboutVideoItems(about) {
  const rawUrls = [
    ...(Array.isArray(about?.videoUrls) ? about.videoUrls : []),
    about?.videoUrl,
  ];
  const urls = Array.from(new Set(rawUrls.map((url) => `${url || ""}`.trim()).filter(Boolean)));

  return urls
    .map((url) => ({ url, id: getYouTubeId(url) }))
    .filter((item) => item.id)
    .map((item, index) => ({ ...item, label: `Video ${index + 1}` }));
}

function getYouTubeThumbnailUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function ensureYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (window.__khienHaYouTubeApiPromise) return window.__khienHaYouTubeApiPromise;

  window.__khienHaYouTubeApiPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return window.__khienHaYouTubeApiPromise;
}

function buildYouTubeEmbedUrl(videoId) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    iv_load_policy: "3",
    controls: "0",
    disablekb: "1",
    fs: "0",
  });

  if (typeof window !== "undefined") {
    params.set("origin", window.location.origin);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function About() {
  const [about, setAbout] = useState(null);
  const [capabilities, setCapabilities] = useState([]);
  const [youtubeState, setYoutubeState] = useState("idle");
  const [youtubeTitles, setYoutubeTitles] = useState({});
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const progressTimerRef = useRef(null);

  useEffect(() => {
    async function load() {
      const data = await getSiteContent();
      setAbout(data?.about || null);
      setCapabilities((data?.capacity || []).slice(0, 3));
    }
    load();
  }, []);

  const videoItems = getAboutVideoItems(about);
  const safeActiveVideoIndex = videoItems.length > 0 ? Math.min(activeVideoIndex, videoItems.length - 1) : 0;
  const activeVideo = videoItems[safeActiveVideoIndex] || null;
  const activeVideoId = activeVideo?.id || "";
  const videoEmbedUrl = activeVideoId ? buildYouTubeEmbedUrl(activeVideoId) : null;
  const activeVideoTitle = (activeVideoId ? youtubeTitles[activeVideoId] : "") || activeVideo?.label || "Video giới thiệu Khiên Hà";
  const activeVideoThumbnailUrl = activeVideoId ? getYouTubeThumbnailUrl(activeVideoId) : null;
  const shouldShieldVideo = Boolean(videoEmbedUrl) && youtubeState !== "playing";

  function rememberYouTubeTitle(player, videoId) {
    const title = `${player?.getVideoData?.()?.title || ""}`.trim();
    if (!title || !videoId) return;

    setYoutubeTitles((current) => (current[videoId] === title ? current : { ...current, [videoId]: title }));
  }

  useEffect(() => {
    if (!videoEmbedUrl || !iframeRef.current) return;

    let cancelled = false;
    let player = null;
    clearInterval(progressTimerRef.current);
    progressTimerRef.current = null;

    ensureYouTubeApi().then((YT) => {
      if (cancelled || !YT?.Player || !iframeRef.current) return;

      player = new YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            rememberYouTubeTitle(player, activeVideoId);

            progressTimerRef.current = setInterval(() => {
              if (!playerRef.current?.getDuration || !playerRef.current?.getCurrentTime) return;

              rememberYouTubeTitle(playerRef.current, activeVideoId);

              const duration = Number(playerRef.current.getDuration()) || 0;
              const currentTime = Number(playerRef.current.getCurrentTime()) || 0;
              const playerState = playerRef.current.getPlayerState?.();

              if (duration > 0 && playerState === YT.PlayerState.PLAYING && duration - currentTime <= 2.2) {
                playerRef.current.pauseVideo?.();
                playerRef.current.seekTo?.(0, true);
                setYoutubeState("ended");
              }
            }, 350);
          },
          onStateChange: (event) => {
            rememberYouTubeTitle(playerRef.current, activeVideoId);

            if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING) {
              setYoutubeState("playing");
              return;
            }

            if (event.data === YT.PlayerState.PAUSED) {
              setYoutubeState("paused");
              return;
            }

            if (event.data === YT.PlayerState.ENDED) {
              playerRef.current?.seekTo?.(0, true);
              setYoutubeState("ended");
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
      if (playerRef.current === player) {
        playerRef.current = null;
      }
    };
  }, [videoEmbedUrl, activeVideoId]);

  function selectVideo(index) {
    clearInterval(progressTimerRef.current);
    progressTimerRef.current = null;
    playerRef.current = null;
    setActiveVideoIndex(index);
    setYoutubeState("idle");
  }

  function stepVideo(direction) {
    if (videoItems.length <= 1) return;
    selectVideo((safeActiveVideoIndex + direction + videoItems.length) % videoItems.length);
  }

  function handleResumeVideo(event) {
    event.stopPropagation();

    if (youtubeState === "ended") {
      playerRef.current?.seekTo?.(0, true);
    }

    playerRef.current?.playVideo?.();
    setYoutubeState("playing");
  }

  function handlePauseVideo(event) {
    event.stopPropagation();
    playerRef.current?.pauseVideo?.();
    setYoutubeState("paused");
  }

  return (
    <section id="about" className="section-padding overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)]">
      <div className="mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-8 2xl:px-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.82fr)_minmax(580px,1.18fr)] xl:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="py-2 xl:py-8"
          >
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-primary/8 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-4 w-4" />
              {about?.eyebrow || "Về chúng tôi"}
            </div>

            <h2 className="max-w-4xl text-3xl font-black leading-tight text-[#0f172a] md:text-5xl">
              {about?.title || "Nhà máy đóng tàu tư nhân hàng đầu khu vực phía Bắc"}
            </h2>

            <p className="mt-5 max-w-3xl text-lg font-bold leading-8 text-primary/78">
              {about?.highlight || "Hạ tầng lớn, kỹ thuật mạnh, kiểm soát chất lượng chặt."}
            </p>
            <p className="mt-5 max-w-4xl text-base leading-8 text-[#0f172a]/68">
              {about?.description ||
                "Khiên Hà đầu tư đồng bộ từ công nghệ cắt CNC, thiết bị nâng hạ trọng tải lớn, hệ thống bắn cát phun sơn đến đội ngũ kỹ sư và thợ lành nghề nhằm bảo đảm hiệu quả thi công cho từng dự án."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200/75 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#071b2f] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">
                  <BadgeCheck className="h-4 w-4" />
                  {about?.certificateLabel || "ISO 9001:2015"}
                </div>
                <p className="mt-4 text-sm leading-7 text-[#0f172a]/62">
                  {about?.certificateText || "Hệ thống quản lý chất lượng cho hoạt động đóng mới và sửa chữa tàu thủy."}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200/75 bg-[#eef6fb] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <div className="inline-flex rounded-2xl bg-white p-3 text-[#0b6aa2] shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="mt-4 text-4xl font-black text-[#0f172a]">22+</div>
                <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Năm kinh nghiệm</div>
                <p className="mt-3 text-sm leading-7 text-[#0f172a]/62">
                  Vận hành liên tục với thế mạnh đóng mới, sửa chữa và hoàn thiện phương tiện thủy.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-[2rem] bg-[#071b2f] p-3 shadow-[0_28px_90px_rgba(7,27,47,0.22)]"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2 pt-1 text-white">
              <div className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                Video giới thiệu
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/78">
                {videoItems.length > 1 ? `${safeActiveVideoIndex + 1}/${videoItems.length}` : "Khiên Hà"}
              </span>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-slate-950">
              {videoEmbedUrl ? (
                <>
                  <iframe
                    key={activeVideo.id}
                    ref={iframeRef}
                    src={videoEmbedUrl}
                    title={activeVideoTitle}
                    className="h-full w-full pointer-events-none"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-20 bg-transparent" />
                  <div aria-hidden="true" className="absolute bottom-0 right-0 z-10 h-20 w-56 bg-transparent" />
                  {shouldShieldVideo ? (
                    <div className="absolute inset-0 z-20 overflow-hidden bg-[#020817]">
                      {activeVideoThumbnailUrl ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-70"
                          style={{ backgroundImage: `url(${activeVideoThumbnailUrl})` }}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,0.16),rgba(2,8,23,0.84))]" />
                      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                        <button
                          type="button"
                          onClick={handleResumeVideo}
                          className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#071b2f] shadow-[0_18px_55px_rgba(0,0,0,0.34)] transition-transform hover:scale-[1.02]"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          {youtubeState === "ended" ? "Phát lại video" : youtubeState === "paused" ? "Tiếp tục xem" : "Phát video"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {youtubeState === "playing" ? (
                    <button
                      type="button"
                      onClick={handlePauseVideo}
                      className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#020817]/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors hover:bg-[#020817]/86"
                    >
                      <Pause className="h-3.5 w-3.5 fill-current" />
                      Tạm dừng
                    </button>
                  ) : null}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#071b2f,#0b6aa2)] px-6 text-center text-sm font-semibold leading-7 text-white/78">
                  Video giới thiệu sẽ hiển thị tại đây khi có link YouTube.
                </div>
              )}
            </div>

            {activeVideo ? (
              <div className="mt-3 flex flex-col gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">Tên video</div>
                  <h3 className="mt-1 overflow-hidden break-words text-sm font-black leading-6 text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-base">{activeVideoTitle}</h3>
                </div>
                {videoItems.length > 1 ? (
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/72">
                    {activeVideo.label}
                  </span>
                ) : null}
              </div>
            ) : null}

            {videoItems.length > 1 ? (
              <div className="mt-3 grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-2">
                <button
                  type="button"
                  aria-label="Video trước"
                  onClick={() => stepVideo(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition-colors hover:bg-white/15"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
                  {videoItems.map((item, index) => (
                    <button
                      key={`${item.id}-${index}`}
                      type="button"
                      onClick={() => selectVideo(index)}
                      title={youtubeTitles[item.id] || item.label}
                      className={`h-10 shrink-0 rounded-full border px-4 text-[10px] font-black uppercase tracking-[0.16em] transition-colors ${index === safeActiveVideoIndex
                          ? "border-cyan-200 bg-cyan-200 text-[#071b2f]"
                          : "border-white/10 bg-white/8 text-white/72 hover:bg-white/15 hover:text-white"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Video sau"
                  onClick={() => stepVideo(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white transition-colors hover:bg-white/15"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="h-full rounded-[1.5rem] border border-slate-200/75 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.category}</div>
              <h3 className="mt-3 max-w-xl text-xl font-black leading-7 text-[#0f172a]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#0f172a]/58">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
