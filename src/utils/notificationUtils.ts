interface EmailNotification {
  to: string;
  subject: string;
  body: string;
}

export const sendAdminNotification = async (notification: EmailNotification) => {
  try {
    // This would typically connect to your email service
    console.log("Sending admin notification:", notification);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    throw new Error("Failed to send notification");
  }
};