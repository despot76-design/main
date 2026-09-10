import { latestness } from '../lib/cpu-latestness.mjs';

const samples = [
  'Intel Core Ultra X9 388H',
  'Intel Core Ultra 7 258V',
  'Intel Core Ultra 7 155H',
  'AMD Ryzen AI 9 HX 475',
  'AMD Ryzen AI 9 HX 370',
  'AMD Ryzen 7 8840HS',
  'Snapdragon X2 Elite Extreme',
  'Snapdragon X Elite',
  'Apple M5 Max',
  'Apple M4 Pro',
  'Intel Core i7'
];

for (const cpu of samples) {
  console.log(cpu, '=>', latestness(cpu));
}
