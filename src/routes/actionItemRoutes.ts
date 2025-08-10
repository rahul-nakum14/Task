import express from 'express';
import {
  createActionItem,
  updateActionItem,
  getActionItem,
  listActionItems
} from '../controllers/actionItemController';

const router = express.Router();

router.post('/action-items', createActionItem);
router.put('/action-items/:id', updateActionItem);
router.get('/action-items/:id', getActionItem);
router.get('/action-items', listActionItems);

export default router;
