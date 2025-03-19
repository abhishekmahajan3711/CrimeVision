import AlertReport from "../../models/common_models/report_crime.js";

export const get_Detail_Case = async (req, res) => {
  try {
    const { id } = req.query;

    // Find the alert report by ID
    const alert = await AlertReport.findById(id)
      .populate("UserID")
      .populate("PoliceStationID");

    // console.log(alert);

    if (!alert) {
      return res.status(404).json({ message: "Alert report not found" });
    }

    res.status(200).json(alert);
  } catch (error) {
    console.error("Error fetching case details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update Status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, logEntry } = req.body;

    const updatedAlert = await AlertReport.findByIdAndUpdate(
      id,
      {
        Status: status,
        $push: { ActivityLog: logEntry },
      },
      { new: true }
    );

    res.status(200).json(updatedAlert);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Update Priority
export const updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, logEntry } = req.body;

    const updatedAlert = await AlertReport.findByIdAndUpdate(
      id,
      {
        Priority: priority,
        $push: { ActivityLog: logEntry },
      },
      { new: true }
    );

    res.status(200).json(updatedAlert);
  } catch (error) {
    res.status(500).json({ message: "Error updating priority", error });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, logEntry } = req.body;

    const updatedAlert = await AlertReport.findByIdAndUpdate(
      id,
      {
        $push: { Comments: comment, ActivityLog: logEntry },
      },
      { new: true }
    );

    res.status(200).json(updatedAlert);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};
