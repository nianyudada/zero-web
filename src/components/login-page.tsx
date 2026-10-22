import React, { useState, useEffect, useRef } from "react";
import loginBgVideo from "@/imports/loginbg.mp4";
import {
  Eye,
  EyeOff,
  QrCode,
  ChevronRight,
  X,
  Sparkles,
  Leaf,
  Network,
  Zap,
  TrendingUp,
} from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

type LoginTab = "miniapp" | "sms" | "password";

const QR_MINI = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect
      x="4"
      y="4"
      width="20"
      height="20"
      rx="2"
      fill="#1a1a1a"
    />
    <rect
      x="8"
      y="8"
      width="12"
      height="12"
      rx="1"
      fill="white"
    />
    <rect
      x="10"
      y="10"
      width="8"
      height="8"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="40"
      y="4"
      width="20"
      height="20"
      rx="2"
      fill="#1a1a1a"
    />
    <rect
      x="44"
      y="8"
      width="12"
      height="12"
      rx="1"
      fill="white"
    />
    <rect
      x="46"
      y="10"
      width="8"
      height="8"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="4"
      y="40"
      width="20"
      height="20"
      rx="2"
      fill="#1a1a1a"
    />
    <rect
      x="8"
      y="44"
      width="12"
      height="12"
      rx="1"
      fill="white"
    />
    <rect
      x="10"
      y="46"
      width="8"
      height="8"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="4"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="4"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="10"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="10"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="16"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="4"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="10"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="16"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="40"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="46"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="52"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="34"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="40"
      y="34"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="52"
      y="34"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="40"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="40"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="46"
      y="40"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="46"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="40"
      y="46"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="52"
      y="46"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="52"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="52"
      y="52"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="58"
      y="40"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="58"
      y="52"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
  </svg>
);

const QR_SERVICE = (
  <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
    <rect
      x="4"
      y="4"
      width="20"
      height="20"
      rx="2"
      fill="#1a1a1a"
    />
    <rect
      x="8"
      y="8"
      width="12"
      height="12"
      rx="1"
      fill="white"
    />
    <rect
      x="10"
      y="10"
      width="8"
      height="8"
      rx="0.5"
      fill="#16a34a"
    />
    <rect
      x="40"
      y="4"
      width="20"
      height="20"
      rx="2"
      fill="#1a1a1a"
    />
    <rect
      x="44"
      y="8"
      width="12"
      height="12"
      rx="1"
      fill="white"
    />
    <rect
      x="46"
      y="10"
      width="8"
      height="8"
      rx="0.5"
      fill="#16a34a"
    />
    <rect
      x="4"
      y="40"
      width="20"
      height="20"
      rx="2"
      fill="#1a1a1a"
    />
    <rect
      x="8"
      y="44"
      width="12"
      height="12"
      rx="1"
      fill="white"
    />
    <rect
      x="10"
      y="46"
      width="8"
      height="8"
      rx="0.5"
      fill="#16a34a"
    />
    <rect
      x="28"
      y="4"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="4"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="10"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="16"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="16"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="4"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="16"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="40"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="52"
      y="28"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="34"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="46"
      y="34"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="40"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="46"
      y="40"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="28"
      y="46"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="40"
      y="46"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="52"
      y="46"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="34"
      y="52"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
    <rect
      x="52"
      y="52"
      width="4"
      height="4"
      rx="0.5"
      fill="#1a1a1a"
    />
  </svg>
);

function FlipStat({
  value,
  label,
}: {
  value: string;
  label: string;
  key?: string | React.Key;
}) {
  const chars = value.split("");
  const [flipped, setFlipped] = useState<boolean[]>(
    chars.map(() => false),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries && entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          chars.forEach((_, i) => {
            setTimeout(() => {
              setFlipped((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 160);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="flex items-baseline gap-0 text-white font-bold text-base leading-tight drop-shadow">
        {chars.map((ch, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden"
            style={{ height: "1.2em", verticalAlign: "bottom" }}
          >
            <span
              style={{
                display: "inline-block",
                transform: flipped[i]
                  ? "translateY(0)"
                  : "translateY(-100%)",
                transition: flipped[i]
                  ? `transform 0.6s cubic-bezier(0.22,1,0.36,1)`
                  : "none",
                lineHeight: "1.2em",
              }}
            >
              {ch}
            </span>
          </span>
        ))}
      </div>
      <div className="text-white/45 text-[11px] mt-0.5">
        {label}
      </div>
    </div>
  );
}

const slides = [
  {
    tag: "能碳双控 更节能",
    title: "传统能源消耗降低\n碳排放持续优化",
    illustration: (
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
      >
        {/* pulsing aura */}
        <circle
          cx="48"
          cy="52"
          r="34"
          stroke="#4ade80"
          strokeOpacity="0.08"
          strokeWidth="1"
          fill="rgba(74,222,128,0.05)"
        >
          <animate
            attributeName="r"
            values="30;36;30"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            values="0.08;0.02;0.08"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        {/* leaf body — tilted -30deg */}
        <g transform="rotate(-30, 48, 48)">
          <path
            d="M48 18 C48 18 72 26 68 50 C64 72 48 78 48 78 C48 78 26 70 28 48 C30 26 48 18 48 18Z"
            fill="#4ade80"
            fillOpacity="0.38"
            stroke="#4ade80"
            strokeOpacity="0.9"
            strokeWidth="2"
          />
          <path
            d="M48 20 Q50 48 48 76"
            stroke="#4ade80"
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M48 36 Q58 43 64 40"
            stroke="#4ade80"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M48 52 Q37 58 31 55"
            stroke="#4ade80"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
        {/* up arrow — larger, animates up and fades */}
        <path
          d="M78 32 L78 10 M70 18 L78 10 L86 18"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate
            attributeName="opacity"
            values="0.9;0.1;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;0,-5;0,0"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    ),
    metrics: [
      {
        value: "3–5%",
        label: "降低传统能源消耗",
        desc: "通过能源管理数据分析，精准识别用能浪费环节，优化生产排程与设备运行策略，系统性减少传统能源依赖，实现可持续降本增效。",
      },
      {
        value: "5%",
        label: "优化碳排放",
        desc: "实时追踪企业碳足迹，结合配额管理与绿电采购策略，有效应对日趋严格的环境监管要求，全面提升企业ESG评级与可持续发展形象。",
      },
    ],
  },
  {
    tag: "资产管理 更优化",
    title: "能源运维成本降低\n聚合收益更大",
    illustration: (
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
      >
        {/* battery outline — body x14→76, center x=45, y28→68, center y=48 */}
        <rect
          x="14"
          y="28"
          width="62"
          height="40"
          rx="6"
          stroke="white"
          strokeWidth="2"
          fill="rgba(255,255,255,0.04)"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.3;0.75;0.3"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </rect>
        {/* terminal */}
        <rect
          x="76"
          y="40"
          width="8"
          height="16"
          rx="3"
          fill="white"
        >
          <animate
            attributeName="fill-opacity"
            values="0.3;0.75;0.3"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </rect>
        {/* animated charge fill */}
        <rect
          x="18"
          y="32"
          width="0"
          height="32"
          rx="4"
          fill="#4ade80"
          fillOpacity="0.45"
        >
          <animate
            attributeName="width"
            values="0;52;52;0"
            keyTimes="0;0.6;0.95;1"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </rect>
        {/* bolt — centered at x=45, y=48 */}
        <path
          d="M49 33 L41 50 L49 50 L39 65"
          stroke="#4ade80"
          strokeOpacity="0.95"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate
            attributeName="opacity"
            values="1;0.25;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    ),
    metrics: [
      {
        value: "20%",
        label: "降低运维成本",
        desc: "提升设备运维效率，降低光/储/用电设备等的故障率，减少能源浪费，有效控制维护成本。",
      },
      {
        value: "聚合",
        label: "获得更大收益",
        desc: "盘活用户侧可调负荷，通过零碳生产智能调控获取额外市场化套利，如虚拟电厂、需求响应与辅助服务等。",
      },
    ],
  },
  {
    tag: "系统运行 更高效",
    title: "新能源消纳率提升\n储能利用更充分",
    illustration: (
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
      >
        {/* outer arc track */}
        <path
          d="M16 68 A34 34 0 1 1 80 68"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* green filled arc — animates from 0 to 70% */}
        <path
          d="M16 68 A34 34 0 1 1 80 68"
          stroke="#4ade80"
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="107 153"
          strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dasharray"
            values="0 260;107 153;107 153"
            keyTimes="0;0.7;1"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        {/* center circle */}
        <circle
          cx="48"
          cy="56"
          r="18"
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        {/* needle — rotates from left to ~70% */}
        <line
          x1="48"
          y1="56"
          x2="48"
          y2="38"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-120,48,56;30,48,56;30,48,56"
            keyTimes="0;0.7;1"
            dur="3s"
            repeatCount="indefinite"
          />
        </line>
        <circle
          cx="48"
          cy="56"
          r="4"
          fill="white"
          fillOpacity="0.8"
        />
        {/* small sun rays top — solar hint */}
        <circle
          cx="48"
          cy="14"
          r="5"
          fill="#fbbf24"
          fillOpacity="0.5"
        >
          <animate
            attributeName="fill-opacity"
            values="0.5;1;0.5"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <path
          d="M48 6 L48 3 M57 9 L59 7 M61 18 L64 18 M39 9 L37 7 M35 18 L32 18"
          stroke="#fbbf24"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.4;0.9;0.4"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    ),
    metrics: [
      {
        value: "5–10%",
        label: "提升新能源消纳",
        desc: "分布式光伏电站配储，智能调控优化，实现余电入储率提升，提高新能源自用消纳率。",
      },
      {
        value: "≈0.02元/度",
        label: "降低度电成本",
        desc: "优化储能排程，谷充峰放最大化价差收益，同时改善超容罚款、超需电费支出。",
      },
    ],
  },
];
const extendedSlides = [
  slides[slides.length - 1],
  ...slides,
  slides[0],
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [view, setView] = useState<"login" | "trial" | "register" | "forgot">("login");
  const [showScenariosModal, setShowScenariosModal] = useState(false);

  // Register state
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerCode, setRegisterCode] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerCountdown, setRegisterCountdown] = useState(0);
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [registerShowConfirmPassword, setRegisterShowConfirmPassword] = useState(false);
  const [registerAgreed, setRegisterAgreed] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Forgot state
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotCountdown, setForgotCountdown] = useState(0);
  const [forgotShowPassword, setForgotShowPassword] = useState(false);
  const [forgotShowConfirmPassword, setForgotShowConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Login state
  const [tab, setTab] = useState<LoginTab>("sms");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);

  // Trial state
  const [trialName, setTrialName] = useState("");
  const [trialPhone, setTrialPhone] = useState("");
  const [trialCode, setTrialCode] = useState("");
  const [trialCompany, setTrialCompany] = useState("");
  const [trialBusiness, setTrialBusiness] = useState<string[]>(
    [],
  );
  const [trialCountdown, setTrialCountdown] = useState(0);
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);

  const businessOptions = [
    "光伏发电管理",
    "储能调度优化",
    "虚拟电厂接入",
    "电力交易策略",
    "碳资产管理",
    "综合能源服务",
  ];

  const handleSendCode = () => {
    setCountdown(60);
    const t = setInterval(
      () =>
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(t);
            return 0;
          }
          return c - 1;
        }),
      1000,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  const handleTrialSendCode = () => {
    if (!trialPhone) return;
    setTrialCountdown(60);
    const t = setInterval(
      () =>
        setTrialCountdown((c) => {
          if (c <= 1) {
            clearInterval(t);
            return 0;
          }
          return c - 1;
        }),
      1000,
    );
  };

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrialLoading(true);
    setTimeout(() => {
      setTrialLoading(false);
      setTrialSubmitted(true);
    }, 1200);
  };

  const handleRegisterSendCode = () => {
    setRegisterCountdown(60);
    const t = setInterval(
      () =>
        setRegisterCountdown((c) => {
          if (c <= 1) {
            clearInterval(t);
            return 0;
          }
          return c - 1;
        }),
      1000,
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setTimeout(() => {
      setRegisterLoading(false);
      setRegisterSuccess(true);
    }, 1200);
  };

  const handleForgotSendCode = () => {
    setForgotCountdown(60);
    const t = setInterval(
      () =>
        setForgotCountdown((c) => {
          if (c <= 1) {
            clearInterval(t);
            return 0;
          }
          return c - 1;
        }),
      1000,
    );
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
    }, 1200);
  };

  const toggleBusiness = (opt: string) =>
    setTrialBusiness((prev) =>
      prev.includes(opt)
        ? prev.filter((b) => b !== opt)
        : [...prev, opt],
    );

  const [currentIndex, setCurrentIndex] = useState(1);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimated(true);
      setCurrentIndex((i) =>
        i >= extendedSlides.length - 1 ? 1 : i + 1,
      );
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (currentIndex >= extendedSlides.length - 1) {
      setAnimated(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setAnimated(false);
      setCurrentIndex(slides.length);
    }
  };

  const realIndex =
    (currentIndex - 1 + slides.length) % slides.length;
  const goTo = (i: number) => {
    setAnimated(true);
    setCurrentIndex(i + 1);
  };

  return (
    <div className="h-screen w-full relative flex overflow-hidden min-w-[320px] lg:min-h-[660px]">
      {/* 背景 — 森林迷雾视频 */}
      <div className="absolute inset-0 bg-slate-950 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-95"
        >
          <source src={loginBgVideo} type="video/mp4" />
        </video>
        {/* 背景微调轻微遮罩 */}
        <div className="absolute inset-0 bg-slate-950/5 pointer-events-none" />
      </div>
      {/* overlay gradient for left panel readability - softer */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex w-full h-full justify-center">
        <div className="flex w-full h-full max-w-[1920px]">
          {/* ── 左侧品牌区 ── */}
          <div className="hidden lg:flex flex-col flex-1 justify-between p-8 overflow-hidden">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <svg
                  viewBox="0 0 32 32"
                  className="w-6 h-6"
                  fill="none"
                >
                  <polygon
                    points="16,3 29,24 3,24"
                    fill="#f97316"
                  />
                  <polygon
                    points="16,10 25,24 7,24"
                    fill="#fff"
                    opacity="0.55"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white/45 text-[10px] tracking-widest uppercase leading-none mb-0.5">
                  TrinaPower
                </div>
                <div className="text-white font-semibold text-lg leading-none tracking-wide">
                  天合富家
                </div>
              </div>
            </div>

            {/* 主内容 */}
            <div className="flex flex-col justify-center flex-1 min-h-0 w-full px-[0px] py-[80px] [@media(max-height:800px)]:py-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1 mb-3 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80 text-xs font-medium tracking-wide">
                  天合零碳生产数智化平台
                </span>
              </div>

              <h1
                className="text-white font-bold leading-tight mb-2 drop-shadow-lg "
                style={{ fontSize: "2.25rem" }}
              >
                天工智云
              </h1>
              <p className="text-white/55 text-sm leading-relaxed mb-5 ">
                整合光伏发电、储能调度、虚拟电厂、电力交易等核心数据，为企业提供一站式能源管理解决方案。
              </p>

              {/* 轮播 */}
              <div className="relative overflow-hidden rounded-2xl flex-1 min-h-0 max-h-[350px] [@media(max-height:800px)]:hidden">
                <div
                  className="flex h-full"
                  onTransitionEnd={handleTransitionEnd}
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: animated
                      ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                      : "none",
                  }}
                >
                  {extendedSlides.map((s, i) => (
                    <div
                      key={i}
                      className="w-full flex-shrink-0 h-full flex flex-col bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
                    >
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div>
                          <div className="inline-flex items-center gap-1.5 bg-green-400/20 border border-green-400/30 rounded-full px-3 py-1 mb-3">
                            <span className="w-1 h-1 rounded-full bg-green-400" />
                            <span className="text-green-300 text-xs font-medium">
                              {s.tag}
                            </span>
                          </div>
                          <h2
                            className="text-white font-bold leading-tight"
                            style={{ fontSize: "1.5rem" }}
                          >
                            {s.title
                              .split("\n")
                              .map((line, j) => (
                                <span key={j}>
                                  {line}
                                  {j === 0 && <br />}
                                </span>
                              ))}
                          </h2>
                        </div>
                        <div className="flex-shrink-0 opacity-90 mt-1">
                          {s.illustration}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 flex-1 content-center">
                        {s.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="border-l-2 border-green-400/40 pl-3"
                          >
                            <div className="text-green-300 font-bold text-2xl mb-1 leading-none">
                              {m.value}
                            </div>
                            <div className="text-white/90 text-xs font-semibold mb-1.5">
                              {m.label}
                            </div>
                            <div className="text-white/50 text-xs leading-relaxed">
                              {m.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 分页点 */}
              <div className="flex items-center justify-between w-full mt-4 [@media(max-height:800px)]:hidden">
                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="transition-all duration-300 rounded-full border-none cursor-pointer p-0"
                      style={{
                        width: i === realIndex ? "24px" : "6px",
                        height: "6px",
                        background:
                          i === realIndex
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.3)",
                      }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowScenariosModal(true)}
                  className="text-xs text-white/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium bg-transparent border-none outline-none"
                >
                  了解更多服务场景 →
                </button>
              </div>
            </div>

            {/* 底部：统计 + 二维码 + 版权 */}
            <div className="pt-4 border-t border-white/[0.12]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  {[
                    { value: "近2000家", label: "服务企业" },
                    {
                      value: "近950万元",
                      label: "优化资产收益",
                    },
                    {
                      value: "近1,500MW",
                      label: "新能源设备接入",
                    },
                  ].map(({ value, label }) => (
                    <FlipStat
                      key={label}
                      value={value}
                      label={label}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2 flex-shrink-0">
                  <div className="bg-white rounded-lg p-1 flex-shrink-0">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 64 64"
                      fill="none"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="20"
                        height="20"
                        rx="2"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="8"
                        y="8"
                        width="12"
                        height="12"
                        rx="1"
                        fill="white"
                      />
                      <rect
                        x="10"
                        y="10"
                        width="8"
                        height="8"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="40"
                        y="4"
                        width="20"
                        height="20"
                        rx="2"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="44"
                        y="8"
                        width="12"
                        height="12"
                        rx="1"
                        fill="white"
                      />
                      <rect
                        x="46"
                        y="10"
                        width="8"
                        height="8"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="4"
                        y="40"
                        width="20"
                        height="20"
                        rx="2"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="8"
                        y="44"
                        width="12"
                        height="12"
                        rx="1"
                        fill="white"
                      />
                      <rect
                        x="10"
                        y="46"
                        width="8"
                        height="8"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="28"
                        y="4"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="34"
                        y="4"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="28"
                        y="10"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="34"
                        y="10"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="28"
                        y="16"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="28"
                        y="28"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="40"
                        y="28"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="52"
                        y="28"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="28"
                        y="34"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="40"
                        y="34"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="34"
                        y="40"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                      <rect
                        x="52"
                        y="52"
                        width="4"
                        height="4"
                        rx="0.5"
                        fill="#1a1a1a"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/90 text-[11px] font-semibold leading-snug">
                      微信扫码访问小程序
                    </div>
                    <div className="text-white/45 text-[10px] leading-relaxed max-w-[100px] mt-0.5">
                      随时掌握企业能源数据
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
                <p className="text-white/30 text-[10px]">
                  Copyright©2017-2026 TrimaPower | All Rights
                  Reserved | Powered by 天合富家能源股份有限公司
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-white/25 text-[10px]">
                    苏ICP备17009083号-7
                  </span>
                  <span className="text-white/25 text-[10px]">
                    苏公网安备 32041102001016号
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 右侧区域 ── */}
          <div className="flex items-stretch w-full lg:w-[40%]">
            <div className="relative w-full bg-white overflow-hidden flex flex-col justify-center">
              {/* 登录面板 */}
              <div
                className="absolute inset-0 flex flex-col overflow-y-auto transition-transform duration-500"
                style={{
                  transform:
                    view === "login"
                      ? "translateX(0)"
                      : "translateX(-100%)",
                }}
              >
                {/* 移动端 / Pad 品牌头 */}
                <div className="lg:hidden flex-shrink-0 px-6 pt-10 pb-6 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    {/* 左：logo + 天工智云 */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                        <svg
                          viewBox="0 0 32 32"
                          className="w-5 h-5"
                          fill="none"
                        >
                          <polygon
                            points="16,3 29,24 3,24"
                            fill="#f97316"
                          />
                          <polygon
                            points="16,10 25,24 7,24"
                            fill="#fff"
                            opacity="0.6"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-slate-800 font-bold text-xl leading-tight">
                          天工智云
                        </div>
                        <div className="text-slate-400 text-[11px] leading-tight mt-0.5">
                          一站式企业能源管理解决方案
                        </div>
                      </div>
                    </div>
                    {/* 右：标签 */}
                    <div className="hidden sm:inline-flex flex-shrink-0 items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-600 text-[11px] font-medium whitespace-nowrap">
                        天合零碳生产数智化平台
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-start lg:justify-center px-6 lg:px-0">
                  <div className="w-full max-w-[400px] mx-auto pt-8 pb-4">
                    <h2 className="text-slate-900 font-bold text-2xl mb-2">
                      您好，欢迎使用！
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      登录后即可管理您的企业能源数据
                    </p>

                    <div className="flex gap-6 mt-5 border-b border-slate-200">
                      {/* 小程序 tab：仅移动端显示 */}
                      <button
                        type="button"
                        onClick={() => setTab("miniapp")}
                        className={`lg:hidden pb-3 text-sm font-medium transition-colors relative ${tab === "miniapp" ? "text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        小程序登录
                        {tab === "miniapp" && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-green-500" />
                        )}
                      </button>
                      {(["sms", "password"] as LoginTab[]).map(
                        (t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={`pb-3 text-sm font-medium transition-colors relative ${tab === t ? "text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                          >
                            {t === "sms"
                              ? "短信登录"
                              : "密码登录"}
                            {tab === t && (
                              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-green-500" />
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* 小程序引导面板：仅移动端 tab 激活时显示 */}
                  {tab === "miniapp" && (
                    <div className="w-full max-w-[400px] mx-auto pb-10 pt-2">
                      <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-6 flex flex-col items-center text-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center shadow-md shadow-green-200">
                          <svg
                            viewBox="0 0 32 32"
                            className="w-7 h-7"
                            fill="none"
                          >
                            <polygon
                              points="16,4 28,22 4,22"
                              fill="#f97316"
                            />
                            <polygon
                              points="16,10 24,22 8,22"
                              fill="#fff"
                              opacity="0.65"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-slate-800 font-bold text-base mb-1">
                            推荐使用小程序访问
                          </div>
                          <div className="text-slate-500 text-xs leading-relaxed">
                            检测到您正在使用移动端设备。
                            <br />
                            天工智云小程序提供更流畅的移动体验，
                            <br />
                            支持实时告警推送与一键操作。
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-green-100">
                          {QR_MINI}
                          <div className="text-slate-400 text-[11px] mt-2">
                            扫码打开小程序
                          </div>
                        </div>
                        <a
                          href="#"
                          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors shadow-sm shadow-green-200"
                          onClick={(e) => e.preventDefault()}
                        >
                          <svg
                            viewBox="0 0 20 20"
                            className="w-4 h-4"
                            fill="currentColor"
                          >
                            <path d="M13.5 3C11.57 3 10 4.57 10 6.5c0 .17.02.34.04.5H6.5C4.57 7 3 8.57 3 10.5S4.57 14 6.5 14c.93 0 1.77-.36 2.4-.94l.6.94H9v3h2v-3h.5l.6-.94c.63.58 1.47.94 2.4.94C16.43 14 18 12.43 18 10.5S16.43 7 14.5 7h-.04c.02-.16.04-.33.04-.5C14.5 4.57 12.93 3 11 3h2.5z" />
                          </svg>
                          打开天工智云小程序
                        </a>
                        <button
                          type="button"
                          onClick={() => setTab("sms")}
                          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          继续使用网页版登录 →
                        </button>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className={`w-full max-w-[400px] mx-auto pb-10 space-y-5 ${tab === "miniapp" ? "hidden" : ""}`}
                  >
                    {/* 手机号 */}
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        手机号码
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value)
                          }
                          placeholder="请输入11位手机号码"
                          className="flex-1 px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                        />
                        {tab === "sms" && (
                          <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={countdown > 0}
                            className="px-3.5 py-3 text-xs font-medium rounded-xl border transition-all whitespace-nowrap cursor-pointer hover:bg-slate-50 bg-white"
                            style={{
                              borderColor:
                                countdown > 0
                                  ? "#e2e8f0"
                                  : "#16a34a",
                              color:
                                countdown > 0
                                  ? "#94a3b8"
                                  : "#16a34a",
                            }}
                          >
                            {countdown > 0
                              ? `${countdown}s后重发`
                              : "获取验证码"}
                          </button>
                        )}
                      </div>
                    </div>

                    {tab === "password" ? (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-medium text-slate-500">
                            密码
                          </label>
                          <button
                            type="button"
                            onClick={() => setView("forgot")}
                            className="text-xs text-green-600 hover:text-green-700 transition-colors cursor-pointer"
                          >
                            忘记密码 &gt;
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={
                              showPassword ? "text" : "password"
                            }
                            value={password}
                            onChange={(e) =>
                              setPassword(e.target.value)
                            }
                            placeholder="请输入登录密码"
                            className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100 pr-11"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                          验证码
                        </label>
                        <input
                          type="text"
                          value={smsCode}
                          onChange={(e) =>
                            setSmsCode(e.target.value)
                          }
                          placeholder="请输入验证码"
                          maxLength={6}
                          className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                    )}

                    {/* 同意条款 */}
                    <div>
                      <label
                        className="flex items-start gap-2.5 cursor-pointer group"
                        onClick={() => setAgreed(!agreed)}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${agreed ? "bg-green-500 border-green-500" : "border-slate-300 bg-white group-hover:border-green-400"}`}
                        >
                          {agreed && (
                            <svg
                              viewBox="0 0 10 8"
                              className="w-2.5 h-2"
                              fill="none"
                            >
                              <path
                                d="M1 4l2.5 2.5L9 1"
                                stroke="#fff"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 leading-relaxed select-none">
                          我已阅读并同意
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="text-green-600 hover:text-green-700 mx-0.5 transition-colors"
                          >
                            《服务协议》
                          </button>
                          和
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="text-green-600 hover:text-green-700 mx-0.5 transition-colors"
                          >
                            《隐私政策》
                          </button>
                        </span>
                      </label>
                    </div>

                    {/* 登录/注册按钮 */}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2"
                        style={{
                          background: loading
                            ? "#6b9c7a"
                            : "linear-gradient(135deg, #22c55e, #16a34a)",
                          boxShadow: loading
                            ? "none"
                            : "0 4px 16px rgba(22,163,74,0.35)",
                        }}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin size-4"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            登录中...
                          </>
                        ) : (
                          "登 录"
                        )}
                      </button>
                      {tab === "password" && (
                        <button
                          type="button"
                          onClick={() => setView("register")}
                          className="flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2 border-green-500 text-green-600 hover:bg-green-50 active:bg-green-100 cursor-pointer"
                        >
                          注 册
                        </button>
                      )}
                    </div>

                    {tab === "sms" && (
                      <p className="text-center text-xs text-slate-400 -mt-1">
                        未注册的手机号验证后将自动创建账户
                      </p>
                    )}

                    {/* 微信登录 */}
                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full border-2 border-slate-200 group-hover:border-slate-300 flex items-center justify-center transition-colors">
                          <QrCode className="size-[18px]" />
                        </div>
                        <span className="text-[10px]">
                          微信登录
                        </span>
                      </button>
                    </div>

                    {/* 开通体验入口 */}
                    <div className="pt-5 border-t border-slate-100">
                      <div
                        onClick={() => setView("trial")}
                        className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 group cursor-pointer hover:bg-green-100 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-slate-700">
                            还没有账户？
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            申请开通，免费体验能源管理服务
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-xs font-semibold group-hover:gap-2 transition-all">
                          立即开通{" "}
                          <ChevronRight className="size-3.5" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                {/* /flex-1 */}
              </div>
              {/* /登录面板 */}

              {/* 开通体验面板 */}
              <div
                className="absolute inset-0 flex flex-col overflow-y-auto transition-transform duration-500"
                style={{
                  transform:
                    view === "trial"
                      ? "translateX(0)"
                      : "translateX(100%)",
                }}
              >
                <div className="w-full max-w-[400px] mx-auto px-6 lg:px-2 py-8">
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setTrialSubmitted(false);
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs mb-8 transition-colors"
                  >
                    <ChevronRight className="size-3.5 rotate-180" />{" "}
                    返回登录
                  </button>

                  {!trialSubmitted ? (
                    <>
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-green-600 text-xs font-medium">
                            可开通 7 天能源管理服务体验
                          </span>
                        </div>
                        <h2 className="text-slate-900 font-bold text-2xl mb-1">
                          申请服务体验
                        </h2>
                        <p className="text-slate-400 text-xs">
                          填写信息后，我们尽快为您完成服务开通
                        </p>
                      </div>

                      <form
                        onSubmit={handleTrialSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            姓名
                          </label>
                          <input
                            type="text"
                            value={trialName}
                            onChange={(e) =>
                              setTrialName(e.target.value)
                            }
                            placeholder="请输入您的姓名"
                            required
                            className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            手机号码
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="tel"
                              value={trialPhone}
                              onChange={(e) =>
                                setTrialPhone(e.target.value)
                              }
                              placeholder="请输入手机号码"
                              required
                              className="flex-1 px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                            />
                            <button
                              type="button"
                              onClick={handleTrialSendCode}
                              disabled={
                                trialCountdown > 0 ||
                                !trialPhone
                              }
                              className="px-3 py-3 text-xs font-medium rounded-xl border transition-all whitespace-nowrap"
                              style={{
                                borderColor:
                                  trialCountdown > 0 ||
                                  !trialPhone
                                    ? "#e2e8f0"
                                    : "#16a34a",
                                color:
                                  trialCountdown > 0 ||
                                  !trialPhone
                                    ? "#94a3b8"
                                    : "#16a34a",
                              }}
                            >
                              {trialCountdown > 0
                                ? `${trialCountdown}s后重发`
                                : "获取验证码"}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            验证码
                          </label>
                          <input
                            type="text"
                            value={trialCode}
                            onChange={(e) =>
                              setTrialCode(e.target.value)
                            }
                            placeholder="请输入短信验证码"
                            maxLength={6}
                            required
                            className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            公司名称
                          </label>
                          <input
                            type="text"
                            value={trialCompany}
                            onChange={(e) =>
                              setTrialCompany(e.target.value)
                            }
                            placeholder="请输入公司全称"
                            required
                            className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-2">
                            想咨询的业务{" "}
                            <span className="text-slate-300 font-normal">
                              （可多选）
                            </span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {businessOptions.map((opt) => {
                              const selected =
                                trialBusiness.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() =>
                                    toggleBusiness(opt)
                                  }
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                  style={{
                                    background: selected
                                      ? "#f0fdf4"
                                      : "#f8fafc",
                                    color: selected
                                      ? "#16a34a"
                                      : "#64748b",
                                    border: selected
                                      ? "1.5px solid #86efac"
                                      : "1.5px solid #e2e8f0",
                                  }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={trialLoading}
                          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                          style={{
                            background: trialLoading
                              ? "#6b9c7a"
                              : "linear-gradient(135deg, #22c55e, #16a34a)",
                            boxShadow: trialLoading
                              ? "none"
                              : "0 4px 16px rgba(22,163,74,0.35)",
                          }}
                        >
                          {trialLoading ? (
                            <>
                              <svg
                                className="animate-spin size-4"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              提交中...
                            </>
                          ) : (
                            "立即体验"
                          )}
                        </button>
                      </form>

                      {/* 服务管家二维码 */}
                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                          <div className="bg-white rounded-xl p-2 shadow-sm flex-shrink-0">
                            {QR_SERVICE}
                          </div>
                          <div>
                            <div className="text-slate-700 text-xs font-semibold mb-1">
                              扫码添加服务云管家
                            </div>
                            <div className="text-slate-400 text-[11px] leading-relaxed">
                              您也可以添加服务管家进行咨询，开通其他服务体验，专属顾问
                              1 对 1 为您服务
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8 text-green-500"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="opacity-20"
                          />
                          <path
                            d="M7 12.5l3.5 3.5 6.5-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h3 className="text-slate-800 font-bold text-xl mb-2">
                        提交成功
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[260px]">
                        您的体验申请已受理，现在即可直接使用系统，探索全部能源管理功能
                      </p>
                      <button
                        type="button"
                        onClick={onLogin}
                        className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #22c55e, #16a34a)",
                          boxShadow:
                            "0 4px 16px rgba(22,163,74,0.3)",
                        }}
                      >
                        进入系统
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 注册面板 */}
              <div
                className="absolute inset-0 flex flex-col overflow-y-auto transition-transform duration-500"
                style={{
                  transform:
                    view === "register"
                      ? "translateX(0)"
                      : "translateX(100%)",
                }}
              >
                <div className="w-full max-w-[400px] mx-auto px-6 lg:px-2 py-8">
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setRegisterSuccess(false);
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs mb-8 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="size-3.5 rotate-180" />{" "}
                    返回登录
                  </button>

                  {!registerSuccess ? (
                    <>
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-green-600 text-xs font-medium">
                            注册新账户，开启智慧能效之旅
                          </span>
                        </div>
                        <h2 className="text-slate-900 font-bold text-2xl mb-1">
                          用户注册
                        </h2>
                        <p className="text-slate-400 text-xs">
                          请填写以下信息以创建您的企业账户
                        </p>
                      </div>

                      <form
                        onSubmit={handleRegisterSubmit}
                        className="space-y-4"
                      >
                        {/* 手机号码 */}
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            手机号码
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="tel"
                              value={registerPhone}
                              onChange={(e) => setRegisterPhone(e.target.value)}
                              placeholder="请输入11位手机号码"
                              className="flex-1 px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                            />
                            <button
                              type="button"
                              onClick={handleRegisterSendCode}
                              disabled={registerCountdown > 0}
                              className="px-3.5 py-3 text-xs font-medium rounded-xl border transition-all whitespace-nowrap cursor-pointer hover:bg-slate-50 bg-white"
                              style={{
                                borderColor:
                                  registerCountdown > 0 ? "#e2e8f0" : "#16a34a",
                                color:
                                  registerCountdown > 0 ? "#94a3b8" : "#16a34a",
                              }}
                            >
                              {registerCountdown > 0
                                ? `${registerCountdown}s后重发`
                                : "获取验证码"}
                            </button>
                          </div>
                        </div>

                        {/* 验证码 */}
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            验证码
                          </label>
                          <input
                            type="text"
                            value={registerCode}
                            onChange={(e) => setRegisterCode(e.target.value)}
                            placeholder="请输入短信验证码"
                            maxLength={6}
                            className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        {/* 设置密码 */}
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            设置密码
                          </label>
                          <div className="relative">
                            <input
                              type={registerShowPassword ? "text" : "password"}
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              placeholder="请输入6-18位登录密码"
                              className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100 pr-11"
                            />
                            <button
                              type="button"
                              onClick={() => setRegisterShowPassword(!registerShowPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {registerShowPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* 确认密码 */}
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            确认密码
                          </label>
                          <div className="relative">
                            <input
                              type={registerShowConfirmPassword ? "text" : "password"}
                              value={registerConfirmPassword}
                              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                              placeholder="请再次输入密码"
                              className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100 pr-11"
                            />
                            <button
                              type="button"
                              onClick={() => setRegisterShowConfirmPassword(!registerShowConfirmPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {registerShowConfirmPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* 同意条款 */}
                        <div>
                          <label
                            className="flex items-start gap-2.5 cursor-pointer group"
                            onClick={() => setRegisterAgreed(!registerAgreed)}
                          >
                            <div
                              className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${registerAgreed ? "bg-green-500 border-green-500" : "border-slate-300 bg-white group-hover:border-green-400"}`}
                            >
                              {registerAgreed && (
                                <svg
                                  viewBox="0 0 10 8"
                                  className="w-2.5 h-2"
                                  fill="none"
                                >
                                  <path
                                    d="M1 4l2.5 2.5L9 1"
                                    stroke="#fff"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 leading-relaxed select-none">
                              我已阅读并同意
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="text-green-600 hover:text-green-700 mx-0.5 transition-colors"
                              >
                                《服务协议》
                              </button>
                              和
                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="text-green-600 hover:text-green-700 mx-0.5 transition-colors"
                              >
                                《隐私政策》
                              </button>
                            </span>
                          </label>
                        </div>

                        {/* 注册按钮 */}
                        <button
                          type="submit"
                          disabled={registerLoading}
                          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                          style={{
                            background: registerLoading
                              ? "#6b9c7a"
                              : "linear-gradient(135deg, #22c55e, #16a34a)",
                            boxShadow: registerLoading
                              ? "none"
                              : "0 4px 16px rgba(22,163,74,0.35)",
                          }}
                        >
                          {registerLoading ? (
                            <>
                              <svg
                                className="animate-spin size-4"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              注册中...
                            </>
                          ) : (
                            "立即注册"
                          )}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8 text-green-500"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="opacity-20"
                          />
                          <path
                            d="M7 12.5l3.5 3.5 6.5-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h3 className="text-slate-800 font-bold text-xl mb-2">
                        注册成功
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[260px]">
                        您的天工智云账户已成功创建，现在即可使用您的手机号进行登录。
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setView("login");
                          setTab("password");
                          setRegisterSuccess(false);
                        }}
                        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #22c55e, #16a34a)",
                          boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
                        }}
                      >
                        前往登录
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 忘记密码面板 */}
              <div
                className="absolute inset-0 flex flex-col overflow-y-auto transition-transform duration-500"
                style={{
                  transform:
                    view === "forgot"
                      ? "translateX(0)"
                      : "translateX(100%)",
                }}
              >
                <div className="w-full max-w-[400px] mx-auto px-6 lg:px-2 py-8">
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setForgotSuccess(false);
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs mb-8 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="size-3.5 rotate-180" />{" "}
                    返回登录
                  </button>

                  {!forgotSuccess ? (
                    <>
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-green-600 text-xs font-medium">
                            安全、快速地找回并重置登录密码
                          </span>
                        </div>
                        <h2 className="text-slate-900 font-bold text-2xl mb-1">
                          重置密码
                        </h2>
                        <p className="text-slate-400 text-xs">
                          请输入您绑定的手机号码，并设置新密码
                        </p>
                      </div>

                      <form
                        onSubmit={handleForgotSubmit}
                        className="space-y-4"
                      >
                        {/* 手机号码 */}
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            手机号码
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="tel"
                              value={forgotPhone}
                              onChange={(e) => setForgotPhone(e.target.value)}
                              placeholder="请输入绑定的手机号码"
                              className="flex-1 px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                            />
                            <button
                              type="button"
                              onClick={handleForgotSendCode}
                              disabled={forgotCountdown > 0}
                              className="px-3.5 py-3 text-xs font-medium rounded-xl border transition-all whitespace-nowrap cursor-pointer hover:bg-slate-50 bg-white"
                              style={{
                                borderColor:
                                  forgotCountdown > 0 ? "#e2e8f0" : "#16a34a",
                                color:
                                  forgotCountdown > 0 ? "#94a3b8" : "#16a34a",
                              }}
                            >
                              {forgotCountdown > 0
                                ? `${forgotCountdown}s后重发`
                                : "获取验证码"}
                            </button>
                          </div>
                        </div>

                        {/* 验证码 */}
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            验证码
                          </label>
                          <input
                            type="text"
                            value={forgotCode}
                            onChange={(e) => setForgotCode(e.target.value)}
                            placeholder="请输入短信验证码"
                            maxLength={6}
                            className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        {/* 设置新密码 */}
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            新密码
                          </label>
                          <div className="relative">
                            <input
                              type={forgotShowPassword ? "text" : "password"}
                              value={forgotPassword}
                              onChange={(e) => setForgotPassword(e.target.value)}
                              placeholder="请输入新登录密码"
                              className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100 pr-11"
                            />
                            <button
                              type="button"
                              onClick={() => setForgotShowPassword(!forgotShowPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {forgotShowPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* 确认新密码 */}
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1.5">
                            确认新密码
                          </label>
                          <div className="relative">
                            <input
                              type={forgotShowConfirmPassword ? "text" : "password"}
                              value={forgotConfirmPassword}
                              onChange={(e) => setForgotConfirmPassword(e.target.value)}
                              placeholder="请再次输入新密码"
                              className="w-full px-3.5 py-3 text-sm border border-slate-200 bg-white rounded-xl outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100 pr-11"
                            />
                            <button
                              type="button"
                              onClick={() => setForgotShowConfirmPassword(!forgotShowConfirmPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {forgotShowConfirmPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* 确定重置按钮 */}
                        <button
                          type="submit"
                          disabled={forgotLoading}
                          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                          style={{
                            background: forgotLoading
                              ? "#6b9c7a"
                              : "linear-gradient(135deg, #22c55e, #16a34a)",
                            boxShadow: forgotLoading
                              ? "none"
                              : "0 4px 16px rgba(22,163,74,0.35)",
                          }}
                        >
                          {forgotLoading ? (
                            <>
                              <svg
                                className="animate-spin size-4"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              提交中...
                            </>
                          ) : (
                            "确定重置"
                          )}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-5">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8 text-green-500"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="opacity-20"
                          />
                          <path
                            d="M7 12.5l3.5 3.5 6.5-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h3 className="text-slate-800 font-bold text-xl mb-2">
                        密码重置成功
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[260px]">
                        您的登录密码已成功重置，现在请使用新设置的密码登录账户。
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setView("login");
                          setTab("password");
                          setForgotSuccess(false);
                        }}
                        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #22c55e, #16a34a)",
                          boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
                        }}
                      >
                        前往登录
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 更多服务场景弹窗 */}
      {showScenariosModal && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowScenariosModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-green-200 animate-pulse" />
                <div>
                  <h3 className="font-bold text-lg leading-tight">天工智云服务场景</h3>
                  <p className="text-[11px] text-green-100 opacity-90 mt-0.5">为您提供一站式低碳能源运营决策支持</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowScenariosModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border-none cursor-pointer text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 内容区 */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* 场景 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600 flex-shrink-0">
                    <Network className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">智能微电网建设</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      实现生产车间/园区内分布式光伏、储能与重要负荷的局部协调，优化就地消纳，提升能源自给率。
                    </p>
                  </div>
                </div>
              </div>

              {/* 场景 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 flex-shrink-0">
                    <Leaf className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 text-sm mb-1">惠碳资产管理</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      提供精准的企业温室气体排放核算服务、碳账户评级与国家/地方碳足迹政策追踪，辅助进行碳信用管理。
                    </p>
                  </div>
                </div>
              </div>

              {/* 场景 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 flex-shrink-0">
                    <TrendingUp className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 text-sm mb-1">绿电绿证交易咨询</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      分析企业用电曲线与绿色配额指标，撮合高性价比的绿电直购及绿证凭证获取，稳步实现100%可再生能源目标。
                    </p>
                  </div>
                </div>
              </div>

              {/* 场景 4 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-600 flex-shrink-0">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm mb-1">用户侧智能储能</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      通过工商业集装箱/壁挂式储能系统建设与全周期智慧调度，结合峰谷套利与需量管理，显著降低用电账单费用。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部 */}
            <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
              <button 
                type="button"
                onClick={() => setShowScenariosModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-lg transition-colors border-none cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}