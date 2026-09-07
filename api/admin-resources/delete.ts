import adminResourceHandler, { config } from './[action]';

export { config };

export default function deleteResourceHandler(req: any, res: any) {
  req.query = { ...(req.query || {}), action: 'delete' };
  return adminResourceHandler(req, res);
}
