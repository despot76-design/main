const clamp=n=>Math.max(0,Math.min(100,n));
const norm=(v,min,max)=>v===null||v===undefined?null:clamp((v-min)/(max-min)*100);
const weighted=(pairs)=>{
  let sum=0,w=0;
  for(const [value,weight] of pairs){if(value===null||value===undefined||Number.isNaN(value))continue;sum+=value*weight;w+=weight;}
  return w?Math.round(sum/w*10)/10:null;
};

export function performanceScore(laptop){
  return weighted([
    [laptop.cpu.overallScore,0.48],
    [laptop.gpu.score,0.25],
    [norm(laptop.memory.gb,8,64),0.12],
    [norm(laptop.storage.gb,256,2048),0.05],
    [laptop.display.refreshHz?norm(laptop.display.refreshHz,60,240):null,0.05],
    [laptop.display.brightnessNits?norm(laptop.display.brightnessNits,250,600):null,0.05]
  ]);
}

export function portabilityScore(laptop){
  const weight=laptop.mobility.weightKg;
  const battery=laptop.mobility.batteryWh;
  const weightScore=weight===null?null:clamp((2.5-weight)/(2.5-0.9)*100);
  const batteryScore=battery===null?null:norm(battery,40,100);
  return weighted([[weightScore,0.65],[batteryScore,0.35]]);
}

export function freshnessScore(laptop,currentYear=new Date().getFullYear()){
  const year=laptop.cpu.launchYear;
  if(!year)return null;
  const age=Math.max(0,currentYear-year);
  return clamp(100-age*22);
}

export function valueScore(laptop,{useWow=true,currentYear=new Date().getFullYear()}={}){
  const price=(useWow&&laptop.price.wow)||laptop.price.normal;
  if(!price)return null;
  const perf=performanceScore(laptop);
  if(perf===null)return null;
  const fresh=freshnessScore(laptop,currentYear);
  const port=portabilityScore(laptop);
  const pricePenalty=clamp(100-(price/3000000)*100);
  return weighted([[perf,0.5],[fresh,0.15],[port,0.1],[pricePenalty,0.25]]);
}

export function scoreLaptop(laptop,opts={}){
  return {
    performance:performanceScore(laptop),
    portability:portabilityScore(laptop),
    freshness:freshnessScore(laptop,opts.currentYear),
    value:valueScore(laptop,opts)
  };
}

// v0 scoring is provisional. Once real Coupang samples arrive, weights and normalization
// ranges must be recalibrated from observed market distributions rather than hard-coded guesses.
