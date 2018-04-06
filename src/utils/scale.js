import { scale } from './typography';

const scaleSC = num =>
  Object.entries(scale(num))
    .map(([k, v]) => `${k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}: ${v}`)
    .join('\n');

export { scaleSC };
