import learningAiHandler, { config } from './[action]';

export { config };
export default function chatHandler(req: any, res: any) {
  req.query = { ...(req.query || {}), action: 'chat' };
  return learningAiHandler(req, res);
}
