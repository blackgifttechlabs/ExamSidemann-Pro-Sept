import learningAiHandler, { config } from './[action]';

export { config };
export default function checkCodeHandler(req: any, res: any) {
  req.query = { ...(req.query || {}), action: 'check-code' };
  return learningAiHandler(req, res);
}
