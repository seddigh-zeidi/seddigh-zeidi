#!/usr/bin/env python3
"""
راه‌انداز اصلی سیستم سئو
"""
import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print(" 🚀 سیستم سئو و تولید محتوای حرفه‌ای")
    print("=" * 60)
    print()
    print("📡 سرور در حال راه‌اندازی...")
    print("🌐 دسترسی: http://localhost:8000")
    print("📊 داشبورد: http://localhost:8000/dashboard")
    print()
    print("⏸️  برای توقف: Ctrl+C")
    print("=" * 60)
    print()

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
