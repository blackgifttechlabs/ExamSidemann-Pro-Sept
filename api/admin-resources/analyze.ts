import adminResourceHandler, { config } from './[action]';

export { config };

export default function analyzeResourceHandler(req: any, res: any) {
  req.query = { ...(req.query || {}), action: 'analyze' };
  return adminResourceHandler(req, res);
}
