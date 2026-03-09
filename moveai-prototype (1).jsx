import { useState, useEffect, useCallback, useMemo } from "react";

/* ═══════════════════════════ GLOBAL STYLES ════════════════════════════════ */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body { background:#4A2080; }

    .root {
      font-family:'DM Sans',sans-serif;
      background:linear-gradient(160deg,#4A2080 0%,#7B3FA8 45%,#9E68CC 100%);
      min-height:100vh; display:flex; align-items:center; justify-content:center;
    }
    .phone {
      width:390px; height:780px;
      background:rgba(255,255,255,0.11); backdrop-filter:blur(22px);
      border-radius:52px; border:1.5px solid rgba(255,255,255,0.38);
      box-shadow:0 40px 90px rgba(30,50,100,0.38),inset 0 1px 0 rgba(255,255,255,0.55);
      overflow:hidden; display:flex; flex-direction:column;
    }
    .sbar { padding:14px 28px 2px; display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:rgba(255,255,255,0.75); flex-shrink:0; }
    .screen { flex:1; display:flex; flex-direction:column; padding:10px 22px 18px; overflow:hidden; animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    .scrollable { overflow-y:auto; }
    .scrollable::-webkit-scrollbar { width:0; }

    /* Typography */
    .display { font-family:'DM Serif Display',serif; font-size:27px; line-height:1.18; color:#fff; }
    .display em { font-style:italic; color:#C9B6F2; }
    .label { font-size:10px; font-weight:700; letter-spacing:0.13em; text-transform:uppercase; color:rgba(255,255,255,0.5); margin-bottom:4px; }
    .body { font-size:13px; line-height:1.6; color:rgba(255,255,255,0.75); }

    /* Progress */
    .ptrack { height:3px; background:rgba(255,255,255,0.18); border-radius:10px; margin-bottom:16px; flex-shrink:0; }
    .pfill  { height:100%; background:linear-gradient(90deg,#9B60C8,#C9B6F2); border-radius:10px; transition:width 0.45s ease; }

    /* Buttons */
    .btn { width:100%; padding:15px; border-radius:22px; border:none; background:linear-gradient(135deg,#C9B6F2,#9B60C8); color:#1F2A44; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; box-shadow:0 8px 26px rgba(155,96,200,0.4); transition:transform 0.15s,box-shadow 0.15s; flex-shrink:0; }
    .btn:hover  { transform:translateY(-2px); box-shadow:0 13px 32px rgba(155,96,200,0.5); }
    .btn:active { transform:scale(0.97); }
    .btn:disabled { opacity:0.35; cursor:not-allowed; transform:none; box-shadow:none; }
    .btn-ghost { width:100%; padding:13px; border-radius:22px; border:1.5px solid rgba(255,255,255,0.3); background:transparent; color:rgba(255,255,255,0.75); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s; }
    .btn-ghost:hover { background:rgba(255,255,255,0.1); }
    .btn-sm { padding:7px 13px; border-radius:14px; border:none; background:linear-gradient(135deg,#C9B6F2,#9B60C8); color:#1F2A44; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700; cursor:pointer; }

    /* Input */
    .inp { width:100%; padding:13px 15px; background:rgba(255,255,255,0.14); border:1.5px solid rgba(255,255,255,0.28); border-radius:18px; color:#fff; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; outline:none; transition:border-color 0.2s,background 0.2s; }
    .inp::placeholder { color:rgba(255,255,255,0.38); font-weight:400; }
    .inp:focus { border-color:rgba(255,255,255,0.65); background:rgba(255,255,255,0.2); }

    /* Chips */
    .chip { padding:11px 14px; border-radius:16px; border:1.5px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.85); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; margin-bottom:7px; display:flex; align-items:center; gap:9px; }
    .chip.sel { background:rgba(255,255,255,0.9); color:#1F2A44; border-color:transparent; box-shadow:0 5px 18px rgba(0,0,0,0.13); transform:scale(1.015); }
    .chip:hover:not(.sel) { background:rgba(255,255,255,0.15); }

    /* Cards */
    .card { background:rgba(255,255,255,0.13); border:1px solid rgba(255,255,255,0.24); border-radius:22px; padding:14px 16px; margin-bottom:9px; }

    /* Pill */
    .pill { background:rgba(255,255,255,0.13); border:1px solid rgba(255,255,255,0.24); border-radius:18px; padding:8px 13px; font-size:12px; color:rgba(255,255,255,0.85); line-height:1.5; margin-top:8px; font-weight:500; }

    /* ══ MASCOT SVG SYSTEM ══ */
    @keyframes mascotFloat {
      0%,100% { transform:translateY(0px); }
      50%     { transform:translateY(-4px); }
    }
    @keyframes mascotGlow {
      0%,100% { opacity:0.55; transform:scale(1); }
      50%     { opacity:0.9;  transform:scale(1.14); }
    }
    @keyframes sparkleAnim {
      0%,100% { opacity:0.3; transform:scale(0.7) rotate(0deg); }
      50%     { opacity:1;   transform:scale(1.3) rotate(20deg); }
    }
    @keyframes energyBob {
      from { transform:translateY(0px) scale(1);    opacity:0.5; }
      to   { transform:translateY(-4px) scale(1.1); opacity:1; }
    }
    @keyframes ringOrbitAnim {
      0%,100% { transform:scaleX(1);   opacity:0.55; }
      50%      { transform:scaleX(0.78); opacity:0.85; }
    }
    @keyframes particleOrbit {
      from { transform:translateY(0px) scale(1);   opacity:0.7; }
      to   { transform:translateY(-9px) scale(1.3); opacity:1; }
    }
    /* Phone background transition */
    .phone { transition:background 1.8s ease !important; }

    /* XP */
    .xp-track { height:6px; background:rgba(255,255,255,0.18); border-radius:10px; }
    .xp-fill  { height:100%; background:linear-gradient(90deg,#9B60C8,#C9B6F2); border-radius:10px; transition:width 1s ease; }

    /* Badges */
    .badge { display:inline-flex; align-items:center; gap:4px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.26); border-radius:28px; padding:4px 10px; font-size:11px; font-weight:700; color:rgba(255,255,255,0.88); white-space:nowrap; }
    .badge.gold   { background:rgba(255,220,60,0.16);  border-color:rgba(255,220,60,0.35);  color:#FFD83C; }
    .badge.rose   { background:rgba(246,183,216,0.18); border-color:rgba(246,183,216,0.4);  color:#F6B7D8; }
    .badge.green  { background:rgba(111,207,151,0.16); border-color:rgba(111,207,151,0.38); color:#6FCF97; }
    .badge.red    { background:rgba(255,123,123,0.16); border-color:rgba(255,123,123,0.38); color:#FF7B7B; }
    .badge.blue   { background:rgba(169,214,245,0.16); border-color:rgba(169,214,245,0.38); color:#A9D6F5; }
    .badge.purple { background:rgba(201,182,242,0.18); border-color:rgba(201,182,242,0.4);  color:#C9B6F2; }
    .badge.muted  { background:rgba(255,255,255,0.09); border-color:rgba(255,255,255,0.18); color:rgba(255,255,255,0.5); }

    /* Streak dots */
    .sdot { width:27px; height:27px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; }
    .sdot.done  { background:linear-gradient(135deg,#C9B6F2,#9B60C8); color:#1F2A44; }
    .sdot.today { background:rgba(255,255,255,0.92); color:#4A2080; box-shadow:0 0 12px rgba(155,96,200,0.8); }
    .sdot.empty { background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.35); }
    .sdot.recovery { background:rgba(169,214,245,0.3); border:1px solid rgba(169,214,245,0.5); color:rgba(169,214,245,0.9); }

    /* Gauge */
    .g-track { height:5px; background:rgba(255,255,255,0.12); border-radius:10px; }
    .g-fill  { height:100%; border-radius:10px; transition:width 0.8s ease; }

    /* Slider */
    .sl-wrap { margin-bottom:7px; }
    input[type=range] { width:100%; height:3px; appearance:none; background:rgba(255,255,255,0.18); border-radius:10px; outline:none; }
    input[type=range]::-webkit-slider-thumb { appearance:none; width:14px; height:14px; border-radius:50%; background:linear-gradient(135deg,#C9B6F2,#9B60C8); cursor:pointer; box-shadow:0 2px 8px rgba(201,182,242,0.5); }

    /* State banner */
    .s-banner { border-radius:16px; padding:9px 13px; display:flex; align-items:center; gap:9px; margin-bottom:9px; border:1px solid rgba(255,255,255,0.18); }

    /* Arc / HSI */
    .hsi-num { font-family:'DM Serif Display',serif; font-size:34px; color:#fff; text-align:center; line-height:1; }

    /* Nav */
    .nav { display:flex; background:rgba(255,255,255,0.1); backdrop-filter:blur(12px); border-top:1px solid rgba(255,255,255,0.16); padding:8px 0 15px; flex-shrink:0; }
    .nitem { flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; padding:3px 0; font-size:9px; font-weight:700; color:rgba(255,255,255,0.38); transition:color 0.15s; text-transform:uppercase; letter-spacing:0.05em; }
    .nitem.on { color:rgba(255,255,255,0.95); }
    .nitem-icon { font-size:19px; }

    /* Compliance dot */
    .cdot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

    /* ══ STAGE 3: EMOTIONAL INTERACTION ENGINE ══ */

    /* Speech Bubble */
    .speech-bubble {
      position:relative; background:rgba(255,255,255,0.92);
      border-radius:18px; padding:9px 13px;
      max-width:175px; min-width:120px;
      box-shadow:0 4px 18px rgba(30,50,100,0.18);
      animation:bubblePop 0.38s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .speech-bubble::after {
      content:''; position:absolute; bottom:-8px; left:22px;
      border:8px solid transparent;
      border-top-color:rgba(255,255,255,0.92);
      border-bottom:0; filter:drop-shadow(0 2px 2px rgba(30,50,100,0.08));
    }
    @keyframes bubblePop {
      from { opacity:0; transform:scale(0.8) translateY(6px); }
      to   { opacity:1; transform:scale(1)   translateY(0); }
    }
    .speech-main { font-size:12px; font-weight:700; color:#1F2A44; line-height:1.45; }
    .speech-sub  { font-size:10px; font-weight:500; color:#6C7A96; margin-top:3px; line-height:1.4; }

    /* Micro-Celebration Overlay */
    .celebrate-overlay {
      position:absolute; inset:0; border-radius:52px;
      pointer-events:none; z-index:50; overflow:hidden;
      animation:celebFadeIn 0.15s ease both;
    }
    @keyframes celebFadeIn { from{opacity:0} to{opacity:1} }
    .celebrate-ring {
      position:absolute; top:50%; left:50%;
      width:180px; height:180px;
      border-radius:50%;
      border:3px solid rgba(246,183,216,0.7);
      transform:translate(-50%,-50%) scale(0.5);
      animation:ringExpand 0.55s cubic-bezier(0.2,0.8,0.4,1) both;
    }
    @keyframes ringExpand {
      from { transform:translate(-50%,-50%) scale(0.4); opacity:1; }
      to   { transform:translate(-50%,-50%) scale(1.6); opacity:0; }
    }
    .celebrate-ring2 { animation-delay:0.1s; border-color:rgba(201,182,242,0.5); }
    .celebrate-msg {
      position:absolute; top:42%; left:50%; transform:translate(-50%,-50%);
      background:rgba(255,255,255,0.95); border-radius:20px; padding:10px 18px;
      font-family:'DM Serif Display',serif; font-size:19px; color:#1F2A44;
      white-space:nowrap; box-shadow:0 6px 24px rgba(30,50,100,0.22);
      animation:celebMsg 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.05s both;
    }
    @keyframes celebMsg {
      from { opacity:0; transform:translate(-50%,-50%) scale(0.75); }
      to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
    }
    .confetti-dot {
      position:absolute; border-radius:50%;
      animation:confettiDrop linear both;
    }
    @keyframes confettiDrop {
      0%   { opacity:1; transform:translateY(0) rotate(0deg) scale(1); }
      100% { opacity:0; transform:translateY(160px) rotate(540deg) scale(0.4); }
    }

    /* Today Intent Prompt */
    .intent-screen {
      flex:1; display:flex; flex-direction:column;
      padding:20px 22px 24px; justify-content:center; gap:14px;
      animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
    }
    .intent-chip {
      display:flex; align-items:center; gap:12px;
      padding:14px 16px; border-radius:20px;
      border:1.5px solid rgba(255,255,255,0.22);
      background:rgba(255,255,255,0.1);
      cursor:pointer; transition:all 0.18s; color:#fff;
      font-weight:600; font-size:14px;
    }
    .intent-chip.sel {
      background:rgba(255,255,255,0.92); color:#1F2A44;
      border-color:transparent; box-shadow:0 5px 20px rgba(0,0,0,0.14);
      transform:scale(1.02);
    }
    .intent-chip:hover:not(.sel) { background:rgba(255,255,255,0.18); }

    /* Journey tab */
    .journey-milestone {
      display:flex; gap:14px; align-items:flex-start;
      padding:12px 14px; border-radius:20px;
      margin-bottom:8px; position:relative;
      border:1px solid rgba(255,255,255,0.18);
    }
    .journey-milestone.active { background:rgba(255,255,255,0.15); border-color:rgba(246,183,216,0.45); }
    .journey-milestone.done   { background:rgba(255,255,255,0.08); }
    .journey-milestone.future { opacity:0.38; }
    .journey-line {
      position:absolute; left:28px; top:54px;
      width:2px; height:calc(100% + 8px);
      background:rgba(255,255,255,0.15);
    }
    .journey-dot {
      width:32px; height:32px; border-radius:50%; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:14px; font-weight:700;
    }
    .journey-dot.done   { background:linear-gradient(135deg,#C9B6F2,#9B60C8); }
    .journey-dot.active { background:rgba(255,255,255,0.92); box-shadow:0 0 12px rgba(246,183,216,0.8); }
    .journey-dot.future { background:rgba(255,255,255,0.12); }

    /* Anti-churn banner */
    .churn-banner {
      border-radius:20px; padding:14px 16px;
      background:rgba(255,255,255,0.13);
      border:1.5px solid rgba(169,214,245,0.45);
      margin-bottom:10px;
    }

    /* Escalation level pip */
    .esc-pips { display:flex; gap:5px; margin-bottom:10px; }
    .esc-pip  { flex:1; height:3px; border-radius:10px; background:rgba(255,255,255,0.18); }
    .esc-pip.active { background:linear-gradient(90deg,#F6B7D8,#C9B6F2); }

    /* ══ PREDICTIVE BURNOUT ══ */

    /* Risk level pill */
    .risk-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:28px; font-size:11px; font-weight:800; letter-spacing:0.04em; white-space:nowrap; }
    .risk-safe     { background:rgba(111,207,151,0.18); border:1px solid rgba(111,207,151,0.4); color:#6FCF97; }
    .risk-watch    { background:rgba(255,216,60,0.16);  border:1px solid rgba(255,216,60,0.4);  color:#FFD83C; }
    .risk-elevated { background:rgba(255,173,71,0.18);  border:1px solid rgba(255,173,71,0.4);  color:#FFB347; }
    .risk-critical { background:rgba(255,123,123,0.2);  border:1px solid rgba(255,123,123,0.45);color:#FF7B7B; }
    .risk-burnout  { background:rgba(190,60,60,0.22);   border:1px solid rgba(190,60,60,0.5);   color:#FF5252; }

    /* Forecast strip (3-day) */
    .forecast-strip { display:flex; gap:7px; margin-bottom:9px; }
    .forecast-day {
      flex:1; border-radius:16px; padding:9px 7px;
      border:1px solid rgba(255,255,255,0.15);
      background:rgba(255,255,255,0.08);
      display:flex; flex-direction:column; align-items:center; gap:4px;
    }
    .forecast-day.today { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.28); }
    .forecast-day.high-risk { border-color:rgba(255,123,123,0.4); background:rgba(255,123,123,0.08); }

    /* Trajectory bars */
    .traj-bar-wrap { display:flex; align-items:flex-end; gap:3px; height:44px; }
    .traj-bar {
      flex:1; border-radius:4px 4px 0 0; min-width:8px;
      transition:height 0.5s ease;
    }

    /* Risk factor row */
    .rfactor { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.07); }
    .rfactor:last-child { border-bottom:none; }
    .rfactor-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
    .rfactor-bar-track { flex:1; height:4px; background:rgba(255,255,255,0.1); border-radius:4px; }
    .rfactor-bar-fill  { height:100%; border-radius:4px; transition:width 0.6s ease; }

    /* Resilience ring (small arc) */
    .resilience-arc { position:relative; width:86px; height:48px; }

    /* Intervention card */
    .intervention-card {
      border-radius:18px; padding:13px 14px; margin-bottom:9px;
      border:1.5px solid transparent; position:relative; overflow:hidden;
    }
    .intervention-card::before {
      content:''; position:absolute; inset:0; border-radius:17px;
      background:linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02));
    }
    .intervention-card.safe     { border-color:rgba(111,207,151,0.35); background:rgba(111,207,151,0.08); }
    .intervention-card.watch    { border-color:rgba(255,216,60,0.35);  background:rgba(255,216,60,0.07);  }
    .intervention-card.elevated { border-color:rgba(255,173,71,0.4);   background:rgba(255,173,71,0.08);  }
    .intervention-card.critical { border-color:rgba(255,123,123,0.45); background:rgba(255,123,123,0.1);  }
    .intervention-card.burnout  { border-color:rgba(190,60,60,0.5);    background:rgba(190,60,60,0.1);    }

    /* Burnout forecast strip on Dashboard */
    .burnout-strip {
      border-radius:16px; padding:10px 13px;
      background:rgba(255,255,255,0.09);
      border:1px solid rgba(255,255,255,0.16);
      margin-bottom:9px;
      display:flex; align-items:center; gap:10px;
    }
    .burnout-strip.warn { border-color:rgba(255,173,71,0.45); background:rgba(255,173,71,0.08); }
    .burnout-strip.crit { border-color:rgba(255,123,123,0.45); background:rgba(255,123,123,0.1); }
  
    /* Flow zone gauge */
    /* ══ AUTH SYSTEM ══ */

    /* Provider buttons */
    .auth-provider-btn {
      width:100%; padding:13px 16px; border-radius:16px; cursor:pointer;
      display:flex; align-items:center; gap:12px;
      font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700;
      border:1.5px solid rgba(255,255,255,0.22); transition:all 0.15s;
      background:rgba(255,255,255,0.1); color:#fff;
    }
    .auth-provider-btn:hover { background:rgba(255,255,255,0.18); border-color:rgba(255,255,255,0.38); }
    .auth-provider-btn.google { background:rgba(255,255,255,0.95); color:#333; border-color:transparent; }
    .auth-provider-btn.google:hover { background:#fff; }
    .auth-provider-btn.apple  { background:rgba(0,0,0,0.55); color:#fff; border-color:rgba(255,255,255,0.18); }
    .auth-provider-btn.apple:hover  { background:rgba(0,0,0,0.75); }

    /* Sign-in secondary link */
    .signin-link {
      background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif;
      font-size:12px; font-weight:700; color:rgba(255,255,255,0.5); padding:6px 12px;
      border-radius:20px; border:1px solid rgba(255,255,255,0.18); transition:all 0.15s;
    }
    .signin-link:hover { color:rgba(255,255,255,0.85); border-color:rgba(255,255,255,0.35); }

    /* Restoring progress screen */
    .restore-screen {
      position:absolute; inset:0; z-index:50;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      background:linear-gradient(160deg,#2A3E78 0%,#3E5BAA 50%,#5478CC 100%);
      border-radius:inherit;
    }
    .restore-spinner {
      width:52px; height:52px; border-radius:50%;
      border:3px solid rgba(255,255,255,0.15);
      border-top-color:rgba(201,182,242,0.9);
      animation:spin 0.9s linear infinite; margin-bottom:20px;
    }
    @keyframes spin { to { transform:rotate(360deg); } }
    .restore-bar-track { width:180px; height:4px; border-radius:4px; background:rgba(255,255,255,0.12); margin-top:16px; }
    .restore-bar-fill  { height:100%; border-radius:4px; background:linear-gradient(90deg,#9B60C8,#C9B6F2); transition:width 0.4s ease; }

    /* Welcome-back overlay */
    .welcome-back-overlay {
      position:absolute; inset:0; z-index:40;
      background:linear-gradient(160deg,#2A3E78 0%,#3E5BAA 50%,#5478CC 100%);
      border-radius:inherit;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:24px;
      animation:fadeIn 0.4s ease both;
    }

    /* Auth toast */
    .auth-toast {
      position:absolute; bottom:80px; left:50%; transform:translateX(-50%);
      background:rgba(20,30,60,0.95); border:1px solid rgba(111,207,151,0.45);
      border-radius:20px; padding:9px 16px; z-index:60;
      display:flex; align-items:center; gap:8px; white-space:nowrap;
      animation:toastSlide 0.35s cubic-bezier(0.22,1,0.36,1) both;
      backdrop-filter:blur(10px);
    }
    @keyframes toastSlide { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

    /* Email input in auth */
    .auth-email-input {
      width:100%; padding:12px 14px; border-radius:14px;
      background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.22);
      color:#fff; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
      outline:none; box-sizing:border-box;
    }
    .auth-email-input:focus { border-color:rgba(201,182,242,0.6); background:rgba(255,255,255,0.15); }
    .auth-email-input::placeholder { color:rgba(255,255,255,0.35); }
  

    /* Weight table */
    .weight-row { display:flex; align-items:center; gap:8px; padding:7px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
    .weight-row:last-child { border-bottom:none; }
    .weight-bar-track { flex:1; height:5px; border-radius:4px; background:rgba(255,255,255,0.1); }
    .weight-bar-fill  { height:100%; border-radius:4px; transition:width 0.6s ease; }
    .weight-badge {
      padding:2px 8px; border-radius:10px; font-size:9px; font-weight:800;
      background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.7); white-space:nowrap;
    }
    .weight-badge.boosted { background:rgba(111,207,151,0.2); color:#6FCF97; }
    .weight-badge.reduced { background:rgba(255,123,123,0.2); color:#FF7B7B; }

    /* Micro-decision log */
    .mdecision-row {
      display:flex; align-items:flex-start; gap:9px;
      padding:8px 10px; border-radius:14px; margin-bottom:6px;
      background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12);
    }
    .mdecision-icon { width:28px; height:28px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
    .mdecision-output { font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px; }
    .mdecision-output.yes  { background:rgba(111,207,151,0.2); color:#6FCF97; }
    .mdecision-output.no   { background:rgba(255,123,123,0.18); color:#FF7B7B; }
    .mdecision-output.reduced { background:rgba(255,173,71,0.2); color:#FFB347; }
    .mdecision-output.full    { background:rgba(201,182,242,0.2); color:#C9B6F2; }
    .mdecision-output.hold    { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.55); }
    .confidence-bar { height:3px; border-radius:3px; background:rgba(255,255,255,0.1); margin-top:4px; }
    .confidence-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,#9B60C8,#C9B6F2); }

    /* A/B experiment */
    .ab-card { border-radius:18px; padding:12px 14px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.07); }
    .ab-variants { display:flex; gap:7px; margin-top:9px; }
    .ab-variant { flex:1; border-radius:14px; padding:10px 8px; text-align:center; border:1.5px solid transparent; }
    .ab-variant.leader { border-color:rgba(111,207,151,0.5); background:rgba(111,207,151,0.1); }
    .ab-variant.trailing { border-color:rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); }
    .ab-winner-badge { font-size:8px; font-weight:800; color:#6FCF97; background:rgba(111,207,151,0.15); border-radius:8px; padding:2px 6px; display:inline-block; margin-top:3px; }

    /* Eval metric */
    .eval-metric { display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.07); }
    .eval-metric:last-child { border-bottom:none; }
    .eval-delta { font-size:13px; font-weight:800; }
    .eval-delta.pos { color:#6FCF97; }
    .eval-delta.neg { color:#FF7B7B; }
    .eval-delta.neu { color:rgba(255,255,255,0.5); }
  

    /* Daily Forecast card */
    .forecast-card {
      border-radius:20px; padding:13px 15px;
      background:linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.07));
      border:1.5px solid rgba(255,255,255,0.22);
      margin-bottom:9px; position:relative; overflow:hidden;
    }
    .forecast-card::before {
      content:''; position:absolute; top:-20px; right:-20px;
      width:80px; height:80px; border-radius:50%;
      background:radial-gradient(circle,rgba(201,182,242,0.25),transparent 70%);
    }
    .forecast-energy-bar { display:flex; gap:3px; margin:7px 0; }
    .forecast-energy-seg { flex:1; height:5px; border-radius:3px; background:rgba(255,255,255,0.12); }
    .forecast-energy-seg.filled { background:linear-gradient(90deg,#9B60C8,#C9B6F2); }

    /* Disengagement alert */
    .disengage-alert { border-radius:18px; padding:11px 14px; margin-bottom:9px; display:flex; align-items:center; gap:10px; }
    .disengage-alert.low  { background:rgba(111,207,151,0.1);  border:1px solid rgba(111,207,151,0.3); }
    .disengage-alert.med  { background:rgba(255,216,60,0.1);   border:1px solid rgba(255,216,60,0.35); }
    .disengage-alert.high { background:rgba(255,123,123,0.12); border:1px solid rgba(255,123,123,0.4); }

    /* Notification heatmap */
    .notif-heatmap { display:flex; flex-direction:column; gap:5px; }
    .notif-slot { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:12px; border:1px solid transparent; }
    .notif-slot.best  { background:rgba(111,207,151,0.15); border-color:rgba(111,207,151,0.35); }
    .notif-slot.good  { background:rgba(255,216,60,0.1);   border-color:rgba(255,216,60,0.25);  }
    .notif-slot.poor  { background:rgba(255,255,255,0.05); border-color:transparent; }
    .notif-slot.skip  { background:rgba(255,123,123,0.08); border-color:rgba(255,123,123,0.2);  opacity:0.7; }
    .notif-bar-track { flex:1; height:6px; border-radius:4px; background:rgba(255,255,255,0.1); }
    .notif-bar-fill  { height:100%; border-radius:4px; transition:width 0.6s ease; }

    /* AI Insight card */
    .ai-insight-card {
      border-radius:20px; padding:14px 16px; margin-bottom:9px;
      background:linear-gradient(135deg,rgba(107,63,160,0.22),rgba(155,96,200,0.12));
      border:1.5px solid rgba(201,182,242,0.35); position:relative; overflow:hidden;
    }
    .ai-thinking { display:flex; gap:4px; align-items:center; margin-bottom:8px; }
    .ai-dot { width:6px; height:6px; border-radius:50%; background:#C9B6F2; animation:aiPulse 1.2s ease-in-out infinite; }
    .ai-dot:nth-child(2) { animation-delay:0.2s; }
    .ai-dot:nth-child(3) { animation-delay:0.4s; }
    @keyframes aiPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }

    /* Event log */
    .event-row { display:flex; gap:8px; align-items:flex-start; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:10px; }
    .event-row:last-child { border-bottom:none; }
    .event-dot { width:6px; height:6px; border-radius:50%; margin-top:4px; flex-shrink:0; }

    /* Feature vector chip */
    .fv-chip { display:inline-flex; flex-direction:column; align-items:center; padding:8px 10px; border-radius:14px; min-width:52px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.18); }

    /* ══ GOAL ENGINE ══ */
    .flow-bar { position:relative; height:18px; border-radius:10px; background:rgba(255,255,255,0.1); overflow:visible; }
    .flow-zone { position:absolute; height:100%; border-radius:10px; background:rgba(111,207,151,0.28); border:1px solid rgba(111,207,151,0.45); }
    .flow-cursor { position:absolute; top:-4px; width:3px; height:26px; border-radius:3px; background:#fff; box-shadow:0 0 8px rgba(255,255,255,0.7); transition:left 0.8s ease; }
    .flow-label { position:absolute; top:22px; font-size:9px; font-weight:700; color:rgba(255,255,255,0.55); white-space:nowrap; }

    /* Delta arrow */
    .delta-pill {
      display:inline-flex; align-items:center; gap:4px;
      padding:4px 10px; border-radius:14px; font-size:11px; font-weight:700;
    }
    .delta-pill.up   { background:rgba(111,207,151,0.2); border:1px solid rgba(111,207,151,0.4); color:#6FCF97; }
    .delta-pill.down { background:rgba(255,123,123,0.2); border:1px solid rgba(255,123,123,0.4); color:#FF7B7B; }
    .delta-pill.hold { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:rgba(255,255,255,0.6); }

    /* Micro-challenge card */
    .micro-challenge {
      border-radius:20px; padding:13px 15px;
      background:linear-gradient(135deg,rgba(155,96,200,0.14),rgba(201,182,242,0.1));
      border:1.5px solid rgba(155,96,200,0.35);
      margin-bottom:9px;
      animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
    }

    /* Weekly calibration row */
    .cal-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.08); }
    .cal-row:last-child { border-bottom:none; }

    /* Sparkline */
    .sparkline { display:flex; align-items:flex-end; gap:2px; height:28px; }
    .spark-bar { border-radius:3px 3px 0 0; background:rgba(255,255,255,0.25); min-width:6px; transition:height 0.5s ease; }
    .spark-bar.today { background:linear-gradient(180deg,#C9B6F2,#9B60C8); }
    .spark-bar.over  { background:rgba(255,216,60,0.6); }
  
  
    .splash {
      position:absolute; inset:0; z-index:100;
      border-radius:52px; overflow:hidden;
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      background:linear-gradient(160deg,#4A2080 0%,#7B3FA8 50%,#9B60C8 100%);
      animation:splashBgIn 0.35s ease both;
      pointer-events:all;
    }
    .splash.exiting { animation:splashFadeOut 0.55s cubic-bezier(0.4,0,0.2,1) both; }
    @keyframes splashBgIn    { from{opacity:0} to{opacity:1} }
    @keyframes splashFadeOut { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(1.03)} }

    /* Particles */
    .splash-particles { position:absolute; inset:0; overflow:hidden; border-radius:52px; pointer-events:none; }
    .particle {
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,0.55);
      animation:particleFloat linear infinite;
    }
    @keyframes particleFloat {
      0%   { transform:translateY(0) scale(1);   opacity:0; }
      15%  { opacity:1; }
      85%  { opacity:0.7; }
      100% { transform:translateY(-420px) scale(0.4); opacity:0; }
    }

    /* Glow orb behind mascot */
    .splash-glow {
      width:200px; height:200px; border-radius:50%;
      background:radial-gradient(circle,rgba(255,255,255,0.55) 0%,rgba(255,182,193,0.2) 60%,transparent 100%);
      position:absolute;
      animation:glowPulse 2.4s ease-in-out infinite;
    }
    @keyframes glowPulse {
      0%,100% { transform:scale(1);   opacity:0.7; }
      50%      { transform:scale(1.18); opacity:1; }
    }

    /* Mascot bounce-in */
    .splash-mascot {
      position:relative; z-index:2;
      animation:mascotBounce 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
    }
    @keyframes mascotBounce {
      from { transform:scale(0.88); opacity:0; }
      to   { transform:scale(1);    opacity:1; }
    }

    /* Mascot blink overlay */
    .mascot-blink {
      position:absolute; inset:0; border-radius:50%;
      background:rgba(255,255,255,0);
      animation:blinkOnce 0.12s ease 1.1s 2 alternate;
      pointer-events:none;
    }
    @keyframes blinkOnce {
      from { background:rgba(255,255,255,0); }
      to   { background:rgba(255,255,255,0.18); }
    }

    /* Text fade-in */
    .splash-appname {
      font-family:'DM Sans',sans-serif; font-size:30px; font-weight:800;
      letter-spacing:0.12em; color:#fff;
      text-shadow:0 2px 20px rgba(180,100,140,0.35);
      animation:textFadeUp 0.5s ease 0.7s both;
      margin-top:22px;
    }
    .splash-tagline {
      font-family:'DM Serif Display',serif; font-size:14px; font-style:italic;
      color:rgba(255,255,255,0.8); letter-spacing:0.02em;
      animation:textFadeUp 0.5s ease 0.9s both;
      margin-top:6px;
    }
    .splash-message {
      font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
      color:rgba(255,255,255,0.72); margin-top:10px;
      animation:textFadeUp 0.5s ease 1.15s both;
    }
    @keyframes textFadeUp {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }

    /* Energy loading bar */
    .splash-loader-wrap {
      position:absolute; bottom:60px;
      width:140px;
      animation:textFadeUp 0.4s ease 1.3s both;
    }
    .splash-loader-label {
      font-size:10px; font-weight:600; color:rgba(255,255,255,0.6);
      text-align:center; margin-bottom:6px; letter-spacing:0.06em; text-transform:uppercase;
    }
    .splash-loader-track {
      height:3px; background:rgba(255,255,255,0.25); border-radius:10px;
    }
    .splash-loader-fill {
      height:100%; border-radius:10px;
      background:linear-gradient(90deg,rgba(201,182,242,0.8),rgba(255,255,255,0.95));
      animation:loaderFill 1.6s cubic-bezier(0.4,0,0.2,1) 1.4s both;
    }
    @keyframes loaderFill { from{width:0%} to{width:100%} }
  

    /* Weekly bars */
    .wbar { border-radius:6px 6px 0 0; background:rgba(255,255,255,0.2); }
    .wbar.best { background:linear-gradient(180deg,#C9B6F2,#9B60C8); }
    .wbar.recovery { background:linear-gradient(180deg,#A9D6F5,rgba(169,214,245,0.4)); }

    /* Memory card */
    .memory-card { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.18); border-left:3px solid #C9B6F2; border-radius:0 18px 18px 0; padding:11px 13px; margin-bottom:8px; }

    /* Arc phases */
    .arc-phase { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:14px; margin-bottom:6px; border:1px solid rgba(255,255,255,0.15); }
    .arc-phase.active { background:rgba(255,255,255,0.14); border-color:rgba(246,183,216,0.4); }
    .arc-phase.done   { background:rgba(255,255,255,0.07); }
    .arc-phase.future { opacity:0.45; }

    /* ══ STANDLY ONBOARDING v2 ══ */
    .sly-benefit { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:14px; padding:10px 14px; margin-bottom:7px; }
    .sly-auth-btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:14px; border-radius:20px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; border:none; transition:opacity 0.15s; margin-bottom:8px; }
    .sly-auth-btn:hover { opacity:0.88; }
    .ai-process-row { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:14px; border:1px solid rgba(255,255,255,0.1); transition:all 0.45s ease; margin-bottom:7px; }
    .ai-process-row.done    { background:rgba(111,207,151,0.12); border-color:rgba(111,207,151,0.35); }
    .ai-process-row.active  { background:rgba(201,182,242,0.14); border-color:rgba(201,182,242,0.4); }
    .ai-process-row.pending { background:rgba(255,255,255,0.05); }
    .gamif-row { display:flex; gap:12px; align-items:flex-start; border-left:3px solid; border-radius:0 16px 16px 0; padding:12px 14px; margin-bottom:8px; }
    .chip-check { position:absolute; right:12px; width:18px; height:18px; border-radius:50%; background:#1F2A44; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; color:#F6B7D8; flex-shrink:0; }
    .signin-link { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); border-radius:20px; padding:8px 16px; font-size:12px; font-weight:700; color:rgba(255,255,255,0.75); cursor:pointer; }

  `}</style>
);

/* ══════════════════════════ CHARACTERS ════════════════════════════════════ */
/* ══════════════════════════ CHARACTER DATA ════════════════════════════════ */
const CHARS = {
  mellow: { name:"Mellow", tagline:"Your calm companion",     desc:"Steady, gentle, reliable.",          col:{ b:"#A0C4FF", hi:"#C9DEFF", sh:"#7EB3F7", gl:"#DCF0FF", pt:"#7EB3F7" } },
  spark:  { name:"Spark",  tagline:"Your energy igniter",     desc:"Bold and warm. Every win counts.",   col:{ b:"#FFADAD", hi:"#FFD0D0", sh:"#F59090", gl:"#FFE4E4", pt:"#FF8C8C" } },
  sprout: { name:"Sprout", tagline:"Your gentle cheerleader", desc:"Kind and patient. Never judges.",    col:{ b:"#B5EAD7", hi:"#D2F5E8", sh:"#8FD4BC", gl:"#DFFAF0", pt:"#6FCF97" } },
  blaze:  { name:"Blaze",  tagline:"Your competitive edge",   desc:"Fierce and focused. Always scores.", col:{ b:"#FFD6A5", hi:"#FFE9C2", sh:"#F0BC82", gl:"#FFF2DC", pt:"#FFB347" } },
};

function assignChar(mot, per) {
  if (mot==="competitive") return "blaze";
  if (mot==="gentle" || per==="encouragement") return "sprout";
  if (per==="energetic" || mot==="achievement") return "spark";
  return "mellow";
}

/* ══════════════════════════ SVG MASCOT SYSTEM ══════════════════════════════ */

/* ── Eyes (8 states) ── */
function Eyes({ mood, g }) {
  const sh = "rgba(255,255,255,0.65)";
  if (mood==="happy"||mood==="proud") return (<>
    {/* Happy: top-half circles = curved ^^ eyes */}
    <circle cx="37" cy="47" r="7.2" fill="#2B2B3A" clipPath={`url(#${g}-eL)`}/>
    <circle cx="63" cy="47" r="7.2" fill="#2B2B3A" clipPath={`url(#${g}-eR)`}/>
    <ellipse cx="40"   cy="42"   rx="2.4" ry="2"   fill={sh}/>
    <ellipse cx="66"   cy="42"   rx="2.4" ry="2"   fill={sh}/>
  </>);
  if (mood==="tired") return (<>
    {/* Tired: squished + rotated inward = heavy-lidded */}
    <ellipse cx="37" cy="48" rx="5.8" ry="3.6" fill="#2B2B3A" transform="rotate(10,37,48)"/>
    <ellipse cx="63" cy="48" rx="5.8" ry="3.6" fill="#2B2B3A" transform="rotate(-10,63,48)"/>
    <ellipse cx="38.5" cy="46"   rx="1.8" ry="1.3" fill="rgba(255,255,255,0.38)"/>
    <ellipse cx="64.5" cy="46"   rx="1.8" ry="1.3" fill="rgba(255,255,255,0.38)"/>
  </>);
  if (mood==="concern"||mood==="sad") return (<>
    {/* Concern: inner corners tilted down, caring not guilty */}
    <ellipse cx="37" cy="47" rx="5.8" ry="5.6" fill="#2B2B3A" transform="rotate(14,37,47)"/>
    <ellipse cx="63" cy="47" rx="5.8" ry="5.6" fill="#2B2B3A" transform="rotate(-14,63,47)"/>
    <ellipse cx="38.5" cy="44"   rx="2"   ry="1.6" fill={sh}/>
    <ellipse cx="64.5" cy="44"   rx="2"   ry="1.6" fill={sh}/>
  </>);
  if (mood==="glowing") return (<>
    {/* Glowing: wide eyes, double-highlight shine */}
    <ellipse cx="37" cy="46" rx="6.8" ry="7.2" fill="#2B2B3A"/>
    <ellipse cx="63" cy="46" rx="6.8" ry="7.2" fill="#2B2B3A"/>
    <ellipse cx="40.5" cy="42"   rx="3"   ry="2.5" fill="rgba(255,255,255,0.82)"/>
    <ellipse cx="66.5" cy="42"   rx="3"   ry="2.5" fill="rgba(255,255,255,0.82)"/>
    <circle  cx="35.5" cy="49"   r="1.2"           fill="rgba(255,255,255,0.45)"/>
    <circle  cx="61.5" cy="49"   r="1.2"           fill="rgba(255,255,255,0.45)"/>
  </>);
  if (mood==="energized") return (<>
    {/* Energized: wider, excited, taller ovals */}
    <ellipse cx="37" cy="46" rx="6.5" ry="7"   fill="#2B2B3A"/>
    <ellipse cx="63" cy="46" rx="6.5" ry="7"   fill="#2B2B3A"/>
    <ellipse cx="40"   cy="42.5" rx="2.6" ry="2.2" fill={sh}/>
    <ellipse cx="66"   cy="42.5" rx="2.6" ry="2.2" fill={sh}/>
  </>);
  if (mood==="encouraging") return (<>
    {/* Encouraging: soft happy, not full ^^ */}
    <ellipse cx="37" cy="47" rx="6.2" ry="6"   fill="#2B2B3A"/>
    <ellipse cx="63" cy="47" rx="6.2" ry="6"   fill="#2B2B3A"/>
    <ellipse cx="40"   cy="43.5" rx="2.3" ry="2"   fill={sh}/>
    <ellipse cx="66"   cy="43.5" rx="2.3" ry="2"   fill={sh}/>
  </>);
  /* neutral / waiting / default */
  return (<>
    <ellipse cx="37" cy="47" rx="6"   ry="5.6" fill="#2B2B3A"/>
    <ellipse cx="63" cy="47" rx="6"   ry="5.6" fill="#2B2B3A"/>
    <ellipse cx="39.5" cy="44"   rx="2.1" ry="1.8" fill={sh}/>
    <ellipse cx="65.5" cy="44"   rx="2.1" ry="1.8" fill={sh}/>
  </>);
}

/* ── Mouths (8 states) ── */
function Mouth({ mood }) {
  if (mood==="happy"||mood==="glowing"||mood==="proud"||mood==="encouraging")
    return <path d="M 43,65 Q 50,73 57,65" stroke="#2B2B3A" strokeWidth="2.3" fill="none" strokeLinecap="round"/>;
  if (mood==="energized") return (<>
    <path d="M 42,64 Q 50,75 58,64" stroke="#2B2B3A" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
    <path d="M 45,67 Q 50,73 55,67 Z" fill="rgba(43,43,58,0.14)"/>
  </>);
  if (mood==="concern"||mood==="sad")
    return <path d="M 43,70 Q 50,63 57,70" stroke="#2B2B3A" strokeWidth="2.2" fill="none" strokeLinecap="round"/>;
  /* tired / neutral / waiting */
  return <path d="M 44,67 Q 50,68.5 56,67" stroke="#2B2B3A" strokeWidth="2" fill="none" strokeLinecap="round"/>;
}

/* ── Stage-4 accessories per character ── */
function Accessory({ charKey, col }) {
  if (charKey==="mellow") return (
    <ellipse cx="50" cy="90" rx="22" ry="5"
      fill="none" stroke={col.gl} strokeWidth="2.4" opacity="0.7"
      style={{ animation:"ringOrbitAnim 5s ease-in-out infinite", transformOrigin:"50px 90px" }}/>
  );
  if (charKey==="spark") return (<>
    <path d="M 12,43 L 6,40 L 13,37"  stroke={col.pt} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85" style={{ animation:"energyBob 1.5s ease-in-out infinite alternate" }}/>
    <path d="M 88,53 L 95,50 L 88,47" stroke={col.pt} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.75" style={{ animation:"energyBob 1.5s ease-in-out infinite alternate", animationDelay:"0.75s" }}/>
  </>);
  if (charKey==="sprout") return (
    <path d="M 50,9 C 60,4 68,12 58,19 C 63,9 53,7 50,9 Z"
      fill={col.sh} opacity="0.85"
      style={{ animation:"particleOrbit 2.6s ease-in-out infinite alternate" }}/>
  );
  if (charKey==="blaze") return (
    <path d="M 37,13 L 41,6 L 50,11 L 59,6 L 63,13 L 55,11 L 50,9 L 45,11 Z"
      fill={col.b} stroke={col.sh} strokeWidth="0.9" opacity="0.92"/>
  );
  return null;
}

/* ── Main Mascot component ── */
function Mascot({ charKey="mellow", mood="neutral", size=86, evolution=0 }) {
  const c   = CHARS[charKey] ?? CHARS.mellow;
  const col = c.col;
  const g   = `mg${charKey}`;   // unique gradient/clip prefix per character
  const desat = (mood==="tired"||mood==="concern") ? "saturate(0.6) brightness(0.96)" : undefined;
  const bScale = (mood==="tired"||mood==="concern") ? 0.97 : (mood==="glowing"||mood==="energized") ? 1.02 : 1.0;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{ overflow:"visible", animation:"mascotFloat 3.4s ease-in-out infinite", filter:desat, flexShrink:0, display:"block" }}>
      <defs>
        {/* Body gradient */}
        <radialGradient id={`${g}-bd`} cx="38%" cy="30%" r="66%">
          <stop offset="0%"   stopColor={col.hi}/>
          <stop offset="100%" stopColor={col.sh}/>
        </radialGradient>
        {/* Stage-2 halo gradient */}
        <radialGradient id={`${g}-hl`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={col.gl} stopOpacity="0.7"/>
          <stop offset="100%" stopColor={col.gl} stopOpacity="0"/>
        </radialGradient>
        {/* Happy-eye clips — clip bottom half of circle to get ^^ shape */}
        <clipPath id={`${g}-eL`}><rect x="25" y="35" width="24" height="12"/></clipPath>
        <clipPath id={`${g}-eR`}><rect x="51" y="35" width="24" height="12"/></clipPath>
      </defs>

      {/* ── Stage 2+: Halo glow ── */}
      {evolution >= 2 && (
        <ellipse cx="50" cy="54" rx="54" ry="52"
          fill={`url(#${g}-hl)`}
          style={{ animation:"mascotGlow 2.5s ease-in-out infinite" }}/>
      )}

      {/* ── Stage 3+: Floating orbit particles ── */}
      {evolution >= 3 && [
        {cx:17, cy:29, r:2.8, d:0   },
        {cx:83, cy:25, r:2.2, d:0.9 },
        {cx:86, cy:70, r:2.6, d:1.8 },
        {cx:13, cy:68, r:1.9, d:2.7 },
      ].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={col.pt} opacity="0.7"
          style={{ animation:"particleOrbit 3s ease-in-out infinite alternate", animationDelay:`${p.d}s` }}/>
      ))}

      {/* ── Body ── */}
      <g transform={`translate(50,52) scale(${bScale}) translate(-50,-52)`}>
        {/* Organic asymmetric blob */}
        <path
          d="M 50,16 C 68,14 86,28 86,47 C 86,66 74,83 56,86 C 38,89 18,77 14,59 C 10,41 20,23 36,17 C 41,15 46,16 50,16 Z"
          fill={`url(#${g}-bd)`}/>

        {/* Highlight shimmer */}
        <ellipse cx="36" cy="31" rx="10.5" ry="6" fill="rgba(255,255,255,0.4)" transform="rotate(-22,36,31)"/>

        {/* Expressions */}
        <Eyes  mood={mood} g={g}/>
        <Mouth mood={mood}/>

        {/* Stage 4+: Character accessory */}
        {evolution >= 4 && <Accessory charKey={charKey} col={col}/>}
      </g>

      {/* ── Stage 5+: Sparkles outside body ── */}
      {evolution >= 5 && [
        {x:6,  y:20, s:11, d:"0s"   },
        {x:78, y:13, s:9,  d:"0.7s" },
        {x:80, y:83, s:8,  d:"1.4s" },
      ].map((p,i) => (
        <text key={i} x={p.x} y={p.y} fontSize={p.s} fill={col.gl}
          style={{ animation:"sparkleAnim 2.2s ease-in-out infinite", animationDelay:p.d }}>✦</text>
      ))}
    </svg>
  );
}

/* ══════════════════════════ Standly AI ENGINE (Stage 1) ══════════════════════════ */
function calcConsistency({ c14=75, streak=4, inactive3=0 }) {
  let s = c14;
  if (streak>7) s+=5;
  if (inactive3>=3) s-=10;
  return Math.max(0,Math.min(100,Math.round(s)));
}
function calcResponsiveness({ resp=65 }) { return Math.max(0,Math.min(100,Math.round(resp))); }
function calcSedentaryRisk({ avgSit=75, ignored=2, workH="6-8" }) {
  let b = 0;
  if (avgSit>=120) b+=40; else if (avgSit>=60) b+=20;
  b += ignored*8;
  if (workH==="8+") b+=10;
  return Math.max(0,Math.min(100,Math.round(b)));
}
function calcMomentum({ consec=3 }) {
  if (consec>=5) return Math.min(100,40+consec*6);
  if (consec>=3) return Math.min(100,20+consec*10);
  return Math.max(0,consec*10);
}
function calcBurnoutRisk({ commitment="balanced", consistency=65, burnoutSig=0 }) {
  let r=0;
  if (commitment==="high" && consistency<55) r+=30;
  if (burnoutSig>=1) r+=25;
  if (burnoutSig>=2) r+=20;
  if (consistency<35) r+=15;
  return Math.max(0,Math.min(100,Math.round(r)));
}
function calcEngagement({ openFreq=5, moodLogs=3, reportViews=1, rewardInteract=1 }) {
  return Math.max(0,Math.min(100,Math.round((openFreq/7)*35+(moodLogs/7)*25+(reportViews/2)*20+rewardInteract*20)));
}
function determineBisState({ consistency, responsiveness, burnout, momentum, isNewUser }) {
  if (isNewUser) return "new_user";
  if (burnout>70) return "burnout";
  if (consistency>75 && responsiveness>70) return "momentum";
  if (momentum>60 && consistency>65) return "momentum";
  if (consistency<40 && responsiveness<40) return "at_risk";
  if (consistency>80 && responsiveness>80) return "high_discipline";
  if (consistency>=55 && consistency<=75) return "stabilizing";
  return "exploration";
}
function calcHSI({ consistency, responsiveness, engagement }) {
  return Math.max(0,Math.min(100,Math.round(consistency*0.5+responsiveness*0.3+engagement*0.2)));
}
function calcComplianceLikelihood({ consistency, responsiveness, streak, momentum }) {
  const s = consistency*0.35+responsiveness*0.3+Math.min(streak*5,20)+momentum*0.15;
  return s>68?"high":s>42?"medium":"low";
}

/* ══════════════════════════ STAGE 2 ENGINE ════════════════════════════════ */

/* 1. Behavioral Archetype */
const ARCHETYPES = {
  weekend_dropper:    { label:"Weekend Dropper",     icon:"📅", color:"#C9B6F2", cls:"purple", desc:"Strong weekdays, weak weekends.", strategy:"Weekend Light Mode active — reduced goals Sat/Sun, no multiplier penalty." },
  morning_sprinter:   { label:"Morning Sprinter",    icon:"🌅", color:"#FFD83C", cls:"gold",   desc:"High AM responsiveness, fades after noon.", strategy:"Reminders front-loaded before 11 AM. Morning Momentum Bonus active." },
  silent_ignorer:     { label:"Silent Ignorer",      icon:"🔕", color:"#FF7B7B", cls:"red",    desc:"Low reminder response across the board.", strategy:"Reduced notification volume. Gentle re-engagement approach active." },
  high_burst:         { label:"High Burst Performer",icon:"💥", color:"#FFB347", cls:"gold",   desc:"Intense periods followed by sudden drops.", strategy:"Recovery buffer weeks added. Slow goal progression to prevent burnout." },
  slow_builder:       { label:"Slow Builder",        icon:"🌱", color:"#6FCF97", cls:"green",  desc:"Gradual, consistent daily improvement.", strategy:"Steady XP curve. Goal increases are small and frequent." },
  burnout_cycler:     { label:"Burnout Cycler",      icon:"🔄", color:"#A9D6F5", cls:"blue",   desc:"Repeating high-effort → crash pattern.", strategy:"Recovery buffer weeks built into plan. Urgency mode disabled." },
};
function calcArchetype({ weekdayC=80, weekendC=40, morningR=75, afternoonR=35, burstPattern=false, slowSteady=false, resp=65, burnoutSig=0 }) {
  if (burstPattern && burnoutSig>=1) return "burnout_cycler";
  if (burstPattern) return "high_burst";
  if (slowSteady) return "slow_builder";
  if (weekdayC>70 && weekendC<50) return "weekend_dropper";
  if (morningR>70 && afternoonR<45) return "morning_sprinter";
  if (resp<40) return "silent_ignorer";
  return "slow_builder";
}

/* 2. Movement Identity Score */
const IDENTITY_LEVELS = [
  { min:85, label:"Movement Identity",  icon:"🏆", color:"#FFD83C", cls:"gold"   },
  { min:68, label:"Daily Builder",      icon:"💎", color:"#C9B6F2", cls:"purple" },
  { min:48, label:"Consistent Mover",   icon:"⚡", color:"#6FCF97", cls:"green"  },
  { min:28, label:"Developing Habit",   icon:"🌱", color:"#A9D6F5", cls:"blue"   },
  { min:0,  label:"Occasional Mover",   icon:"👣", color:"rgba(255,255,255,0.6)", cls:"muted" },
];
function calcMovementIdentity({ c14=75, streak=4, recoversFast=true, momentumFreq=3, engagement=60, adherence=70 }) {
  let s = (c14*0.35) + (Math.min(streak,14)/14*100*0.2) + (engagement*0.15) + (adherence*0.2) + (momentumFreq/7*100*0.1);
  if (recoversFast) s+=5;
  return Math.max(0,Math.min(100,Math.round(s)));
}
function getIdentityLevel(score) {
  return IDENTITY_LEVELS.find(l => score>=l.min) ?? IDENTITY_LEVELS[IDENTITY_LEVELS.length-1];
}

/* 3. Daily Compliance Prediction */
function calcDailyCompliancePct({ consistency, responsiveness, streak, momentum, burnout, dayOfWeek="weekday" }) {
  let p = consistency*0.35 + responsiveness*0.3 + Math.min(streak*4,16) + momentum*0.12;
  if (dayOfWeek==="weekend") p*=0.85;
  if (burnout>60) p*=0.8;
  return Math.max(0,Math.min(100,Math.round(p)));
}

/* 4. Fatigue Pattern Detection */
function calcFatiguePattern({ last5Days=[1,1,1,1,0], last2Days=[0,0] }) {
  const strong5 = last5Days.filter(Boolean).length>=4;
  const drop2   = last2Days.filter(Boolean).length===0;
  return strong5 && drop2;
}

/* 5. 30-Day Evolution Arc */
const ARC_PHASES = [
  { day:1,  end:7,  label:"Foundation",            icon:"🌱", desc:"Building your baseline. Low-pressure, high-reward." },
  { day:8,  end:14, label:"Stabilization",          icon:"⚖️", desc:"Patterns forming. Reminders tuning to your rhythm." },
  { day:15, end:21, label:"Expansion",              icon:"🚀", desc:"Goals expanding. Character beginning to evolve." },
  { day:22, end:30, label:"Identity Consolidation", icon:"🏆", desc:"Habit identity locking in. Visual transformation active." },
];
function calcArcPhase(day=18) {
  return ARC_PHASES.find(p => day>=p.day && day<=p.end) ?? ARC_PHASES[3];
}
function calcCharEvolution(day=18, consistency=65) {
  // 0-3 scale representing visual growth of character
  if (day>=22 && consistency>70) return 3;
  if (day>=15 && consistency>55) return 2;
  if (day>=8)  return 1;
  return 0;
}

/* 6. Adaptive Reward Economy */
function calcAdaptiveReward({ engagement=60, consistency=65, bisState="stabilizing" }) {
  if (engagement>75 && consistency>75) return { curve:"steep",   xpScale:0.9, levelScale:1.2, label:"Hardcore Mode",  desc:"XP curve steeper. Unlocks harder." };
  if (consistency<45 || bisState==="at_risk") return { curve:"easy", xpScale:1.4, levelScale:0.7, label:"Catch-Up Mode", desc:"Faster levels. More micro-rewards." };
  return { curve:"normal", xpScale:1.0, levelScale:1.0, label:"Standard Mode", desc:"Balanced progression." };
}

/* 7. Behavioral Memory */
const MEMORY_EVENTS = [
  { id:"streak9",  icon:"🔥", text:"You once held a 9-day streak. You're capable of that again.", condition: c => c.streak>=3 },
  { id:"10k",      icon:"🏅", text:"You hit 10,000 steps once — your personal best. Chase it again.", condition: c => c.c14>70 },
  { id:"comeback", icon:"💪", text:"You recovered from a 3-day break before. You can do it again.", condition: c => c.inactive3>=1 },
  { id:"momentum", icon:"🚀", text:"Your highest momentum day scored 80+. That energy is still in you.", condition: c => c.consec>=4 },
];
function getBehavioralMemories(controls) {
  return MEMORY_EVENTS.filter(e => e.condition(controls)).slice(0,2);
}

/* 8. Day-of-Week Model */
function calcDayOfWeekMode({ weekendC=40, today="weekday" }) {
  if (today==="weekend" && weekendC<55) return { mode:"recovery", label:"Weekend Recovery", icon:"🌤️", goalAdj:0.7, desc:"Weekend Light Mode. 70% of normal goal. No multiplier loss." };
  return { mode:"normal", label:"Normal Mode", icon:"📅", goalAdj:1.0, desc:"Full target active." };
}

/* 9. Plan + adaptation */
function calcBasePlan({ bmi=24, activity="low", goal="wellness", commitment="balanced", workHours="6-8", pain=false }) {
  let base = bmi>25?7000:bmi>=18.5?6000:5000;
  if (activity==="moderate") base+=500;
  if (activity==="high")     base+=1000;
  if (goal==="weight")       base+=1000;
  if (goal==="energy"||goal==="productivity") base+=500;
  if (commitment==="light")  base=Math.round(base*0.9);
  if (commitment==="high")   base=Math.round(base*1.1);
  let interval = activity==="low"?60:activity==="moderate"?75:90;
  if (pain) interval-=10;
  if (commitment==="high") interval-=10;
  if (workHours==="8+") interval-=5;
  return { steps:base, interval:Math.max(interval,30) };
}
function adaptPlan({ baseSteps, baseInterval, bisState, burnout, c14, commitment, dayMode, arcPhase }) {
  let steps=baseSteps, interval=baseInterval, xpMult=1.0;
  if (bisState==="new_user")       { steps=Math.round(steps*0.95); xpMult=1.5; }
  if (bisState==="momentum")       { steps=Math.round(steps*1.05); xpMult=2.0; }
  if (bisState==="at_risk")        { steps=Math.round(steps*0.95); interval=Math.min(interval+15,120); }
  if (bisState==="burnout")        { steps=Math.round(steps*0.90); interval=Math.min(interval+20,120); xpMult=1.0; }
  if (bisState==="high_discipline"){ steps=Math.round(steps*1.08); xpMult=2.0; }
  if (burnout>70)                  { steps=Math.round(steps*0.92); }
  if (c14>85 && burnout<50)        { steps=Math.round(steps*1.05); }
  if (c14<50)                      { steps=Math.round(steps*0.95); }
  if (dayMode?.goalAdj && dayMode.goalAdj!==1) steps=Math.round(steps*dayMode.goalAdj);
  if (arcPhase?.day<=7)            { steps=Math.round(steps*0.95); xpMult=Math.max(xpMult,1.5); }
  const multLabel = xpMult>=2?"×2.0":xpMult>=1.5?"×1.5":xpMult>=1.2?"×1.2":"×1.0";
  return { steps, interval, xpMult, multLabel };
}

const STATE_META = {
  new_user:       { label:"New User",       icon:"🌱", color:"#6FCF97", cls:"green",  desc:"Building first wins. Lower goals, higher XP." },
  exploration:    { label:"Exploring",      icon:"🔭", color:"#A9D6F5", cls:"blue",   desc:"Learning your patterns. Keep showing up." },
  stabilizing:    { label:"Stabilizing",    icon:"⚖️", color:"#C9B6F2", cls:"purple", desc:"Habit forming. Consistency building." },
  momentum:       { label:"Momentum",       icon:"🚀", color:"#FFD83C", cls:"gold",   desc:"XP multiplier active. Character glow unlocked." },
  at_risk:        { label:"At Risk",        icon:"🤍", color:"#F6B7D8", cls:"rose",   desc:"Pressure reduced. Recovery mission available." },
  burnout:        { label:"Recovery Mode",  icon:"🌤️", color:"#A9D6F5", cls:"blue",   desc:"Goals eased. Streak loss disabled." },
  high_discipline:{ label:"High Discipline",icon:"💎", color:"#FFD83C", cls:"gold",   desc:"Elite mode. Bonus missions available." },
};
const SCORE_META = [
  { key:"consistency",  label:"Consistency",   color:"#C9B6F2" },
  { key:"responsiveness",label:"Responsiveness",color:"#F6B7D8" },
  { key:"sedentary",    label:"Sedentary Risk", color:"#FF7B7B" },
  { key:"momentum",     label:"Momentum",       color:"#FFD83C" },
  { key:"burnout",      label:"Burnout Risk",   color:"#FF9B9B" },
  { key:"engagement",   label:"Engagement",     color:"#A9D6F5" },
];
const HSI_LABELS = [[85,"Movement Identity ✦"],[70,"Stable Habit"],[40,"Developing Habit"],[0,"Early Stage"]];

/* ══════════════════════════ useBIS HOOK ═══════════════════════════════════ */
function useBIS(c) {
  return useMemo(() => {
    const consistency    = calcConsistency({ c14:c.c14, streak:c.streak, inactive3:c.inactive3 });
    const responsiveness = calcResponsiveness({ resp:c.responsiveness });
    const sedentary      = calcSedentaryRisk({ avgSit:c.avgSitting, ignored:c.ignoredStands, workH:c.workHours });
    const momentum       = calcMomentum({ consec:c.consecReminders });
    const burnout        = calcBurnoutRisk({ commitment:c.commitment, consistency, burnoutSig:c.burnoutSignals });
    const engagement     = calcEngagement({ openFreq:c.openFreq, moodLogs:c.moodLogs, reportViews:c.reportViews, rewardInteract:c.rewardInteract });
    const bisState       = determineBisState({ consistency, responsiveness, burnout, momentum, isNewUser:c.isNewUser });
    const hsi            = calcHSI({ consistency, responsiveness, engagement });
    const hsiLabel       = HSI_LABELS.find(([t])=>hsi>=t)?.[1]??"Early Stage";
    const compliance     = calcComplianceLikelihood({ consistency, responsiveness, streak:c.streak, momentum });

    // Stage 2
    const archetype      = calcArchetype({ weekdayC:c.weekdayC, weekendC:c.weekendC, morningR:c.morningR, afternoonR:c.afternoonR, burstPattern:c.burstPattern, slowSteady:c.slowSteady, resp:c.responsiveness, burnoutSig:c.burnoutSignals });
    const miScore        = calcMovementIdentity({ c14:c.c14, streak:c.streak, recoversFast:c.recoversFast, momentumFreq:c.consecReminders, engagement, adherence:c.responsiveness });
    const miLevel        = getIdentityLevel(miScore);
    const compliancePct  = calcDailyCompliancePct({ consistency, responsiveness, streak:c.streak, momentum, burnout, dayOfWeek:c.todayDOW });
    const isFatigue      = calcFatiguePattern({ last5Days:c.last5Days, last2Days:c.last2Days });
    const arcPhase       = calcArcPhase(c.dayInJourney);
    const charEvolution  = calcCharEvolution(c.dayInJourney, consistency);
    const rewardEcon     = calcAdaptiveReward({ engagement, consistency, bisState });
    const memories       = getBehavioralMemories(c);
    const dayMode        = calcDayOfWeekMode({ weekendC:c.weekendC, today:c.todayDOW });

    // Stage 4: AI Adaptive Goal Engine
    const stabilityScore  = calcStabilityScore({ consistency, responsiveness, momentum });
    const riskModifier    = calcRiskModifier({ burnout, inactive3:c.inactive3 });
    const adaptiveDelta   = calcAdaptiveDelta({ stabilityScore, riskModifier, dayInJourney:c.dayInJourney });
    const flowZone        = calcFlowZone(compliancePct);
    const overtraining    = detectOvertraining({ compliancePct, responsiveness, engagement });
    const recoveryMode    = isRecoveryMode({ inactive3:c.inactive3, burnout });
    const goalAdj         = applyAdaptiveGoal({ baseSteps:c.baseSteps??7000, adaptiveDelta, flowZone, overtraining, recoveryMode, miLevel, archetype, bisState });
    const microChallenge  = calcMicroChallenge({ stabilityScore, burnout, bisState, archetype, compliancePct });
    const weeklyCalib     = calcWeeklyCalibration({ consistency, burnout, compliancePct, dayInJourney:c.dayInJourney });

    // Stage 5: Predictive Burnout Modeling
    const recoveryResilience = calcRecoveryResilience({ consistency, recoversFast:c.recoversFast, streak:c.streak, inactive3:c.inactive3, momentum, c14:c.c14 });
    const burnoutTrajectory  = calcBurnoutTrajectory({ burnout, consistency, adaptiveDelta, burnoutSignals:c.burnoutSignals, streak:c.streak, inactive3:c.inactive3 });
    const burnoutForecast    = calcBurnoutProbability({ burnout, trajectory:burnoutTrajectory.direction, adaptiveDelta, engagement, responsiveness, recoveryResilience, inactive3:c.inactive3, burnoutSignals:c.burnoutSignals, commitment:c.commitment });
    const riskLevel3d        = getRiskLevel(burnoutForecast.day3);
    const riskLevel7d        = getRiskLevel(burnoutForecast.day7);
    const riskFactors        = calcRiskFactors({ burnout, adaptiveDelta, inactive3:c.inactive3, sedentary, responsiveness, engagement, burnoutSignals:c.burnoutSignals, commitment:c.commitment, streak:c.streak });
    const intervention       = getBurnoutIntervention({ riskLevel:riskLevel7d, archetype, motivation:c.motivation, trajectory:burnoutTrajectory.direction });
    const preemptiveDialogue = getBurnoutPreemptiveDialogue(riskLevel7d, burnoutTrajectory.direction);

    // Stage 6: Predictive AI + Adaptive Timing
    const featureVector      = buildFeatureVector({ consistency, responsiveness, momentum, burnout, engagement, bisState, archetype, miScore, adaptiveDelta, compliancePct, inactive3:c.inactive3, streak:c.streak, burnoutForecast, recoveryResilience, dayInJourney:c.dayInJourney, motivation:c.motivation });
    const aiInsight          = mockLLMInsight(featureVector);
    const disengagement      = calcDisengagementProbability({ responsiveness, compliancePct, engagement, inactive3:c.inactive3, burnout, momentum, streak:c.streak });
    const notifWindows       = calcOptimalNotificationWindows({ archetype, morningR:c.morningR, afternoonR:c.afternoonR, responsiveness, compliancePct, burnout, todayDOW:c.todayDOW, commitment:c.commitment });
    const dailyForecast      = calcDailyForecast({ compliancePct, burnout, momentum, consistency, todayDOW:c.todayDOW, arcPhase, dayInJourney:c.dayInJourney, isFatigue });
    const eventLog           = buildEventLog({ consistency, streak:c.streak, inactive3:c.inactive3, burnoutSignals:c.burnoutSignals, compliancePct, momentum, dayInJourney:c.dayInJourney });

    // Stage 7: Self-Learning + Micro-Decision + A/B
    // microDecisions needs the full bis snapshot — build a partial context object
    const bisContext = { stabilityScore, burnout, disengagement, compliancePct, responsiveness, engagement,
                         microChallenge, flowZone, overtraining, recoveryMode, riskLevel7d, dailyForecast,
                         bisState, adaptiveDelta, goalAdj };
    const microDecisions = calcMicroDecisions({ bis:bisContext, controls:c });
    const selectedIntervention = selectWeightedIntervention({ weights:c.weights??INITIAL_WEIGHTS, bis:bisContext });
    const evalMetrics    = calcEvaluationMetrics({ bis:{ consistency, burnout, compliancePct, recoveryResilience, burnoutTrajectory, weeklyCalib, adaptiveDelta }, controls:c });

    return { consistency, responsiveness, sedentary, momentum, burnout, engagement, bisState, hsi, hsiLabel, compliance,
             archetype, miScore, miLevel, compliancePct, isFatigue, arcPhase, charEvolution, rewardEcon, memories, dayMode,
             // Stage 4
             stabilityScore, riskModifier, adaptiveDelta, flowZone, overtraining, recoveryMode, goalAdj, microChallenge, weeklyCalib,
             // Stage 5
             recoveryResilience, burnoutTrajectory, burnoutForecast, riskLevel3d, riskLevel7d, riskFactors, intervention, preemptiveDialogue,
             // Stage 6
             featureVector, aiInsight, disengagement, notifWindows, dailyForecast, eventLog,
             // Stage 7
             microDecisions, selectedIntervention, evalMetrics };
  }, [c]);
}

/* ══════════════════════════ STAGE 3: EMOTIONAL INTERACTION ENGINE ═════════ */

/* ── 1. Dialogue Engine ── */
function getDialogue({ bisState, miScore, burnout, momentum, archetype, motivation, streak, inactiveDays=0, todayIntent="consistent" }) {
  // Anti-churn emergency
  if (inactiveDays >= 7) return { main:"Let's restart — gently.", sub:"Ultra-light mode. No pressure, no penalties.", tone:"calm" };
  if (inactiveDays >= 3) return { main:"Let's try again. Softly.", sub:"A 3-day reset challenge is ready for you.", tone:"calm" };

  // Streak comeback
  if (inactiveDays >= 1 && streak >= 1) return { main:"That comeback matters.", sub:"You returned. That's the hardest part.", tone:"warm" };

  // High momentum + high consistency
  if (momentum > 65 && miScore > 70) return { main:"You're building something real.", sub:"This is what identity-level change looks like.", tone:"proud" };

  // State-based
  if (bisState === "momentum") {
    const lines = { competitive:"Let's beat yesterday.", achievement:"You unlocked a new tier.", data:"Momentum score: peak level.", gentle:"You showed up again.", visual:"Watch yourself evolve. 🌟" };
    return { main: lines[motivation] ?? "You're unstoppable right now.", sub:"XP multiplier is live.", tone:"energized" };
  }
  if (bisState === "burnout") return { main:"Let's slow it down.", sub:"Small steps count. Rest is part of the process.", tone:"calm" };
  if (bisState === "at_risk") return { main:"No rush. Just one small step.", sub:"We're here whenever you're ready.", tone:"gentle" };
  if (bisState === "high_discipline") {
    if (motivation==="competitive") return { main:"Elite streak. Keep going.", sub:"You're in the top 5% of movers.", tone:"proud" };
    return { main:"High discipline mode.", sub:"Bonus challenges are unlocked.", tone:"proud" };
  }
  if (bisState === "new_user") return { main:"Your first wins are coming.", sub:"We've set an easy baseline to start.", tone:"warm" };

  // Intent-based morning modifier
  if (todayIntent === "energized") return { main:"Let's make today count.", sub:"Energy intent active — reminders optimized.", tone:"energized" };
  if (todayIntent === "calm")      return { main:"A calm day. That's valid.", sub:"Gentle reminders. No pressure.", tone:"calm" };
  if (todayIntent === "focused")   return { main:"Focus mode. Let's move smart.", sub:"Reminders timed to protect your flow.", tone:"proud" };

  // Identity-level reinforcement
  if (miScore >= 85) return { main:"You've become a daily mover.", sub:"This is your identity now. Protect it.", tone:"proud" };
  if (miScore >= 68) return { main:"A daily builder. That's you.", sub:"Consistency is forming into identity.", tone:"warm" };
  if (miScore >= 48) return { main:"You're becoming someone who moves.", sub:"It's working. Keep the signal going.", tone:"warm" };

  // Archetype-specific
  if (archetype === "weekend_dropper") return { main:"Weekends count too.", sub:"Light mode is on — no multiplier loss.", tone:"gentle" };
  if (archetype === "morning_sprinter") return { main:"Morning window is your zone.", sub:"Front-loaded reminders ready.", tone:"energized" };
  if (archetype === "burnout_cycler")  return { main:"Pace yourself today.", sub:"Recovery buffer is built into your plan.", tone:"calm" };

  // Motivation-based defaults
  const motivationDefaults = {
    competitive:  { main:"Let's beat yesterday.", sub:"Your score is being tracked.", tone:"energized" },
    achievement:  { main:"Next milestone incoming.", sub:"You're on the path.", tone:"proud" },
    data:         { main:"Your sitting time dropped 18%.", sub:"Data-driven progress. Keep it up.", tone:"proud" },
    gentle:       { main:"You showed up again.", sub:"That's everything.", tone:"warm" },
    visual:       { main:"Watch yourself evolve.", sub:"Your character is changing. ✨", tone:"warm" },
  };
  return motivationDefaults[motivation] ?? { main:"Keep showing up.", sub:"Every move builds the habit.", tone:"warm" };
}

/* ── 2. Tone-based XP celebration phrase ── */
function getCelebrationPhrase({ bisState, motivation, miScore, xpGained }) {
  if (bisState==="burnout")       return `+${xpGained} XP · You're doing great 🌤️`;
  if (bisState==="momentum")      return `+${xpGained} XP · Streak extended! 🚀`;
  if (motivation==="competitive") return `+${xpGained} XP · Beating the baseline.`;
  if (motivation==="gentle")      return `+${xpGained} XP · You showed up 💛`;
  if (motivation==="data")        return `+${xpGained} XP · Logged. Progress confirmed.`;
  if (miScore >= 70)              return `+${xpGained} XP · Identity strengthened ✦`;
  return `+${xpGained} XP · Nice move! ✨`;
}

/* ── 3. Escalation Engine ── */
function getEscalationLevel(responsiveness) {
  if (responsiveness >= 62) return 1;
  if (responsiveness >= 35) return 2;
  return 3;
}
const ESCALATION_COPY = {
  1: { title:"You've been sitting a while.",        sub:"Gentle reminder — move when you're ready.",              cta:"Start move",    bonus:"Completed in 3 min? Bonus XP! ⚡" },
  2: { title:"Let's reset your posture.",           sub:"Your body needs this break. 2 min is enough.",          cta:"Move now ↑",    bonus:"Responsiveness streak waiting!" },
  3: { title:"You promised to protect your energy.",sub:"This is that moment. Honour the commitment you made.",  cta:"I'm going now", bonus:"Commitment trigger — streak protected" },
};

/* ── 4. Anti-Churn Protocol ── */
function getChurnState(inactiveDays) {
  if (inactiveDays >= 7) return "ultra_light";
  if (inactiveDays >= 3) return "gentle_restart";
  return "normal";
}

/* ── 5. Journey Milestones ── */
function buildJourneyMilestones(dayInJourney, consistency, charKey) {
  const weeks = [
    { week:1, days:"Days 1–7",  label:"You started",      icon:"🌱", desc:"Baseline set. Character assigned. First wins unlocked.",         endDay:7  },
    { week:2, days:"Days 8–14", label:"You stabilized",   icon:"⚖️", desc:"Patterns forming. Reminders tuning to your rhythm.",             endDay:14 },
    { week:3, days:"Days 15–21",label:"You improved",     icon:"🚀", desc:"Goals expanding. Character beginning to evolve visually.",        endDay:21 },
    { week:4, days:"Days 22–30",label:"You evolved",      icon:"🏆", desc:"Habit identity forming. Transformation arc completing.",          endDay:30 },
    { week:5, days:"Day 31+",   label:"You became it",    icon:"💎", desc:"Movement Identity achieved. This is who you are now.",           endDay:999 },
  ];
  return weeks.map(w => ({
    ...w,
    status: dayInJourney > w.endDay ? "done" : dayInJourney >= (w.endDay - 6) ? "active" : "future",
    evolution: w.week - 1,
  }));
}

/* ══════════════════════════ STAGE 4: AI-DRIVEN ADAPTIVE GOAL ENGINE ═══════ */

/* ── Stability Score ──
   Measures how ready the user is for more challenge.
   Formula: Consistency×0.4 + Responsiveness×0.3 + Momentum×0.3          */
function calcStabilityScore({ consistency, responsiveness, momentum }) {
  return Math.max(0, Math.min(100, Math.round(
    consistency*0.4 + responsiveness*0.3 + momentum*0.3
  )));
}

/* ── Risk Modifier ──
   How much we should pull back. Burnout + missed-day weight.             */
function calcRiskModifier({ burnout, inactive3=0 }) {
  const missPenalty = Math.min(inactive3 * 12, 40);   // max 40 pts penalty
  return Math.max(0, Math.min(100, Math.round(
    burnout*0.6 + missPenalty*0.4
  )));
}

/* ── Adaptive Delta ──
   Net pressure signal. Sensitivity 0.05–0.15 based on journey day.
   Positive = user can handle more. Negative = ease off.                 */
function calcAdaptiveDelta({ stabilityScore, riskModifier, dayInJourney=18 }) {
  // Sensitivity grows with journey day (new users get gentler adjustments)
  const sensitivity = dayInJourney < 8  ? 0.05
                    : dayInJourney < 21 ? 0.09
                    : 0.13;
  return parseFloat(((stabilityScore - riskModifier) * sensitivity).toFixed(1));
}

/* ── Flow Zone Check ──
   Target: completion probability 65–85%.
   Returns: "too_easy" | "flow" | "too_hard"                             */
function calcFlowZone(compliancePct) {
  if (compliancePct > 88) return "too_easy";
  if (compliancePct < 60) return "too_hard";
  return "flow";
}

/* ── Overtraining Detection ──
   High completion but low responsiveness + low engagement = forcing.    */
function detectOvertraining({ compliancePct, responsiveness, engagement, latency=40 }) {
  return compliancePct > 85 && responsiveness < 45 && engagement < 40;
}

/* ── Recovery Mode Trigger ──
   2+ missed days OR burnout > 70 → recovery mode for 2–4 days.         */
function isRecoveryMode({ inactive3, burnout }) {
  return inactive3 >= 2 || burnout > 70;
}

/* ── Goal Adjustment ──
   Applies delta to base steps. Clamps to ±12%. Never moves after miss.
   Returns { adjustedSteps, pctChange, action, message, tone }           */
function applyAdaptiveGoal({ baseSteps, adaptiveDelta, flowZone, overtraining, recoveryMode, miLevel, archetype, bisState }) {
  let pctChange = 0;
  let reason    = "";
  let action    = "hold"; // "increase" | "decrease" | "hold" | "recovery" | "overtrain"

  // Hard guards first
  if (recoveryMode) {
    pctChange = -15; action = "recovery";
    reason = "Recovery mode — protecting your energy.";
  } else if (overtraining) {
    pctChange = 0; action = "overtrain";
    reason = "Holding steady — quality over quantity.";
  } else if (flowZone === "too_easy" && adaptiveDelta > 0) {
    pctChange = Math.min(adaptiveDelta * 0.6, 8);  action = "increase";
    reason = "You've been exceeding this consistently.";
  } else if (flowZone === "too_hard" && adaptiveDelta < 0) {
    pctChange = Math.max(adaptiveDelta * 0.5, -12); action = "decrease";
    reason = "Protecting your completion rate.";
  } else if (adaptiveDelta > 4) {
    pctChange = Math.min(adaptiveDelta * 0.4, 8);   action = "increase";
    reason = "Stability strong — slight increase.";
  } else if (adaptiveDelta < -4) {
    pctChange = Math.max(adaptiveDelta * 0.4, -12); action = "decrease";
    reason = "Easing pressure to protect retention.";
  }

  // Clamp to ±12%
  pctChange = Math.max(-12, Math.min(12, pctChange));
  const adjustedSteps = Math.round(baseSteps * (1 + pctChange/100));

  // Identity-integrated message (not numeric)
  const identityMsg = (() => {
    if (action==="recovery")  return "Let's protect your energy today.";
    if (action==="overtrain") return "Hold the line — quality beats quantity.";
    if (action==="increase" && bisState==="high_discipline") return "Your discipline is ready for a stronger challenge.";
    if (action==="increase" && bisState==="momentum")        return "You're in momentum — let's build on it.";
    if (action==="increase")  return "You're ready for a slightly stronger challenge.";
    if (action==="decrease")  return "A gentle recalibration — you'll come back stronger.";
    return "Keeping your challenge balanced today.";
  })();

  return { adjustedSteps, pctChange: Math.round(pctChange*10)/10, action, reason, identityMsg };
}

/* ── Micro-Challenge Injection ──
   Only when stability high + burnout low + not overtraining.
   Returns null or a challenge object.                                    */
function calcMicroChallenge({ stabilityScore, burnout, bisState, archetype, compliancePct }) {
  if (burnout > 45 || stabilityScore < 60 || bisState === "burnout" || bisState === "at_risk") return null;
  if (compliancePct < 65) return null;  // Don't pile on if today looks hard
  const challenges = {
    weekend_dropper:   { boost:600,  label:"Weekend Warrior",   desc:"Prove weekends count too." },
    morning_sprinter:  { boost:500,  label:"AM Sprint",         desc:"Front-loaded before noon." },
    burnout_cycler:    { boost:400,  label:"Pace Builder",       desc:"Steady, not intense." },
    high_burst:        { boost:1000, label:"Burst Day",          desc:"Max effort — one shot." },
    slow_builder:      { boost:500,  label:"Steady Growth",      desc:"One extra block of steps." },
    silent_ignorer:    { boost:300,  label:"Micro Win",          desc:"Small step. Big signal." },
  };
  return challenges[archetype] ?? { boost:700, label:"Daily Boost", desc:"A little extra today." };
}

/* ── Weekly Calibration ──
   Evaluates last 7 days. Returns a calibration summary + nudge.        */
function calcWeeklyCalibration({ consistency, burnout, compliancePct, avgGoalDelta=2.1, dayInJourney=18 }) {
  const inFlowZone   = compliancePct >= 65 && compliancePct <= 85;
  const burnoutStable = burnout < 55;
  const growing      = avgGoalDelta > 0;
  const allGood      = inFlowZone && burnoutStable && growing;

  const baseIncrease = allGood ? 2 : 0;
  const status       = allGood ? "calibrated" : !inFlowZone ? "flow_drift" : !burnoutStable ? "burnout_risk" : "flat";

  const statusMeta = {
    calibrated:  { icon:"✅", label:"On Track",      color:"#6FCF97", note:"Base goal +1–3% approved." },
    flow_drift:  { icon:"⚖️", label:"Flow Drift",    color:"#FFD83C", note:"Completion off target — recalibrating." },
    burnout_risk:{ icon:"🔥", label:"Burnout Watch", color:"#FF7B7B", note:"Goal held. Recovery priority." },
    flat:        { icon:"📊", label:"Steady",         color:"#A9D6F5", note:"Baseline maintained." },
  };
  return { status, ...statusMeta[status], baseIncrease, inFlowZone, burnoutStable };
}

/* ══════════════════════════ STAGE 5: PREDICTIVE BURNOUT MODELING ══════════ */

/* ── Risk level taxonomy ── */
const BURNOUT_RISK_LEVELS = [
  { min:85, id:"burnout",  label:"Burnout",  icon:"🔴", cls:"risk-burnout",  intCls:"burnout",  color:"#FF5252" },
  { min:70, id:"critical", label:"Critical", icon:"🟠", cls:"risk-critical", intCls:"critical", color:"#FF7B7B" },
  { min:55, id:"elevated", label:"Elevated", icon:"🟡", cls:"risk-elevated", intCls:"elevated", color:"#FFB347" },
  { min:30, id:"watch",    label:"Watch",    icon:"🔵", cls:"risk-watch",    intCls:"watch",    color:"#FFD83C" },
  { min:0,  id:"safe",     label:"Safe",     icon:"🟢", cls:"risk-safe",     intCls:"safe",     color:"#6FCF97" },
];
function getRiskLevel(prob) {
  return BURNOUT_RISK_LEVELS.find(r => prob >= r.min) ?? BURNOUT_RISK_LEVELS[BURNOUT_RISK_LEVELS.length-1];
}

/* ── 7-day Burnout Trajectory ──
   Simulates direction of burnout over the last 7 days from current signals.
   Returns: "rising" | "stable" | "falling" + trend array for chart.         */
function calcBurnoutTrajectory({ burnout, consistency, adaptiveDelta, burnoutSignals, streak, inactive3 }) {
  // Reconstruct simulated 7-day arc around current burnout score
  const pressureSlope = adaptiveDelta > 3 ? 3 : adaptiveDelta < -3 ? -2 : 0;
  const raw = Array.from({ length:7 }, (_, i) => {
    const dayOffset = i - 6;  // -6 to 0 (today)
    let val = burnout
      + (pressureSlope * dayOffset * 0.5)    // goal pressure trend
      + (inactive3 > 0 ? inactive3 * 2 * (dayOffset<-3?1:0) : 0) // missed days spike
      + (burnoutSignals * 4 * Math.max(0, dayOffset + 6) / 6);    // signals building up
    return Math.max(0, Math.min(100, Math.round(val + (Math.random()*3 - 1.5))));
  });
  // Smooth: replace last value with actual burnout
  raw[6] = burnout;

  const first3avg = (raw[0]+raw[1]+raw[2])/3;
  const last3avg  = (raw[4]+raw[5]+raw[6])/3;
  const diff = last3avg - first3avg;
  const direction = diff > 6 ? "rising" : diff < -6 ? "falling" : "stable";

  return { direction, series:raw };
}

/* ── 3 / 7-day Burnout Probability Forecast ──
   Predicts likelihood (0–100%) of entering burnout state in N days.
   Uses: current burnout, trajectory direction, pressure, engagement, resilience. */
function calcBurnoutProbability({ burnout, trajectory, adaptiveDelta, engagement, responsiveness,
                                   recoveryResilience, inactive3, burnoutSignals, commitment }) {
  const pressureRisk = adaptiveDelta > 6 ? 18 : adaptiveDelta > 3 ? 10 : 0;
  const engagementRisk = engagement < 35 ? 15 : engagement < 50 ? 8 : 0;
  const respRisk = responsiveness < 40 ? 12 : responsiveness < 55 ? 6 : 0;
  const sigRisk  = burnoutSignals * 10;
  const commitRisk = commitment === "high" && burnout > 45 ? 12 : 0;
  const missPenalty = inactive3 >= 2 ? inactive3 * 7 : 0;
  const resilienceBonus = recoveryResilience > 65 ? -10 : recoveryResilience > 45 ? -5 : 0;
  const trajBonus = trajectory === "rising" ? 14 : trajectory === "falling" ? -12 : 0;

  const base3  = burnout * 0.55 + pressureRisk + sigRisk + missPenalty + resilienceBonus + trajBonus;
  const base7  = burnout * 0.70 + pressureRisk + engagementRisk + respRisk + sigRisk + commitRisk + missPenalty + resilienceBonus + trajBonus;

  return {
    day3: Math.max(0, Math.min(100, Math.round(base3))),
    day7: Math.max(0, Math.min(100, Math.round(base7))),
  };
}

/* ── Recovery Resilience Score (0–100) ──
   How well the user bounces back after stress. High = fast recovery.          */
function calcRecoveryResilience({ consistency, recoversFast, streak, inactive3, momentum, c14 }) {
  let r = consistency * 0.4 + momentum * 0.25 + c14 * 0.25;
  if (recoversFast) r += 12;
  if (streak >= 5)  r += 8;
  if (inactive3 >= 3) r -= 18;
  if (inactive3 >= 7) r -= 20;
  return Math.max(0, Math.min(100, Math.round(r)));
}

/* ── Risk Factor Breakdown ──
   Returns which specific signals are contributing most to burnout risk.       */
function calcRiskFactors({ burnout, adaptiveDelta, inactive3, sedentary, responsiveness,
                            engagement, burnoutSignals, commitment, streak }) {
  const factors = [
    { id:"pressure",    label:"Goal Pressure",       weight: adaptiveDelta > 4 ? Math.min(adaptiveDelta * 5, 90) : adaptiveDelta > 0 ? adaptiveDelta * 3 : 0, icon:"⚡" },
    { id:"sedentary",   label:"Sedentary Load",       weight: sedentary,                                           icon:"🪑" },
    { id:"missed",      label:"Missed Days",          weight: Math.min(inactive3 * 18, 90),                       icon:"📉" },
    { id:"engagement",  label:"Low Engagement",       weight: Math.max(0, 80 - engagement),                       icon:"🔕" },
    { id:"response",    label:"Reminder Avoidance",   weight: Math.max(0, 80 - responsiveness),                   icon:"⏱️" },
    { id:"signals",     label:"Behavioral Signals",   weight: Math.min(burnoutSignals * 28, 90),                  icon:"📊" },
    { id:"streak",      label:"Streak Anxiety",       weight: streak >= 10 && commitment === "high" ? 45 : streak >= 7 && commitment === "high" ? 25 : 0, icon:"🔥" },
  ].filter(f => f.weight > 5)
   .sort((a,b) => b.weight - a.weight)
   .slice(0,5);
  return factors;
}

/* ── Preemptive Intervention ──
   Returns action plan based on risk level BEFORE burnout is reached.          */
function getBurnoutIntervention({ riskLevel, archetype, motivation, trajectory }) {
  const interventions = {
    safe: {
      headline: "You're in a healthy zone.",
      actions: ["Continue current pace", "Micro-challenge available", "Streak protection on"],
      urgency: "none",
    },
    watch: {
      headline: "Early signals detected — monitoring.",
      actions: ["Slight goal softening queued", "Reminder frequency adjusted", "Recovery buffer ready"],
      urgency: "low",
    },
    elevated: {
      headline: "Pressure building. Adjusting now.",
      actions: ["Goal reduced 5–8%", "Escalation level capped at 2", "Rest day encouraged this week", "Mascot in supportive mode"],
      urgency: "medium",
    },
    critical: {
      headline: "High risk. Protective mode activating.",
      actions: ["Goal reduced 12–15%", "Streak loss paused", "All escalation disabled", "Dialogue in calm tone only", "3-day recovery protocol started"],
      urgency: "high",
    },
    burnout: {
      headline: "You need rest. Not a step goal.",
      actions: ["Ultra-light mode active", "All penalties removed", "Daily goal: just open the app", "Gentle check-in only", "No XP pressure"],
      urgency: "critical",
    },
  };

  const base = interventions[riskLevel.id] ?? interventions.safe;

  // Archetype modifier
  if (archetype === "burnout_cycler" && riskLevel.id !== "safe") {
    base.actions.push("Burnout Cycler protocol: recovery buffer week added");
  }
  if (motivation === "competitive" && riskLevel.id === "elevated") {
    base.actions.push("Competitive drive noted — reframed as strategic rest");
  }

  return base;
}

/* ── Preemptive Dialogue Lines (feed into Stage 3) ── */
function getBurnoutPreemptiveDialogue(riskLevel, trajectory) {
  if (riskLevel.id === "burnout")  return { main:"Rest is not failure.", sub:"Your body is asking for recovery. We're listening.", tone:"calm" };
  if (riskLevel.id === "critical") return { main:"Something feels heavy right now.", sub:"Let's ease the pressure — for a few days.", tone:"calm" };
  if (riskLevel.id === "elevated" && trajectory === "rising") return { main:"You've been pushing hard.", sub:"The engine is adjusting your load.", tone:"gentle" };
  if (riskLevel.id === "watch")    return { main:"Staying ahead of burnout.", sub:"Small shifts now prevent big crashes later.", tone:"warm" };
  return null;
}

/* ══════════════════════════ STAGE 6: PREDICTIVE AI + ADAPTIVE TIMING ══════ */

/* ── Feature Vector ──
   Structured behavioral summary consumed by the mock LLM layer.
   This is the "data contract" between the deterministic engine and AI.       */
function buildFeatureVector({ consistency, responsiveness, momentum, burnout, engagement,
                               bisState, archetype, miScore, adaptiveDelta, compliancePct,
                               inactive3, streak, burnoutForecast, recoveryResilience,
                               dayInJourney, motivation }) {
  return {
    consistency_pct:   consistency,
    responsiveness_pct: responsiveness,
    momentum_score:    momentum,
    burnout_index:     burnout,
    engagement_depth:  engagement,
    behavioral_state:  bisState,
    archetype,
    identity_score:    miScore,
    goal_pressure:     adaptiveDelta > 0 ? "increasing" : adaptiveDelta < 0 ? "decreasing" : "stable",
    completion_likelihood: compliancePct,
    inactive_days:     inactive3,
    current_streak:    streak,
    burnout_3d_risk:   burnoutForecast.day3,
    burnout_7d_risk:   burnoutForecast.day7,
    recovery_resilience: recoveryResilience,
    journey_day:       dayInJourney,
    motivation_style:  motivation,
    trend: consistency > 70 && momentum > 60 ? "rising"
         : consistency < 45 || burnout > 65   ? "falling"
         : "stable",
  };
}

/* ── Mock LLM Insight Generator ──
   Deterministic AI-style insight from feature vector.
   In production: send fv as JSON to Claude API with controlled system prompt.
   Here: generates insight from template + signal combination.                */
function mockLLMInsight(fv) {
  // Template selection matrix — signal priority order
  if (fv.inactive_days >= 3)
    return {
      type:"recovery",
      headline:"Returning after a break",
      insight:`Your behavioral signals show ${fv.inactive_days} quiet days. The engine has softened your goal and reset escalation pressure. A light re-entry outperforms forcing a comeback — your consistency score will rebuild faster with small wins.`,
      dataPoints:[`Consistency: ${fv.consistency_pct}%`, `Recovery resilience: ${fv.recovery_resilience}`, `Suggested approach: micro-wins for 2–3 days`],
    };
  if (fv.burnout_7d_risk > 70)
    return {
      type:"burnout_warning",
      headline:"Stress accumulation detected",
      insight:`Cross-referencing responsiveness trend, engagement depth, and goal pressure — the model flags a ${fv.burnout_7d_risk}% burnout probability in the next 7 days. The engine is already adjusting: goal pressure reduced, escalation capped, tone softened. Rest is not retreat.`,
      dataPoints:[`7-day burnout risk: ${fv.burnout_7d_risk}%`, `Engagement: ${fv.engagement_depth}/100`, `Goal pressure: ${fv.goal_pressure}`],
    };
  if (fv.trend === "rising" && fv.identity_score > 65)
    return {
      type:"momentum",
      headline:"Identity formation in progress",
      insight:`${fv.current_streak}-day streak combined with a consistency rate of ${fv.consistency_pct}% places you in the movement identity formation zone. The behavioral model predicts sustained momentum if goal difficulty stays in the flow zone (65–85% completion probability).`,
      dataPoints:[`Identity score: ${fv.identity_score}/100`, `Streak: ${fv.current_streak} days`, `Flow zone status: ${fv.completion_likelihood >= 65 && fv.completion_likelihood <= 85 ? "✓ On target" : "⚠ Adjusting"}`],
    };
  if (fv.archetype === "burnout_cycler")
    return {
      type:"archetype_warning",
      headline:"Burnout cycle pattern active",
      insight:`Your behavioral DNA shows a classic burst-and-crash cycle. The system has detected ${fv.behavioral_state === "momentum" ? "a momentum spike — a recovery buffer has been pre-staged" : "early fatigue signals — easing the week's load proactively"}. Sustainable > intense.`,
      dataPoints:[`Archetype: Burnout Cycler`, `Current state: ${fv.behavioral_state}`, `Burnout index: ${fv.burnout_index}`],
    };
  if (fv.motivation_style === "data")
    return {
      type:"data_insight",
      headline:"Weekly performance analysis",
      insight:`Responsiveness: ${fv.responsiveness_pct}% (${fv.responsiveness_pct > 65 ? "above" : "below"} average). Completion likelihood: ${fv.completion_likelihood}%. Goal pressure delta: ${fv.goal_pressure}. Based on ${fv.journey_day} days of data, your optimal challenge window is ${fv.completion_likelihood >= 65 && fv.completion_likelihood <= 85 ? "currently aligned" : "being recalibrated"}.`,
      dataPoints:[`Responsiveness: ${fv.responsiveness_pct}%`, `Streak: ${fv.current_streak}d`, `Journey day: ${fv.journey_day}`],
    };
  // Default: identity reinforcement
  return {
    type:"identity",
    headline:"Building your movement identity",
    insight:`Day ${fv.journey_day}. Consistency is ${fv.consistency_pct}% — the engine classifies this as ${fv.behavioral_state}. At this rate, your movement identity score (${fv.identity_score}/100) will cross the next threshold in approximately ${Math.max(1, Math.round((70 - fv.identity_score) / 3))} days of continued engagement.`,
    dataPoints:[`Identity score: ${fv.identity_score}`, `State: ${fv.behavioral_state}`, `Trend: ${fv.trend}`],
  };
}

/* ── Disengagement Probability (48–72h) ──
   Distinct from burnout: focuses on drop-off signals not stress signals.
   Downward responsiveness + latency + completion drop + engagement drift.    */
function calcDisengagementProbability({ responsiveness, compliancePct, engagement,
                                         inactive3, burnout, momentum, streak }) {
  let prob = 0;
  if (responsiveness < 40)   prob += 22;
  else if (responsiveness < 55) prob += 12;
  if (compliancePct < 45)    prob += 20;
  else if (compliancePct < 60) prob += 10;
  if (engagement < 35)       prob += 18;
  else if (engagement < 50)  prob += 8;
  if (inactive3 >= 1)        prob += inactive3 * 10;
  if (burnout > 65)          prob += 15;
  if (momentum < 30)         prob += 12;
  if (streak === 0)          prob += 10;
  const prob48 = Math.max(0, Math.min(100, Math.round(prob * 0.75)));
  const prob72 = Math.max(0, Math.min(100, Math.round(prob)));
  const level = prob72 >= 65 ? "high" : prob72 >= 38 ? "med" : "low";
  const actions48 = prob72 >= 65 ? ["Inject low-pressure micro-task NOW", "Switch mascot to recovery mode", "Soften all reminder copy"] :
                    prob72 >= 38 ? ["Reduce reminder frequency today", "Offer bonus XP for any activity"] :
                    ["Monitor — no action needed"];
  return { prob48, prob72, level, actions48 };
}

/* ── Optimal Notification Window Model ──
   Analyzes response patterns by 6 time blocks → ranks each window.
   In production: built from actual event log timestamps.
   Here: computed from responsiveness, archetype, chronotype signals.         */
const TIME_BLOCKS = [
  { id:"early_morning", label:"Early Morning", time:"6–8 AM",  icon:"🌅" },
  { id:"morning",       label:"Morning",       time:"8–10 AM", icon:"☀️" },
  { id:"midday",        label:"Midday",        time:"11–1 PM", icon:"🌤️" },
  { id:"afternoon",     label:"Afternoon",     time:"2–4 PM",  icon:"⏰" },
  { id:"evening",       label:"Evening",       time:"5–7 PM",  icon:"🌆" },
  { id:"night",         label:"Night",         time:"8–10 PM", icon:"🌙" },
];

function calcOptimalNotificationWindows({ archetype, morningR, afternoonR, responsiveness,
                                           compliancePct, burnout, todayDOW, commitment }) {
  // Base response rate per block from archetype + signal data
  const base = {
    early_morning: archetype === "morning_sprinter" ? 82 : 38,
    morning:       morningR,
    midday:        Math.round((morningR + afternoonR) / 2),
    afternoon:     afternoonR,
    evening:       archetype === "weekend_dropper" && todayDOW === "weekend" ? 70 : 55,
    night:         burnout > 55 ? 20 : 42,
  };
  // Apply responsiveness modifier
  const globalMod = (responsiveness - 50) * 0.3;
  const blocks = TIME_BLOCKS.map(b => {
    const score = Math.max(0, Math.min(100, Math.round(base[b.id] + globalMod)));
    const tier = score >= 68 ? "best" : score >= 48 ? "good" : score >= 28 ? "poor" : "skip";
    const label = tier === "best" ? "Optimal window" : tier === "good" ? "Good window" : tier === "poor" ? "Low response" : "Skip — avoid";
    return { ...b, score, tier, label };
  });
  // Recommend top 2 windows
  const sorted = [...blocks].sort((a,b) => b.score - a.score);
  const recommended = sorted.slice(0,2).map(b => b.id);
  return { blocks, recommended };
}

/* ── Daily Morning Forecast ──
   Predicts energy level + completion outlook for today.                       */
function calcDailyForecast({ compliancePct, burnout, momentum, consistency,
                               todayDOW, arcPhase, dayInJourney, isFatigue }) {
  const isWeekend = todayDOW === "weekend";
  let energyScore = Math.round(
    compliancePct * 0.35 +
    momentum     * 0.25 +
    consistency  * 0.25 +
    (100 - burnout) * 0.15
  );
  if (isWeekend && !isFatigue) energyScore = Math.min(energyScore + 8, 100);
  if (isFatigue) energyScore = Math.max(energyScore - 15, 0);

  const level = energyScore >= 72 ? "high" : energyScore >= 48 ? "medium" : "low";
  const energyBars = Math.round(energyScore / 20); // 0–5 bars

  const forecasts = {
    high: {
      icon: "⚡",
      label: "High-energy day ahead",
      desc: `Your behavioral signals point to strong completion likelihood today. Momentum is ${momentum > 60 ? "active" : "building"}. Consider accepting the micro-challenge if one appears.`,
      color: "#6FCF97",
    },
    medium: {
      icon: "🌤️",
      label: "Medium-energy day",
      desc: `A balanced day expected. ${isWeekend ? "Weekend mode is active — lighter goal, no multiplier loss." : "Reminders timed to your response window."} Stay consistent — that's the only goal.`,
      color: "#FFD83C",
    },
    low: {
      icon: "🌱",
      label: "Low-energy day — light mode",
      desc: `Signals suggest a harder day ahead. ${isFatigue ? "Recovery week is active." : "Burnout index is elevated."} Goal has been softened. Even 5 minutes counts today.`,
      color: "#A9D6F5",
    },
  };
  return { energyScore, energyBars, level, ...forecasts[level] };
}

/* ── 30-day Event Log Builder (simulated) ──
   In production: real event stream from app interactions.
   Here: constructed from current behavioral signals to illustrate structure.  */
function buildEventLog({ consistency, streak, inactive3, burnoutSignals,
                          compliancePct, momentum, dayInJourney }) {
  const events = [];
  const today = dayInJourney;
  // Reconstruct plausible recent event history from signals
  if (streak >= 1) events.push({ day:today,    type:"streak",    label:`Streak extended to ${streak} days`,          color:"#6FCF97", icon:"🔥" });
  if (compliancePct >= 65) events.push({ day:today, type:"goal_met", label:"Daily goal completed",                   color:"#6FCF97", icon:"✓" });
  if (burnoutSignals >= 2) events.push({ day:today-1,type:"signal",  label:"Burnout signal logged",                  color:"#FF7B7B", icon:"⚠️" });
  if (inactive3 >= 1) {
    for (let i=1; i<=Math.min(inactive3,3); i++)
      events.push({ day:today-i, type:"miss", label:"Goal missed — no activity logged",             color:"#FF7B7B", icon:"○" });
  }
  if (momentum > 50) events.push({ day:today-4, type:"momentum",   label:"Momentum phase entered",                  color:"#C9B6F2", icon:"🚀" });
  events.push({ day:today-5,    type:"goal_adj", label:"Goal adjusted by engine (DDS)",              color:"#A9D6F5", icon:"⚙️" });
  events.push({ day:today-7,    type:"calibrate",label:"Weekly calibration loop ran",                color:"#FFD83C", icon:"📊" });
  if (dayInJourney >= 14) events.push({ day:today-14, type:"arc",   label:"Stabilization phase unlocked",           color:"#C9B6F2", icon:"⚖️" });
  if (consistency > 70) events.push({ day:today-10, type:"identity",label:"Movement identity score crossed 60",     color:"#6FCF97", icon:"✦" });
  return events.sort((a,b) => b.day - a.day).slice(0, 10);
}

/* ══════════════════════════ AUTH SYSTEM — PERSISTENT IDENTITY ══════════════ */

/* ── Mock User Database ──
   5 seeded profiles. In production: cloud database lookup via secure API.
   Keys mirror the spec data model: user_id, auth_provider, onboarding_completed,
   onboarding_progress_step, onboarding_version, display_name, behavioral_state.  */
const MOCK_USER_DB = {
  "google_minh_001": {
    user_id: "google_minh_001",
    auth_provider: "google",
    email_hash: "sha256:minh@example.com",
    display_name: "Minh",
    avatar: "M",
    onboarding_completed: true,
    onboarding_progress_step: 6,
    onboarding_version: 2,
    created_at: "2025-09-15",
    last_seen_days_ago: 2,
    streak: 11,
    behavioral_state: { c14:82, streak:11, inactive3:0, responsiveness:74, consecReminders:5, burnoutSignals:0, dayInJourney:47, motivation:"achievement", commitment:"high", weekdayC:85, weekendC:60, baseSteps:8200 },
    mascot_key: "spark",
    xp: 1840,
    identity_level: "Stable Habit",
  },
  "google_linh_002": {
    user_id: "google_linh_002",
    auth_provider: "google",
    email_hash: "sha256:linh@example.com",
    display_name: "Linh",
    avatar: "L",
    onboarding_completed: true,
    onboarding_progress_step: 6,
    onboarding_version: 2,
    created_at: "2025-10-02",
    last_seen_days_ago: 16,
    streak: 0,
    behavioral_state: { c14:55, streak:0, inactive3:3, responsiveness:42, consecReminders:1, burnoutSignals:2, dayInJourney:29, motivation:"gentle", commitment:"balanced", weekdayC:58, weekendC:30, baseSteps:6500 },
    mascot_key: "mellow",
    xp: 620,
    identity_level: "Developing Habit",
  },
  "apple_nam_003": {
    user_id: "apple_nam_003",
    auth_provider: "apple",
    email_hash: "sha256:nam@example.com",
    display_name: "Nam",
    avatar: "N",
    onboarding_completed: false,
    onboarding_progress_step: 3,
    onboarding_version: 2,
    created_at: "2025-11-20",
    last_seen_days_ago: 1,
    streak: 2,
    behavioral_state: null,
    mascot_key: null,
    xp: 0,
  },
  "email_an_004": {
    user_id: "email_an_004",
    auth_provider: "email",
    email_hash: "sha256:an@example.com",
    display_name: "An",
    avatar: "A",
    onboarding_completed: true,
    onboarding_progress_step: 6,
    onboarding_version: 1,   // ← old version → will trigger new module in future
    created_at: "2025-07-10",
    last_seen_days_ago: 0,
    streak: 34,
    behavioral_state: { c14:91, streak:34, inactive3:0, responsiveness:88, consecReminders:7, burnoutSignals:0, dayInJourney:134, motivation:"competitive", commitment:"high", weekdayC:95, weekendC:78, baseSteps:10200 },
    mascot_key: "blaze",
    xp: 3820,
    identity_level: "Movement Identity ✦",
  },
};

const REQUIRED_ONBOARDING_VERSION = 2;

/* ── Authentication Logic ──
   Simulates provider OAuth. In production: redirect to provider → receive token.
   Returns { success, user|null, isNewUser }                                   */
function mockAuthenticate(provider, emailInput="") {
  // Simulate provider result → match to mock DB
  const providerMap = {
    google: ["google_minh_001", "google_linh_002"][Math.round(Math.random())],
    apple:  "apple_nam_003",
    email:  emailInput.toLowerCase().includes("an") ? "email_an_004"
          : emailInput.toLowerCase().includes("minh") ? "google_minh_001" : null,
  };

  const userId = providerMap[provider];
  const user   = userId ? MOCK_USER_DB[userId] : null;

  if (!user) {
    // New user — create skeleton
    return {
      success:   true,
      isNewUser: true,
      user: {
        user_id:                  `${provider}_new_${Date.now()}`,
        auth_provider:            provider,
        display_name:             emailInput.split("@")[0] || "New User",
        avatar:                   (emailInput[0]||"U").toUpperCase(),
        onboarding_completed:     false,
        onboarding_progress_step: 0,
        onboarding_version:       0,
        behavioral_state:         null,
        mascot_key:               null,
        xp:                       0,
      },
    };
  }
  return { success:true, isNewUser:false, user };
}

/* ── Route Resolution ──
   Given auth result → decide where to send the user.
   Returns "home" | "resume" | "continue"                                      */
function resolveAuthRoute(user) {
  if (!user.onboarding_completed) return "resume";
  if (user.onboarding_version < REQUIRED_ONBOARDING_VERSION) return "resume"; // future-proofing
  return "home";
}

/* ══════════════════════════ STAGE 7: SELF-LEARNING + MICRO-DECISION + A/B ══ */

/* ─────────────────────────────────────────────────────────────────────────────
   7A. SELF-LEARNING INTERVENTION WEIGHTING
   Tracks which interventions work for this user.
   Weight > 1.0 = working well → select more often
   Weight < 1.0 = backfiring → deprioritize
   Decay: each session, weights drift 3% toward 1.0 (neutral)
   ───────────────────────────────────────────────────────────────────────────── */

const INTERVENTION_TYPES = [
  { id:"micro_challenge",    label:"Micro-Challenge Injection",  icon:"⚡", desc:"Boost challenge when stable" },
  { id:"goal_reduction",     label:"Goal Reduction",             icon:"↓",  desc:"Ease pressure proactively" },
  { id:"goal_increase",      label:"Goal Increase",              icon:"↑",  desc:"Raise challenge in flow" },
  { id:"escalation_l3",      label:"Commitment Trigger (L3)",    icon:"🔥", desc:"High-pressure reminder" },
  { id:"calm_tone",          label:"Calm Tone Override",         icon:"🌤️", desc:"Soften all copy + mascot" },
  { id:"recovery_mode",      label:"Recovery Mode",              icon:"🛡️", desc:"Full protective protocol" },
  { id:"memory_recall",      label:"Emotional Memory Recall",    icon:"💭", desc:"Surface past achievements" },
  { id:"identity_message",   label:"Identity Reinforcement",     icon:"✦",  desc:"Identity-based copy" },
  { id:"micro_task",         label:"Micro-Task Injection",       icon:"🌱", desc:"Tiny win when disengaged" },
];

/* Initial weights — all neutral (1.0).
   In production: persisted per user in backend. Here: useState in App.       */
const INITIAL_WEIGHTS = Object.fromEntries(
  INTERVENTION_TYPES.map(t => [t.id, 1.0])
);

/* Update weight from observed outcome.
   outcome: "positive" | "negative" | "neutral"
   Returns new weight table (immutable update).                                */
function updateInterventionWeight(weights, interventionId, outcome) {
  const LEARN_RATE = 0.12;
  const DECAY      = 0.03;   // all weights drift toward 1.0 each session
  const updated = { ...weights };

  // Apply decay to all
  Object.keys(updated).forEach(k => {
    updated[k] = parseFloat((updated[k] + (1.0 - updated[k]) * DECAY).toFixed(3));
  });
  // Apply reinforcement to targeted intervention
  if (interventionId && updated[interventionId] !== undefined) {
    const delta = outcome === "positive" ? LEARN_RATE : outcome === "negative" ? -LEARN_RATE * 1.3 : 0;
    updated[interventionId] = parseFloat(
      Math.max(0.1, Math.min(2.5, updated[interventionId] + delta)).toFixed(3)
    );
  }
  return updated;
}

/* Select best intervention using weighted probability.
   Returns the highest-weight eligible intervention for current Standly AI state.     */
function selectWeightedIntervention({ weights, bis }) {
  const eligible = INTERVENTION_TYPES.filter(t => {
    // Filter by context eligibility
    if (t.id === "escalation_l3" && (bis.burnout > 55 || bis.bisState === "burnout")) return false;
    if (t.id === "goal_increase"  && (bis.recoveryMode || bis.overtraining)) return false;
    if (t.id === "micro_challenge"&& bis.microChallenge === null) return false;
    if (t.id === "calm_tone"      && bis.burnout < 40) return false;
    return true;
  });
  if (eligible.length === 0) return null;
  // Softmax-style: pick highest weight from eligible
  const sorted = [...eligible].sort((a,b) => (weights[b.id]??1) - (weights[a.id]??1));
  return { ...sorted[0], weight: weights[sorted[0].id] ?? 1.0 };
}

/* ─────────────────────────────────────────────────────────────────────────────
   7B. MICRO-DECISION AI LAYER
   6 binary/ternary decisions computed from full Standly AI context.
   Each: output + confidence (0–100) + reasoning string.
   ───────────────────────────────────────────────────────────────────────────── */
function calcMicroDecisions({ bis, controls }) {
  const { stabilityScore, burnout, disengagement, compliancePct, responsiveness,
          engagement, microChallenge, flowZone, overtraining, recoveryMode,
          riskLevel7d, dailyForecast, bisState, adaptiveDelta } = bis;

  // 1. Challenge injection
  const challengeInject = (() => {
    if (!microChallenge) return { output:"no", conf:95, reason:"Stability or burnout threshold not met." };
    if (burnout > 50)    return { output:"no", conf:82, reason:"Burnout elevated — suppressing boost." };
    if (compliancePct < 60) return { output:"no", conf:78, reason:"Completion risk too high to add load." };
    return { output:"yes", conf:Math.min(90, stabilityScore), reason:"Stability strong + burnout safe. Injecting." };
  })();

  // 2. Goal increase suppression
  const goalSuppression = (() => {
    if (overtraining)      return { output:"yes", conf:92, reason:"Overtraining detected — holding despite delta." };
    if (burnout > 65)      return { output:"yes", conf:88, reason:"Burnout threshold — no increase allowed." };
    if (disengagement.level === "high") return { output:"yes", conf:85, reason:"Disengagement risk — suppressing pressure." };
    if (adaptiveDelta > 0 && flowZone === "flow") return { output:"no", conf:76, reason:"Delta positive + in flow zone — allowing." };
    return { output:"hold", conf:60, reason:"Neutral signals — maintaining current goal." };
  })();

  // 3. Auto-explanation trigger
  const autoExplain = (() => {
    const recent = bis.goalAdj.action !== "hold";
    if (recent && Math.abs(bis.goalAdj.pctChange) > 5) return { output:"yes", conf:88, reason:"Significant goal change — explanation surfaced." };
    if (riskLevel7d.id === "elevated" || riskLevel7d.id === "critical") return { output:"yes", conf:82, reason:"Elevated burnout risk — transparency trigger." };
    return { output:"no", conf:70, reason:"No significant change — keeping UI clean." };
  })();

  // 4. Celebration intensity
  const celebrationIntensity = (() => {
    if (burnout > 65 || recoveryMode) return { output:"reduced", conf:90, reason:"Recovery mode — subtle celebration only." };
    if (bisState === "momentum" && stabilityScore > 65) return { output:"full", conf:88, reason:"Momentum phase — maximum dopamine loop." };
    if (disengagement.level === "high") return { output:"reduced", conf:80, reason:"Risk of overwhelming fatigued user." };
    return { output:"full", conf:72, reason:"Standard completion — full celebration." };
  })();

  // 5. Mascot behavior override
  const mascotOverride = (() => {
    if (recoveryMode || burnout > 70) return { output:"concern", conf:94, reason:"Recovery active — compassionate expression." };
    if (bisState === "momentum" && stabilityScore > 70) return { output:"glowing", conf:89, reason:"Momentum peak — amplifying energy." };
    if (disengagement.level === "high") return { output:"tired", conf:83, reason:"Drop-off risk — empathetic tired state." };
    if (dailyForecast.level === "high") return { output:"energized", conf:78, reason:"High-energy forecast — matching mascot." };
    return { output:"default", conf:65, reason:"Standard Standly AI-driven mood logic applies." };
  })();

  // 6. Reminder frequency modifier
  const reminderFreq = (() => {
    if (recoveryMode || burnout > 65) return { output:"reduced", conf:92, reason:"Burnout protective — 50% fewer reminders." };
    if (responsiveness < 38) return { output:"reduced", conf:84, reason:"Low responsiveness — avoid reminder fatigue." };
    if (bisState === "momentum" && compliancePct > 70) return { output:"hold", conf:75, reason:"User in momentum — don't over-nudge." };
    if (disengagement.level === "high") return { output:"reduced", conf:80, reason:"Drop-off signal — reduce reminder pressure." };
    return { output:"hold", conf:68, reason:"Standard frequency — no modifier needed." };
  })();

  return [
    { id:"challenge_inject",  label:"Challenge Injection",     icon:"⚡", bg:"rgba(255,216,60,0.12)",  ...challengeInject },
    { id:"goal_suppression",  label:"Goal Suppression",        icon:"🛡️", bg:"rgba(169,214,245,0.1)",  ...goalSuppression },
    { id:"auto_explain",      label:"Auto-Explanation",        icon:"💡", bg:"rgba(201,182,242,0.1)",  ...autoExplain },
    { id:"celebration",       label:"Celebration Intensity",   icon:"🎉", bg:"rgba(246,183,216,0.1)",  ...celebrationIntensity },
    { id:"mascot_override",   label:"Mascot Behavior",         icon:"🐣", bg:"rgba(255,255,255,0.07)", ...mascotOverride },
    { id:"reminder_freq",     label:"Reminder Frequency",      icon:"🔔", bg:"rgba(255,173,71,0.1)",   ...reminderFreq },
  ];
}

/* ─────────────────────────────────────────────────────────────────────────────
   7C. A/B TESTING + EVALUATION METRICS
   Simulates 3 live experiments. Each has variant A (control) vs B (test),
   a metric being tracked, and a result after N days.
   ───────────────────────────────────────────────────────────────────────────── */
const AB_EXPERIMENTS = [
  {
    id:"tone_style",
    name:"Tone Style Test",
    hypothesis:"Identity-based copy increases streak length vs. task-based copy.",
    variantA:{ label:"Task-Based",    desc:"'You completed 8,000 steps.'" },
    variantB:{ label:"Identity-Based",desc:"'You're becoming someone who moves daily.'" },
    metric:"avg_streak_length",
    metricLabel:"Avg Streak Length",
    daysRunning:14,
    resultA:4.2,
    resultB:6.8,
    unit:"days",
    winner:"B",
  },
  {
    id:"escalation_cap",
    name:"Escalation Level Cap",
    hypothesis:"Capping escalation at Level 2 reduces burnout spike frequency.",
    variantA:{ label:"Full Escalation",  desc:"Levels 1, 2, 3 all active" },
    variantB:{ label:"Capped at L2",     desc:"Level 3 trigger disabled" },
    metric:"burnout_spike_freq",
    metricLabel:"Burnout Spikes / Week",
    daysRunning:21,
    resultA:1.8,
    resultB:0.9,
    unit:"x/week",
    winner:"B",
  },
  {
    id:"micro_challenge_timing",
    name:"Micro-Challenge Timing",
    hypothesis:"Injecting challenges on Day 3 of streak outperforms Day 1.",
    variantA:{ label:"Day 1 Inject",  desc:"Challenge shown immediately after goal set" },
    variantB:{ label:"Day 3 Inject",  desc:"Challenge held until streak day 3+" },
    metric:"challenge_accept_rate",
    metricLabel:"Challenge Accept Rate",
    daysRunning:10,
    resultA:31,
    resultB:58,
    unit:"%",
    winner:"B",
  },
];

/* Evaluation Metrics — computed from current Standly AI state + simulated 30d window */
function calcEvaluationMetrics({ bis, controls }) {
  const { consistency, burnout, compliancePct, recoveryResilience,
          burnoutTrajectory, weeklyCalib } = bis;

  // 30-day retention proxy: function of consistency + resilience + non-churn
  const retention30d = Math.min(98, Math.round(
    consistency * 0.45 + recoveryResilience * 0.3 + compliancePct * 0.25
  ));

  // Completion stability variance (lower = better — more consistent)
  const completionVariance = Math.max(0, Math.round(
    25 - consistency * 0.18 - recoveryResilience * 0.07
  ));

  // Burnout spike frequency per 30 days
  const burnoutSpikes = burnout > 70 ? 3 : burnout > 55 ? 1.5 : burnout > 35 ? 0.8 : 0.2;

  // Recovery success rate — how often recovery mode leads back to momentum
  const recoverySuccessRate = Math.min(95, Math.round(recoveryResilience * 0.85 + consistency * 0.15));

  // Avg goal delta per week (positive = growth trend)
  const avgGoalDelta = bis.adaptiveDelta > 0
    ? parseFloat((bis.adaptiveDelta * 0.4).toFixed(1))
    : parseFloat((bis.adaptiveDelta * 0.2).toFixed(1));

  // Streak longevity growth vs. Day 0
  const streakGrowth = controls.streak > 0
    ? `+${Math.round(controls.streak * 18)}%`
    : "0%";

  return [
    { label:"30-Day Retention",         value:`${retention30d}%`,            delta:retention30d-72, unit:"vs baseline 72%", good: retention30d >= 72 },
    { label:"Completion Variance",       value:`σ ${completionVariance}%`,    delta:-completionVariance, unit:"lower = more stable", good: completionVariance <= 12 },
    { label:"Burnout Spikes / 30d",      value:`${burnoutSpikes}x`,           delta:burnoutSpikes <= 1 ? -1 : 1, unit:"target < 1", good: burnoutSpikes <= 1 },
    { label:"Recovery Success Rate",     value:`${recoverySuccessRate}%`,     delta:recoverySuccessRate-60, unit:"vs baseline 60%", good: recoverySuccessRate >= 60 },
    { label:"Avg Goal Delta / Week",     value:`${avgGoalDelta > 0?"+":""}${avgGoalDelta}%`, delta:avgGoalDelta, unit:"positive = growing", good: avgGoalDelta >= 0 },
    { label:"Streak Longevity Growth",   value:streakGrowth,                 delta:controls.streak, unit:"since Day 1", good: controls.streak > 2 },
  ];
}

/* ══════════════════════════ SVG COMPONENTS ════════════════════════════════ */
function StepRing({ pct=0.72, steps, goal }) {
  const r=56, cx=66, cy=66, circ=2*Math.PI*r;
  return (
    <svg width="132" height="132" viewBox="0 0 132 132">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#rg)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ*(1-Math.min(pct,1))}
        transform="rotate(-90 66 66)" style={{transition:"stroke-dashoffset 1.2s ease"}}/>
      <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F6B7D8"/><stop offset="100%" stopColor="#A9D6F5"/>
      </linearGradient></defs>
      <text x="66" y="60" textAnchor="middle" fontFamily="DM Serif Display,serif" fontSize="20" fill="white">{steps?.toLocaleString()}</text>
      <text x="66" y="76" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.5)">of {goal?.toLocaleString()}</text>
      <text x="66" y="90" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="9" fontWeight="500" fill="rgba(255,255,255,0.38)">STEPS</text>
    </svg>
  );
}
function CDRing({ secs, total }) {
  const r=66, cx=78, cy=78, circ=2*Math.PI*r;
  const mm=String(Math.floor(secs/60)).padStart(2,"0"), ss=String(secs%60).padStart(2,"0");
  return (
    <svg width="156" height="156" viewBox="0 0 156 156" style={{transform:"rotate(-90deg)"}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#cdg)" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ*(1-secs/total)} style={{transition:"stroke-dashoffset 1s linear"}}/>
      <defs><linearGradient id="cdg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F6B7D8"/><stop offset="100%" stopColor="#C9B6F2"/>
      </linearGradient></defs>
      <text x="78" y="73" textAnchor="middle" fontFamily="DM Serif Display,serif" fontSize="28" fill="white" style={{transform:"rotate(90deg)",transformOrigin:"78px 78px"}}>{mm}:{ss}</text>
      <text x="78" y="90" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.45)" style={{transform:"rotate(90deg)",transformOrigin:"78px 78px"}}>remaining</text>
    </svg>
  );
}
function HSIArc({ value=62 }) {
  const r=50, cx=80, cy=80, circ=Math.PI*r;
  const col = value>=85?"#FFD83C":value>=70?"#6FCF97":value>=40?"#C9B6F2":"#A9D6F5";
  const label = HSI_LABELS.find(([t])=>value>=t)?.[1]??"Early Stage";
  return (
    <svg width="160" height="90" viewBox="0 0 160 90">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ*(1-value/100)} style={{transition:"stroke-dashoffset 1s ease"}}/>
      <text x="80" y="70" textAnchor="middle" fontFamily="DM Serif Display,serif" fontSize="28" fill="white">{value}</text>
      <text x="80" y="86" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="10" fontWeight="700" fill={col}>{label}</text>
    </svg>
  );
}
function ComplianceArc({ pct=65 }) {
  const r=38, cx=50, cy=50, circ=Math.PI*r;
  const col = pct>=68?"#6FCF97":pct>=45?"#FFD83C":"#FF7B7B";
  return (
    <svg width="100" height="56" viewBox="0 0 100 56">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} style={{transition:"stroke-dashoffset 0.8s ease"}}/>
      <text x="50" y="44" textAnchor="middle" fontFamily="DM Serif Display,serif" fontSize="18" fill="white">{pct}%</text>
    </svg>
  );
}

/* ══════════════════════════ CELEBRATION OVERLAY ═══════════════════════════ */
const CONFETTI = Array.from({length:16},(_,i)=>({
  id:i, x:20+(i*5)%65, color:["#F6B7D8","#C9B6F2","#A9D6F5","#FFD83C","#6FCF97"][i%5],
  size:5+(i%3)*3, delay:(i*0.07).toFixed(2), dur:(0.55+(i%4)*0.12).toFixed(2),
}));
function CelebrationOverlay({ phrase, onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,1300); return()=>clearTimeout(t); },[onDone]);
  return (
    <div className="celebrate-overlay">
      <div className="celebrate-ring"/>
      <div className="celebrate-ring celebrate-ring2"/>
      <div className="celebrate-msg">{phrase}</div>
      {CONFETTI.map(c=>(
        <div key={c.id} className="confetti-dot" style={{
          left:`${c.x}%`, top:"35%", width:c.size, height:c.size,
          background:c.color, animationDelay:`${c.delay}s`, animationDuration:`${c.dur}s`,
        }}/>
      ))}
    </div>
  );
}

/* ══════════════════════════ SPEECH BUBBLE ══════════════════════════════════ */
function SpeechBubble({ dialogue }) {
  return (
    <div className="speech-bubble">
      <div className="speech-main">{dialogue.main}</div>
      {dialogue.sub && <div className="speech-sub">{dialogue.sub}</div>}
    </div>
  );
}

/* ══════════════════════════ TODAY INTENT PROMPT ════════════════════════════ */
const INTENTS = [
  { id:"energized",  icon:"⚡", label:"Energized",    sub:"Push today. High energy." },
  { id:"focused",    icon:"🎯", label:"Focused",       sub:"Move smart. Protect flow." },
  { id:"calm",       icon:"🌿", label:"Calm",          sub:"Gentle day. No pressure." },
  { id:"consistent", icon:"🔄", label:"Just consistent", sub:"Show up. That's it." },
];
function IntentPrompt({ onSelect }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="intent-screen">
      <div>
        <div className="label" style={{textAlign:"center",marginBottom:6}}>Good morning ✦</div>
        <h2 className="display" style={{textAlign:"center",fontSize:24,marginBottom:6}}>How do you want to <em>feel today?</em></h2>
        <p className="body" style={{textAlign:"center",fontSize:12,marginBottom:16}}>This shapes your reminders and tone.</p>
      </div>
      {INTENTS.map(it=>(
        <div key={it.id} className={`intent-chip${sel===it.id?" sel":""}`} onClick={()=>setSel(it.id)}>
          <span style={{fontSize:24}}>{it.icon}</span>
          <div>
            <div style={{fontWeight:700}}>{it.label}</div>
            <div style={{fontSize:11,opacity:0.65,fontWeight:400,marginTop:1}}>{it.sub}</div>
          </div>
        </div>
      ))}
      <button className="btn" onClick={()=>onSelect(sel??"consistent")} disabled={!sel} style={{marginTop:4}}>
        Set my intention →
      </button>
    </div>
  );
}

/* ══════════════════════════ JOURNEY TAB ════════════════════════════════════ */
function JourneyTab({ charKey, bis, controls }) {
  const milestones = buildJourneyMilestones(controls.dayInJourney, bis.consistency, charKey);
  const mi = bis.miLevel;

  return (
    <div className="screen scrollable">
      <div className="label">Your story</div>
      <h2 className="display" style={{marginBottom:4,fontSize:24}}>The <em>Journey</em></h2>
      <p className="body" style={{marginBottom:14,fontSize:12}}>Day {controls.dayInJourney} of transformation.</p>

      {/* Identity Level card */}
      <div className="card" style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,background:`rgba(255,255,255,0.16)`,borderColor:`rgba(246,183,216,0.4)`}}>
        <span style={{fontSize:28}}>{mi.icon}</span>
        <div style={{flex:1}}>
          <div className="label" style={{marginBottom:1}}>Current identity</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#fff"}}>{mi.label}</div>
          <div style={{marginTop:5}}>
            <div className="g-track"><div className="g-fill" style={{width:`${bis.miScore}%`,background:mi.color}}/></div>
          </div>
        </div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:30,color:"#fff"}}>{bis.miScore}</div>
      </div>

      {/* Milestone timeline */}
      {milestones.map((m,i)=>(
        <div key={m.week} className={`journey-milestone ${m.status}`} style={{position:"relative"}}>
          {i < milestones.length-1 && <div className="journey-line"/>}
          <div className={`journey-dot ${m.status}`}>{m.status==="done"?"✓":m.icon}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:3}}>
              <span style={{fontSize:13,fontWeight:700,color:m.status==="active"?"#fff":"rgba(255,255,255,0.75)"}}>{m.label}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:500}}>{m.days}</span>
              {m.status==="active"&&<span className="badge rose" style={{fontSize:9,padding:"2px 7px"}}>Now</span>}
              {m.status==="done"&&<span style={{fontSize:10,color:"#6FCF97",fontWeight:700}}>✓ Complete</span>}
            </div>
            {m.status!=="future"&&<p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.5}}>{m.desc}</p>}
            {/* Show evolving mascot at each achieved milestone */}
            {m.status==="done"&&(
              <div style={{marginTop:7,display:"flex",alignItems:"center",gap:8}}>
                <Mascot charKey={charKey} mood={m.week<=2?"neutral":m.week===3?"encouraging":"happy"} size={36} evolution={Math.min(m.week-1,4)}/>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:500,fontStyle:"italic"}}>
                  {["","Stage 1 — foundation form","Stage 2 — glow emerged","Stage 3 — aura unlocked","Stage 4 — accessory evolved"][m.week]??"Fully evolved"}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 90-day unlock teaser */}
      <div className="card" style={{marginTop:4,background:"rgba(255,220,60,0.1)",borderColor:"rgba(255,220,60,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🏅</span>
          <div>
            <div style={{fontWeight:700,color:"#FFD83C",fontSize:13}}>90-Day Transformation Report</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>
              At Day 90: deep narrative report, Transformation Badge unlock, full identity confirmation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ MICRO CHALLENGE CARD ═══════════════════════════ */
function MicroChallengeCard({ challenge, archetype, onAccept }) {
  const arch = ARCHETYPES[archetype];
  return (
    <div className="micro-challenge">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:20}}>⚡</span>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:"#FFD83C",textTransform:"uppercase",letterSpacing:"0.1em"}}>Boost Challenge</div>
            <div style={{fontSize:14,fontWeight:700,color:"#fff",marginTop:1}}>{challenge.label}</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#FFD83C",lineHeight:1}}>+{challenge.boost.toLocaleString()}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontWeight:600}}>EXTRA STEPS</div>
        </div>
      </div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginBottom:9,lineHeight:1.5}}>{challenge.desc} {arch.icon}</p>
      <div style={{display:"flex",gap:8}}>
        <button className="btn-sm" style={{flex:1,padding:"8px 0",fontSize:12}} onClick={onAccept}>Accept +100 XP</button>
        <button onClick={()=>{}} style={{padding:"8px 12px",borderRadius:12,border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.55)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Skip</button>
      </div>
    </div>
  );
}

/* ══════════════════════════ FLOW ZONE GAUGE ════════════════════════════════ */
function FlowZoneGauge({ compliancePct, flowZone }) {
  const col = flowZone==="flow"?"#6FCF97":flowZone==="too_easy"?"#FFD83C":"#FF7B7B";
  const label = flowZone==="flow"?"In Flow Zone ✓":flowZone==="too_easy"?"Too Easy — raising":  "Too Hard — reducing";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center"}}>
        <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>Flow Zone (65–85%)</span>
        <span style={{fontSize:11,fontWeight:700,color:col}}>{label}</span>
      </div>
      <div className="flow-bar" style={{marginBottom:22}}>
        {/* Green zone band: 65–85% of bar width */}
        <div className="flow-zone" style={{left:"65%",width:"20%"}}/>
        {/* Zone labels */}
        <span className="flow-label" style={{left:0}}>0%</span>
        <span className="flow-label" style={{left:"62%"}}>65</span>
        <span className="flow-label" style={{left:"83%"}}>85</span>
        <span className="flow-label" style={{right:0}}>100%</span>
        {/* Current position cursor */}
        <div className="flow-cursor" style={{left:`calc(${Math.min(compliancePct,100)}% - 1.5px)`, background:col}}/>
      </div>
    </div>
  );
}

/* ══════════════════════════ GOAL ENGINE PANEL ══════════════════════════════ */
function GoalEnginePanel({ bis, controls, adapted }) {
  const adj   = bis.goalAdj;
  const calib = bis.weeklyCalib;

  // Simulated 7-day completion sparkline data
  const sparkData = [72,65,88,100,78,55,Math.round(bis.compliancePct)];

  const actionColor = adj.action==="increase"?"#6FCF97":adj.action==="decrease"?"#FF7B7B":adj.action==="recovery"?"#A9D6F5":adj.action==="overtrain"?"#FFD83C":"rgba(255,255,255,0.5)";
  const deltaSign   = bis.adaptiveDelta > 0 ? "+" : "";

  return (
    <div>
      {/* Header scores */}
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {[
          { label:"Stability",  val:bis.stabilityScore, color:"#6FCF97" },
          { label:"Risk",       val:bis.riskModifier,   color:"#FF7B7B" },
          { label:"Delta",      val:`${deltaSign}${bis.adaptiveDelta}`, color:bis.adaptiveDelta>0?"#6FCF97":bis.adaptiveDelta<0?"#FF7B7B":"rgba(255,255,255,0.5)", raw:true },
        ].map(({label,val,color,raw})=>(
          <div key={label} className="card" style={{flex:1,textAlign:"center",padding:"10px 6px",marginBottom:0}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color,lineHeight:1}}>{raw?val:`${val}`}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.45)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:3}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Flow Zone */}
      <div className="card" style={{marginBottom:9}}>
        <div className="label" style={{marginBottom:8}}>Dynamic Difficulty Scaling</div>
        <FlowZoneGauge compliancePct={bis.compliancePct} flowZone={bis.flowZone}/>

        {/* 7-day sparkline */}
        <div className="label" style={{marginBottom:5}}>7-day completion</div>
        <div className="sparkline">
          {sparkData.map((v,i)=>(
            <div key={i} className={`spark-bar${i===sparkData.length-1?" today":v>85?" over":""}`}
              style={{height:`${v*0.28}px`,flex:1}}/>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:3,fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600}}>
          <span>Mon</span><span>Today</span>
        </div>
      </div>

      {/* Goal adjustment decision */}
      <div className="card" style={{marginBottom:9,background:adj.action==="recovery"?"rgba(169,214,245,0.1)":adj.action==="increase"?"rgba(111,207,151,0.08)":"rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div className="label" style={{marginBottom:0}}>Today's Goal Decision</div>
          <span className={`delta-pill ${adj.action==="increase"?"up":adj.action==="decrease"||adj.action==="recovery"?"down":"hold"}`}>
            {adj.action==="increase"?`▲ +${adj.pctChange}%`:adj.action==="decrease"||adj.action==="recovery"?`▼ ${adj.pctChange}%`:"— Hold"}
          </span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:28,color:"#fff",lineHeight:1}}>{(bis.goalAdj.adjustedSteps).toLocaleString()}</div>
          {adj.pctChange!==0&&<div style={{fontSize:11,color:"rgba(255,255,255,0.45)",fontWeight:500,textDecoration:"line-through"}}>was {(controls.baseSteps??7000).toLocaleString()}</div>}
        </div>
        <p style={{fontSize:12,fontWeight:700,color:actionColor,marginBottom:3}}>{adj.identityMsg}</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.5}}>{adj.reason}</p>

        {/* Flags */}
        {bis.overtraining&&(
          <div style={{marginTop:8,padding:"6px 10px",borderRadius:12,background:"rgba(255,216,60,0.12)",border:"1px solid rgba(255,216,60,0.3)"}}>
            <span style={{fontSize:11,color:"#FFD83C",fontWeight:700}}>⚠️ Overtraining detected — goal held despite high completion</span>
          </div>
        )}
        {bis.recoveryMode&&(
          <div style={{marginTop:8,padding:"6px 10px",borderRadius:12,background:"rgba(169,214,245,0.12)",border:"1px solid rgba(169,214,245,0.3)"}}>
            <span style={{fontSize:11,color:"#A9D6F5",fontWeight:700}}>🌤️ Recovery mode — goal -15%, escalation disabled</span>
          </div>
        )}
      </div>

      {/* Weekly Calibration */}
      <div className="card" style={{marginBottom:9}}>
        <div className="label" style={{marginBottom:8}}>Weekly Calibration Loop</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <span style={{fontSize:22}}>{calib.icon}</span>
          <div>
            <div style={{fontWeight:700,color:calib.color,fontSize:13}}>{calib.label}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{calib.note}</div>
          </div>
        </div>
        {[
          ["Completion in flow zone", calib.inFlowZone?"✓ Yes":"✗ No", calib.inFlowZone?"#6FCF97":"#FF7B7B"],
          ["Burnout stable",          calib.burnoutStable?"✓ Yes":"✗ No", calib.burnoutStable?"#6FCF97":"#FF7B7B"],
          ["Base increase approved",  calib.baseIncrease>0?`+${calib.baseIncrease}%`:"None", calib.baseIncrease>0?"#6FCF97":"rgba(255,255,255,0.4)"],
        ].map(([k,v,c])=>(
          <div key={k} className="cal-row">
            <span style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:600,flex:1}}>{k}</span>
            <strong style={{fontSize:11,color:c}}>{v}</strong>
          </div>
        ))}
      </div>

      {/* Guardrails reminder */}
      <div className="card" style={{background:"rgba(255,255,255,0.06)"}}>
        <div className="label" style={{marginBottom:7}}>Engine Guardrails</div>
        {[
          ["Max daily adjustment","±12%"],
          ["Miss → auto-reduce","Never"],
          ["Single fail penalty","None"],
          ["Sensitivity factor", controls.dayInJourney<8?"0.05":controls.dayInJourney<21?"0.09":"0.13"],
        ].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5,color:"rgba(255,255,255,0.6)",fontWeight:600}}>
            <span>{k}</span><strong style={{color:"#fff"}}>{v}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════ BURNOUT FORECAST STRIP (Dashboard) ════════════ */
function BurnoutForecastStrip({ bis }) {
  const r3 = bis.riskLevel3d;
  const r7 = bis.riskLevel7d;
  const traj = bis.burnoutTrajectory;
  const trajIcon = traj.direction==="rising"?"↑":traj.direction==="falling"?"↓":"→";
  const stripCls = r7.id==="critical"||r7.id==="burnout" ? "crit" : r7.id==="elevated"||r7.id==="watch" ? "warn" : "";

  return (
    <div className={`burnout-strip${stripCls?" "+stripCls:""}`}>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
          <span style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(255,255,255,0.5)"}}>Burnout Forecast</span>
          <span style={{fontSize:11,fontWeight:700,color:traj.direction==="rising"?"#FF7B7B":traj.direction==="falling"?"#6FCF97":"rgba(255,255,255,0.5)"}}>
            {trajIcon} {traj.direction}
          </span>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontWeight:600,textTransform:"uppercase"}}>3-Day</div>
            <span className={`risk-pill ${r3.cls}`} style={{fontSize:10,padding:"3px 9px"}}>{r3.icon} {r3.label} · {bis.burnoutForecast.day3}%</span>
          </div>
          <div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontWeight:600,textTransform:"uppercase"}}>7-Day</div>
            <span className={`risk-pill ${r7.cls}`} style={{fontSize:10,padding:"3px 9px"}}>{r7.icon} {r7.label} · {bis.burnoutForecast.day7}%</span>
          </div>
        </div>
      </div>
      {/* Tiny 7-day trajectory sparkline */}
      <div style={{display:"flex",alignItems:"flex-end",gap:2,height:28,flexShrink:0}}>
        {bis.burnoutTrajectory.series.map((v,i)=>(
          <div key={i} style={{
            width:6, borderRadius:"3px 3px 0 0",
            height:`${(v/100)*28}px`,
            background: v>70?"#FF7B7B":v>55?"#FFB347":v>30?"#FFD83C":"#6FCF97",
            opacity: i===6?1:0.55+i*0.05,
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════ RESILIENCE ARC SVG ════════════════════════════ */
function ResilienceArc({ value=62 }) {
  const r=34, cx=43, cy=43, circ=Math.PI*r;
  const col = value>=70?"#6FCF97":value>=45?"#FFD83C":"#FF7B7B";
  return (
    <svg width="86" height="48" viewBox="0 0 86 48">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ*(1-value/100)} style={{transition:"stroke-dashoffset 0.9s ease"}}/>
      <text x="43" y="40" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="13" fontWeight="800" fill="white">{value}</text>
    </svg>
  );
}

/* ══════════════════════════ BURNOUT PREDICTION PANEL ══════════════════════ */
function BurnoutPredictionPanel({ bis, controls }) {
  const r3     = bis.riskLevel3d;
  const r7     = bis.riskLevel7d;
  const traj   = bis.burnoutTrajectory;
  const interv = bis.intervention;
  const trajIcon = traj.direction==="rising"?"↑ Rising":traj.direction==="falling"?"↓ Falling":"→ Stable";
  const trajCol  = traj.direction==="rising"?"#FF7B7B":traj.direction==="falling"?"#6FCF97":"rgba(255,255,255,0.55)";
  const maxTraj  = Math.max(...traj.series, 1);

  return (
    <div>
      {/* Probability header — 3d / 7d */}
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {[{label:"3-Day Risk", prob:bis.burnoutForecast.day3, rl:r3},
          {label:"7-Day Risk", prob:bis.burnoutForecast.day7, rl:r7},
          {label:"Resilience", prob:bis.recoveryResilience, rl:null, isRes:true}
        ].map(({label,prob,rl,isRes})=>(
          <div key={label} className="card" style={{flex:1,textAlign:"center",padding:"11px 6px",marginBottom:0}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:isRes?"#6FCF97":rl?.color??"#fff",lineHeight:1}}>{prob}%</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:3}}>{label}</div>
            {!isRes&&rl&&<span className={`risk-pill ${rl.cls}`} style={{fontSize:9,padding:"2px 7px",marginTop:5,display:"inline-flex"}}>{rl.icon} {rl.label}</span>}
          </div>
        ))}
      </div>

      {/* 7-day Trajectory Chart */}
      <div className="card" style={{marginBottom:9}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div className="label" style={{marginBottom:0}}>7-Day Burnout Trajectory</div>
          <span style={{fontSize:11,fontWeight:700,color:trajCol}}>{trajIcon}</span>
        </div>
        {/* Threshold reference lines */}
        <div style={{position:"relative",height:52,marginBottom:4}}>
          {/* Danger zone shading 70–100 */}
          <div style={{position:"absolute",bottom:`${(70/100)*52}px`,left:0,right:0,height:`${(30/100)*52}px`,background:"rgba(255,82,82,0.07)",borderRadius:4,zIndex:0}}/>
          {/* Watch zone shading 30–55 */}
          <div style={{position:"absolute",bottom:`${(30/100)*52}px`,left:0,right:0,height:`${(25/100)*52}px`,background:"rgba(255,216,60,0.05)",borderRadius:4,zIndex:0}}/>
          {/* Bars */}
          <div style={{display:"flex",alignItems:"flex-end",gap:3,height:"100%",position:"relative",zIndex:1}}>
            {traj.series.map((v,i)=>{
              const col = v>70?"#FF5252":v>55?"#FF7B7B":v>30?"#FFD83C":"#6FCF97";
              const days=["M","T","W","T","F","S","T"];
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  <div style={{width:"100%",height:`${(v/100)*52}px`,borderRadius:"4px 4px 0 0",
                    background:col,opacity:i===6?1:0.55+i*0.06,
                    boxShadow:i===6?`0 0 8px ${col}55`:"none",transition:"height 0.5s ease"}}/>
                  <span style={{fontSize:8,color:"rgba(255,255,255,0.35)",fontWeight:600}}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Legend */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[["rgba(255,82,82,0.2)","70+ Burnout zone"],["rgba(255,216,60,0.2)","30–55 Watch zone"],["#6FCF97","Safe"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:8,height:8,borderRadius:2,background:c,border:`1px solid ${c}`}}/>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600}}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factor Breakdown */}
      <div className="card" style={{marginBottom:9}}>
        <div className="label" style={{marginBottom:9}}>Risk Factor Breakdown</div>
        {bis.riskFactors.length === 0
          ? <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",fontStyle:"italic"}}>No significant risk factors detected.</p>
          : bis.riskFactors.map(f=>(
            <div key={f.id} className="rfactor">
              <span style={{fontSize:14}}>{f.icon}</span>
              <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.75)",flex:1,minWidth:80}}>{f.label}</span>
              <div className="rfactor-bar-track" style={{width:80}}>
                <div className="rfactor-bar-fill" style={{
                  width:`${f.weight}%`,
                  background:f.weight>70?"#FF7B7B":f.weight>45?"#FFB347":"#FFD83C"
                }}/>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",width:28,textAlign:"right"}}>{Math.round(f.weight)}</span>
            </div>
          ))
        }
      </div>

      {/* Recovery Resilience */}
      <div className="card" style={{marginBottom:9}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <ResilienceArc value={bis.recoveryResilience}/>
          <div>
            <div className="label" style={{marginBottom:3}}>Recovery Resilience</div>
            <div style={{fontWeight:700,color:"#fff",fontSize:13}}>
              {bis.recoveryResilience>=70?"Strong — bounces back fast":bis.recoveryResilience>=45?"Moderate — gradual recovery":"Low — needs rest buffer"}
            </div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.55)",marginTop:4,lineHeight:1.5}}>
              {bis.recoveryResilience>=70?"Streak breaks don't derail you for long.":bis.recoveryResilience>=45?"Recovery takes 2–3 days on average.":"High risk of prolonged stress after a miss."}
            </p>
          </div>
        </div>
      </div>

      {/* Intervention Card */}
      <div className={`intervention-card ${r7.intCls}`} style={{marginBottom:9}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9,position:"relative"}}>
          <span className={`risk-pill ${r7.cls}`}>{r7.icon} {r7.label} Risk</span>
          <span style={{fontSize:11,fontWeight:700,color:r7.color}}>7-Day Outlook</span>
        </div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:16,color:"#fff",marginBottom:8,position:"relative"}}>{interv.headline}</div>
        <div style={{position:"relative"}}>
          {interv.actions.map((a,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:5}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:r7.color,flexShrink:0,marginTop:5}}/>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:500,lineHeight:1.5}}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Day forecast strip */}
      <div className="card" style={{marginBottom:4}}>
        <div className="label" style={{marginBottom:8}}>3-Day Forecast</div>
        <div className="forecast-strip">
          {["Today","Tomorrow","Day 3"].map((day,i)=>{
            const prob = Math.min(100, bis.burnoutForecast.day3 + (i*(bis.burnoutForecast.day7-bis.burnoutForecast.day3)/3));
            const rl = getRiskLevel(Math.round(prob));
            return (
              <div key={day} className={`forecast-day${i===0?" today":prob>55?" high-risk":""}`}>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.45)",fontWeight:600,textTransform:"uppercase"}}>{day}</div>
                <span style={{fontSize:18}}>{rl.icon}</span>
                <div style={{fontSize:11,fontWeight:700,color:rl.color}}>{Math.round(prob)}%</div>
                <span className={`risk-pill ${rl.cls}`} style={{fontSize:8,padding:"2px 6px"}}>{rl.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ DAILY FORECAST CARD ════════════════════════════ */
function DailyForecastCard({ forecast }) {
  const bars = Array.from({length:5}, (_,i) => i < forecast.energyBars);
  return (
    <div className="forecast-card">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"relative"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
            <span style={{fontSize:18}}>{forecast.icon}</span>
            <div>
              <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(255,255,255,0.45)"}}>Daily Forecast</div>
              <div style={{fontSize:13,fontWeight:700,color:forecast.color}}>{forecast.label}</div>
            </div>
          </div>
          <div className="forecast-energy-bar">
            {bars.map((filled,i)=>(
              <div key={i} className={`forecast-energy-seg${filled?" filled":""}`}/>
            ))}
          </div>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.65)",lineHeight:1.55,marginTop:4}}>{forecast.desc}</p>
        </div>
        <div style={{marginLeft:10,textAlign:"right",flexShrink:0}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:forecast.color,lineHeight:1}}>{forecast.energyScore}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600}}>energy</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ DISENGAGEMENT ALERT ════════════════════════════ */
function DisengagementAlert({ dis }) {
  if (dis.level === "low") return null;
  const icon = dis.level === "high" ? "⚠️" : "📉";
  const msg  = dis.level === "high"
    ? `${dis.prob72}% disengagement risk in 72h — preventive protocol active`
    : `${dis.prob72}% disengagement risk — monitoring closely`;
  const col  = dis.level === "high" ? "#FF7B7B" : "#FFD83C";
  return (
    <div className={`disengage-alert ${dis.level}`}>
      <span style={{fontSize:18}}>{icon}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:700,color:col}}>48–72h Drop-off Signal</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2}}>{msg}</div>
        <div style={{marginTop:5,display:"flex",flexWrap:"wrap",gap:4}}>
          {dis.actions48.map((a,i)=>(
            <span key={i} style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,
              background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)"}}>{a}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ AI INSIGHT CARD ════════════════════════════════ */
function AIInsightCard({ insight }) {
  const [expanded, setExpanded] = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setLoaded(true), 900); return()=>clearTimeout(t); },[insight]);

  const typeColors = { momentum:"#6FCF97", burnout_warning:"#FF7B7B", recovery:"#A9D6F5", archetype_warning:"#FFD83C", data_insight:"#C9B6F2", identity:"#F6B7D8" };
  const col = typeColors[insight.type] ?? "#C9B6F2";

  return (
    <div className="ai-insight-card">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:loaded?8:0}}>
        <span style={{fontSize:14}}>🧠</span>
        <span style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",color:"#C9B6F2"}}>AI Insight · Mock LLM</span>
        <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:loaded?"#6FCF97":"#FFD83C"}}/>
      </div>
      {!loaded ? (
        <div className="ai-thinking"><div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginLeft:4}}>Analyzing behavioral patterns…</span>
        </div>
      ) : (
        <>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:15,color:col,marginBottom:6}}>{insight.headline}</div>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",lineHeight:1.6,marginBottom:expanded?8:0}}>{insight.insight}</p>
          {expanded && (
            <div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:5}}>
              {insight.dataPoints.map((dp,i)=>(
                <span key={i} style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:10,background:"rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.75)"}}>{dp}</span>
              ))}
            </div>
          )}
          <button onClick={()=>setExpanded(e=>!e)}
            style={{marginTop:8,fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.45)",background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>
            {expanded?"Hide data points ↑":"Show data points ↓"}
          </button>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════ AI LAYER PANEL (Standly AI tab) ═══════════════════════ */
function AILayerPanel({ bis, controls }) {
  const dis    = bis.disengagement;
  const nw     = bis.notifWindows;
  const fv     = bis.featureVector;
  const log    = bis.eventLog;
  const [activeSection, setSection] = useState("forecast");

  return (
    <div>
      {/* Section tabs */}
      <div style={{display:"flex",gap:5,marginBottom:12}}>
        {[["forecast","🔮 Forecast"],["timing","⏱️ Timing"],["features","🔬 Features"],["log","📋 Log"]].map(([id,l])=>(
          <span key={id} onClick={()=>setSection(id)}
            style={{flex:1,textAlign:"center",fontSize:9,fontWeight:700,padding:"6px 2px",borderRadius:12,cursor:"pointer",
              background:activeSection===id?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.1)",
              color:activeSection===id?"#1F2A44":"rgba(255,255,255,0.65)",transition:"all 0.15s",whiteSpace:"nowrap"}}>
            {l}
          </span>
        ))}
      </div>

      {activeSection==="forecast"&&(
        <div>
          {/* Daily forecast summary */}
          <DailyForecastCard forecast={bis.dailyForecast}/>

          {/* 48-72h disengagement model */}
          <div className="card" style={{marginBottom:9}}>
            <div className="label" style={{marginBottom:8}}>48–72h Disengagement Model</div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {[{label:"48h Risk", val:dis.prob48},{label:"72h Risk", val:dis.prob72}].map(({label,val})=>{
                const c=val>=65?"#FF7B7B":val>=38?"#FFD83C":"#6FCF97";
                return (
                  <div key={label} className="card" style={{flex:1,textAlign:"center",padding:"10px 6px",marginBottom:0}}>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:c,lineHeight:1}}>{val}%</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontWeight:700,textTransform:"uppercase",marginTop:3}}>{label}</div>
                  </div>
                );
              })}
            </div>
            <div className="label" style={{marginBottom:6}}>Preventive actions queued</div>
            {dis.actions48.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:5}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:dis.level==="high"?"#FF7B7B":"#FFD83C",marginTop:4,flexShrink:0}}/>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>{a}</span>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <AIInsightCard insight={bis.aiInsight}/>
        </div>
      )}

      {activeSection==="timing"&&(
        <div>
          <div className="card" style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div className="label" style={{marginBottom:0}}>Optimal Notification Windows</div>
              <span style={{fontSize:10,fontWeight:700,color:"#6FCF97"}}>
                {nw.recommended.length} optimal slot{nw.recommended.length!==1?"s":""} found
              </span>
            </div>
            <div className="notif-heatmap">
              {nw.blocks.map(b=>(
                <div key={b.id} className={`notif-slot ${b.tier}`}>
                  <span style={{fontSize:16,flexShrink:0}}>{b.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{b.label}</span>
                      <span style={{fontSize:9,color:"rgba(255,255,255,0.45)",fontWeight:600}}>{b.time}</span>
                    </div>
                    <div className="notif-bar-track">
                      <div className="notif-bar-fill" style={{
                        width:`${b.score}%`,
                        background: b.tier==="best"?"#6FCF97":b.tier==="good"?"#FFD83C":b.tier==="poor"?"rgba(255,255,255,0.25)":"#FF7B7B"
                      }}/>
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:12,fontWeight:800,color:b.tier==="best"?"#6FCF97":b.tier==="good"?"#FFD83C":b.tier==="skip"?"#FF7B7B":"rgba(255,255,255,0.4)"}}>{b.score}%</div>
                    {nw.recommended.includes(b.id) && <span style={{fontSize:8,fontWeight:800,color:"#6FCF97"}}>✓ SEND</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="label" style={{marginBottom:6}}>How this works</div>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.65}}>Response rate per time block is calculated from archetype pattern, morning vs afternoon responsiveness, burnout state, and day-of-week mode. In production this learns from actual tap timestamps.</p>
          </div>
        </div>
      )}

      {activeSection==="features"&&(
        <div>
          <div className="card" style={{marginBottom:9}}>
            <div className="label" style={{marginBottom:2}}>Feature Vector</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginBottom:10,fontStyle:"italic"}}>Structured input sent to AI layer for insight generation</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {[
                ["State",       fv.behavioral_state,                      "#C9B6F2"],
                ["Consistency", fv.consistency_pct+"%",                   "#6FCF97"],
                ["Burnout",     fv.burnout_index,                         fv.burnout_index>65?"#FF7B7B":"rgba(255,255,255,0.6)"],
                ["Trend",       fv.trend,                                 fv.trend==="rising"?"#6FCF97":fv.trend==="falling"?"#FF7B7B":"rgba(255,255,255,0.6)"],
                ["Pressure",    fv.goal_pressure,                         "#FFD83C"],
                ["7d-Risk",     fv.burnout_7d_risk+"%",                   fv.burnout_7d_risk>55?"#FF7B7B":"#6FCF97"],
                ["Identity",    fv.identity_score+"/100",                 "#F6B7D8"],
                ["Archetype",   fv.archetype.replace(/_/g," "),           "#A9D6F5"],
                ["Day",         fv.journey_day,                           "rgba(255,255,255,0.6)"],
                ["Resilience",  fv.recovery_resilience,                   "#6FCF97"],
              ].map(([k,v,col])=>(
                <div key={k} className="fv-chip">
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>{k}</div>
                  <div style={{fontSize:11,fontWeight:800,color:col,marginTop:2}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Raw JSON preview */}
          <div className="card" style={{background:"rgba(0,0,0,0.3)"}}>
            <div className="label" style={{marginBottom:6}}>JSON payload preview</div>
            <pre style={{fontSize:9,color:"rgba(111,207,151,0.8)",lineHeight:1.7,margin:0,whiteSpace:"pre-wrap",fontFamily:"monospace"}}>
{`{
  "behavioral_state": "${fv.behavioral_state}",
  "trend": "${fv.trend}",
  "burnout_index": ${fv.burnout_index},
  "consistency_pct": ${fv.consistency_pct},
  "goal_pressure": "${fv.goal_pressure}",
  "burnout_7d_risk": ${fv.burnout_7d_risk},
  "identity_score": ${fv.identity_score},
  "archetype": "${fv.archetype}",
  "motivation_style": "${fv.motivation_style}",
  "recovery_resilience": ${fv.recovery_resilience}
}`}
            </pre>
          </div>
        </div>
      )}

      {activeSection==="log"&&(
        <div>
          <div className="card" style={{marginBottom:9}}>
            <div className="label" style={{marginBottom:2}}>Event Log</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginBottom:10,fontStyle:"italic"}}>30-day behavioral event stream — feature engineering source</div>
            {log.map((e,i)=>(
              <div key={i} className="event-row">
                <div className="event-dot" style={{background:e.color}}/>
                <div style={{flex:1}}>
                  <span style={{fontWeight:700,color:"rgba(255,255,255,0.8)"}}>{e.icon} {e.label}</span>
                </div>
                <span style={{color:"rgba(255,255,255,0.35)",fontWeight:600,flexShrink:0}}>Day {e.day}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{background:"rgba(255,255,255,0.06)"}}>
            <div className="label" style={{marginBottom:6}}>Production schema</div>
            {[
              ["event_type","goal_met | goal_miss | streak | burnout_signal | calibration | arc | identity"],
              ["timestamp","ISO 8601 UTC"],
              ["signals","{ score, delta, state, archetype }"],
              ["outcome","completion_pct | response_time_ms"],
              ["intervention","action applied by engine at this event"],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",gap:8,marginBottom:5,fontSize:10}}>
                <span style={{color:"#C9B6F2",fontWeight:700,minWidth:90,flexShrink:0}}>{k}</span>
                <span style={{color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════ STAGE 7 UI COMPONENTS ════════════════════════ */

/* ── Weight Table Panel ── */
function WeightTablePanel({ weights, onOutcome }) {
  return (
    <div>
      <div className="card" style={{marginBottom:9}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <div className="label" style={{marginBottom:0}}>Intervention Weight Table</div>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600}}>tap to simulate outcome</span>
        </div>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginBottom:10,lineHeight:1.5}}>Weights drift toward 1.0 each session (3% decay). Positive outcomes push up, negative push down.</p>
        {INTERVENTION_TYPES.map(t => {
          const w = weights[t.id] ?? 1.0;
          const barPct = Math.min(100, Math.round((w / 2.5) * 100));
          const tier = w >= 1.4 ? "boosted" : w <= 0.65 ? "reduced" : "";
          const col = w >= 1.4 ? "#6FCF97" : w <= 0.65 ? "#FF7B7B" : "rgba(255,255,255,0.55)";
          return (
            <div key={t.id} className="weight-row">
              <span style={{fontSize:14,flexShrink:0}}>{t.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.82)"}}>{t.label}</span>
                  <span style={{fontSize:10,fontWeight:800,color:col}}>{w.toFixed(2)}×</span>
                </div>
                <div className="weight-bar-track">
                  <div className="weight-bar-fill" style={{width:`${barPct}%`, background: w>=1.4?"#6FCF97":w<=0.65?"#FF7B7B":"rgba(255,255,255,0.35)"}}/>
                </div>
              </div>
              {tier && <span className={`weight-badge ${tier}`}>{tier==="boosted"?"↑ Boosted":"↓ Reduced"}</span>}
              <div style={{display:"flex",gap:3,flexShrink:0}}>
                <button onClick={()=>onOutcome(t.id,"positive")} title="Positive outcome"
                  style={{padding:"3px 6px",borderRadius:7,border:"1px solid rgba(111,207,151,0.4)",background:"rgba(111,207,151,0.12)",color:"#6FCF97",fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>+</button>
                <button onClick={()=>onOutcome(t.id,"negative")} title="Negative outcome"
                  style={{padding:"3px 6px",borderRadius:7,border:"1px solid rgba(255,123,123,0.4)",background:"rgba(255,123,123,0.12)",color:"#FF7B7B",fontSize:10,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>−</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Micro Decision Log ── */
function MicroDecisionLog({ decisions }) {
  const outCls = (o) => o==="yes"?"yes":o==="no"?"no":o==="reduced"?"reduced":o==="full"?"full":"hold";
  return (
    <div>
      <div className="label" style={{marginBottom:8}}>6 Context-Aware Decisions</div>
      <p style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginBottom:10,lineHeight:1.5}}>Each decision is recomputed every render from the full Standly AI context. Confidence = signal clarity.</p>
      {decisions.map(d => (
        <div key={d.id} className="mdecision-row" style={{background:d.bg}}>
          <div className="mdecision-icon" style={{background:"rgba(255,255,255,0.1)"}}>
            <span>{d.icon}</span>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.88)"}}>{d.label}</span>
              <span className={`mdecision-output ${outCls(d.output)}`}>{d.output.toUpperCase()}</span>
            </div>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.55)",lineHeight:1.45,marginBottom:5}}>{d.reason}</p>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div className="confidence-bar" style={{flex:1}}>
                <div className="confidence-fill" style={{width:`${d.conf}%`}}/>
              </div>
              <span style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{d.conf}% conf</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── A/B Experiment Panel ── */
function ABExperimentPanel({ evalMetrics }) {
  const [activeExp, setActiveExp] = useState(0);
  const exp = AB_EXPERIMENTS[activeExp];
  const delta = Math.abs(exp.resultB - exp.resultA);
  const lift = Math.round((delta / exp.resultA) * 100);
  const bWins = exp.winner === "B";

  return (
    <div>
      {/* Experiment selector */}
      <div style={{display:"flex",gap:5,marginBottom:10}}>
        {AB_EXPERIMENTS.map((e,i) => (
          <span key={e.id} onClick={()=>setActiveExp(i)}
            style={{flex:1,textAlign:"center",fontSize:9,fontWeight:700,padding:"6px 4px",borderRadius:12,cursor:"pointer",
              background:i===activeExp?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.1)",
              color:i===activeExp?"#1F2A44":"rgba(255,255,255,0.65)",transition:"all 0.15s"}}>
            Exp {i+1}
          </span>
        ))}
      </div>

      <div className="ab-card" style={{marginBottom:9}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:800,color:"#fff",marginBottom:3}}>{exp.name}</div>
            <div style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Day {exp.daysRunning} running · {exp.metricLabel}</div>
          </div>
          {exp.winner && (
            <div className="ab-winner-badge" style={{flexShrink:0}}>✓ Winner: {exp.winner}</div>
          )}
        </div>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.5,marginBottom:8}}>{exp.hypothesis}</p>

        <div className="ab-variants">
          {[{v:"A",data:exp.variantA,result:exp.resultA},{v:"B",data:exp.variantB,result:exp.resultB}].map(({v,data,result}) => {
            const isWinner = exp.winner === v;
            return (
              <div key={v} className={`ab-variant ${isWinner?"leader":"trailing"}`}>
                <div style={{fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(255,255,255,0.45)",marginBottom:3}}>Variant {v}</div>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:isWinner?"#6FCF97":"rgba(255,255,255,0.55)",lineHeight:1}}>{result}{exp.unit}</div>
                <div style={{fontSize:10,fontWeight:700,color:isWinner?"rgba(111,207,151,0.8)":"rgba(255,255,255,0.4)",margin:"5px 0"}}>{data.label}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",lineHeight:1.45,fontStyle:"italic"}}>{data.desc}</div>
                {isWinner && <div className="ab-winner-badge" style={{marginTop:5}}>↑ {lift}% lift</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluation Metrics */}
      <div className="card">
        <div className="label" style={{marginBottom:8}}>Engine Performance Metrics</div>
        {evalMetrics.map((m,i) => {
          const cls = m.good ? "pos" : m.delta < 0 && m.label.includes("Variance") ? "pos" : m.good === false ? "neg" : "neu";
          return (
            <div key={i} className="eval-metric">
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.82)"}}>{m.label}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600,marginTop:1}}>{m.unit}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className={`eval-delta ${cls}`}>{m.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Stage 7 Master Panel ── */
function Stage7Panel({ bis, controls, setControls }) {
  const [section, setSection] = useState("decisions");

  const handleOutcome = useCallback((interventionId, outcome) => {
    setControls(c => ({
      ...c,
      weights: updateInterventionWeight(c.weights ?? INITIAL_WEIGHTS, interventionId, outcome),
    }));
  }, [setControls]);

  return (
    <div>
      {/* Section tabs */}
      <div style={{display:"flex",gap:5,marginBottom:12}}>
        {[["decisions","🧩 Decisions"],["weights","🔄 Weights"],["ab","🧪 A/B"]].map(([id,l])=>(
          <span key={id} onClick={()=>setSection(id)}
            style={{flex:1,textAlign:"center",fontSize:9,fontWeight:700,padding:"7px 3px",borderRadius:12,cursor:"pointer",
              background:section===id?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.1)",
              color:section===id?"#1F2A44":"rgba(255,255,255,0.65)",transition:"all 0.15s",whiteSpace:"nowrap"}}>
            {l}
          </span>
        ))}
      </div>

      {section==="decisions" && (
        <div>
          {/* Active intervention card */}
          {bis.selectedIntervention && (
            <div className="card" style={{marginBottom:9,background:"rgba(201,182,242,0.12)",borderColor:"rgba(201,182,242,0.35)"}}>
              <div className="label" style={{marginBottom:5}}>Recommended Intervention Now</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>{bis.selectedIntervention.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#C9B6F2"}}>{bis.selectedIntervention.label}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{bis.selectedIntervention.desc}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#C9B6F2"}}>{bis.selectedIntervention.weight.toFixed(2)}×</div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",fontWeight:700}}>WEIGHT</div>
                </div>
              </div>
            </div>
          )}
          <MicroDecisionLog decisions={bis.microDecisions}/>
        </div>
      )}

      {section==="weights" && (
        <WeightTablePanel
          weights={controls.weights ?? INITIAL_WEIGHTS}
          onOutcome={handleOutcome}
        />
      )}

      {section==="ab" && (
        <ABExperimentPanel evalMetrics={bis.evalMetrics}/>
      )}
    </div>
  );
}

/* ══════════════════════════ AUTH COMPONENTS ════════════════════════════════ */

/* ── Auth Toast — slides in for mid-flow confirmation ── */
function AuthToast({ message, onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone, 2800); return()=>clearTimeout(t); },[onDone]);
  return (
    <div className="auth-toast">
      <div style={{width:7,height:7,borderRadius:"50%",background:"#6FCF97",flexShrink:0}}/>
      <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{message}</span>
    </div>
  );
}

/* ── Restoring Progress Screen (1.8s) ── */
function RestoringProgressScreen({ user, onDone }) {
  const [prog, setProg] = useState(0);
  const steps = ["Loading behavioral profile…","Restoring mascot evolution…","Syncing adaptive goal history…","Restoring complete ✓"];

  useEffect(()=>{
    const intervals = [0, 500, 1100, 1600].map((delay, i)=>{
      return setTimeout(()=>{
        setProg(Math.round(((i+1)/4)*100));
      }, delay);
    });
    const done = setTimeout(onDone, 2200);
    return ()=>{ intervals.forEach(clearTimeout); clearTimeout(done); };
  },[onDone]);

  const stepIdx = prog < 25 ? 0 : prog < 50 ? 1 : prog < 75 ? 2 : 3;

  return (
    <div className="restore-screen">
      <div style={{textAlign:"center"}}>
        <div className="restore-spinner"/>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#fff",marginBottom:8}}>
          Welcome back, <em style={{color:"#F6B7D8"}}>{user.display_name}</em>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontWeight:600,marginBottom:16,minHeight:18}}>
          {steps[stepIdx]}
        </div>
        <div className="restore-bar-track">
          <div className="restore-bar-fill" style={{width:`${prog}%`}}/>
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:600,marginTop:8}}>{prog}%</div>
      </div>

      {/* Loaded state summary */}
      {prog >= 100 && (
        <div style={{position:"absolute",bottom:32,left:24,right:24}}>
          <div style={{display:"flex",justifyContent:"center",gap:16}}>
            {[
              user.streak > 0 ? `🔥 ${user.streak}d streak` : null,
              user.xp > 0 ? `⚡ ${user.xp} XP` : null,
              user.identity_level ?? null,
            ].filter(Boolean).map((label,i)=>(
              <span key={i} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",
                background:"rgba(255,255,255,0.1)",borderRadius:20,padding:"4px 10px"}}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Welcome Back Overlay (returning user brief greeting) ── */
function WelcomeBackOverlay({ user, onDone }) {
  const daysSince = user.last_seen_days_ago ?? 0;
  const greeting  = daysSince >= 14 ? `It's good to see you again.`
                  : user.streak > 0 ? `Your momentum is waiting.`
                  : `Ready to pick up where you left off?`;
  const sub       = daysSince >= 14
    ? `You've been away ${daysSince} days. Light recovery mode is active.`
    : `Day ${user.behavioral_state?.dayInJourney ?? "?"} of your journey.`;

  useEffect(()=>{ const t=setTimeout(onDone, 2600); return()=>clearTimeout(t); },[onDone]);

  return (
    <div className="welcome-back-overlay">
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <div style={{width:64,height:64,borderRadius:24,background:"linear-gradient(135deg,rgba(201,182,242,0.4),rgba(246,183,216,0.3))",
          border:"2px solid rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:28,color:"#fff"}}>{user.avatar}</span>
        </div>
      </div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"#fff",textAlign:"center",marginBottom:8}}>
        Hi, <em style={{color:"#F6B7D8"}}>{user.display_name}</em>
      </div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:17,color:"rgba(255,255,255,0.85)",textAlign:"center",marginBottom:6}}>
        {greeting}
      </div>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",textAlign:"center",lineHeight:1.6}}>{sub}</p>
    </div>
  );
}

/* ── Auth Options Screen (onboarding step 2.5) ── */
function AuthOptionsScreen({ onAuth, onSkip, midOnboarding=false }) {
  const [mode, setMode]         = useState("options"); // "options" | "email" | "loading"
  const [email, setEmail]       = useState("");
  const [loadingFor, setFor]    = useState(null);
  const [error, setError]       = useState("");

  const handleProvider = useCallback((provider) => {
    setFor(provider); setMode("loading");
    setTimeout(()=>{
      const result = mockAuthenticate(provider, email);
      onAuth(result);
    }, 1400);
  }, [email, onAuth]);

  const handleEmail = useCallback(() => {
    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    setFor("email"); setMode("loading");
    setTimeout(()=>{
      const result = mockAuthenticate("email", email);
      onAuth(result);
    }, 1200);
  }, [email, onAuth]);

  if (mode === "loading") {
    return (
      <div className="screen" style={{alignItems:"center",justifyContent:"center"}}>
        <div className="restore-spinner" style={{marginBottom:16}}/>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#fff",textAlign:"center"}}>
          Signing in with {loadingFor}…
        </div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:8}}>Checking for existing account</p>
      </div>
    );
  }

  if (mode === "email") {
    return (
      <div className="screen" style={{justifyContent:"space-between"}}>
        <div style={{flex:1}}>
          <button onClick={()=>{setMode("options");setError("");}}
            style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit",fontSize:12,padding:"0 0 16px 0",fontWeight:700}}>← Back</button>
          <div className="label">Email Sign-in</div>
          <h2 className="display" style={{marginBottom:14}}>Your <em>email</em></h2>
          <input className="auth-email-input" type="email" placeholder="you@example.com"
            value={email} onChange={e=>{setEmail(e.target.value);setError("");}}/>
          {error && <p style={{fontSize:11,color:"#FF7B7B",fontWeight:600,marginTop:6}}>{error}</p>}
          <p style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:10,lineHeight:1.6}}>
            Try: <strong style={{color:"rgba(255,255,255,0.7)"}}>minh@example.com</strong> (returning), <strong style={{color:"rgba(255,255,255,0.7)"}}>an@example.com</strong> (expert), or any new email.
          </p>
        </div>
        <button className="btn" onClick={handleEmail}>Continue with Email →</button>
      </div>
    );
  }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <div style={{flex:1}}>
        {!midOnboarding && <div className="ptrack"><div className="pfill" style={{width:"0%"}}/></div>}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:32,marginBottom:10}}>🔐</div>
          <div className="label" style={{textAlign:"center"}}>Optional</div>
          <h2 className="display" style={{textAlign:"center",fontSize:22,marginBottom:8}}>Save your <em>progress</em></h2>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.55)",textAlign:"center",lineHeight:1.65}}>
            Sync your mascot evolution, streak, and adaptive goal across devices. No data loss if you reinstall.
          </p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          <button className="auth-provider-btn google" onClick={()=>handleProvider("google")}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <button className="auth-provider-btn apple" onClick={()=>handleProvider("apple")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Continue with Apple
          </button>
          <button className="auth-provider-btn" onClick={()=>setMode("email")}
            style={{justifyContent:"center"}}>
            ✉ Continue with Email
          </button>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
        <button className="btn-ghost" onClick={onSkip} style={{fontSize:12}}>
          Continue without account
        </button>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.3)",textAlign:"center",lineHeight:1.5}}>
          Your data stays private. No ads. Login is optional.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════ SPLASH SCREEN ═════════════════════════════════ */
const SPLASH_MESSAGES = {
  momentum:  ["Ready to protect your streak? 🔥", "Your momentum is building. ⚡", "Let's keep it going today."],
  returning: ["You showed up yesterday. 💛", "Small breaks. Real transformation.", "Your momentum identity is forming."],
  low:       ["Let's move a little today. 🌱", "Every step counts.", "No pressure. Just show up."],
  first:     ["Stand up. Start your momentum.", "Small breaks. Real transformation.", "Your health journey starts now."],
};

const PARTICLES = Array.from({length:14},(_,i)=>({
  id:i, size:4+(i%4)*3, left:5+(i*17)%90,
  delay:(i*0.4)%3, duration:4+(i%3)*1.5, top:10+(i*11)%80,
}));

function SplashScreen({ controls, onDone, isFirstTime=true }) {
  const [exiting, setExiting] = useState(false);

  const mood = (() => {
    if (!controls) return "neutral";
    if (controls.c14 < 35 || controls.inactive3 >= 3) return "tired";
    if (controls.consecReminders >= 3 || controls.streak >= 5) return "happy";
    if (controls.streak >= 2) return "encouraging";
    return "neutral";
  })();

  const msgCat = isFirstTime?"first":mood==="happy"?"momentum":mood==="tired"?"low":"returning";
  const msgs   = SPLASH_MESSAGES[msgCat];
  const message = msgs[Math.floor(Date.now()/1000) % msgs.length];
  const charKey = controls ? assignChar(controls.motivation, controls.personality) : "mellow";

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2300);
    const t2 = setTimeout(() => onDone(), 2850);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`splash${exiting?" exiting":""}`}>
      {/* Particles */}
      <div className="splash-particles">
        {PARTICLES.map(p => (
          <div key={p.id} className="particle" style={{
            width:p.size, height:p.size, left:`${p.left}%`, top:`${p.top}%`,
            animationDelay:`${p.delay}s`, animationDuration:`${p.duration}s`,
          }}/>
        ))}
      </div>

      {/* Ambient glow */}
      <div className="splash-glow"/>

      {/* Mascot */}
      <div className="splash-mascot" style={{position:"relative"}}>
        <Mascot charKey={charKey} mood={mood} size={180}/>
        <div className="mascot-blink" style={{position:"absolute",inset:0,borderRadius:"50%",pointerEvents:"none"}}/>
      </div>

      {/* App name */}
      <div className="splash-appname">STANDLY</div>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.22em",color:"rgba(255,255,255,0.55)",marginTop:4,textTransform:"uppercase"}}>AI Health Companion</div>

      {/* Tagline */}
      <div className="splash-tagline">
        {isFirstTime ? "Stand up. Start your momentum." : "Every break builds your momentum."}
      </div>

      {/* Returning user micro-message */}
      {!isFirstTime && <div className="splash-message">{message}</div>}

      {/* Energy loader */}
      <div className="splash-loader-wrap">
        <div className="splash-loader-label">Building your daily momentum…</div>
        <div className="splash-loader-track"><div className="splash-loader-fill"/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════ ONBOARDING ════════════════════════════════════ */
/* ──────────────────────────────────────────────────────────────────────────
   STANDLY ONBOARDING v2 — 14 Screens
   0 Value Framing → 1 Name → 2 Body → 3 Work → 4 Activity →
   5 Health → 6 Energy → 7 Goals → 8 Commit → 9 AI Processing →
   10 Plan Reveal → 11 Gamification → 12 Notifications → 13 Auth
   Auth moved to END (after demonstrating value). onComplete() maps new
   profile fields to Standly AI-compatible format before lifting to App.
   ────────────────────────────────────────────────────────────────────────── */
function OnboardingFlow({ onComplete, onAuthRestore }) {
  const [step, setStep]       = useState(0);
  const [aiStep, setAiStep]   = useState(0);  // AI processing animation counter
  const [profile, setProfile] = useState({
    // New Standly fields
    name: "", age: null, gender: null,
    height: null, weight: null,
    workPattern: null, workLocation: null,
    exerciseFreq: null, avgSteps: null,
    healthConditions: [], energyPeak: null,
    barriers: [], goals: [], commitMins: null,
    notifEnabled: false,
    // Standly AI-compatible (mapped on complete)
    bmi: 24, activity: "low", goal: "wellness",
    commitment: "balanced", workHours: "6-8",
    pain: false, motivation: "gentle", personality: null,
  });
  const [toast, setToast] = useState(null);

  const next     = useCallback(() => setStep(s => s + 1), []);
  const setP     = useCallback(fn => setProfile(fn), []);

  // Toggle an item in a multi-select array field
  const toggleMulti = useCallback((field, val) => {
    setProfile(p => {
      const arr = p[field] || [];
      return { ...p, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  }, []);

  // Derived character key from current motivation
  const charKey = assignChar(profile.motivation, profile.personality);

  // ── AI Processing animation (screen 9) ──────────────────────────────────
  const AI_STEPS = [
    { icon: "🧠", text: "Analyzing your lifestyle profile…" },
    { icon: "📊", text: "Scoring your sedentary risk…" },
    { icon: "⚡", text: "Calibrating your energy patterns…" },
    { icon: "🎯", text: "Designing your movement plan…" },
    { icon: "✅", text: "Your Standly Plan is ready." },
  ];

  useEffect(() => {
    if (step !== 10) { setAiStep(0); return; }
    let count = 0;
    const t = setInterval(() => {
      count++;
      setAiStep(count);
      if (count >= AI_STEPS.length) {
        clearInterval(t);
        setTimeout(() => next(), 900);
      }
    }, 680);
    return () => clearInterval(t);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Map new profile → Standly AI-compatible format ──────────────────────────────
  const handleComplete = useCallback(() => {
    const mapped = {
      ...profile,
      activity: profile.exerciseFreq === "5+" ? "high"
               : profile.exerciseFreq === "3-4" ? "moderate"
               : "low",
      goal: profile.goals.includes("lose_weight") ? "weight"
          : profile.goals.includes("energy") ? "energy"
          : profile.goals.includes("pain") ? "pain"
          : profile.goals.includes("focus") ? "productivity"
          : "wellness",
      commitment: profile.commitMins === "20+" ? "high"
                : profile.commitMins === "5"   ? "light"
                : "balanced",
      workHours: profile.workPattern === "heavy_sit" ? "8+" : "6-8",
      pain: (profile.healthConditions || []).includes("back") ||
            (profile.healthConditions || []).includes("knee"),
      motivation: (profile.barriers || []).includes("motivation") ? "gentle"
                : (profile.goals || []).includes("habits") ? "achievement"
                : profile.energyPeak === "morning" ? "competitive"
                : "gentle",
    };
    onComplete(mapped, assignChar(mapped.motivation, null));
  }, [profile, onComplete]);

  // ── Auth handler (called from screen 13) ────────────────────────────────
  const handleAuth = useCallback((result) => {
    if (!result.success) { handleComplete(); return; }
    const route = resolveAuthRoute(result.user);
    if (route === "home") { onAuthRestore(result.user); return; }
    setToast(result.isNewUser ? "Account created — progress saved ✓" : "Account linked — welcome back ✓");
    handleComplete();
  }, [onAuthRestore, handleComplete]);

  // ── Derived display values ──────────────────────────────────────────────
  const userName      = profile.name || "you";
  const estimatedSit  = profile.workPattern === "heavy_sit" ? 9
                      : profile.workPattern === "moderate_sit" ? 6
                      : profile.workPattern === "moderate" ? 3 : 1;
  const baseStepGoal  = profile.avgSteps === "10k+" ? 10000
                      : profile.avgSteps === "6-10k" ? 8000
                      : profile.avgSteps === "3-6k" ? 6500 : 5000;
  const standEvery    = profile.workPattern === "heavy_sit" ? 60
                      : profile.workPattern === "moderate_sit" ? 75 : 90;

  // Progress bar % per screen (15 screens: 0–14)
  const PROGRESS = [0, 0, 7, 14, 21, 29, 36, 43, 50, 57, 68, 78, 86, 92, 100];

  const centerCol = { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" };

  // ── Multi-chip helper (inline component) ────────────────────────────────
  const MChip = ({ field, val, icon, label, sub }) => {
    const sel = (profile[field] || []).includes(val);
    return (
      <div
        className={`chip${sel ? " sel" : ""}`}
        onClick={() => toggleMulti(field, val)}
        style={{ position:"relative", marginBottom:7,
          ...(sub ? { flexDirection:"column", alignItems:"flex-start", gap:2 } : {}) }}
      >
        {icon && <span style={{ fontSize:16 }}>{icon}</span>}
        {sub ? (
          <>
            <span style={{ fontWeight:700 }}>{label}</span>
            <span style={{ fontSize:11, opacity:0.6 }}>{sub}</span>
          </>
        ) : label}
        {sel && <span className="chip-check">✓</span>}
      </div>
    );
  };

  const screens = [

    /* ── 0  Value Framing ─────────────────────────────────────────────────── */
    <div key="s0" className="screen" style={{justifyContent:"space-between"}}>
      <div style={centerCol}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:18}}>
          <Mascot charKey="mellow" mood="happy" size={110}/>
        </div>
        <div className="label" style={{textAlign:"center",color:"#C9B6F2",marginBottom:8}}>
          STANDLY · AI HEALTH COMPANION
        </div>
        <h1 className="display" style={{textAlign:"center",fontSize:28,marginBottom:12}}>
          Stand up.<br/><em>Start your momentum.</em>
        </h1>
        <p className="body" style={{textAlign:"center",maxWidth:290,marginBottom:18,fontSize:13}}>
          Break sedentary habits, build daily movement, and turn small actions into long-term health momentum.
        </p>
        <div style={{width:"100%"}}>
          {[["🧘","Reduce back & neck pain"],["⚡","Improve energy & focus"],["🚀","Build sustainable daily movement"]].map(([icon,text])=>(
            <div key={text} className="sly-benefit">
              <span style={{fontSize:18}}>{icon}</span>
              <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.9)"}}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="btn" onClick={next} style={{marginTop:14}}>Get Started →</button>
    </div>,

    /* ── 1  Name ──────────────────────────────────────────────────────────── */
    <div key="s1" className="screen" style={{justifyContent:"space-between"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <Mascot charKey="sprout" mood="encouraging" size={90}/>
        </div>
        <h2 className="display" style={{textAlign:"center",marginBottom:8}}>
          What should we <em>call you?</em>
        </h2>
        <p className="body" style={{textAlign:"center",marginBottom:22,fontSize:13,color:"rgba(255,255,255,0.65)"}}>
          Personalizing your experience starts here.
        </p>
        <input
          className="inp"
          type="text"
          placeholder="Your first name…"
          value={profile.name}
          onChange={e => setP(p=>({...p, name:e.target.value}))}
          style={{fontSize:20,textAlign:"center",padding:"16px"}}
          autoFocus
        />
        {profile.name.length > 0 && (
          <div className="card" style={{textAlign:"center",marginTop:12,padding:"12px 16px"}}>
            <span style={{fontSize:13,color:"rgba(255,255,255,0.85)"}}>
              Nice to meet you, <strong style={{color:"#F6B7D8"}}>{profile.name}</strong> 👋
            </span>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>
              Let's build your movement momentum.
            </p>
          </div>
        )}
      </div>
      <button className="btn" onClick={next} disabled={profile.name.trim().length===0}>
        Continue
      </button>
    </div>,

    /* ── 2  Physical Profile ──────────────────────────────────────────────── */
    <div key="s2" className="screen scrollable">
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[2]}%`}}/></div>
      <div className="label">Your Body</div>
      <h2 className="display" style={{marginBottom:4}}>Tell us about <em>your body</em></h2>
      <p className="body" style={{fontSize:12,marginBottom:14,color:"rgba(255,255,255,0.55)"}}>
        Used to calculate your baseline and personalize targets.
      </p>

      <div className="label" style={{marginBottom:5}}>Age</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {[["18–24","18-24"],["25–34","25-34"],["35–44","35-44"],["45–54","45-54"],["55+","55+"]].map(([l,v])=>(
          <span key={v}
            onClick={()=>setP(p=>({...p,age:v}))}
            className={`badge${profile.age===v?" rose":""}`}
            style={{cursor:"pointer",fontSize:12,padding:"6px 13px"}}>
            {l}
          </span>
        ))}
      </div>

      <div className="label" style={{marginBottom:5}}>
        Gender <span style={{opacity:0.4,fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:9}}>(optional)</span>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {[["Male","male"],["Female","female"],["Non-binary","nonbinary"],["Prefer not to say","none"]].map(([l,v])=>(
          <span key={v}
            onClick={()=>setP(p=>({...p,gender:v}))}
            className={`badge${profile.gender===v?" purple":""}`}
            style={{cursor:"pointer",fontSize:11,padding:"6px 11px"}}>
            {l}
          </span>
        ))}
      </div>

      <div style={{display:"flex",gap:10,marginBottom:10}}>
        {[["Height (cm)","172","height"],["Weight (kg)","70","weight"]].map(([l,ph,k])=>(
          <div key={k} style={{flex:1}}>
            <div className="label" style={{marginBottom:4}}>{l}</div>
            <input className="inp" type="number" placeholder={ph} onChange={e=>{
              setP(prev=>{
                const u={...prev,[k]:+e.target.value};
                if(u.height&&u.weight) u.bmi=+(u.weight/(u.height/100)**2).toFixed(1);
                return u;
              });
            }}/>
          </div>
        ))}
      </div>

      {profile.bmi && profile.bmi!==24 && (
        <div className="card" style={{display:"flex",alignItems:"center",gap:12}}>
          <div>
            <div style={{fontSize:28,fontFamily:"'DM Serif Display',serif",color:"#fff"}}>{profile.bmi}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:600}}>BMI</div>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.72)",lineHeight:1.55,flex:1}}>
            {profile.bmi>27 ? "Gradual daily movement can meaningfully improve your metabolic health and energy."
              : "Great baseline — we'll build a smart plan on this foundation."}
          </p>
        </div>
      )}
      <button className="btn" onClick={next} style={{marginTop:10}}>Continue</button>
    </div>,

    /* ── 3  Work & Lifestyle ──────────────────────────────────────────────── */
    <div key="s3" className="screen scrollable">
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[3]}%`}}/></div>
      <div className="label">Daily Routine</div>
      <h2 className="display" style={{marginBottom:4}}>How does your <em>typical day look?</em></h2>
      <p className="body" style={{fontSize:12,marginBottom:12,color:"rgba(255,255,255,0.55)"}}>
        Powers your sedentary risk score and reminder timing.
      </p>

      <div className="label" style={{marginBottom:6}}>How much do you sit?</div>
      {[
        ["heavy_sit","🪑","I sit most of the day","8+ hours at a desk"],
        ["moderate_sit","💻","I sit 4–8 hours","Moderate desk time"],
        ["moderate","🚶","I'm moderately active","Mix of sitting & moving"],
        ["very_active","🏃","I move frequently","Rarely sit for long"],
      ].map(([v,icon,l,sub])=>(
        <div key={v}
          className={`chip${profile.workPattern===v?" sel":""}`}
          onClick={()=>setP(p=>({...p,workPattern:v}))}
          style={{flexDirection:"column",alignItems:"flex-start",gap:2,marginBottom:7}}>
          <span style={{fontWeight:700}}>{icon} {l}</span>
          <span style={{fontSize:11,opacity:0.6}}>{sub}</span>
        </div>
      ))}

      <div className="label" style={{marginBottom:6,marginTop:6}}>Where do you mostly work?</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[["🏢 Office","office"],["🏠 Home","wfh"],["🎓 Student","student"],["🚗 Driver","driver"],["Other","other"]].map(([l,v])=>(
          <span key={v}
            onClick={()=>setP(p=>({...p,workLocation:v}))}
            className={`badge${profile.workLocation===v?" blue":""}`}
            style={{cursor:"pointer",fontSize:11,padding:"7px 12px"}}>
            {l}
          </span>
        ))}
      </div>
      <button className="btn" onClick={next} style={{marginTop:14}} disabled={!profile.workPattern}>Continue</button>
    </div>,

    /* ── 4  Activity Level ────────────────────────────────────────────────── */
    <div key="s4" className="screen scrollable">
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[4]}%`}}/></div>
      <div className="label">Current Activity</div>
      <h2 className="display" style={{marginBottom:4}}>How <em>active are you</em> right now?</h2>
      <p className="body" style={{fontSize:12,marginBottom:12,color:"rgba(255,255,255,0.55)"}}>
        Your starting point — not a judgment, just a baseline.
      </p>

      <div className="label" style={{marginBottom:6}}>Exercise frequency</div>
      {[
        ["rarely","😴","Rarely exercise"],
        ["1-2","🚶","1–2 times/week"],
        ["3-4","🏃","3–4 times/week"],
        ["5+","🏆","5+ times/week"],
      ].map(([v,icon,l])=>(
        <div key={v}
          className={`chip${profile.exerciseFreq===v?" sel":""}`}
          onClick={()=>setP(p=>({...p,exerciseFreq:v}))}
          style={{marginBottom:7}}>
          <span style={{fontSize:16}}>{icon}</span>{l}
        </div>
      ))}

      <div className="label" style={{marginBottom:6,marginTop:4}}>Average daily steps (if known)</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[["< 3,000","<3k"],["3,000–6,000","3-6k"],["6,000–10,000","6-10k"],["10,000+","10k+"]].map(([l,v])=>(
          <span key={v}
            onClick={()=>setP(p=>({...p,avgSteps:v}))}
            className={`badge${profile.avgSteps===v?" green":""}`}
            style={{cursor:"pointer",fontSize:11,padding:"7px 13px"}}>
            {l}
          </span>
        ))}
      </div>
      <button className="btn" onClick={next} style={{marginTop:14}} disabled={!profile.exerciseFreq}>Continue</button>
    </div>,

    /* ── 5  Health Conditions ─────────────────────────────────────────────── */
    <div key="s5" className="screen scrollable">
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[5]}%`}}/></div>
      <div className="label">Health Considerations</div>
      <h2 className="display" style={{marginBottom:4}}>Any <em>health considerations?</em></h2>
      <p className="body" style={{fontSize:12,marginBottom:14,color:"rgba(255,255,255,0.55)"}}>
        Helps us recommend safer movement targets. Select all that apply.
      </p>
      {[
        ["back","🧘","Back pain",null],
        ["neck","💆","Neck or shoulder pain",null],
        ["knee","🦵","Knee pain",null],
        ["overweight","⚖️","Managing weight",null],
        ["diabetes","💉","Diabetes",null],
        ["heart","❤️","Heart condition",null],
        ["none","✅","None of the above",null],
      ].map(([v,icon,l])=>{
        const sel=(profile.healthConditions||[]).includes(v);
        return (
          <div key={v}
            className={`chip${sel?" sel":""}`}
            onClick={()=>{
              if(v==="none") { setP(p=>({...p,healthConditions:["none"]})); return; }
              setP(p=>{
                const arr=(p.healthConditions||[]).filter(x=>x!=="none");
                return {...p, healthConditions: arr.includes(v) ? arr.filter(x=>x!==v) : [...arr,v]};
              });
            }}
            style={{position:"relative",marginBottom:7}}>
            <span style={{fontSize:16}}>{icon}</span>{l}
            {sel && <span className="chip-check">✓</span>}
          </div>
        );
      })}
      <button className="btn" onClick={next} style={{marginTop:4}}
        disabled={(profile.healthConditions||[]).length===0}>Continue</button>
    </div>,

    /* ── 6  Energy Peak ──────────────────────────────────────────────────── */
    <div key="s6" className="screen" style={{justifyContent:"space-between"}}>
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[6]}%`}}/></div>
      <div style={{flex:1}}>
        <div className="label">Energy Profile</div>
        <h2 className="display" style={{marginBottom:4}}>When do you feel most <em>energized?</em></h2>
        <p className="body" style={{fontSize:12,marginBottom:16,color:"rgba(255,255,255,0.55)"}}>
          Powers AI nudging strategy and optimal reminder timing.
        </p>
        {[
          ["morning","🌅","Morning","Best energy before noon"],
          ["midday","☀️","Midday","Peak around 12–2 PM"],
          ["afternoon","🌇","Afternoon","Energy picks up after 3 PM"],
          ["evening","🌙","Evening","Most alive after 6 PM"],
        ].map(([v,icon,l,sub])=>(
          <div key={v}
            className={`chip${profile.energyPeak===v?" sel":""}`}
            onClick={()=>setP(p=>({...p,energyPeak:v}))}
            style={{flexDirection:"column",alignItems:"flex-start",gap:2,marginBottom:8}}>
            <span style={{fontWeight:700}}>{icon} {l}</span>
            <span style={{fontSize:11,opacity:0.6}}>{sub}</span>
          </div>
        ))}
      </div>
      <button className="btn" onClick={next} disabled={!profile.energyPeak}>Continue</button>
    </div>,

    /* ── 7  Barriers ─────────────────────────────────────────────────────── */
    <div key="s7" className="screen" style={{justifyContent:"space-between"}}>
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[7]}%`}}/></div>
      <div style={{flex:1}}>
        <div className="label">Barriers</div>
        <h2 className="display" style={{marginBottom:4}}>What <em>stops you</em> from moving?</h2>
        <p className="body" style={{fontSize:12,marginBottom:16,color:"rgba(255,255,255,0.55)"}}>
          Helps us personalize your nudging tone. Select all that apply.
        </p>
        {[
          ["forgot","🔔","I forget"],
          ["busy","⏰","I feel too busy"],
          ["tired","😴","I feel tired"],
          ["motivation","💔","I lack motivation"],
          ["results","📊","I don't see results"],
        ].map(([v,icon,l])=>{
          const sel=(profile.barriers||[]).includes(v);
          return (
            <div key={v}
              className={`chip${sel?" sel":""}`}
              onClick={()=>toggleMulti("barriers",v)}
              style={{position:"relative",marginBottom:8}}>
              <span style={{fontSize:16}}>{icon}</span>{l}
              {sel && <span className="chip-check">✓</span>}
            </div>
          );
        })}
      </div>
      <button className="btn" onClick={next}>Continue</button>
    </div>,

    /* ── 8  Goals ─────────────────────────────────────────────────────────── */
    <div key="s8g" className="screen scrollable">
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[8]}%`}}/></div>
      <div className="label">Your Why</div>
      <h2 className="display" style={{marginBottom:4}}>What do you want to <em>improve?</em></h2>
      <p className="body" style={{fontSize:12,marginBottom:12,color:"rgba(255,255,255,0.55)"}}>
        Select everything that resonates — this connects logic to emotion.
      </p>
      {[
        ["pain","🧘","Reduce back pain"],
        ["energy","⚡","Increase daily energy"],
        ["lose_weight","⚖️","Lose weight"],
        ["focus","🎯","Improve focus & clarity"],
        ["habits","🌿","Build healthy habits"],
        ["longevity","🕊️","Live longer, healthier"],
        ["proud","💛","Feel proud of myself"],
      ].map(([v,icon,l])=>{
        const sel=(profile.goals||[]).includes(v);
        return (
          <div key={v}
            className={`chip${sel?" sel":""}`}
            onClick={()=>toggleMulti("goals",v)}
            style={{position:"relative",marginBottom:7}}>
            <span style={{fontSize:16}}>{icon}</span>{l}
            {sel && <span className="chip-check">✓</span>}
          </div>
        );
      })}
      <button className="btn" onClick={next} style={{marginTop:6}}
        disabled={(profile.goals||[]).length===0}>Continue</button>
    </div>,

    /* ── 9  Commitment ────────────────────────────────────────────────────── */
    <div key="s8" className="screen" style={{justifyContent:"space-between"}}>
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[8]}%`}}/></div>
      <div style={{flex:1}}>
        <div className="label">Commitment</div>
        <h2 className="display" style={{marginBottom:4}}>How many minutes <em>per day?</em></h2>
        <p className="body" style={{fontSize:12,marginBottom:14,color:"rgba(255,255,255,0.55)"}}>
          Even 5 minutes done consistently beats 60 done once.
        </p>
        {[
          ["5","🌱","5 minutes","The power of just showing up"],
          ["10","⚡","10 minutes","Building real momentum"],
          ["15","🔥","15 minutes","Habit-forming territory"],
          ["20+","🚀","20+ minutes","Full transformation mode"],
        ].map(([v,icon,l,sub])=>(
          <div key={v}
            className={`chip${profile.commitMins===v?" sel":""}`}
            onClick={()=>setP(p=>({...p,commitMins:v}))}
            style={{flexDirection:"column",alignItems:"flex-start",gap:2,marginBottom:7}}>
            <span style={{fontWeight:700}}>{icon} {l}</span>
            <span style={{fontSize:11,opacity:0.6}}>{sub}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button className="btn" onClick={next} disabled={!profile.commitMins}>
          ✅ Yes, let's do it.
        </button>
        <div style={{textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.38)",fontWeight:500,lineHeight:1.4}}>
          Psychological commitment increases long-term compliance by up to 73%.
        </div>
      </div>
    </div>,

    /* ── 9  AI Processing ─────────────────────────────────────────────────── */
    <div key="s9" className="screen" style={{alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"100%"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:18}}>
          <Mascot charKey={charKey} mood={aiStep>=AI_STEPS.length?"glowing":"energized"} size={100}/>
        </div>
        <h2 className="display" style={{textAlign:"center",fontSize:22,marginBottom:18}}>
          {aiStep>=AI_STEPS.length
            ? <><em>Your plan is ready,</em><br/>{userName}!</>
            : <>Analyzing your <em>profile…</em></>
          }
        </h2>
        <div>
          {AI_STEPS.map((s,i)=>{
            const isDone   = i < aiStep;
            const isActive = i === aiStep && aiStep < AI_STEPS.length;
            return (
              <div key={i} className={`ai-process-row ${isDone?"done":isActive?"active":"pending"}`}>
                <span style={{fontSize:18,width:24,textAlign:"center"}}>
                  {isDone ? "✅" : s.icon}
                </span>
                <span style={{
                  fontSize:13, fontWeight:600, flex:1,
                  color: isDone?"#6FCF97" : isActive?"#C9B6F2" : "rgba(255,255,255,0.35)",
                }}>
                  {s.text}
                </span>
                {isActive && (
                  <span style={{display:"flex",gap:3,marginLeft:"auto"}}>
                    {[0,1,2].map(d=><span key={d} className="ai-dot" style={{animationDelay:`${d*0.2}s`}}/>)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {aiStep>=AI_STEPS.length && estimatedSit>=6 && (
          <div className="card" style={{marginTop:14,textAlign:"center"}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.8)",lineHeight:1.65}}>
              You sit approximately <strong style={{color:"#F6B7D8"}}>{estimatedSit} hours/day</strong>.<br/>
              6–8 micro-breaks can dramatically reduce long-term health risk.
            </p>
          </div>
        )}
      </div>
    </div>,

    /* ── 10  Plan Reveal ──────────────────────────────────────────────────── */
    <div key="s10" className="screen scrollable">
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[10]}%`}}/></div>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div className="label" style={{color:"#C9B6F2",marginBottom:6}}>✦ YOUR PERSONALIZED MOMENTUM PLAN</div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
          <Mascot charKey={charKey} mood="glowing" size={78}/>
        </div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:46,color:"#fff",lineHeight:1}}>
          {baseStepGoal.toLocaleString()}
        </div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:500}}>steps / day · Standly AI</div>
      </div>

      <div style={{display:"flex",gap:7,marginBottom:10}}>
        {[
          ["🕐",`Every ${standEvery}m`,"Stand Break"],
          ["🏃","3 × 2 min","Mobility"],
          ["📈","+5% weekly","Progression"],
        ].map(([icon,val,k])=>(
          <div key={k} className="card" style={{flex:1,textAlign:"center",padding:"11px 6px",marginBottom:0}}>
            <div style={{fontSize:18,marginBottom:3}}>{icon}</div>
            <div style={{fontWeight:700,color:"#fff",fontSize:12}}>{val}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{borderLeft:"3px solid #C9B6F2",borderRadius:"0 16px 16px 0",background:"rgba(201,182,242,0.1)",padding:"12px 14px",marginBottom:10}}>
        <div className="label" style={{color:"#C9B6F2",marginBottom:4}}>Why this plan works for you</div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.82)",lineHeight:1.65,fontWeight:500}}>
          {profile.energyPeak==="morning"
            ? "Your morning energy peak means we'll front-load movement windows — catching you at your best."
            : profile.energyPeak==="evening"
            ? "Afternoon nudges will prep your body before your evening peak — your most effective hours."
            : "Your energy profile tells us exactly when to nudge you, so every reminder lands when you're ready."}
          {profile.workPattern==="heavy_sit" ? " Your desk-heavy day means micro-breaks every hour will protect your back and sharpen focus." : ""}
        </p>
      </div>

      {(profile.healthConditions||[]).some(c=>["back","knee","neck"].includes(c)) && (
        <div className="pill" style={{marginBottom:8,fontSize:11}}>
          🧘 Pain-aware plan: exercises adapted for your health conditions.
        </div>
      )}

      <button className="btn" onClick={next}>This looks great →</button>
    </div>,

    /* ── 11  Gamification Introduction ───────────────────────────────────── */
    <div key="s11" className="screen" style={{justifyContent:"space-between"}}>
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[11]}%`}}/></div>
      <div style={{flex:1}}>
        <div className="label" style={{color:"#FFD83C",marginBottom:4}}>🏆 MOMENTUM SYSTEM</div>
        <h2 className="display" style={{marginBottom:6}}>Turn motion into <em>momentum.</em></h2>
        <p className="body" style={{fontSize:12,marginBottom:14,color:"rgba(255,255,255,0.55)"}}>
          Every action earns rewards. Every day builds identity.
        </p>
        {[
          ["⚡","#FFD83C","Momentum Points","Earn XP for every stand, step, and session"],
          ["🔥","#FF7B7B","Streak Multiplier","Consecutive days multiply your XP — exponentially"],
          ["🌱","#6FCF97","Identity Growth","Your mascot evolves as your movement identity strengthens"],
        ].map(([icon,color,title,desc])=>(
          <div key={title} className="gamif-row" style={{borderLeftColor:color,background:`${color}10`}}>
            <span style={{fontSize:22}}>{icon}</span>
            <div>
              <div style={{fontWeight:700,color:"#fff",fontSize:13,marginBottom:2}}>{title}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.62)"}}>{desc}</div>
            </div>
          </div>
        ))}
        <div className="card" style={{marginTop:4,background:"rgba(255,216,60,0.1)",borderColor:"rgba(255,216,60,0.3)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#FFD83C",marginBottom:6}}>🎁 Complete 7 days → unlock</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {["Avatar upgrade","New badge","Bonus XP boost"].map(r=>(
              <span key={r} className="badge gold" style={{fontSize:10}}>{r}</span>
            ))}
          </div>
        </div>
      </div>
      <button className="btn" onClick={next} style={{marginTop:12}}>Sounds great →</button>
    </div>,

    /* ── 12  Notification Permission ──────────────────────────────────────── */
    <div key="s12" className="screen" style={{justifyContent:"space-between"}}>
      <div className="ptrack"><div className="pfill" style={{width:`${PROGRESS[12]}%`}}/></div>
      <div style={centerCol}>
        <div style={{fontSize:54,marginBottom:14}}>🔔</div>
        <div className="label" style={{textAlign:"center",marginBottom:6,color:"#C9B6F2"}}>Smart Reminders</div>
        <h2 className="display" style={{textAlign:"center",fontSize:22,marginBottom:14}}>
          Remind you when it's <em>the right moment.</em>
        </h2>
        <div className="card" style={{textAlign:"center",background:"rgba(201,182,242,0.1)",borderColor:"rgba(201,182,242,0.3)"}}>
          <span style={{fontSize:20}}>🧠</span>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.82)",lineHeight:1.65,marginTop:6,fontWeight:500}}>
            Your reminders are timed to your{" "}
            <strong style={{color:"#C9B6F2"}}>
              {profile.energyPeak?`${profile.energyPeak} energy rhythm`:"personal energy rhythm"}
            </strong>
            {" "}— not random. The AI learns when you're most likely to respond.
          </p>
        </div>
        <div style={{display:"flex",gap:7,marginTop:12,flexWrap:"wrap",justifyContent:"center"}}>
          {[["📊","Behavior-based timing"],["🔕","Quiet hours respected"],["🎯","Adapts over time"]].map(([icon,l])=>(
            <span key={l} className="badge purple" style={{fontSize:10}}>{icon} {l}</span>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
        <button className="btn" onClick={()=>{setP(p=>({...p,notifEnabled:true})); next();}}>
          Allow Smart Reminders
        </button>
        <button className="btn-ghost" onClick={next}>Not now</button>
      </div>
    </div>,

    /* ── 13  Auth — after value demonstrated ─────────────────────────────── */
    <div key="s13" className="screen" style={{justifyContent:"space-between"}}>
      <div className="ptrack"><div className="pfill" style={{width:"100%"}}/></div>
      <div style={centerCol}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
          <Mascot charKey={charKey} mood="happy" size={96}/>
        </div>
        <div className="label" style={{textAlign:"center",color:"#6FCF97",marginBottom:6}}>ALMOST THERE</div>
        <h2 className="display" style={{textAlign:"center",fontSize:22,marginBottom:10}}>
          Save your <em>momentum.</em>
        </h2>
        <p className="body" style={{textAlign:"center",fontSize:12,marginBottom:16,color:"rgba(255,255,255,0.6)"}}>
          Sync your plan across devices and never lose your streak — even if you switch phones.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
          {[
            {icon:"G",  label:"Continue with Google", bg:"rgba(255,255,255,0.92)", color:"#1F2A44", provider:"google"},
            {icon:"🍎", label:"Continue with Apple",  bg:"#1A2A4A",               color:"#fff",    provider:"apple"},
            {icon:"✉",  label:"Continue with Email",  bg:"rgba(255,255,255,0.08)",color:"#fff",    border:"1.5px solid rgba(255,255,255,0.28)", provider:"email"},
          ].map(auth=>(
            <button key={auth.provider}
              onClick={()=>{ const r=mockAuthenticate(auth.provider); handleAuth(r); }}
              style={{
                display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                width:"100%",padding:"14px",borderRadius:20,
                background:auth.bg, color:auth.color, border:auth.border||"none",
                fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",
              }}>
              <span style={{fontSize:16,fontWeight:800}}>{auth.icon}</span>
              {auth.label}
            </button>
          ))}
        </div>
      </div>
      <button className="btn-ghost" style={{width:"100%",marginTop:8}} onClick={handleComplete}>
        Skip for now — start moving
      </button>
    </div>,
  ];

  return (
    <div style={{position:"relative",height:"100%"}}>
      {screens[Math.min(step, screens.length-1)]}
      {toast && <AuthToast message={toast} onDone={()=>setToast(null)}/>}
    </div>
  );
}


/* ══════════════════════════ CHAR REVEAL ═══════════════════════════════════ */
function CharReveal({ charKey, next }) {
  const c=CHARS[charKey]; const [show,setShow]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setShow(true),280);return()=>clearTimeout(t);},[]);
  return (
    <div className="screen" style={{alignItems:"center",justifyContent:"space-between"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div className="label" style={{textAlign:"center"}}>Your character</div>
        <div style={{marginTop:14,marginBottom:14,opacity:show?1:0,transform:show?"scale(1)":"scale(0.45)",transition:"all 0.65s cubic-bezier(0.34,1.56,0.64,1)"}}>
          <Mascot charKey={charKey} mood="glowing" size={170} evolution={2}/>
        </div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:42,color:"#fff",textAlign:"center"}}><em style={{fontStyle:"italic",color:"#F6B7D8"}}>{c.name}</em></div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",fontStyle:"italic",marginBottom:14,marginTop:4,fontFamily:"'DM Serif Display',serif"}}>{c.tagline}</div>
        <div className="card" style={{textAlign:"center"}}>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.8)",lineHeight:1.65,fontWeight:500}}>{c.desc}<br/><br/><span style={{color:"#F6B7D8",fontWeight:600}}>Standly AI shapes how {c.name} evolves with you.</span></p>
        </div>
      </div>
      <button className="btn" onClick={next} style={{width:"100%"}}>See my adaptive plan →</button>
    </div>
  );
}

/* ══════════════════════════ PLAN SCREEN ═══════════════════════════════════ */
function PlanScreen({ profile, charKey, adapted, bis, next }) {
  const c=CHARS[charKey]; const state=STATE_META[bis.bisState]??STATE_META.exploration;
  const arch=ARCHETYPES[bis.archetype]; const mi=bis.miLevel;
  return (
    <div className="screen scrollable">
      <div style={{textAlign:"center",marginBottom:12}}>
        <span style={{background:"rgba(255,255,255,0.13)",border:"1px solid rgba(255,255,255,0.26)",borderRadius:18,padding:"3px 12px",fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)"}}>✦ Standly AI Plan</span>
        <div style={{display:"flex",justifyContent:"center",marginTop:10,marginBottom:8}}><Mascot charKey={charKey} mood="happy" size={72}/></div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:48,color:"#fff",lineHeight:1}}>{adapted.steps.toLocaleString()}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:500}}>steps / day · Standly AI</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:9}}>
        {[["🕐",`Every ${adapted.interval}m`,"Reminder"],[`${state.icon}`,state.label,"AI State"],[`${arch.icon}`,arch.label.split(" ")[0],"Archetype"]].map(([icon,val,key])=>(
          <div key={key} className="card" style={{flex:1,textAlign:"center",padding:"11px 8px",marginBottom:0}}>
            <div style={{fontSize:18,marginBottom:3}}>{icon}</div>
            <div style={{fontWeight:700,color:"#fff",fontSize:12}}>{val}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{key}</div>
          </div>
        ))}
      </div>
      <div style={{borderLeft:"3px solid #F6B7D8",borderRadius:"0 16px 16px 0",background:"rgba(255,255,255,0.09)",padding:"10px 13px",marginBottom:9}}>
        <div className="label" style={{color:"#F6B7D8",marginBottom:3}}>Archetype strategy</div>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.78)",lineHeight:1.55,fontWeight:500}}>{arch.strategy}</p>
      </div>
      <div className="card" style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:22}}>{mi.icon}</span>
        <div>
          <div className="label" style={{marginBottom:2}}>Starting Identity Level</div>
          <div style={{fontWeight:700,color:"#fff",fontSize:14}}>{mi.label}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>Identity Score: {bis.miScore}/100</div>
        </div>
      </div>
      <button className="btn" onClick={next} style={{marginTop:10}}>Start with {c.name} →</button>
    </div>
  );
}

/* ══════════════════════════ DASHBOARD ═════════════════════════════════════ */
function Dashboard({ profile, charKey, bis, adapted, xp, setXp, todayIntent, controls }) {
  const state  = STATE_META[bis.bisState]??STATE_META.exploration;
  const arch   = ARCHETYPES[bis.archetype];
  const mi     = bis.miLevel;
  const stepsDone = Math.round(bis.goalAdj.adjustedSteps * 0.72);
  const goalSteps = bis.goalAdj.adjustedSteps;
  const level  = xp<300?1:xp<800?2:xp<1500?3:xp<2500?4:5;
  const lvNames= ["","Wake Up","Active Body","Momentum","Strong Habit","Master"];
  const lvT    = [0,0,300,800,1500,2500]; const lvM=[300,300,500,700,1000,500];
  const xpPct  = Math.min(((xp-lvT[level])/lvM[level])*100,100);
  const days   = ["M","T","W","T","F","S","S"];

  // EIE: Dialogue engine — burnout preemptive takes priority if risk is elevated
  const dialogue = bis.preemptiveDialogue ?? getDialogue({
    bisState:bis.bisState, miScore:bis.miScore, burnout:bis.burnout,
    momentum:bis.momentum, archetype:bis.archetype,
    motivation:profile.motivation, streak:controls.streak,
    inactiveDays:controls.inactive3, todayIntent,
  });

  // Mascot mood — burnout prediction elevates concern earlier
  const mood = controls.inactive3>=7?"tired"
    :bis.riskLevel7d.id==="burnout"||bis.riskLevel7d.id==="critical"?"concern"
    :bis.burnout>70?"concern"
    :bis.bisState==="momentum"?"glowing"
    :dialogue.tone==="energized"?"energized"
    :bis.bisState==="at_risk"?"sad"
    :bis.consistency>70?"happy":"encouraging";

  const compColor = bis.compliance==="high"?"#6FCF97":bis.compliance==="medium"?"#FFD83C":"#FF7B7B";

  // Celebration
  const [celebrate, setCelebrate] = useState(null);
  const handleXp = () => {
    const gained = Math.round(10*bis.rewardEcon.xpScale);
    setXp(x=>x+gained);
    const phrase = getCelebrationPhrase({ bisState:bis.bisState, motivation:profile.motivation, miScore:bis.miScore, xpGained:gained });
    setCelebrate(phrase);
  };

  // Churn state
  const churnState = getChurnState(controls.inactive3);

  return (
    <div className="screen scrollable" style={{position:"relative"}}>
      {/* Micro-Celebration overlay */}
      {celebrate && <CelebrationOverlay phrase={celebrate} onDone={()=>setCelebrate(null)}/>}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
        <div>
          <div className="label">{bis.dayMode.icon} {bis.dayMode.label}</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:19,color:"#fff"}}>Today</div>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
          <span className={`badge ${state.cls}`}>{state.icon} {state.label}</span>
          <span className="badge gold">⚡ {adapted.multLabel}</span>
        </div>
      </div>

      {/* Daily AI Morning Forecast */}
      <DailyForecastCard forecast={bis.dailyForecast}/>

      {/* Anti-Churn Banner */}
      {churnState==="gentle_restart"&&(
        <div className="churn-banner">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>🤍</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:"#A9D6F5",fontSize:13}}>Let's restart gently.</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>3-day mini reset challenge is ready — no penalties, no pressure.</div>
            </div>
            <span className="badge blue" style={{fontSize:10}}>3-Day Reset</span>
          </div>
        </div>
      )}
      {churnState==="ultra_light"&&(
        <div className="churn-banner" style={{borderColor:"rgba(201,182,242,0.45)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>🌱</span>
            <div>
              <div style={{fontWeight:700,color:"#C9B6F2",fontSize:13}}>Ultra-light mode active.</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>Smaller goals. No penalties. Micro tasks only. Come back at your pace.</div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Prediction Banner */}
      <div className="s-banner" style={{background:`rgba(${bis.compliancePct>68?"111,207,151":bis.compliancePct>45?"255,216,60":"255,123,123"},0.1)`,borderColor:`rgba(${bis.compliancePct>68?"111,207,151":bis.compliancePct>45?"255,216,60":"255,123,123"},0.28)`,marginBottom:8}}>
        <ComplianceArc pct={bis.compliancePct}/>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:2}}>Compliance Forecast</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.68)",lineHeight:1.4}}>
            {bis.compliancePct>=68?"Autonomy mode — fewer nudges today."
            :bis.compliancePct>=45?"Moderate — bonus XP incentive active."
            :"Low — early challenge offered now."}
          </div>
        </div>
      </div>

      {/* 48-72h Disengagement alert — shown when risk is med/high */}
      <DisengagementAlert dis={bis.disengagement}/>

      {/* Burnout Forecast Strip — shown when risk is watch or above */}
      {bis.riskLevel7d.id !== "safe" && (
        <BurnoutForecastStrip bis={bis}/>
      )}

      {/* Archetype + Identity badges */}
      <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center",flexWrap:"wrap"}}>
        <span className={`badge ${arch.cls}`}>{arch.icon} {arch.label}</span>
        <span className={`badge ${mi.cls}`}>{mi.icon} {mi.label}</span>
        {bis.isFatigue && <span className="badge blue">🌤️ Recovery Week</span>}
        {todayIntent && <span className="badge purple">
          {INTENTS.find(i=>i.id===todayIntent)?.icon} {todayIntent}
        </span>}
        {/* Stage 7: Active intervention badge */}
        {bis.selectedIntervention && (
          <span className="badge" style={{background:"rgba(201,182,242,0.18)",border:"1px solid rgba(201,182,242,0.4)",color:"#C9B6F2"}}>
            {bis.selectedIntervention.icon} {bis.selectedIntervention.label}
          </span>
        )}
      </div>

      {/* Character + Speech Bubble + Ring */}
      <div style={{marginBottom:9}}>
        {/* Speech bubble above mascot */}
        <div style={{marginBottom:6, paddingLeft:4}}>
          <SpeechBubble dialogue={dialogue}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Mascot charKey={charKey} mood={mood} size={112} evolution={bis.charEvolution}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <StepRing pct={0.72} steps={stepsDone} goal={goalSteps}/>
            {/* Engine-driven identity message under ring */}
            <div style={{fontSize:10,color:bis.goalAdj.action==="increase"?"#6FCF97":bis.goalAdj.action==="decrease"||bis.goalAdj.action==="recovery"?"#A9D6F5":"rgba(255,255,255,0.5)",fontWeight:600,textAlign:"center",maxWidth:130,lineHeight:1.3}}>
              {bis.goalAdj.identityMsg}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div className="cdot" style={{background:compColor}}/>
              <span style={{fontSize:10,fontWeight:600,color:compColor}}>{bis.compliance} compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Micro-Challenge injection */}
      {bis.microChallenge&&(
        <MicroChallengeCard
          challenge={bis.microChallenge}
          archetype={bis.archetype}
          onAccept={()=>setXp(x=>x+100)}
        />
      )}

      {/* XP — identity-based label */}
      <div className="card" style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div>
            <div className="label" style={{marginBottom:0}}>{lvNames[level]} · {bis.rewardEcon.label}</div>
            <div style={{fontWeight:700,color:"#fff",fontSize:13}}>{xp} XP</div>
          </div>
          <button className="btn-sm" onClick={handleXp}>+{Math.round(10*bis.rewardEcon.xpScale)} XP</button>
        </div>
        <div className="xp-track"><div className="xp-fill" style={{width:`${xpPct}%`}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:3,fontSize:9,color:"rgba(255,255,255,0.32)",fontWeight:600}}>
          <span>Lv {level}</span><span>Lv {Math.min(level+1,5)}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"flex",gap:7,marginBottom:8}}>
        {[["5","Stands"],["62m","Longest sit"],["35","Points"]].map(([v,l])=>(
          <div key={l} className="card" style={{flex:1,textAlign:"center",padding:"10px 6px",marginBottom:0}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#fff",lineHeight:1}}>{v}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Behavioral Memory recall */}
      {bis.memories.length>0&&(
        <div style={{marginBottom:8}}>
          <div className="label" style={{marginBottom:6}}>Emotional Memory</div>
          {bis.memories.map(m=>(
            <div key={m.id} className="memory-card">
              <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{fontSize:15}}>{m.icon}</span>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.82)",lineHeight:1.5,fontWeight:500,fontStyle:"italic"}}>"{m.text}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Streak */}
      <div className="card">
        <div className="label" style={{marginBottom:7}}>This week · 4-day streak 🔥</div>
        <div style={{display:"flex",gap:5}}>
          {["✓","✓","✓","✓","·","·","·"].map((d,i)=>(
            <div key={i} className={`sdot ${d==="✓"?i===3?"today":"done":bis.dayMode.mode==="recovery"&&i>=5?"recovery":"empty"}`}>{days[i]}</div>
          ))}
          {bis.dayMode.mode==="recovery"&&<span style={{fontSize:10,color:"#A9D6F5",fontWeight:600,marginLeft:4,alignSelf:"center"}}>Weekend Light 🌤️</span>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ REMIND SCREEN ══════════════════════════════════ */
function RemindScreen({ charKey, bis, setXp, profile }) {
  const escLevel = getEscalationLevel(bis.responsiveness);
  const esc = ESCALATION_COPY[escLevel];
  const totalSecs = bis.sedentary>65||bis.compliance==="low"?120:bis.bisState==="burnout"?240:180;
  const [secs,setSecs]=useState(totalSecs);
  const [running,setRunning]=useState(false);
  const [done,setDone]=useState(false);
  const [celebrate,setCelebrate]=useState(null);

  useEffect(()=>{ if(!running||secs<=0)return; const t=setTimeout(()=>setSecs(s=>s-1),1000); return()=>clearTimeout(t); },[running,secs]);
  useEffect(()=>{
    if(secs<=0&&running){
      setDone(true); setRunning(false);
      const gained=40; setXp(x=>x+gained);
      setCelebrate(getCelebrationPhrase({ bisState:bis.bisState, motivation:profile?.motivation, miScore:bis.miScore, xpGained:gained }));
    }
  },[secs,running]);

  const reset=()=>{ setDone(false); setSecs(totalSecs); setRunning(false); setCelebrate(null); };
  const mood = done?"glowing":running?"energized":bis.bisState==="burnout"?"concern":escLevel===3?"encouraging":"neutral";

  return (
    <div className="screen" style={{alignItems:"center",justifyContent:"center",gap:10,position:"relative"}}>
      {celebrate&&<CelebrationOverlay phrase={celebrate} onDone={()=>setCelebrate(null)}/>}
      <Mascot charKey={charKey} mood={mood} size={88} evolution={bis.charEvolution}/>
      <div className="esc-pips" style={{width:"100%"}}>
        {[1,2,3].map(l=><div key={l} className={`esc-pip${l<=escLevel?" active":""}`}/>)}
      </div>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:-6,alignSelf:"flex-start"}}>
        {escLevel===1?"Level 1 · Gentle":escLevel===2?"Level 2 · Encouraging":"Level 3 · Commitment Trigger"}
      </div>
      {bis.bisState!=="exploration"&&bis.bisState!=="stabilizing"&&(
        <span className={`badge ${STATE_META[bis.bisState]?.cls??"muted"}`} style={{fontSize:10}}>
          {STATE_META[bis.bisState]?.icon} {STATE_META[bis.bisState]?.label} Mode
        </span>
      )}
      {done?(
        <>
          <h2 className="display" style={{textAlign:"center",fontSize:24}}>Done! <em>+40 XP</em></h2>
          <div className="pill" style={{textAlign:"center",width:"100%"}}>{CHARS[charKey].name} is proud of you 🎉</div>
          <button className="btn" onClick={reset} style={{marginTop:8}}>Keep going ✓</button>
        </>
      ):(
        <>
          <div style={{textAlign:"center",width:"100%"}}>
            <div className="label" style={{textAlign:"center"}}>Escalation · Level {escLevel}</div>
            <h2 className="display" style={{fontSize:22,textAlign:"center"}}>{bis.bisState==="burnout"?"A gentle nudge 🌤️":bis.bisState==="at_risk"?"When you're ready 🤍":esc.title}</h2>
            <p className="body" style={{textAlign:"center",fontSize:12,marginTop:3,maxWidth:280}}>{bis.bisState==="burnout"?"No rush. 2 min is enough.":bis.bisState==="at_risk"?"Zero pressure. We're here.":esc.sub}</p>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}><CDRing secs={secs} total={totalSecs}/></div>
          <div className="pill" style={{textAlign:"center",fontSize:11,width:"100%"}}>🧠 {bis.bisState==="burnout"?"Burnout Mode: urgency off":bis.bisState==="at_risk"?"Recovery Mode: no penalties":esc.bonus}</div>
          {!running?(
            <div style={{width:"100%",display:"flex",flexDirection:"column",gap:8}}>
              <button className="btn" onClick={()=>{setSecs(totalSecs);setRunning(true);}}>
                {bis.bisState==="burnout"?"Start gentle stretch 🌤️":esc.cta+" ⚡"}
              </button>
              <button className="btn-ghost" onClick={()=>{ const g=10; setXp(x=>x+g); setCelebrate(getCelebrationPhrase({bisState:bis.bisState,motivation:profile?.motivation,miScore:bis.miScore,xpGained:g})); }}>
                I already moved (+10 XP)
              </button>
            </div>
          ):(
            <button className="btn-ghost" onClick={()=>{setRunning(false);setSecs(totalSecs);}}>
              {bis.bisState==="burnout"?"That's enough for now":"Remind me later"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ══════════════════════════ STATS SCREEN ════════════════════════════════ */
function StatsScreen({ charKey, bis, controls }) {
  const arcPhase = bis.arcPhase;
  const mi = bis.miLevel;
  const dayInJourney = controls.dayInJourney;

  const bars = [
    {d:"Mon",pct:95},{d:"Tue",pct:58},{d:"Wed",pct:100,best:true},
    {d:"Thu",pct:72},{d:"Fri",pct:4},{d:"Sat",pct:4,rec:true},{d:"Sun",pct:4,rec:true},
  ];

  return (
    <div className="screen scrollable">
      <div className="label">Insights</div>
      <h2 className="display" style={{marginBottom:12,fontSize:24}}>This <em>week</em></h2>

      {/* Movement Identity */}
      <div className="card" style={{display:"flex",alignItems:"center",gap:12,marginBottom:9}}>
        <span style={{fontSize:32}}>{mi.icon}</span>
        <div style={{flex:1}}>
          <div className="label" style={{marginBottom:2}}>Movement Identity</div>
          <div style={{fontWeight:700,color:"#fff",fontSize:14}}>{mi.label}</div>
          <div style={{marginTop:5}}>
            <div className="g-track"><div className="g-fill" style={{width:`${bis.miScore}%`,background:mi.color}}/></div>
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:3,fontWeight:600}}>{bis.miScore}/100 · Identity Score</div>
        </div>
      </div>

      {/* 30-Day Arc */}
      <div className="card" style={{marginBottom:9}}>
        <div className="label" style={{marginBottom:8}}>30-Day Evolution Arc · Day {dayInJourney}</div>
        {ARC_PHASES.map((p,i)=>{
          const isDone   = dayInJourney > p.end;
          const isActive = dayInJourney >= p.day && dayInJourney <= p.end;
          const isFuture = dayInJourney < p.day;
          return (
            <div key={i} className={`arc-phase ${isActive?"active":isDone?"done":"future"}`}>
              <span style={{fontSize:18}}>{p.icon}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,fontWeight:700,color:isActive?"#fff":"rgba(255,255,255,0.65)"}}>{p.label}</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:500}}>Days {p.day}–{p.end}</span>
                  {isDone&&<span style={{fontSize:10,color:"#6FCF97",fontWeight:700}}>✓</span>}
                  {isActive&&<span className="badge rose" style={{fontSize:9,padding:"2px 7px"}}>Active</span>}
                </div>
                {isActive&&<div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{p.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* HSI */}
      <div className="card" style={{marginBottom:9}}>
        <div className="label" style={{marginBottom:4,textAlign:"center"}}>Habit Stability Index</div>
        <div style={{display:"flex",justifyContent:"center"}}><HSIArc value={bis.hsi}/></div>
      </div>

      {/* Bar chart */}
      <div className="card" style={{marginBottom:9}}>
        <div className="label" style={{marginBottom:9}}>Step completion · day-of-week model</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:5,height:65,marginBottom:5}}>
          {bars.map(b=>(
            <div key={b.d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%"}}>
              <div className={`wbar${b.best?" best":b.rec?" recovery":""}`} style={{width:"100%",height:`${b.pct}%`}}/>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.42)",fontWeight:600,textTransform:"uppercase"}}>{b.d}</span>
            </div>
          ))}
        </div>
        {bis.archetype==="weekend_dropper"&&<div className="pill" style={{fontSize:11,marginTop:0}}>📅 Weekend Light Mode: Sat/Sun goals reduced to 70%</div>}
      </div>

      {/* Fatigue */}
      {bis.isFatigue&&(
        <div className="card" style={{background:"rgba(169,214,245,0.1)",borderColor:"rgba(169,214,245,0.3)",marginBottom:9}}>
          <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
            <span style={{fontSize:18}}>🌤️</span>
            <div>
              <div style={{fontWeight:700,color:"#A9D6F5",fontSize:13,marginBottom:3}}>Fatigue Pattern Detected</div>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>5 strong days followed by a sudden drop. Recovery Week Mode activated — goals reduced 5%, urgency disabled.</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="card">
        <div className="label" style={{marginBottom:7}}>Weekly summary</div>
        {[["Avg steps","5,695"],["Reminder compliance","73%"],["XP earned","+310"],["Streak","4 days 🔥"],["Archetype",ARCHETYPES[bis.archetype].label]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.65)",marginBottom:6,fontWeight:600}}>
            <span>{k}</span><strong style={{color:k==="XP earned"?"#F6B7D8":"#fff"}}>{v}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════ Standly AI PANEL ══════════════════════════════════════ */
function BISPanel({ bis, controls, setControls, adapted }) {
  const state = STATE_META[bis.bisState]??STATE_META.exploration;
  const arch  = ARCHETYPES[bis.archetype];
  const [tab, setTab] = useState("scores");

  const Gauge=({label,value,color})=>(
    <div className="gauge-wrap" style={{marginBottom:9}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.72)"}}>{label}</span>
        <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{value}</span>
      </div>
      <div className="g-track"><div className="g-fill" style={{width:`${value}%`,background:color}}/></div>
    </div>
  );
  const Sl=({label,k,min=0,max=100,step=1})=>(
    <div className="sl-wrap">
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:2}}>
        <span>{label}</span><span>{controls[k]}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={controls[k]}
        onChange={e=>setControls(c=>({...c,[k]:+e.target.value}))}/>
    </div>
  );
  const Toggle=({label,k,opts})=>(
    <div style={{marginBottom:9}}>
      <div className="label" style={{marginBottom:5}}>{label}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {opts.map(v=>(
          <span key={String(v)} onClick={()=>setControls(c=>({...c,[k]:v}))}
            style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:12,cursor:"pointer",
              background:controls[k]===v?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.1)",
              color:controls[k]===v?"#1F2A44":"rgba(255,255,255,0.68)",transition:"all 0.15s"}}>
            {String(v)}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="screen scrollable">
      <div className="label">Standly AI</div>
      <h2 className="display" style={{marginBottom:10,fontSize:22}}>Standly <em>AI Engine</em></h2>

      {/* Sub-tabs — 7 tabs */}
      <div style={{display:"flex",gap:3,marginBottom:12,flexWrap:"wrap"}}>
        {[["scores","Scores"],["burnout","🔥"],["goal","Goal"],["ai","🧠 AI"],["s7","🔄 Learn"],["stage2","Deep AI"],["simulate","Sim"]].map(([id,l])=>(
          <span key={id} onClick={()=>setTab(id)}
            style={{flex:"1 1 auto",textAlign:"center",fontSize:9,fontWeight:700,padding:"7px 2px",borderRadius:12,cursor:"pointer",
              background:tab===id?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.1)",
              color:tab===id?"#1F2A44":"rgba(255,255,255,0.65)",transition:"all 0.15s",whiteSpace:"nowrap"}}>
            {l}
          </span>
        ))}
      </div>

      {tab==="s7"&&(
        <Stage7Panel bis={bis} controls={controls} setControls={setControls}/>
      )}

      {tab==="ai"&&(
        <AILayerPanel bis={bis} controls={controls}/>
      )}

      {tab==="burnout"&&(
        <BurnoutPredictionPanel bis={bis} controls={controls}/>
      )}

      {tab==="goal"&&(
        <GoalEnginePanel bis={bis} controls={controls} adapted={adapted}/>
      )}

      {tab==="scores"&&(
        <>
          <div className="s-banner" style={{background:`${state.color}18`,borderColor:`${state.color}40`,marginBottom:10}}>
            <span style={{fontSize:20}}>{state.icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{state.label} Phase</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2}}>{state.desc}</div>
            </div>
          </div>
          <div className="card" style={{marginBottom:9}}>
            <div className="label" style={{marginBottom:8}}>Your Scores</div>
            {SCORE_META.map(m=>(
              <Gauge key={m.key} label={m.label} color={m.color}
                value={m.key==="consistency"?bis.consistency:m.key==="responsiveness"?bis.responsiveness:m.key==="sedentary"?bis.sedentary:m.key==="momentum"?bis.momentum:m.key==="burnout"?bis.burnout:bis.engagement}/>
            ))}
          </div>
          <div className="card">
            <div className="label" style={{marginBottom:6,textAlign:"center"}}>Habit Stability Index</div>
            <div style={{display:"flex",justifyContent:"center"}}><HSIArc value={bis.hsi}/></div>
            <div style={{textAlign:"center",marginTop:4}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600}}>Compliance today: </span>
              <span style={{fontSize:11,fontWeight:700,color:bis.compliancePct>=68?"#6FCF97":bis.compliancePct>=45?"#FFD83C":"#FF7B7B"}}>{bis.compliancePct}%</span>
            </div>
          </div>
        </>
      )}

      {tab==="stage2"&&(
        <>
          {/* Archetype */}
          <div className="card" style={{marginBottom:9,background:`${arch.color}14`,borderColor:`${arch.color}33`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:24}}>{arch.icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{arch.label}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:1}}>{arch.desc}</div>
              </div>
            </div>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:8,fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>
              <strong style={{color:"#F6B7D8",display:"block",marginBottom:3,fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em"}}>Strategy Active</strong>
              {arch.strategy}
            </div>
          </div>

          {/* Movement Identity */}
          <div className="card" style={{marginBottom:9}}>
            <div className="label" style={{marginBottom:8}}>Movement Identity Score</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:26}}>{bis.miLevel.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:"#fff",fontSize:13}}>{bis.miLevel.label}</div>
                <div className="g-track" style={{marginTop:5}}><div className="g-fill" style={{width:`${bis.miScore}%`,background:bis.miLevel.color}}/></div>
              </div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#fff"}}>{bis.miScore}</div>
            </div>
            {IDENTITY_LEVELS.map((l,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,opacity:bis.miScore>=l.min?1:0.35}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:l.color,flexShrink:0}}/>
                <span style={{fontSize:11,color:bis.miScore>=l.min?l.color:"rgba(255,255,255,0.4)",fontWeight:600}}>{l.label}</span>
                <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginLeft:"auto"}}>≥{l.min}</span>
              </div>
            ))}
          </div>

          {/* 30-day arc */}
          <div className="card" style={{marginBottom:9}}>
            <div className="label" style={{marginBottom:7}}>30-Day Arc · Day {controls.dayInJourney}</div>
            {ARC_PHASES.map((p,i)=>{
              const isDone=controls.dayInJourney>p.end, isActive=controls.dayInJourney>=p.day&&controls.dayInJourney<=p.end;
              return (
                <div key={i} className={`arc-phase ${isActive?"active":isDone?"done":"future"}`}>
                  <span style={{fontSize:16}}>{p.icon}</span>
                  <div>
                    <span style={{fontSize:12,fontWeight:700,color:isActive?"#fff":"rgba(255,255,255,0.6)"}}>{p.label}</span>
                    {isActive&&<span className="badge rose" style={{marginLeft:6,fontSize:9,padding:"1px 7px"}}>Now</span>}
                    {isDone&&<span style={{marginLeft:6,fontSize:10,color:"#6FCF97",fontWeight:700}}>✓ Done</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Adaptive Reward Economy */}
          <div className="card" style={{marginBottom:9}}>
            <div className="label" style={{marginBottom:6}}>Adaptive Reward Economy</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:20}}>💰</span>
              <div>
                <div style={{fontWeight:700,color:"#fff",fontSize:13}}>{bis.rewardEcon.label}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{bis.rewardEcon.desc}</div>
              </div>
            </div>
            {[["XP Scale",`×${bis.rewardEcon.xpScale}`],["Level Scale",`×${bis.rewardEcon.levelScale}`],["Curve",bis.rewardEcon.curve]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:5,fontWeight:600}}>
                <span>{k}</span><strong style={{color:"#fff"}}>{v}</strong>
              </div>
            ))}
          </div>

          {/* Day of week model */}
          <div className="card">
            <div className="label" style={{marginBottom:6}}>Day-of-Week Model</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>{bis.dayMode.icon}</span>
              <div>
                <div style={{fontWeight:700,color:"#fff",fontSize:13}}>{bis.dayMode.label}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{bis.dayMode.desc}</div>
              </div>
              {bis.dayMode.mode==="recovery"&&<span className="badge blue" style={{marginLeft:"auto"}}>×0.7 goal</span>}
            </div>
          </div>
        </>
      )}

      {tab==="simulate"&&(
        <div className="card">
          <div className="label" style={{marginBottom:10}}>🎛️ Simulate Behavior</div>
          <Sl label="Base step goal" k="baseSteps" min={3000} max={12000} step={100}/>
          <Sl label="14-day goal completion (%)" k="c14"/>
          <Sl label="Reminder responsiveness" k="responsiveness"/>
          <Sl label="Streak (days)" k="streak" min={0} max={30}/>
          <Sl label="Consecutive reminders done" k="consecReminders" min={0} max={8}/>
          <Sl label="Avg sitting (min)" k="avgSitting" min={0} max={180}/>
          <Sl label="Ignored stands" k="ignoredStands" min={0} max={10}/>
          <Sl label="Burnout signals (0–3)" k="burnoutSignals" min={0} max={3}/>
          <Sl label="Day in journey (1–30)" k="dayInJourney" min={1} max={30}/>
          <Sl label="Weekday completion (%)" k="weekdayC"/>
          <Sl label="Weekend completion (%)" k="weekendC"/>
          <Sl label="Morning responsiveness" k="morningR"/>
          <Sl label="Afternoon responsiveness" k="afternoonR"/>
          <Sl label="App open freq (/7 days)" k="openFreq" min={0} max={7}/>
          <Toggle label="Today (weekday/weekend)" k="todayDOW" opts={["weekday","weekend"]}/>
          <Toggle label="Commitment" k="commitment" opts={["light","balanced","high"]}/>
          <Toggle label="Burst Pattern" k="burstPattern" opts={[true,false]}/>
          <Toggle label="Slow & Steady" k="slowSteady" opts={[true,false]}/>
          <Toggle label="New User" k="isNewUser" opts={[true,false]}/>
          <Toggle label="Recovers Fast" k="recoversFast" opts={[true,false]}/>
          <div style={{marginBottom:8}}>
            <div className="label" style={{marginBottom:5}}>Last 5 days (1=done)</div>
            <div style={{display:"flex",gap:5}}>
              {controls.last5Days.map((v,i)=>(
                <span key={i} onClick={()=>setControls(c=>{const a=[...c.last5Days];a[i]=a[i]?0:1;return{...c,last5Days:a};})}
                  style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,fontWeight:700,
                    background:v?"linear-gradient(135deg,#C9B6F2,#C9B6F2)":"rgba(255,255,255,0.12)",
                    color:v?"#1F2A44":"rgba(255,255,255,0.5)"}}>
                  {v?"✓":"·"}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════ ROOT APP ═══════════════════════════════════════ */
const NAV = [
  {id:"home",   icon:"🏠", label:"Home"},
  {id:"remind", icon:"🔔", label:"Move"},
  {id:"stats",  icon:"📊", label:"Stats"},
  {id:"journey",icon:"🗺️", label:"Journey"},
  {id:"bis",    icon:"🧠", label:"AI"},
];

export default function App() {
  /* ── Core phase machine ─────────────────────────────────────────────────
     onboard → auth_restore → welcome_back → app     (returning user path)
     onboard → reveal → plan → intent → app           (new user path)
     ────────────────────────────────────────────────────────────────────── */
  const [splash,setSplash]     = useState(true);
  const [phase,setPhase]       = useState("onboard");
  const [authUser,setAuthUser] = useState(null);  // resolved user from DB

  const [profile,setProfile]   = useState({
    bmi:24, activity:"low", goal:"wellness",
    commitment:"balanced", workHours:"6-8",
    pain:false, motivation:"gentle",
  });
  const [charKey,setCharKey]   = useState("mellow");
  const [tab,setTab]           = useState("home");
  const [xp,setXp]             = useState(150);
  const [todayIntent,setIntent]= useState(null);

  const [controls, setControls] = useState({
    c14:75, streak:4, inactive3:0,
    responsiveness:65, consecReminders:3,
    avgSitting:75, ignoredStands:2,
    workHours:"6-8", commitment:"balanced",
    burnoutSignals:0, isNewUser:false,
    openFreq:5, moodLogs:3, reportViews:1, rewardInteract:1,
    weekdayC:80, weekendC:38,
    morningR:72, afternoonR:35,
    burstPattern:false, slowSteady:false,
    dayInJourney:18, todayDOW:"weekday",
    recoversFast:true,
    last5Days:[1,1,1,1,0], last2Days:[0,0],
    baseSteps:7000,
    motivation:"gentle",
    weights: { ...INITIAL_WEIGHTS },
  });

  useEffect(()=>{
    setControls(c=>({...c,commitment:profile.commitment,workHours:profile.workHours??"6-8"}));
  },[profile.commitment,profile.workHours]);

  /* ── Auth restore: called when returning user identified mid-onboarding ──
     Loads their behavioral_state from DB into controls + jumps to restore.  */
  const handleAuthRestore = useCallback((user) => {
    setAuthUser(user);
    // Load stored behavioral state if available
    if (user.behavioral_state) {
      setControls(c => ({ ...c, ...user.behavioral_state, weights: { ...INITIAL_WEIGHTS } }));
      setCharKey(user.mascot_key ?? "mellow");
      setXp(user.xp ?? 150);
      // Map motivation from stored profile
      setProfile(p => ({ ...p, motivation: user.behavioral_state.motivation ?? "gentle", commitment: user.behavioral_state.commitment ?? "balanced" }));
    }
    setPhase("auth_restore");
  }, []);

  /* ── Onboarding complete (new user hits contract screen) ── */
  const handleOnboardComplete = useCallback((p, ck) => {
    setProfile(p); setCharKey(ck); setPhase("reveal");
  }, []);

  /* ── Restore done → welcome_back overlay → app ── */
  const handleRestoreDone  = useCallback(()=>setPhase("welcome_back"),[]);
  const handleWelcomeDone  = useCallback(()=>setPhase("app"),[]);
  const handleSplashDone   = useCallback(()=>setSplash(false),[]);
  const handleIntentSet    = useCallback((intent)=>{ setIntent(intent); setPhase("app"); },[]);

  const bis     = useBIS(controls);
  const basePlan = useMemo(()=>calcBasePlan(profile),[profile]);
  const adapted  = useMemo(()=>adaptPlan({
    baseSteps:basePlan.steps, baseInterval:basePlan.interval,
    bisState:bis.bisState, burnout:bis.burnout,
    c14:controls.c14, commitment:profile.commitment,
    dayMode:bis.dayMode, arcPhase:bis.arcPhase,
  }),[basePlan,bis,controls,profile]);

  const time = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});

  const PHONE_BG = {
    momentum:        "linear-gradient(160deg,#7B4DB8 0%,#9870D0 45%,#BFA0E8 100%)",
    high_discipline: "linear-gradient(160deg,#5B2E90 0%,#7545B0 45%,#A478D5 100%)",
    burnout:         "linear-gradient(160deg,#6840A8 0%,#8860C8 45%,#B090DC 100%)",
    at_risk:         "linear-gradient(160deg,#5E3878 0%,#7A58A0 45%,#A880C5 100%)",
    new_user:        "linear-gradient(160deg,#6B3FA0 0%,#8B5EC0 45%,#B08ADE 100%)",
  };
  const rootBg = phase==="app"
    ? (PHONE_BG[bis.bisState] ?? "linear-gradient(160deg,#6B3FA0 0%,#8B5EC0 45%,#B08ADE 100%)")
    : "linear-gradient(160deg,#6B3FA0 0%,#8B5EC0 45%,#B08ADE 100%)";

  const renderContent = () => {
    /* ── Returning user path ── */
    if (phase==="auth_restore")
      return <RestoringProgressScreen user={authUser} onDone={handleRestoreDone}/>;
    if (phase==="welcome_back")
      return <WelcomeBackOverlay user={authUser} onDone={handleWelcomeDone}/>;

    /* ── New user onboarding path ── */
    if (phase==="onboard")
      return <OnboardingFlow
                onComplete={handleOnboardComplete}
                onAuthRestore={handleAuthRestore}
             />;
    if (phase==="reveal")
      return <CharReveal charKey={charKey} next={()=>setPhase("plan")}/>;
    if (phase==="plan")
      return <PlanScreen profile={profile} charKey={charKey} adapted={adapted} bis={bis} next={()=>setPhase("intent")}/>;
    if (phase==="intent")
      return <IntentPrompt onSelect={handleIntentSet}/>;

    /* ── Main app ── */
    if (tab==="home")    return <Dashboard key="d" profile={profile} charKey={charKey} bis={bis} adapted={adapted} xp={xp} setXp={setXp} todayIntent={todayIntent} controls={controls}/>;
    if (tab==="remind")  return <RemindScreen key="r" charKey={charKey} bis={bis} setXp={setXp} profile={profile}/>;
    if (tab==="stats")   return <StatsScreen key="s" charKey={charKey} bis={bis} controls={controls}/>;
    if (tab==="journey") return <JourneyTab key="j" charKey={charKey} bis={bis} controls={controls}/>;
    if (tab==="bis")     return <BISPanel key="b" bis={bis} controls={controls} setControls={setControls} adapted={adapted}/>;
  };

  return (
    <>
      <Styles/>
      <div className="root" style={{background:rootBg, transition:"background 1.6s ease"}}>
        <div className="phone" style={{position:"relative"}}>

          {/* ── Splash (absolute overlay, shows first) ── */}
          {splash && (
            <SplashScreen controls={controls} onDone={handleSplashDone} isFirstTime={true}/>
          )}

          <div className="sbar">
            <span>{time}</span>
            <span style={{letterSpacing:3,fontSize:10}}>● ● ●</span>
          </div>

          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {renderContent()}
          </div>

          {phase==="app" && (
            <div className="nav">
              {NAV.map(n=>(
                <div key={n.id} className={`nitem${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>
                  <span className="nitem-icon">{n.icon}</span>
                  <span>{n.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
