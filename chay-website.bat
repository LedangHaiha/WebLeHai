@echo off
title CHAY WEBSITE PORTAL THCS DONG TAN
echo =======================================================
echo 🚀 KHỞI ĐỘNG CỔNG THÔNG TIN ĐIỆN TỬ THCS ĐỒNG TÂN
echo 🌐 Đang kích hoạt Server và Giao diện tại http://localhost:3001
echo =======================================================
cd /d "%~dp0"
node server/server.js
pause
