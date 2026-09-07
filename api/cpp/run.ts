import { hostedCompilerHandler } from '../../server/hostedCompiler';
export const config = { maxDuration: 60 };
export default hostedCompilerHandler('cpp');
