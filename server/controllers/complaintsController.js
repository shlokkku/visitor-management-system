const Complaint = require('../models/Complaint');
const { getUserById } = require('../models/User.mysql');
const { getResidentByUserId } = require('../models/Resident.mysql');

// 1. Resident creates a complaint
exports.createComplaint = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user || user.user_type !== 'Resident') {
      return res.status(403).json({ message: "Only residents can create complaints." });
    }
    const resident = await getResidentByUserId(user.id);
    if (!resident) {
      return res.status(400).json({ message: "Resident profile not found." });
    }
    const { title, description, category, priority } = req.body;
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      residentUserId: user.id,
      residentName: resident.full_name,
      residentRole: resident.role,
      flatId: resident.flatId,
      wing: resident.wing,
      flat_number: resident.flat_number
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Error creating complaint", error: err.message });
  }
};

// 2. Resident sees their own complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user || user.user_type !== 'Resident') {
      return res.status(403).json({ message: "Only residents can view their complaints." });
    }
    const complaints = await Complaint.find({ residentUserId: user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints", error: err.message });
  }
};

// 3. Admin: get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user || user.user_type !== 'Admin') {
      return res.status(403).json({ message: "Only admins can view all complaints." });
    }
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints", error: err.message });
  }
};

// 4. Get complaint detail 
exports.getComplaintDetail = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (user.user_type === 'Admin' || (user.user_type === 'Resident' && complaint.residentUserId === user.id)) {
      res.json(complaint);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaint", error: err.message });
  }
};

// 5. Add comment 
exports.addComment = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (
      user.user_type === 'Admin' ||
      (user.user_type === 'Resident' && complaint.residentUserId === user.id)
    ) {
      let role = null;
      if (user.user_type === 'Resident') {
        const resident = await getResidentByUserId(user.id);
        role = resident.role;
      }
      const { text } = req.body;
      const comment = {
        text,
        authorUserId: user.id,
        authorUserType: user.user_type,
        authorName: user.user_type === 'Admin' ? 'Admin' : (await getResidentByUserId(user.id)).full_name,
        authorRole: role,
        createdAt: new Date()
      };
      complaint.comments.push(comment);
      complaint.updatedAt = new Date();
      await complaint.save();
      res.json(comment);
    } else {
      return res.status(403).json({ message: "Not allowed to comment." });
    }
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

// 6. Add attachment
exports.addAttachment = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (
      user.user_type === 'Admin' ||
      (user.user_type === 'Resident' && complaint.residentUserId === user.id)
    ) {
      const file = req.file;
      complaint.attachments.push({
        url: `/uploads/${file.filename}`,
        name: file.originalname,
        type: file.mimetype
      });
      complaint.updatedAt = new Date();
      await complaint.save();
      res.json(complaint.attachments);
    } else {
      return res.status(403).json({ message: "Not allowed to add attachment." });
    }
  } catch (err) {
    res.status(500).json({ message: "Error adding attachment", error: err.message });
  }
};

// 7. Admin only: update status
exports.updateStatus = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user || user.user_type !== 'Admin') {
      return res.status(403).json({ message: "Only admins can update status." });
    }
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    complaint.status = status;
    complaint.updatedAt = new Date();
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// 8. Admin only: assign complaint to admin
exports.assignTo = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user || user.user_type !== 'Admin') {
      return res.status(403).json({ message: "Only admins can assign complaints." });
    }
    const { assignedToUserId } = req.body;
    const assignedToUser = await getUserById(assignedToUserId);
    if (!assignedToUser || assignedToUser.user_type !== 'Admin') {
      return res.status(400).json({ message: "Assigned user must be an admin." });
    }
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    complaint.assignedToUserId = assignedToUser.id;
    complaint.assignedToName = assignedToUser.full_name;
    complaint.updatedAt = new Date();
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Error assigning", error: err.message });
  }
};