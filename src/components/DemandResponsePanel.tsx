import { useState, useMemo } from "react";
import {
  Gauge,
  Info,
  ChevronDown,
  ChevronRight,
  FileText,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import {
  type CalcMode,
  type PanelTier,
  type PanelPolicy,
  type RegionPanel,
  PANEL_REGIONS,
  calcTierRevenue,
  LEVEL_CLS,
} from "./demand-response-data";

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toFixed(1);
}

function effectivePrice(tier: PanelTier, sliderVal: number): number {
  const base = tier.priceFixed ? tier.priceDefault : Math.min(sliderVal, tier.priceMax);
  return base * tier.priceMultiplier;
}

function findRegionBestRevenue(
  region: RegionPanel,
  capacity: number,
  duration: number,
  times: number,
  sliders: Record<string, number>
): number {
  let best = 0;
  for (const policy of region.policies) {
    const sv = sliders[policy.id] ?? policy.sliderDefault;
    for (const tier of policy.tiers) {
      const rev = calcTierRevenue(tier, capacity, duration, times, sv);
      if (rev.total > best) best = rev.total;
    }
  }
  return best;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function TierRadio({
  tier,
  selected,
  sliderVal,
  capacity,
  duration,
  times,
  onSelect,
}: {
  tier: PanelTier;
  selected: boolean;
  sliderVal: number;
  capacity: number;
  duration: number;
  times: number;
  onSelect: () => void;
}) {
  const rev = calcTierRevenue(tier, capacity, duration, times, sliderVal);
  const ep = effectivePrice(tier, sliderVal);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
        selected
          ? "bg-rose-50 border-rose-200 shadow-sm"
          : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60"
      }`}
    >
      <div
        className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
          selected ? "border-rose-500 bg-rose-500" : "border-slate-300"
        }`}
      >
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xs font-bold ${selected ? "text-slate-900" : "text-slate-600"}`}>
            {tier.name}
          </span>
          {tier.isBest && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
              ⭐ 最优
            </span>
          )}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{tier.condition}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`text-xs font-black tabular-nums ${selected ? "text-rose-700" : "text-slate-500"}`}>
          {ep.toFixed(2)}{tier.priceDisplayUnit.includes("月") ? "" : ""}
          <span className="text-[9px] font-normal ml-0.5 text-slate-400">{tier.priceDisplayUnit}</span>
        </div>
        <div className="text-[10px] tabular-nums font-bold mt-0.5" style={{ color: "#2e7d32" }}>
          {fmt(rev.total)}万/年
        </div>
      </div>
    </button>
  );
}

function RevenueBreakdown({
  tier,
  sliderVal,
  capacity,
  duration,
  times,
}: {
  tier: PanelTier;
  sliderVal: number;
  capacity: number;
  duration: number;
  times: number;
}) {
  const rev = calcTierRevenue(tier, capacity, duration, times, sliderVal);

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 flex-wrap bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
      <TrendingUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
      {rev.cap > 0 ? (
        <>
          <span className="tabular-nums">电量收益 <b>{fmt(rev.elec)}万</b></span>
          <span className="text-slate-300">+</span>
          <span className="tabular-nums">容量收益 <b>{fmt(rev.cap)}万</b></span>
          <span className="text-slate-300">=</span>
          <span className="font-black tabular-nums text-sm" style={{ color: "#2e7d32" }}>
            {fmt(rev.total)}万/年
          </span>
          {tier.capNote && (
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 ml-1">
              ✅ 叠加
            </span>
          )}
        </>
      ) : (
        <>
          <span>电量收益：</span>
          <span className="font-black tabular-nums text-sm" style={{ color: "#2e7d32" }}>
            {fmt(rev.total)}万/年
          </span>
        </>
      )}
    </div>
  );
}

function PolicyGroup({
  policy,
  regionId,
  selectedTierId,
  sliderVal,
  capacity,
  duration,
  times,
  onSelectTier,
  onSliderChange,
}: {
  policy: PanelPolicy;
  regionId: string;
  selectedTierId: string | null;
  sliderVal: number;
  capacity: number;
  duration: number;
  times: number;
  onSelectTier: (tierId: string) => void;
  onSliderChange: (val: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const selectedTier = policy.tiers.find((t) => t.id === selectedTierId) ?? null;

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      {/* Group header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-slate-50/80 hover:bg-slate-100/60 transition-colors cursor-pointer text-left"
      >
        <ChevronRight
          className={`size-3.5 text-slate-400 flex-shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
        />
        <FileText className="size-3.5 text-slate-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-slate-700 leading-snug truncate">{policy.name}</div>
          <div className="text-[10px] text-slate-400">{policy.docNo}</div>
        </div>
      </button>

      {open && (
        <div className="p-3 space-y-2 border-t border-slate-100">
          {/* Tier radio list */}
          <div className="space-y-1.5">
            {policy.tiers.map((tier) => (
              <TierRadio
                key={tier.id}
                tier={tier}
                selected={tier.id === selectedTierId}
                sliderVal={sliderVal}
                capacity={capacity}
                duration={duration}
                times={times}
                onSelect={() => onSelectTier(tier.id)}
              />
            ))}
          </div>

          {/* Price slider */}
          <div className="pt-1">
            {policy.sliderFixed ? (
              <div className="text-[10px] text-slate-400 italic px-1">
                {policy.sliderFixedNote ?? "该地区为固定补贴单价"}
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>
                    {regionId === "guangdong" ? "P₁参考值（现货出清价参考上限）" : "申报价格上限"}
                  </span>
                  <span className="text-rose-600">
                    {sliderVal.toFixed(2)} {regionId === "guangdong" ? "元/kWh（P₁）" : "元/kWh"}
                  </span>
                </div>
                <input
                  type="range"
                  min={policy.sliderMin}
                  max={policy.sliderMax}
                  step={0.05}
                  value={sliderVal}
                  onChange={(e) => onSliderChange(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>{policy.sliderMin}元</span>
                  <span>{policy.sliderMax}元</span>
                </div>
              </div>
            )}
          </div>

          {/* Revenue breakdown for selected tier in this policy */}
          {selectedTier && (
            <RevenueBreakdown
              tier={selectedTier}
              sliderVal={sliderVal}
              capacity={capacity}
              duration={duration}
              times={times}
            />
          )}

          {/* Policy link */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <FileText className="size-3 text-slate-400 flex-shrink-0" />
            <span className="text-[10px] text-slate-500 flex-1 min-w-0 truncate">{policy.name}</span>
            <a
              href={policy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 flex-shrink-0"
            >
              查看链接 <ExternalLink className="size-2.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function RegionCard({
  region,
  rank,
  expanded,
  onToggle,
  capacity,
  duration,
  times,
  selectedTierId,
  sliderPrices,
  onSelectTier,
  onSliderChange,
}: {
  region: RegionPanel;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
  capacity: number;
  duration: number;
  times: number;
  selectedTierId: string | null;
  sliderPrices: Record<string, number>;
  onSelectTier: (tierId: string) => void;
  onSliderChange: (policyId: string, val: number) => void;
}) {
  // Compute best revenue across all policies
  let bestRev = 0;
  let bestTierName = "—";
  let bestTierPrice = "";
  let bestCondition = "";

  for (const policy of region.policies) {
    const sv = sliderPrices[policy.id] ?? policy.sliderDefault;
    for (const tier of policy.tiers) {
      const rev = calcTierRevenue(tier, capacity, duration, times, sv);
      if (rev.total > bestRev) {
        bestRev = rev.total;
        bestTierName = tier.name;
        const ep = effectivePrice(tier, sv);
        bestTierPrice = `${ep.toFixed(2)}${tier.priceDisplayUnit}`;
        bestCondition = tier.condition;
      }
    }
  }

  const rankColors: Record<number, string> = {
    1: "bg-amber-400 text-white",
    2: "bg-slate-400 text-white",
    3: "bg-amber-600 text-white",
  };
  const rankCls = rankColors[rank] ?? "bg-slate-200 text-slate-600";

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        expanded
          ? "border-rose-200 shadow-md bg-white"
          : "border-slate-150 bg-white hover:shadow-md hover:border-slate-200"
      }`}
    >
      {/* Card header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          {/* Rank */}
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${rankCls}`}
          >
            {rank}
          </span>
          {/* Region name + level */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-black text-slate-900">{region.name}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${LEVEL_CLS[region.level]}`}>
              {region.level}
            </span>
          </div>
          {/* Spacer */}
          <div className="flex-1" />
          {/* Best annual revenue */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-baseline gap-0.5 justify-end">
              <span className="text-xl font-black tabular-nums" style={{ color: "#2e7d32" }}>
                {fmt(bestRev)}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">万/年</span>
            </div>
          </div>
          <ChevronDown
            className={`size-4 text-slate-400 flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        {/* Best tier + condition row */}
        <div className="mt-1.5 ml-9 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            {bestTierName}
          </span>
          <span className="text-[11px] text-slate-500">{bestTierPrice}</span>
        </div>
        <div className="mt-0.5 ml-9 text-[10px] text-slate-400">{bestCondition} · {region.policyValidity}</div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-100">
          {region.policies.map((policy) => (
            <PolicyGroup
              key={policy.id}
              policy={policy}
              regionId={region.id}
              selectedTierId={selectedTierId}
              sliderVal={sliderPrices[policy.id] ?? policy.sliderDefault}
              capacity={capacity}
              duration={duration}
              times={times}
              onSelectTier={onSelectTier}
              onSliderChange={(val) => onSliderChange(policy.id, val)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DemandResponsePanel() {
  const [calcMode, setCalcMode] = useState<CalcMode>("annual");
  const [capacity, setCapacity] = useState(1000);
  const [duration, setDuration] = useState(2);
  const [times, setTimes] = useState(10);

  const isAnnual = calcMode === "annual";

  // Expanded cards — default: first region
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    () => new Set([PANEL_REGIONS[0].id])
  );

  // Per-region selected tier (across all policies)
  const [selectedTierIds, setSelectedTierIds] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const r of PANEL_REGIONS) {
      for (const p of r.policies) {
        for (const t of p.tiers) {
          if (t.isBest && !init[r.id]) init[r.id] = t.id;
        }
      }
      if (!init[r.id]) init[r.id] = r.policies[0].tiers[0].id;
    }
    return init;
  });

  // Per-policy slider values
  const [sliderPrices, setSliderPrices] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const r of PANEL_REGIONS) {
      for (const p of r.policies) {
        init[p.id] = p.sliderDefault;
      }
    }
    return init;
  });

  const calcTimes = isAnnual ? times : 1;

  // Sort regions by best revenue descending
  const sortedRegions = useMemo(() => {
    return [...PANEL_REGIONS]
      .map((r) => ({
        region: r,
        bestRev: findRegionBestRevenue(r, capacity, duration, calcTimes, sliderPrices),
      }))
      .sort((a, b) => b.bestRev - a.bestRev)
      .map((x, i) => ({ ...x, rank: i + 1 }));
  }, [capacity, duration, calcTimes, sliderPrices]);

  function toggleRegion(id: string) {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectTier(regionId: string, tierId: string) {
    setSelectedTierIds((prev) => ({ ...prev, [regionId]: tierId }));
  }

  function handleSliderChange(policyId: string, val: number) {
    setSliderPrices((prev) => ({ ...prev, [policyId]: val }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* ─── Left: params ─── */}
      <div className="lg:col-span-4 space-y-5">
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="size-3.5 text-slate-400" /> 聚合资源配置
          </h4>

          {/* Calc mode */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">测算口径</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => setCalcMode("annual")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isAnnual
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                年度收益
              </button>
              <button
                onClick={() => setCalcMode("single")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  !isAnnual
                    ? "bg-sky-50 text-sky-700 border-sky-200"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                单次收益
              </button>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 flex justify-between">
              <span>可聚合调节容量</span>
              <span className="text-rose-600 font-extrabold">{capacity.toLocaleString()} kW</span>
            </label>
            <input
              type="range"
              min="100"
              max="20000"
              step="100"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex gap-2">
              {[500, 1000, 5000, 10000].map((val) => (
                <button
                  key={val}
                  onClick={() => setCapacity(val)}
                  className={`flex-1 text-[10px] py-1 border rounded font-bold transition-all cursor-pointer ${
                    capacity === val
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {val >= 1000 ? `${val / 1000}千` : val}kW
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 flex justify-between">
              <span>单次响应时长</span>
              <span className="text-rose-600 font-extrabold">{duration} 小时</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>0.5h</span>
              <span>4h</span>
              <span>8h</span>
            </div>
          </div>

          {/* Times — annual only */}
          {isAnnual && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 flex justify-between">
                <span>年度预计响应次数</span>
                <span className="text-rose-600 font-extrabold">{times} 次/年</span>
              </label>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={times}
                onChange={(e) => setTimes(Number(e.target.value))}
                className="w-full accent-rose-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>1次</span>
                <span>30次</span>
                <span>60次</span>
              </div>
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <Info className="size-3.5 text-rose-500" /> 测算逻辑说明
          </div>
          <div className="text-[10px] text-slate-500 leading-relaxed space-y-1">
            <div>• 系统自动为每个地区选取<b>收益最高</b>的补贴档次</div>
            <div>• 年度口径叠加<b>容量补贴</b>（元/kW·月 × 12）</div>
            <div>• 单次口径仅计电量补贴，容量补贴按年结算不纳入</div>
            <div className="text-rose-500">• 仅供参考，实际以各地出清结果为准</div>
          </div>
        </div>
      </div>

      {/* ─── Right: ranked region cards ─── */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold text-slate-700">
            各地区{isAnnual ? "年度" : "单次"}收益潜力 · 按收益排序
          </h5>
          <span className="text-[10px] text-slate-400 font-bold">共 {PANEL_REGIONS.length} 个地区 · 点击卡片展开明细</span>
        </div>

        {/* Card list */}
        <div className="space-y-3">
          {sortedRegions.map(({ region, rank }) => (
            <RegionCard
              key={region.id}
              region={region}
              rank={rank}
              expanded={expandedRegions.has(region.id)}
              onToggle={() => toggleRegion(region.id)}
              capacity={capacity}
              duration={duration}
              times={calcTimes}
              selectedTierId={selectedTierIds[region.id] ?? null}
              sliderPrices={sliderPrices}
              onSelectTier={(tierId) => handleSelectTier(region.id, tierId)}
              onSliderChange={handleSliderChange}
            />
          ))}
        </div>

        {/* Disclaimer footer */}
        <div className="mt-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-400 leading-relaxed">
          以上为基于各地当前政策的估算值，实际收益以每次响应出清结果为准。部分地区价格通过竞价形成，此处按上限或中值估算。标注"叠加"表示该地区可同时获得电量补贴＋容量补贴。同一地区不同政策文件中的响应类型不可叠加，系统自动取收益最高的组合。
        </div>
      </div>
    </div>
  );
}

export default DemandResponsePanel;
