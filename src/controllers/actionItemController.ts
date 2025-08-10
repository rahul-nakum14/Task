import { Request, Response } from 'express';
import ActionItemMaster from '../models/ActionItemMaster';
import ActionItemDealerMapping from '../models/ActionItemDealerMapping';
import ActionItemKPIMapping from '../models/ActionItemKPIMapping';
import User from '../models/User';
import { sendActionItemEmail } from '../utils/email';
import mongoose from 'mongoose';

function getRandomKPINames(kpiIds: string[]) {
  return kpiIds.map(kpiId => `KPI_Name_for_${kpiId}`);
}

export async function createActionItem(req: Request, res: Response) {
  try {
    const {
      UserID,
      State,
      TargetDate,
      IncludeDealer,
      DealerIDs,
      Description,
      KPIIDs,
      Comment,
      CreatedBy
    } = req.body;

    if (!State || !TargetDate || !Description || !CreatedBy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newActionItem = new ActionItemMaster({
      UserID: UserID || null,
      State,
      TargetDate: new Date(TargetDate),
      Description,
      Comment,
      CreatedDate: new Date(),
      CreatedBy
    });
    await newActionItem.save();

    if (IncludeDealer && DealerIDs && DealerIDs.length > 0) {
      const dealerMappings = DealerIDs.map((dealerId: string) => ({
        ActionID: newActionItem._id,
        DealerID: dealerId,
        CreatedDate: new Date(),
        CreatedBy
      }));
      await ActionItemDealerMapping.insertMany(dealerMappings);
    }

    if (KPIIDs && KPIIDs.length > 0) {
      const kpiMappings = KPIIDs.map((kpiId: string) => ({
        ActionID: newActionItem._id,
        KPIID: kpiId,
        CreatedDate: new Date(),
        CreatedBy
      }));
      await ActionItemKPIMapping.insertMany(kpiMappings);
    }

    console.log('userID',UserID);
    
    if (UserID) {
      const user = await User.findOne({ UserID });
      if (user) {
        const kpiNames = getRandomKPINames(KPIIDs || []);
        const dealersText = (IncludeDealer && DealerIDs && DealerIDs.length > 0) ? DealerIDs.join(', ') : 'None';

        const emailHtml = `
          <h3>New Action Item Assigned</h3>
          <p><b>Description:</b> ${Description}</p>
          <p><b>Target Date:</b> ${new Date(TargetDate).toDateString()}</p>
          <p><b>State:</b> ${State}</p>
          <p><b>Dealers Assigned:</b> ${dealersText}</p>
          <p><b>KPI Names:</b> ${kpiNames.join(', ')}</p>
          <p><b>Comments:</b> ${Comment || 'None'}</p>
        `;

        console.log('uer.email',user.Email);
        
        await sendActionItemEmail(user.Email, 'New Action Item Assigned', emailHtml);
      }
    }

    res.status(201).json({ success: true, ActionID: newActionItem._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateActionItem(req: Request, res: Response) {
  try {
    const actionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(actionId)) {
      return res.status(400).json({ message: 'Invalid ActionID' });
    }

    const {
      UserID,
      State,
      TargetDate,
      IncludeDealer,
      DealerIDs,
      Description,
      KPIIDs,
      Comment,
      UpdatedBy
    } = req.body;

    if (!State || !TargetDate || !Description || !UpdatedBy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const actionItem = await ActionItemMaster.findById(actionId);
    if (!actionItem) {
      return res.status(404).json({ message: 'Action item not found' });
    }

    const oldUserID = actionItem.UserID;

    actionItem.UserID = UserID || null;
    actionItem.State = State;
    actionItem.TargetDate = new Date(TargetDate);
    actionItem.Description = Description;
    actionItem.Comment = Comment;
    actionItem.UpdatedDate = new Date();
    actionItem.UpdatedBy = UpdatedBy;
    await actionItem.save();

    // Replace dealer mappings
    await ActionItemDealerMapping.deleteMany({ ActionID: actionId });
    if (IncludeDealer && DealerIDs && DealerIDs.length > 0) {
      const dealerMappings = DealerIDs.map((dealerId: string) => ({
        ActionID: actionId,
        DealerID: dealerId,
        CreatedDate: new Date(),
        CreatedBy: UpdatedBy
      }));
      await ActionItemDealerMapping.insertMany(dealerMappings);
    }

    await ActionItemKPIMapping.deleteMany({ ActionID: actionId });
    if (KPIIDs && KPIIDs.length > 0) {
      const kpiMappings = KPIIDs.map((kpiId: string) => ({
        ActionID: actionId,
        KPIID: kpiId,
        CreatedDate: new Date(),
        CreatedBy: UpdatedBy
      }));
      await ActionItemKPIMapping.insertMany(kpiMappings);
    }

    if (UserID && UserID !== oldUserID) {
      const user = await User.findOne({ UserID });
      if (user) {
        const kpiNames = getRandomKPINames(KPIIDs || []);
        const dealersText = (IncludeDealer && DealerIDs && DealerIDs.length > 0) ? DealerIDs.join(', ') : 'None';

        const emailHtml = `
          <h3>Action Item Updated & Assigned to You</h3>
          <p><b>Description:</b> ${Description}</p>
          <p><b>Target Date:</b> ${new Date(TargetDate).toDateString()}</p>
          <p><b>State:</b> ${State}</p>
          <p><b>Dealers Assigned:</b> ${dealersText}</p>
          <p><b>KPI Names:</b> ${kpiNames.join(', ')}</p>
          <p><b>Comments:</b> ${Comment || 'None'}</p>
        `;

        await sendActionItemEmail(user.Email, 'Action Item Updated & Assigned', emailHtml);
      }
    }

    res.json({ success: true, ActionID: actionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getActionItem(req: Request, res: Response) {
  try {
    const actionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(actionId)) {
      return res.status(400).json({ message: 'Invalid ActionID' });
    }

    const actionItem = await ActionItemMaster.findById(actionId).lean();
    if (!actionItem) {
      return res.status(404).json({ message: 'Action item not found' });
    }

    const dealerMappings = await ActionItemDealerMapping.find({ ActionID: actionId }).lean();
    const kpiMappings = await ActionItemKPIMapping.find({ ActionID: actionId }).lean();

    const kpiIds = kpiMappings.map(k => k.KPIID);
    const kpiNames = getRandomKPINames(kpiIds);

    res.json({
      ...actionItem,
      DealerIDs: dealerMappings.map(d => d.DealerID),
      KPIIDs: kpiIds,
      KPINames: kpiNames
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function listActionItems(req: Request, res: Response) {
  try {
    const { state, dealerId, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (state) filter.State = state;
    if (startDate || endDate) {
      filter.TargetDate = {};
      if (startDate) filter.TargetDate.$gte = new Date(startDate as string);
      if (endDate) filter.TargetDate.$lte = new Date(endDate as string);
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    let actionIdsFilter: string[] | null = null;

    if (dealerId) {
      const mappings = await ActionItemDealerMapping.find({ DealerID: dealerId as string }).select('ActionID').lean();
      actionIdsFilter = mappings.map(m => m.ActionID.toString());
      if (actionIdsFilter.length === 0) {
        return res.json({
          page: pageNumber,
          limit: limitNumber,
          total: 0,
          data: []
        });
      }
    }

    const finalFilter = actionIdsFilter
      ? { ...filter, _id: { $in: actionIdsFilter } }
      : filter;

    const total = await ActionItemMaster.countDocuments(finalFilter);
    const actionItems = await ActionItemMaster.find(finalFilter)
      .sort({ CreatedDate: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    const results = await Promise.all(
      actionItems.map(async (item) => {
        const dealers = await ActionItemDealerMapping.find({ ActionID: item._id }).lean();
        const kpis = await ActionItemKPIMapping.find({ ActionID: item._id }).lean();
        const kpiIds = kpis.map(k => k.KPIID);
        const kpiNames = getRandomKPINames(kpiIds);

        return {
          ...item,
          DealerIDs: dealers.map(d => d.DealerID),
          KPIIDs: kpiIds,
          KPINames: kpiNames
        };
      })
    );

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total,
      data: results
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
