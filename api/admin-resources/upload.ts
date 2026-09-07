import adminResourceHandler, { config } from './[action]';

export { config };

export default function uploadResourceHandler(req: any, res: any) {
  req.query = { ...(req.query || {}), action: 'upload' };
  return adminResourceHandler(req, res);
}
