'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getTVSettings,
  saveTVSettings,
  TVSettings,
  DEFAULT_SETTINGS
} from '@/lib/settings/settingsManager';
import { playAzanAudio, stopAzanAudio } from '@/lib/audio/azanAudioEngine';
import { fetchLiveWeather, WeatherData } from '@/lib/weather/weatherEngine';

export default function AdminPage() {
  const [settings, setSettings] = useState<TVSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'general' | 'prayer' | 'audio' | 'weather' | 'background' | 'announcements' | 'special'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testWeather, setTestWeather] = useState<WeatherData | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [newSlideUrl, setNewSlideUrl] = useState('');

  useEffect(() => {
    setSettings(getTVSettings());
  }, []);

  const handleSave = () => {
    saveTVSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestAudio = (url: string) => {
    if (!url) return alert('Please specify an audio URL first.');
    playAzanAudio(url, settings.azanAudio.volume || 1.0);
  };

  const handleTestWeatherFetch = async () => {
    const res = await fetchLiveWeather(
      settings.weather.latitude,
      settings.weather.longitude,
      settings.weather.city
    );
    setTestWeather(res);
  };

  const addAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setSettings({
      ...settings,
      announcements: [...settings.announcements, newAnnouncement.trim()]
    });
    setNewAnnouncement('');
  };

  const removeAnnouncement = (index: number) => {
    const updated = settings.announcements.filter((_, i) => i !== index);
    setSettings({ ...settings, announcements: updated });
  };

  const addSlideUrl = () => {
    if (!newSlideUrl.trim()) return;
    setSettings({
      ...settings,
      background: {
        ...settings.background,
        slides: [...(settings.background.slides || []), newSlideUrl.trim()]
      }
    });
    setNewSlideUrl('');
  };

  const removeSlideUrl = (index: number) => {
    const updated = settings.background.slides.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      background: { ...settings.background, slides: updated }
    });
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Top Header Bar */}
      <header className="flex flex-wrap justify-between items-center mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🕌</span>
            <div>
              <h1 className="text-3xl font-black text-amber-400 tracking-wide">
                MOSQUE ADMIN CONSOLE
              </h1>
              <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
                BIN FAIZAL&apos;S SMART TV MANAGEMENT SUITE
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-bold animate-pulse">
              ✓ Settings Broadcast Live to TV!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-amber-500/30 uppercase tracking-wider"
          >
            Save All Changes
          </button>
          <Link
            href="/tv"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
          >
            🖥️ Launch TV Screen →
          </Link>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-3">
        {[
          { id: 'general', label: '🕌 Mosque & Contact', icon: '📞' },
          { id: 'prayer', label: '🕒 Prayer & Iqamah', icon: '⏱️' },
          { id: 'audio', label: '🔊 Azan Audio', icon: '🎵' },
          { id: 'weather', label: '🌤️ Live Weather', icon: '🌡️' },
          { id: 'background', label: '🖼️ Background & Video', icon: '📺' },
          { id: 'announcements', label: '📢 Announcements Ticker', icon: '💬' },
          { id: 'special', label: '🌙 Special Prayers', icon: '✨' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* TAB 1: General & Contact Info */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400 mb-4 border-b border-slate-800 pb-2">
              General Branding & Permanent Contact Bar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Mosque Name</label>
                <input
                  type="text"
                  value={settings.mosqueName}
                  onChange={(e) => setSettings({ ...settings, mosqueName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-semibold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Display Name</label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-semibold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">📞 Primary Contact Phone Number</label>
                <input
                  type="text"
                  value={settings.contact.phone}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">📱 WhatsApp Number (Optional)</label>
                <input
                  type="text"
                  value={settings.contact.whatsapp}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: { ...settings.contact, whatsapp: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">✉ Email Address</label>
                <input
                  type="text"
                  value={settings.contact.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">🌐 Mosque Website</label>
                <input
                  type="text"
                  value={settings.contact.website}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: { ...settings.contact, website: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Prayer & Iqamah Times */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400 mb-2">
              Iqamah Calculation Offsets & Azan Overrides
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Set how many minutes after Azan the Iqamah starts for each prayer.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((key) => (
                <div key={key} className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs font-black uppercase text-amber-400 block mb-3">
                    {key} Prayer
                  </span>

                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Iqamah Delay (Minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.iqamahOffsets[key]}
                      onChange={(e) => setSettings({
                        ...settings,
                        iqamahOffsets: {
                          ...settings.iqamahOffsets,
                          [key]: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Manual Custom Iqamah Time (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 05:00 (24h format)"
                      value={settings.customIqamahTimes?.[key] || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        customIqamahTimes: {
                          ...settings.customIqamahTimes,
                          [key]: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Azan Audio */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400 mb-2">
              Full Azan Audio Settings & MP3 Assignments
            </h2>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="text-sm font-bold text-slate-200">Enable Full Azan Audio Broadcast:</label>
              <input
                type="checkbox"
                checked={settings.azanAudio.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  azanAudio: { ...settings.azanAudio, enabled: e.target.checked }
                })}
                className="w-5 h-5 accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  🕌 Fajr Azan MP3 URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={settings.azanAudio.fajrAudio}
                    onChange={(e) => setSettings({
                      ...settings,
                      azanAudio: { ...settings.azanAudio, fajrAudio: e.target.value }
                    })}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleTestAudio(settings.azanAudio.fajrAudio)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                  >
                    ▶ Test Audio
                  </button>
                  <button
                    onClick={stopAzanAudio}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    ⏹ Stop
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  ☀ Standard Daily Azan MP3 URL (Dhuhr, Asr, Maghrib, Isha)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={settings.azanAudio.dhuhrAudio}
                    onChange={(e) => setSettings({
                      ...settings,
                      azanAudio: {
                        ...settings.azanAudio,
                        dhuhrAudio: e.target.value,
                        asrAudio: e.target.value,
                        maghribAudio: e.target.value,
                        ishaAudio: e.target.value,
                      }
                    })}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleTestAudio(settings.azanAudio.dhuhrAudio)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                  >
                    ▶ Test Audio
                  </button>
                  <button
                    onClick={stopAzanAudio}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    ⏹ Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Weather */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400 mb-2">
              Live Weather Detection & Coordinates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">City Name</label>
                <input
                  type="text"
                  value={settings.weather.city}
                  onChange={(e) => setSettings({
                    ...settings,
                    weather: { ...settings.weather, city: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={settings.weather.latitude}
                  onChange={(e) => setSettings({
                    ...settings,
                    weather: { ...settings.weather, latitude: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={settings.weather.longitude}
                  onChange={(e) => setSettings({
                    ...settings,
                    weather: { ...settings.weather, longitude: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleTestWeatherFetch}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                🔄 Test Fetch Weather API Now
              </button>
            </div>

            {testWeather && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/40 text-xs font-mono space-y-1">
                <div className="text-emerald-400 font-bold">Weather API Response OK:</div>
                <div>Condition: {testWeather.icon} {testWeather.condition}</div>
                <div>Temperature: {testWeather.tempC}°C | Humidity: {testWeather.humidity}%</div>
                <div>Wind Speed: {testWeather.windSpeedKmH} km/h</div>
                <div>Sunrise: {testWeather.sunrise} | Sunset: {testWeather.sunset}</div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Background */}
        {activeTab === 'background' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400 mb-2">
              Background System (Slideshow & Video Streaming)
            </h2>

            <div className="flex gap-4">
              {(['slideshow', 'video'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSettings({
                    ...settings,
                    background: { ...settings.background, type }
                  })}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase transition-all ${
                    settings.background.type === type
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {type === 'slideshow' ? '🖼️ Wallpaper Slideshow' : '🎥 MP4 Video Background'}
                </button>
              ))}
            </div>

            {settings.background.type === 'video' ? (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Background Video URL (.mp4 / .webm)
                </label>
                <input
                  type="text"
                  value={settings.background.videoUrl}
                  placeholder="https://example.com/mosque-background.mp4"
                  onChange={(e) => setSettings({
                    ...settings,
                    background: { ...settings.background, videoUrl: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Slideshow Wallpapers List
                </label>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newSlideUrl}
                    onChange={(e) => setNewSlideUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none"
                  />
                  <button
                    onClick={addSlideUrl}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    + Add Wallpaper
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {settings.background.slides.map((url, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-xs font-mono truncate max-w-xs text-slate-300">{url}</span>
                      <button
                        onClick={() => removeSlideUrl(idx)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Dark Overlay Opacity ({settings.background.overlayOpacity}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.background.overlayOpacity}
                  onChange={(e) => setSettings({
                    ...settings,
                    background: { ...settings.background, overlayOpacity: parseInt(e.target.value) || 50 }
                  })}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Slideshow Interval ({settings.background.slideIntervalSeconds} Seconds)
                </label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={settings.background.slideIntervalSeconds}
                  onChange={(e) => setSettings({
                    ...settings,
                    background: { ...settings.background, slideIntervalSeconds: parseInt(e.target.value) || 10 }
                  })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Announcements Ticker */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400 mb-2">
              Scrolling Bottom Announcement Ticker
            </h2>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter new announcement text..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={addAnnouncement}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl uppercase"
              >
                + Add Announcement
              </button>
            </div>

            <div className="space-y-3">
              {settings.announcements.map((ann, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-sm text-slate-200 font-medium">{ann}</span>
                  <button
                    onClick={() => removeAnnouncement(idx)}
                    className="px-3 py-1.5 bg-red-950/80 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold hover:bg-red-900"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Special Prayers */}
        {activeTab === 'special' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-amber-400 mb-2">
              Special Prayer Schedules (Jumu&apos;ah, Taraweeh, Eid)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(settings.specialPrayers).map(([key, item]) => (
                <div key={key} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-amber-400 uppercase">{item.title}</span>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                      <span>Enable:</span>
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          specialPrayers: {
                            ...settings.specialPrayers,
                            [key]: { ...item, enabled: e.target.checked }
                          }
                        })}
                        className="w-4 h-4 accent-amber-400 cursor-pointer"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Khutbah / Event Time</label>
                    <input
                      type="text"
                      value={item.khutbahTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        specialPrayers: {
                          ...settings.specialPrayers,
                          [key]: { ...item, khutbahTime: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Iqamah Time</label>
                    <input
                      type="text"
                      value={item.iqamahTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        specialPrayers: {
                          ...settings.specialPrayers,
                          [key]: { ...item, iqamahTime: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Notes / Guidelines</label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => setSettings({
                        ...settings,
                        specialPrayers: {
                          ...settings.specialPrayers,
                          [key]: { ...item, notes: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
