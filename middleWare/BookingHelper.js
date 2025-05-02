import axios from "axios";

export const sendSMS = async ({ num, msg }) => {
  const auth = "CRM-ABDULAHAD";
  // const num = "03228042703"; // Default phone number if not provided

  try {
    const response = await axios.get(`https://senlogix.duckdns.org/send-message`, {
      params: {
        num,
        msg,
        auth,
      },
    });

    console.log("SMS sent:", response.data);
  } catch (error) {
    console.error("SMS sending error:", error.response?.data || error.message);
  }
};
