"use client";

import { useState, useEffect, useRef } from "react";

export default function MueenApp() {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState("اجلس في منتصف الكرسي واستعد للبدء");
  const [statusColor, setStatusColor] = useState("bg-blue-500");
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper for Browser Text-to-Speech (Arabic)
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // Stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.9; // Slower speed for elderly users
    window.speechSynthesis.speak(utterance);
  };

  // Start the 30-Second Chair Stand Test
  const startTest = () => {
    speak("سنبدأ اختبار الجلوس والوقوف الآن. قف واجلس بأكبر عدد ممكن.");
    setIsStarted(true);
    setTimeLeft(30);
    setReps(0);
    setFeedback("اختبار قيد التنفيذ...");
    setStatusColor("bg-green-500");

    // Access Phone/Webcam Camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera access error:", err));
  };

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isStarted) {
      setIsStarted(false);
      setFeedback("انتهى الوقت! أحسنت على مجهودك.");
      speak("انتهى الوقت، أحسنت على مجهودك");
      setStatusColor("bg-red-500");
    }
    return () => clearTimeout(timer);
  }, [isStarted, timeLeft]);

  // Simulate a rep for demo purposes (or connect MediaPipe JS here)
  const simulateRep = (type: string) => {
    if (!isStarted) return;
    if (type === "good") {
      setReps((prev) => prev + 1);
      setFeedback("أحسنت! حركة صحيحة.");
      speak("أحسنت");
    } else if (type === "lean") {
      setFeedback("تحذير: لا تنحن للأمام كثيراً!");
      speak("حافظ على ظهرك مستقيماً، لا تنحن للأمام كثيراً");
    } else if (type === "arms") {
      setFeedback("تحذير: لا تستخدم يديك للدفع!");
      speak("لا تستخدم يديك للدفع");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-6 font-sans" dir="rtl">
      {/* Header with Accessibility Read-Aloud Button */}
      <header className="w-full max-w-md flex justify-between items-center bg-slate-800 p-4 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-400">تطبيق معين (Mueen)</h1>
        <button
          onClick={() => speak("أهلاً بك في تطبيق معين لمساعدة كبار السن على التمارين الرياضية.")}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow"
        >
          🔊 قراءة الصفحة
        </button>
      </header>

      {/* Main Camera & Feedback Screen */}
      <div className="w-full max-w-md flex flex-col items-center my-4 gap-4">
        <div className="relative w-full h-72 bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!isStarted && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-6 text-center">
              <p className="text-lg text-slate-200">اضغط على زر البدء لتشغيل الكاميرا والمدرب الصوتي</p>
            </div>
          )}
        </div>

        {/* Dynamic Feedback Banner */}
        <div className={`w-full p-4 rounded-2xl text-center text-lg font-bold shadow-md transition-colors ${statusColor} text-white`}>
          {feedback}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-slate-800 p-4 rounded-2xl text-center shadow">
            <p className="text-sm text-slate-400">التكرارات (Reps)</p>
            <p className="text-4xl font-black text-emerald-400">{reps}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl text-center shadow">
            <p className="text-sm text-slate-400">الوقت المتبقي</p>
            <p className="text-4xl font-black text-amber-400">{timeLeft}ث</p>
          </div>
        </div>

        {/* Hackathon Demo Simulation Buttons */}
        {isStarted && (
          <div className="flex gap-2 w-full mt-2">
            <button onClick={() => simulateRep("good")} className="flex-1 bg-emerald-700 p-3 rounded-xl text-sm font-bold">
              ✅ تكرار صحيح
            </button>
            <button onClick={() => simulateRep("lean")} className="flex-1 bg-amber-700 p-3 rounded-xl text-sm font-bold">
              ⚠️ انحناء زائد
            </button>
            <button onClick={() => simulateRep("arms")} className="flex-1 bg-rose-700 p-3 rounded-xl text-sm font-bold">
              ⚠️ استخدام اليدين
            </button>
          </div>
        )}
      </div>

      {/* Big Touch-Friendly Action Button */}
      <div className="w-full max-w-md">
        {!isStarted ? (
          <button
            onClick={startTest}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-2xl py-4 rounded-2xl shadow-xl transition-transform active:scale-95"
          >
            ابدأ التارين الآن 🚀
          </button>
        ) : (
          <button
            onClick={() => setIsStarted(false)}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xl py-4 rounded-2xl shadow-xl"
          >
            إيقاف التمرين ⏹️
          </button>
        )}
      </div>
    </main>
  );
}