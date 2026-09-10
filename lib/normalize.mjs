const toNumber=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/[^0-9.]/g,''));return Number.isFinite(n)?n:null;};
const clean=v=>v===null||v===undefined?null:String(v).trim()||null;

export function normalizeLaptop(raw={}){
  return {
    source: clean(raw.source)||'coupang',
    sourceProductId: clean(raw.sourceProductId||raw.productId),
    sourceItemId: clean(raw.sourceItemId||raw.itemId),
    sourceUrl: clean(raw.sourceUrl||raw.productUrl),
    affiliateUrl: clean(raw.affiliateUrl),
    imageUrl: clean(raw.imageUrl),
    title: clean(raw.title||raw.productName),
    brand: clean(raw.brand),
    model: clean(raw.model||raw.modelNumber),
    cpu: {
      family: clean(raw.cpuFamily),
      model: clean(raw.cpuModel),
      launchYear: toNumber(raw.cpuLaunchYear),
      generationLabel: clean(raw.cpuGenerationLabel),
      singleScore: toNumber(raw.cpuSingleScore),
      multiScore: toNumber(raw.cpuMultiScore),
      overallScore: toNumber(raw.cpuOverallScore),
      npu: clean(raw.npu)
    },
    gpu: {
      model: clean(raw.gpuModel),
      score: toNumber(raw.gpuScore)
    },
    memory: {
      gb: toNumber(raw.ramGb||raw.ram),
      type: clean(raw.ramType),
      expandable: raw.ramExpandable===true?true:raw.ramExpandable===false?false:null
    },
    storage: {
      gb: toNumber(raw.ssdGb||raw.ssd),
      expandable: raw.ssdExpandable===true?true:raw.ssdExpandable===false?false:null
    },
    display: {
      inches: toNumber(raw.displayInches),
      panel: clean(raw.panel),
      resolution: clean(raw.resolution),
      brightnessNits: toNumber(raw.brightnessNits),
      refreshHz: toNumber(raw.refreshHz),
      colorGamut: clean(raw.colorGamut)
    },
    mobility: {
      weightKg: toNumber(raw.weightKg),
      batteryWh: toNumber(raw.batteryWh)
    },
    connectivity: {
      ports: clean(raw.ports),
      wifi: clean(raw.wifi)
    },
    os: clean(raw.os),
    price: {
      normal: toNumber(raw.normalPrice),
      wow: toNumber(raw.wowPrice),
      wowType: clean(raw.wowType),
      coupon: toNumber(raw.couponPrice),
      card: toNumber(raw.cardPrice)
    },
    collectedAt: clean(raw.collectedAt)||new Date().toISOString(),
    fieldSources: raw.fieldSources&&typeof raw.fieldSources==='object'?raw.fieldSources:{}
  };
}

export function completeness(record){
  const checks={
    title:record.title,model:record.model,cpuModel:record.cpu.model,ram:record.memory.gb,ssd:record.storage.gb,
    gpu:record.gpu.model,display:record.display.inches,resolution:record.display.resolution,weight:record.mobility.weightKg,
    battery:record.mobility.batteryWh,os:record.os,normalPrice:record.price.normal,wowPrice:record.price.wow
  };
  const entries=Object.entries(checks).map(([field,value])=>({field,available:value!==null&&value!==undefined&&value!==''}));
  const available=entries.filter(x=>x.available).length;
  return {available,total:entries.length,rate:Math.round(available/entries.length*1000)/10,fields:entries};
}
